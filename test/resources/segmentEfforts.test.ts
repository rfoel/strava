import nock from 'nock'

import { Strava } from '../../src'
import * as mocks from '../mocks'

const scope = nock('https://www.strava.com/api/v3')

describe('segmentEfforts', () => {
  let strava: Strava

  beforeAll(() => {
    strava = mocks.auth()
  })

  it('calls getEffortsBySegmentId', async () => {
    const query = {
      segment_id: 1,
      start_date_local: new Date().toISOString(),
      end_date_local: new Date().toISOString(),
      per_page: 1,
    }

    scope
      .get('/segment_efforts')
      .query(query)
      .reply(200, {})

    await strava.segmentEfforts.getEffortsBySegmentId(query)
  })

  it('calls getSegmentEffortById', async () => {
    scope.get(`/segment_efforts/${1}`).reply(200, {})

    await strava.segmentEfforts.getSegmentEffortById({ id: 1 })
  })
})
