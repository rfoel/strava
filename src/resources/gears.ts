import { DetailedGear } from '../models'
import { Request } from '../request'

type getGearById = {
  id: number
}

export class Gears {
  private readonly request: Request

  constructor(request) {
    this.request = request
  }

  async getGearById(params: getGearById): Promise<DetailedGear> {
    const { id } = params
    return await this.request.makeApiRequest<DetailedGear>('get', `/gear/${id}`)
  }
}
