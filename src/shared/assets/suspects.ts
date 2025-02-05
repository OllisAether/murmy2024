import { Suspect } from "../suspectDatabase/suspect";

export const phoebe: Suspect = {
  id: 'phoebe',
  name: 'Phoebe Blight',
  color: '#ffef40',
  imageAssetId: 'suspects/Phoebe1.webp',
}

export const phineas: Suspect = {
  id: 'phineas',
  name: 'Phineas Musé',
  color: '#f89b44',
  imageAssetId: 'suspects/Phineas.webp',
}

export const justin: Suspect = {
  id: 'justin',
  name: 'Justin van Bustin',
  color: '#ff4040',
  imageAssetId: 'suspects/Justin1.webp',
}

export const ivy: Suspect = {
  id: 'ivy',
  name: 'Ivy Delora',
  color: '#82f573',
  imageAssetId: 'suspects/Ivy.webp',
}

export const lehrer: Suspect = {
  id: 'hugo',
  name: 'Hugo Montague',
  color: '#61f0c3',
  imageAssetId: 'suspects/Hugo1.webp',
}

export const cassandra: Suspect = {
  id: 'cassandra',
  name: 'Cassandra Novak',
  color: '#9834b6',
  imageAssetId: 'suspects/Cassy1.webp',
}

export const orakel: Suspect = {
  id: 'orakel',
  name: 'Das Orakel',
  color: '#d7a7ff',
  imageAssetId: 'suspects/orakel.webp',
}

export const suspects: Suspect[] = [
  phoebe,
  phineas,
  justin,
  ivy,
  lehrer,
  cassandra,
  orakel,
]

export function getSuspectById(id: string) {
  return suspects.find(suspect => suspect.id === id)
}