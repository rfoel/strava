import { ActivityType, ResourceState, SportType } from '../enums'
import { LatLng } from '../types'

import {
  ActivityZone,
  DetailedSegmentEffort,
  Lap,
  MetaAthlete,
  PhotoSummary,
  PolylineMap,
  SimilarActivity,
  Split,
  SummaryGear,
} from '.'

export interface DetailedActivity {
  resource_state: ResourceState
  athlete: MetaAthlete
  name: string
  distance: number
  moving_time: number
  elapsed_time: number
  total_elevation_gain: number
  type: ActivityType
  sport_type: SportType
  workout_type: number
  id: number
  external_id: string
  upload_id: number
  start_date: string
  start_date_local: string
  timezone: string
  utc_offset: number
  start_latlng: LatLng
  end_latlng: LatLng
  location_city: string
  location_state: string
  location_country: string
  start_latitude: number
  start_longitude: number
  achievement_count: number
  kudos_count: number
  comment_count: number
  athlete_count: number
  photo_count: number
  map: PolylineMap
  trainer: boolean
  commute: boolean
  manual: boolean
  private: boolean
  visibility: string
  flagged: boolean
  gear_id: string
  from_accepted_tag: boolean
  upload_id_str: string
  average_speed: number
  max_speed: number
  has_heartrate: boolean
  average_heartrate: number
  max_heartrate: number
  heartrate_opt_out: boolean
  display_hide_heartrate_option: boolean
  elev_high: number
  elev_low: number
  pr_count: number
  total_photo_count: number
  has_kudoed: boolean
  description: string
  calories: number
  perceived_exertion: string
  prefer_perceived_exertion: string
  segment_efforts: DetailedSegmentEffort[]
  splits_metric: Split[]
  splits_standard: Split[]
  laps: Lap[]
  best_efforts: DetailedSegmentEffort[]
  gear: SummaryGear
  photos: PhotoSummary
  device_name: string
  embed_token: string
  similar_activities: SimilarActivity
  available_zones: ActivityZone[]
  average_cadence: number
  average_watts: number
  device_watts: boolean
  kilojoules: number
  max_watts: number
  suffer_score: number
  private_note: string
}
