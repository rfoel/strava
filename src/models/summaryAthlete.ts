import { ResourceState, Sex } from '../enums'

export interface SummaryAthlete {
  id: number
  resource_state: ResourceState
  firstname: string
  lastname: string
  profile_medium: string
  profile: string
  city: string
  state: string
  country: string
  sex: Sex
  friend: string
  follower: string
  premium: boolean
  created_at: string
  updated_at: string
}
