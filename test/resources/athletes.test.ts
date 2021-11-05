import nock from 'nock'

import { Strava } from '../../src'
import * as mocks from '../mocks'

const scope = nock('https://www.strava.com/api/v3')

describe('athletes', () => {
  let strava: Strava

  beforeAll(() => {
    strava = mocks.auth()
  })

  it('calls getLoggedInAthlete', async () => {
    scope.get('/athlete').reply(200, {})

    await strava.athletes.getLoggedInAthlete()
  })

  it('calls getLoggedInAthleteZones', async () => {
    scope.get('/athlete/zones').reply(200, {})

    await strava.athletes.getLoggedInAthleteZones()
  })

  it('calls getStats', async () => {
    scope.get(`/athletes/${1}/stats`).reply(200, {})

    await strava.athletes.getStats({ id: 1 })
  })

  it('calls updateLoggedInAthlete', async () => {
    const body = { weight: 1 }

    scope.put(`/athlete`, body).reply(200, {})

    await strava.athletes.updateLoggedInAthlete(body)
  })
})
