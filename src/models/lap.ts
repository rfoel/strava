import { MetaActivity, MetaAthlete } from '.'

export interface Lap {
  id: number
  activity: MetaActivity
  athlete: MetaAthlete
  average_cadence: number
  average_speed: number
  distance: number
  elapsed_time: number
  start_index: number
  end_index: number
  lap_index: number
  max_speed: number
  moving_time: number
  name: string
  pace_zone: number
  split: number
  start_date: Date
  start_date_local: Date
  total_elevation_gain: number
}
