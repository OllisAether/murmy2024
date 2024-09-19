import { Clue, ClueTypes } from '../../clue';
import { besucherliste } from './besucherliste';
import { hfbChloroformTuch, hfbDolch } from './hfb';
import { kursbuch } from './kursbuch';
import { map } from './map';
import { polizeilichesFührungszeugnis } from './polizeilichesFührungszeugnis';
import { liebesRitual, rituale } from './rituale';
import { schülerakteCassandra, schülerakteIvy, schülerakteKopelius, schüleraktePhineas, schüleraktePhoebe } from './schülerakte';
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
  schülerakteKopelius,
  schüleraktePhoebe,
  schülerakteCassandra,
  schülerakteIvy,
  schüleraktePhineas,

  // Spurensicherungen
  spurensicherungIvy,
  spurensicherungPhineas,

  // Hinweisfundberichte
  hfbChloroformTuch,
  hfbDolch,

  // Sonstige
  map,
  polizeilichesFührungszeugnis,
  kursbuch,
  besucherliste,
  stundenplan,
  zeitung
]