import moment from "moment";
import { Note } from "../../phone/notes";
import { entry, textContent } from "../../textContent";

export const notes: Note[] = [
  // TODO: Add notes here
  {
    title: 'Dvd liste',
    date: moment('2013-02-08'),
    content: `- Shrek (1 - 4)
- hotel tranylvania
- hunger games
- spider man
- pitch perfect
- brave
- the incredibles
- lorax`
  },
  {
    title: 'Überlebenstipps für Schule mit Justin',
    date: moment('2013-02-05'),
    content: `Justin ignorieren = beste Taktik, keine Zeit für seine Sachen.
Sprüche vorbereiten für den nächsten dummen Kommentar.
Kopfhörer dabei haben, um einfach mal abzutauchen.`
  },
  {
    title: 'geld',
    date: moment('2013-02-01'),
    content: `- jc 15€
- mila 10€
- mila 5€
- rufus 35
10
15`
  },
  {
    title: 'todo',
    date: moment('2013-01-08'),
    content: textContent([`- fahrrad abholen
- rufus geld\n`,
entry('diary-kriminelle-tips', '- montague fragen wegen kriminelle tipps'),
'\n- haare schneiden?'])
  },
  {
    title: 'Geheime Projekte',
    date: moment('2012-12-03'),
    content: `Dunkles Gedicht - muss noch besser werden
Bilder für meinen Raum (Dämmerlicht-Fotos und so)
Kopfhörer-Mod - muss alte Beats fixen`
  },
  {
    title: 'Song Lyrics (Eigenes Projekt?)',
    date: moment('2012-11-30'),
    content: `Stuck in my mind, can't find a way out
Shadow's creeping, filling with doubt
Lights flicker, everything's fading
Wish I knew what I'm evading.`
  }
];