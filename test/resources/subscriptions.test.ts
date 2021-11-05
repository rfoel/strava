import nock from 'nock'

import { Strava } from '../../src'
import * as mocks from '../mocks'

const scope = nock('https://www.strava.com/api/v3')

describe('subscriptions', () => {
  let strava: Strava

  beforeAll(() => {
    strava = mocks.auth()
  })

  it('calls createSubscription', async () => {
    scope
      .post('/push_subscriptions', {
        callback_url: 'callback_url',
        verify_token: 'verify_token',
        client_id: 'client_id',
        client_secret: 'client_secret',
      })
      .reply(200, {})

    await strava.subscriptions.createSubscription({
      callback_url: 'callback_url',
      verify_token: 'verify_token',
    })
  })

  it('calls deleteSubscription', async () => {
    const body = {
      client_id: 'client_id',
      client_secret: 'client_secret',
    }

    scope.delete(`/push_subscriptions/${1}`, body).reply(200, {})

    await strava.subscriptions.deleteSubscription(1)
  })

  it('calls getSubscriptions', async () => {
    const query = {
      client_id: 'client_id',
      client_secret: 'client_secret',
    }

    scope
      .get(`/push_subscriptions`)
      .query(query)
      .reply(200, {})

    await strava.subscriptions.getSubscriptions()
  })
})
