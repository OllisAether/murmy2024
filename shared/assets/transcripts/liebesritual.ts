import { Transcript } from "../../transcript";
import { getSuspectById } from "../suspects";

export const liebesritual: Transcript =  {
  id: 'liebesritual',
  for: 'Ivys Suizid.mp4',
  thumbnailAssetId: 'thumbnails/suizid.webp',
  title: 'Ivys Ritual der ewigen Liebe',
  content: [
    [null, 'Zeitstempel: 14.02.2013 13:26'],
    
    ['ivy', 'Hii Verehrer des Orakels. Ich habe heute etwas ganz ganz besonderes vor. Ihr werdet es gleich sehen, aber zunächst-'],

    [null, 'Zeigt mit dem Finger auf die Hütte und läuft darauf zu'],

    ['ivy', 'Schaut, meine Hütte. Sie ist der perfekte Ort für das was ich vor habe.'],

    [null, 'Geht in die Hütte\nStellt die Kamera auf eine unstabile Oberfläche'],

    ['ivy', `Steht die?

    Ok, kommen wir nun zu unserem ganz besonderen Ritual. Es geht um meine Liebe des Lebens. Phineas!
    
    Und hier haben wir das Ritual der ewigen Liebe.`],

    [null, 'Zeigt das Ritual der ewigen Liebe in die Kamera'],

    ['ivy', 'Und hier habe ich ein Dolch. Den habe ich aus der Sammlung meines Vaters stibitzt.'],

    [null, 'Zeigt den Dolch in die Kamera'],

    ['ivy', `Ok. Mal sehen.

Geliebt zu sein, das fällt oft schwer,
Doch suchst du Rat, dann folg dem Orakel
Sprich dreimal leise: „Liebe, komm her“,
während das Blut fließt, wird's zum Spektakel

Seid verbunden bis ans Ende,
Und darüber hinaus als eins.
Stirbt einer, folgt der andere,
In der Geisterwelt vereint.

Das ist das was ich brauche für Phineas. Er wird für immer meins sein.

Es wird Zeit. Das Orakel ruft mich, ich höre es. Ich darf es nicht warten lassen. Uh- Hier steht, dass ich die coolste bin. Liket und Subscribet den Kanal des Okkult-Clubs!`],

    [null, 'Hält sich den Dolch an die Brust'],
    
    ['ivy', 'Phineas endlich wirst du meins sein. Das Orakel wird uns segnen'],
    
    [null, 'Hält sich den Dolch an die Kehle'],

    ['ivy', 'Um so mehr Blut, um so besser!'],

    [null, 'Die Kamera fällt um.\nBlut spritzt auf die Kamera. Man hört einen schrillen Schrei'],

    ['ivy', 'Liebe komm her! Lieber komm her! Liebe- komm-'],
    
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