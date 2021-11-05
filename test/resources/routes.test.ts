import nock from 'nock'

import { Strava } from '../../src'
import * as mocks from '../mocks'

const scope = nock('https://www.strava.com/api/v3')

describe('routes', () => {
  let strava: Strava

  beforeAll(() => {
    strava = mocks.auth()
  })

  it('calls getRouteAsGPX', async () => {
    scope.get(`/routes/${1}/export_gpx`).reply(200, {})

    await strava.routes.getRouteAsGPX({ id: 1 })
  })

  it('calls getRouteAsTCX', async () => {
    scope.get(`/routes/${1}/export_tcx`).reply(200, {})

    await strava.routes.getRouteAsTCX({ id: 1 })
  })

  it('calls getRouteById', async () => {
    scope.get(`/routes/${1}`).reply(200, {})

    await strava.routes.getRouteById({ id: 1 })
  })

  it('calls getRoutesByAthleteId', async () => {
    const query = { page: 1, per_page: 1 }

    scope
      .get(`/athletes/${1}/routes`)
      .query(query)
      .reply(200, {})

    await strava.routes.getRoutesByAthleteId({ id: 1, page: 1, per_page: 1 })
  })
})
