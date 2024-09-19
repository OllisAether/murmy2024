import { Clue } from "../../clue";

export const kursbuch: Clue<'book'> = {
  type: 'book',
  id: 'kursbuch',

  cost: 10,
  title: 'Kursbuch',
  thumbnailAssetId: 'clues/kursbuch/Kursbuch-01.jpg',
  images: {
    assetIds: Array.from({ length: 22 }, (_, i) => `clues/kursbuch/Kursbuch-${(i + 1).toString().padStart(2, '0')}.jpg`),
    entries: [
    ]
  },
}