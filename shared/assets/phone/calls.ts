import moment, { Moment } from "moment"

export interface Call {
  timestamp: Moment
  number: string
  duration?: string
  type: 'answered' | 'missed' | 'outgoing' | 'rejected'
}

export const calls: Call[] = [
  {
    timestamp: moment('01-04-2013 10:00', 'DD-MM-YYYY HH:mm'),
    number: '0123456789',
    duration: '1:30',
    type: 'answered'
  },
  {
    timestamp: moment('01-04-2013 10:00', 'DD-MM-YYYY HH:mm'),
    number: '0123456789',
    duration: '1:30',
    type: 'missed'
  },
  {
    timestamp: moment('02-04-2013 10:00', 'DD-MM-YYYY HH:mm'),
    number: '0123456789',
    duration: '1:30',
    type: 'outgoing'
  },
  {
    timestamp: moment('02-04-2013 10:00', 'DD-MM-YYYY HH:mm'),
    number: '0123456789',
    type: 'rejected'
  },
  {
    timestamp: moment('01-04-2013 10:00', 'DD-MM-YYYY HH:mm'),
    number: '0123456789',
    duration: '1:30',
    type: 'answered'
  },
  {
    timestamp: moment('01-04-2013 10:00', 'DD-MM-YYYY HH:mm'),
    number: '012345672349',
    duration: '1:30',
    type: 'missed'
  },
  {
    timestamp: moment('02-04-2013 10:00', 'DD-MM-YYYY HH:mm'),
    number: '012345672349',
    duration: '1:30',
    type: 'outgoing'
  },
  {
    timestamp: moment('02-04-2013 10:00', 'DD-MM-YYYY HH:mm'),
    number: '012345672349',
    type: 'rejected'
  },
]