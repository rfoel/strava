import { ActivityStats, DetailedAthlete, Zones } from '../models'
import { Request } from '../request'

type getStatsRequest = {
  id: number
}

type UpdateLoggedInAthleteRequest = {
  weight: number
}

export class Athletes {
  private readonly request: Request

  constructor(request: Request) {
    this.request = request
  }

  async getLoggedInAthlete(): Promise<DetailedAthlete> {
    return await this.request.makeApiRequest<DetailedAthlete>('get', '/athlete')
  }

  async getLoggedInAthleteZones(): Promise<Zones> {
    return await this.request.makeApiRequest<Zones>('get', '/athlete/zones')
  }

  async getStats(params: getStatsRequest): Promise<ActivityStats> {
    const { id } = params
    return await this.request.makeApiRequest<ActivityStats>(
      'get',
      `/athletes/${id}/stats`,
    )
  }

  async updateLoggedInAthlete(
    params: UpdateLoggedInAthleteRequest,
  ): Promise<DetailedAthlete> {
    return await this.request.makeApiRequest<DetailedAthlete>(
      'put',
      `/athlete`,
      { body: params },
    )
  }
}
