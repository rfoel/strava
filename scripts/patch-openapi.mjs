#!/usr/bin/env node
/**
 * Patches bugs in Strava's published OpenAPI spec before type generation.
 * Run after `swagger2openapi`, before `openapi-typescript`.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const file = process.argv[2]
if (!file) {
  console.error('usage: patch-openapi.mjs <path-to-openapi.json>')
  process.exit(1)
}

const spec = JSON.parse(readFileSync(file, 'utf8'))

// Bug 1: getRoutesByAthleteId is at `/athletes/{id}/routes` but the spec
// omits the `id` path parameter on the operation.
const routes = spec.paths?.['/athletes/{id}/routes']?.get
if (routes && !routes.parameters?.some((p) => p.name === 'id' && p.in === 'path')) {
  routes.parameters = [
    {
      name: 'id',
      in: 'path',
      required: true,
      description: 'The identifier of the athlete.',
      schema: { type: 'integer', format: 'int64' },
    },
    ...(routes.parameters ?? []),
  ]
}

// Bug 2: updateLoggedInAthlete marks `weight` as a path param, but the actual
// URL is `/athlete` and `weight` is a query parameter.
const updateAthlete = spec.paths?.['/athlete']?.put
if (updateAthlete) {
  updateAthlete.parameters = (updateAthlete.parameters ?? []).map((p) =>
    p.name === 'weight' ? { ...p, in: 'query' } : p,
  )
}

writeFileSync(file, JSON.stringify(spec, null, 2))
console.log(`patched ${file}`)
