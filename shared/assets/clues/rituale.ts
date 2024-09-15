import { Clue } from "../../clue";

export const rituale: Clue<'images'> = {
  type: 'images',
  id: 'rituale',
  cost: 10,
  title: 'Rituale',
  thumbnailAssetId: 'clues/Ritual3.webp',
  description: 'Verschiedene voll gekritzelte Blätter mit Ritualen aus dem Okkultclub-Raum.',
  images: {
    assetIds: [
      'clues/Ritual3.webp',
      'clues/Ritual4.webp',
      'clues/Ritual2.webp',
      'clues/Ritual1.webp',
    ],
  },
}

export const liebesRitual: Clue<'images'> = {
  type: 'images',
  id: 'liebesRitual',
  cost: 10,
  title: 'Ritual der ewigen Liebe',
  thumbnailAssetId: 'clues/Ritual5.webp',
  description: 'Ein Blatt mit einem Ritual der ewigen Liebe.',
  images: {
    assetIds: [
      'clues/Ritual5.webp',
    ],
  },
}