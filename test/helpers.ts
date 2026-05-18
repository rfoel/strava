import { vi, type Mock } from 'vitest'

export type MockFetch = Mock<typeof fetch>

export interface MockResponseInit {
  status?: number
  statusText?: string
  headers?: Record<string, string>
  body?: unknown
  /** Force the body to be returned as text even if it's an object. */
  bodyAs?: 'json' | 'text'
}

export function mockResponse({
  status = 200,
  statusText = 'OK',
  headers = {},
  body,
  bodyAs,
}: MockResponseInit = {}): Response {
  const isText =
    bodyAs === 'text' || typeof body === 'string' || body === undefined
  const finalHeaders = new Headers(headers)
  if (!finalHeaders.has('content-type')) {
    finalHeaders.set(
      'content-type',
      isText ? 'text/plain' : 'application/json',
    )
  }
  const payload =
    body === undefined ? null : isText ? String(body) : JSON.stringify(body)
  return new Response(payload, { status, statusText, headers: finalHeaders })
}

export function mockFetch(impl?: typeof fetch): MockFetch {
  const fn = vi.fn<typeof fetch>(impl ?? (async () => mockResponse()))
  return fn
}

export function nextSecond(offset = 0): number {
  return Math.floor(Date.now() / 1000) + offset
}
