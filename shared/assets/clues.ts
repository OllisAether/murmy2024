import { Clue, ClueTypes } from '../clue';

export const clues: Clue<ClueTypes>[] = [
  {
    id: 'clue1',
    type: 'image',
    cost: 10,
    title: 'Clue 1',
    thumbnailAssetId: 'clue1',
    image: {
      assetId: 'clue1',
      entries: [{
        index: 0,
        rect: {
          x: 0,
          y: 0,
          width: 1,
          height: 1
        },
        entry: {
          matterId: 'clue1',
          suspectId: 'sasha.monterero',
          title: 'Clue 1',
        }
      }]
    }
  }
]