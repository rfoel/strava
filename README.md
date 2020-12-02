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

The way the library is implemented the user must have gone through the [Strava OAuth flow](https://developers.strava.com/docs/authentication/) beforehand and got a refresh token. This way we can ensure that whenever needed we get a new access token.

This may not be the best way to work with the API and I'm open to suggestion to make it better.

```javascript
import { Strava } from 'strava'

const strava = new Strava({
  client_id: '123',
  client_secret: 'abc',
  refresh_token: 'def',
})

;(async () => {
  try {
    const activities = await strava.activities.getLoggedInAthleteActivities()
    console.log(activities)
  } catch (error) {
    console.log(error)
  }
})()
```

## Contributing

Issues and pull requests are welcome.

## License

[MIT](https://github.com/rfoell/strava/blob/master/LICENSE)
