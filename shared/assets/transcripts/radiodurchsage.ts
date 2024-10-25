import { entry, textContent } from "../../textContent";
import { Transcript } from "../../transcript";

export const radiodurchsage: Transcript =  {
  id: 'radiodurchsage',
  for: 'Ivys Suizid.mp4',
  thumbnailAssetId: 'thumbnails/Ritual.webp',
  title: 'Radiodurchsage',
  content: [
    ['radio', textContent(['Wir unterbrechen unser Programm für eine dringende Eilmeldung.\n\n',

entry({
  id: 'radio-phineas-gefunden',
  title: 'Eilmeldung: 16.02.2013 - Phineas Musé tot aufgefunden',
  suspectId: 'phineas',
  description: 'Phineas Musé wurde am 16. Februar 2013 tot im Stadtwald aufgefunden.',
}, 'Der junge Phineas Musé, gerade einmal 15 Jahre alt, wurde am 16. Februar 2013 im Stadtwald tot aufgefunden.'), entry({
  id: 'radio-phineas-lebendig-begraben',
  title: 'Eilmeldung: 14.02.2013 - Phineas Musé lebendig begraben',
  suspectId: 'phineas',
  description: 'Phineas wurde am Valentinstag, den 14. Februar 2013, lebendig begraben.',
}, 'Die Ermittler gehen davon aus, dass er zwei Tage zuvor, am Valentinstag, ermordet wurde. Phineas wurde lebendig begraben – ein grausames Verbrechen, die Alt-Arborwinde erschüttert.'), `

Noch gibt es keine näheren Details zum Mord. Die Ermittler tappen im Dunkeln, und der Mörder ist weiterhin auf freiem Fuß. Die Polizei hat ihre Fahndung intensiviert und bittet dringend um Hinweise von der Bevölkerung. Sollten Sie etwas Verdächtiges gesehen oder gehört haben, melden Sie sich bitte umgehend bei den Behörden.

Die Polizei rät zur Vorsicht und bittet alle, besonders im Stadtwald und den umliegenden Gebieten, wachsam zu bleiben. Weitere Informationen werden so bald wie möglich veröffentlicht.

Zurück zu unserem Regulären Programm.
Sie hören weiterhin die besten Hits – hier auf Arborwinde FM.`])]
  ],
  speakers: [
    {
      id: 'radio',
      name: 'Radiosprecherin',
      color: '#6d98e3',
    }
  ]
}