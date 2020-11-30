import { MetaActivity, MetaAthlete, SummarySegment } from '.'

export interface DetailedSegmentEffort {
  id: number
  elapsed_time: number
  start_date: Date
  start_date_local: Date
  distance: number
  is_kom: boolean
  name: string
  activity: MetaActivity
  athlete: MetaAthlete
  moving_time: number
  start_index: number
  end_index: number
  average_cadence: number
  average_watts: number
  device_watts: boolean
  average_heartrate: number
  max_heartrate: number
  segment: SummarySegment
  kom_rank: number
  pr_rank: number
  hidden: boolean
}
