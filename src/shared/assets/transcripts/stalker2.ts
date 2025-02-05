import { entry, italic, shaky, textContent } from "../../textContent";
import { Transcript } from "../../transcript";
import { getSuspectById } from "../suspects";

export const stalker2: Transcript =  {
  id: 'stalker2',
  for: 'Stalkeraufnahme 2.mp4',
  thumbnailAssetId: 'thumbnails/stalker2.webp',
  title: 'Stalkeraufnahme 2',
  content: [
    [null, entry({
      id: 'stalker2-zeit',
      suspectId: 'cassandra',

      title: '13:43 Uhr - Cassandra filmt Phineas im Park',
      description: 'Am 14.02.2013 um 13:43 Uhr filmt Cassandra Phineas im Park.'
    }, 'Zeitstempel: 14.02.2013 13:43')],
    ['cassandra', 'Oh mein Gott, Leute! Phiny ist alleine im Park.'],
    [null, 'Die Kamera schwenkt zu Phineas, der alleine durch den Park läuft'],
    ['cassandra', 'Aber ich bin immer bei dir, Phiny ❤️'],
    [null, 'Die Kamera zoomt auf Phineas.'],
    ['cassandra', textContent(['Wow! ', entry('cassy-phineas-perfekt', 'Er ist so perfekt.'), entry('cassy-phineas-opfer', ' Perfekt für meine Rituale.')])],
    [null, 'Justin erscheint aus dem Hintergrund und geht auf Phineas zu'],
    ['cassandra', textContent(['Was macht ', italic('der'), ' denn hier?'])],
    [null, 'Cassandra versteckt sich hinter einem Baum'],
    ['justin', 'Was machst du hier, du Billo ey?'],
    ['Phineas', 'Lass mich in Ruhe! Lass mich in Ruhe!'],
    [{ speaker: 'justin', withLastSpeaker: true }, shaky('DU WEISST, DASS DAS MEIN REVIER IST! WAS MACHST DU HIER?')],
    [null, textContent([entry({
      id: 'justin-schlaegt-phineas',
      suspectId: 'justin',

      title: 'Schlägt Phineas zusammen',
      description: 'Justin schlägt Phineas zusammen bis er sich nicht mehr bewegt.\n\nHat Justin Phineas umgebracht?'
    }, 'Justin schlägt Phineas ins Gesicht und Phineas fällt zu Boden.'), '\nDie Kamera schwenkt zu Cassandra, die sich die Hand vor den Mund hält.\nDie Kamera schwenkt zurück zu Phineas, der von Justin weiter geschlagen wird.'])],
    ['justin', shaky(textContent(['WAS MACHST DU HIER? KOMM SCHON, ', entry({
      id: 'justin-villager',
      suspectId: 'justin',
      title: italic('„Villager“'),
      description: textContent([
        'Justin nennt Phineas „Villager“.'
      ])
    }, 'DU SCHEISS VILLAGER!'), ' SCHLAG MICH SCHON!']))],
    ['cassandra', 'Justin ruiniert einfach alles! Aber wow, ich kann einfach nicht wegsehen.'],
    [{ speaker: 'justin', withLastSpeaker: true }, shaky('SCHLAG MICH! SCHLAG MICH SCHON! WAS MACHST DU?')],
    ['justin', shaky('SCHLAG MICH! KOMM SCHON!')],
    [null, 'Justin pausiert und schaut auf Phineas, der am Boden liegt'],
    ['justin', 'Scheiße man!'],
    [null, textContent([entry({
      id: 'justin-rennt-weg',
      suspectId: 'justin',

      title: 'Rennt weg',
      description: 'Justin rennt weg nachdem er Phineas zusammengeschlagen hat.\n\nHat er Angst vor Konsequenzen?'
    }, 'Justin rennt weg.'), '\nDie Kamera schwenkt zu Cassandra.'])],
    ['cassandra', 'Ach du liebes Orakel! Das ist perfekt für meinen Blog. Aber- Scheiße, ich brauche Phiny noch. Ich muss den Krankenwagen rufen.'],
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
      alignment: 'right',
      name: getSuspectById('justin')?.name ?? '',
      color: getSuspectById('justin')?.color
    },
  ]
}