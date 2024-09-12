import { Clue } from "../../clue";

export const kursbuch: Clue<'book'> = {
  type: 'book',
  id: 'kursbuch',

  cost: 10,
  title: 'Kursbuch',
  thumbnailAssetId: 'clues/kursbuch/Kursbuch-02.png',
  images: {
    assetIds: Array.from({ length: 19 }, (_, i) => `clues/kursbuch/Kursbuch-${(i + 1).toString().padStart(2, '0')}.png`),
    entries: [
      {
        index: 0,
        rect: {
          x: 0.1,
          y: 0.1,
          width: 0.8,
          height: 0.8
        },

        entry: {
          id: 'kursbuch',
          suspectId: 'phineas',
          title: 'Kursbuch',
          description: 'Ein Kursbuch für die Schifffahrt. Es enthält Informationen über die Route und die geplanten Anlegepunkte.',
        }
      }
    ]
  },
}