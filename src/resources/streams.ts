import { StreamKeys } from '../enums'
import { StreamSet } from '../models'
import { Request } from '../request'

type GetActivityStreamsRequest = {
  id: number
  keys: StreamKeys | StreamKeys[]
}

type GetRouteStreamsRequest = {
  id: number
}

type GetSegmentEffortStreamsRequest = {
  id: number
  keys: StreamKeys | StreamKeys[]
}

type GetSegmentStreamsRequest = {
  id: number
  keys: StreamKeys | StreamKeys[]
}

export class Streams {
  private readonly request: Request

  constructor(request: Request) {
    this.request = request
  }

  async getActivityStreams(
    params: GetActivityStreamsRequest,
  ): Promise<StreamSet> {
    const { id, ...query } = params
    return await this.request.makeApiRequest<StreamSet>(
      'get',
      `/activities/${id}/streams`,
      { query: { ...query, key_by_type: true } },
    )
  }

  async getRouteStreams(params: GetRouteStreamsRequest): Promise<StreamSet> {
    const { id } = params
    return await this.request.makeApiRequest<StreamSet>(
      'get',
      `/routes/${id}/streams`,
    )
  }

  async getSegmentEffortStreams(
    params: GetSegmentEffortStreamsRequest,
  ): Promise<StreamSet> {
    const { id, ...query } = params
    return await this.request.makeApiRequest<StreamSet>(
      'get',
      `/segment_efforts/${id}/streams`,
      { query: { ...query, key_by_type: true } },
    )
  }

  async getSegmentStreams(
    params: GetSegmentStreamsRequest,
  ): Promise<StreamSet> {
    const { id, ...query } = params
    return await this.request.makeApiRequest<StreamSet>(
      'get',
      `/segments/${id}/streams`,
      { query: { ...query, key_by_type: true } },
    )
  }
}
