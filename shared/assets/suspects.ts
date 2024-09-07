import { Suspect } from "../suspectDatabase/suspect";

export const suspects: Suspect[] = [
  {
    id: 'phoebe',
    name: 'Phoebe Blight',
    color: '#ffef40',
    imageAssetId: 'suspects/phoebe.webp',
  },
  {
    id: 'justin',
    name: 'Justin van Bustin',
    color: '#ff4040',
    imageAssetId: 'thumbnails/carpentier.png',
  },
  {
    id: 'delora',
    name: 'X Delora',
    color: '#c9cdec',
    imageAssetId: 'thumbnails/carpentier.png',
  },
  {
    id: 'lehrer',
    name: 'Lehrer',
    color: '#5044f8',
    imageAssetId: 'thumbnails/carpentier.png',
  },
  {
    id: 'okkult',
    name: 'Okkult Leader',
    color: '#8940ff',
    imageAssetId: 'thumbnails/carpentier.png',
  },
]

export function getSuspectById(id: string) {
  return suspects.find(suspect => suspect.id === id)
}