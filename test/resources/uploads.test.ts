import fs from 'fs'
import nock from 'nock'

import { Strava } from '../../src'
import * as mocks from '../mocks'

const scope = nock('https://www.strava.com/api/v3')

describe('uploads', () => {
  let strava: Strava

  beforeAll(() => {
    strava = mocks.auth()
  })

  it('calls createUpload', async () => {
    const file = fs.createReadStream(`${__dirname}/../Morning_Run.gpx`)

    scope.post('/uploads').reply(201, {})

    await strava.uploads.createUpload({
      data_type: 'gpx',
      file,
    })
  })

  it('calls getUploadById', async () => {
    scope.get(`/uploads/${1}`).reply(200, {})

    await strava.uploads.getUploadById({
      uploadId: 1,
    })
  })
})
