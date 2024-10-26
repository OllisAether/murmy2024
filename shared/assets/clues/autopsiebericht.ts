import { Clue } from "../../clue";

export const autopsieberichtIvy: Clue<'images'> = {
  type: 'images',
  id: 'autopsieberichtIvy',
  cost: 20,
  title: 'Autopsiebericht von Ivy',
  thumbnailAssetId: 'thumbnails/AutopsieIvy.webp',
  images: {
    assetIds: ['clues/AutopsieIvy.webp'],
  }
}

export const autopsieberichtPhineas: Clue<'images'> = {
  type: 'images',
  id: 'autopsieberichtPhineas',
  cost: 20,
  title: 'Autopsiebericht von Phineas',
  thumbnailAssetId: 'thumbnails/AutopsiePhineas.webp',
  images: {
    assetIds: ['clues/AutopsiePhineas.webp'],
  }
}

