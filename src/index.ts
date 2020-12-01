import { Request } from './request'
import { Activities, Athletes } from './resources'
import { Config } from './types'

export class Strava {
  private readonly request: Request
  activities: Activities
  athletes: Athletes

  constructor(config: Config) {
    this.request = new Request(config)
    this.activities = new Activities(this.request)
    this.athletes = new Athletes(this.request)
  }
}
