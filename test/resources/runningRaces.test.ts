import nock from 'nock'

import { Strava } from '../../src'
import * as mocks from '../mocks'

const scope = nock('https://www.strava.com/api/v3')

describe('runningRaces', () => {
  let strava: Strava

  beforeAll(() => {
    strava = mocks.auth()
  })

  it('calls getRunningRaceById', async () => {
    scope.get(`/running_races/${1}`).reply(200, {})

    await strava.runningRaces.getRunningRaceById({ id: 1 })
  })

  it('calls getRunningRaces', async () => {
    const query = { year: 2021 }

    scope
      .get(`/running_races`)
      .query(query)
      .reply(200, {})

    await strava.runningRaces.getRunningRaces(query)
  })
})
