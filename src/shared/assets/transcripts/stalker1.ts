import { entry, italic, textContent } from "../../textContent";
import { Transcript } from "../../transcript";
import { getSuspectById } from "../suspects";

export const stalker1: Transcript =  {
  id: 'stalker1',
  for: 'Stalkeraufnahme 1.mp4',
  thumbnailAssetId: 'thumbnails/stalker1.webp',
  title: 'Stalkeraufnahme 1',
  content: [
    [null, entry({
      id: 'stalker1-zeit',
      suspectId: 'cassandra',

      title: '11:16 Uhr - Cassandra filmt Phineas auf dem Schulhof',
      description: 'Am 14.02.2013 um 11:16 Uhr filmt Cassandra Phineas auf dem Schulhof.'
    }, 'Zeitstempel: 14.02.2013 11:16')],
    [null, textContent(['Phineas setzt sich alleine auf eine Bank auf dem Schulhof.\n', entry({
      id: 'ivy-rose',
      suspectId: 'ivy',

      title: 'Ivy gibt Phineas eine Rose',
      description: 'Ivy kommt auf Phineas zu und gibt ihm eine Rose.'
    }, 'Ivy kommt auf Phineas zu und gibt ihm eine Rose.'), '\n', entry({
      id: 'phineas-rose',
      suspectId: 'phineas',

      title: 'Lehnt die Rose ab',
      description: 'Phineas nimmt die Rose und wirft sie gnadenlos in den Busch.\n\nWie würde sich Ivy fühlen?'
    }, 'Phineas nimmt die Rose und wirft sie gnadenlos in den Busch.')])],
    ['cassandra', 'Wow, Ivy wurde einfach gerade brutalst gekorbt.'],
    [null, entry({
      id: 'hugo-ivy-ansprechen',
      suspectId: 'hugo',

      title: 'Hugo Montague will Ivy ansprechen',
      description: 'Hugo Montague versucht auf Ivy zuzulaufen, um sie anzusprechen. Doch Justin kommt ihm in die Quere.'
    }, 'Hugo Montague versucht auf Ivy zu zulaufen')],
    ['hugo', 'Ivy-'],
    [null, 'Justin rennt auf die Tischtennisplatte und schreit. \nHugo Montague bleibt stehen.'],
    ['justin', 'Leute, ich habe gerade meine erste Diamond Armor gecraftet. Wallah morgen sogar Hose!'],
    [{ speaker: 'hugo', withLastSpeaker: true }, textContent([italic('*Unverständliches*'), ' Was machst du denn da. Komm da runter! ', italic('*Unverständliches*')])],
    [null, textContent([entry({
      id: 'ivy-wegrennen',
      suspectId: 'ivy',

      title: 'Rennt weinend weg',
      description: 'Ivy rennt weinend weg.\n\nWohin geht sie?'
    }, 'Ivy rennt weinend weg.'), '\nHugo Montague schaut Ivy hinterher und macht einen Schritt in ihre Richtung, bleibt dann aber stehen.'])],
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