import { Request } from './request'
import {
  Activities,
  Athletes,
  Clubs,
  Gears,
  Routes,
  RunningRaces,
} from './resources'
import { RefreshTokenRequest } from './types'

export class Strava {
  private readonly request: Request
  activities: Activities
  athletes: Athletes
  clubs: Clubs
  gears: Gears
  routes: Routes
  runningRaces: RunningRaces

  constructor(config: RefreshTokenRequest) {
    this.request = new Request(config)
    this.activities = new Activities(this.request)
    this.athletes = new Athletes(this.request)
    this.clubs = new Clubs(this.request)
    this.gears = new Gears(this.request)
    this.routes = new Routes(this.request)
    this.runningRaces = new RunningRaces(this.request)
  }
}
