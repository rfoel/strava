import { ActivityType } from '../enums'
import {
  ActivityZone,
  Comment,
  DetailedActivity,
  DetailedClub,
  Lap,
  SummaryActivity,
  SummaryAthlete,
  SummaryClub,
} from '../models'
import { Request } from '../request'

type GetClubActivitiesByIdRequest = {
  id: number
  page?: number
  per_page?: number
}

type GetClubAdminsByIdRequest = {
  id: number
  page?: number
  per_page?: number
}

type GetClubByIdRequest = {
  id: number
}

type GetClubMembersByIdRequest = {
  id: number
  page?: number
  per_page?: number
}

type getLoggedInAthleteClubsRequest = {
  page?: number
  per_page?: number
}

export class Clubs {
  private readonly request: Request

  constructor(request) {
    this.request = request
  }

  async getClubActivitiesById(
    params: GetClubActivitiesByIdRequest,
  ): Promise<SummaryActivity[]> {
    const { id, ...query } = params
    return await this.request.makeApiRequest<SummaryActivity[]>(
      'get',
      `/clubs/${id}/activities`,
      { query },
    )
  }

  async getClubAdminsById(
    params: GetClubAdminsByIdRequest,
  ): Promise<SummaryAthlete[]> {
    const { id, ...query } = params
    return await this.request.makeApiRequest<SummaryAthlete[]>(
      'get',
      `/clubs/${id}/admins`,
      { query },
    )
  }

  async getClubById(params: GetClubByIdRequest): Promise<DetailedClub> {
    const { id } = params
    return await this.request.makeApiRequest<DetailedClub>(
      'get',
      `/clubs/${id}`,
    )
  }

  async getClubMembersById(
    params: GetClubMembersByIdRequest,
  ): Promise<SummaryAthlete[]> {
    const { id, ...query } = params
    return await this.request.makeApiRequest<SummaryAthlete[]>(
      'get',
      `/clubs/${id}/members`,
      { query },
    )
  }

  async getLoggedInAthleteClubs(
    params?: getLoggedInAthleteClubsRequest,
  ): Promise<SummaryClub[]> {
    return await this.request.makeApiRequest<SummaryClub[]>(
      'get',
      '/athlete/clubs',
      {
        query: params,
      },
    )
  }
}
