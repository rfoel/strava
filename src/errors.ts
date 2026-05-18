import type { Fault } from './generated/types.gen'

export type { Fault }

export class StravaApiError extends Error {
  readonly status: number
  readonly statusText: string
  readonly data: Fault | string | undefined

  constructor(status: number, statusText: string, data?: Fault | string) {
    super(`Strava API ${status} ${statusText}`)
    this.name = 'StravaApiError'
    this.status = status
    this.statusText = statusText
    this.data = data
  }
}
