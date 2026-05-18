import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: { path: './openapi/strava.json' },
  output: {
    path: 'src/generated',
    postProcess: ['prettier'],
  },
  plugins: ['@hey-api/typescript'],
})
