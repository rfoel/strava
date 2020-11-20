import fetch from 'node-fetch'

type RequestParams = {
  uri: string
  params: any
}

export class Request {
  request: any

  constructor(accessToken: string) {
    this.request = ({ uri, params }: RequestParams): void => {
      const query: string = new URLSearchParams(params).toString()
      return fetch(`https://www.strava.com/api/v3/${uri}?${query}`, {
        headers: { Bearer: accessToken },
      })
    }
  }

  public async makeApiRequest<Response>(
    uri: string,
    params: any,
  ): Promise<Response> {
    const response = await this.request({
      uri,
      params,
    })

    if (!response.ok) {
      throw response
    }

    const { data } = await response.json()
    return data
  }
}
