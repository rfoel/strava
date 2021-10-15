export class StravaError {
  errors: unknown
  message: string
  status: number
  statusText: string

  constructor(error: Response, data: Record<string, string>) {
    this.errors = data.errors
    this.message = data.message
    this.status = error.status
    this.statusText = error.statusText
  }
}
