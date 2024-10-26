import { entry, textContent } from "../../textContent";
import { Transcript } from "../../transcript";
import { getSuspectById } from "../suspects";

export const justin2: Transcript =  {
  id: 'justin2',
  for: 'Justin 2.mp4',
  thumbnailAssetId: 'suspects/Justin2.webp',
  title: 'Interview 2: Justin van Bustin',
  content: [
    ['ermittlerin', 'Guten Tag, Justin. Danke, dass Sie sich die Zeit nehmen für ein weiteres Gespräch mit mir. Ich möchte gleich zur Sache kommen. Unsere Quellen bestätigen, dass Sie Phineas an jenem Tag, sprich dem 14. Februar, mit erheblicher Gewalt im Park angegriffen haben.'],
    ['justin', 'Was also? Nein, ich- ich- da- ich hab- Das stimmt nicht. Ich habe gar nichts gemacht.'],
    ['ermittlerin', 'Justin. Justin, Sie sollten sich nicht noch tiefer in Ihre Lügen verstricken. Sie haben das im letzten Interview schon versucht, als Sie uns nicht die ganze Wahrheit gesagt haben. Es wäre besser für Sie, offen zu reden.'],
    ['justin', 'Nein, ich wollte das nicht.'],
    ['ermittlerin', 'Was wollten Sie nicht?'],
    ['justin', entry('justin-phineas-umgebracht', 'Es kann sein, dass ich ihn vielleicht zu hart getroffen habe.')],
    ['ermittlerin', 'Zu hart getroffen? Erklären Sie das bitte genauer.'],
    ['justin', 'Ich wusste nicht, dass der Bre so schnell aufgeben würde. Ich wollte das nicht. Ehrlich.'],
    ['ermittlerin', 'Was meinen Sie damit, Justin?'],
    ['justin', 'Ich wollte ihm einfach zeigen, wer der Babo ist. Ihm klar machen, dass er mir nicht auf die Nase herumtanzen kann. Aber er wollte nicht mitspielen. Also habe ich ihn geschlagen und dann noch mal geschlagen. Und nochmal. Und nochmal. Und dann hat er aufgehört, sich zu bewegen und kriegte Schiss und bin weggelaufen.'],
    ['ermittlerin', 'Waren Sie alleine mit Phineas im Park oder waren noch andere Personen beteiligt?'],
    ['justin', textContent([entry({
      id: 'justin-nur-wir-zwei',
      suspectId: 'justin',

      title: 'Sei nur mit Phineas im Park gewesen',
      description: 'Justin behauptet, dass nur er und Phineas im Park gewesen sind.'
    }, 'Es waren nur wir zwei.'), ' Seine Fresse. Ich konnte mich nicht zurückhalten, also habe ich einfach drauflosgeschlagen. Ich wollte des nicht.'])],
    ['ermittlerin', 'Verstehe. Das ist also, was passiert ist. Sehr interessant. Aber warum haben Sie uns das nicht beim letzten Mal schon gesagt? Da haben Sie behauptet, dass Sie nichts im Park zu suchen hatten. Warum die Lügen, Justin?'],
    ['justin', 'Ich hätte Angst, okay? Ich wollte einfach keinen Stress. Sie hatten mich so bedrängt. Ich wollte das nicht. Bitte, ich- ich bin zu jung für den Knast. Ich wollte das wirklich nicht. Ich wollte ihn nicht so hart treffen. Ich wollte gar nichts davon. Meine Minecraft-Welt. Ich habe den Enderdrachen immer noch nicht besiegt.'],
    ['ermittlerin', 'Justin, das ist hier kein Spiel. Ein Mensch ist tot und der Mörder ist immer noch auf freier Spur. Sie hätten von Anfang an ehrlich sein müssen.'],
    ['justin', 'Bitte, ich wollte das nicht. Ich wollte das wirklich nicht.'],
    ['ermittlerin', 'Jetzt ist es zu spät, um das zu ändern. Wir werden Ihre Aussagen untersuchen. Und was mit Ihnen passiert? Das wird sich noch zeigen.'],
    ['justin', 'Nein. Nein. Bitte, nein.'],
    ['ermittlerin', 'Sie werden sich Ihren Konsequenzen stellen müssen, Justin.'],
    ['justin', 'Bitte nein. Ich wollte das nicht. Ich wollte es wirklich nicht.'],
  ],
  speakers: [
    {
      id: 'justin',
      avatarAssetId: 'suspects/Justin2.webp',
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