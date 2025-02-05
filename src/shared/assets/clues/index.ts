import { Clue, ClueTypes } from '../../clue';
import { besucherliste } from './besucherliste';
import { bfbChloroformTuch, bfbDolch } from './bfb';
import { kursbuch } from './kursbuch';
import { map } from './map';
import { fuehrungszeugnis } from './fuehrungszeugnis';
import { liebesRitual, rituale } from './rituale';
import { schuelerakteCassandra, schuelerakteIvy, schuelerakteKopelius, schueleraktePhineas, schueleraktePhoebe } from './schuelerakte';
import { autopsieberichtIvy, autopsieberichtPhineas } from './autopsiebericht';
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
  autopsieberichtIvy,
  autopsieberichtPhineas,

  // Hinweisfundberichte
  bfbChloroformTuch,
  bfbDolch,

  // Sonstige
  map,
  fuehrungszeugnis,
  kursbuch,
  besucherliste,
  stundenplan,
  zeitung
]