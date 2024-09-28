import { Clue } from "../../clue";
import { bold, textContent } from "../../textContent";

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
          id: 'leiche-im-wald',
          title: 'LEICHE IM WALD GEFUNDEN',
          description: textContent([
            bold('LEICHE IM STADTWALD LEBENDIG BEGRABEN!!!'),
            '\n\nAm Samstag, den 16. Februar 2013, wurde im Stadtwald von Alt-Arborwinde die Leiche eines jungen Mannes entdeckt. Bei dem Opfer handelt es sich um Phineas Musé, eines Jugendlichen, der von Ermittlern identifiziert wurde. Phineas wurde lebendig begraben und erlag seinem qualvollen Schicksal bereits zwei Tage zuvor, unweit einer abgelegenen Holzfällerhütte.\n\nDie Ermittler fahnden weiterhin intensiv nach dem Täter.'
          ]),
          suspectId: 'phineas',
        }
      }
    ]
  },
}