import { Asset } from '@/model/asset';
import { accounts } from './chats';
import { files } from './files';

export const teamAssets: Asset[] = [
  ...files.map(f => f.asset),
  ...accounts.filter(a => a.avatarUrl).map<Asset>(a => ({
    type: 'image',
    name: 'avatar-' + a.personId,
    url: a.avatarUrl!
  }))
]

export const boardAssets: Asset[] = [
]
