import { entry, textContent } from "../../textContent";
import { Transcript } from "../../transcript";

export const krankenhausLog: Transcript =  {
  id: 'krankenhausLog',
  for: 'KrankenhausLog.mp3',
  thumbnailAssetId: 'thumbnails/intercom.webp',
  title: 'Log_17_45_016',
  content: [
    ['elli', textContent(['Hallo?! Schwester Ellie hier, ', entry('phineas-zimmer', 'Zimmer- eh- B34'), '! ', entry({
      id: 'phineas-verschwunden',
      suspectId: 'phineas',

      title: 'Krankenschwester findet Phineas nicht',
      description: 'Krankenschwester Elli findet Phineas nicht in seinem Zimmer.'
    }, 'Der Patient Phineas Musé. Er- Er ist weg!'), ' ', entry({
      id: 'phineas-kissen',
      suspectId: 'phineas',

      title: 'Kissen unter der Decke',
      description: 'Die Kissen seien so arrangiert, dass es aussieht, als würde Phineas noch im Bett liegen.\n\nIst er geflohen?'
    }, 'Die Kissen unter der Decke- sie sahen aus als würde er noch im Bett liegen!'), ' Bitte sofort handeln! Er ist einfach verschwunden!'])],
  ],
  speakers: [
    {
      id: 'elli',
      name: 'Krankenschwester Elli',
      color: '#ff8594'
    }
  ]
}