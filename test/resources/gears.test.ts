import nock from 'nock'

import { Strava } from '../../src'
import * as mocks from '../mocks'

const scope = nock('https://www.strava.com/api/v3')

describe('gears', () => {
  let strava: Strava

  beforeAll(() => {
    strava = mocks.auth()
  })

  it('calls getClubActivitiesById', async () => {
    scope.get(`/gear/${1}`).reply(200, {})

    await strava.gears.getGearById({ id: 1 })
  })
})
