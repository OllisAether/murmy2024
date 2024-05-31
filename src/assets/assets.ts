import { Asset } from '../../shared/asset';
import { files } from './files';

export const assets: Asset[] = [
  ...files.map(f => f.asset)
]