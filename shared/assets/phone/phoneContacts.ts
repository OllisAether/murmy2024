export interface Contact {
  name?: string
  number: string
  avatarAssetId?: string
}

export const contacts: Contact[] = [
  {
    name: 'John Doe',
    number: '+1234567890',
    avatarAssetId: 'thumbnails/fleur.png',
  },
  {
    name: 'Jane Smith',
    number: '+0987654321',
  },
  {
    number: '+1122334455',
    avatarAssetId: 'thumbnails/xavier1.png',
  },
  {
    name: 'Alice Johnson',
    number: '+1222333444',
  },
  {
    name: 'Bob Brown',
    number: '+1555666777',
    avatarAssetId: 'thumbnails/carpentier.png',
  },
];