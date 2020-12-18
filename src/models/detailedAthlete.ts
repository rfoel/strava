import { FollowerStatus, ResourceState, UnitSystem } from '../enums'

import { SummaryClub, SummaryGear } from '.'

export interface DetailedAthlete {
  id: number
  resource_state: ResourceState
  firstname: string
  lastname: string
  profile_medium: string
  profile: string
  city: string
  state: string
  country: string
  sex: string
  friend: FollowerStatus
  follower: FollowerStatus
  premium: boolean
  created_at: string
  updated_at: string
  follower_count: number
  friend_count: number
  mutual_friend_count: number
  measurement_preference: UnitSystem
  email: string
  ftp: number
  weight: number
  clubs: SummaryClub
  bikes: SummaryGear
  shoes: SummaryGear
}
