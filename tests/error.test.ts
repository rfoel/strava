import * as nock from 'nock'
import { Strava } from '../src'
import { StravaError } from '../src/errors'

const scope = nock('https://www.strava.com')

let strava: Strava

const mockAuth = () =>
  scope
    .post('/oauth/token')
    .query(true)
    .reply(200, {
      access_token: 'abc',
      expires_at: new Date().getTime() + 21600 / 1000,
      expires_in: 21600,
      refresh_token: 'def',
    })

beforeEach(() => {
  strava = new Strava({
    client_id: '123',
    client_secret: 'abc',
    refresh_token: 'def',
  })
})

it('should throw bad request error', async () => {
  mockAuth()
  scope.get('/api/v3/athlete/activities').query(true).reply(404, {
    status: 404,
    statusText: 'Not Found',
  })
  try {
    await strava.activities.getLoggedInAthleteActivities()
  } catch (error) {
    expect(error).toEqual(new StravaError(error, {}))
  }
})
