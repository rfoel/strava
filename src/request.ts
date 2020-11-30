import fetch from 'node-fetch'

import { StravaError } from './errors'
import { Config, RefreshTokenRequest, RefreshTokenResponse } from './types'

type RequestParams = {
  query?: any
  body?: any
}

export class Request {
  config: Config
  response: RefreshTokenResponse

  constructor(config: Config) {
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

      this.response = await response.json()
    }
    return this.response
  }

  public async makeApiRequest<Response>(
    method: string,
    uri: string,
    params: RequestParams,
  ): Promise<Response> {
    try {
      await this.getAccessToken()

      const query: string = new URLSearchParams(params.query).toString()
      const response = await fetch(
        `https://www.strava.com/api/v3${uri}?${query}`,
        {
          body: params.body,
          method,
          headers: { Authorization: `Bearer ${this.response.access_token}` },
        },
      )

      if (!response.ok) {
        throw response
      }

      return await response.json()
    } catch (error) {
      const data = await error.json()
      switch (error.status) {
        case 400:
        case 401:
        case 403:
        case 404:
        case 429:
        case 500:
          throw new StravaError(error, data)
        default:
          throw error
      }
    }
  }
}
