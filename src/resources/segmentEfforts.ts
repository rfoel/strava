import { DetailedSegmentEffort } from '../models'
import { Request } from '../request'

type GetEffortsBySegmentIdRequest = {
  segment_id: number
  start_date_local?: string
  end_date_local?: string
  per_page?: number
}

type GetSegmentEffortByIdRequest = {
  id: number
}

export class SegmentEfforts {
  private readonly request: Request

  constructor(request: Request) {
    this.request = request
  }

  async getEffortsBySegmentId(
    params: GetEffortsBySegmentIdRequest,
  ): Promise<DetailedSegmentEffort[]> {
    return await this.request.makeApiRequest<DetailedSegmentEffort[]>(
      'get',
      '/segment_efforts',
      { query: params },
    )
  }

  async getSegmentEffortById(
    params: GetSegmentEffortByIdRequest,
  ): Promise<DetailedSegmentEffort> {
    const { id } = params
    return await this.request.makeApiRequest<DetailedSegmentEffort>(
      'get',
      `/segment_efforts/${id}`,
    )
  }
}
