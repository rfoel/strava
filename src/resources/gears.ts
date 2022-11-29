import { DetailedGear } from '../models'
import { Request } from '../request'

type getGearByIdRequest = {
  id: number
}

export class Gears {
  private readonly request: Request

  constructor(request: Request) {
    this.request = request
  }

  async getGearById(
    params: getGearByIdRequest,
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
