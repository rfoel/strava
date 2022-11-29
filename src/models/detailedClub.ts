import { ActivityType, Membership, ResourceState } from '../enums'

export interface DetailedClub {
  id: number
  resource_state: ResourceState
  name: string
  profile_medium: string
  cover_photo: string
  cover_photo_small: string
  activity_types: ActivityType
  city: string
  state: string
  country: string
  private: boolean
  member_count: number
  featured: boolean
  verified: boolean
  url: string
  membership: Membership
  admin: boolean
  owner: boolean
  following_count: number
}
