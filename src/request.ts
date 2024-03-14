import fetch, { BodyInit } from 'node-fetch'

import { AccessToken, RefreshTokenRequest } from './types'
import { Oauth } from './resources/oauth'

type RequestParams = {
  query?: Record<string, any>
  body?: Record<string, any> | any
  headers?: Record<string, any>
  access_token?: string
}

export class Request {
  readonly oauth = new Oauth()

  constructor(
    readonly config: RefreshTokenRequest,
    private token?: AccessToken,
  ) {}

  private async getAccessToken(): Promise<string> {
    if (!this.token || this.token.expires_at < new Date().getTime() / 1000) {
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

  public async makeApiRequest<Response>(
    method: string,
    uri: string,
    params?: RequestParams,
  ): Promise<Response> {
    const token = params?.access_token || (await this.getAccessToken())
    const query: string =
      params?.query && Object.keys(params.query).length
        ? `?${new URLSearchParams(params?.query)}`
        : ''
    const headers = {
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      ...(params?.headers ? params.headers : {}),
    }

    let body: BodyInit | undefined

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
      throw response
    }

    if (response.status !== 204) {
      return (await response.json()) as Response
    }

    return (response as unknown) as Response
  }
}
