import { Gallery, GalleryItem } from "../../phone/gallery"
import { idGen } from "../../random"

export const gallery: Gallery = [
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
        suspectId: 'lumine',
        title: 'Vandalismus vom Daphne',
        description: 'Ein Post von Daphne auf Instagram in dem vandaliertem Schulklo. Vielleicht steckt sie dahinter?',
        image: {
          imageAssetId: 'dokumente/VandalismusPost.jpg',
        },
      }
    }],
  })),
]
