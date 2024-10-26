import { Clue } from "../../clue";

export const fuehrungszeugnis: Clue<'images'> = {
  type: 'images',
  id: 'fuehrungszeugnis',
  cost: 20,
  title: 'Führungszeugnis von Hugo Montague',
  thumbnailAssetId: 'thumbnails/fuehrungszeugnis.webp',
  images: {
    assetIds: ['clues/fuehrungszeugnis.webp'],
    entries: [
      {
        rect: {
          x: 0,
          y: 0,
          width: 1,
          height: 1,
        },
        entry: {
          id: 'hugo-kriminelle-vergangenheit',
          suspectId: 'hugo',
          title: 'Kriminelle Vergangenheit',
          description: 'Hugo Montague hat eine kriminelle Vergangenheit.\n\nIst er immer noch der, der er einmal war?'
        }
      }
    ]
  }
}