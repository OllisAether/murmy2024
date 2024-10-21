import { Clue } from "../../clue";
import { italic, textContent } from "../../textContent";

export const schuelerakteKopelius: Clue<'images'> = {
  type: 'images',
  id: 'schuelerakteKopelius',
  cost: 20,
  title: 'Schülerakte von Justin',
  thumbnailAssetId: 'thumbnails/Schuelerakte-Justin.webp',
  images: {
    assetIds: ['clues/schuelerakten/Schuelerakte-Justin.webp'],
    entries: [
      {
        rect: {
          x: 0.2854528635778636,
          y: 0.43142447657028915,
          width: 0.6466377091377091,
          height: 0.3756153414755733,
        },
        entryId: 'justin-problemschueler',
      },
      {
        rect: {
          x: 0.28905729166666666,
          y: 0.13122016898864808,
          width: 0.22074479166666666,
          height: 0.03136287409700722,
        },
        entry: {
          id: 'justin-echtername',
          title: 'Kopelius van Bustin',
          suspectId: 'justin',
          description: textContent(['In der Schülerakte von Justin steht, dass sein echter Name ', italic('„Kopelius van Bustin“'), ' ist.']),
        },
      }
    ]
  }
}

export const schueleraktePhoebe: Clue<'images'> = {
  type: 'images',
  id: 'schueleraktePhoebe',
  cost: 20,
  title: 'Schülerakte von Phoebe',
  thumbnailAssetId: 'thumbnails/Schuelerakte-Phoebe.webp',
  images: {
    assetIds: ['clues/schuelerakten/Schuelerakte-Phoebe.webp'],
    entries: [
      {
        rect: {
          x: 0.290875,
          y: 0.42990115454076366,
          width: 0.34734895833333335,
          height: 0.33528847394220845,
        },
        entry: {
          id: 'phoebe-top-a-student',
          title: 'Top-Schülerin',
          suspectId: 'phoebe',
          description: 'Phoebe ist sehr sozial engagiert, hilfsbereit und eine der besten Schülerinnen der Schule.\n\nDoch ist sie wirklich so unschuldig, wie sie scheint?',
        }
      }
    ]
  }
}

export const schuelerakteCassandra: Clue<'images'> = {
  type: 'images',
  id: 'schuelerakteCassandra',
  cost: 20,
  title: 'Schülerakte von Cassandra',
  thumbnailAssetId: 'thumbnails/Schuelerakte-Cassy.webp',
  images: {
    assetIds: ['clues/schuelerakten/Schuelerakte-Cassy.webp'],
    entries: [
      {
        rect: {
          x: 0.288330078125,
          y: 0.6328890931372549,
          width: 0.4169142702792553,
          height: 0.05515512125902993,
        },
        entry: {
          id: 'cassandra-okkult-leiterin',
          title: 'Leiterin des Okkult-Clubs',
          suspectId: 'cassandra',
          description: 'Cassandra ist die Leiterin des Okkult-Clubs und nimmt ihre Rolle sehr ernst.\n\nSind ihre Rituale lediglich ein Spiel oder steckt mehr dahinter?',
        }
      },
      {
        rect: {
          x: 0.28770674035904253,
          y: 0.6970015802373581,
          width: 0.4169142702792553,
          height: 0.05421584752321981,
        },
        entry: {
          id: 'cassandra-verwarnung',
          title: 'Verwarnung wegen okkultem Verhalten',
          suspectId: 'cassandra',
          description: 'Cassandra hat eine Verwarnung wegen okkulter Aktivitäten erhalten.\n\nHat sie etwas größeres vor, als nur ein paar Rituale?',
        }
      }
    ]
  }
}

export const schuelerakteIvy: Clue<'images'> = {
  type: 'images',
  id: 'schuelerakteIvy',
  cost: 20,
  title: 'Schülerakte von Ivy',
  thumbnailAssetId: 'thumbnails/Schuelerakte-Ivy.webp',
  images: {
    assetIds: ['clues/schuelerakten/Schuelerakte-Ivy.webp'],
    entries: [
      {
        rect: {
          x: 0.2874452298280423,
          y: 0.5892874419504643,
          width: 0.314453125,
          height: 0.03509578173374613,
        },
        entry: {
          id: 'ivy-krankheit',
          title: 'Anämie',
          suspectId: 'ivy',
          description: `Ivy leidet an Anämie (Blutarmut).

Als Anämie bezeichnet man einen verminderten Hämoglobin-Gehalt des Blutes oder zu niedrigen Anteil der Erythrozyten am Blutvolumen. Die Folge ist eine zu geringe Transportkapazität für Sauerstoff.

Ist das der Grund für Ivys Blässe und Müdigkeit?`
        }
      },
      {
        rect: {
          x: 0.28857163525132273,
          y: 0.4349603328173375,
          width: 0.21903418485449735,
          height: 0.03509578173374613,
        },
        entry: {
          id: 'ivy-konflikte',
          title: 'Oft in Konflikten',
          suspectId: 'ivy',
          description: 'Ivy gerät oft in Konflikte mit anderen Schülern und Lehrern.'
        }
      },
      {
        rect: {
          x: 0.28901599702380953,
          y: 0.7041650541795665,
          width: 0.2781084656084656,
          height: 0.03831269349845201,
        },
        entryId: 'ivy-todesdatum',
      }
    ]
  }
}


export const schueleraktePhineas: Clue<'images'> = {
  type: 'images',
  id: 'schueleraktePhineas',
  cost: 20,
  title: 'Schülerakte von Phineas',
  thumbnailAssetId: 'thumbnails/Schuelerakte-Phineas.webp',
  images: {
    assetIds: ['clues/schuelerakten/Schuelerakte-Phineas.webp'],
    entries: [
      {
        rect: {
          x: 0.14952170484727756,
          y: 0.1477844427244582,
          width: 0.8056938911022576,
          height: 0.42297552244582043,
        },
        entry: {
          id: 'herzensbrecher',
          title: textContent(['Kritzelei ', italic('„Herzensbrecher“')]),
          suspectId: 'phineas',
          description: textContent(['Jemand hat auf die Schülerakte von Ivy ', italic('„Herzensbrecher“'), ' gekritzelt.\n\nWer könnte das gewesen sein?']),
        }
      },
      {
        rect: {
          x: 0.28711196879150064,
          y: 0.6362833784829721,
          width: 0.29084184096945553,
          height: 0.04835445691434469,
        },
        entry: {
          id: 'phineas-einzelgaenger',
          title: 'Einzelgänger',
          suspectId: 'phineas',
          description: 'In der Schülerakte von Phineas steht, dass er ein Einzelgänger ist und sich von den anderen Schülern fernhält.',
        }
      },
      {
        rect: {
          x: 0.2866347111553785,
          y: 0.7162063015995872,
          width: 0.3273261122177955,
          height: 0.04835445691434469,
        },
        entry: {
          id: 'probleme-mit-kopelius',
          title: 'Probleme mit Kopelius',
          suspectId: 'phineas',
          description: textContent(['Kopelius und Phineas haben Probleme miteinander. Jemand mit der Abkürzung ', italic('„MT“'), ' hat das in die Akte geschrieben.']),
        }
      }
    ]
  }
}