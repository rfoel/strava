import { DetailedSegmentEffort } from '../models'

import { Request } from '../request'

type GetEffortsBySegmentIdRequest = {
  segment_id: number
  start_date_local?: Date
  end_date_local?: Date
  per_page?: number
}

type getSegmentEffortByIdRequest = {
  id: number
}

export class SegmentEfforts {
  private readonly request: Request

  constructor(request) {
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
    params: getSegmentEffortByIdRequest,
  ): Promise<DetailedSegmentEffort> {
    const { id } = params
    return await this.request.makeApiRequest<DetailedSegmentEffort>(
      'get',
      `/segment_efforts/${id}`,
    )
  }
}
