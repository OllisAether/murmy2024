import { Clue } from '../../clue';

export const map: Clue<'images'> = {
  type: 'images',
  id: 'map',
  cost: 10,
  title: 'Stadtplan',
  thumbnailAssetId: 'thumbnails/Map.webp',
  images: {
    assetIds: ['clues/Map.webp'],
  },
  description: 'Der Stadtplan von Larissa.',
}