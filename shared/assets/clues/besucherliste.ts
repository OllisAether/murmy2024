import { Clue } from "../../clue";

export const besucherliste: Clue<'images'> = {
  type: 'images',
  id: 'besucherliste',
  cost: 20,
  title: 'Besucherliste von Phineas',
  thumbnailAssetId: 'thumbnails/Besucherliste.webp',
  images: {
    assetIds: ['clues/Besucherliste.webp'],
    entries: [
      {
        rect: {
          x: 0.05503862359550562,
          y: 0.20668984108967084,
          width: 0.8872015449438202,
          height: 0.025352937003405223,
        },
        entry: {
          id: 'cassandras-besuch',
          title: '14:30 Uhr - Cassandras Besuch',
          suspectId: 'phineas',
          description: 'Cassandra hat Phineas am 14.02.2012 um 14:30 Uhr besucht.',
        }
      },
      {
        rect: {
          x: 0.05503862359550562,
          y: 0.20668984108967084 + 0.025352937003405223,
          width: 0.8872015449438202,
          height: 0.025352937003405223,
        },
        entry: {
          id: 'hugos-besuch',
          title: '16:38 Uhr - Hugo Montagues Besuch',
          suspectId: 'phineas',
          description: 'Hugo Montague hat Phineas am 14.02.2012 um 15:48 Uhr besucht.',
        }
      },
      {
        rect: {
          x: 0.05503862359550562,
          y: 0.20668984108967084 + 0.025352937003405223 * 2,
          width: 0.8872015449438202,
          height: 0.025352937003405223,
        },
        entry: {
          id: 'phoebes-besuch',
          title: '16:54 Uhr - Phoebes Besuch',
          suspectId: 'phineas',
          description: 'Phoebe hat Phineas am 14.02.2012 um 16:34 Uhr besucht.',
        }
      },
      {
        rect: {
          x: 0.7004847171532846,
          y: 0.11313209494324046,
          width: 0.23460310218978103,
          height: 0.04677018833849329,
        },
        entry: {
          id: 'phineas-zimmer',
          title: 'Zimmer B34',
          suspectId: 'phineas',
          description: 'Phineas ist auf Station B in Zimmer 34 untergebracht.',
        }
      }
    ]
  }
}