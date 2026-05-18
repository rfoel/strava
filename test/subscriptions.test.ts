import { describe, expect, it } from 'vitest'

import { StravaApiError } from '../src/errors'
import { Subscriptions } from '../src/subscriptions'

import { mockFetch, mockResponse } from './helpers'

describe('Subscriptions', () => {
  it('creates a subscription with client credentials in body', async () => {
    const fetchImpl = mockFetch(async () =>
      mockResponse({ body: { id: 1, application_id: 2, callback_url: 'u' } }),
    )
    const subs = new Subscriptions('cid', 'sec', fetchImpl)
    const result = await subs.create({
      callback_url: 'https://app/wh',
      verify_token: 'TOKEN',
    })
    expect(result.id).toBe(1)
    const [url, init] = fetchImpl.mock.calls[0]
    expect(url).toBe('https://www.strava.com/api/v3/push_subscriptions')
    expect(init?.method).toBe('POST')
    const body = (init?.body as URLSearchParams).toString()
    expect(body).toContain('client_id=cid')
    expect(body).toContain('client_secret=sec')
    expect(body).toContain('verify_token=TOKEN')
    expect(body).toContain('callback_url=https%3A%2F%2Fapp%2Fwh')
  })

  it('lists subscriptions using client_id/secret in query', async () => {
    const fetchImpl = mockFetch(async () => mockResponse({ body: [] }))
    const subs = new Subscriptions('cid', 'sec', fetchImpl)
    await subs.list()
    const url = fetchImpl.mock.calls[0][0] as string
    const parsed = new URL(url)
    expect(parsed.searchParams.get('client_id')).toBe('cid')
    expect(parsed.searchParams.get('client_secret')).toBe('sec')
  })

  it('deletes a subscription by id', async () => {
    const fetchImpl = mockFetch(async () => mockResponse({ status: 204 }))
    const subs = new Subscriptions('cid', 'sec', fetchImpl)
    await subs.delete(7)
    const [url, init] = fetchImpl.mock.calls[0]
    expect(String(url)).toContain('/push_subscriptions/7?')
    expect(init?.method).toBe('DELETE')
  })

  it('throws StravaApiError on non-ok response', async () => {
    const fetchImpl = mockFetch(async () =>
      mockResponse({ status: 400, statusText: 'Bad', body: { message: 'no' } }),
    )
    const subs = new Subscriptions('cid', 'sec', fetchImpl)
    await expect(subs.list()).rejects.toBeInstanceOf(StravaApiError)
  })
})
