# Strava

[![npm](https://img.shields.io/npm/v/strava)](https://www.npmjs.com/strava)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/strava)](https://www.npmjs.com/strava)
[![NPM](https://img.shields.io/npm/l/strava)](LICENSE)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This library is a fully typed JavaScript wrapper of the [Strava JSON API](https://developers.strava.com/docs/reference/).

## Installation

To install the package, run:

```
npm install strava
```

or

```
yarn add strava
```

## Usage

The library can be initialized with a refresh token and optionally an access token.
If these are not available, see below (**Token exchange**).

```javascript
import { Strava } from 'strava'

const strava = new Strava({
  client_id: '123',
  client_secret: 'abc',
  refresh_token: 'def',
})

try {
  const activities = await strava.activities.getLoggedInAthleteActivities()
  console.log(activities)
} catch (error) {
  console.log(error)
}
```

### Refreshing the access token

This library will automatically refresh the access token when needed.
In order to store the token, you can use the `on_token_refresh` callback.
This received an `AccessToken` object (consisting of `access_token`, `expires_at`, and `refresh_token`).
Note that the refresh token as returned by this call can sometimes change,
at which point the old token becomes invalid.

An `AccessToken` object can also be passed as a second argument to the Strava constructor.
This can save an initial token refresh.
As `AccessToken` contains a refresh token,
the first argument does not need to contain a refresh token.

```javascript
import { Strava } from 'strava'

const strava = new Strava(
  {
    client_id: '123',
    client_secret: 'abc',

    on_token_refresh: (response) => {
      cache.accessToken = response
    },
  },
  cache.accessToken,
)
```

### Token exchange

When a user logs in for the first time, you will need to perform authorization with OAuth.
This involves sending the user to <https://www.strava.com/oauth/authorize>,
and receiving the auth code as a query parameter.

This can be used as follows:

```javascript
import { Strava } from 'strava'

try {
  const strava = await Strava.createFromTokenExchange(
    {
      client_id: '123',
      client_secret: 'abc',
    },
    token,
  )

  const activities = await strava.activities.getLoggedInAthleteActivities()
  console.log(activities)
} catch (error) {
  console.log(error)
}
```

### Getting athlete info

When a user logs in for the first time, the Strava API returns information about the newly logged-in user.
This can be read using the on_token_refresh callback.
Note that this will only ever be provided on the initial token exchange,
before the promise returned from `Strava.createFromTokenExchange` returns.
When the `on_token_refresh` callback is called again after the token expires,
`response.athlete` will always be undefined.

```javascript
import { Strava } from 'strava'

try {
  const strava = await Strava.createFromTokenExchange(
    {
      client_id: '123',
      client_secret: 'abc',
      on_token_refresh: (response) => {
        if (response.athlete) {
          console.log(response.athlete)
        }

        db.set('refresh_token', response.refresh_token)
      },
    },
    token,
  )

  const activities = await strava.activities.getLoggedInAthleteActivities()
  console.log(activities)
} catch (error) {
  console.log(error)
}
```

### API Rate Limits

The Strava API has rate limits: 200 requests per 15 minutes and 2,000 requests per day.
This library automatically tracks rate limit information from API responses.

You can access rate limit information in two ways:

**1. Using the `getRateLimit()` method:**

```javascript
const strava = new Strava({
  client_id: '123',
  client_secret: 'abc',
  refresh_token: 'def',
})

await strava.activities.getLoggedInAthleteActivities()

const rateLimit = strava.getRateLimit()
if (rateLimit) {
  console.log(`Short term: ${rateLimit.shortTermUsage}/${rateLimit.shortTermLimit}`)
  console.log(`Daily: ${rateLimit.longTermUsage}/${rateLimit.longTermLimit}`)
}
```

**2. Using the `on_rate_limit_update` callback:**

```javascript
const strava = new Strava({
  client_id: '123',
  client_secret: 'abc',
  refresh_token: 'def',
  on_rate_limit_update: (rateLimit) => {
    console.log('Rate limit updated:', rateLimit)

    // Check if approaching limits
    if (rateLimit.shortTermUsage > rateLimit.shortTermLimit * 0.9) {
      console.warn('Approaching 15-minute rate limit!')
    }
  },
})
```

The `RateLimit` object contains:
- `shortTermLimit` - 15-minute request limit
- `shortTermUsage` - Current 15-minute usage
- `longTermLimit` - Daily request limit
- `longTermUsage` - Current daily usage
- `timestamp` - When the rate limit was last updated

## Contributing

Issues and pull requests are welcome.

## License

[MIT](https://github.com/rfoel/strava/blob/master/LICENSE)
