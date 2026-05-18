import type { HttpClient } from './client'
import type {
  ActivityStats,
  ActivityZone,
  ClubActivity,
  ClubAthlete,
  Comment,
  CreateActivityData,
  CreateUploadData,
  DetailedActivity,
  DetailedAthlete,
  DetailedClub,
  DetailedGear,
  DetailedSegment,
  DetailedSegmentEffort,
  ExplorerResponse,
  ExploreSegmentsData,
  GetClubActivitiesByIdData,
  GetClubAdminsByIdData,
  GetClubMembersByIdData,
  GetCommentsByActivityIdData,
  GetEffortsBySegmentIdData,
  GetKudoersByActivityIdData,
  GetLoggedInAthleteActivitiesData,
  GetLoggedInAthleteClubsData,
  GetLoggedInAthleteStarredSegmentsData,
  GetRoutesByAthleteIdData,
  Lap,
  Route,
  StreamSet,
  SummaryActivity,
  SummaryAthlete,
  SummaryClub,
  SummarySegment,
  UpdatableActivity,
  Upload,
  Zones,
} from './generated/types.gen'

abstract class Resource {
  constructor(protected readonly http: HttpClient) {}
}

export class Athletes extends Resource {
  getLoggedInAthlete(): Promise<DetailedAthlete> {
    return this.http.request<DetailedAthlete>('GET', '/athlete')
  }

  updateLoggedInAthlete(params: { weight: number }): Promise<DetailedAthlete> {
    return this.http.request<DetailedAthlete>('PUT', '/athlete', {
      query: params,
    })
  }

  getLoggedInAthleteZones(): Promise<Zones> {
    return this.http.request<Zones>('GET', '/athlete/zones')
  }

  getStats(id: number): Promise<ActivityStats> {
    return this.http.request<ActivityStats>('GET', `/athletes/${id}/stats`)
  }
}

export type CreateActivityParams = CreateActivityData['body']
export type UpdateActivityParams = UpdatableActivity

export class Activities extends Resource {
  createActivity(params: CreateActivityParams): Promise<DetailedActivity> {
    return this.http.request<DetailedActivity>('POST', '/activities', {
      body: params,
      bodyFormat: 'form',
    })
  }

  getActivityById(
    id: number,
    params: { include_all_efforts?: boolean } = {},
  ): Promise<DetailedActivity> {
    return this.http.request<DetailedActivity>('GET', `/activities/${id}`, {
      query: params,
    })
  }

  updateActivityById(
    id: number,
    params: UpdateActivityParams,
  ): Promise<DetailedActivity> {
    return this.http.request<DetailedActivity>('PUT', `/activities/${id}`, {
      body: params,
    })
  }

  getLoggedInAthleteActivities(
    params: NonNullable<GetLoggedInAthleteActivitiesData['query']> = {},
  ): Promise<SummaryActivity[]> {
    return this.http.request<SummaryActivity[]>('GET', '/athlete/activities', {
      query: params,
    })
  }

  getLapsByActivityId(id: number): Promise<Lap[]> {
    return this.http.request<Lap[]>('GET', `/activities/${id}/laps`)
  }

  getZonesByActivityId(id: number): Promise<ActivityZone[]> {
    return this.http.request<ActivityZone[]>('GET', `/activities/${id}/zones`)
  }

  getCommentsByActivityId(
    id: number,
    params: NonNullable<GetCommentsByActivityIdData['query']> = {},
  ): Promise<Comment[]> {
    return this.http.request<Comment[]>('GET', `/activities/${id}/comments`, {
      query: params,
    })
  }

  getKudoersByActivityId(
    id: number,
    params: NonNullable<GetKudoersByActivityIdData['query']> = {},
  ): Promise<SummaryAthlete[]> {
    return this.http.request<SummaryAthlete[]>(
      'GET',
      `/activities/${id}/kudos`,
      { query: params },
    )
  }
}

export class Clubs extends Resource {
  getClubById(id: number): Promise<DetailedClub> {
    return this.http.request<DetailedClub>('GET', `/clubs/${id}`)
  }

  getClubMembersById(
    id: number,
    params: NonNullable<GetClubMembersByIdData['query']> = {},
  ): Promise<ClubAthlete[]> {
    return this.http.request<ClubAthlete[]>('GET', `/clubs/${id}/members`, {
      query: params,
    })
  }

  getClubAdminsById(
    id: number,
    params: NonNullable<GetClubAdminsByIdData['query']> = {},
  ): Promise<SummaryAthlete[]> {
    return this.http.request<SummaryAthlete[]>('GET', `/clubs/${id}/admins`, {
      query: params,
    })
  }

  getClubActivitiesById(
    id: number,
    params: NonNullable<GetClubActivitiesByIdData['query']> = {},
  ): Promise<ClubActivity[]> {
    return this.http.request<ClubActivity[]>('GET', `/clubs/${id}/activities`, {
      query: params,
    })
  }

  getLoggedInAthleteClubs(
    params: NonNullable<GetLoggedInAthleteClubsData['query']> = {},
  ): Promise<SummaryClub[]> {
    return this.http.request<SummaryClub[]>('GET', '/athlete/clubs', {
      query: params,
    })
  }
}

export class Gears extends Resource {
  getGearById(id: string): Promise<DetailedGear> {
    return this.http.request<DetailedGear>('GET', `/gear/${id}`)
  }
}

export class Routes extends Resource {
  getRouteById(id: number): Promise<Route> {
    return this.http.request<Route>('GET', `/routes/${id}`)
  }

  getRoutesByAthleteId(
    id: number,
    params: NonNullable<GetRoutesByAthleteIdData['query']> = {},
  ): Promise<Route[]> {
    return this.http.request<Route[]>('GET', `/athletes/${id}/routes`, {
      query: params,
    })
  }

  getRouteAsGPX(id: number): Promise<string> {
    return this.http.request<string>('GET', `/routes/${id}/export_gpx`, {
      parseAs: 'text',
    })
  }

  getRouteAsTCX(id: number): Promise<string> {
    return this.http.request<string>('GET', `/routes/${id}/export_tcx`, {
      parseAs: 'text',
    })
  }
}

export class Segments extends Resource {
  getSegmentById(id: number): Promise<DetailedSegment> {
    return this.http.request<DetailedSegment>('GET', `/segments/${id}`)
  }

  getLoggedInAthleteStarredSegments(
    params: NonNullable<GetLoggedInAthleteStarredSegmentsData['query']> = {},
  ): Promise<SummarySegment[]> {
    return this.http.request<SummarySegment[]>('GET', '/segments/starred', {
      query: params,
    })
  }

  starSegment(id: number, starred: boolean): Promise<DetailedSegment> {
    return this.http.request<DetailedSegment>(
      'PUT',
      `/segments/${id}/starred`,
      { body: { starred }, bodyFormat: 'form' },
    )
  }

  exploreSegments(
    params: ExploreSegmentsData['query'],
  ): Promise<ExplorerResponse> {
    return this.http.request<ExplorerResponse>('GET', '/segments/explore', {
      query: params,
    })
  }
}

export class SegmentEfforts extends Resource {
  getEffortsBySegmentId(
    params: GetEffortsBySegmentIdData['query'],
  ): Promise<DetailedSegmentEffort[]> {
    return this.http.request<DetailedSegmentEffort[]>(
      'GET',
      '/segment_efforts',
      { query: params },
    )
  }

  getSegmentEffortById(id: number): Promise<DetailedSegmentEffort> {
    return this.http.request<DetailedSegmentEffort>(
      'GET',
      `/segment_efforts/${id}`,
    )
  }
}

export type StreamKey =
  | 'time'
  | 'distance'
  | 'latlng'
  | 'altitude'
  | 'velocity_smooth'
  | 'heartrate'
  | 'cadence'
  | 'watts'
  | 'temp'
  | 'moving'
  | 'grade_smooth'

export type SegmentStreamKey = 'distance' | 'latlng' | 'altitude'

export class Streams extends Resource {
  getActivityStreams(id: number, keys: StreamKey[]): Promise<StreamSet> {
    return this.http.request<StreamSet>('GET', `/activities/${id}/streams`, {
      query: { keys, key_by_type: true },
    })
  }

  getSegmentEffortStreams(id: number, keys: StreamKey[]): Promise<StreamSet> {
    return this.http.request<StreamSet>(
      'GET',
      `/segment_efforts/${id}/streams`,
      { query: { keys, key_by_type: true } },
    )
  }

  getSegmentStreams(id: number, keys: SegmentStreamKey[]): Promise<StreamSet> {
    return this.http.request<StreamSet>('GET', `/segments/${id}/streams`, {
      query: { keys, key_by_type: true },
    })
  }

  getRouteStreams(id: number): Promise<StreamSet> {
    return this.http.request<StreamSet>('GET', `/routes/${id}/streams`)
  }
}

export type CreateUploadParams = NonNullable<CreateUploadData['body']> & {
  data_type: 'fit' | 'fit.gz' | 'tcx' | 'tcx.gz' | 'gpx' | 'gpx.gz'
  file: Blob | File
}

export class Uploads extends Resource {
  createUpload(params: CreateUploadParams): Promise<Upload> {
    const form = new FormData()
    form.append('file', params.file)
    form.append('data_type', params.data_type)
    for (const key of [
      'name',
      'description',
      'trainer',
      'commute',
      'external_id',
    ] as const) {
      const value = params[key]
      if (value !== undefined) form.append(key, value)
    }
    return this.http.request<Upload>('POST', '/uploads', {
      body: form,
      bodyFormat: 'multipart',
    })
  }

  getUploadById(uploadId: number): Promise<Upload> {
    return this.http.request<Upload>('GET', `/uploads/${uploadId}`)
  }
}
