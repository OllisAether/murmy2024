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
          x: 0.11457339376590331,
          y: 0.5204032121962197,
          width: 0.7889481949745547,
          height: 0.44575902902790276,
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