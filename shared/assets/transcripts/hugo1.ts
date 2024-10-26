import { entry, italic, textContent } from "../../textContent";
import { Transcript } from "../../transcript";
import { getSuspectById } from "../suspects";

export const hugo1: Transcript =  {
  id: 'hugo1',
  for: 'Hugo 1.mp4',
  thumbnailAssetId: 'suspects/Hugo1.webp',
  title: 'Interview: Hugo Montague',
  content: [
    ['ermittlerin', 'Guten Tag, Herr Hugo Montague. Ich danke Ihnen vielmals, dass Sie sich die Zeit nehmen, um dieses Gespräch heute mit uns zu führen. Mein aufrichtiges Beileid für den Tod Ihrer Tochter, Ivy Delora.'],
    ['hugo', textContent(['Danke. Ich möchte nur, dass derjenige, der meiner Tochter das Leben genommen hat, schnellstens gefunden wird. ', entry({
      id: 'hugo-rache',
      suspectId: 'hugo',
      title: italic('„Der Tod muss gesühnt werden.“'),
      description: 'Der Tod seiner Tochter Ivy müsse gesühnt werden.\n\nIst er bereit, Rache zu nehmen?'
    }, 'Der Tod muss gesühnt werden.')])],
    ['ermittlerin', 'Wir werden alles tun, um diesen Fall gründlich und gerecht zu klären. Lassen Sie uns das Protokoll beginnen. Wo waren Sie am Donnerstag, den 14. Februar, gegen 14 Uhr?'],
    ['hugo', textContent(['Nach dem Unterricht habe ich noch ', entry({
      id: 'hugo-unterricht',
      suspectId: 'hugo',
      title: 'Unterricht und Klausurvorbereitung',
      description: 'Hr. Montague habe am Donnerstag, den 14. Februar, Unterricht hatte und eine Klausur für seinen Oberstufenkurs vorbereitet.'
    }, 'eine Klausur vorbereitet'), ' für mein Oberstufenkurs. Und dann war ich noch ', entry({
      id: 'hugo-holz',
      suspectId: 'hugo',
      title: 'Holz holen für den Kamin',
      description: 'Hr. Montague habe am Donnerstag, den 14. Februar, Holz für den Kamin geholt und sei frische Luft schnappen gegangen.'
    }, 'Holz holen'), ' für den Kamin und draußen etwas frische Luft schnappen. Anschließend hatte ich noch ', entry({
      id: 'hugo-orchester',
      suspectId: 'hugo',
      title: 'War in der Orchester-AG',
      description: 'Hr. Montague sei am Donnerstag, den 14. Februar, noch in der Orchester-AG gewesen.'
    }, 'Orchester-AG'), ', was meinen Aufenthalt dann in der Schule verlängerte. Aber es geht doch hier nicht um mich.'])],
    ['ermittlerin', 'Genau. Es wird berichtet, dass sie ihre Tochter Ivy an jenem Abend leblos Zuhause vorgefunden haben. Können Sie bestätigen, dass sie so war?'],
    ['hugo', textContent(['Ja, das stimmt, dass- Ich habe sie ', entry({
      id: 'hugo-ivy-gefunden-zuhause',
      suspectId: 'hugo',
      title: 'Ivy tot zu Hause gefunden',
      description: 'Hr. Montague habe seine Tochter Ivy tot zu Hause gefunden. Laut ihm sei das Fenster offen gewesen und jemand sei eingebrochen.'
    }, 'tot zu Hause gefunden.'), ' Das Fenster stand offen und- Jemand- Jemand muss eingebrochen sein. Irgendjemand- Irgendjemand muss sie ', entry({
      id: 'hugo-ivy-ermordet',
      suspectId: 'hugo',
      title: 'Ivy sei ermordet worden',
      description: 'Ivy sei ermordet worden und jemand müsse sie verfolgt haben.\n\nWarum glaubt er das?'
    }, 'ermordet'), ' haben. Ich-'])],
    ['ermittlerin', 'Ein furchtbares Ereignis. Kennen Sie jemanden, der einen Groll gegen Ivy hatte? Jemand, der dazu fähig ist, etwas zu tun?'],
    ['hugo', 'Nein. Einige an ein freundliches, ein- ein strahlendes Kind. Sie war so- so wie ihre Mutter. Immer freundlich und zuvorkommend. Ich- Ich kann mir nicht vorstellen, dass ihr jemand absichtlich wehtun wollte. Das- Das muss ein Monster gewesen sein. Finden Sie das!'],
    ['ermittlerin', textContent(['Verstehe. Ihre Akte zeigt, dass Sie ', entry('hugo-kriminelle-vergangenheit', 'eine kriminelle Vergangenheit'), ' haben. Könnte es jemand aus der Vergangenheit geben, der sich revanchieren wollte bei Ihnen?'])],
    ['hugo', entry({
      id: 'hugo-elenas-tod',
      suspectId: 'hugo',
      title: 'Elenas Tod',
      description: 'Hr. Montagues habe seine Frau Elena Delora-Montague verloren.\n\nHat ihr Tod ihn verändert?'
    }, 'Nein. Meine Frau Elena war mein Fels in der Brandung. Sie hat alles für mich getan. Sie hat mich aus dem Dreck gezogen, als es mir dreckig ging. Sie hat- Sie hat mich wieder aufgebaut und diese Zeit ist vorbei, wissen Sie? Ich habe meine Vergangenheit hinter mir gelassen.')],
    ['ermittlerin', 'Ihre Frau war Elena Delora-Montague, korrekt? Mein Beileid auch zu Ihrem Verlust. Es muss schwer gewesen sein, beide so kurz nacheinander zu verlieren. Würden Sie sagen, dass Elena Ihnen geholfen hat, aus diesem alten Leben zu entkommen?'],
    ['hugo', 'Ja. Für Sie habe ich alles getan. Ich wollte auch nicht, dass- dass Ivy davon etwas mitbekommt. Aber jetzt ist- jetzt ist alles vorbei. Jetzt ist meine Vergangenheit- Sie hat mich eingeholt und jetzt stehe ich ganz alleine da.'],
    ['ermittlerin', 'Wie hat Ivy auf den Tod ihrer Mutter reagiert?'],
    ['hugo', 'Sie hat das irgendwie verkraftet. Sie war stark. Aber ich kann mir nun wirklich nicht erklären, wie das alles passieren sollte. Irgendjemand- Irgendjemand muss ihr aufgelauert haben. Irgendjemand hat sie verfolgt. Ja, das- das muss es gewesen sein. Irgendjemand- Irgendjemand wollte sie vernichten.'],
    ['ermittlerin', 'Gibt es jemanden der sie bedroht oder belästigt hat?'],
    ['hugo', textContent(['Nein, da ist niemand. Das habe ich Ihnen doch schon gesagt. ', entry('hugo-ivy-ermordet', 'Aber möglicherweise gibt es jemanden, der etwas sehr Böses wollte und-'), ' Ich weiß es doch auch nicht. Finden Sie es doch heraus. Sie muss Gerechtigkeit erfahren. Sie und Elena. Das- Das schulde ich Ihnen.'])],
    ['ermittlerin', 'Haben Sie jemals darüber nachgedacht, dass es sich vielleicht nicht um einen Mord handeln könnte, sondern um etwas anderes?'],
    ['hugo', textContent([entry({
      id: 'hugo-kein-selbstmord',
      suspectId: 'hugo',
      title: 'Ivy sei kein Selbstmord',
      description: 'Hr. Montague sagt, dass Ivy kein Selbstmord begangen habe und dass sie viel zu stark dafür gewesen sei.\n\nWarum glaubt er das?'
    }, 'Nein, es war kein Selbstmord.'), ' Dafür war sie viel zu stark. Jeder hier kann das bestätigen. Sie müssen dieses Monster finden, das das getan hat. Es muss- Es muss jemand von da draußen gewesen sein.'])],
    ['ermittlerin', 'Es tut mir leid, dass ich diese Möglichkeit ansprechen musste, Herr Montague. Aber es ist wichtig, dass wir alle Optionen in Betracht ziehen.'],
    ['hugo', textContent(['Bitte finden Sie den Schuldigen. Ich kann es nicht ertragen, wenn man Ivy einfach so vergisst und ich habe alles verloren. Ich will nur, dass der, ', entry('hugo-rache', 'der das getan hat, zur Rechenschaft gezogen wird.')])],
    ['ermittlerin', 'Vielen Dank, Herr Montague. Es muss Ihnen wirklich schwer gefallen sein, das jetzt alles mit uns zu teilen. Und ich kann Ihnen versprechen, wir werden alles dafür tun, um diesen Fall so schnell und gerecht wie möglich zu klären. Bei weiteren Fragen werden wir uns dann bei Ihnen melden.'],
  ],
  speakers: [
    {
      id: 'hugo',
      avatarAssetId: 'suspects/Hugo1.webp',
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