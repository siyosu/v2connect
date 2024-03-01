export type NewOrder = {
  service: number | string
  link?: string
  quantity?: number | string
  runs?: number | string
  intevals?: number | string
} & Record<string, number | string>

export interface Service {
  service: string
  name: string
  type: string
  rate: string
  min: string
  max: string
  dripfeed: boolean
  refill: boolean
  cancel: boolean
  category: string
}

export type OrderStatus = {
  charge: string
  start_count: string
  status: 'Pending' | 'In progress' | 'Completed' | 'Partial' | 'Canceled' | 'Processing' | 'Fail' | 'Error'
  remains: string
  currency: string
} | {
  error: string
}

export interface CreateRefill {
  order: number
  refill: number | {
    error: string
  }
}

export interface RefillStatus {
  refill: number
  status: 'Pending' | 'In progress' | 'Completed' | 'Rejected' | 'Error' | {
    error: string
  }
}

export interface CancelOrder {
  order: number
  cancel: number | {
    error: string
  }
}

export type ProviderAction = 'services' | 'balance' | 'add' | 'status' | 'refill' | 'refill_status' | 'cancel'
