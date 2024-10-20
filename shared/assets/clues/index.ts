import { Clue, ClueTypes } from '../../clue';
import { besucherliste } from './besucherliste';
import { hfbChloroformTuch, hfbDolch } from './hfb';
import { kursbuch } from './kursbuch';
import { map } from './map';
import { polizeilichesFuehrungszeugnis } from './polizeilichesFuehrungszeugnis';
import { liebesRitual, rituale } from './rituale';
import { schuelerakteCassandra, schuelerakteIvy, schuelerakteKopelius, schueleraktePhineas, schueleraktePhoebe } from './schuelerakte';
import { spurensicherungIvy, spurensicherungPhineas } from './spurensicherung';
import { stundenplan } from './stundenplan';
import { todesurkundeElena, todesurkundeIvy } from './todesurkunde';
import { zeitung } from './zeitung';

export const clues: Clue<ClueTypes>[] = [
  // Rituale
  rituale,
  liebesRitual,

  // Todesurkunden
  todesurkundeElena,
  todesurkundeIvy,

  // Schülerakten
  schuelerakteKopelius,
  schueleraktePhoebe,
  schuelerakteCassandra,
  schuelerakteIvy,
  schueleraktePhineas,

  // Spurensicherungen
  spurensicherungIvy, // TODO
  spurensicherungPhineas, // TODO

  // Hinweisfundberichte
  hfbChloroformTuch, // TODO
  hfbDolch, // TODO

  // Sonstige
  map,
  polizeilichesFuehrungszeugnis, // TODO
  kursbuch,
  besucherliste, // TODO
  stundenplan,
  zeitung
]