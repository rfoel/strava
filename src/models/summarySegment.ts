import { SummarySegmentEffort } from '.'
import { LatLng } from '../types'

enum ActivityType {
  Ride = 'Ride',
  Run = 'Run',
}

export interface SummarySegment {
  id: number
  name: string
  activity_type: ActivityType
  distance: number
  average_grade: number
  maximum_grade: number
  elevation_high: number
  elevation_low: number
  start_latlng: LatLng
  end_latlng: LatLng
  climb_category: number
  city: string
  state: string
  country: string
  private: boolean
  athlete_pr_effort: SummarySegmentEffort
}
