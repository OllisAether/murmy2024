import { Clue, ClueTypes } from '../../clue';
import { map } from './map';

export const clues: Clue<ClueTypes>[] = [
  map,
  // {
  //   id: 'fp1',
  //   type: 'images',
  //   cost: 10,
  //   title: 'Gebäudeplan: EG',
  //   description: 'A clue that will help you solve the mystery.',
  //   thumbnailAssetId: 'floorplan/floorplan_eg.png',
  //   images: {
  //     assetIds: ['floorplan/floorplan_eg.png'],
  //     entries: [
  //       {
  //         index: 0,
  //         entry: {
  //           id: 'camera1',
  //           suspectId: 'carpentier',

  //           title: 'Kamera 1',
  //           description: 'Eine Kamera, die den Eingangsbereich überwacht.\nVermutlich ist sie mit dem Sicherheitssystem verbunden.',
  //           imageAssetId: 'floorplan/floorplan_eg.png',
  //         },
  //         rect: {
  //           x: 825 / 1600,
  //           y: 560 / 1200,
  //           width: 50 / 1600,
  //           height: 50 / 1200
  //         }
  //       }
  //     ]
  //   }
  // },
  // {
  //   id: 'fp2',
  //   type: 'images',
  //   cost: 10,
  //   title: 'Gebäudeplan: 1. OG',
  //   description: 'A clue that will help you solve the mystery. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.',
  //   thumbnailAssetId: 'floorplan/floorplan_1og.png',
  //   images: {
  //     assetIds: ['floorplan/floorplan_1og.png']
  //   }
  // },
  // {
  //   id: 'fp3',
  //   type: 'images',
  //   cost: 10,
  //   title: 'Gebäudeplan: 2. OG',
  //   description: 'A clue that will help you solve the mystery.',
  //   thumbnailAssetId: 'floorplan/floorplan_2og.png',
  //   images: {
  //     assetIds: ['floorplan/floorplan_2og.png']
  //   },
  // },
  // {
  //   id: 'druckverlauf',
  //   type: 'images',
  //   cost: 10,
  //   title: 'Druckverlauf',
  //   description: 'A clue that will help you solve the mystery.',
  //   thumbnailAssetId: 'dokumente/druckverlauf/Druckverlauf-01.png',
  //   images: {
  //     assetIds: Array(30).fill(0).map((_, i) => `dokumente/druckverlauf/Druckverlauf-${String(i + 1).padStart(2, '0')}.png`),
  //   }
  // }
]