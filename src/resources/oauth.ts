import fetch from 'node-fetch'

import { RefreshTokenRequest, RefreshTokenResponse } from '../types'

export class Oauth {
  async refreshTokens(
    token: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> {
    if (!token) {
      throw new Error('No token provided')
    }

    const response = await fetch(`https://www.strava.com/oauth/token`, {
      body: new URLSearchParams({
        client_id: token.client_id,
        client_secret: token.client_secret,
        refresh_token: token.refresh_token,
        grant_type: 'refresh_token',
      }),
      method: 'post',
    })
    if (!response.ok) {
      throw response
    }
    return (await response.json()) as RefreshTokenResponse
  }
}
