import { DetailedSegment, ExplorerResponse, SummarySegment } from '../models'
import { Request } from '../request'

type ActivityType = 'running' | 'ridding'

type ExploreSegmentsRequest = {
  bounds: string
  activity_type?: ActivityType
  min_cat?: number
  max_cat?: number
}

type GetLoggedInAthleteStarredSegmentsRequest = {
  page?: number
  per_page?: number
}

type GetSegmentByIdRequest = {
  id: number
}

type StarSegmentRequest = {
  id: number
  starred: boolean
}

export class Segments {
  private readonly request: Request

  constructor(request: Request) {
    this.request = request
  }

  async exploreSegments(
    params: ExploreSegmentsRequest,
  ): Promise<ExplorerResponse> {
    return await this.request.makeApiRequest<ExplorerResponse>(
      'get',
      '/segments/explore',
      { query: params },
    )
  }

  async getLoggedInAthleteStarredSegments(
    params: GetLoggedInAthleteStarredSegmentsRequest,
  ): Promise<SummarySegment[]> {
    return await this.request.makeApiRequest<SummarySegment[]>(
      'get',
      '/segments/starred',
      { query: params },
    )
  }

  async getSegmentById(
    params: GetSegmentByIdRequest,
  ): Promise<DetailedSegment> {
    const { id } = params
    return await this.request.makeApiRequest<DetailedSegment>(
      'get',
      `/segments/${id}`,
    )
  }

  async starSegment(params: StarSegmentRequest): Promise<DetailedSegment> {
    const { id, ...body } = params
    return await this.request.makeApiRequest<DetailedSegment>(
      'put',
      `/segments/${id}/starred`,
      { body },
    )
  }
}
