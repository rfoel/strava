import { DetailedGear } from '../models'
import { Request } from '../request'

export type GetGearByIdRequest = {
  id: number
}

export class Gears {
  private readonly request: Request

  constructor(request: Request) {
    this.request = request
  }

  async getGearById(
    params: GetGearByIdRequest,
    access_token?: string,
  ): Promise<DetailedGear> {
    const { id } = params
    return await this.request.makeApiRequest<DetailedGear>(
      'get',
      `/gear/${id}`,
      { access_token },
    )
  }
}
