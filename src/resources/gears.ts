import { DetailedGear } from '../models'
import { Request } from '../request'

type getGearByIdRequest = {
  id: number
}

export class Gears {
  private readonly request: Request

  constructor(request) {
    this.request = request
  }

  async getGearById(params: getGearByIdRequest): Promise<DetailedGear> {
    const { id } = params
    return await this.request.makeApiRequest<DetailedGear>('get', `/gear/${id}`)
  }
}
