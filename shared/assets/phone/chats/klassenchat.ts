import moment from "moment";
import { Chat } from "../../../phone/chat";
import { cassyNumber } from "../contacts";

const participants = [cassyNumber, ...Array.from({ length: 16 }).map((_, i) => '+49 171 39200' + (i + 72).toString().padStart(2, '0'))]

export const klassenchat: Chat = {
  type: 'group',
  name: 'Geo Montag 🌍 (⛔ JUSTIN 🙅‍♂️)',
  iconAssetId: 'phone/klassenchat.webp',
  participants,
  messages: [
    {
      type: 'timestamp',
      timestamp: moment('2012-12-17 18:23')
    },
    {
      type: 'info',
      content: 'Du wurdest zur Gruppe "Geo Montag 🌍 (⛔ JUSTIN 🙅‍♂️)" hinzugefügt'
    },
    {
      type: 'message',
      sender: '+49 171 3920072',
      content: 'Ey, wieso ist Montag diese Woche gar nicht da? 🤔'
    },
    {
      type: 'message',
      sender: '+49 171 3920078',
      content: 'Keine Ahnung, aber ich beschwer mich nicht 😅'
    },
    {
      type: 'message',
      sender: '+49 171 3920074',
      content: 'Vielleicht vorzeitiger Weihnachtsurlaub? 😂'
    },
    {
      type: 'message',
      sender: '+49 171 3920072',
      entry: 'diary-hugo-distanter',
      content: 'Er wirkt auch sonst so distanziert in letzter Zeit...'
    },
    {
      type: 'message',
      sender: cassyNumber,
      content: 'Ich sag\'s euch - er bereitet ein Ritual vor. Es passt alles perfekt. Der Zeitpunkt, die Woche vor Weihnachten… Die Sterne sind auf jeden Fall richtig ausgerichtet 🌑🔮'
    },
    {
      type: 'message',
      sender: '+49 171 3920073',
      content: 'Ähm... sicher, Cassandra? Vielleicht hat er einfach \'ne Erkältung oder so?'
    },
    {
      type: 'message',
      sender: cassyNumber,
      content: 'Ihr seid blind! Das ist kein Zufall, dass er plötzlich verschwindet. Das Orakel hat so was vor einem Jahr vorhergesagt. Ich weiß, ich hab den Eintrag irgendwo…'
    },
    {
      type: 'message',
      sender: '+49 171 3920081',
      content: 'Okay, das wird interessant 😂'
    },
    {
      type: 'message',
      sender: '+49 171 3920083',
      content: 'Na ja, egal, ob Ritual oder Erkältung - kein Geo diese Woche!'
    },
    {
      type: 'timestamp',
      timestamp: moment('2012-12-24 09:19'),
    },
    {
      type: 'message',
      sender: '+49 171 3920072',
      content: 'Frohe Weihnachten, Leute! 🎄✨'
    },
    {
      type: 'message',
      sender: '+49 171 3920078',
      content: 'Frohe Weihnachten! Habt ihr alle schöne Geschenke bekommen? 🎁'
    },
    {
      type: 'message',
      sender: '+49 171 3920074',
      content: 'Ja, total! Ich hab ein neues Buch, das ich mir schon lange gewünscht habe! 📚'
    },
    {
      type: 'message',
      sender: cassyNumber,
      content: 'Ich hab eine spezielle Kerze für mein Ritual gekauft. Sie riecht so gut! 🕯️'
    },
    {
      type: 'message',
      sender: '+49 171 3920073',
      content: 'Cool, Cassandra... aber wir wollten gerade über die Geschenke sprechen. 😅'
    },
    {
      type: 'message',
      sender: '+49 171 3920081',
      content: 'Haha, genau! Also, ich hab ein neues Handy bekommen! 📱'
    },
    {
      type: 'message',
      sender: '+49 171 3920078',
      content: 'Ich auch! Und ein neues Spiel. Total genial! 🎮'
    },
    {
      type: 'message',
      sender: '+49 171 3920072',
      content: 'Ich kann nicht aufhören, von meinem neuen Outfit zu schwärmen! Es ist so schön! 😍'
    },
    {
      type: 'message',
      sender: cassyNumber,
      content: 'Ihr könnt alle gerne zu meinem Ritual kommen, um gute Energie ins neue Jahr zu bringen!'
    },
    {
      type: 'message',
      sender: '+49 171 3920073',
      content: 'Ähm, danke, aber ich denke, wir bleiben lieber bei unseren Plänen...'
    },
    {
      type: 'message',
      sender: '+49 171 3920074',
      content: 'Ja, wir sehen uns nach den Ferien! Frohe Feiertage, alle! 🎉'
    },
    {
      type: 'timestamp',
      timestamp: moment('2013-01-06 20:58'),
    },
    {
      type: 'message',
      sender: '+49 171 3920072',
      content: 'Hey Leute, seid ihr bereit für die Schule morgen? 😬'
    },
    {
      type: 'message',
      sender: '+49 171 3920078',
      content: 'Nicht wirklich! Ich könnte noch ein paar Tage Ferien gebrauchen.'
    },
    {
      type: 'message',
      sender: '+49 171 3920074',
      content: 'Ja, ich auch! Aber immerhin ist es nur ein Halbjahr bis zu den nächsten Ferien! 🎉'
    },
    {
      type: 'message',
      sender: '+49 171 3920072',
      content: 'Stimmt! Lass uns einfach hoffen, dass die Lehrer uns nicht gleich mit Hausaufgaben überhäufen.'
    },
    {
      type: 'message',
      sender: '+49 171 3920078',
      content: 'Das wäre der Worst! 😩'
    },
    {
      type: 'message',
      sender: cassyNumber,
      content: 'Vielleicht sollte ich ein weiteres Ritual machen, um die Lehrer milde zu stimmen!'
    },
    {
      type: 'message',
      sender: '+49 171 3920074',
      content: '😂 Lass das lieber, wir haben schon genug Stress.'
    },
    {
      type: 'message',
      sender: '+49 171 3920073',
      content: 'Wir sehen uns morgen! Lasst uns das Beste draus machen! ✌️'
    },

    {
      type: 'timestamp',
      timestamp: moment('2013-01-20 20:41'),
    },
    {
      type: 'message',
      sender: '+49 171 3920078',
      content: 'Hat jemand die Hausaufgaben gemacht?'
    },
    {
      type: 'message',
      sender: '+49 171 3920074',
      content: 'Ne'
    },
    {
      type: 'message',
      sender: '+49 171 3920078',
      content: 'Ok, dann mach ich sie auch nicht 😂'
    },
    {
      type: 'message',
      sender: '+49 171 3920081',
      content: 'Whaat? Es gibt Hausaufgaben?!?!?'
    },
    {
      type: 'message',
      sender: '+49 171 3920078',
      content: '💀'
    }
  ]
};