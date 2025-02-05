import { entry, textContent } from "../../textContent";
import { Transcript } from "../../transcript";
import { getSuspectById } from "../suspects";

export const phoebe2: Transcript =  {
  id: 'phoebe2',
  for: 'Phoebe 2.mp4',
  thumbnailAssetId: 'suspects/Phoebe2.webp',
  title: 'Interview 2: Phoebe Blight',
  content: [
    ['ermittlerin', 'Guten Tag, Phoebe. Danke, dass Sie sich noch mal die Zeit genommen haben, um an einem Vollgespräch mit mir teilzunehmen.'],
    ['phoebe', 'Natürlich. Das ist meine Aufgabe als aufrichtige Bürgerin.'],
    ['ermittlerin', 'Gut. In unserem ersten Gespräch haben Sie angedeutet, dass Ivy Sie auf Ihre Vergangenheit angesprochen hat, unseren Ermittlungen zu Folge standen Ivy Delora und Phineas in einer sonderbaren Beziehung. Könnte das der Grund gewesen sein, warum Ivy sie ins Visier genommen hat?'],
    ['phoebe', textContent(['Na ja, Phineas und ich? Also, ', entry({
      id: 'phoebe-phineas-wenig-miteinander-zu-tun',
      suspectId: 'phoebe',

      title: 'Haben wenig miteinander zu tun gehabt',
      description: 'Phoebe und Phineas haben in der Schule wenig miteinander zu tun gehabt.'
    }, 'wir hatten wenig in der Schule miteinander zu tun gehabt.'), ' Also, ich wüsste nicht, wieso Ivy deswegen eifersüchtig gewesen wäre oder so?'])],
    ['ermittlerin', 'Sie haben bewusst nur ihre schulische Beziehung mit Phineas geschildert. Wie sah das außerhalb der Schule aus? War die anders?'],
    ['phoebe', 'Na ja, Phineas und ich kannten uns schon lange. Wir sind zusammen aufgewachsen. Also, man könnte uns als, ja, Kindheitsfreunde oder so bezeichnen. Vielleicht hat Ivy davon erfahren und sich dann, ja, bedroht gefühlt. Aber das ist irrational. Zwischen uns lief nie etwas. Also nicht so, wie Ivy vielleicht dachte.'],
    ['ermittlerin', 'Verstehe. Aber wie eng war denn Ihre Beziehung als Kindheitsfreunde? Es müsste ja eine gewisse Bedeutung haben, wenn Ivy so stark darauf reagiert hat.'],
    ['phoebe', textContent(['Nein, das war es nicht. Phineas war schon immer- Okay, ich gebe zu, ', entry({
      id: 'phoebe-enge-freunde',
      suspectId: 'phoebe',

      title: 'Enge Freunde mit Phineas',
      description: 'Phoebe und Phineas seien enge Freunde gewesen.\n\nWarum verheimlicht sie das?'
    }, 'wir waren sehr enge Freunde'), '. Wir haben uns immer, ja, nach der Schule getroffen, aber wir haben uns- wir haben nie miteinander geredet oder miteinander gesprochen, aber das hat uns nie wirklich gestört.'])],
    ['ermittlerin', 'Sie bestätigen also, dass Sie eng mit Phineas befreundet waren? In dem Sinne. Können Sie uns irgendwas zu ihm sagen, was nur jemand wissen könnte, der ihm nahestand?'],
    ['phoebe', 'Also ja, Phineas war schon immer sehr zurückhaltend, aber er wollte auch nie alleine sein. Aber er hat auch nie viel gesprochen, als ich bei ihm war. Wir saßen da meistens nur und haben halt nicht geredet. Aber er hat mir immer alles anvertraut. Fast alles. Aber ich- ich konnte mich immer auf ihn verlassen. Nur-'],
    ['ermittlerin', 'Nur was? Bitte fühlen Sie Ihren Gedanken zu Ende, Phoebe.'],
    ['phoebe', textContent([entry({
      id: 'phoebe-phineas-streit',
      suspectId: 'phoebe',

      title: 'Hatten einen Streit mit Phineas',
      description: 'Phoebe und Phineas hatten einen Streit.\n\nWas ist passiert?'
    }, 'Phineas und ich hatten einen Streit.'), ' Es war einfach kurz vor dem- vor diesem Ganzen. Er hat sich auf einmal verändert. Und er hat mir angefangen, nichts mehr zu erzählen. Und wir haben uns immer weniger gesehen. Und es fühlte sich an, als ob er- als ob er was verheimlichen würde. Und dann kam Ivy ins Spiel.'])],
    ['ermittlerin', 'Was meinen Sie damit, wenn Sie sagen, dass Phineas etwas versteckt hat? Warum hatten Sie das Gefühl, Phoebe?'],
    ['phoebe', textContent(['Na ja, es war einfach alles anders. Er wurde plötzlich kälter. Normalerweise hat er mir immer Bescheid gegeben, wenn er zurückziehen musste. Aber- Aber dieses Mal war er einfach distanzierter und- und dann- ', entry({
      id: 'phoebe-ivy-praesenter',
      suspectId: 'phoebe',

      title: 'Ivy wurde immer präsenter',
      description: 'Ivy sei immer präsenter in Phineas Leben geworden.\n\nIst Phoebe eifersüchtig?'
    }, 'dann begann Ivy immer präsenter zu werden'), '. Sie kam uns immer näher und es fühlte sich an, als würden sie hinter- über mich reden. Hinter meinem Rücken. Ich- Ich hatte das Gefühl er hat ihr alles erzählt. Ich konnte das einfach nicht mehr ertragen.'])],
    ['ermittlerin', 'Welche Dinge hätte Phineas ihr denn erzählen können? Etwas über ihre Vergangenheit?'],
    ['phoebe', textContent(['Ja, also- Ja. Phineas wusste alles über mich. Dinge, die niemand eigentlich wissen sollte. Und plötzlich- plötzlich entfernte er sich von mir. Und dann- dann noch diese Ivy. ', entry('phoebe-ivy-praesenter', 'Ivy kam immer näher und näher.'), ' Und ich hatte das Gefühl, sie wüsste einfach alles. Und ich hatte so- so- solche Angst, dass sie einfach alles weiß. Und-'])],
    ['ermittlerin', 'Sie glauben also, dass Phineas Ivy private Informationen über sie weitergegeben hat?'],
    ['phoebe', 'Ich wollte das nicht glauben. Ich- Ich wollte ihm doch vertrauen. Er ist mein bester Freund. Aber wie- wie sollte ich ihm noch vertrauen, wenn er sich so entfernt von mir. Und es hat mich einfach verrückt gemacht. Ich habe Ivy- Ich habe Ivy geschrieben, dass sie mich in Ruhe lassen soll. Ihr gesagt, dass da nicht zwischen uns ist. Aber sie hat mir nicht mal geantwortet.'],
    ['ermittlerin', 'Sie haben Ivy also kontaktiert, aber was ist mit Phineas? Haben Sie versucht, mit ihm zu sprechen?'],
    ['phoebe', 'Natürlich habe ich das. Aber- Aber bevor ich dazu kam, habe ich- habe ich gehört, dass er schon- dass er im Krankenhaus war. Ich- Ich- Ich war fassungslos. Ich bin direkt nachdem Kinder und Jugend- Kinder und Jugendparlament zu ihm gefahren.'],
    ['ermittlerin', 'Um wieviel Uhr war das ungefähr?'],
    ['phoebe', textContent(['Ja, so circa 16:15 Uhr und ', entry({
      id: 'phoebe-vor-17-uhr',
      suspectId: 'phoebe',

      title: 'Sei kurz vor 17 Uhr bei Phineas gewesen',
      description: 'Phoebe besuche Phineas kurz vor 17 Uhr.\n\nWas hat sie ihm gesagt?'
    }, 'so kurz vor 17 Uhr war ich bei ihm.')])],
    ['ermittlerin', 'Verstehe. Wie haben Sie sich gefühlt, als Sie erfahren haben, dass Phineas im Krankenhaus liegt?'],
    ['phoebe', textContent(['Es- Es hat mich- Es hat mich einfach zerstört. ', entry({
      id: 'phoebe-streit-morgen',
      suspectId: 'phoebe',

      title: 'Am Morgen mit Phineas gestritten',
      description: 'Phoebe habe sich am Morgen noch mit Phineas gestritten.\n\nWas ist passiert?'
    }, 'Wir hatten uns noch an diesem Morgen noch gestritten'),' und ich konnte einfach nicht aufhören, darüber nachzudenken an unserem letzten Gespräch. Es- Das war so furchtbar und-  und dann- Ich hatte solche Angst, dass ich schuld daran war, ', entry({
      id: 'phoebe-schuld',
      suspectId: 'phoebe',

      title: 'Schuldgefühle',
      description: 'Phoebe habe Schuldgefühle, dass Phineas im Krankenhaus liegt.\n\nHat sie ihn verletzt?'
    }, 'dass es meine Schuld einfach war. Dass ich irgendwas Falsches gemacht habe, dass das alles meine Schuld ist.')])],
    ['ermittlerin', 'Sie fühlen sich also schuldig? Warum glauben Sie, das, Phoebe?'],
    ['phoebe', 'Ich weiß es nicht. Ich- Es sind- Es sind so viele Sachen falsch gelaufen. Ich habe so viele Dinge falsch gemacht. Und- Ich hätte Ihnen einfach vertrauen sollen. Ich hätte nie an ihn zweifeln sollen, aber- aber jetzt ist es einfach zu spät. Und- Ich hätte- Es ist zu spät. Und ich hätte es besser machen sollen.'],
    ['ermittlerin', entry({
      id: 'phoebe-einseitigen-gespraech',
      suspectId: 'phoebe',

      title: 'einseitigen Gespräch',
      description: 'Phoebe war in einem einseitigen Gespräch mit Phineas verwickelt.'
    }, 'Sie waren also lange in einem einseitigen Gespräch mit ihm verwickelt?')],
    ['phoebe', 'Ja, ich- ich habe ihm alles gesagt. I- Ich hab ihm alles gesagt, was ich konnte, aber es war- es war einfach zu wenig. Und ich hätte ihm mehr sagen sollen. Sorry. Ich- Ich hatte einfach mehr tun sollen.'],
    ['ermittlerin', 'Alles gut. Mein Beileid wegen Ihrem Verlust, Phoebe.'],
    [null, 'Die Ermittlerin gibt Phoebe ein Taschentuch.'],
    ['phoebe', 'Dankeschön.'],
    ['ermittlerin', 'Ich danke Ihnen vielmals für Ihre Zeit und für Ihre Ehrlichkeit.'],
    ['phoebe', 'Ich danke Ihnen.'],
  ],
  speakers: [
    {
      id: 'phoebe',
      avatarAssetId: 'suspects/Phoebe2.webp',
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