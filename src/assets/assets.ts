import { Asset } from '@/model/asset';
import { media } from './media';

export const teamAssets: Asset[] = [
  {
    name: 'sasha',
    type: 'image',
    url: '/sasha.png'
  },
  {
    name: 'clue1',
    type: 'image',
    url: '/clue1.png'
  }
]

export const boardAssets: Asset[] = [
  ...media.map(m => m.asset),
]
