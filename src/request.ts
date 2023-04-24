import fetch, { BodyInit } from 'node-fetch'

import { RefreshTokenRequest, RefreshTokenResponse } from './types'

type RequestParams = {
  query?: Record<string, any>
  body?: Record<string, any> | any
  headers?: Record<string, any>
  access_token?: string
}

export class Request {
  config: RefreshTokenRequest
  response: RefreshTokenResponse

  constructor(config: RefreshTokenRequest) {
    this.config = config
  }

  private async getAccessToken(): Promise<RefreshTokenResponse> {
    if (
      !this.response ||
      this.response?.expires_at < new Date().getTime() / 1000
    ) {
      const query: string = new URLSearchParams({
        client_id: this.config.client_id,
        client_secret: this.config.client_secret,
        refresh_token: this.config.refresh_token,
        grant_type: 'refresh_token',
      }).toString()

      const response = await fetch(
        `https://www.strava.com/oauth/token?${query}`,
        {
          method: 'post',
        },
      )

      if (!response.ok) {
        throw response
      }

      this.response = (await response.json()) as RefreshTokenResponse
      this.config.on_token_refresh?.(this.response)
    }
    return this.response
  }

  public async makeApiRequest<Response>(
    method: string,
    uri: string,
    params?: RequestParams,
  ): Promise<Response> {
    if (!params?.access_token) await this.getAccessToken()
    const query: string =
      params?.query && Object.keys(params?.query).length
        ? `?${new URLSearchParams(
            Object.entries(params?.query).reduce(
              (acc, [key, value]) => ({ ...acc, [key]: String(value) }),
              {},
            ),
          ).toString()}`
        : ''
    const headers = {
      Authorization: `Bearer ${
        params?.access_token
          ? params?.access_token
          : this.response.access_token
      }`,
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
