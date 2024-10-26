import { Form } from "../form";

export const form: Form = [
  {
    title: 'Das Mordopfer 💀',
    description: 'Fragen zum Mordopfer',

    fields: [
      {
        id: 'wer-mordopfer',
        type: 'suspect',

        title: 'Wer ist das Mordopfer?',
        solutions: [
          {
            suspectId: 'phineas',
            points: 10
          }
        ]
      },
      {
        id: 'wie-gestorben',
        type: 'choice',

        title: 'Wie wurde das Mordopfer getötet?',
        description: 'Auf welche Weise wurde das Mordopfer getötet?',

        choices: [
          {
            id: 'lebendig-begraben',
            text: 'Das Mordopfer wurde lebendig begraben',
          },
          {
            id: 'zusammengeschlagen',
            text: 'Das Mordopfer wurde zusammengeschlagen',
          },
          {
            id: 'kehle-durchgeschnitten',
            text: 'Dem Mordopfer wurde die Kehle durchgeschnitten',
          },
          {
            id: 'vergiftet',
            text: 'Das Mordopfer wurde vergiftet',
          },
          {
            id: 'magie',
            text: 'Das Mordopfer wurde durch Magie hingerichtet',
          },
          {
            id: 'zum-tod-getrieben',
            text: 'Das Mordopfer wurde zum Tod getrieben',
          },
          {
            id: 'erwuergt',
            text: 'Das Mordopfer wurde erwuergt',
          },
          {
            id: 'blutverlust',
            text: 'Das Mordopfer verstarb an Blutverlust',
          }
        ],
        points: 4,
        multiple: true,
        deductPoints: 3,
        solutionIds: ['lebendig-begraben'],
      },
      {
        id: 'wie-gestorben-indizien',
        type: 'entry',

        title: 'Welche Indizien deuten darauf hin?',
        description: 'Welche Indizien deuten darauf hin, wie das Mordopfer getötet wurde?',

        morePossible: {
          max: 2,
          points: 1
        },
        amount: 1,
        deductPoints: 2,
        solutions: [
          {
            id: 'leiche-im-wald',
            points: 3
          },
          {
            id: 'leiche-im-wald-radio',
            points: 3
          },
        ],
      },

      {
        id: 'was-wurde-angerichtet',
        type: 'choice',

        title: 'Was wurde dem Mordopfer noch angetan?',
        description: 'Was wurde dem Mordopfer vor oder nach dem Tod noch angetan?',

        choices: [
          {
            id: 'erpresst',
            text: 'Das Mordopfer wurde erpresst',
          },
          {
            id: 'betäubt',
            text: 'Das Mordopfer wurde betäubt',
          },
          {
            id: 'familienmitglied-entrissen',
            text: 'Dem Mordopfer wurde ein Familienmitglied entrissen',
          },
          {
            id: 'verraten',
            text: 'Das Mordopfer wurde verraten',
          },
          {
            id: 'geopfert',
            text: 'Das Mordopfer wurde geopfert',
          },
          {
            id: 'zusammengeschlagen',
            text: 'Das Mordopfer wurde zusammengeschlagen',
          },
          {
            id: 'verflucht',
            text: 'Das Mordopfer wurde verflucht',
          },
          {
            id: 'emotional-missbraucht',
            text: 'Das Mordopfer wurde emotional missbraucht',
          }
        ],
        solutionIds: [
          'betäubt',
          'zusammengeschlagen'
        ],
        deductPoints: 1,
        multiple: true,
        points: 2,
      },
      {
        id: 'was-wurde-angerichtet-indizien',
        type: 'entry',

        title: 'Welche Indizien deuten darauf hin?',
        description: 'Welche Indizien deuten darauf hin, dass dem Mordopfer noch etwas angetan wurde?',

        morePossible: {
          max: 2,
          points: 1
        },
        amount: 1,
        deductPoints: 2,
        solutions: [
          
        ],
      },

      {
        id: 'wo-verstorben',
        type: 'entry',

        title: 'Wo verstarb das Mordopfer?',

        amount: 1,
        deductPoints: 1,
        morePossible: {
          max: 3,
          points: 1
        },
        solutions: [
          {
            id: 'radio-phineas-gefunden',
            points: 3
          },
          {
            id: 'leiche-im-wald',
            points: 3
          },
          {
            id: 'wald',
            points: 2
          }
        ]
      }
    ]
  },

  {
    title: 'Der Mörder',
    description: 'Fragen zum Mörder',
    fields: [
      {
        id: 'wer-moerder',
        type: 'suspect',

        title: 'Wer ist der Mörder?',

        solutions: [
          {
            suspectId: 'hugo',
            points: 10
          }
        ]
      },

      {
        id: 'motiv',
        type: 'choice',

        title: 'Was ist das Motiv des Mörders?',
        description: 'Welches Motiv könnte der Mörder gehabt haben, um das Mordopfer zu töten?',

        choices: [
          {
            id: 'opfergabe',
            text: 'Das Mordopfer war eine Opfergabe',
          },
          {
            id: 'verrat',
            text: 'Das Mordopfer hat den Mörder verraten',
          },
          {
            id: 'rache',
            text: 'Der Mörder wollte sich rächen',
          },
          {
            id: 'ritual',
            text: 'Der Mord resultiert aus einem Ritual',
          },
          {
            id: 'eifersucht',
            text: 'Der Mörder war eifersüchtig',
          },
          {
            id: 'wut',
            text: 'Der Mörder war wütend',
          },
          {
            id: 'beweisen',
            text: 'Der Mörder wollte zeigen wer der Babo ist',
          },
          {
            id: 'revier-uebertreten',
            text: 'Das Mordopfer hat das Revier des Mörders unbefugt Übertreten',
          },
          {
            id: 'liebe',
            text: 'Der Mörder hat aus Liebe getötet',
          },
          {
            id: 'schuldgefuehl',
            text: 'Der Mörder hat aus Schuldgefühlen getötet',
          },
        ],
        points: 6,
        deductPoints: 4,
        multiple: true,
        solutionIds: ['rache'],
      },
      {
        id: 'motiv-indizien',
        type: 'entry',

        title: 'Welche Indizien deuten darauf hin?',
        description: 'Welche Indizien deuten darauf hin, dass das Motiv des Mörders zutrifft?',

        morePossible: {
          max: 2,
          points: 1
        },
        amount: 1,
        deductPoints: 2,
        solutions: [
          
        ],
      }
    ]
  },

  {
    title: 'Das Suizidopfer',
    description: 'Fragen zum Suizidopfer',
  
    fields: [
      {
        id: 'wer-suizidopfer',
        type: 'suspect',

        title: 'Wer ist das Suizidopfer?',

        solutions: [
          {
            suspectId: 'ivy',
            points: 10
          }
        ]
      }
    ]
  },

  {
    title: 'Der Mobber',
    description: 'Fragen zum Mobber',

    fields: [
      {
        id: 'wer-mobber',
        type: 'suspect',

        title: 'Wer hat das Mordopfer gemobbt?',

        solutions: [
          {
            suspectId: 'justin',
            points: 3
          }
        ]
      }
    ]
  },

  {
    title: 'Die nahestehende Person',
    description: 'Fragen zur nahestehenden Person',

    fields: [
      {
        id: 'wer-nahestehend',
        type: 'suspect',

        title: 'Wer stand dem Mordopfer nahe?',

        solutions: [
          {
            suspectId: 'phoebe',
            points: 3
          }
        ]
      }
    ]
  },
  
  {
    title: 'Was hat es mit dem Okkult auf sich?',
    description: 'Fragen zum Okkult',

    fields: [
      {
        id: 'wer-okkult',
        type: 'suspect',
        
        title: 'Wer ist der Leiter des Okkult-Clubs?',
        solutions: [
          {
            suspectId: 'cassandra',
            points: 3
          }
        ]
      }
    ]
  },

  {
    title: 'Zeitlicher Ablauf',
    description: 'Fragen zum zeitlichen Ablauf',

    fields: [
      {
        id: 'wann-mord',
        type: 'entry',

        title: 'Wann spielte sich das Geschehen ab?',

        amount: 2,
        deductPoints: 2,
        morePossible: {
          max: 3,
          points: 2
        },
        solutions: [
          {
            id: 'radio-phineas-lebendig-begraben',
            points: 3
          },
          {
            id: 'leiche-im-wald',
            points: 3
          },
          {
            id: 'ivy-todesdatum',
            points: 3
          }
        ]
      },

      {
        id: 'was-war-der-tag',
        type: 'choice',

        title: 'Was war an diesem Tag?',
        choices: [
          {
            id: 'valentinstag',
            text: 'Valentinstag',
          },
          {
            id: 'phineas-geburtstag',
            text: 'Phineas\' Geburtstag',
          },
          {
            id: 'ivys-geburtstag',
            text: 'Ivys Geburtstag',
          },
          {
            id: 'justins-enderdrache',
            text: 'Justin hat den Enderdrachen in Minecraft besiegt',
          }
        ],
        points: 2,
        multiple: true,
        deductPoints: 1,
        solutionIds: ['valentinstag'],
      },

      {
        id: 'zeitstrahl',
        type: 'assign',

        title: 'Was ist am Tag des Mordes passiert?',
        description: 'Ordne die Ereignisse dem der richtigen Zeit zu. Nicht alle Ereignisse müssen zugewiesen werden.',
        choicesA: [
          {
            id: '0700-0800',
            text: '7:00 - 8:00 Uhr',
          },
          {
            id: '1115',
            text: '11:15 Uhr',
          },
          {
            id: '1300-1326',
            text: '13:00 - 13:26 Uhr',
          },
          {
            id: '1326-1328',
            text: '13:26 - 13:28 Uhr',
          },
          {
            id: '1343-1345',
            text: '13:43 - 13:45 Uhr',
          },
          {
            id: '1400-1430',
            text: '14:00 - 14:30 Uhr',
          },
          {
            id: '1430',
            text: '14:30 Uhr',
          },
          {
            id: '1500-1600',
            text: '15:00 - 16:00 Uhr',
          },
          {
            id: '1638',
            text: '16:38 Uhr',
          },
          {
            id: '1654',
            text: '16:54 Uhr',
          },
          {
            id: '1700-1800',
            text: '17:00 - 18:00 Uhr',
          },
          {
            id: '1800-1900',
            text: '18:00 - 19:00 Uhr',
          },
        ],
        choicesB: [
          {
            id: 'streit-phoebe-phineas',
            text: 'Streit zwischen Phoebe und Phineas',
          },
          {
            id: 'ivy-liebesgestaendnis',
            text: 'Ivy gesteht ihre Liebe',
          },
          {
            id: 'phoebe-liebesgestaendnis',
            text: 'Phoebe gesteht ihre Liebe',
          },
          {
            id: 'phineas-lehnt-ab',
            text: 'Phineas lehnt ab',
          },
          {
            id: 'ivy-liebesritual',
            text: 'Ivy führt ein Liebesritual durch',
          },
          {
            id: 'ivy-holt-liebesritual',
            text: 'Ivy holt sich das Liebesritual von Cassandra',
          },
          {
            id: 'ivy-klaut-liebesritual',
            text: 'Ivy klaut sich das Liebesritual aus dem Okkult-Club',
          },
          {
            id: 'ivy-klaut-dolch',
            text: 'Ivy klaut den Dolch von Hr. Montague',
          },
          {
            id: 'justin-phineas-streit',
            text: 'Justin schlägt Phineas zusammen',
          },
          {
            id: 'justin-selbstmord',
            text: 'Justin begeht Selbstmord',
          },
          {
            id: 'justin-notruf',
            text: 'Justin ruft 112 an',
          },
          {
            id: 'cassandra-ritual',
            text: 'Cassandra führt das Ritual des Orakels durch',
          },
          {
            id: 'cassandra-notruf',
            text: 'Cassandra ruft 112 an',
          },
          {
            id: 'hugo-holzfällerhütte',
            text: 'Montague geht zur Holzfällerhütte',
          },
          {
            id: 'hugo-holzfällerhütte-cello',
            text: 'Montague geht zur Holzfällerhütte mit seinem Cello',
          },
          {
            id: 'hugo-sieht-notarzt',
            text: 'Montague sieht den Krankenwagen im Park mit Phineas',
          },
          {
            id: 'phineas-krankenhaus',
            text: 'Phineas wird ins Krankenhaus gebracht',
          },
          {
            id: 'cassandra-besuch',
            text: 'Cassandra besucht Phineas im Krankenhaus',
          },
          {
            id: 'hugo-cello-koffer',
            text: 'Hr. Montague holt seinen Cello-Koffer',
          },
          {
            id: 'hugo-entdeckt-ivy',
            text: 'Hr. Montague entdeckt Ivy Tod',
          },
          {
            id: 'hugo-bringt-ivy-zurueck',
            text: 'Hr. Montague bringt Ivy nach Hause',
          },
          {
            id: 'hugo-besuch',
            text: 'Hr. Montague besucht Phineas im Krankenhaus',
          },
          {
            id: 'phineas-betäubt',
            text: 'Phineas wird betäubt',
          },
          {
            id: 'kissen-taeuschung',
            text: 'Kissen werden als Täuschung benutzt',
          },
          {
            id: 'phineas-erstickt',
            text: 'Phineas wird mit einem Kissen erstickt',
          },
          {
            id: 'phineas-cello',
            text: 'Phineas wird in den Cello-Koffer gestopft',
          },
          {
            id: 'phoebe-besuch',
            text: 'Phoebe besucht Phineas im Krankenhaus',
          },
          {
            id: 'phoebe-entschuldigt-sich',
            text: 'Phoebe entschuldigt sich bei Phineas',
          },
          {
            id: 'hugo-vergräbt-phineas',
            text: 'Hr. Montague vergräbt Phineas',
          },
          {
            id: 'hugo-geht-zurueck',
            text: 'Hr. Montague geht nach Hause',
          },
          {
            id: 'hugo-notruf',
            text: 'Hr. Montague ruft 112 an',
          }
        ].sort(() => Math.random() - 0.5),
        points: 2,
        multiple: true,
        solutionPairs: [],
      }
    ]
  },
]

export function getFieldFromId (id: string) {
  return form.flatMap(f => f.fields).find(f => f.id === id)
}