import { ActivityType } from '../enums'

import { SummarySegmentEffort } from '.'

export interface SummarySegment {
  id: number
  name: string
  activity_type: ActivityType
  distance: number
  average_grade: number
  maximum_grade: number
  elevation_high: number
  elevation_low: number
  start_latlng: number[]
  end_latlng: number[]
  climb_category: number
  city: string
  state: string
  country: string
  private: boolean
  athlete_pr_effort: SummarySegmentEffort
}
