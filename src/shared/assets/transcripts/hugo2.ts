import { entry, textContent } from "../../textContent";
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
    ['hugo', textContent(['Ja, es war Selbstmord durch ihre eigene Hand. Aber sie hat es nicht freiwillig getan. ', entry({
      id: 'hugo-ivy-tot-getrieben',
      suspectId: 'hugo',
      
      title: 'Ivy wurde zum Suizid getrieben',
      description: 'Hugo glaubt, dass Ivy zum Suizid getrieben wurde und es deshalb ein Mord war.'
    }, 'Jemand muss sie dazu getrieben haben und das macht es zu einem Mord.')])],
    ['ermittlerin', 'Sie wussten also, dass es ein Suizid war, haben uns dennoch einen Mord suggeriert?'],
    ['hugo', 'Es ist ein Mord. Nur weil sie die Tat selbst begangen hat, heißt doch nicht, dass niemand dahinter steckt. Jemand muss dafür verantwortlich sein. Und irgendjemand hat sie in die Enge getrieben, sie zerstört. Sie wäre niemals freiwillig diesen Schritt gegangen.'],
    ['ermittlerin', 'Verstanden. Im letzten Interview erwähnten Sie, dass Sie „Holzholen“ waren. Können Sie uns diesen Ablauf noch mal genauer schildern?'],
    ['hugo', textContent(['Das hatte ich Ihnen doch alles schon gesagt. ', entry('hugo-holz', 'Ich habe Holz geholt'), ', bin nach Hause gefahren und ', entry('hugo-orchester', 'anschließend zur Orchesterprobe.')])],
    ['ermittlerin', textContent(['Ivys Tod wird auf circa 14 Uhr geschätzt. Sie haben den Krankenwagen allerdings ', entry({
      id: 'hugo-krankenwagen-gerufen',
      suspectId: 'hugo',

      title: 'Krankenwagen um 19 Uhr gerufen',
      description: 'Hugo habe den Krankenwagen erst um 19 Uhr gerufen, lange nachdem Ivy gestorben ist.'
    }, 'um 19 Uhr'), ' verständigt. Warum die Verzögerung?'])],
    ['hugo', textContent(['Wie ich Ihnen doch bereits erklärt hatte, war ich in der Orchesterprobe und habe anschließend im ', entry({
      id: 'hugo-phineas-besucht',
      suspectId: 'hugo',

      title: 'Besuchte Phineas Musé',
      description: 'Hugo habe Phineas Musé im Krankenhaus besucht.'
    }, 'Krankenhaus einen Schüler'), ' besucht. Erst danach bin ich nach Hause gefahren und habe meine Tochter tot auf dem Boden gefunden.'])],
    ['ermittlerin', 'Verstehe. Der Schüler, den Sie besucht haben: Das war Phineas Musé, korrekt? Er wurde an dem Tag ins Krankenhaus eingeliefert und verstarb kurze Zeit später. Was können Sie mir über ihn sagen?'],
    ['hugo', textContent([entry('phineas-einzelgaenger', 'Phineas war ein ruhiger Junge. Er war Einzelgänger'), ' und in meinem Geographieorientierungskurs. Unauffällig. Es ist tragisch, dass er so früh gestorben ist.'])],
    ['ermittlerin', 'Uns wurde berichtet, dass Ivy eine besondere Beziehung oder, besser, Zuneigung zu Phineas hatte. Wussten Sie davon?'],
    ['hugo', textContent([entry({
      id: 'hugo-ivy-phineas-nichts',
      suspectId: 'hugo',

      title: 'Ivy und Phineas hätten keine besondere Bindung',
      description: 'Hugo habe keine besondere Bindung zwischen Ivy und Phineas bemerkt.'
    }, 'Ivy und Phineas? Das höre ich zum Ersten Mal. Ich kann mir nicht vorstellen, dass die beiden eine großartige Bindung zusammen hatten'), ' und Phineas ist sehr schüchtern und- Ich kann mir nicht vorstellen, dass er etwas mit dem Tod zu tun hat.'])],
    ['ermittlerin', textContent(['Interessant. Uns wurde außerdem mitgeteilt, dass ', entry({
      id: 'hugo-cellokoffer',
      suspectId: 'hugo',

      title: 'Wurde mit einem Cellokoffer gesehen',
      description: 'Hr. Montague wurde mit einem Cellokoffer im Krankenhaus gesehen.'
    }, 'sie im Krankenhaus mit einem Cellokoffer gesehen wurden.'), ' Sie kamen also direkt von der Orchesterprobe.'])],
    ['hugo', textContent(['Ja, das hatte ich Ihnen doch gesagt. Ich war in der Orchesterprobe, hatte mein Instrument dabei und bin dann in das Krankenhaus gefahren und habe Phineas besucht, und- Da war er schon in einem sehr schlechten Zustand. Deswegen bin ich eigentlich direkt wieder gefahren, aber- Ja, jetzt fällt es mir ein, als ich- als ich gegangen bin, kam ', entry({
      id: 'hugo-phoebe-krankenhaus',
      suspectId: 'phoebe',

      title: 'Aufgewühlt im Krankenhaus',
      description: 'Hr. Montague sah Phoebe Blight im Krankenhaus und bemerkte, dass sie aufgewühlt gewesen sei.'
    }, 'eine Schülerin Phoebe Blight. Sie wirkte nervös und irgendwie auffällig, ich- Irgendwie kam mir das komisch vor. Entweder war sie aufgewühlt oder sie- '),'Ich- Ich weiß es nicht. Finden Sie es raus. Ich- Auf jeden Fall kam es mir verdächtig vor.'])],
    ['ermittlerin', 'Phoebe Blight. Sie hat also nach Ihnen Phineas besucht?'],
    ['hugo', 'Genau. Ich kenne Phoebe nur flüchtig, aber es kam mir seltsam vor, dass sie so- so aufgewühlt war, es- es schien, als wäre sie in irgendetwas verwickelt.'],
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