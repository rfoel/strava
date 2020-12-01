import { SummarySegmentEffort } from '.'

enum ClimbCategoryDesc {
  NC = 'NC',
  1 = '1',
  2 = '2',
  3 = '3',
  4 = '4',
  HC = 'HC',
}

export interface ExplorerSegment {
  id: number
  name: string
  climb_category: number
  climb_category_desc: ClimbCategoryDesc
  avg_grade: number
  start_latlng: number[]
  end_latlng: number[]
  elev_difference: number
  distance: number
  points: string
}
