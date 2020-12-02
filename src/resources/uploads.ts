import { Upload } from '../models'
import { Request } from '../request'

type createUploadRequest = {
  file: File
  name: string
  description: string
  trainer: string
  commute: string
  data_type: 'fit' | 'fit.gz' | 'tcx' | 'tcx.gz' | 'gpx' | 'gpx.gz'
  external_id: string
}

type GetUploadByIdRequest = {
  uploadId: number
}

export class Uploads {
  private readonly request: Request

  constructor(request) {
    this.request = request
  }

  async createUpload(params: createUploadRequest): Promise<Upload> {
    return await this.request.makeApiRequest<Upload>('post', '/uploads', {
      body: params,
    })
  }

  async getUploadById(params: GetUploadByIdRequest): Promise<Upload> {
    const { uploadId } = params
    return await this.request.makeApiRequest<Upload>(
      'get',
      `/uploads/${uploadId}`,
    )
  }
}
