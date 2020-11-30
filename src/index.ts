import { Request } from './request'
import { Activities } from './resources'
import { Config } from './types'

export class Strava {
  private readonly request: Request
  activities: Activities

  constructor(config: Config) {
    this.request = new Request(config)
    this.activities = new Activities(this.request)
  }
}

export default Strava
