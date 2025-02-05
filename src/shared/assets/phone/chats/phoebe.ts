import moment from "moment";
import { Chat } from "../../../phone/chat";
import { phoebe as p } from "../contacts";
import { entry, textContent } from "../../../textContent";

export const phoebe: Chat = {
  type: 'private',
  number: p.number,

  messages: [
    {
      type: 'timestamp',
      timestamp: moment('2012-12-01 18:28'),
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Brooo'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Wann kommst du endlich an???'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Ich warte schon ewiggggg'
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Wir waren leiden im Stau gefangen'
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Aber wir werden schon bald ankommen keine Sorge'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Okk'
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Nicht so viel Lust auf die neue Schule, muss ich zugeben'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Ach, das wird schon'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Einfach überleben',
      entry: 'phone-phoebe-weisheiten'
    },
    {
      type: 'timestamp',
      timestamp: moment('2012-12-03 16:37'),
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Ein Justin aus unserer Schule hat mich letztens angeschrieben und meinte er sei der "Babo" hier'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Justin van Bustin?'
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Ja'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Achso ja'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Ignorier den einfach',
      entry: {
        id: 'phone-phoebe-weisheiten',
        suspectId: 'phoebe',

        title: 'Weisheiten von Phoebe',
        description: 'Phoebe gibt Phineas oft Ratschläge.'
      }
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Er tut als ob er hart wär, ist er aber nicht'
    },
    {
      type: 'timestamp',
      timestamp: moment('2012-12-05 11:13'),
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Ey, die neue Eisdiele wurde heute eröffnet'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Hast du bock nach der Schule?'
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Klar, will diesen Pestaziengeschmack von den ausprobieren'
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Hab gehört der soll richtig geil sein'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Nice'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Wir sehen uns dort'
    },
    {
      type: 'timestamp',
      timestamp: moment('2012-12-08 14:19'),
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Hast du Tribute von Panem schon gesehen? Das war mega'
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Ja ich mochte vor allem die Prämise'
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Lass nach der Schule quatschen'
    },
    {
      type: 'timestamp',
      timestamp: moment('2012-12-09 16:46'),
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Diese Cassandra lässt much nicht in Ruhe mit ihrem Okkult-Club'
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Ich sollte dem beitreten, weil ich das perfekt Opfer sei???'
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Ich habe es schon mehrmals abgelehnt, aber sie bleibt hartnäckig'
    },
    {
      type: 'message',
      sender: 'me',
      content:  'Außerdem habe ich das Gefühl sie stalkt mich',
      entry: 'diary-cassy-verfolgt'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Dieser Okkult-Club ist wirklich komisch'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Lass das dich aber nicht einschüchtern, dass wird schon',
      entry: 'phone-phoebe-weisheiten'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Die vergisst dich bald, wenn du sie weiterhin abblitzen lässt'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Keine Sorge'
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Wenn du meinst'
    },
    {
      type: 'timestamp',
      timestamp: moment('2012-12-12 15:11'),
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Hast du zufällig noch meine Shrek DVD?'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Jap'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Brauchst du die wieder?'
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Ja, stehe ein wenig unter Zeitdruck'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Alles klar ich bring sie dir morgen'
    },
    {
      type: 'timestamp',
      timestamp: moment('2012-12-15 14:55'),
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Hast du Pläne fürs Neujahr?'
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Ne nicht wirklich'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Willst zusammen feiern? Wir könnten eine richtig geile Party mit vielen Gästen veranstalten'
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Also zusammen feiern ja, aber wenn du so viele Gäste einladen willst lieber nicht'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Oh Schade :('
    },
    {
      type: 'timestamp',
      timestamp: moment('2012-12-24 00:02'),
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Frohe Weihnachten!'
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Frohe Weihnachten!'
    },
    {
      type: 'timestamp',
      timestamp: moment('2012-12-05 18:36'),
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Wie sind so die Ferien?'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Voll cool'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Hab aber gerade keine Zeit'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Ich schreib dir zurück'
    },
    {
      type: 'timestamp',
      timestamp: moment('2013-01-01 00:00')
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Frohes Neues!'
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Frohes Neues!'
    },
    {
      type: 'timestamp',
      timestamp: moment('2013-01-04 9:33'),
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Was machst du so?'
    },
    {
      type: 'message',
      sender: 'me',
      content: textContent(['Hast du Zeit? ', entry('diary-phoebe-reden', 'Ich muss unbedingt mit dir reden')])
    },
    {
      type: 'timestamp',
      timestamp: moment('2012-01-04 14:28'),
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Sorry hatte keine Zeit'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Bin in der Schülerakademie'
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Ok'
    },
    {
      type: 'timestamp',
      timestamp: moment('2013-01-30 13:30')
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Justin kann es einfach nicht lassen'
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Jetzt sagt er mir, dass ich "Parkverbot" habe'
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Was das auch immer heißen soll'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Hahahah'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Scheint so als ob er dich besonders im Visier hat'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'XD'
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Lach nur'
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Du hast schön reden'
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Bist die beste Schülerin, gewinnst immer jeden Wettbewerb und jeder mag dich'
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Da bleibt dir natürlich keine Zeit für den kleinen unwichtigen Phineas und seinen kleinen bedeutungslosen Problem'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Was meinst du?'
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Du ignorierst mich in letzter Zeit',
      entry: {
        id: 'phone-phoebe-ignoriert',
        suspectId: 'phoebe',

        title: 'Phoebe ignoriert Phineas',
        description: 'Phineas fühlt sich von Phoebe ignoriert.'
      }
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Das stimmt doch gar nicht'
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Ist das so?'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Ja und wenn schon du bist hier derjenige, der was falsch gemacht/verbrochen hat'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Schließlich erzähle ich nicht jedem deine Geheimnisse!',
      entry: {
        id: 'phone-phoebe-geheimnisse',
        suspectId: 'phoebe',

        title: 'Impliziert, dass Phineas\' Geheimnisse weitererzählt',
        description: 'Phoebe impliziert, dass sie Phineas ihre Geheimnisse weitererzählt.\n\nWas hat sie ausgeplaudert?'
      }
    },
    {
      type: 'message',
      sender: 'me',
      content: 'Wovon redet du jetzt!?'
    },
    {
      type: 'message',
      sender: p.number,
      content: 'Denk mal nach'
    },
]
}