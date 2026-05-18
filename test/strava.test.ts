import { describe, expect, it, vi } from 'vitest'

import { Strava } from '../src/strava'

import { mockFetch, mockResponse, nextSecond } from './helpers'

const baseConfig = {
  client_id: 'cid',
  client_secret: 'csecret',
  access_token: {
    access_token: 'tok',
    refresh_token: 'r',
    expires_at: nextSecond(3600),
  },
}

describe('Strava resources', () => {
  it('getActivityById hits correct path with query', async () => {
    const fetchImpl = mockFetch(async () =>
      mockResponse({ body: { id: 1, name: 'Ride' } }),
    )
    const strava = new Strava({ ...baseConfig, fetch: fetchImpl })
    const activity = await strava.activities.getActivityById(1, {
      include_all_efforts: true,
    })
    expect(activity).toEqual({ id: 1, name: 'Ride' })
    const [url, init] = fetchImpl.mock.calls[0]
    expect(url).toBe(
      'https://www.strava.com/api/v3/activities/1?include_all_efforts=true',
    )
    expect(init?.method).toBe('GET')
  })

  it('createActivity sends form-urlencoded body', async () => {
    const fetchImpl = mockFetch(async () => mockResponse({ body: { id: 9 } }))
    const strava = new Strava({ ...baseConfig, fetch: fetchImpl })
    await strava.activities.createActivity({
      name: 'Morning',
      sport_type: 'Run',
      start_date_local: '2026-01-01T07:00:00Z',
      elapsed_time: 3600,
    })
    const init = fetchImpl.mock.calls[0][1]!
    expect((init.headers as Headers).get('Content-Type')).toBe(
      'application/x-www-form-urlencoded',
    )
    const body = (init.body as URLSearchParams).toString()
    expect(body).toContain('name=Morning')
    expect(body).toContain('sport_type=Run')
    expect(body).toContain('elapsed_time=3600')
  })

  it('updateActivityById uses JSON body', async () => {
    const fetchImpl = mockFetch(async () => mockResponse({ body: { id: 1 } }))
    const strava = new Strava({ ...baseConfig, fetch: fetchImpl })
    await strava.activities.updateActivityById(1, {
      name: 'Renamed',
      commute: true,
    })
    const init = fetchImpl.mock.calls[0][1]!
    expect(init.method).toBe('PUT')
    expect((init.headers as Headers).get('Content-Type')).toBe(
      'application/json',
    )
    expect(JSON.parse(init.body as string)).toEqual({
      name: 'Renamed',
      commute: true,
    })
  })

  it('starSegment posts starred=true as form body', async () => {
    const fetchImpl = mockFetch(async () => mockResponse({ body: { id: 5 } }))
    const strava = new Strava({ ...baseConfig, fetch: fetchImpl })
    await strava.segments.starSegment(5, true)
    const [url, init] = fetchImpl.mock.calls[0]
    expect(url).toBe('https://www.strava.com/api/v3/segments/5/starred')
    expect(init?.method).toBe('PUT')
    expect((init?.body as URLSearchParams).toString()).toBe('starred=true')
  })

  it('uploads.createUpload posts multipart form', async () => {
    const fetchImpl = mockFetch(async () =>
      mockResponse({ body: { id: 99, status: 'pending' } }),
    )
    const strava = new Strava({ ...baseConfig, fetch: fetchImpl })
    const file = new Blob(['hello'])
    await strava.uploads.createUpload({
      file,
      data_type: 'fit',
      name: 'Ride',
    })
    const init = fetchImpl.mock.calls[0][1]!
    expect(init.body).toBeInstanceOf(FormData)
    const form = init.body as FormData
    expect(form.get('data_type')).toBe('fit')
    expect(form.get('name')).toBe('Ride')
    expect(form.get('file')).toBeInstanceOf(Blob)
  })

  it('streams.getActivityStreams sends keys + key_by_type=true', async () => {
    const fetchImpl = mockFetch(async () => mockResponse({ body: {} }))
    const strava = new Strava({ ...baseConfig, fetch: fetchImpl })
    await strava.streams.getActivityStreams(1, ['time', 'heartrate'])
    const url = fetchImpl.mock.calls[0][0] as string
    const parsed = new URL(url)
    expect(parsed.searchParams.get('keys')).toBe('time,heartrate')
    expect(parsed.searchParams.get('key_by_type')).toBe('true')
  })

  it('routes.getRouteAsGPX returns text', async () => {
    const fetchImpl = mockFetch(async () =>
      mockResponse({
        body: '<gpx>...</gpx>',
        headers: { 'content-type': 'application/gpx+xml' },
      }),
    )
    const strava = new Strava({ ...baseConfig, fetch: fetchImpl })
    const xml = await strava.routes.getRouteAsGPX(7)
    expect(xml).toBe('<gpx>...</gpx>')
  })

  it('forwards rate-limit info via getRateLimit', async () => {
    const fetchImpl = mockFetch(async () =>
      mockResponse({
        body: {},
        headers: {
          'x-ratelimit-limit': '200,2000',
          'x-ratelimit-usage': '3,30',
        },
      }),
    )
    const onRateLimit = vi.fn()
    const strava = new Strava({
      ...baseConfig,
      fetch: fetchImpl,
      on_rate_limit_update: onRateLimit,
    })
    await strava.athletes.getLoggedInAthlete()
    expect(strava.getRateLimit()).toMatchObject({
      shortTermLimit: 200,
      longTermUsage: 30,
    })
    expect(onRateLimit).toHaveBeenCalledOnce()
  })

  it('fromAuthorizationCode exchanges code and returns athlete', async () => {
    const fetchImpl = mockFetch(async (url) => {
      if (String(url).endsWith('/oauth/token')) {
        return mockResponse({
          body: {
            access_token: 'a',
            refresh_token: 'r',
            expires_at: nextSecond(3600),
            expires_in: 3600,
            token_type: 'Bearer',
            athlete: { id: 42, firstname: 'Test' },
          },
        })
      }
      return mockResponse({ body: {} })
    })
    const onRefresh = vi.fn()
    const { strava, token } = await Strava.fromAuthorizationCode(
      {
        client_id: 'cid',
        client_secret: 'csecret',
        fetch: fetchImpl,
        on_token_refresh: onRefresh,
      },
      'code-xyz',
    )
    expect(token.athlete?.id).toBe(42)
    expect(onRefresh).toHaveBeenCalledOnce()
    expect(strava).toBeInstanceOf(Strava)
  })
})
