import { Clue } from '../../clue';
import { bold, italic, textContent } from '../../textContent';

export const map: Clue<'images'> = {
  type: 'images',
  id: 'map',
  cost: 10,
  title: 'Stadtplan von Alt-Arborwinde',
  description: textContent(['Der Stadtplan der kleinen Stadt ', bold(italic('Alt-Arborwinde')), '. Ein abgelegener, aber dennoch schöner Ort in Deutschland. Die seit ', italic('200'), ' Jahren bestehende Stadt hat eine Bevölkerung von gerade mal über ', italic('10.000'), ' Einwohnern und ist bekannt für ihre ruhige und ', italic('friedliche'), ' Atmosphäre.']),
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
          description: 'Das Max-Planck-Gymnasium, ist das einzige Gymnasium der Stadt und liegt gegenüber des Tannen-Weiher Parks.',
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
          description: 'Das Polizeipräsidium, in dem diese Ermittlung gerade stattfindet.',
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
          description: 'Das städtische Klilnikum befindet sich gegenüber des Polizeipräsidiums.',
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
          description: 'Der Tannen-Weiher Park befindet sich gegenüber dem Max-Planck-Gymnasium und besitzt ein See, ein Kinderspielplatz, ein Bolzplatz, ein Skatepark, ein Hundepark und eine große Wiese.',
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
          description: 'Der Stadtwald ist ein großer Wald, der sich im Süd-Östlichen Teil der Stadt befindet. Es liegt eine abgelegene Holzfällerhütte mit einem kleinen See im Wald.',
        }
      },
    ]
  },
}