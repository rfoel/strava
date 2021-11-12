import { LatLng, StreamKeys } from '..'

export interface BaseStream<StreamKey extends StreamKeys, Data> {
  type: StreamKey
  original_size: number
  resolution: 'low' | 'medium' | 'high'
  series_type: 'distance' | 'time'
  data: Data[]
}

export type Stream = BaseStream<
  | 'time'
  | 'distance'
  | 'altitude'
  | 'velocity_smooth'
  | 'heartrate'
  | 'cadence'
  | 'watts'
  | 'temp'
  | 'moving'
  | 'grade_smooth',
  number
>

export type LatLngStream = BaseStream<'latlng', LatLng>
