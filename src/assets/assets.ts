import { Asset } from '@/model/asset';
import { media } from './media';

export const teamAssets: Asset[] = [
]

export const boardAssets: Asset[] = [
  ...media.map(m => m.asset),
]
