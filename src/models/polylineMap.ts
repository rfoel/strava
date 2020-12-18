import { ResourceState } from '../enums'

export interface PolylineMap {
  id: string
  polyline: string
  resource_state: ResourceState
  summary_polyline: string
}
