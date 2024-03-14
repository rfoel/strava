import { SummaryAthlete } from './models'

export interface AppConfig {
  client_id: string
  client_secret: string
  on_token_refresh?: (token: RefreshTokenResponse) => void
}

export interface RefreshTokenRequest extends AppConfig {
  refresh_token: string
}

export interface AccessToken {
  access_token: string
  expires_at: number
  refresh_token?: string
}

export interface RefreshTokenResponse extends AccessToken {
  expires_in: number
  /** The athlete is only provided on the initial request */
  athlete?: SummaryAthlete
}

/**
 * Latitude, Longitude
 */
export type LatLng = [number, number]
