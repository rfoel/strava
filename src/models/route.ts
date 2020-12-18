import { RouteSubType, RouteType } from '../enums'

import { PolylineMap, SummaryAthlete, SummarySegment } from '.'

export interface Route {
  athlete: SummaryAthlete
  description: string
  distance: number
  elevation_gain: number
  id: number
  id_srt: string
  map: PolylineMap
  name: string
  private: boolean
  starred: boolean
  timestamp: number
  type: RouteType
  sub_type: RouteSubType
  created_at: string
  updated_at: string
  estimated_moving_time: number
  segments: SummarySegment[]
}
