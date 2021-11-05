import nock from 'nock'

import { Strava } from '../../src'
import * as mocks from '../mocks'

const scope = nock('https://www.strava.com/api/v3')

describe('segments', () => {
  let strava: Strava

  beforeAll(() => {
    strava = mocks.auth()
  })

  it('calls getEffortsBySegmentId', async () => {
    const query = {
      bounds: '-23.5931, -46.6859, -23.4987, -46.5218',
      activity_type: 'running' as const,
      min_cat: 1,
      max_cat: 1,
    }

    scope
      .get('/segments/explore')
      .query(query)
      .reply(200, {})

    await strava.segments.exploreSegments(query)
  })

  it('calls getLoggedInAthleteStarredSegments', async () => {
    const query = {
      page: 1,
      per_page: 1,
    }

    scope
      .get('/segments/starred')
      .query(query)
      .reply(200, {})

    await strava.segments.getLoggedInAthleteStarredSegments(query)
  })

  it('calls getSegmentById', async () => {
    scope.get(`/segments/${1}`).reply(200, {})

    await strava.segments.getSegmentById({ id: 1 })
  })

  it('calls starSegment', async () => {
    const body = { starred: true }

    scope.put(`/segments/${1}/starred`, body).reply(200, {})

    await strava.segments.starSegment({ id: 1, starred: true })
  })
})
