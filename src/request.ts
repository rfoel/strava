import { AccessToken, RefreshTokenRequest } from './types'
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
      value.forEach(item => searchParams.append(key, String(item)))
    } else {
      searchParams.append(key, String(value))
    }
  }

  return searchParams.toString()
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
  private static readonly TOKEN_EXPIRY_BUFFER_SECONDS = 300 // 5 minutes
  readonly oauth = new Oauth()

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
