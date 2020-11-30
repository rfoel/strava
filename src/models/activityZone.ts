import { ActivityZoneType } from '../enums'

import { TimedZoneRange } from '.'

export interface ActivityZone {
  score: number
  distribution_buckets: TimedZoneRange[]
  type: ActivityZoneType
  sensor_based: boolean
  points: number
  custom_zones: boolean
  max: number
}
