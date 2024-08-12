import { Moment } from "moment"

export interface Call {
  timestamp: Moment
  number: string
  duration?: string
  type: 'answered' | 'missed' | 'outgoing' | 'rejected'
}