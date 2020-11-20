import { OAuth } from './oauth'
import { Request } from './request'

export default class Strava {
  private readonly request: Request
  oauth: OAuth

  constructor(apiKey: string) {
    this.request = new Request()
    this.oauth = new OAuth(this.request)
  }
}
