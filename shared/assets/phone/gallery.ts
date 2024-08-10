import { ImageEntry } from "../../clue"
import { idGen } from "../../random"

export interface GalleryItem {
  assetId: string,
  date: string,
  entries?: ImageEntry[]
}

export const gallery: GalleryItem[] = [
  ...Array(28).fill({
    assetId: 'dokumente/VandalismusPost.jpg',
    date: '2013-01-01 02:03',
  } satisfies GalleryItem).map<GalleryItem>((item, index) => ({
    ...item,
    date: `2013-01-${index + 1} 02:03`,
    entries: [{
      rect: { x: 0, y: 0, width: 1, height: 1 },
      entry: {
        matterId: 'vandalismusPost' + index + idGen(),
        suspectId: 'daphne',
        title: 'Vandalismus vom Daphne',
      }
    }],
  })),
]
