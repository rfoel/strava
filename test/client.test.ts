import { describe, expect, it, vi } from 'vitest'

import {
  HttpClient,
  RateLimitTracker,
  TokenManager,
  buildClient,
} from '../src/client'
import { StravaApiError } from '../src/errors'
import { OAuth } from '../src/oauth'

import { mockFetch, mockResponse, nextSecond } from './helpers'

const baseConfig = { client_id: 'cid', client_secret: 'csecret' }

describe('TokenManager', () => {
  it('returns cached token while within expiry buffer', async () => {
    const oauth = new OAuth()
    const refresh = vi
      .spyOn(oauth, 'refresh')
      .mockRejectedValue(new Error('should not be called'))
    const tokens = new TokenManager(
      {
        ...baseConfig,
        access_token: {
          access_token: 'cached',
          refresh_token: 'r',
          expires_at: nextSecond(3600),
        },
      },
      oauth,
    )

    expect(await tokens.getAccessToken()).toBe('cached')
    expect(refresh).not.toHaveBeenCalled()
  })

  it('refreshes when token expires within buffer', async () => {
    const oauth = new OAuth()
    vi.spyOn(oauth, 'refresh').mockResolvedValue({
      access_token: 'fresh',
      refresh_token: 'r2',
      expires_at: nextSecond(3600),
      expires_in: 3600,
      token_type: 'Bearer',
    })
    const onRefresh = vi.fn()
    const tokens = new TokenManager(
      {
        ...baseConfig,
        access_token: {
          access_token: 'expiring',
          refresh_token: 'r1',
          expires_at: nextSecond(60),
        },
        on_token_refresh: onRefresh,
      },
      oauth,
    )

    expect(await tokens.getAccessToken()).toBe('fresh')
    expect(onRefresh).toHaveBeenCalledOnce()
    expect(onRefresh.mock.calls[0][0].access_token).toBe('fresh')
  })

  it('deduplicates concurrent refresh requests', async () => {
    const oauth = new OAuth()
    let resolveRefresh!: () => void
    const refreshPromise = new Promise<void>((r) => {
      resolveRefresh = r
    })
    const refresh = vi.spyOn(oauth, 'refresh').mockImplementation(async () => {
      await refreshPromise
      return {
        access_token: 'fresh',
        refresh_token: 'r',
        expires_at: nextSecond(3600),
        expires_in: 3600,
        token_type: 'Bearer',
      }
    })
    const tokens = new TokenManager(
      { ...baseConfig, refresh_token: 'r' },
      oauth,
    )

    const results = Promise.all([
      tokens.getAccessToken(),
      tokens.getAccessToken(),
      tokens.getAccessToken(),
    ])
    resolveRefresh()
    expect(await results).toEqual(['fresh', 'fresh', 'fresh'])
    expect(refresh).toHaveBeenCalledOnce()
  })

  it('throws when no refresh token is available', async () => {
    const oauth = new OAuth()
    const tokens = new TokenManager({ ...baseConfig }, oauth)
    await expect(tokens.getAccessToken()).rejects.toThrow(/No refresh_token/)
  })
})

describe('RateLimitTracker', () => {
  it('parses limit + usage headers and invokes callback', () => {
    const onUpdate = vi.fn()
    const tracker = new RateLimitTracker(onUpdate)
    tracker.update(
      new Headers({
        'x-ratelimit-limit': '200,2000',
        'x-ratelimit-usage': '10,150',
      }),
    )
    const rl = tracker.get()
    expect(rl).toMatchObject({
      shortTermLimit: 200,
      longTermLimit: 2000,
      shortTermUsage: 10,
      longTermUsage: 150,
    })
    expect(typeof rl?.timestamp).toBe('number')
    expect(onUpdate).toHaveBeenCalledOnce()
  })

  it('ignores responses without rate-limit headers', () => {
    const onUpdate = vi.fn()
    const tracker = new RateLimitTracker(onUpdate)
    tracker.update(new Headers())
    expect(tracker.get()).toBeUndefined()
    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('ignores malformed headers', () => {
    const tracker = new RateLimitTracker()
    tracker.update(
      new Headers({
        'x-ratelimit-limit': 'broken',
        'x-ratelimit-usage': '10,20',
      }),
    )
    expect(tracker.get()).toBeUndefined()
  })
})

describe('HttpClient', () => {
  function build({
    fetchImpl,
    token = 'tok',
  }: {
    fetchImpl: typeof fetch
    token?: string
  }) {
    const oauth = new OAuth(fetchImpl)
    const tokens = new TokenManager(
      {
        ...baseConfig,
        access_token: {
          access_token: token,
          refresh_token: 'r',
          expires_at: nextSecond(3600),
        },
      },
      oauth,
    )
    const rateLimit = new RateLimitTracker()
    return new HttpClient(
      'https://www.strava.com/api/v3',
      fetchImpl,
      tokens,
      rateLimit,
    )
  }

  it('injects bearer auth and builds query string', async () => {
    const fetchImpl = mockFetch(async () => mockResponse({ body: { id: 1 } }))
    const client = build({ fetchImpl })
    const result = await client.request<{ id: number }>('GET', '/foo', {
      query: { a: 1, b: ['x', 'y'], skip: undefined },
    })
    expect(result).toEqual({ id: 1 })
    const [url, init] = fetchImpl.mock.calls[0]
    expect(url).toBe('https://www.strava.com/api/v3/foo?a=1&b=x%2Cy')
    expect((init?.headers as Headers).get('Authorization')).toBe('Bearer tok')
  })

  it('serializes JSON body with content-type', async () => {
    const fetchImpl = mockFetch(async () => mockResponse({ body: {} }))
    const client = build({ fetchImpl })
    await client.request('PUT', '/x', { body: { name: 'go' } })
    const init = fetchImpl.mock.calls[0][1]!
    expect((init.headers as Headers).get('Content-Type')).toBe(
      'application/json',
    )
    expect(init.body).toBe('{"name":"go"}')
  })

  it('serializes form-urlencoded body', async () => {
    const fetchImpl = mockFetch(async () => mockResponse({ body: {} }))
    const client = build({ fetchImpl })
    await client.request('POST', '/x', {
      body: { name: 'go', skip: null },
      bodyFormat: 'form',
    })
    const init = fetchImpl.mock.calls[0][1]!
    expect((init.headers as Headers).get('Content-Type')).toBe(
      'application/x-www-form-urlencoded',
    )
    expect((init.body as URLSearchParams).toString()).toBe('name=go')
  })

  it('passes FormData through for multipart', async () => {
    const fetchImpl = mockFetch(async () => mockResponse({ body: {} }))
    const client = build({ fetchImpl })
    const form = new FormData()
    form.append('name', 'val')
    await client.request('POST', '/x', { body: form, bodyFormat: 'multipart' })
    const init = fetchImpl.mock.calls[0][1]!
    expect(init.body).toBe(form)
    expect((init.headers as Headers).get('Content-Type')).toBeNull()
  })

  it('returns text when parseAs is text', async () => {
    const fetchImpl = mockFetch(async () =>
      mockResponse({
        body: '<gpx></gpx>',
        headers: { 'content-type': 'application/gpx+xml' },
      }),
    )
    const client = build({ fetchImpl })
    const result = await client.request<string>('GET', '/x', {
      parseAs: 'text',
    })
    expect(result).toBe('<gpx></gpx>')
  })

  it('returns undefined for 204', async () => {
    const fetchImpl = mockFetch(async () => mockResponse({ status: 204 }))
    const client = build({ fetchImpl })
    const result = await client.request('DELETE', '/x')
    expect(result).toBeUndefined()
  })

  it('wraps JSON error responses in StravaApiError', async () => {
    const fetchImpl = mockFetch(async () =>
      mockResponse({
        status: 401,
        statusText: 'Unauthorized',
        body: { message: 'Authorization Error', errors: [] },
      }),
    )
    const client = build({ fetchImpl })
    await expect(
      client.request('GET', '/x'),
    ).rejects.toBeInstanceOf(StravaApiError)
    try {
      await client.request('GET', '/x')
    } catch (e) {
      const err = e as StravaApiError
      expect(err.status).toBe(401)
      expect(err.statusText).toBe('Unauthorized')
      expect(err.data).toMatchObject({ message: 'Authorization Error' })
    }
  })

  it('wraps text error responses in StravaApiError', async () => {
    const fetchImpl = mockFetch(async () =>
      mockResponse({
        status: 500,
        statusText: 'Server Error',
        body: 'gateway timeout',
        bodyAs: 'text',
      }),
    )
    const client = build({ fetchImpl })
    try {
      await client.request('GET', '/x')
      throw new Error('did not throw')
    } catch (e) {
      const err = e as StravaApiError
      expect(err.status).toBe(500)
      expect(err.data).toBe('gateway timeout')
    }
  })

  it('updates rate limit from response headers', async () => {
    const fetchImpl = mockFetch(async () =>
      mockResponse({
        body: {},
        headers: {
          'x-ratelimit-limit': '200,2000',
          'x-ratelimit-usage': '5,50',
        },
      }),
    )
    const built = buildClient({
      ...baseConfig,
      access_token: {
        access_token: 'tok',
        refresh_token: 'r',
        expires_at: nextSecond(3600),
      },
      fetch: fetchImpl,
    })
    await built.http.request('GET', '/x')
    expect(built.rateLimit.get()).toMatchObject({
      shortTermLimit: 200,
      shortTermUsage: 5,
    })
  })

  it('allows per-call accessToken override (skips refresh)', async () => {
    const fetchImpl = mockFetch(async () => mockResponse({ body: {} }))
    const oauth = new OAuth(fetchImpl)
    const refresh = vi
      .spyOn(oauth, 'refresh')
      .mockRejectedValue(new Error('should not refresh'))
    const tokens = new TokenManager({ ...baseConfig }, oauth)
    const client = new HttpClient(
      'https://www.strava.com/api/v3',
      fetchImpl,
      tokens,
      new RateLimitTracker(),
    )
    await client.request('GET', '/x', { accessToken: 'override' })
    expect(refresh).not.toHaveBeenCalled()
    const init = fetchImpl.mock.calls[0][1]!
    expect((init.headers as Headers).get('Authorization')).toBe(
      'Bearer override',
    )
  })
})
