import { entry, textContent } from "../../textContent";
import { Transcript } from "../../transcript";
import { getSuspectById } from "../suspects";

export const justinssprachaufnahme: Transcript =  {
  id: 'justinssprachaufnahme',
  for: 'Justinssprachaufnahme.mp3',
  thumbnailAssetId: 'thumbnails/tape.webp',
  title: 'Kassettenrecorder von Justin van Bustin',
  content: [
    ['justin', textContent([`Das lässt mich nicht mehr in Ruhe, Mann. Ich muss es irgendwie loswerden.

Du hast's verdient. Dieser Blick. Du hast einfach auf mich- aufgehört auf mich runterzuschauen. Du denkst du bist was besseres als ich.

Irgendwann reicht's halt, checkst du? `, entry({
  id: 'justin-phineas-zusammengeschlagen',
  suspectId: 'justin',

  title: 'Jemanden zusammengeschlagen',
  description: 'Justin hat Phineas zusammengeschlagen.\n\nWarum hat er das getan?'
}, 'Also hab ich dich gepackt und eine geknallt.'), ` Ich hab nicht mal richtig nachgedacht, Mann.

Auf einmal fliegst du hin und `, entry('justin-phineas-zusammengeschlagen', 'lässt dich zusammenschlagen'), ` ohne dich zu wehren. Ich hab mehr erwartet einen Kampf, eine Reaktion, irgendwas. `, entry('justin-phineas-zusammengeschlagen', 'Ich hab dich gehauen, richtig heftig.'), ` Aber ich schwöre, ich wollte dir nichts tun, wallah!

Aber seine Fresse passte einfach zu gut in meine Faust! Dann war er auf einmal weg. `, entry('justin-phineas-umgebracht', 'Tot.'), `

Da lagst du dann, einfach so. Ich hab's gar nicht gecheckt, aber als ich gesehen hab, dass du dich nicht mehr bewegst, wusste ich, das war's.
In dem Moment kriegt ich Schiss und bin einfach abgehauen.

`, entry({
  id: 'justin-phineas-umgebracht',
  suspectId: 'justin',

  title: 'Habe Phineas umgebracht',
  description: 'Justin glaubt, dass er Phineas umgebracht hat.\n\nGibt er das einfach so zu?'
}, 'Ich hab\' dich umgebracht, Mann.'), ` Es war keine Absicht. Ich- Es tut mir leid. Ich wusste nicht, dass es so- Ich wollt nicht, dass du abkratzt! Es tut mir leid, bro. Ich- Ich hab' dich im Real Life PvP zerstört. `, entry('justin-phineas-zusammengeschlagen', 'Dich zusammengeschlagen'), `. Nein- niemand darf das erfahren.`])]
  ],
  speakers: [
    {
      id: 'justin',
      avatarAssetId: 'suspects/Justin2.webp',
      name: getSuspectById('justin')?.name ?? '',
      color: getSuspectById('justin')?.color
    }
  ]
}