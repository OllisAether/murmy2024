import { entry, textContent } from "../../textContent";
import { Transcript } from "../../transcript";
import { getSuspectById } from "../suspects";

export const justin1: Transcript =  {
  id: 'justin1',
  for: 'Justin 1.mp4',
  thumbnailAssetId: 'suspects/Justin1.webp',
  title: 'Interview: Justin van Bustin',
  content: [
    ['ermittlerin', textContent(['Guten Tag, Herr ', entry('justin-echtername', 'Kopelius van Bustin.'), ' Vielen Dank, dass Sie sich heute die Zeit genommen haben um hier-'])],
    ['justin', 'Ey, was wollt ihr eigentlich? Wollt ihr Stress oder was? Mein Name ist Justin van Bustin!'],
    ['ermittlerin', 'Entschuldigen Sie, Justin. Bitte beruhigen Sie sich. Ich bin nur hier, um Ihnen ein paar Fragen zu stellen. Es wäre so gut, wenn wir kooperieren könnten. Okay? Für’s Protokoll. Zunächst einmal, wo waren Sie am Donnerstag,  den 14. Februar, gegen 14 Uhr?'],
    ['justin', 'Na ja alter, woher soll ich das denn wissen, aller? Das war doch ewig her. Valentinstag oder so?'],
    ['ermittlerin', 'Ich bitte Sie, noch einmal gründlich darüber nachzudenken. Immerhin war es erst gestern. Nebensache. Waren Sie an jenem Tag zu Hause oder haben Sie jemanden getroffen?'],
    ['justin', textContent(['Ja, ich check schon. Ja, ich habe mich halt mit so ', entry({
      id: 'justin-chaya',
      suspectId: 'justin',
      title: 'Date mit Chaya',
      description: 'Justin habe sich mit einer Chaya getroffen und hatte ein Date mit ihr. Er behauptet, dass er nicht im Park war.'
    }, 'Chaya getroffen'), ', du weist. Hab Sie so geklärt. Und ich hatte so Date mit ihr im Park, oder- oder warte ne, nicht im Park. Äh, das- Scheiß mal darauf. Ich hatte einfach ein Date.'])],
    ['ermittlerin', 'Sie scheinen sich aber nicht sicher zu sein, Justin. Es wäre vorteilhaft für sie, wenn Sie uns die Wahrheit sagen. Immerhin können wir das ganz leicht überprüfen.'],
    ['justin', 'Was wollt ihr von mir? Ich sag doch, ich war nicht im Park. Ich war unterwegs mit meiner Freundin. So schwer zu checken?'],
    ['ermittlerin', 'Gut, gut. Es ist wichtig, dass Sie sich klar ausdrücken. Immerhin handelt es sich um eine ernste Angelegenheit. Es geht um einen kürzlichen Mord an Ihrer Schule.'],
    ['justin', entry({
      id: 'justin-mord',
      suspectId: 'justin',
      title: 'Weiß nichts von einem Mord',
      description: 'Justin wisse nichts von einem Mord und nicht, wovon die Ermittlerin rede.'
    }, 'Mord? Ey, digga ich- ich weiß gar nicht, wovon du redest, Mann.')],
    ['ermittlerin', 'Es ist also neu für Sie, dass die Schülerin Ivy Delora tot ist?'],
    ['justin', 'Ivy? Die Zicke? Aus dem Mathe-OK? Ey ja, aller. Die war voll abgehoben. Hat einen auf Wichtigtuer gemacht, wie alle anderen aus diesem scheiß Kurs.'],
    ['ermittlerin', 'Abgehoben? Erklären Sie das bitte noch mal genauer.'],
    ['justin', 'Ja, aller. Die dachte die könnte alles machen, was sie will nur die so die Tochter von diesem Montague ist. Ich habe sie nur nicht rumkommandiert wie alle anderen, weil sie so- weil ich kein Stress wollte mit diesem, Dings, Vater oder so.'],
    ['ermittlerin', 'Okay, verstehe.'],
    ['justin', 'Ja voll die Tussi.'],
    ['ermittlerin', textContent(['Aha, okay. Wie ich höre, bezeichnet man sie auf dem Max-Planck-Gymnasium auch als ', entry({
      id: 'justin-schulbully',
      suspectId: 'justin',
      title: 'Schulbully',
      description: 'Justin ist der Schulbully auf dem Max-Planck-Gymnasium und er verprügele Kinder.\n\nWas hat es damit auf sich?'
    }, '„Schulbully“'), '. Was hat es damit auf sich?'])],
    ['justin', 'Ja, Chabos müssen wissen, wer der Babo ist. Ja, dies das. Vielleicht paar verprügelt, paar Kinder verprügelt, aber die waren nur so Lackaffen, ey.'],
    ['ermittlerin', 'Und gab es in dieser Hinsicht bisher schon mal Auseinandersetzungen oder gar Streitigkeiten mit Ivy?'],
    ['justin', 'Ey, was wollen Sie eigentlich damit sagen? Wollen Sie sagen, dass ich im-  mit dem Mord zu tun habe? Ey, ihr Cops denkt, ihr könnt einfach kommen und mich beschuldigen, ey.'],
    ['ermittlerin', 'Niemand beschuldigt Sie, Justin. Es geht nur darum, diesen Fall zu klären.'],
    ['justin', 'Ich habe genug von den Fragen, aller!'],
    [null, 'Justin schlägt auf den Tisch und steht auf'],
    ['justin', 'Wenn ihr mich beschuldigen wollt, dann macht es richtig. Aber verschwendet nicht meine Zeit, ihr Billos.'],
    ['ermittlerin', 'Setzen Sie sich hin, Justin. Wir sind fast fertig.'],
    ['justin', 'Aller.'],
    ['ermittlerin', 'Es geht hier nur darum, alle Seiten zu hören. In dem Sinne. Haben Sie irgendwas gesehen oder gehört, was uns weiterhelfen könnte?'],
    ['justin', textContent(['Ey, ich sag doch, ich habe nichts gesehen. Nichts gehört. Ich war einfach nur ', entry({
      id: 'justin-park',
      suspectId: 'justin',
      title: 'Sei im Park gewesen',
      description: 'Justin sei im Park gewesen und habe nichts gesehen oder gehört.\n\nWarte, hat er nicht gesagt, dass er nicht im Park war?'
    }, 'im Park'), ' chillen, da war\'s.'])],
    ['ermittlerin', 'Das wäre dann alles für jetzt. Vielen Dank, Justin. Bei weiteren Fragen werden wir uns bei Ihnen melden.'],
    ['justin', 'Na klar. Geht einfach. Denn Justin geht jetzt was Bustin.'],
    ['ermittlerin', 'Okay, Justin.'],
  ],
  speakers: [
    {
      id: 'justin',
      avatarAssetId: 'suspects/Justin1.webp',
      alignment: 'right',
      name: getSuspectById('justin')?.name ?? '',
      color: getSuspectById('justin')?.color
    },
    {
      id: 'ermittlerin',
      name: 'Ermittlerin',
      color: '#e8dcbc'
    }
  ]
}