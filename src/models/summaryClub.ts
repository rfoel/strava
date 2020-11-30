import { ResourceState, SportType } from '../enums'

export interface SummaryClub {
  id: number
  resource_state: ResourceState
  name: string
  profile_medium: string
  cover_photo: string
  cover_photo_small: string
  sport_type: SportType
  city: string
  state: string
  country: string
  private: boolean
  member_count: number
  featured: boolean
  verified: boolean
  url: string
}
