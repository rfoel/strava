import { describe, expect, it } from 'vitest'

import { StravaApiError } from '../src/errors'
import { OAuth } from '../src/oauth'

import { mockFetch, mockResponse } from './helpers'

describe('OAuth', () => {
  it('builds authorize URL with all params', () => {
    const url = new OAuth().authorizeUrl({
      client_id: 'cid',
      redirect_uri: 'https://app/cb',
      scope: ['read', 'activity:read_all'],
      state: 'csrf',
      approval_prompt: 'force',
    })
    const parsed = new URL(url)
    expect(parsed.origin + parsed.pathname).toBe(
      'https://www.strava.com/oauth/authorize',
    )
    expect(parsed.searchParams.get('client_id')).toBe('cid')
    expect(parsed.searchParams.get('redirect_uri')).toBe('https://app/cb')
    expect(parsed.searchParams.get('response_type')).toBe('code')
    expect(parsed.searchParams.get('scope')).toBe('read,activity:read_all')
    expect(parsed.searchParams.get('state')).toBe('csrf')
    expect(parsed.searchParams.get('approval_prompt')).toBe('force')
  })

  it('omits state when not provided and defaults approval_prompt', () => {
    const url = new OAuth().authorizeUrl({
      client_id: 'cid',
      redirect_uri: 'https://app/cb',
      scope: ['read'],
    })
    const parsed = new URL(url)
    expect(parsed.searchParams.has('state')).toBe(false)
    expect(parsed.searchParams.get('approval_prompt')).toBe('auto')
  })

  it('exchanges authorization code', async () => {
    const fetchImpl = mockFetch(async () =>
      mockResponse({
        body: {
          access_token: 'a',
          refresh_token: 'r',
          expires_at: 1,
          expires_in: 3600,
          token_type: 'Bearer',
          athlete: { id: 42 },
        },
      }),
    )
    const oauth = new OAuth(fetchImpl)
    const token = await oauth.exchange({
      client_id: 'cid',
      client_secret: 'sec',
      code: 'abc',
    })
    expect(token.access_token).toBe('a')
    expect(token.athlete?.id).toBe(42)

    const [url, init] = fetchImpl.mock.calls[0]
    expect(url).toBe('https://www.strava.com/oauth/token')
    expect(init?.method).toBe('POST')
    const body = (init?.body as URLSearchParams).toString()
    expect(body).toContain('grant_type=authorization_code')
    expect(body).toContain('code=abc')
    expect(body).toContain('client_id=cid')
  })

  it('refreshes tokens', async () => {
    const fetchImpl = mockFetch(async () =>
      mockResponse({
        body: {
          access_token: 'a2',
          refresh_token: 'r2',
          expires_at: 1,
          expires_in: 3600,
          token_type: 'Bearer',
        },
      }),
    )
    const oauth = new OAuth(fetchImpl)
    const token = await oauth.refresh({
      client_id: 'cid',
      client_secret: 'sec',
      refresh_token: 'r',
    })
    expect(token.access_token).toBe('a2')
    const body = (fetchImpl.mock.calls[0][1]?.body as URLSearchParams).toString()
    expect(body).toContain('grant_type=refresh_token')
    expect(body).toContain('refresh_token=r')
  })

  it('throws StravaApiError on non-2xx', async () => {
    const fetchImpl = mockFetch(async () =>
      mockResponse({
        status: 400,
        statusText: 'Bad Request',
        body: 'invalid grant',
        bodyAs: 'text',
      }),
    )
    const oauth = new OAuth(fetchImpl)
    await expect(
      oauth.exchange({ client_id: 'c', client_secret: 's', code: 'x' }),
    ).rejects.toBeInstanceOf(StravaApiError)
  })

  it('deauthorize sends bearer token', async () => {
    const fetchImpl = mockFetch(async () => mockResponse({ status: 200 }))
    const oauth = new OAuth(fetchImpl)
    await oauth.deauthorize({ access_token: 'tok' })
    const [url, init] = fetchImpl.mock.calls[0]
    expect(url).toBe('https://www.strava.com/oauth/deauthorize')
    expect((init?.headers as Record<string, string>).Authorization).toBe(
      'Bearer tok',
    )
  })
})
