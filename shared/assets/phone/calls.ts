import moment from 'moment';
import { Call } from '../../phone/call';
import { mama, papa, phoebe, cassyNumber } from './contacts';

export const calls: Call[] = [
  {
    number: cassyNumber,
    timestamp: moment('2013-02-13 21:30'),
    type: 'missed'
  },
  {
    number: papa.number,
    timestamp: moment('2013-02-12 22:45'),
    type: 'outgoing',
      duration: '8:15'
  },
  {
    number: cassyNumber,
    timestamp: moment('2013-02-11 20:12'),
    type: 'missed'
  },
  {
    number: mama.number,
    timestamp: moment('2013-02-10 21:18'),
    type: 'outgoing',
      duration: '10:55'
  },
  {
    number: cassyNumber,
    timestamp: moment('2013-02-09 19:47'),
    type: 'missed'
  },
  {
    number: papa.number,
    timestamp: moment('2013-02-08 22:10'),
    type: 'missed'
  },
  {
    number: cassyNumber,
    timestamp: moment('2013-02-07 21:25'),
    type: 'missed'
  },
  {
    number: mama.number,
    timestamp: moment('2013-02-06 20:58'),
    type: 'answered',
      duration: '11:33'
  },
  {
    number: cassyNumber,
    timestamp: moment('2013-02-05 19:39'),
    type: 'missed'
  },
  {
    number: papa.number,
    timestamp: moment('2013-02-04 22:50'),
    type: 'outgoing',
      duration: '9:24'
  },
  {
    number: cassyNumber,
    timestamp: moment('2013-02-03 20:15'),
    type: 'missed'
  },
  {
    number: mama.number,
    timestamp: moment('2013-02-02 19:00'),
    type: 'answered',
      duration: '10:12'
  },
  {
    number: cassyNumber,
    timestamp: moment('2013-02-01 21:05'),
    type: 'missed'
  },

  {
    number: papa.number,
    timestamp: moment('2013-01-31 22:10'),
    type: 'missed',
  },
  {
    number: cassyNumber,
    timestamp: moment('2013-01-30 19:27'),
    type: 'missed',
  },
  {
    number: phoebe.number,
    timestamp: moment('2013-01-28 20:41'),
    type: 'outgoing',
    duration: '6:58',
  },
  {
    number: papa.number,
    timestamp: moment('2013-01-27 22:04'),
    type: 'missed',
  },
  {
    number: cassyNumber,
    timestamp: moment('2013-01-25 21:50'),
    type: 'missed',
  },
  {
    number: mama.number,
    timestamp: moment('2013-01-22 20:06'),
    type: 'outgoing',
    duration: '10:17',
  },
  {
    number: phoebe.number,
    timestamp: moment('2013-01-20 21:16'),
    type: 'answered',
    duration: '5:55',
  },
  {
    number: cassyNumber,
    timestamp: moment('2013-01-19 18:34'),
    type: 'missed',
  },
  {
    number: papa.number,
    timestamp: moment('2013-01-16 22:51'),
    type: 'missed',
  },
  {
    number: phoebe.number,
    timestamp: moment('2013-01-15 18:17'),
    type: 'answered',
    duration: '9:12',
  },
  {
    number: cassyNumber,
    timestamp: moment('2013-01-14 21:29'),
    type: 'missed',
  },
  {
    number: mama.number,
    timestamp: moment('2013-01-10 22:03'),
    type: 'missed',
  },
  {
    number: phoebe.number,
    timestamp: moment('2013-01-09 20:34'),
    type: 'answered',
    duration: '7:41',
  },
  {
    number: cassyNumber,
    timestamp: moment('2013-01-08 21:22'),
    type: 'missed',
  },
  {
    number: papa.number,
    timestamp: moment('2013-01-06 22:38'),
    type: 'outgoing',
    duration: '10:44',
  },
  {
    number: phoebe.number,
    timestamp: moment('2013-01-05 20:46'),
    type: 'answered',
    duration: '6:39',
  },
  {
    number: cassyNumber,
    timestamp: moment('2013-01-03 19:53'),
    type: 'missed',
  },
  {
    number: mama.number,
    timestamp: moment('2013-01-01 22:25'),
    type: 'missed',
  },

  {
    number: phoebe.number,
    timestamp: moment('2012-12-31 22:45'),
    type: 'answered',
    duration: '11:48',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-31 19:12'),
    type: 'outgoing',
    duration: '9:02',
  },
  {
    number: cassyNumber,
    timestamp: moment('2012-12-30 21:28'),
    type: 'missed',
  },
  {
    number: cassyNumber,
    timestamp: moment('2012-12-29 18:50'),
    type: 'missed',
  },
  {
    number: mama.number,
    timestamp: moment('2012-12-29 21:34'),
    type: 'missed',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-29 20:19'),
    type: 'answered',
    duration: '6:27',
  },
  {
    number: cassyNumber,
    timestamp: moment('2012-12-28 22:03'),
    type: 'missed',
  },
  {
    number: papa.number,
    timestamp: moment('2012-12-28 22:16'),
    type: 'outgoing',
    duration: '7:19',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-28 19:41'),
    type: 'missed',
  },
  {
    number: cassyNumber,
    timestamp: moment('2012-12-27 21:14'),
    type: 'missed',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-27 22:05'),
    type: 'answered',
    duration: '8:51',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-27 20:37'),
    type: 'outgoing',
    duration: '5:36',
  },
  {
    number: mama.number,
    timestamp: moment('2012-12-26 21:58'),
    type: 'outgoing',
    duration: '9:30',
  },
  {
    number: cassyNumber,
    timestamp: moment('2012-12-26 20:08'),
    type: 'missed',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-25 22:41'),
    type: 'answered',
    duration: '10:15',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-25 19:32'),
    type: 'missed',
  },
  {
    number: cassyNumber,
    timestamp: moment('2012-12-24 19:56'),
    type: 'missed',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-24 22:25'),
    type: 'outgoing',
    duration: '6:59',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-24 18:47'),
    type: 'answered',
    duration: '11:20',
  },
  {
    number: papa.number,
    timestamp: moment('2012-12-23 22:13'),
    type: 'missed',
  },
  {
    number: cassyNumber,
    timestamp: moment('2012-12-22 20:47'),
    type: 'missed',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-22 21:42'),
    type: 'answered',
    duration: '8:33',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-22 19:11'),
    type: 'outgoing',
    duration: '4:40',
  },
  {
    number: cassyNumber,
    timestamp: moment('2012-12-21 20:13'),
    type: 'missed',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-21 21:58'),
    type: 'missed',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-21 18:36'),
    type: 'answered',
    duration: '7:55',
  },
  {
    number: mama.number,
    timestamp: moment('2012-12-20 21:07'),
    type: 'outgoing',
    duration: '5:10',
  },
  {
    number: cassyNumber,
    timestamp: moment('2012-12-19 19:29'),
    type: 'missed',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-18 20:49'),
    type: 'outgoing',
    duration: '9:21',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-17 21:33'),
    type: 'answered',
    duration: '6:47',
  },
  {
    number: cassyNumber,
    timestamp: moment('2012-12-17 18:22'),
    type: 'missed',
  },

  {
    number: papa.number,
    timestamp: moment('2012-12-16 20:03'),
    type: 'missed',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-15 19:54'),
    type: 'answered',
    duration: '10:24',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-14 22:16'),
    type: 'outgoing',
    duration: '11:55',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-13 20:44'),
    type: 'answered',
    duration: '8:01',
  },
  {
    number: mama.number,
    timestamp: moment('2012-12-12 22:39'),
    type: 'missed',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-11 21:19'),
    type: 'outgoing',
    duration: '7:43',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-10 22:51'),
    type: 'answered',
    duration: '9:58',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-09 20:35'),
    type: 'missed',
  },
  {
    number: papa.number,
    timestamp: moment('2012-12-08 21:47'),
    type: 'outgoing',
    duration: '12:11',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-07 22:15'),
    type: 'answered',
    duration: '5:59',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-06 20:27'),
    type: 'outgoing',
    duration: '7:12',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-05 21:43'),
    type: 'answered',
    duration: '10:08',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-03 22:32'),
    type: 'answered',
    duration: '12:45',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-03 19:49'),
    type: 'rejected',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-03 18:24'),
    type: 'missed',
  },
  {
    number: mama.number,
    timestamp: moment('2012-12-02 21:56'),
    type: 'outgoing',
    duration: '7:32',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-01 22:11'),
    type: 'answered',
    duration: '9:14',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-12-01 20:08'),
    type: 'rejected',
  },
  {
    number: mama.number,
    timestamp: moment('2012-12-01 17:42'),
    type: 'missed',
  },
  {
    number: papa.number,
    timestamp: moment('2012-11-30 22:59'),
    type: 'missed',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-11-30 19:26'),
    type: 'outgoing',
    duration: '4:56',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-11-30 18:03'),
    type: 'missed',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-11-28 21:48'),
    type: 'answered',
    duration: '6:23',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-11-28 19:07'),
    type: 'outgoing',
    duration: '8:37',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-11-28 17:33'),
    type: 'answered',
    duration: '11:10',
  },
  {
    number: mama.number,
    timestamp: moment('2012-11-26 22:36'),
    type: 'missed',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-11-26 20:05'),
    type: 'outgoing',
    duration: '10:59',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-11-26 18:19'),
    type: 'missed',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-11-24 21:54'),
    type: 'answered',
    duration: '7:21',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-11-24 19:21'),
    type: 'outgoing',
    duration: '9:45',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-11-24 17:48'),
    type: 'answered',
    duration: '5:12',
  },
  {
    number: papa.number,
    timestamp: moment('2012-11-23 22:09'),
    type: 'missed',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-11-23 20:37'),
    type: 'missed',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-11-23 18:04'),
    type: 'answered',
    duration: '13:53',
  },
  {
    number: phoebe.number,
    timestamp: moment('2012-11-23 17:15'),
    type: 'rejected',
  },
];
