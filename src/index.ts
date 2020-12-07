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
  Uploads,
} from './resources'
import { RefreshTokenRequest } from './types'

export * from './enums'
export * from './models'

export class Strava {
  private readonly request: Request
  activities: Activities
  athletes: Athletes
  clubs: Clubs
  gears: Gears
  routes: Routes
  runningRaces: RunningRaces
  segmentEfforts: SegmentEfforts
  segments: Segments
  streams: Streams
  uploads: Uploads

  constructor(config: RefreshTokenRequest) {
    this.request = new Request(config)
    this.activities = new Activities(this.request)
    this.athletes = new Athletes(this.request)
    this.clubs = new Clubs(this.request)
    this.gears = new Gears(this.request)
    this.routes = new Routes(this.request)
    this.runningRaces = new RunningRaces(this.request)
    this.segmentEfforts = new SegmentEfforts(this.request)
    this.segments = new Segments(this.request)
    this.streams = new Streams(this.request)
    this.uploads = new Uploads(this.request)
  }
}
