import { Clue } from "../../clue";

export const stundenplan: Clue<'images'> = {
  type: 'images',
  id: 'stundenplan',
  cost: 20,
  title: 'Stundenplan von Hugo Montague',
  thumbnailAssetId: 'thumbnails/Stundenplan.webp',
  images: {
    assetIds: ['clues/Stundenplan.webp'],
    entries: [
      {
        rect: {
          x: 0.341111064753004,
          y: 0.3794665892672859,
          width: 0.1342571345126836,
          height: 0.03772010448916409,
        },
        entry: {
          id: 'hugo-orchester-stundenplan',
          title: 'Orchester-AG dienstags 7. Stunde',
          suspectId: 'hugo',
          description: 'Hugo Montague hat die Orchester-AG dienstags in der 7. Stunde im Raum A.301Mu.',
        }
      }
    ]
  }
}