import { Where } from './where'

export interface Arguments {
  where?: Where
  orderBy?: string
  skip?: number
  first?: number
  last?: number
}
