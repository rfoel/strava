import { Request } from './request'
import {
  Activities,
  Athletes,
  Clubs,
  Gears,
  Routes,
  RunningRaces,
  SegmentEfforts,
  Segments,
  Streams,
  Subscriptions,
  Uploads,
} from './resources'
import { Oauth } from './resources/oauth'
import { AccessToken, AppConfig, RefreshTokenRequest } from './types'

export * from './types'
export * from './enums'
export * from './models'

export class Strava {
  private readonly request: Request
  readonly activities: Activities
  readonly athletes: Athletes
  readonly clubs: Clubs
  readonly gears: Gears
  readonly oauth: Oauth
  readonly routes: Routes
  readonly runningRaces: RunningRaces
  readonly segmentEfforts: SegmentEfforts
  readonly segments: Segments
  readonly streams: Streams
  readonly subscriptions: Subscriptions
  readonly uploads: Uploads

  constructor(config: RefreshTokenRequest, access_token?: AccessToken)
  constructor(config: AppConfig, access_token: AccessToken)
  constructor(config: RefreshTokenRequest, access_token?: AccessToken) {
    this.request = new Request(config, access_token)
    this.activities = new Activities(this.request)
    this.athletes = new Athletes(this.request)
    this.clubs = new Clubs(this.request)
    this.gears = new Gears(this.request)
    this.oauth = this.request.oauth
    this.routes = new Routes(this.request)
    this.runningRaces = new RunningRaces(this.request)
    this.segmentEfforts = new SegmentEfforts(this.request)
    this.segments = new Segments(this.request)
    this.streams = new Streams(this.request)
    this.subscriptions = new Subscriptions(this.request)
    this.uploads = new Uploads(this.request)
  }

  static async createFromTokenExchange(config: AppConfig, code: string) {
    const tokenExchangeResponse = await Oauth.tokenExchange(config, code)
    config.on_token_refresh?.(tokenExchangeResponse)
    return new Strava(config, tokenExchangeResponse)
  }
}
