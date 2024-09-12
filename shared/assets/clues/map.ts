import { Clue } from '../../clue';

export const map: Clue<'images'> = {
  type: 'images',
  id: 'map',
  cost: 10,
  title: 'Stadtplan',
  thumbnailAssetId: 'thumbnails/Map.webp',
  images: {
    assetIds: ['clues/Map.webp'],
    entries: [
      {
        rect: {
          x: 0.45,
          y: 0.15,
          width: .15,
          height: .23,
          transform: 'rotate(28deg)',
        },
        entry: {
          id: 'max-planck-gymnasium',
          title: 'Max-Planck-Gymnasium',
          suspectId: 'general',
          description: 'Die Schule, an der die meisten der Opfer studierten.',
        }
      },

      {
        rect: {
          x: 0.17,
          y: 0.11,
          width: .08,
          height: .12,
          transform: 'rotate(-20deg)',
        },
        entry: {
          id: 'polizeipräsidium',
          title: 'Polizeipräsidium',
          suspectId: 'general',
          description: 'Der Ort, an dem die Ermittlungen geführt werden.',
        }
      },

      {
        rect: {
          x: 0.16,
          y: 0.26,
          width: .08,
          height: .08,
          transform: 'rotate(24deg)',
        },
        entry: {
          id: 'klinikum',
          title: 'Klinikum',
          suspectId: 'general',
          description: 'Das Krankenhaus, in dem die Opfer behandelt wurden.',
        }
      },

      {
        rect: {
          x: 0.4,
          y: 0.4,
          width: .15,
          height: .25,
          transform: 'rotate(27deg)',
        },
        entry: {
          id: 'park',
          title: 'Tannen-Weiher Park',
          suspectId: 'general',
          description: 'Der Park, in dem die Leichen gefunden wurden.',
        }
      },

      {
        rect: {
          x: .1,
          y: .4,
          width: .3,
          height: .65,
          transform: 'rotate(-40deg)',
        },
        entry: {
          id: 'wald',
          title: 'Stadtwald',
          suspectId: 'general',
          description: 'Der Wald, in dem die Leichen gefunden wurden.',
        }
      }
    ]
  },
  description: 'Der Stadtplan von Larissa.',
}