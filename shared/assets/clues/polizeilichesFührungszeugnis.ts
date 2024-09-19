import { Clue } from "../../clue";

export const polizeilichesFührungszeugnis: Clue<'images'> = {
  type: 'images',
  id: 'polizeilichesFührungszeugnis',
  cost: 10,
  title: 'Polizeiliches Führungszeugnis von Hr. Montague',
  thumbnailAssetId: 'clues/kursbuch/Kursbuch-01.png',
  images: {
    assetIds: ['clues/kursbuch/Kursbuch-01.png'],
  }
}