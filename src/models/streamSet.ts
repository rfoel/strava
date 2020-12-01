import { Stream } from '.'

export interface StreamSet {
  time: Stream
  distance: Stream
  latlng: Stream
  altitude: Stream
  velocity_smooth: Stream
  heartrate: Stream
  cadence: Stream
  watts: Stream
  temp: Stream
  moving: Stream
  grade_smooth: Stream
}
