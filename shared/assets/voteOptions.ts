import { VoteOption } from '../vote';
import { getSuspectById } from './suspects';

export const voteOptions: VoteOption[] = [
  // Hauptclues
  {
    id: 'phone',
    title: 'Handy',
    image: 'mainClue/PhoneThumbnail.webp',
    placeImageOverBox: true,
  },
  {
    id: 'diary',
    title: 'Tagebuch',
    image: 'mainClue/DiaryThumbnail.webp',
    placeImageOverBox: true,
  },

  // Interviews
  {
    id: 'cassy1',
    title: 'Interview: Cassandra Novak',
    image: 'suspects/Cassy1.webp',
    suspectIds: ['cassandra', 'ivy', 'orakel'],
    color: getSuspectById('cassandra')?.color,
    removeSelf: true,

    media: 'Cassy 1.mp4',
    availableClues: [
      'schuelerakteCassandra',
      'rituale',
      'schuelerakteIvy'
    ],
    options: {
      main: [
        'notruf',
      ]
    }
  },
  {
    id: 'cassy2',
    title: 'Interview 2: Cassandra Novak',
    image: 'suspects/Cassy2.webp',
    suspectIds: ['cassandra'],
    color: getSuspectById('cassandra')?.color,
    removeSelf: true,

    media: 'Cassy 2.mp4',
    availableClues: [
      'bfbChloroformTuch'
    ]
  },
  {
    id: 'hugo1',
    title: 'Interview: Hugo Montague',
    image: 'suspects/Hugo1.webp',
    suspectIds: ['hugo', 'ivy'],
    color: getSuspectById('hugo')?.color,
    removeSelf: true,
    
    media: 'Hugo 1.mp4',
    availableClues: [
      'fuehrungszeugnis',
      'stundenplan',
      'todesurkundeElena',
      'kursbuch'
    ],
  },
  {
    id: 'hugo2',
    title: 'Interview 2: Hugo Montague',
    image: 'suspects/Hugo2.webp',
    suspectIds: ['hugo', 'phineas', 'ivy'],
    color: getSuspectById('hugo')?.color,
    removeSelf: true,

    media: 'Hugo 2.mp4',
    availableClues: [
      'besucherliste'
    ],
    options: {
      main: [
        'phoebe2',
      ]
    }
  },
  {
    id: 'justin1',
    title: 'Interview: Kopelius van Bustin',
    image: 'suspects/Justin1.webp',
    suspectIds: ['justin', 'ivy'],
    color: getSuspectById('justin')?.color,
    removeSelf: true,

    media: 'Justin 1.mp4',
    availableClues: [
      'schuelerakteKopelius'
    ],

    options: {
      main: [
        'notruf',
      ]
    }
  },
  {
    id: 'justin2',
    title: 'Interview 2: Justin van Bustin',
    image: 'suspects/Justin2.webp',
    suspectIds: ['justin', 'phineas', 'ivy'],
    color: getSuspectById('justin')?.color,
    removeSelf: true,
    
    media: 'Justin 2.mp4',
    availableClues: [
      'bfbDolch'
    ],
  },
  {
    id: 'phoebe1',
    title: 'Interview: Phoebe Blight',
    image: 'suspects/Phoebe1.webp',
    suspectIds: ['phoebe', 'ivy'],
    color: getSuspectById('phoebe')?.color,
    removeSelf: true,

    media: 'Phoebe 1.mp4',
    availableClues: [
      'schueleraktePhoebe'
    ],
  },
  {
    id: 'phoebe2',
    title: 'Interview 2: Phoebe Blight',
    image: 'suspects/Phoebe2.webp',
    suspectIds: ['phoebe', 'phineas', 'ivy'],
    color: getSuspectById('phoebe')?.color,
    removeSelf: true,

    media: 'Phoebe 2.mp4',
    options: {
      main: [
        'stalker1',
      ]
    }
  },

  // Sonstiges
  {
    id: 'stalker1',
    title: 'Stalkeraufnahme',
    image: 'thumbnails/stalker1.webp',
    suspectIds: ['phineas', 'cassandra', 'hugo', 'justin', 'ivy'],
    removeSelf: true,

    media: 'Stalkeraufnahme 1.mp4',
    options: {
      main: [
        'stalker2',
      ]
    }
  },
  {
    id: 'stalker2',
    title: 'Stalkeraufnahme 2',
    image: 'thumbnails/stalker2.webp',
    suspectIds: ['phineas', 'cassandra', 'justin'],
    removeSelf: true,

    media: 'Stalkeraufnahme 2.mp4',
    options: {
      main: [
        'cassy2'
      ]
    }
  },
  {
    id: 'notruf',
    title: 'Telefontaufzeichnung 13:45: Notruf 112',
    image: 'thumbnails/kw.webp',
    color: '#ff5a4a',
    suspectIds: ['cassandra', 'phineas'],
    removeSelf: true,

    media: 'Notruf.mp3',

    availableClues: [
      'schueleraktePhineas',
    ]
  },
  {
    id: 'justinsSprachaufnahme',
    title: 'Kassettenrecorder von Justin van Bustin',
    image: 'thumbnails/tape.webp',
    suspectIds: ['justin'],
    removeSelf: true,

    availableClues: [
      'autopsieberichtPhineas',
    ],
    options: {
      main: [
        'krankenhausLog',
      ]
    },
    media: 'Justinssprachaufnahme.mp3',
  },
  {
    id: 'krankenhausLog',
    title: 'Log_17_45_016',
    image: 'thumbnails/intercom.webp',
    suspectIds: ['phineas'],
    removeSelf: true,

    media: 'KrankenhausLog.mp3',
  }
]