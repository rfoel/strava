import { Request } from './request'
import { Activities, Athletes, Clubs } from './resources'
import { Config } from './types'

export class Strava {
  private readonly request: Request
  activities: Activities
  athletes: Athletes
  clubs: Clubs

  constructor(config: Config) {
    this.request = new Request(config)
    this.activities = new Activities(this.request)
    this.athletes = new Athletes(this.request)
    this.clubs = new Clubs(this.request)
  }
}
