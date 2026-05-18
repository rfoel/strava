# Strava

[![npm](https://img.shields.io/npm/v/strava)](https://www.npmjs.com/strava)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/strava)](https://www.npmjs.com/strava)
[![NPM](https://img.shields.io/npm/l/strava)](LICENSE)

Fully typed JavaScript client for the [Strava API](https://developers.strava.com/docs/reference/). Types are generated from Strava's official OpenAPI spec with [`@hey-api/openapi-ts`](https://heyapi.dev/); the resource layer is hand-written for a flat, ergonomic call shape.

## Install

```bash
npm install strava
```

Requires Node 18+ (uses native `fetch` / `FormData`).

## Quick start

```ts
import { Strava } from 'strava'

const strava = new Strava({
  client_id: '123',
  client_secret: 'abc',
  refresh_token: 'def',
})

const activities = await strava.activities.getLoggedInAthleteActivities()

const activity = await strava.activities.getActivityById(12345, {
  include_all_efforts: true,
})

const stats = await strava.athletes.getStats(987)
```

Path IDs are positional. Everything else (query, body) lives in a single options object — Stripe-style.

The client refreshes the access token automatically when it's missing or near expiry. Provide an `access_token` to skip the initial refresh:

```ts
const strava = new Strava({
  client_id: '123',
  client_secret: 'abc',
  access_token: {
    access_token: '...',
    refresh_token: '...',
    expires_at: 1735689600,
  },
  on_token_refresh: (token) => {
    db.set('strava_token', token)
  },
})
```

## Authorization code exchange

```ts
import { Strava } from 'strava'

const { strava, token } = await Strava.fromAuthorizationCode(
  { client_id: '123', client_secret: 'abc' },
  code,
)

if (token.athlete) console.log('first login by', token.athlete.id)
```

For building the authorize URL:

```ts
import { OAuth } from 'strava'

const url = new OAuth().authorizeUrl({
  client_id: '123',
  redirect_uri: 'https://app.example.com/oauth/callback',
  scope: ['read', 'activity:read_all'],
})
```

## Rate limits

```ts
strava.getRateLimit()
// { shortTermLimit, shortTermUsage, longTermLimit, longTermUsage, timestamp }
```

Or via callback:

```ts
new Strava({
  client_id,
  client_secret,
  refresh_token,
  on_rate_limit_update: (rl) => console.log(rl),
})
```

## Errors

Non-2xx responses throw `StravaApiError` with `status`, `statusText`, and `data` (parsed `Fault` when JSON).

```ts
import { StravaApiError } from 'strava'

try {
  await strava.activities.getActivityById(1)
} catch (e) {
  if (e instanceof StravaApiError) console.log(e.status, e.data)
}
```

## Uploads

```ts
import { readFileSync } from 'node:fs'

const file = new Blob([readFileSync('ride.fit')])
const upload = await strava.uploads.createUpload({
  file,
  data_type: 'fit',
  name: 'Morning ride',
})
```

## Push subscriptions (webhooks)

Not in the OpenAPI spec; hand-typed module:

```ts
const sub = await strava.subscriptions.create({
  callback_url: 'https://app.example.com/strava/webhook',
  verify_token: 'STRAVA',
})

await strava.subscriptions.list()
await strava.subscriptions.delete(sub.id)
```

## Raw HTTP

For ops not wrapped, drop down to the typed HTTP layer:

```ts
const data = await strava.http.request<MyResponse>('GET', '/some/path', {
  query: { foo: 'bar' },
})
```

## Development

```bash
npm install
npm test           # vitest run
npm run test:watch
npm run lint
npm run build
```

## Regenerating types

```bash
npm run generate
```

Downloads `swagger.json`, converts to OpenAPI 3, patches known spec bugs, and regenerates `src/generated/types.gen.ts`. The output is committed — contributors don't need to run this unless the spec changes.

## License

[MIT](LICENSE)
