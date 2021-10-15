import { ActivityType } from '../enums/activityType'

export interface SubscriptionEvent {
  object_type: 'activity' | 'athlete'
  object_id: number
  aspect_type: 'create' | 'update' | 'delete'
  updates: {
    title?: string
    type?: ActivityType
    private?: boolean
    authorized?: false
  }
  owner_id: number
  subscription_id: number
  event_time: number
}
