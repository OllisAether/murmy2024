import { Clue } from "../../clue";

export const fuehrungszeugnis: Clue<'images'> = {
  type: 'images',
  id: 'fuehrungszeugnis',
  cost: 20,
  title: 'Führungszeugnis von Hugo Montague',
  thumbnailAssetId: 'clues/kursbuch/Kursbuch-21.webp',
  images: {
    assetIds: ['clues/kursbuch/Kursbuch-21.webp'],
  }
}