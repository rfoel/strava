import nock from 'nock'

import { Strava } from '../../src'
import * as mocks from '../mocks'

const scope = nock('https://www.strava.com/api/v3')

describe('streams', () => {
  let strava: Strava

  beforeAll(() => {
    strava = mocks.auth()
  })

  it('calls getActivityStreams', async () => {
    const query = {
      keys: ['altitude', 'cadence'].join(','),
      key_by_type: true,
    }

    scope
      .get(`/activities/${1}/streams`)
      .query(query)
      .reply(200, {})

    await strava.streams.getActivityStreams({
      id: 1,
      keys: ['altitude', 'cadence'],
    })
  })

  it('calls getRouteStreams', async () => {
    scope.get(`/routes/${1}/streams`).reply(200, {})

    await strava.streams.getRouteStreams({
      id: 1,
    })
  })

  it('calls getSegmentEffortStreams', async () => {
    const query = {
      keys: ['altitude', 'cadence'].join(','),
      key_by_type: true,
    }

    scope
      .get(`/segment_efforts/${1}/streams`)
      .query(query)
      .reply(200, {})

    await strava.streams.getSegmentEffortStreams({
      id: 1,
      keys: ['altitude', 'cadence'],
    })
  })

  it('calls getSegmentStreams', async () => {
    const query = {
      keys: ['altitude', 'cadence'].join(','),
      key_by_type: true,
    }

    scope
      .get(`/segments/${1}/streams`)
      .query(query)
      .reply(200, {})

    await strava.streams.getSegmentStreams({
      id: 1,
      keys: ['altitude', 'cadence'],
    })
  })
})
