import { Clue } from "../../clue";

export const autopsieberichtIvy: Clue<'images'> = {
  type: 'images',
  id: 'autopsieberichtIvy',
  cost: 20,
  title: 'Autopsiebericht von Ivy',
  thumbnailAssetId: 'thumbnails/AutopsieIvy.webp',
  images: {
    assetIds: ['clues/AutopsieIvy.webp'],
    entries: [
      {
        rect: {
          x: 0.1889431299885975,
          y: 0.31509682211925866,
          width: 0.14582739452679588,
          height: 0.02919772360999194,
        },
        entry: {
          id: 'ivy-blutgruppe',
          suspectId: 'ivy',

          title: 'Blutgruppe A+',
          description: 'Ivy hat die Blutgruppe A+.'
        }
      },
      {
        rect: {
          x: 0.8253545467502851,
          y: 0.4903240834004835,
          width: 0.13084378563283922,
          height: 0.021212102135374698,
        },
        entryId: 'ivy-todesdatum',
      },
      {
        rect: {
          x: 0.5612483965222349,
          y: 0.5759247834407736,
          width: 0.04716897092360319,
          height: 0.03234853444802579,
        },
        entry: {
          id: 'ivy-schnittwunde',
          suspectId: 'ivy',

          title: 'Schnittwunde am Hals',
          description: 'Ivy hat eine Schnittwunde am Hals.'
        }
      },
      {
        rect: {
          x: 0.05450042759407069,
          y: 0.5722797894842868,
          width: 0.30116430302166475,
          height: 0.13016846293311846,
        },
        entryId: 'ivy-schnittwunde'
      }
    ]
  }
}

export const autopsieberichtPhineas: Clue<'images'> = {
  type: 'images',
  id: 'autopsieberichtPhineas',
  cost: 20,
  title: 'Autopsiebericht von Phineas',
  thumbnailAssetId: 'thumbnails/AutopsiePhineas.webp',
  images: {
    assetIds: ['clues/AutopsiePhineas.webp'],
  }
}

