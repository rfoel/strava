import { StravaApiError } from './errors'
import type { Scope, TokenResponse } from './types'

const TOKEN_URL = 'https://www.strava.com/oauth/token'
const AUTHORIZE_URL = 'https://www.strava.com/oauth/authorize'
const DEAUTHORIZE_URL = 'https://www.strava.com/oauth/deauthorize'

export interface AuthorizeUrlParams {
  client_id: string
  redirect_uri: string
  scope: Scope[]
  state?: string
  approval_prompt?: 'auto' | 'force'
}

export interface ExchangeParams {
  client_id: string
  client_secret: string
  code: string
}

export interface RefreshParams {
  client_id: string
  client_secret: string
  refresh_token: string
}

export interface DeauthorizeParams {
  access_token: string
}

export class OAuth {
  constructor(private readonly fetchImpl: typeof fetch = fetch) {}

  authorizeUrl(params: AuthorizeUrlParams): string {
    const search = new URLSearchParams({
      client_id: params.client_id,
      redirect_uri: params.redirect_uri,
      response_type: 'code',
      scope: params.scope.join(','),
      approval_prompt: params.approval_prompt ?? 'auto',
    })
    if (params.state) search.set('state', params.state)
    return `${AUTHORIZE_URL}?${search.toString()}`
  }

  exchange(params: ExchangeParams): Promise<TokenResponse> {
    return this.post({
      client_id: params.client_id,
      client_secret: params.client_secret,
      code: params.code,
      grant_type: 'authorization_code',
    })
  }

  refresh(params: RefreshParams): Promise<TokenResponse> {
    return this.post({
      client_id: params.client_id,
      client_secret: params.client_secret,
      refresh_token: params.refresh_token,
      grant_type: 'refresh_token',
    })
  }

  async deauthorize(params: DeauthorizeParams): Promise<void> {
    const res = await this.fetchImpl(DEAUTHORIZE_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${params.access_token}` },
    })
    if (!res.ok) {
      throw new StravaApiError(res.status, res.statusText, await safeText(res))
    }
  }

  private async post(body: Record<string, string>): Promise<TokenResponse> {
    const res = await this.fetchImpl(TOKEN_URL, {
      method: 'POST',
      body: new URLSearchParams(body),
    })
    if (!res.ok) {
      throw new StravaApiError(res.status, res.statusText, await safeText(res))
    }
    return (await res.json()) as TokenResponse
  }
}

async function safeText(res: Response): Promise<string | undefined> {
  try {
    return await res.text()
  } catch {
    return undefined
  }
}
