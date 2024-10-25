import { Transcript } from "../../transcript";
import { getSuspectById } from "../suspects";

export const justinssprachaufnahme: Transcript =  {
  id: 'justinssprachaufnahme',
  for: 'Justins Sprachaufnahme.mp3',
  thumbnailAssetId: 'thumbnails/Ritual.webp',
  title: 'Ivys Ritual der ewigen Liebe',
  content: [
    
  ],
  speakers: [
    {
      id: 'ivy',
      avatarAssetId: 'suspects/phoebe.webp',
      flipAvatar: true,
      alignment: 'right',
      name: getSuspectById('ivy')?.name ?? '',
      color: getSuspectById('ivy')?.color
    }
  ]
}