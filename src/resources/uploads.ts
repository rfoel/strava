import FormData from 'form-data'
import { ReadStream } from 'fs'

import { Upload } from '../models'
import { Request } from '../request'

type CreateUploadRequest = {
  file: ReadStream
  data_type: 'fit' | 'fit.gz' | 'tcx' | 'tcx.gz' | 'gpx' | 'gpx.gz'
  name?: string
  description?: string
  trainer?: string
  commute?: string
  external_id?: string
}

type GetUploadByIdRequest = {
  uploadId: number
}

export class Uploads {
  private readonly request: Request

  constructor(request: Request) {
    this.request = request
  }

  async createUpload(params: CreateUploadRequest): Promise<Upload | void> {
    const form = new FormData()
    Object.entries(params).forEach(([key, value]) => {
      form.append(key, value)
    })
    const headers = {
      ...form.getHeaders(),
      'content-length': 0,
      host: 'www.strava.com',
    }
    form.getLength((error, length) => {
      if (error) throw error
      headers['content-length'] = length
    })
    return this.request.makeApiRequest<Upload>('post', '/uploads', {
      body: form,
      headers,
    })
  }

  async getUploadById(
    params: GetUploadByIdRequest,
    access_token?: string,
  ): Promise<Upload> {
    const { uploadId } = params
    return await this.request.makeApiRequest<Upload>(
      'get',
      `/uploads/${uploadId}`,
      { access_token },
    )
  }
}
