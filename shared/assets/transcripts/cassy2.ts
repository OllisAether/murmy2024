import { Transcript } from "../../transcript";
import { getSuspectById } from "../suspects";

export const cassy2: Transcript =  {
  id: 'cassy2',
  for: 'Cassy 2.mp4',
  thumbnailAssetId: 'suspects/Cassy2.webp',
  title: 'Interview 2: Cassandra Novak',
  content: [
    ['ermittlerin', 'Guten Tag, Cassandra. Danke, dass Sie sich auf ein weiteres Gespräch mit uns einlassen.'],
    ['cassy', 'Kein Problem. Das letzte Interview war schon super Content für mein Blog. Wenn dies genauso wird, dann kann sich nicht beschweren.'],
    ['ermittlerin', 'Gut, im letzten Interview haben Sie behauptet, gemeinsam mit Phineas im Park gewesen zu sein. Unsere Ermittlungen bestätigen jedoch, dass sie sich nicht aktiv mit ihm aufgehalten haben, sondern nur in seiner Nähe waren. Haben Sie das mit versteckt gemeint?'],
    ['cassy', 'Ehrm, also ich war doch mit ihm da. Nur weil ich nicht die ganze Zeit neben ihm gelaufen bin, heißt es ja nicht, dass es nicht bei ihm war. Ich war die ganze Zeit bei ihm und das zählt doch auch.'],
    ['ermittlerin', 'Cassandra, wir haben ihre Aufnahmen von Phineas gefunden. Unter anderem gibt es eine Aufnahme, die die Auseinandersetzung zwischen Phineas und Justin van Bustin zeigt. Was haben diese Aufnahmen auf sich und weshalb filmen Sie Phineas.'],
    ['cassy', 'Äh, was ist daran falsch? Phineas gehört zu mir. Und es ist völlig normal, Dinge aufzunehmen, die man mag. Genauso wie ich Phineas filme, weil er- Weil er einfach perfekt ist für mich.'],
    ['ermittlerin', 'Abgesehen davon, dass er seine Privatsphäre missachtet haben, haben Sie auch keine Hilfe geleistet, als Phineas angegriffen wurde. Sie haben zugesehen, wie geschlagen wurde, haben aber kein Krankenwagen gerufen.'],
    ['cassy', 'Das ist eine Lüge. Natürlich habe ich den Krankenwagen gerufen. Warum auch nicht? Es war einfach so faszinierend, das zu unterbrechen. Ich habe gewartet, bis das abgehauen ist, bevor ich überhaupt was getan habe. Phineas- Er ist einfach zu wertvoll. Ich konnte ihn nicht einfach sterben lassen.'],
    ['ermittlerin', 'Sie wiederholen die ganze Zeit, dass Phineas „perfekt“ war und dass Sie ihn „dafür“ gebraucht hätten. Gab es etwas Bestimmtes, wofür Sie ihn nutzen wollten?'],
    ['cassy', 'Er war einfach perfekt. Perfekt für meine Rituale. Das perfekte Opfer. Ich musste sicherstellen, dass er unversehrt bleibt. Na ja, jetzt ist er halt tot. Alles war umsonst. Na ja, vielleicht doch nicht ganz umsonst. Ich bin dem Orakel noch nie so nahe gekommen wie jetzt.'],
    ['ermittlerin', 'Das Orakel? Können Sie das bitte genauer erklären?'],
    ['cassy', 'Das wüssten Sie wohl gern, hm?'],
    ['ermittlerin', 'Ja, Cassandra. Darum frage ich.'],
    ['cassy', 'Naja, dafür müssen Sie mein Blog lesen.'],
    ['ermittlerin', 'Okay, was auch immer. Jedenfalls. Was haben Sie getan, nach dem Phineas es ins Krankenhaus eingeliefert wurde?'],
    ['cassy', 'Ich bin ihr direkt gefolgt. Ich habe mich an die Tür gehangen, ohne dass es jemand gemerkt hat. Später, als sie dann in seinem Zimmer war, bin ich direkt zugegangen und habe mich neben ihn gesetzt und mit ihm geredet. Er hat zwar nicht geantwortet, aber er kannte meinen Namen. Er wusste, wer es war.'],
    ['ermittlerin', 'Ich ignoriere mal, dass Sie an der Tür hingen. Worüber haben Sie geredet?'],
    ['cassy', 'Ach, über dies und das. Ich habe ihr ein paar Rituale gezeigt, bei dem ich sie gerne opfern wollte. Er hat zwar nichts gesagt, aber ich hab es in seinen Augen gesehen. Er war begeistert von der Idee. Ich habe Zustimmung in seinen Augen gesehen.'],
    ['ermittlerin', 'Wie lange sind Sie geblieben?'],
    ['cassy', 'Boah, eine Ewigkeit. Irgendwann hat dann meine Mutter angerufen und ich habe mich auf den Weg gemacht. Auf dem Weg hin habe ich Herr Montague gesehen. Ja. Und dann fiel mir auf, dass Sie noch mit Ivy reden wollte. Diese Verräterin. Na ja, dass kann ich ja jetzt nicht mehr.'],
    ['ermittlerin', 'Sie haben also Herrn Montague getroffen? Ist etwas an ihm aufgefallen?'],
    ['cassy', 'Eigentlich war er wie immer. Er hatte eine große Tasche dabei gehabt. War bestimmt so ein Instrument drinne. Er ist im Orchester.'],
    ['ermittlerin', 'Ist Ihnen sonst noch etwas Ungewöhnliches aufgefallen?'],
    ['cassy', 'Nö, eigentlich nichts.'],
    ['ermittlerin', 'Gut, dann bedanke ich mich für Ihre Zeit, Cassandra.'],
  ],
  speakers: [
    {
      id: 'cassy',
      avatarAssetId: 'suspects/Cassy2.webp',
      alignment: 'right',
      name: getSuspectById('cassandra')?.name ?? '',
      color: getSuspectById('cassandra')?.color
    },
    {
      id: 'ermittlerin',
      name: 'Ermittlerin',
      color: '#e8dcbc'
    }
  ]
}