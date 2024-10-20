import { Clue } from "../../clue";

export const polizeilichesFuehrungszeugnis: Clue<'images'> = {
  type: 'images',
  id: 'polizeilichesFuehrungszeugnis',
  cost: 20,
  title: 'Polizeiliches Führungszeugnis von Hugo Montague',
  thumbnailAssetId: 'clues/kursbuch/Kursbuch-21.webp',
  images: {
    assetIds: ['clues/kursbuch/Kursbuch-21.webp'],
  }
}