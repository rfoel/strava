import nock from 'nock'

import { Strava } from '../../src'
import * as mocks from '../mocks'

const scope = nock('https://www.strava.com/api/v3')

describe('clubs', () => {
  let strava: Strava

  beforeAll(() => {
    strava = mocks.auth()
  })

  it('calls getClubActivitiesById', async () => {
    const query = { page: 1, per_page: 1 }
    scope
      .get(`/clubs/${1}/activities`)
      .query(query)
      .reply(200, {})

    await strava.clubs.getClubActivitiesById({ id: 1, page: 1, per_page: 1 })
  })

  it('calls getClubAdminsById', async () => {
    const query = { page: 1, per_page: 1 }
    scope
      .get(`/clubs/${1}/admins`)
      .query(query)
      .reply(200, {})

    await strava.clubs.getClubAdminsById({ id: 1, page: 1, per_page: 1 })
  })

  it('calls getClubById', async () => {
    scope.get(`/clubs/${1}`).reply(200, {})

    await strava.clubs.getClubById({ id: 1 })
  })

  it('calls getClubMembersById', async () => {
    const query = { page: 1, per_page: 1 }

    scope
      .get(`/clubs/${1}/members`)
      .query(query)
      .reply(200, {})

    await strava.clubs.getClubMembersById({ id: 1, page: 1, per_page: 1 })
  })

  it('calls getLoggedInAthleteClubs', async () => {
    const query = { page: 1, per_page: 1 }

    scope
      .get('/athlete/clubs')
      .query(query)
      .reply(200, {})

    await strava.clubs.getLoggedInAthleteClubs(query)
  })
})
