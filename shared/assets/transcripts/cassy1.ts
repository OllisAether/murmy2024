import { entry, italic, textContent } from "../../textContent";
import { Transcript } from "../../transcript";
import { getSuspectById } from "../suspects";

export const cassy1: Transcript =  {
  id: 'cassy1',
  for: 'Cassy 1.mp4',
  thumbnailAssetId: 'suspects/Cassy1.webp',
  title: 'Interview: Cassandra Novak',
  content: [
    ['ermittlerin', 'Guten Tag, Cassandra Novak. Vielen Dank, dass Sie sich bereiterklärt haben, dieses Gespräch zu führen.'],
    ['cassy', textContent(['Kein Problem. Das wird eh später ein großer Eintrag für mein Blog. Kennen Sie ihn? ', entry({
      id: 'cassy-blog',
      suspectId: 'cassandra',
      title: '„Cassanova“-Blog',
      description: 'Cassandra hat einen Blog, auf dem sie über ihre Aktivitäten im Okkult-Club schreibt. Sie nennt den Blog „Cassanova“.'
    }, '„Cassanova“'), ' Clever, oder?'])],
    ['ermittlerin', 'Nein, den kenne ich nicht. Lass uns bei der Sache bleiben Cassandra.'],
    ['cassy', 'Spaßbremse.'],
    ['ermittlerin', 'Wie dem auch sei. Können Sie mir sagen, was Sie am Donnerstag, den 14. Februar, gegen 14 Uhr gemacht haben?'],
    ['cassy', textContent(['Oh ja, klar. Das war doch gestern am Valentinstag, oder? ', entry({
      id: 'cassy-park',
      suspectId: 'cassandra',
      title: 'Parkbesuch mit Phineas Musé',
      description: 'Cassandra sei am Valentinstag im Park gewesen und habe Zeit mit Phineas Musé verbracht.\n\nSind die beiden zusammen?'
    }, 'Da war ich im Park mit Phiny. Also Phineas. Bisschen Quality Time verbringen. Sie wissen schon.')])],
    ['ermittlerin', 'Aha. Sie waren also mit Phineas Musé aus Ihrem Geografieorientierungskurs unterwegs?'],
    ['cassy', 'Eh, wen sonst? Wenn Sie meinen Blog lesen würden, dann wissen Sie es, und müssen es nicht immer fragen.'],
    ['ermittlerin', 'Gut, also meinen Sie Phineas Musé.'],
    ['cassy', 'Wir waren dort und Zeit zusammen zu verbringen. Doch dann kam dieser Vollidiot Justin und hat alles ruiniert.'],
    ['ermittlerin', 'Justin van Bustin? Was genau ist passiert?'],
    ['cassy', textContent(['Ja, genau der. ', entry({
      id: 'cassy-justin-zusammengeschlagen',
      suspectId: 'cassandra',
      title: 'Justin habe Phineas angegriffen',
      description: 'Justin habe Phineas angegriffen.\n\nWarum hat Justin das getan?'
    }, 'Der Typ hat einfach auf Phiny eingeschlagen.'), ' Eine Sekunde schaue ich weg und- und auf einmal schlägt sie ihn komplett zusammen.'])],
    ['ermittlerin', 'Das müssen Sie genauer erklären. Justin van Bustin hat Phineas also grundlos angegriffen?'],
    ['cassy', textContent(['Ja, und wie? Es war richtig brutal, ', entry({
      id: 'cassy-zusammengeschlagen-spannend',
      suspectId: 'cassandra',
      title: italic('„aber irgendwie auch spannend.“'),
      description: 'Cassandra fand es brutal, wie Justin Phineas zusammengeschlagen habe, aber auch spannend.\n\nIst das nicht ein bisschen seltsam?'
    } ,'aber irgendwie auch spannend.')])],
    ['ermittlerin', 'Lass uns den letzten Teil einfach ignorieren. Also, Sie sagen, Justin hätte Phineas körperlich verletzt und Sie haben nichts dagegen unternommen.'],
    ['cassy', textContent(['Nichts unternommen? Natürlich habe ich ‘was unternommen. ', entry({
      id: 'cassy-versteckt',
      suspectId: 'cassandra',
      title: 'Vor Phineas versteckt',
      description: 'Cassandra habe sich vor Phineas versteckt.\n\nWarum hat sie das getan?',
    }, 'Ich habe mich zwar versteckt'), ', weil Phiny mich nicht sehen sollte und hab gewartet, bis Justin ihn in Ruhe gelassen hat. ', entry({
      id: 'cassy-krankenwagen',
      suspectId: 'cassandra',
      title: 'Krankenwagen gerufen',
      description: 'Cassandra habe nach dem Angriff den Krankenwagen gerufen.'
    }, 'Und dannach habe ich sofort den Krankenwagen gerufen. '), 'Denn was sollte ich denn sonst machen? Justin ist unberechenbar.'])],
    ['ermittlerin', 'Wissen Sie, wie es Phineas momentan geht?'],
    ['cassy', textContent(['Er war seitdem nicht mehr in der Schule. ', entry({
      id: 'cassy-krankenhaus',
      suspectId: 'cassandra',
      title: 'Besuch im Krankenhaus verweigert',
      description: 'Cassandra habe Phineas Musé im Krankenhaus besucht, aber ihr sei der Zugang verweigert worden.\n\nWarum wurde ihr der Zugang verweigert?'
    }, 'Ich habe ihn im Krankenhaus besucht. Doch als ich gestern hingehen wollte, haben sie mir den Zugang verweigert.'), ' Ist schon seltsam, oder?'])],
    ['ermittlerin', 'Wurde Ihnen der Grund genannt.'],
    ['cassy', entry('cassy-krankenhaus' ,'Nein, nur das es gerade nicht geht und ich später wiederkommen soll. Das ist richtig suspekt.')],
    ['ermittlerin', 'Gut, danke für diese Information. Nun zu meiner nächsten Frage. Wie stehen Sie zur Schülerin, Ivy Delora?'],
    ['cassy', textContent(['Ivy? ', entry({
      id: 'ivy-gut-verstanden',
      suspectId: 'cassandra',
      title: 'Früher gut mit Ivy verstanden',
      description: 'Cassandra habe sich früher gut mit Ivy Delora verstanden.'
    }, 'Früher haben wir uns gut verstanden. '), entry({
      id: 'ivy-okkult-club',
      suspectId: 'ivy',
      title: 'War Mitglied im Okkult-Club',
      description: 'Ivy war Mitglied im Okkult-Club.'
    }, 'Sie war sogar in meinem Okkult Club.'), ' Wir haben viele Rituale praktiziert, um dem großen Orakel näher zu kommen. Jedes Mal waren wir so nah dran. Irgendwie hat es nicht ganz gereicht. Es braucht einfach mehr. So kurz vor der Antwort. ', 'Und auf einmal bricht sie alles ab. Können Sie das glauben?'])],
    ['ermittlerin', 'Mehr? Können Sie das näher beschreiben?'],
    ['cassy', 'Ivy war gut. Doch sie hat den Fokus verloren, verstehen sie? Sie hat sich auf die unwesentlichen Dinge konzentriert. Wie Phineas. Ihre ständigen Schwärmereien von ihm haben alles ruiniert. Sie hat sich einfach nicht auf das Wesentliche konzentriert. Das Orakel ist Alles. Und sie hat das nicht verstanden. Ich habe es ihr so oft erzählt. Doch dieses Mädchen wollte einfach nicht hören. Jetzt hat sie alles ruiniert.'],
    ['ermittlerin', 'Sie sind also verärgert darüber, dass Ivy Phineas mehr Aufmerksamkeit geschenkt hat als dem Orakel.'],
    ['cassy', textContent(['Verärgert? Das ist noch untertrieben. Sie hat alles, woran wir gearbeitet haben, über Bord geworfen, nur weil sie ', entry({
      id: 'cassy-ivy-ruiniert',
      suspectId: 'cassandra',
      title: 'Ivy habe Herzaugen für Phineas gehabt',
      description: 'Ivy habe alles ruiniert, weil sie Herzaugen für Phineas hatte.'
    }, 'Herzaugen für diesen Phineas hatte.'), ' Ich habe immer gesagt, das Orakel ist das Wichtigste. Sie hat es einfach nicht gehört. Also habe ich sie rausgeschmissen. Und sie durfte nie wieder das Ritualbuch anfassen.'])],
    ['ermittlerin', 'Sie haben also eine Art Groll gegen Ivy?'],
    ['cassy', textContent(['Groll? Das trifft es nichtmal ansatzweise. ', entry({
      id: 'cassy-orakel-mord',
      suspectId: 'cassandra',
      title: 'Das Orakel habe Ivy getötet',
      description: 'Das Orakel habe Ivy getötet.\n\nWarum sollte das Orakel Ivy getötet haben?'
    }, 'Hätte das Orakel sie nicht getötet, dann hätte ich es getan. Doch das Orakel war gnädig. Es hat meine Gebete erhört und sie für mich beseitigt.'), ' Es sieht alles, wissen Sie?'])],
    ['ermittlerin', 'Okay, vielen Dank, Cassandra. Ich glaube, das reicht vorerst. Eine letzte Frage hätte ich noch. Ist Ihnen am Donnerstag sonst etwas Ungewöhnliches aufgefallen?'],
    ['cassy', 'Außer, dass dieser Vollidiot Justin mein Date mit Phineas ruiniert hat, eigentlich nicht.'],
    ['ermittlerin', 'Gut, danke. Ich melde mich, wenn wir weitere Fragen haben.'],
    ['cassy', 'Klar, machen Sie das. Ich bin gespannt, was Sie noch herausfinden. Vielleicht hilft es auch beim nächsten Blogeintrag.'],
  ],
  speakers: [
    {
      id: 'cassy',
      avatarAssetId: 'suspects/Cassy1.webp',
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