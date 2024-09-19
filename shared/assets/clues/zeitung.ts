import { Clue } from "../../clue";

export const zeitung: Clue<'images'> = {
  type: 'images',
  id: 'zeitung',
  cost: 10,
  title: 'Zeitung',
  thumbnailAssetId: 'clues/Zeitung.webp',
  images: {
    assetIds: ['clues/Zeitung.webp'],
  },
}