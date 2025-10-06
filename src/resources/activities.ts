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

export type CreateActivityRequest = {
  name: string
  sport_type: ActivityType
  start_date_local: string
  elapsed_time: number
  description?: string
  distance?: number
  trainer?: number
  commute?: number
}

export type GetActivityByIdRequest = {
  id: number
  include_all_efforts?: boolean
}

export type GetCommentsByActivityIdRequest = {
  id: number
  page?: number
  page_size?: number
  after_cursor?: string
}

export type GetKudoersByActivityIdRequest = {
  id: number
  page?: number
  per_page?: number
}

export type GetLapsByActivityIdRequest = {
  id: number
}

export type GetZonesByActivityIdRequest = {
  id: number
}

export type GetLoggedInAthleteActivitiesRequest = {
  before?: number
  after?: number
  page?: number
  per_page?: number
}

export type UpdateActivityByIdRequest = {
  id: number
  name?: string
  sport_type?: ActivityType
  start_date_local?: string
  elapsed_time?: number
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
    access_token?: string,
  ): Promise<DetailedActivity> {
    return await this.request.makeApiRequest<DetailedActivity>(
      'post',
      '/activities',
      { body: params, access_token },
    )
  }

  async getActivityById(
    params: GetActivityByIdRequest,
    access_token?: string,
  ): Promise<DetailedActivity> {
    const { id, ...query } = params
    return await this.request.makeApiRequest<DetailedActivity>(
      'get',
      `/activities/${id}`,
      { query, access_token },
    )
  }

  async getCommentsByActivityId(
    params: GetCommentsByActivityIdRequest,
    access_token?: string,
  ): Promise<Comment[]> {
    const { id, ...query } = params
    return await this.request.makeApiRequest<Comment[]>(
      'get',
      `/activities/${id}/comments`,
      { query, access_token },
    )
  }

  async getKudoersByActivityId(
    params: GetKudoersByActivityIdRequest,
    access_token?: string,
  ): Promise<SummaryAthlete[]> {
    const { id, ...query } = params
    return await this.request.makeApiRequest<SummaryAthlete[]>(
      'get',
      `/activities/${id}/kudos`,
      { query, access_token },
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
    access_token?: string,
  ): Promise<ActivityZone[]> {
    const { id, ...query } = params
    return await this.request.makeApiRequest<ActivityZone[]>(
      'get',
      `/activities/${id}/zones`,
      { query, access_token },
    )
  }

  async updateActivityById(
    params: UpdateActivityByIdRequest,
    access_token?: string,
  ): Promise<DetailedActivity> {
    const { id, ...body } = params
    return await this.request.makeApiRequest<DetailedActivity>(
      'put',
      `/activities/${id}`,
      { body, access_token },
    )
  }
}
