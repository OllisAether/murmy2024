import { italic, textContent } from "../../textContent";
import { Transcript } from "../../transcript";
import { getSuspectById } from "../suspects";

export const stalker1: Transcript =  {
  id: 'stalker1',
  for: 'Stalkeraufnahme 1.mp4',
  thumbnailAssetId: 'thumbnails/stalker1.webp',
  title: 'Stalkeraufnahme 1',
  content: [
    [null, 'Phineas setzt sich alleine auf eine Bank auf dem Schulhof.\nIvy kommt auf Phineas zu und gibt ihm eine Rose.\nPhineas nimmt die Rose und wirft sie gnadenlos in den Busch.'],
    ['cassandra', 'Wow, Ivy wurde einfach gerade brutalst gekorbt.'],
    [null, 'Hugo Montague versucht auf Ivy zu zulaufen'],
    ['hugo', 'Ivy-'],
    [null, 'Justin rennt auf die Tischtennisplatte und schreit. \nHugo Montague bleibt stehen.'],
    ['justin', 'Leute, ich habe gerade meine erste Diamond Armor gecraftet. Wallah morgen sogar Hose!'],
    [{ speaker: 'hugo', withLastSpeaker: true }, textContent([italic('*Unverständliches*'), ' Was machst du denn da. Komm da runter! ', italic('*Unverständliches*')])],
    [null, 'Ivy rennt weinend weg.\nHugo Montague schaut Ivy hinterher und macht einen Schritt in ihre Richtung, bleibt dann aber stehen.'],
  ],
  speakers: [
    {
      id: 'cassandra',
      flipAvatar: true,
      avatarAssetId: 'suspects/Cassy1.webp',
      name: getSuspectById('cassandra')?.name ?? '',
      color: getSuspectById('cassandra')?.color
    },
    {
      id: 'justin',
      avatarAssetId: 'suspects/Justin1.webp',
      flipAvatar: true,
      name: getSuspectById('justin')?.name ?? '',
      color: getSuspectById('justin')?.color
    },
    {
      id: 'hugo',
      avatarAssetId: 'suspects/Hugo1.webp',
      flipAvatar: true,
      alignment: 'right',
      name: getSuspectById('hugo')?.name ?? '',
      color: getSuspectById('hugo')?.color
    },
  ]
}