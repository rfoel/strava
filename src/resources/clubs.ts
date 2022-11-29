import {
  DetailedClub,
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

  constructor(request: Request) {
    this.request = request
  }

  async getClubActivitiesById(
    params: GetClubActivitiesByIdRequest,
    access_token?: string,
  ): Promise<SummaryActivity[]> {
    const { id, ...query } = params
    return await this.request.makeApiRequest<SummaryActivity[]>(
      'get',
      `/clubs/${id}/activities`,
      { query, access_token },
    )
  }

  async getClubAdminsById(
    params: GetClubAdminsByIdRequest,
    access_token?: string,
  ): Promise<SummaryAthlete[]> {
    const { id, ...query } = params
    return await this.request.makeApiRequest<SummaryAthlete[]>(
      'get',
      `/clubs/${id}/admins`,
      { query, access_token },
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
    access_token?: string,
  ): Promise<SummaryAthlete[]> {
    const { id, ...query } = params
    return await this.request.makeApiRequest<SummaryAthlete[]>(
      'get',
      `/clubs/${id}/members`,
      { query, access_token },
    )
  }

  async getLoggedInAthleteClubs(
    params?: getLoggedInAthleteClubsRequest,
    access_token?: string,
  ): Promise<SummaryClub[]> {
    return await this.request.makeApiRequest<SummaryClub[]>(
      'get',
      '/athlete/clubs',
      {
        query: params,
        access_token,
      },
    )
  }
}
