import { Request } from './request'

export class OAuth {
  private readonly request: Request

  constructor(request) {
    this.request = request
  }
}
