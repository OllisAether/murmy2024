import { Clue } from "../../clue";

export const fuehrungszeugnis: Clue<'images'> = {
  type: 'images',
  id: 'fuehrungszeugnis',
  cost: 20,
  title: 'Führungszeugnis von Hugo Montague',
  thumbnailAssetId: 'thumbnails/fuehrungszeugnis.webp',
  images: {
    assetIds: ['clues/fuehrungszeugnis.webp'],
  }
}