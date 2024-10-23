import { Transcript } from "../../transcript";
import { getSuspectById } from "../suspects";

export const hugo2: Transcript =  {
  id: 'hugo2',
  for: 'Hugo 2.mp4',
  thumbnailAssetId: 'suspects/Hugo2.webp',
  title: 'Interview 2: Hugo Montague',
  content: [
    ['ermittlerin', 'Guten Tag, Herr Montague. Vielen Dank, dass Sie sich für ein weiteres Gespräch mit uns zur Verfügung gestellt haben.'],
    ['hugo', 'Ich tue, was nötig ist.'],
    ['ermittlerin', 'Gut. Im letzten Gespräch haben Sie betont, dass Ivys Tod ein Mord war. Nun haben wir die Ergebnisse der Autopsie und anderer Ermittlungen vorliegen. Es war ein Suizid. Was sagen Sie dazu?'],
    ['hugo', 'Ja, es war Selbstmord durch ihre eigene Hand. Aber sie hat es nicht freiwillig getan. Jemand muss sie dazu getrieben haben und das macht es zu einem Mord.'],
    ['ermittlerin', 'Sie wussten also, dass es ein Suizid war, haben uns dennoch einen Mord suggeriert?'],
    ['hugo', 'Es ist ein Mord. Nur weil sie die Tat selbst begangen hat, heißt doch nicht, dass niemand dahinter steckt. Jemand muss dafür verantwortlich sein. Und irgendjemand hat sie in die Enge getrieben, sie zerstört. Sie wäre niemals freiwillig diesen Schritt gegangen.'],
    ['ermittlerin', 'Verstanden. Im letzten Interview erwähnten Sie, dass Sie „Holzholen“ waren. Können Sie uns diesen Ablauf noch mal genauer schildern?'],
    ['hugo', 'Das hatte ich Ihnen doch alles schon gesagt. Ich habe Holzgeholt, bin nach Hause gefahren und anschließend zur Orchesterprobe.'],
    ['ermittlerin', 'Ivys Tod wird auf circa 14 Uhr geschätzt. Sie haben den Krankenwagen allerdings um 19 Uhr verständigt. Warum die Verzögerung?'],
    ['hugo', 'Wie ich Ihnen doch bereits erklärt hatte, war ich in der Orchesterprobe und habe anschließend im Krankenhaus einen Schüler besucht. Erst danach bin ich nach Hause gefahren und habe meine Tochter tot auf dem Boden gefunden.'],
    ['ermittlerin', 'Verstehe. Der Schüler, den Sie besucht haben: Das war Phineas Musé, korrekt? Er wurde an dem Tag ins Krankenhaus eingeliefert und verstarb kurze Zeit später. Was können Sie mir über ihn sagen?'],
    ['hugo', 'Phineas war ein ruhiger Junge. Er war Einzelgänger und in meinem Geographieorientierungskurs. Unauffällig. Es ist tragisch, dass er so früh gestorben ist.'],
    ['ermittlerin', 'Uns wurde berichtet, dass Ivy eine besondere Beziehung oder, besser, Zuneigung zu Phineas hatte. Wussten Sie davon?'],
    ['hugo', 'Ivy und Phineas? Das höre ich zum Ersten Mal. Ich kann mir nicht vorstellen, dass die beiden eine großartige Bindung zusammen hatten und Phineas ist sehr schüchtern und- Ich kann mir nicht vorstellen, dass er etwas mit dem Tod zu tun hat.'],
    ['ermittlerin', 'Interessant. Uns wurde außerdem mitgeteilt, dass sie im Krankenhaus mit einem Cellokoffer gesehen wurden. Sie kamen also direkt von der Orchesterprobe.'],
    ['hugo', 'Ja, das hatte ich Ihnen doch gesagt. Ich war in der Orchesterprobe, hatte mein Instrument dabei und bin dann in das Krankenhaus gefahren und habe Phineas besucht, und- Da war er schon in einem sehr schlechten Zustand. Deswegen bin ich eigentlich direkt wieder gefahren, aber- Ja, jetzt fällt es mir ein, als ich- als ich gegangen bin, kam eine Schülerin Phoebe Blight. Sie wirkte nervös und irgendwie auffällig, ich- Irgendwie kam mir das komisch vor. Entweder war sie aufgewühlt oder sie- Ich- Ich weiß es nicht. Finden Sie es raus. Ich- Auf jeden Fall kam es mir verdächtig vor.'],
    ['ermittlerin', 'Phoebe Blight. Sie hat also nach Ihnen Phineas besucht?'],
    ['hugo', 'Genau. Ich kenne Pheobe nur flüchtig, aber es kam mir seltsam vor, dass sie so- so aufgewühlt war, es- es schien, als wäre sie in irgendetwas verwickelt.'],
    ['ermittlerin', 'Das ist eine wichtige Information. Danke. Gibt es sonst noch etwas Ungewöhnliches oder Auffälliges an dem Abend, was Ihnen zu Phineas oder Phoebe einfällt?'],
    ['hugo', 'Nein, abgesehen davon nichts. Phoebe war die Einzige, die mir aufgefallen ist. Ich habe Phineas jetzt besucht und er tat mir sehr leid, wie er dort lag und- Aber Phoebe war so aufgekratzt, als wäre irgendwas passiert.'],
    ['ermittlerin', 'Vielen Dank, Herr Montague. Wir werden ihre Aussagen bearbeiten und uns bei Bedarf wieder melden.'],
  ],
  speakers: [
    {
      id: 'hugo',
      avatarAssetId: 'suspects/Hugo2.webp',
      alignment: 'right',
      name: getSuspectById('hugo')?.name ?? '',
      color: getSuspectById('hugo')?.color
    },
    {
      id: 'ermittlerin',
      name: 'Ermittlerin',
      color: '#e8dcbc'
    }
  ]
}