import { SummaryAthlete } from './models'

export interface AppConfig {
  client_id: string
  client_secret: string
  on_token_refresh?: (token: RefreshTokenResponse) => void
  on_rate_limit_update?: RateLimitCallback
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

/**
 * Strava API Rate Limit Information
 */
export interface RateLimit {
  /** 15-minute limit */
  shortTermLimit: number
  /** Daily limit */
  longTermLimit: number
  /** Current 15-minute usage */
  shortTermUsage: number
  /** Current daily usage */
  longTermUsage: number
  /** Timestamp when the rate limit was last updated */
  timestamp: number
}

/**
 * Callback function for rate limit updates
 */
export type RateLimitCallback = (rateLimit: RateLimit) => void
