import { ResourceState } from '../enums'

import { Achievement, MetaActivity, MetaAthlete } from '.'

export interface DetailedSegmentEffort {
  id: number
  resource_state: ResourceState
  name: string
  activity: MetaActivity
  athlete: MetaAthlete
  elapsed_time: number
  moving_time: number
  start_date: string
  start_date_local: string
  distance: number
  start_index: number
  end_index: number
  pr_rank: string
  achievements: Achievement[]
}
