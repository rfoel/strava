import { UnitSystem } from '../enums'

export interface RunningRace {
  id: number
  name: string
  running_race_type: number
  distance: number
  start_date_local: string
  city: string
  state: string
  country: string
  route_ids: number[]
  measurement_preference: UnitSystem
  url: string
  website_url: string
}
