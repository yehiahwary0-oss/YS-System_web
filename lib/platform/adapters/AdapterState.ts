export type AdapterState = 'implemented' | 'mock' | 'pending' | 'unavailable' | 'deprecated'

export interface AdapterInfo {
  id: string
  name: string
  state: AdapterState
  description?: string
  moduleId?: string
}

export const ADAPTER_STATE_LABELS: Record<AdapterState, string> = {
  implemented: 'Implemented',
  mock: 'Mock',
  pending: 'Pending Implementation',
  unavailable: 'Unavailable',
  deprecated: 'Deprecated',
}

export const ADAPTER_STATE_COLORS: Record<AdapterState, string> = {
  implemented: 'green',
  mock: 'yellow',
  pending: 'orange',
  unavailable: 'red',
  deprecated: 'gray',
}
