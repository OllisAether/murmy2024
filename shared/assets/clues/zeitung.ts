import { Clue } from "../../clue";
import { italic, textContent } from "../../textContent";

export const zeitung: Clue<'images'> = {
  type: 'images',
  id: 'zeitung',
  cost: 0,
  title: 'Zeitung',
  thumbnailAssetId: 'thumbnails/Zeitung.webp',
  images: {
    assetIds: ['clues/Zeitung.webp'],
    entries: [
      {
        rect: {
          x: 0.16269835896880416,
          y: 0.29641947239422084,
          width: 0.6690620938041595,
          height: 0.48211751805985553,
        },
        entry: {
          id: 'zeitung-leiche-im-wald',
          title: textContent(['Zeitungsartikel - ', italic('„LEICHE IM WALD GEFUNDEN“')]),
          description: 'Am 16. Februar 2013, wurde die Leiche von Phineas Musé im Stadtwald unweit einer abgelegenen Holzfällerhütte aufgefunden. Der Tod wird auf zwei Tage zuvor datiert.',
          suspectId: 'phineas',
        }
      }
    ]
  },
}