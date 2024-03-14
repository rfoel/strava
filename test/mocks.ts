import { Strava } from '../src'
import nock from 'nock'

export const auth = () => {
  nock('https://www.strava.com')
    .post(
      '/oauth/token',
      'client_id=client_id&client_secret=client_secret&refresh_token=refresh_token&grant_type=refresh_token',
    )
    .reply(200, {})
  return new Strava({
    client_id: 'client_id',
    client_secret: 'client_secret',
    refresh_token: 'refresh_token',
  })
}
