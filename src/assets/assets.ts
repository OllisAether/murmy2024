import { Asset } from '@/model/asset';
import { chatAccounts } from './chats';
import { files } from './files';
import { media } from './media';
import { emailAccounts, emails } from './emails';

export const teamAssets: Asset[] = [
  ...files.map(f => f.asset),
  ...chatAccounts.filter(a => a.avatarUrl).map<Asset>(a => ({
    type: 'image',
    name: 'chat-' + a.personId,
    url: a.avatarUrl!
  })),
  ...emailAccounts.filter(a => a.avatarUrl).map<Asset>(a => ({
    type: 'image',
    name: 'email-' + a.personId,
    url: a.avatarUrl!
  })),
  ...emails.map(e => e.attachments).filter(a => a).flat().map(f => f!.asset),
].filter((a, i, arr) => arr.findIndex(b => b.name === a.name) === i)

export const boardAssets: Asset[] = [
  ...media.map(m => m.asset),
].filter((a, i, arr) => arr.findIndex(b => b.name === a.name) === i)
