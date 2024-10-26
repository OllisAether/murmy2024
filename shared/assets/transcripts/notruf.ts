import { entry, textContent } from "../../textContent";
import { Transcript } from "../../transcript";
import { getSuspectById } from "../suspects";

export const notruf: Transcript =  {
  id: 'notruf',
  for: 'Notruf.mp3',
  thumbnailAssetId: 'thumbnails/kw.webp',
  title: 'Telefontaufzeichnung 13:45: Notruf 112',
  content: [
    ['notrufzentrale', 'Notrufzentrale Alt-Arborwinde, was ist-'],
    ['cassy', textContent(['Hallo Krankenwagen? Mein Name ist Cassandra Novak. ', entry({
      id: 'cassy-notruf-1',
      suspectId: 'cassandra',

      title: 'Notruf: Jemand wurde zusammengeschlagen',
      description: 'Cassandra ruft die Notrufzentrale an, um einen Krankenwagen zu rufen, da jemand brutal zusammengeschlagen wurde.\n\nWer wurde jemanden zusammengeschlagen?'
    }, 'Hier wurde jemand brutal zusammengeschlagen. E- Es war schlimm. Er ist jetzt bewusstlos. Kommen Sie schnell. Ich will nicht, dass er hier stirbt, ich brauche ihn noch.')])],
    ['notrufzentrale', 'Okay, okay, beruhigen Sie sich erstmal. Wo sind Sie denn?'],
    ['cassy', 'Ehm- Wir sind im Park am- am Brunnen.'],
    ['notrufzentrale', 'Am Tannen-Weiher?'],
    ['cassy', 'Ja, genau. Bitte beeilen Sie sich jetzt.'],
    [null, entry({
      id: 'cassy-notruf-ende',
      suspectId: 'cassandra',

      title: 'Anruf wird abrupt beendet',
      description: 'Cassandra legt abrupt auf.\n\nWieso legt sie auf?'
    }, 'Anruf wird beendet.')]
  ],
  speakers: [
    {
      id: 'notrufzentrale',
      name: 'Notrufzentrale',
      alignment: 'right',
      color: '#ff0000'
    },
    {
      id: 'cassy',
      avatarAssetId: 'suspects/Cassy1.webp',
      name: getSuspectById('cassandra')?.name ?? '',
      color: getSuspectById('cassandra')?.color
    }
  ]
}