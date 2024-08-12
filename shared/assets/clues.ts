import { Clue, ClueTypes } from '../clue';
import { idGen } from '../random';

export const clues: Clue<ClueTypes>[] = [
  {
    id: 'fp1',
    type: 'image',
    cost: 10,
    title: 'Gebäudeplan: EG',
    description: 'A clue that will help you solve the mystery.',
    thumbnailAssetId: 'floorplan/floorplan_eg.png',
    image: {
      assetId: 'floorplan/floorplan_eg.png',
      entries: [
        {
          index: 0,
          entry: {
            matterId: idGen(),
            suspectId: 'carpentier',

            title: 'Kamera 1',
            description: 'Eine Kamera, die den Eingangsbereich überwacht.\nVermutlich ist sie mit dem Sicherheitssystem verbunden.',
            image: {
              imageAssetId: 'floorplan/floorplan_eg.png',
              imageCrop: {
                x: (825 - 50) / 1600,
                y: (560 - 50) / 1200,
                width: 150 / 1600,
                height: 150 / 1200
              }
            },
          },
          rect: {
            x: 825 / 1600,
            y: 560 / 1200,
            width: 50 / 1600,
            height: 50 / 1200
          }
        }
      ]
    }
  },
  {
    id: 'fp2',
    type: 'image',
    cost: 10,
    title: 'Gebäudeplan: 1. OG',
    description: 'A clue that will help you solve the mystery. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.',
    thumbnailAssetId: 'floorplan/floorplan_1og.png',
    image: {
      assetId: 'floorplan/floorplan_1og.png',
      entries: []
    }
  },
  {
    id: 'fp3',
    type: 'image',
    cost: 10,
    title: 'Gebäudeplan: 2. OG',
    description: 'A clue that will help you solve the mystery.',
    thumbnailAssetId: 'floorplan/floorplan_2og.png',
    image: {
      assetId: 'floorplan/floorplan_2og.png',
      entries: []
    },
  },
  {
    id: 'druckverlauf',
    type: 'imageStack',
    cost: 10,
    title: 'Druckverlauf',
    description: 'A clue that will help you solve the mystery.',
    thumbnailAssetId: 'dokumente/druckverlauf/Druckverlauf-01.png',
    imageStack: {
      assetIds: Array(30).fill(0).map((_, i) => `dokumente/druckverlauf/Druckverlauf-${String(i + 1).padStart(2, '0')}.png`),
      entries: []
    }
  }
]