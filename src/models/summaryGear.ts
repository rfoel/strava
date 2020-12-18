import { ResourceState } from '../enums'

export interface SummaryGear {
  id: string
  primary: boolean
  name: string
  resource_state: ResourceState
  distance: number
}
