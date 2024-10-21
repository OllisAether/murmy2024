import { Clue } from "../../clue";

export const bfbChloroformTuch: Clue<'images'> = {
  type: 'images',
  id: 'bfbChloroformTuch',
  cost: 20,
  title: 'Beweisfundbericht: Chloroformtuch',
  thumbnailAssetId: 'thumbnails/BfbTuch.webp',
  images: {
    assetIds: ['clues/BfbTuch.webp'],
  }
}

export const bfbDolch: Clue<'images'> = {
  type: 'images',
  id: 'bfbDolch',
  cost: 20,
  title: 'Beweisfundbericht: Dolch',
  thumbnailAssetId: 'clues/BfbDolch.webp',
  images: {
    assetIds: ['clues/BfbDolch.webp'],
  }
}