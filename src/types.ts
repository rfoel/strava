import type { SummaryAthlete } from './generated/types.gen'

export interface AccessToken {
  access_token: string
  expires_at: number
  refresh_token: string
}

export interface TokenResponse extends AccessToken {
  token_type: 'Bearer'
  expires_in: number
  /** Only returned on initial authorization_code exchange. */
  athlete?: SummaryAthlete
}

export interface RateLimit {
  /** 15-minute request limit. */
  shortTermLimit: number
  /** Daily request limit. */
  longTermLimit: number
  /** Requests used in current 15-minute window. */
  shortTermUsage: number
  /** Requests used in current day. */
  longTermUsage: number
  /** Ms epoch when last updated. */
  timestamp: number
}

export interface StravaConfig {
  client_id: string
  client_secret: string
  /** Required unless an `access_token` with `refresh_token` is provided. */
  refresh_token?: string
  /** Optional cached token; skips initial refresh if not expired. */
  access_token?: AccessToken
  /** Called whenever a new token is obtained (refresh or exchange). */
  on_token_refresh?: (token: TokenResponse) => void
  /** Called whenever rate-limit headers are seen on a response. */
  on_rate_limit_update?: (rateLimit: RateLimit) => void
  /** Override fetch (testing / custom transports). */
  fetch?: typeof fetch
  /** Override base URL. Defaults to https://www.strava.com/api/v3. */
  baseUrl?: string
}

export type Scope =
  | 'read'
  | 'read_all'
  | 'profile:read_all'
  | 'profile:write'
  | 'activity:read'
  | 'activity:read_all'
  | 'activity:write'
