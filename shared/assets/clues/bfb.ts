import { Clue } from "../../clue";

export const bfbChloroformTuch: Clue<'images'> = {
  type: 'images',
  id: 'bfbChloroformTuch',
  cost: 20,
  title: 'Beweisfundbericht: Chloroformtuch',
  thumbnailAssetId: 'thumbnails/BfbTuch.webp',
  images: {
    assetIds: ['clues/BfbTuch.webp'],
    entries: [
      {
        rect: {
          x: 0.11233697976054732,
          y: 0.4733613265511684,
          width: 0.42898820553021666,
          height: 0.06760865733279613,
        },
        entry: {
          id: 'chloroformtuch',
          suspectId: 'general',
          
          title: 'Chloroformtuch',
          description: 'Ein Tuch, das mit Chloroform getränkt wurde.\n\nChloroform ist ein chlorierter Kohlenwasserstoff, der lange Zeit als Betäubungs- bzw. Narkosemittel große Bedeutung in der Chirurgie und der Anästhesie hatte.\n\nWurde dieses Tuch benutzt, um jemanden zu betäuben?',
        }
      },
      {
        rect: {
          x: 0.39558687286202965,
          y: 0.28508385374697826,
          width: 0.40878438568985176,
          height: 0.02498615028203062,
        },
        entry: {
          id: 'chloroformtuch-fundort',
          suspectId: 'general',

          title: 'Fundort des Tuchs',
          description: 'Das Tuch wurde im Zimmer B34 des Klinikums Alt-Arborwinde gefunden.\n\nWarum wurde es dort hinterlassen?'
        }
      }
    ]
  }
}

export const bfbDolch: Clue<'images'> = {
  type: 'images',
  id: 'bfbDolch',
  cost: 20,
  title: 'Beweisfundbericht: Dolch',
  thumbnailAssetId: 'clues/BfbDolch.webp',
  images: {
    assetIds: ['clues/BfbDolch.webp'],
    entries: [
      {
        rect: {
          x: 0.42585688354214124,
          y: 0.5524746927880742,
          width: 0.133310791571754,
          height: 0.023339922441579373,
        },
        entry: {
          id: 'bluttyp-auf-dolch',
          suspectId: 'general',

          title: 'Bluttyp A+ auf Dolch',
          description: 'Der Dolch ist mit Blut besudelt, das die Blutgruppe A+ aufweist.\n\nWem gehört das Blut?'
        }
      },
      {
        rect: {
          x: 0.45580776623006836,
          y: 0.4768992999597099,
          width: 0.3222878701594533,
          height: 0.023339922441579373,
        },
        entry: {
          id: 'dolch-fundort',
          suspectId: 'general',

          title: 'Fundort des Dolchs',
          description: 'Der Dolch wurde im Stadtwald neben Phineas Musés Leiche gefunden.\n\nWarum wurde er dort hinterlassen?'
        }
      },
      {
        rect: {
          x: 0.39517635962414577,
          y: 0.28453616035455276,
          width: 0.45936254271070615,
          height: 0.023339922441579373,
        },
        entryId: 'dolch-fundort'
      }
    ]
  }
}