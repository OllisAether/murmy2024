import { entry, textContent } from "../../textContent";
import { Transcript } from "../../transcript";
import { getSuspectById } from "../suspects";

export const liebesritual: Transcript =  {
  id: 'liebesritual',
  for: 'Ivys Suizid.mp4',
  thumbnailAssetId: 'thumbnails/suizid.webp',
  title: 'Ivys Ritual der ewigen Liebe',
  content: [
    [null, entry({
      id: 'ivy-suizid-zeit',
      suspectId: 'ivy',

      title: '13:26 Uhr - Ivy führt das Ritual der ewigen Liebe durch',
      description: 'Am 14.02.2013 um 13:26 Uhr führt Ivy ein Ritual der ewigen Liebe durch.'
    }, 'Zeitstempel: 14.02.2013 13:26')],
    
    ['ivy', 'Hii Verehrer des Orakels. Ich habe heute etwas ganz ganz besonderes vor. Ihr werdet es gleich sehen, aber zunächst-'],

    [null, textContent(['Zeigt mit dem Finger auf ', entry({
      id: 'ivy-huette',
      suspectId: 'ivy',

      title: 'Ivys Hütte',
      description: 'Ivy hat eine Hütte im Stadtwald. Dort führt sie das Ritual der ewigen Liebe durch.'
    }, 'eine Hütte'), ' und läuft darauf zu'])],

    ['ivy', textContent([entry('ivy-huette', 'Schaut, meine Hütte.'), ' Sie ist der perfekte Ort für das was ich vor habe.'])],

    [null, 'Geht in die Hütte\nStellt die Kamera auf eine unstabile Oberfläche'],

    ['ivy', textContent([`Steht die?

    Ok, kommen wir nun zu unserem ganz besonderen Ritual. Es geht um `, entry({
      id: 'ivy-liebe-des-lebens',
      suspectId: 'ivy',

      title: 'Phineas ist Ivys Liebe des Lebens',
      description: 'Ivy bezeichnet Phineas Musé als ihre Liebe des Lebens.'
    }, 'meine Liebe des Lebens. Phineas!'), `
    
    Und hier haben wir das Ritual der ewigen Liebe.`])],

    [null, 'Zeigt das Ritual der ewigen Liebe in die Kamera'],

    ['ivy', textContent([entry({
      id: 'ivy-dolch',
      suspectId: 'ivy',

      title: 'Ivys Dolch',
      description: 'Ivy hat einen Dolch, den sie aus der Sammlung ihres Vaters stibitzt hat. Sie verwendet ihn für das Ritual der ewigen Liebe.'
    }, 'Und hier habe ich einen Dolch.'), ' Den habe ich aus der Sammlung meines Vaters stibitzt.'])],

    [null, 'Zeigt den Dolch in die Kamera'],

    ['ivy', textContent([`Ok. Mal sehen.

Geliebt zu sein, das fällt oft schwer,
Doch suchst du Rat, dann folg dem Orakel
Sprich dreimal leise: „Liebe, komm her“,
während das Blut fließt, wird's zum Spektakel

Seid verbunden bis ans Ende,
Und darüber hinaus als eins.
Stirbt einer, folgt der andere,
In der Geisterwelt vereint.

Das ist das was ich brauche für Phineas. Er wird für immer meins sein.

Es wird Zeit. Das Orakel ruft mich, ich höre es. Ich darf es nicht warten lassen. Uh- Hier steht, dass ich die coolste bin. Liket und Subscribet `, entry({
  id: 'ivy-okkult-kanal',
  suspectId: 'ivy',

  title: 'Video für den Kanal des Okkult-Clubs',
  description: 'Ivy zeichnet das Ritual der ewigen Liebe auf, um ihn auf den Kanal des Okkult-Clubs hochzuladen.'
}, 'den Kanal des Okkult-Clubs!')])],

    [null, 'Hält sich den Dolch an die Brust'],
    
    ['ivy', 'Phineas endlich wirst du meins sein. Das Orakel wird uns segnen'],
    
    [null, 'Hält sich den Dolch an die Kehle'],

    ['ivy', 'Um so mehr Blut, um so besser!'],

    [null, 'Die Kamera fällt um.\nBlut spritzt auf die Kamera. Man hört einen schrillen Schrei'],

    ['ivy', entry({
      id: 'ivy-ritual-fertig',
      suspectId: 'ivy',

      title: 'Ritual nicht zu Ende praktiziert',
      description: 'Ivy ist zu Boden gefallen, bevor sie den letzten Satz vollendet hat.\n\nHat das Ritual noch funktioniert?'
    }, 'Liebe komm her! Lieber komm her! Liebe- komm-')],
    
    [null, 'Man hört etwas auf den Boden schlagen.\nDaraufhin hört man das tropfen einer Flüssigkeit.']
  ],
  speakers: [
    {
      id: 'ivy',
      avatarAssetId: 'thumbnails/suizid.webp',
      name: getSuspectById('ivy')?.name ?? '',
      color: getSuspectById('ivy')?.color
    }
  ]
}