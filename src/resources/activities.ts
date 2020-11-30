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
  start_date_local: Date
  elapsed_time: number
  description?: string
  distance?: number
  trainer?: number
  commute?: number
}

type GetActivityByIdRequest = {
  id: number
  include_all_efforts?: boolean
}

type GetCommentsByActivityIdRequest = {
  id: number
  page?: number
  per_page?: number
}

type GetKudoersByActivityIdRequest = {
  id: number
  page?: number
  per_page?: number
}

type GetLapsByActivityIdRequest = {
  id: number
}

type GetZonesByActivityIdRequest = {
  id: number
}

type GetLoggedInAthleteActivitiesRequest = {
  before?: number
  after?: number
  page?: number
  per_page?: number
}

type UpdateActivityByIdRequest = {
  id: number
  name: string
  type: ActivityType
  start_date_local: Date
  elapsed_time: number
  description?: string
  distance?: number
  trainer?: number
  commute?: number
}

export class Activities {
  private readonly request: Request

  constructor(request) {
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
