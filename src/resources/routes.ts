import { Route } from '../models'
import { Request } from '../request'

type GetRouteAsGPXRequest = {
  id: number
}

type GetRouteAsTCXRequest = {
  id: number
}

type GetRouteByIdRequest = {
  id: number
}

type GetRoutesByAthleteIdRequest = {
  id: number
  page?: number
  per_page?: number
}

export class Routes {
  private readonly request: Request

  constructor(request) {
    this.request = request
  }

  async getRouteAsGPX(params: GetRouteAsGPXRequest): Promise<any> {
    const { id } = params
    return await this.request.makeApiRequest<any>(
      'get',
      `/routes/${id}/export_gpx`,
    )
  }

  async getRouteAsTCX(params: GetRouteAsTCXRequest): Promise<any> {
    const { id } = params
    return await this.request.makeApiRequest<any>(
      'get',
      `/routes/${id}/export_tcx`,
    )
  }

  async getRouteById(params: GetRouteByIdRequest): Promise<Route> {
    const { id } = params
    return await this.request.makeApiRequest<Route>('get', `/routes/${id}`)
  }

  async getRoutesByAthleteId(
    params: GetRoutesByAthleteIdRequest,
  ): Promise<Route[]> {
    const { id, ...query } = params
    return await this.request.makeApiRequest<Route[]>(
      'get',
      `/athletes/${id}/routes`,
      { query },
    )
  }
}
