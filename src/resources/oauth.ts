import { AppConfig, RefreshTokenRequest, RefreshTokenResponse } from '../types'

export class Oauth {
  async refreshTokens(
    token: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> {
    if (!token) {
      throw new Error('No token provided')
    }
    return await Oauth.oauthRequest(
      new URLSearchParams({
        client_id: token.client_id,
        client_secret: token.client_secret,
        refresh_token: token.refresh_token,
        grant_type: 'refresh_token',
      }),
    )
  }

  static async tokenExchange(config: AppConfig, code: string) {
    if (!code) {
      throw new Error('No code provided')
    }
    return await Oauth.oauthRequest(
      new URLSearchParams({
        client_id: config.client_id,
        client_secret: config.client_secret,
        code,
        grant_type: 'authorization_code',
      }),
    )
  }

  private static async oauthRequest(body: URLSearchParams) {
    const response = await fetch(`https://www.strava.com/oauth/token`, {
      body,
      method: 'post',
    })
    if (!response.ok) {
      throw response
    }
    return (await response.json()) as RefreshTokenResponse
  }
}
