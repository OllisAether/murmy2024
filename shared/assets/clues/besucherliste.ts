import { Clue } from "../../clue";

export const besucherliste: Clue<'images'> = {
  type: 'images',
  id: 'besucherliste',
  cost: 10,
  title: 'Patientenbesucherliste',
  thumbnailAssetId: 'clues/kursbuch/Kursbuch-01.png',
  images: {
    assetIds: ['clues/kursbuch/Kursbuch-01.png'],
  }
}