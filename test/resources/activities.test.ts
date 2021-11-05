import nock from 'nock'

import { Strava } from '../../src'
import * as mocks from '../mocks'

const scope = nock('https://www.strava.com/api/v3')

describe('activities', () => {
  let strava: Strava

  beforeAll(() => {
    strava = mocks.auth()
  })

  it('calls createActivity', async () => {
    const body = {
      elapsed_time: 1,
      name: 'a',
      start_date_local: new Date().toISOString(),
      type: 'Run' as const,
    }

    scope.post('/activities', body).reply(201, {})

    await strava.activities.createActivity(body)
  })

  it('calls getActivityById', async () => {
    const query = {
      include_all_efforts: true,
    }

    scope
      .get(`/activities/${1}`)
      .query(query)
      .reply(201, {})

    await strava.activities.getActivityById({
      id: 1,
      include_all_efforts: true,
    })
  })

  it('calls getCommentsByActivityId', async () => {
    const query = {
      page: 1,
      per_page: 1,
    }

    scope
      .get(`/activities/${1}/comments`)
      .query(query)
      .reply(200, {})

    await strava.activities.getCommentsByActivityId({
      id: 1,
      page: 1,
      per_page: 1,
    })
  })

  it('calls getKudoersByActivityId', async () => {
    const query = {
      page: 1,
      per_page: 1,
    }

    scope
      .get(`/activities/${1}/kudos`)
      .query(query)
      .reply(200, {})

    await strava.activities.getKudoersByActivityId({
      id: 1,
      page: 1,
      per_page: 1,
    })
  })

  it('calls getLapsByActivityId', async () => {
    scope.get(`/activities/${1}/laps`).reply(200, {})

    await strava.activities.getLapsByActivityId({
      id: 1,
    })
  })

  it('calls getLoggedInAthleteActivities', async () => {
    const query = {
      before: +new Date(),
      after: +new Date(),
      page: 1,
      per_page: 1,
    }

    scope
      .get('/athlete/activities')
      .query(query)
      .reply(200, {})

    await strava.activities.getLoggedInAthleteActivities(query)
  })

  it('calls getPhotosByActivityId', async () => {
    const query = { photo_sources: true, size: 1 }

    scope
      .get(`/activities/${1}/photos`)
      .query(query)
      .reply(200, {})

    await strava.activities.getPhotosByActivityId({
      id: 1,
      photo_sources: true,
      size: 1,
    })
  })

  it('calls getZonesByActivityId', async () => {
    scope.get(`/activities/${1}/zones`).reply(200, {})

    await strava.activities.getZonesByActivityId({
      id: 1,
    })
  })

  it('calls updateActivityById', async () => {
    const body = {
      commute: 1,
    }

    scope.put(`/activities/${1}`, body).reply(200, {})

    await strava.activities.updateActivityById({ id: 1, ...body })
  })
})
