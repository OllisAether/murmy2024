import { Suspect } from "../suspectDatabase/suspect";

export const phoebe: Suspect = {
  id: 'phoebe',
  name: 'Phoebe Blight',
  color: '#ffef40',
  imageAssetId: 'suspects/phoebe.webp',
}

export const phineas: Suspect = {
  id: 'phineas',
  name: 'Phineas X',
  color: '#7dff04',
  imageAssetId: 'suspects/phoebe.webp',
}

export const justin: Suspect = {
  id: 'justin',
  name: 'Justin van Bustin',
  color: '#ff4040',
  imageAssetId: 'suspects/phoebe.webp',
}

export const delora: Suspect = {
  id: 'delora',
  name: 'X Delora',
  color: '#c9cdec',
  imageAssetId: 'suspects/phoebe.webp',
}

export const lehrer: Suspect = {
  id: 'lehrer',
  name: 'Lehrer',
  color: '#5044f8',
  imageAssetId: 'suspects/phoebe.webp',
}

export const okkult: Suspect = {
  id: 'okkult',
  name: 'Okkult Leader',
  color: '#8940ff',
  imageAssetId: 'suspects/phoebe.webp',
}

export const suspects: Suspect[] = [
  phoebe,
  phineas,
  justin,
  delora,
  lehrer,
  okkult,
]

export function getSuspectById(id: string) {
  return suspects.find(suspect => suspect.id === id)
}