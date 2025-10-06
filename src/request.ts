import { AccessToken, RateLimit, RefreshTokenRequest } from './types'
import { Oauth } from './resources/oauth'

type RequestParams = {
  query?: Record<string, any>
  body?: Record<string, any> | any
  headers?: Record<string, any>
  access_token?: string
}

type FetchBody = string | URLSearchParams | FormData | any

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'

function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)))
    } else {
      searchParams.append(key, String(value))
    }
  }

  return searchParams.toString()
}

function parseRateLimitHeader(header: string | null): [number, number] | null {
  if (!header) return null
  const parts = header.split(',').map((s) => parseInt(s.trim(), 10))
  if (parts.length === 2 && !parts.some(isNaN)) {
    return [parts[0], parts[1]]
  }
  return null
}

export class StravaApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any,
  ) {
    super(`Strava API Error ${status}: ${statusText}`)
    this.name = 'StravaApiError'
  }
}

export class Request {
  private static readonly TOKEN_EXPIRY_BUFFER_SECONDS: number = 300 // 5 minutes
  readonly oauth: Oauth = new Oauth()
  private rateLimit: RateLimit | null = null

  constructor(
    readonly config: RefreshTokenRequest,
    private token?: AccessToken,
  ) {}

  private async getAccessToken(): Promise<string> {
    const now = new Date().getTime() / 1000
    const expiryWithBuffer =
      (this.token?.expires_at ?? 0) - Request.TOKEN_EXPIRY_BUFFER_SECONDS

    if (!this.token || expiryWithBuffer < now) {
      const token = await this.oauth.refreshTokens({
        client_id: this.config.client_id,
        client_secret: this.config.client_secret,
        refresh_token: this.token?.refresh_token || this.config.refresh_token,
      })
      this.token = token
      this.config.on_token_refresh?.(token)
    }
    return this.token.access_token
  }

  private updateRateLimitFromHeaders(headers: Headers): void {
    const limitHeader = headers.get('x-ratelimit-limit')
    const usageHeader = headers.get('x-ratelimit-usage')

    const limits = parseRateLimitHeader(limitHeader)
    const usage = parseRateLimitHeader(usageHeader)

    if (limits && usage) {
      this.rateLimit = {
        shortTermLimit: limits[0],
        longTermLimit: limits[1],
        shortTermUsage: usage[0],
        longTermUsage: usage[1],
        timestamp: Date.now(),
      }

      this.config.on_rate_limit_update?.(this.rateLimit)
    }
  }

  /**
   * Get the current rate limit information
   * @returns Current rate limit information or null if not available yet
   */
  public getRateLimit(): RateLimit | null {
    return this.rateLimit
  }

  public async makeApiRequest<T>(
    method: HttpMethod,
    uri: string,
    params?: RequestParams,
  ): Promise<T> {
    const token = params?.access_token || (await this.getAccessToken())
    const queryString =
      params?.query && Object.keys(params.query).length
        ? buildQueryString(params.query)
        : ''
    const query = queryString ? `?${queryString}` : ''
    const headers = {
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      ...(params?.headers ? params.headers : {}),
    }

    let body: FetchBody | undefined

    if (params?.body) {
      if (headers['content-type'] === 'application/json')
        body = JSON.stringify(params.body)
      else body = params.body
    }

    const response = await fetch(
      `https://www.strava.com/api/v3${uri}${query}`,
      {
        body,
        method,
        headers,
      },
    )

    // Update rate limit info from response headers
    this.updateRateLimitFromHeaders(response.headers)

    if (!response.ok) {
      let errorData: any
      const contentType = response.headers.get('content-type')

      try {
        if (contentType?.includes('application/json')) {
          errorData = await response.json()
        } else {
          errorData = await response.text()
        }
      } catch {
        errorData = undefined
      }

      throw new StravaApiError(response.status, response.statusText, errorData)
    }

    if (response.status !== 204) {
      const contentType = response.headers.get('content-type')

      if (contentType?.includes('application/json')) {
        return (await response.json()) as T
      }

      // For non-JSON responses (like GPX/TCX files)
      return (await response.text()) as T
    }

    return response as T
  }
}
