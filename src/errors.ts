export class StravaError {
  errors: any
  message: string
  status: number
  statusText: string

  constructor(error: Response, data: any) {
    this.errors = data.errors
    this.message = data.message
    this.status = error.status
    this.statusText = error.statusText
  }
}
