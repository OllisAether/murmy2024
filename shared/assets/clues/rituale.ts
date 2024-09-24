import { Clue } from "../../clue";
import { italic } from "../../textContent";

export const rituale: Clue<'images'> = {
  type: 'images',
  id: 'rituale',
  cost: 10,
  title: 'Rituale',
  thumbnailAssetId: 'thumbnails/Rituale.webp',
  description: 'Verschiedene voll gekritzelte Blätter mit Ritualen aus dem Okkultclub-Raum.',
  images: {
    assetIds: [
      'clues/Ritual4.webp',
      'clues/Ritual5.webp',
      'clues/Ritual3.webp',
      'clues/Ritual2.webp',
    ],
    entries: [
      {
        index: 0,
        rect: {
          x: 0.09731852213541667,
          y: 0.901595140781108,
          width: 0.2846132960464015,
          height: 0.017743102861035424
        },
        entry: {
          id: 'brettspiel',
          title: 'Kreis des Orakels Brettspiel',
          suspectId: 'orakel',
          description: 'Scheinbar handelt es sich um Karten eines Brettspiel, das „Kreis des Orakels“ genannt wird.\n\nIst das Orakel nichts weiter als ein Spiel?',
        }
      },
      {
        index: 1,
        rect: {
          x: 0.09731852213541667,
          y: 0.901595140781108,
          width: 0.2846132960464015,
          height: 0.017743102861035424
        },
        entryId: 'brettspiel',
      },
      {
        index: 2,
        rect: {
          x: 0.09731852213541667,
          y: 0.901595140781108,
          width: 0.2846132960464015,
          height: 0.017743102861035424
        },
        entryId: 'brettspiel',
      },
      {
        index: 3,
        rect: {
          x: 0.09731852213541667,
          y: 0.901595140781108,
          width: 0.2846132960464015,
          height: 0.017743102861035424
        },
        entryId: 'brettspiel',
      }
    ]
  },
}

export const liebesRitual: Clue<'images'> = {
  type: 'images',
  id: 'liebesRitual',
  cost: 10,
  title: 'Ritual der ewigen Liebe',
  thumbnailAssetId: 'thumbnails/Ritual1.webp',
  description: 'Ein verkritzeltes Blatt mit einem Ritual der ewigen Liebe.',
  images: {
    assetIds: [
      'clues/Ritual1.webp',
    ],
    entries: [
      {
        rect: {
          x: 0.18072443181818182,
          y: 0.4216301941416894,
          width: 0.3753693181818182,
          height: 0.0337508514986376
        },
        entry: {
          id: 'stirb-einer-folgt-der-andere',
          title: italic('„Stirb einer, folgt der andere“'),
          description: 'Nach dem Ritual ist das Leben der beiden Liebenden untrennbar miteinander verbunden. Stirbt einer, so folgt der andere.\n\nDoch ist das wirklich wahr?',
          suspectId: 'orakel',
        },
      },
      {
        rect: {
          x: 0.7729339606843473,
          y: 0.7860892985690863,
          width: 0.15526453947395782,
          height: 0.19757894965256248,
          transform: 'rotate(36.814593567183806deg)'
        },

        entry: {
          id: 'blutflecken',
          title: 'Blutflecken',
          description: 'Dem Anschein nach sind die Blutflecken auf dem Ritual der ewigen Liebe echt.\n\nVon wem könnten sie stammen?',
          suspectId: 'orakel',
        },
      },
      {
        rect: {
          x: 0.09731852213541667,
          y: 0.901595140781108,
          width: 0.2846132960464015,
          height: 0.017743102861035424
        },
        entryId: 'brettspiel',
      },
      {
        rect: {
          x: 0.1823626893939394,
          y: 0.32940934377838327,
          width: 0.31453598484848483,
          height: 0.029791808583106268
        },
        entry: {
          id: 'waerend-blut-fliesst',
          title: italic('„während das Blut fließt“'),
          suspectId: 'orakel',
          description: 'Um das Ritual der ewigen Liebe durchzuführen, muss das Blut der Ausführenden fließen.\n\nWer würde so weit gehen?',
        },
      }
    ]
  },
}