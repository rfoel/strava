import { buildClient, type HttpClient } from './client'
import { OAuth } from './oauth'
import {
  Activities,
  Athletes,
  Clubs,
  Gears,
  Routes,
  SegmentEfforts,
  Segments,
  Streams,
  Uploads,
} from './resources'
import { Subscriptions } from './subscriptions'
import type { RateLimit, StravaConfig, TokenResponse } from './types'

export class Strava {
  readonly http: HttpClient
  readonly oauth: OAuth
  readonly activities: Activities
  readonly athletes: Athletes
  readonly clubs: Clubs
  readonly gears: Gears
  readonly routes: Routes
  readonly segments: Segments
  readonly segmentEfforts: SegmentEfforts
  readonly streams: Streams
  readonly uploads: Uploads
  readonly subscriptions: Subscriptions

  private readonly getRateLimitFn: () => RateLimit | undefined

  constructor(config: StravaConfig) {
    const built = buildClient(config)
    this.http = built.http
    this.oauth = built.oauth
    this.getRateLimitFn = () => built.rateLimit.get()
    this.activities = new Activities(this.http)
    this.athletes = new Athletes(this.http)
    this.clubs = new Clubs(this.http)
    this.gears = new Gears(this.http)
    this.routes = new Routes(this.http)
    this.segments = new Segments(this.http)
    this.segmentEfforts = new SegmentEfforts(this.http)
    this.streams = new Streams(this.http)
    this.uploads = new Uploads(this.http)
    this.subscriptions = new Subscriptions(
      config.client_id,
      config.client_secret,
      config.fetch,
    )
  }

  getRateLimit(): RateLimit | undefined {
    return this.getRateLimitFn()
  }

  static async fromAuthorizationCode(
    config: StravaConfig,
    code: string,
  ): Promise<{ strava: Strava; token: TokenResponse }> {
    const oauth = new OAuth(config.fetch)
    const token = await oauth.exchange({
      client_id: config.client_id,
      client_secret: config.client_secret,
      code,
    })
    config.on_token_refresh?.(token)
    const strava = new Strava({ ...config, access_token: token })
    return { strava, token }
  }
}
