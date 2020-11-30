export interface Stream {
  type:
    | 'time'
    | 'distance'
    | 'latlng'
    | 'altitude'
    | 'velocity_smooth'
    | 'heartrate'
    | 'cadence'
    | 'watts'
    | 'temp'
    | 'moving'
    | 'grade_smooth'
  original_size: number
  resolution: 'low' | 'medium' | 'high'
  series_type: 'distance' | 'time'
  data: number[]
}
