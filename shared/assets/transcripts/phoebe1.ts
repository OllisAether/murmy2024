import { entry, textContent } from "../../textContent";
import { Transcript } from "../../transcript";
import { getSuspectById } from "../suspects";

export const phoebe1: Transcript =  {
  id: 'phoebe1',
  for: 'Phoebe 1.mp4',
  thumbnailAssetId: 'suspects/Phoebe1.webp',
  title: 'Interview: Phoebe Blight',
  content: [
    ['ermittlerin', 'Guten Tag, Phoebe Blight. Vielen Dank, dass Sie sich die Zeit genommen haben, ein Gespräch mit mir zu führen.'],
    ['phoebe', 'Ja, guten Tag. Also, kein Problem. Ich helfe, wo ich kann. Also, worum geht es denn überhaupt?'],
    ['ermittlerin', 'Gut, dann lassen Sie uns direkt zur Sache kommen. Können Sie mir sagen, was Sie am Donnerstag, den 14. Februar, ungefähr um 14 Uhr gemacht haben?'],
    ['phoebe', textContent(['Also gestern oder? Poah, ', entry({
      id: 'phoebe-tagesablauf',
      suspectId: 'phoebe',
      title: 'Habe Donnerstags bis 17 Uhr Schule',
      description: 'Phoebe habe Donnerstags bis 17 Uhr Schule und verbringe ihre Mittagspause in der Cafeteria. Danach sei sie immer in der Mediathek.'
    },'Donnerstags habe ich immer bis 17 Uhr Schule'), ' und um 14 Uhr- Ah ja, da müsste meine Mittagspause gerade vorbei gewesen sein.'])],
    ['ermittlerin', 'Und wo waren Sie zu diesem Zeitpunkt?'],
    ['phoebe', 'Na ja, also ich verlasse halt das Schulgebäude nie in der Mittagspause und nehme mir mein Essen mit in die Cafeteria. Und sonst- Danach bin ich halt immer in der Mediathek. Genau. Und das war auch Donnerstag so. Ja.'],
    ['ermittlerin', 'Gut, verstehe. Können Sie mir Ihre Beziehung zu Ivy Delora schildern?'],
    ['phoebe', entry({
      id: 'phoebe-kenne-ivy-nicht',
      suspectId: 'phoebe',
      title: 'Kenne Ivy nicht',
      description: 'Phoebe betont, dass sie Ivy nicht kannte und nichts mit ihr zu tun hatte.'
    },'Ivy? Also Ivy? Nein. Also, ich kannte sie nicht wirklich. Also, ich habe nichts mit ihr zu tun gehabt, ne.')],
    ['ermittlerin', 'Sie hatten also keinerlei Verbindung zu ihr? Ihnen ist bewusst, dass wir den Mord Ihrer Mitschülerin ermitteln. Jede Informationen können uns da weiterhelfen, Phoebe.'],
    ['phoebe', textContent(['Also, wie schon gesagt, ', entry('phoebe-kenne-ivy-nicht', 'ich kannte sie nicht.'), ' Natürlich ist ihr Tod tragisch. Und vorallem Herr Montague tut mir so unfassbar leid. Wissen Sie, er hat halt ', entry('hugo-elenas-tod', 'seine Frau vor kurzem verloren'), ' und jetzt auch noch seine Tochter. Poah, ich kann mir gar nicht vorstellen, wie schrecklich das einfach sein muss. Es tut mir leid einfach, aber-'])],
    ['ermittlerin', 'Sie scheinen Herrn Montague gut zu kennen. Woher wissen Sie denn so viel über ihn?'],
    ['phoebe', textContent(['Na ja, ich kenn mich gut mit den Lehrern. Ich komme gut klar mit denen. Die Sache ist, ', entry('phoebe-top-a-student', 'ich bin halt sehr engagiert in der Schule. Ja, ich bin halt Klassensprecherin und in vielen AGs halt dabei.'), ' Und da kriegt man das Ein oder Andere mit. Aber bezüglich Ivy, da weiß ich nicht wirklich viel. Außer, dass sie- Ja, genau. Außer, dass sie halt ', entry('ivy-okkult-club', 'im Okkult-Club'), ' war.', entry({
      id: 'phoebe-okkult-club',
      suspectId: 'phoebe',
      title: 'Halte sich vom Okkult-Club fern',
      description: 'Phoebe halte sich vom Okkult-Club fern, da sie diesen nicht geheuer finde.\n\nHat sie etwas gegen den Okkult-Club?'
    }, ' Aber von denen halte ich mich fern.')])],
    ['ermittlerin', 'Sie sind also sehr aktiv in Ihrem Schulalltag, halten sich aber vom Okkult-Club fern?'],
    ['phoebe', textContent(['Ja, genau. ', entry('phoebe-okkult-club', 'Also dieser Club ist mir einfach nicht so ganz geheuer.'), ' Und um ehrlich zu sein, das gehört nicht an eine Schule. Und ja, da sind- passieren so komische Sachen.'])],
    ['ermittlerin', 'Was meinen Sie damit? Können Sie das genauer beschreiben?'],
    ['phoebe', textContent(['Ja also. Sie kennen wahrscheinlich so was bei so einem Okkult so passiert, also Rituale und so. Und dann gibt es noch- ja dieses Orakel Zeug. Das ist richtig komisch. Einfach unheimlich. Also normalerweise sage ich immer, die Leute sollen machen, was sie möchten, aber Ivy- Ivy hat mich einfach nicht in Ruhe gelassen. Das lasse ich mir nicht gefallen. ',
      entry({
        id: 'phoebe-selbstverteidigung',
        suspectId: 'phoebe',
        title: 'Verteidigte sich gegen Ivy',
        description: 'Ivy habe Phoebe belästigt und sie habe sich verteidigen müssen.'
      }, 'Ich musste mich da verteidigen.'), ' Verstehen Sie?'])],
    ['ermittlerin', 'Nicht in Ruhe gelassen? Wieso mussten Sie sich verteidigen? Hat Ivy Sie bedroht?'],
    ['phoebe', textContent(['Nein nein. Also nicht direkt körperlich oder so. Also, sie kam halt vor ein paar Wochen auf mich zu und sie meinte,  ', entry({
      id: 'phoebe-geheimnis',
      suspectId: 'phoebe',
      title: 'Ivy behaupte, Phoebe habe ein Geheimnis',
      description: 'Ivy sprach Phoebe auf ein Geheimnis an, das sie angeblich habe. Jedoch wusste Phoebe nicht, wovon Ivy sprach.\n\nHat Phoebe vielleicht doch ein Geheimnis?'
    }, 'sie wüsste von meinem Geheimnis.'), ' Also nicht, dass ich eins hätte oder so, nein. Aber das war so seltsam und sie hat mich einfach genervt damit. ', entry({
      id: 'phoebe-textnachrichten',
      suspectId: 'phoebe',
      title: 'Ivy habe Phoebe genervt',
      description: 'Ivy habe Phoebe mit Textnachrichten genervt. Phoebe wusste nicht, wie Ivy an ihre Nummer gekommen sei.'
    }, 'Sie hat angefangen, mir Textnachrichten zu schreiben'), '. Richtig viele. Und ich weiß bis heute nicht mal, von wo sie meine Nummer her hat. Mein erster Gedanke war, irgendjemand hat es ihr gegeben, aber wer tut so was?'])],
    ['ermittlerin', 'Ivy hat Ihnen also Textnachrichten geschrieben? Ging es bei denen auch um Ihr vermeintliches Geheimnis?'],
    ['phoebe', 'Ja, also. Sie war wie besessen davon, dass ich ihr irgendwas verheimlichen würde. Das Ganze hat mich so fertig gemacht. Aber ich hätte niemals gewollt, dass irgendwas mit ihr passiert. Also verstehen Sie mich nicht falsch. Ivy hat mir Angst gemacht. Aber ich würde niemals jemandem wehtun. Und schon gar nicht erst Ivy.'],
    ['ermittlerin', 'Verstehe. Danke für Ihre Offenheit, Phoebe. Eine letzte Frage hätte ich noch. Es sind am Donnerstag etwas ungewöhnlich oder Seltsames aufgefallen.'],
    ['phoebe', 'Also leider nein. Sie müssen verstehen. Mein Tagesablauf ist so vollgepackt, da bekomme ich selten was mit, was nicht in meinem direkten Umfeld ist. Es tut mir so leid, dass ich nicht weiterhelfen kann.'],
    ['ermittlerin', 'Das ist in Ordnung. Vielen Dank für Ihre Kooperation und für Ihre Offenheit, Phoebe.'],
    ['phoebe', 'Ich hoffe einfach, dass ich irgendwie helfen konnte. Aber ich hoffe auch, dass dieser Fall so bald wie möglich gelöst wird.'],
    ['ermittlerin', 'Definitiv. Wir werden unser Bestes geben. Bei weiteren Fragen werden wir uns bei Ihnen melden, dankeschön.'],
    ['phoebe', 'Kein Problem.']
  ],
  speakers: [
    {
      id: 'phoebe',
      avatarAssetId: 'suspects/Phoebe1.webp',
      alignment: 'right',
      name: getSuspectById('phoebe')?.name ?? '',
      color: getSuspectById('phoebe')?.color
    },
    {
      id: 'ermittlerin',
      name: 'Ermittlerin',
      color: '#e8dcbc'
    }
  ]
}