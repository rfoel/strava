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
    access_token?: string,
  ): Promise<StreamSet> {
    const { id, ...query } = params
    return await this.request.makeApiRequest<StreamSet>(
      'get',
      `/activities/${id}/streams`,
      { query: { ...query, key_by_type: true }, access_token },
    )
  }

  async getRouteStreams(
    params: GetRouteStreamsRequest,
    access_token?: string,
  ): Promise<StreamSet> {
    const { id } = params
    return await this.request.makeApiRequest<StreamSet>(
      'get',
      `/routes/${id}/streams`,
      { access_token },
    )
  }

  async getSegmentEffortStreams(
    params: GetSegmentEffortStreamsRequest,
    access_token?: string,
  ): Promise<StreamSet> {
    const { id, ...query } = params
    return await this.request.makeApiRequest<StreamSet>(
      'get',
      `/segment_efforts/${id}/streams`,
      { query: { ...query, key_by_type: true }, access_token },
    )
  }

  async getSegmentStreams(
    params: GetSegmentStreamsRequest,
    access_token?: string,
  ): Promise<StreamSet> {
    const { id, ...query } = params
    return await this.request.makeApiRequest<StreamSet>(
      'get',
      `/segments/${id}/streams`,
      { query: { ...query, key_by_type: true }, access_token },
    )
  }
}
