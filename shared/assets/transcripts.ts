import { bold, color, entry, shaky, textContent, wiggly } from "../textContent";
import { Transcript } from "../transcript";
import { getSuspectById } from "./suspects";

export const transcripts: Transcript[] = [
  {
    id: 'telefonaufzeichnung1',
    title: 'Telefonaufzeichnung 19:42',
    for: 'telefonaufzeichnung1.mp3',
    thumbnailAssetId: 'thumbnails/telefon thumb.png',
    speakers: [
      {
        id: 'notrufzentrale',
        name: 'Notrufzentrale',
        color: '#e54071',
        alignment: 'right',
      },
      {
        id: 'anonym',
        name: 'Anonym',
        color: '#6f7e9e',
        alignment: 'left',
      }
    ],
    content: [
      ['notrufzentrale', 'Notrufzentrale Polizei, was ist Ihr Anliegen?'],
      ['anonym', shaky('B-Bitte hören Sie mich. Es ist ein Notfall. Tocqueville High School. Sie müssen sofort kommen.')],
      [{ speaker: 'notrufzentrale', withLastSpeaker: true }, 'Können Sie uns die Situation bitte näher beschreiben?'],
      ['anonym', 'Im obersten Geschoss. Schnell. Sie müssen schnell sein. Dringender Notfall. Bitte.'],
      ['notrufzentrale', 'Wo genau? Kö-'],
      [null, wiggly('anonyme Person legt auf.')],
    ]
  },
  {
    id: 'interview_ferluci',
    for: 'Interview Ferluci.mp4',
    thumbnailAssetId: 'thumbnails/ferluci.png',
    title: 'Interview mit Terrylin Ferluci',
    speakers: [
      {
        id: 'ermittler1',
        name: 'Ermittler 1',
        // color: '#FF0000',
        alignment: 'right',
      },
      {
        id: 'ermittler2',
        name: 'Ermittler 2',
        // color: '#0000FF',
        alignment: 'right',
      },
      {
        id: 'ferluci',
        name: 'Terrylin Ferluci',
        color: getSuspectById('ferluci')?.color,
        alignment: 'left',
        avatarAssetId: 'thumbnails/ferluci.png'
      }
    ],
    content: [
      ['ermittler1', textContent([
        'Guten Tag, ',
        bold(color(getSuspectById('ferluci')?.color, entry({
          matterId: 'ferluci',
          title: 'Terrylin Ferluci',
          suspectId: 'ferluci',
          description: 'Schulleiterin',
          image: {
            imageAssetId: 'thumbnails/ferluci.png',
          }
        }, 'Frau Ferluci.'))),
        ' Wir haben erfahren, dass Sie eine wichtige Position in der Schule haben. Könnten Sie uns bitte für die Formalität Ihren Namen und Ihre Rolle in der Schule nennen?'
      ])],
      [{ speaker: 'ferluci', flipAvatar: true }, 'Guten Tag, selbstverständlich. Mein Name ist Terrylin Ferluci und ich bin die Schulleiterin der Tocqueville High School.'],
      ['ermittler1', textContent([
        'Wir möchten Ihnen zunächst unser Beileid für den Verlust von ',
        wiggly('Dr. Robert Hawthorne'),
        ' aussprechen. Es ist eine tragische Situation, und wir werden alles dafür tun, diesen Fall aufzuklären. Aber dafür benötigen wir Ihre Unterstützung. Können Sie uns mehr darüber erzählen, was für eine Art von Person Dr. Hawthorne war?'
      ])],
      ['ferluci', 'Erstmal Vielen Dank. Es ist in der Tat ein großer Verlust für unsere Schule. Dr. Hawthorne, er war einer der engagiertesten Lehrer der Schule. Er zeigte nicht nur Interesse für seine Schüler. Er zeigte Interesse für sein Fach und für seine eigenen Projekte.'],
      ['ermittler1', 'Wir haben gehört, dass Dr. Hawthorne eine besondere Beziehung zu seinen Schülern hatte. Wissen Sie da mehr darüber?'],
      ['ferluci', 'Ja, er hatte eine besondere Gabe, eine Beziehung und eine Verbindung zu seinen Schülern aufzubauen. Deswegen kamen sie oft zu ihm in schwierigen Situationen mit den Eltern zuhause. Deswegen war er sehr beliebt bei ihnen.'],
      ['ermittler1', 'Wir haben aber auch Informationen erhalten, dass ein bestimmter Schüler, der sich gut mit Dr. Hawthorne verstanden hat, am Tag des Mordes möglicherweise bei Ihnen im Büro befand, um bestimmte Angelegenheiten zu besprechen. Können Sie uns dazu mehr sagen?'],
      ['ferluci', 'Nun, das stimmt. Der Schüler Xavier Leblanc war in meinem Büro zweimal an jenem Tag, aber es ging um schulische Angelegenheiten.'],
      ['ermittler2', 'Ist es korrekt, dass jeder Besuch bei der Schulleitung vorher beim Sekretariat H.201 angemeldet und genehmigt werden muss?'],
      ['ferluci', 'Korrekt. Das Sekretariat liegt direkt vor meinem Büro. Deswegen kann keiner ungehindert rein passieren. Aber ich kann davor Bescheid geben, dass ich Besucher erwarte und dann werden diese auch ohne Genehmigung reingelassen.'],
      ['ermittler1', 'Könnten Sie uns bitte sagen, worum es bei Xaviers Besuchen ging?'],
      ['ferluci', 'Nun, wie gesagt. Es ging um allgemeine Angelegenheiten. Bei beiden Gesprächen ging es um den Eintritt Xaviers in die Elite-Schülerschaft, wonach er schon länger strebt.'],
      ['ermittler2', 'Könnten Sie uns bitte genauer definieren, was die „Elite-Schülerschaft“ ist?'],
      ['ferluci', 'Natürlich. Hierbei gehts um eine Gruppe von Schülern, die durch hervorragende Leistung herausstechen. Außerdem müssen sie mindestens in einem Fach der Jahrgangsbeste sein. Dafür genießen sie aber Privilegien, wie zum Beispiel, Teilnahme an schulinternen Projekten oder ein Stipendium, was für sie garantiert ist.'],
      ['ermittler1', 'Vielen Dank für die Erklärung. Aber haben Sie, während der Treffen mit Xavier, möglicherweise Informationen oder Hinweise erhalten, die für den aktuellen Fall von Bedeutung sein könnten?'],
      ['ferluci', 'Nein, während dieser Besuche gab es keinerlei ungewöhnliche Informationen, die ausgetauscht worden sind über den Vorfall.'],
      ['ermittler2', 'Wir haben zudem festgestellt, dass an ihrer Schule videoüberwacht wird. Könnten Sie uns bitte mehr über die Überwachungskameras an der Schule erzählen? Wie funktionieren die?'],
      ['ferluci', 'Ich muss zugeben, ich bin nicht der größte Experte auf dem Gebiet. Aber ich bin mir sicher, dass die Kameras die ganze Zeit über laufen und dass die SD-Karten gespeichert werden und ausgetauscht werden.'],
      ['ermittler1', 'Verstehe. Gibt es sonst noch relevante Details, die Sie über die Kamerasysteme wissen?'],
      ['ferluci', 'Ich fürchte nicht. Ich bin da überfragt. Ich bin mir nur sicher, dass der Hausmeister Claude Carpentier die SD-Karten regelmäßig austauscht und für den flüssigen Ablauf sorgt. Sonst wüsste ich noch, dass der Überwachungsraum auf dem Schulhof liegt, aber das wars auch eigentlich.'],
      ['ermittler1', 'Alles klar. Wir werden das weiter untersuchen. Nochmal vielen Dank für Ihre Kooperation, Frau Ferluci. Wir werden auf jeden Fall auf Sie zurückkommen, falls wir noch weitere Fragen haben.'],
      ['ferluci', 'Gern geschehen. Und Dankeschön für ihre Hilfe Ich hoffe inständig, dass diese Untersuchungen zu Gerechtigkeit für Dr. Hawthorne sorgen.'],
    ]
  }
]