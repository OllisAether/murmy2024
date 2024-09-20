import { Clue } from "../../clue";

export const stundenplan: Clue<'images'> = {
  type: 'images',
  id: 'stundenplan',
  cost: 10,
  title: 'Stundenplan von Hr. Montague',
  thumbnailAssetId: 'clues/kursbuch/Kursbuch-21.webp',
  images: {
    assetIds: ['clues/kursbuch/Kursbuch-21.webp'],
  }
}