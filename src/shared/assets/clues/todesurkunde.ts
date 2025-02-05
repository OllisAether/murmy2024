import { Clue } from "../../clue";

export const todesurkundeElena: Clue<'images'> = {
  type: 'images',
  id: 'todesurkundeElena',
  cost: 20,
  title: 'Todesurkunde von Elena',
  thumbnailAssetId: 'thumbnails/Todesurkunde_Elena.webp',
  images: {
    assetIds: ['clues/Todesurkunde_Elena.webp'],
    entries: [
      {
        rect: {
          x: 0.4164917883211679,
          y: 0.3655064821981424,
          width: 0.18604014598540147,
          height: 0.0327858939628483,
        },
        entry: {
          id: 'elenas-todesdatum',
          title: '14.12.2012 18:32 - Elenas Todeszeitpunkt',
          suspectId: 'hugo',
          description: 'Elena Delora-Montague ist am 14.12.2012 um 18:32 verstorben.'
        }
      },
    ]
  }
}

export const todesurkundeIvy: Clue<'images'> = {
  type: 'images',
  id: 'todesurkundeIvy',
  cost: 20,
  title: 'Todesurkunde von Ivy',
  thumbnailAssetId: 'thumbnails/Todesurkunde_Ivy.webp',
  images: {
    assetIds: ['clues/Todesurkunde_Ivy.webp'],
    entries: [
      {
        rect: {
          x: 0.4164917883211679,
          y: 0.3655064821981424,
          width: 0.18604014598540147,
          height: 0.0327858939628483,
        },
        entry: {
          id: 'ivy-todesdatum',
          title: '14.02.2013 13:30 - Zeitpunkt des Todes',
          suspectId: 'ivy',
          description: 'Ivys Tod wird auf den 14.02.2013 um 13:30 datiert.'
        }
      }
    ]
  }
}