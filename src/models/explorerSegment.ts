import { LatLng } from '../types'

enum ClimbCategoryDesc {
  NC = 'NC',
  ONE = '1',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  HC = 'HC',
}

export interface ExplorerSegment {
  id: number
  name: string
  climb_category: number
  climb_category_desc: ClimbCategoryDesc
  avg_grade: number
  start_latlng: LatLng
  end_latlng: LatLng
  elev_difference: number
  distance: number
  points: string
}
