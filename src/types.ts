export interface RefreshTokenRequest {
  client_id: string
  client_secret: string
  refresh_token: string
  on_token_refresh?: (token: RefreshTokenResponse) => void
}
export interface RefreshTokenResponse {
  access_token: string
  expires_at: number
  expires_in: number
  refresh_token: string
}

/**
 * Latitude, Longitude
 */
export type LatLng = [number, number]
