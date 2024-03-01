import type { CancelOrder, CreateRefill, NewOrder, OrderStatus, ProviderAction, RefillStatus, Service } from './types'

export class ProviderInvalidRequest extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ProviderInvalidRequest'
  }
}

export class ProviderInvalidApiKey extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ProviderInvalidApiKey'
  }
}

/**
 * Wrapper for SMM V2 API.
 *
 * SMM Providers with V2 API mostly have the same pattern and API parameters
 *
 * @example
 * const url = 'https://provider.com/api/v2'
 * const params = {
 *  key: 'your_api_key',
 *  action: 'api_action',
 *  ...args
 * }
 */
export class Provider {
  public url: string
  public key: string
  /**
   * Create new provider instance
   * @param url Provider API url
   * @param key Your API Key
   */
  constructor(url: string, key: string) {
    if (typeof url !== 'string' || url.length < 1)
      throw new Error('URL must be a valid string and cannot be empty')

    if (typeof key !== 'string' || key.length < 1)
      throw new Error('Api Key must be a valid string and cannot be empty')

    this.url = url
    this.key = key
  }

  private async post<T>(action: ProviderAction, payload: Partial<Record<string, any>> = {}): Promise<T> {
    // Check if the action is valid
    const actions = ['services', 'balance', 'add', 'status', 'refill', 'refill_status', 'cancel']
    if (!actions.includes(action))
      throw new Error('Action is not valid')

    try {
      // Request body
      const body = {
        key: this.key,
        action,
        ...payload,
      }
      // Request options
      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
      const res = await fetch(this.url, options)
      if (!res.ok)
        throw res

      return res.json()
    }
    catch (error) {
      if (!(error instanceof Response))
        throw error

      const status = error.status
      const { error: message = 'Unable to make request to provider' } = await error.json()

      if (status === 401)
        throw new ProviderInvalidApiKey(message)

      if (status === 404)
        throw new ProviderInvalidRequest(message)

      throw new Error(message)
    }
  }

  /**
   * Get your current balance on the provider
   */
  async balance() {
    return this.post<{ balance: string, currency: string }>('balance')
  }

  /**
   * Create new order
   * @param payload
   */
  async order(payload: NewOrder) {
    return this.post<{ order: number }>('add', payload)
  }

  /**
   * Get all services from the provider
   */
  async services() {
    return this.post<Service[]>('services')
  }

  /**
   * Check order status up to 100 orders at a time
   * @param orders
   */
  async status(...orders: (number | string)[]) {
    if (orders.length > 100)
      throw new Error('Orders must be less than or equal to 100')

    // Check status for 1 order
    if (orders.length === 1)
      return this.post<OrderStatus>('status', { order: orders[0] })

    return this.post<Record<string, OrderStatus>>('status', { orders: orders.join(',') })
  }

  /**
   * Create refill up to 100 orders at a time
   * @param orders
   */
  async refill(...orders: (number | string)[]) {
    if (orders.length > 100)
      throw new Error('Orders must be less than or equal to 100')

    // Create refill for 1 order
    if (orders.length === 1)
      return this.post<{ refill: string | { error: string } }>('refill', { order: orders[0] })

    return this.post<CreateRefill[]>('refill', { orders: orders.join(',') })
  }

  /**
   * Get refill status up to 100 orders at a time
   * @param refills
   */
  async refill_status(...refills: (number | string)[]) {
    if (refills.length > 100)
      throw new Error('Refills must be less than or equal to 100')

    // Get refill status for 1 order
    if (refills.length === 1)
      return this.post<{ refill: string | { error: string } }>('refill_status', { refill: refills[0] })

    return this.post<RefillStatus[]>('refill_status', { refills: refills.join(',') })
  }

  /**
   * Cancel order up to 100 orders at a time
   * @param orders
   */
  async cancel(...orders: (number | string)[]) {
    if (orders.length > 100)
      throw new Error('Orders must be less than or equal to 100')

    return this.post<CancelOrder[]>('cancel', { orders: orders.join(',') })
  }
}
