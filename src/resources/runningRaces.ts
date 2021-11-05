import { RunningRace } from '../models'
import { Request } from '../request'

type GetRunningRaceByIdRequest = {
  id: number
}

type GetRunningRacesRequest = {
  year?: number
}

export class RunningRaces {
  private readonly request: Request

  constructor(request: Request) {
    this.request = request
  }

  async getRunningRaceById(
    params: GetRunningRaceByIdRequest,
  ): Promise<RunningRace> {
    const { id } = params
    return await this.request.makeApiRequest<RunningRace>(
      'get',
      `/running_races/${id}`,
    )
  }

  async getRunningRaces(
    params?: GetRunningRacesRequest,
  ): Promise<RunningRace[]> {
    return await this.request.makeApiRequest<RunningRace[]>(
      'get',
      '/running_races',
      { query: params },
    )
  }
}
