import { StravaApiError, type Fault } from './errors'
import { OAuth } from './oauth'
import type {
  AccessToken,
  RateLimit,
  StravaConfig,
  TokenResponse,
} from './types'

const DEFAULT_BASE_URL = 'https://www.strava.com/api/v3'
const TOKEN_EXPIRY_BUFFER_SECONDS = 300

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type ParseAs = 'json' | 'text'

export interface RequestOptions {
  query?: Record<string, unknown>
  body?: unknown
  /** Defaults to 'json'. Set to 'form' or 'multipart' for non-JSON bodies. */
  bodyFormat?: 'json' | 'form' | 'multipart' | 'raw'
  /** Defaults to 'json'. */
  parseAs?: ParseAs
  /** Override the access token for this call (skips auto-refresh). */
  accessToken?: string
}

export class TokenManager {
  private token: AccessToken | undefined
  private refreshPromise: Promise<string> | undefined

  constructor(
    private readonly config: StravaConfig,
    private readonly oauth: OAuth,
  ) {
    if (config.access_token) this.token = config.access_token
  }

  setToken(token: TokenResponse): void {
    this.token = {
      access_token: token.access_token,
      expires_at: token.expires_at,
      refresh_token: token.refresh_token,
    }
  }

  async getAccessToken(): Promise<string> {
    const now = Date.now() / 1000
    const valid =
      this.token &&
      this.token.expires_at - TOKEN_EXPIRY_BUFFER_SECONDS > now &&
      this.token.access_token
    if (valid) return this.token!.access_token

    if (!this.refreshPromise) {
      this.refreshPromise = this.doRefresh().finally(() => {
        this.refreshPromise = undefined
      })
    }
    return this.refreshPromise
  }

  private async doRefresh(): Promise<string> {
    const refreshToken = this.token?.refresh_token ?? this.config.refresh_token
    if (!refreshToken) {
      throw new Error(
        'No refresh_token available. Provide config.refresh_token or config.access_token.refresh_token.',
      )
    }
    const response = await this.oauth.refresh({
      client_id: this.config.client_id,
      client_secret: this.config.client_secret,
      refresh_token: refreshToken,
    })
    this.setToken(response)
    this.config.on_token_refresh?.(response)
    return response.access_token
  }
}

export class RateLimitTracker {
  private current: RateLimit | undefined

  constructor(private readonly onUpdate?: (rl: RateLimit) => void) {}

  get(): RateLimit | undefined {
    return this.current
  }

  update(headers: Headers): void {
    const limits = parsePair(headers.get('x-ratelimit-limit'))
    const usage = parsePair(headers.get('x-ratelimit-usage'))
    if (!limits || !usage) return
    this.current = {
      shortTermLimit: limits[0],
      longTermLimit: limits[1],
      shortTermUsage: usage[0],
      longTermUsage: usage[1],
      timestamp: Date.now(),
    }
    this.onUpdate?.(this.current)
  }
}

function parsePair(value: string | null): [number, number] | undefined {
  if (!value) return undefined
  const parts = value.split(',').map((p) => Number.parseInt(p.trim(), 10))
  if (parts.length !== 2 || parts.some(Number.isNaN)) return undefined
  return [parts[0], parts[1]]
}

export class HttpClient {
  private readonly baseUrl: string
  private readonly fetchImpl: typeof fetch

  constructor(
    baseUrl: string,
    fetchImpl: typeof fetch,
    readonly tokens: TokenManager,
    readonly rateLimit: RateLimitTracker,
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
    this.fetchImpl = fetchImpl
  }

  async request<T>(
    method: HttpMethod,
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const url = this.baseUrl + path + buildQuery(options.query)
    const headers = new Headers()
    const token = options.accessToken ?? (await this.tokens.getAccessToken())
    headers.set('Authorization', `Bearer ${token}`)

    let body: BodyInit | undefined
    if (options.body !== undefined) {
      const format = options.bodyFormat ?? 'json'
      if (format === 'json') {
        headers.set('Content-Type', 'application/json')
        body = JSON.stringify(options.body)
      } else if (format === 'form') {
        headers.set('Content-Type', 'application/x-www-form-urlencoded')
        body = toUrlEncoded(options.body as Record<string, unknown>)
      } else if (format === 'multipart') {
        body = options.body as FormData
      } else {
        body = options.body as BodyInit
      }
    }

    const response = await this.fetchImpl(url, { method, headers, body })
    this.rateLimit.update(response.headers)

    if (!response.ok) {
      throw await toApiError(response)
    }

    if (response.status === 204) return undefined as T

    if ((options.parseAs ?? 'json') === 'text') {
      return (await response.text()) as T
    }

    const contentType = response.headers.get('content-type') ?? ''
    if (!contentType.includes('application/json')) {
      return (await response.text()) as T
    }
    return (await response.json()) as T
  }
}

function buildQuery(query: Record<string, unknown> | undefined): string {
  if (!query) return ''
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue
    if (Array.isArray(value)) {
      params.append(key, value.join(','))
    } else {
      params.append(key, String(value))
    }
  }
  const str = params.toString()
  return str ? `?${str}` : ''
}

function toUrlEncoded(body: Record<string, unknown>): URLSearchParams {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(body)) {
    if (value === undefined || value === null) continue
    params.append(key, String(value))
  }
  return params
}

async function toApiError(response: Response): Promise<StravaApiError> {
  const contentType = response.headers.get('content-type') ?? ''
  let data: Fault | string | undefined
  try {
    if (contentType.includes('application/json')) {
      data = (await response.json()) as Fault
    } else {
      data = await response.text()
    }
  } catch {
    data = undefined
  }
  return new StravaApiError(response.status, response.statusText, data)
}

export interface BuiltClient {
  http: HttpClient
  tokens: TokenManager
  rateLimit: RateLimitTracker
  oauth: OAuth
}

export function buildClient(config: StravaConfig): BuiltClient {
  const fetchImpl = config.fetch ?? fetch
  const oauth = new OAuth(fetchImpl)
  const tokens = new TokenManager(config, oauth)
  const rateLimit = new RateLimitTracker(config.on_rate_limit_update)
  const http = new HttpClient(
    config.baseUrl ?? DEFAULT_BASE_URL,
    fetchImpl,
    tokens,
    rateLimit,
  )
  return { http, tokens, rateLimit, oauth }
}
