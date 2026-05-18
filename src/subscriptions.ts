import { StravaApiError } from './errors'

const BASE = 'https://www.strava.com/api/v3/push_subscriptions'

export interface Subscription {
  id: number
  application_id: number
  callback_url: string
  created_at: string
  updated_at: string
}

export interface SubscriptionEvent {
  object_type: 'activity' | 'athlete'
  object_id: number
  aspect_type: 'create' | 'update' | 'delete'
  updates: Record<string, string>
  owner_id: number
  subscriber_id: number
  event_time: number
}

export interface CreateSubscriptionParams {
  callback_url: string
  verify_token: string
}

export class Subscriptions {
  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async create(params: CreateSubscriptionParams): Promise<Subscription> {
    const body = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      callback_url: params.callback_url,
      verify_token: params.verify_token,
    })
    return this.request<Subscription>('POST', '', body)
  }

  async list(): Promise<Subscription[]> {
    const query = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
    })
    return this.request<Subscription[]>('GET', `?${query}`)
  }

  async delete(id: number): Promise<void> {
    const query = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
    })
    await this.request<void>('DELETE', `/${id}?${query}`)
  }

  private async request<T>(
    method: string,
    path: string,
    body?: URLSearchParams,
  ): Promise<T> {
    const res = await this.fetchImpl(`${BASE}${path}`, { method, body })
    if (!res.ok) {
      let data: unknown
      try {
        data = await res.json()
      } catch {
        data = await res.text().catch(() => undefined)
      }
      throw new StravaApiError(
        res.status,
        res.statusText,
        data as string | undefined,
      )
    }
    if (res.status === 204) return undefined as T
    return (await res.json()) as T
  }
}
