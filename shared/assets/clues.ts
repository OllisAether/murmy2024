import { Clue, ClueTypes } from '../clue';

export const clues: Clue<ClueTypes>[] = [
  {
    id: 'fp1',
    type: 'image',
    cost: 10,
    title: 'Gebäudeplan: EG',
    description: 'A clue that will help you solve the mystery.',
    thumbnailAssetId: 'floorplan/floorplan_eg.png',
    image: {
      assetId: 'floorplan/floorplan_eg.png',
      entries: []
    }
  },
  {
    id: 'fp2',
    type: 'image',
    cost: 10,
    title: 'Gebäudeplan: 1. OG',
    description: 'A clue that will help you solve the mystery.',
    thumbnailAssetId: 'floorplan/floorplan_1og.png',
    image: {
      assetId: 'floorplan/floorplan_1og.png',
      entries: []
    }
  },
  {
    id: 'fp3',
    type: 'image',
    cost: 10,
    title: 'Gebäudeplan: 2. OG',
    description: 'A clue that will help you solve the mystery.',
    thumbnailAssetId: 'floorplan/floorplan_2og.png',
    image: {
      assetId: 'floorplan/floorplan_2og.png',
      entries: []
    },
  },
  {
    id: 'druckverlauf',
    type: 'imageStack',
    cost: 10,
    title: 'Druckverlauf',
    description: 'A clue that will help you solve the mystery.',
    thumbnailAssetId: 'dokumente/druckverlauf/Druckverlauf-01.png',
    imageStack: {
      assetIds: Array(30).fill(0).map((_, i) => `dokumente/druckverlauf/Druckverlauf-${String(i + 1).padStart(2, '0')}.png`),
      entries: []
    }
  }
]