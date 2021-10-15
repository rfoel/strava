import { ActivityType } from '../enums'
import {
  ActivityZone,
  Comment,
  DetailedActivity,
  Lap,
  SummaryActivity,
  SummaryAthlete,
} from '../models'
import { Request } from '../request'

type CreateActivityRequest = {
  name: string
  type: ActivityType
  start_date_local: string
  elapsed_time: number
  description?: string
  distance?: number
  trainer?: number
  commute?: number
}

type GetActivityByIdRequest = {
  [key: string]: string | number | boolean
  id: number
  include_all_efforts?: boolean
}

type GetCommentsByActivityIdRequest = {
  [key: string]: string | number | boolean
  id: number
  page?: number
  per_page?: number
}

type GetKudoersByActivityIdRequest = {
  [key: string]: string | number | boolean
  id: number
  page?: number
  per_page?: number
}

type GetLapsByActivityIdRequest = {
  [key: string]: string | number | boolean
  id: number
}

type GetPhotosByActivityIdRequest = {
  [key: string]: string | number | boolean
  id: number
  photo_sources?: boolean
  size?: number
}

type GetZonesByActivityIdRequest = {
  [key: string]: string | number | boolean
  id: number
}

type GetLoggedInAthleteActivitiesRequest = {
  [key: string]: string | number | boolean
  before?: number
  after?: number
  page?: number
  per_page?: number
}

type UpdateActivityByIdRequest = {
  [key: string]: string | number | boolean
  id: number
  name: string
  type: ActivityType
  start_date_local: string
  elapsed_time: number
  description?: string
  distance?: number
  trainer?: number
  commute?: number
}

export class Activities {
  private readonly request: Request

  constructor(request: Request) {
    this.request = request
  }

  async createActivity(
    params: CreateActivityRequest,
  ): Promise<DetailedActivity> {
    return await this.request.makeApiRequest<DetailedActivity>(
      'post',
      '/activities',
      { body: params },
    )
  }

  async getActivityById(
    params: GetActivityByIdRequest,
  ): Promise<DetailedActivity> {
    const { id, ...query } = params
    return await this.request.makeApiRequest<DetailedActivity>(
      'get',
      `/activities/${id}`,
      { query },
    )
  }

  async getCommentsByActivityId(
    params: GetCommentsByActivityIdRequest,
  ): Promise<Comment[]> {
    const { id, ...query } = params
    return await this.request.makeApiRequest<Comment[]>(
      'get',
      `/activities/${id}/comments`,
      { query },
    )
  }

  async getKudoersByActivityId(
    params: GetKudoersByActivityIdRequest,
  ): Promise<SummaryAthlete[]> {
    const { id, ...query } = params
    return await this.request.makeApiRequest<SummaryAthlete[]>(
      'get',
      `/activities/${id}/kudos`,
      { query },
    )
  }

  async getLapsByActivityId(
    params: GetLapsByActivityIdRequest,
  ): Promise<Lap[]> {
    const { id, ...query } = params
    return await this.request.makeApiRequest<Lap[]>(
      'get',
      `/activities/${id}/laps`,
      { query },
    )
  }

  async getPhotosByActivityId(
    params: GetPhotosByActivityIdRequest,
  ): Promise<Lap[]> {
    const { id, ...query } = params
    return await this.request.makeApiRequest<Lap[]>(
      'get',
      `/activities/${id}/photos`,
      { query },
    )
  }

  async getLoggedInAthleteActivities(
    params?: GetLoggedInAthleteActivitiesRequest,
  ): Promise<SummaryActivity[]> {
    return await this.request.makeApiRequest<SummaryActivity[]>(
      'get',
      '/athlete/activities',
      { query: params },
    )
  }

  async getZonesByActivityId(
    params: GetZonesByActivityIdRequest,
  ): Promise<ActivityZone[]> {
    const { id, ...query } = params
    return await this.request.makeApiRequest<ActivityZone[]>(
      'get',
      `/activities/${id}/zones`,
      { query },
    )
  }

  async updateActivityById(
    params: UpdateActivityByIdRequest,
  ): Promise<DetailedActivity> {
    const { id, ...query } = params
    return await this.request.makeApiRequest<DetailedActivity>(
      'put',
      `/activities/${id}`,
      { query },
    )
  }
}
