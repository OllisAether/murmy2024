import { shaky, wiggly } from "../../textContent";
import { Transcript } from "../../transcript";
import { getSuspectById } from "../suspects";

export const ritual: Transcript =  {
  id: 'ritual',
  for: 'Recap.mp4',
  thumbnailAssetId: 'thumbnails/Ritual.webp',
  title: 'Ritual des Orakels',
  content: [
    ['ivy', 'Filmt!'],
    [null, 'Ivy stellt die Kamera auf.\nCassandra und Ivy sitzen vor einem Tisch mit Kerzen, kleinen Totenköpfen und einer leuchtenden Kristallkugel.'],
    ['cassandra', 'Hi, liebe Verehrer des Orakels.'],
    [{ speaker: 'ivy', withLastSpeaker: true }, 'Hi, liebe Verehrer des Orakels.'],
    ['cassandra', 'Heute praktizieren wir das Ritual des Orakels.'],
    ['ivy', 'Es wird richtig spannend, denn wir werden durch den Aether eine Verbindung zum Orakel aufbauen.'],
    [null, 'Beide ziehen ihre Kapuzen auf'],
    ['cassandra', `Hm, was steht denn hier?
Im Dämmerglanz, beim Mondenschein,
Erhebt sich das Orakel, rein.
Mit einem Ruf, der Sternen klärt,
Wirst du die Weisheit der Götter ehren.`],
    [null, 'Ivy wechselt eine kaputte Kerze aus'],
    ['cassandra', `Durch die Beschwörung, klar und hehr,
Komm das Orakel zu dir her.
Mit tiefem Wissen, unermüdlich,
Führt es dich auf Pfade mystisch.`],
    [null, 'Beide halten ihre Hände und schließen die Augen'],
    ['cassandra', wiggly('Hmmmmmmmmmmm-')],
    [{ speaker: 'ivy', withLastSpeaker: true }, wiggly('Hmmmmmmmmmmm-')],
    ['ivy', 'Ich höre was!'],
    ['cassandra', shaky('LEISE IVY! ICH BIN KURZ DAVOR!')],
    ['cassandra', wiggly('Hmmmmmmmmmmm-')],
    [{ speaker: 'ivy', withLastSpeaker: true }, wiggly('Hmmmmmmmmmmm-')],
    ['cassandra', 'Ich habe was gehört!'],
    ['ivy', 'Ich auch. Aber es war leise.'],
    ['cassandra', 'Egal, es hat doch funktioniert. Beim nächsten Mal kommen wir noch näher ran. Nadann danke fürs Zuschauen!'],
    ['cassandra', 'Tschau!'],
    [{ speaker: 'ivy', withLastSpeaker: true }, 'Bis zum nächsten Mal'],
    [null, 'Ivy steht auf und beendet die Aufnahme']
  ],
  speakers: [
    {
      id: 'ivy',
      avatarAssetId: 'suspects/Ivy.webp',
      alignment: 'right',
      name: getSuspectById('ivy')?.name ?? '',
      color: getSuspectById('ivy')?.color
    },
    {
      id: 'cassandra',
      avatarAssetId: 'suspects/Cassy1.webp',
      name: getSuspectById('cassandra')?.name ?? '',
      color: getSuspectById('cassandra')?.color
    }
  ]
}