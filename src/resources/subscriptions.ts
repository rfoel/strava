import { Request } from '../request'

type Subscription = {
  id: number
}

type SubscriptionCreationRequest = {
  callback_url: string
  verify_token: string
}

type SubscriptionCreationResponse = {
  id: number
}

export class Subscriptions {
  private readonly request: Request

  constructor(request: Request) {
    this.request = request
  }

  async createSubscription(
    params: SubscriptionCreationRequest,
  ): Promise<SubscriptionCreationResponse> {
    return this.request.makeApiRequest('post', '/push_subscriptions', {
      body: {
        ...params,
        client_id: this.request.config.client_id,
        client_secret: this.request.config.client_secret,
      },
    })
  }

  async deleteSubscription(id: number): Promise<any> {
    return this.request.makeApiRequest('delete', `/push_subscriptions/${id}`, {
      body: {
        client_id: this.request.config.client_id,
        client_secret: this.request.config.client_secret,
      },
    })
  }

  async getSubscriptions(): Promise<Subscription[]> {
    return this.request.makeApiRequest('get', '/push_subscriptions', {
      query: {
        client_id: this.request.config.client_id,
        client_secret: this.request.config.client_secret,
      },
    })
  }
}
