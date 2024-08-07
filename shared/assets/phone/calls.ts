export interface Call {
  timestamp: string;
  caller: string;
  number: string;
  duration?: string;
  type: 'answered' | 'missed' | 'outgoing' | 'rejected';
}

export const calls: Call[] = [
  {
    timestamp: '1. Apr 2013, 10:00',
    caller: 'Dr. Müller',
    number: '0123456789',
    duration: '1:23',
    type: 'answered'
  },
  {
    timestamp: '1. Apr 2013, 10:00',
    caller: 'Dr. Müller',
    number: '0123456789',
    duration: '1:23',
    type: 'missed'
  },
  {
    timestamp: '1. Apr 2013, 10:00',
    caller: 'Dr. Müller',
    number: '0123456789',
    duration: '1:23',
    type: 'outgoing'
  },
  {
    timestamp: '1. Apr 2013, 10:00',
    caller: 'Dr. Müller',
    number: '0123456789',
    type: 'rejected'
  },

  {
    timestamp: '1. Apr 2013, 10:00',
    caller: 'Dr. Müller',
    number: '0123456789',
    duration: '1:23',
    type: 'answered'
  },
  {
    timestamp: '1. Apr 2013, 10:00',
    caller: 'Dr. Müller',
    number: '0123456789',
    duration: '1:23',
    type: 'missed'
  },
  {
    timestamp: '1. Apr 2013, 10:00',
    caller: 'Dr. Müller',
    number: '0123456789',
    duration: '1:23',
    type: 'outgoing'
  },
  {
    timestamp: '1. Apr 2013, 10:00',
    caller: 'Dr. Müller',
    number: '0123456789',
    type: 'rejected'
  },
  {
    timestamp: '1. Apr 2013, 10:00',
    caller: 'Dr. Müller',
    number: '0123456789',
    duration: '1:23',
    type: 'answered'
  },
  {
    timestamp: '1. Apr 2013, 10:00',
    caller: 'Dr. Müller',
    number: '0123456789',
    duration: '1:23',
    type: 'missed'
  },
  {
    timestamp: '1. Apr 2013, 10:00',
    caller: 'Dr. Müller',
    number: '0123456789',
    duration: '1:23',
    type: 'outgoing'
  },
  {
    timestamp: '1. Apr 2013, 10:00',
    caller: 'Dr. Müller',
    number: '0123456789',
    type: 'rejected'
  }
]