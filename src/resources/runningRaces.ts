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
    access_token?: string,
  ): Promise<RunningRace> {
    const { id } = params
    return await this.request.makeApiRequest<RunningRace>(
      'get',
      `/running_races/${id}`,
      { access_token },
    )
  }

  async getRunningRaces(
    params?: GetRunningRacesRequest,
    access_token?: string,
  ): Promise<RunningRace[]> {
    return await this.request.makeApiRequest<RunningRace[]>(
      'get',
      '/running_races',
      { query: params, access_token },
    )
  }
}
