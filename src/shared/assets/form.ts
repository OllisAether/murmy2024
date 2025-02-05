import Color from "color";
import { Form } from "../form";
import { css, textContent } from "../textContent";
import { getSuspectById } from "./suspects";

export const form: Form = [
  {
    title: 'Das Mordopfer',
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
        description: 'Gebe an, wie das Mordopfer getötet wurde.',

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

        title: 'Welche Indizien deuten darauf hin, wie das Mordopfer getötet wurde?',
        description: 'Gebe Indizien an, die darauf hindeuten, wie das Mordopfer getötet wurde.',

        morePossible: {
          max: 2,
          points: 1
        },
        amount: 1,
        deductPoints: 2,
        solutions: [
          {
            id: 'zeitung-leiche-im-wald',
            points: 3
          },
          {
            id: 'radio-phineas-lebendig-begraben',
            points: 3
          },
        ],
      },

      {
        id: 'was-wurde-angerichtet',
        type: 'choice',

        title: 'Was wurde dem Mordopfer noch angetan?',
        description: 'Gebe an was dem Mordopfer vor oder nach dem Tod angetan wurde.',

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
        description: 'Gebe Indizien an, die darauf hindeuten, dass dem Mordopfer noch etwas angetan wurde.',

        morePossible: {
          max: 3,
          points: 1
        },
        amount: 2,
        deductPoints: 1,
        solutions: [
          {
            id: 'cassy-justin-zusammengeschlagen',
            points: 2
          },
          {
            id: 'justin-phineas-zusammengeschlagen',
            points: 2
          },
          {
            id: 'cassy-notruf-1',
            points: 2
          },
          {
            id: 'phineas-haematome',
            points: 3
          },
          {
            id: 'justin-phineas-umgebracht',
            points: 1
          },
        ],
      },

      {
        id: 'wo-verstorben',
        type: 'entry',

        title: 'Wo verstarb das Mordopfer?',
        description: 'Gebe an, wo das Mordopfer verstorben ist.\nHinweise die belegen, wo das Mordopfer verstorben ist, geben mehr Punkte.',

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
            id: 'zeitung-leiche-im-wald',
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
        description: 'Gebe Indizien an, die darauf hindeuten, welches Motiv der Mörder hatte.',

        morePossible: {
          max: 2,
          points: 0
        },
        amount: 1,
        deductPoints: 3,
        solutions: [
          {
            id: 'hugo-rache',
            points: 6
          }
        ],
      },
      {
        id: 'mord-werkzeug',
        type: 'choice',

        title: 'Welche Mittel wurden benutzt?',
        description: 'Gebe an, welche Mittel der Mörder benutzt hat, um das Mordopfer zu töten.',

        choices: [
          {
            id: 'dolch',
            text: 'Ein Dolch',
          },
          {
            id: 'kissen',
            text: 'Ein Kissen',
          },
          {
            id: 'cello-koffer',
            text: 'Ein Cello-Koffer',
          },
          {
            id: 'betaeubungsmittel',
            text: 'Betäubungsmittel',
          },
          {
            id: 'magie',
            text: 'Magie',
          },
          {
            id: 'faust',
            text: 'Die Faust',
          },
          {
            id: 'gift',
            text: 'Gift',
          },
          {
            id: 'manipulation',
            text: 'Manipulation',
          }
        ],
        points: 2,
        deductPoints: 1,
        multiple: true,
        solutionIds: ['cello-koffer', 'betaeubungsmittel'],
      },
      {
        id: 'mord-werkzeug-indizien',
        type: 'entry',

        title: 'Welche Indizien deuten darauf hin?',
        description: 'Gebe Indizien an, die darauf hindeuten, welche Mittel der Mörder benutzt hat.',

        morePossible: {
          max: 3,
          points: 1
        },
        amount: 2,
        deductPoints: 1,
        solutions: [
          {
            id: 'hugo-cellokoffer',
            points: 2
          },
          {
            id: 'chloroformtuch',
            points: 2
          },
          {
            id: 'chloroformtuch-fundort',
            points: 2
          }
        ],
      },

      {
        id: 'weite-indizien',
        type: 'entry',

        title: 'Welche weiteren Indizien deuten auf den Mörder hin?',
        description: 'Hier kannst du weitere Indizien angeben, die auf den Mörder hinweisen, die bisher nicht genannt wurden.',

        morePossible: {
          max: 5,
          points: 1
        },
        amount: 3,
        deductPoints: 1,
        solutions: [
          {
            id: 'hugos-besuch',
            points: 2
          },
          {
            id: 'hugo-cellokoffer',
            points: 2
          },
          {
            id: 'hugo-rache',
            points: 2
          },
          {
            id: 'hugo-kriminelle-vergangenheit',
            points: 2
          },
          {
            id: 'hugo-orchester-stundenplan',
            points: 2
          },
          {
            id: 'diary-hugo-distanter',
            points: 2
          },
          {
            id: 'hugo-holz',
            points: 2
          },
          {
            id: 'hugo-ivy-gefunden-zuhause',
            points: 2
          },
          {
            id: 'hugo-ivy-ermordet',
            points: 2
          },
          {
            id: 'hugo-kein-selbstmord',
            points: 2
          },
          {
            id: 'hugo-rache',
            points: 2
          },
          {
            id: 'hugo-cellokoffer',
            points: 2
          }
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
      },
      {
        id: 'was-grund-suizid',
        type: 'choice',

        title: 'Was war der Grund für den Suizid?',
        description: 'Gebe an, warum das Suizidopfer sich das Leben genommen hat.',

        choices: [
          {
            id: 'verlorenes-familienmitglied',
            text: 'Das Suizidopfer hat ein Familienmitglied verloren',
          },
          {
            id: 'opfergabe',
            text: 'Das Suizidopfer war eine Opfergabe für ein Ritual',
          },
          {
            id: 'liebesgestaendnis-abgelehnt',
            text: 'Dem Suizidopfer wurde ein Liebesgeständnis abgelehnt',
          },
          {
            id: 'verhaengisvolles-liebesritual',
            text: 'Das Suizidopfer hat ein verhängnisvolles Liebesritual durchgeführt',
          },
          {
            id: 'geheimnis-offenbart',
            text: 'Ein tieferes Geheimnis vom Suizidopfer wurde offenbart',
          },
          {
            id: 'schuldgefuehl',
            text: 'Das Suizidopfer hatte untragbare Schuldgefühle für einen Mord',
          },
          {
            id: 'kindheitsfreund-verloren',
            text: 'Das Suizidopfer hat einen Kindheitsfreund verloren',
          },
          {
            id: 'mobbing',
            text: 'Das Suizidopfer wurde gemobbt',
          },
          {
            id: 'flucht',
            text: 'Das Suizidopfer wollte von den Konsequenzen fliehen',
          },
          {
            id: 'manipulation',
            text: 'Das Suizidopfer wurde manipuliert',
          }
        ],
        points: 6,
        deductPoints: 4,
        multiple: true,
        solutionIds: ['verhaengisvolles-liebesritual', 'liebesgestaendnis-abgelehnt'],
      },
      {
        id: 'was-grund-suizid-indizien',
        type: 'entry',

        title: 'Welche Indizien deuten darauf hin?',
        description: 'Gebe Indizien an, die darauf hindeuten, warum das Suizidopfer sich das Leben genommen hat.',

        morePossible: {
          max: 5,
          points: 1
        },
        amount: 2,
        deductPoints: 1,
        solutions: [
          {
            id: 'ivy-suizid-zeit',
            points: 2
          },
          {
            id: 'blutflecken',
            points: 1
          },
          {
            id: 'ivy-rose',
            points: 2
          },
          {
            id: 'phineas-rose',
            points: 2
          },
          {
            id: 'diary-ivy-nachrichten',
            points: 2
          },
          {
            id: 'phineas-liebesnachrichten',
            points: 2
          },
          {
            id: 'ivy-liebe-des-lebens',
            points: 2
          },
        ],
      },
      {
        id: 'wie-suizid',
        type: 'choice',


        title: 'Wie hat sich das Suizidopfer das Leben genommen?',
        description: 'Gebe an, wie das Suizidopfer gestorben ist.',

        choices: [
          {
            id: 'medikamente',
            text: 'Das Suizidopfer hat Medikamente genommen',
          },
          {
            id: 'erwuergt',
            text: 'Das Suizidopfer hat sich erwuergt',
          },
          {
            id: 'vergiftet',
            text: 'Das Suizidop fer hat sich vergiftet',
          },
          {
            id: 'erhaengt',
            text: 'Das Suizidopfer hat sich erhaengt',
          },
          {
            id: 'ertränkt',
            text: 'Das Suizidopfer hat sich im See ertränkt',
          },
          {
            id: 'kehle-durchgeschnitten',
            text: 'Das Suizidopfer hat sich die Kehle durchgeschnitten',
          },
          {
            id: 'kopf-eingeschlagen',
            text: 'Das Suizidopfer hat sich den Kopf eingeschlagen',
          },
          {
            id: 'lebendig-begraben',
            text: 'Das Suizidopfer hat sich lebendig begraben',
          },
        ],
        points: 4,
        deductPoints: 3,
        multiple: true,
        solutionIds: ['kehle-durchgeschnitten'],
      },
      {
        id: 'wie-suizid-indizien',
        type: 'entry',

        title: 'Welche Indizien deuten darauf hin?',
        description: 'Gebe Indizien an, die darauf hindeuten, wie das Suizidopfer gestorben ist.',

        morePossible: {
          max: 2,
          points: 1
        },
        amount: 1,
        deductPoints: 2,
        solutions: [
          {
            id: 'ivy-schnittwunde',
            points: 3
          },
          {
            id: 'ivy-suizid-zeit',
            points: 3
          },
          {
            id: 'bluttyp-auf-dolch',
            points: 3
          },
          {
            id: 'ivy-dolch',
            points: 3
          },
          {
            id: 'ivy-blutgruppe',
            points: 3
          }
        ],
      },
      {
        id: 'wo-suizid',
        type: 'entry',

        title: 'Wo hat sich das Suizidopfer das Leben genommen?',
        description: 'Gebe markierte Hinweise an, die darauf hindeuten, wo das Suizidopfer gestorben ist.',
        
        amount: 1,
        deductPoints: 1,
        morePossible: {
          max: 2,
          points: 1
        },

        solutions: [
          {
            id: 'ivy-huette',
            points: 3
          },
          {
            id: 'wald',
            points: 1
          }
        ]
      }
    ]
  },

  // {
  //   title: 'Der Mobber',
  //   description: 'Fragen zum Mobber',

  //   fields: [
  //     {
  //       id: 'wer-mobber',
  //       type: 'suspect',

  //       title: 'Wer hat das Mordopfer gemobbt?',

  //       solutions: [
  //         {
  //           suspectId: 'justin',
  //           points: 3
  //         }
  //       ]
  //     },
  //     {
  //       id: 'mobbing-grund',
  //       type: 'choice',

  //       title: 'Warum hat der Mobber gemobbt?',
  //       description: 'Gebe an, warum der Mobber das Mordopfer gemobbt hat.',

  //       choices: [
  //         {
  //           id: 'eifersucht',
  //           text: 'Der Mobber war eifersüchtig',
  //         },
  //         {
  //           id: 'rache',
  //           text: 'Der Mobber wollte sich rächen',
  //         },
  //         {
  //           id: 'verrat',
  //           text: 'Das Mordopfer hat den Mobber verraten',
  //         },
  //         {
  //           id: 'beweisen',
  //           text: 'Der Mobber wollte beweisen, dass er der Babo ist',
  //         },
  //         {
  //           id: 'wut',
  //           text: 'Der Mobber war wütend',
  //         },
  //         {
  //           id: 'liebe',
  //           text: 'Der Mobber hat aus Liebe gemobbt',
  //         },
  //         {
  //           id: 'angst',
  //           text: 'Der Mobber hatte Angst etwas zu verlieren',
  //         },
  //         {
  //           id: 'spass',
  //           text: 'Der Mobber hat aus Spaß gemobbt',
  //         }
  //       ],
  //       points: 2,
  //       deductPoints: 1,
  //       multiple: true,
  //       solutionIds: ['beweisen', 'spass'],
  //     },
  //     {
  //       id: 'mobbing-grund-indizien',
  //       type: 'entry',

  //       title: 'Welche Indizien deuten darauf hin?',
  //       description: 'Gebe Indizien an, die darauf hindeuten, warum der Mobber gemobbt hat.',

  //       amount: 5,
  //       deductPoints: 1,

  //       solutions: [
  //         {
  //           id: 'diary-justin-mobbing',
  //           points: 1
  //         },
  //         {
  //           id: 'phone-justin-mobbing',
  //           points: 1
  //         },
  //         {
  //           id: 'justin-villager',
  //           points: 1
  //         },
  //         {
  //           id: 'cassy-justin-zusammengeschlagen',
  //           points: 1
  //         },
  //         {
  //           id: 'justin-phineas-zusammengeschlagen',
  //           points: 1
  //         }
  //       ],
  //     },
  //     {
  //       id: 'mordopfer-reaktion-mobber',
  //       type: 'choice',

  //       title: 'Wie hat das Mordopfer gegen den Mobber reagiert?',
  //       description: 'Gebe an, was das Mordopfer gegen den Mobber unternommen hat.',

  //       choices: [
  //         {
  //           id: 'hugo-erzaehlt',
  //           text: 'Das Mordopfer hat Hr. Montague von dem Mobbing erzählt',
  //         },
  //         {
  //           id: 'ignoriert',
  //           text: 'Das Mordopfer hat den Mobber ignoriert',
  //         },
  //         {
  //           id: 'verflucht',
  //           text: 'Das Mordopfer hat den Mobber verflucht',
  //         },
  //         {
  //           id: 'dvds-angeboten',
  //           text: 'Das Mordopfer hat dem Mobber DVDs angeboten',
  //         },
  //         {
  //           id: 'geflirtet',
  //           text: 'Das Mordopfer hat mit dem Mobber geflirtet',
  //         },
  //         {
  //           id: 'geschlagen',
  //           text: 'Das Mordopfer hat den Mobber geschlagen',
  //         },
  //         {
  //           id: 'verklagt',
  //           text: 'Das Mordopfer hat den Mobber verklagt',
  //         },
  //         {
  //           id: 'zurueckgemobbt',
  //           text: 'Das Mordopfer hat den Mobber zurückgemobbt',
  //         }
  //       ],
  //       points: 1,
  //       deductPoints: 1,
  //       multiple: true,
  //       solutionIds: ['ignoriert', 'dvds-angeboten'],
  //     },
  //     {
  //       id: 'was-gegen-mobber-indizien',
  //       type: 'entry',

  //       title: 'Welche Indizien deuten darauf hin?',
  //       description: 'Gebe Indizien an, die darauf hindeuten, was das Mordopfer gegen den Mobber unternommen hat.',

  //       morePossible: {
  //         max: 3,
  //         points: 0
  //       },
  //       amount: 1,
  //       deductPoints: 2,

  //       solutions: [
  //         {
  //           id: 'diary-justin-dvd',
  //           points: 3
  //         }
  //       ],
  //     }
  //   ]
  // },

  // {
  //   title: 'Die nahestehende Person',
  //   description: 'Fragen zur nahestehenden Person',

  //   fields: [
  //     {
  //       id: 'wer-nahestehend',
  //       type: 'suspect',

  //       title: 'Wer stand dem Mordopfer nahe?',

  //       solutions: [
  //         {
  //           suspectId: 'phoebe',
  //           points: 3
  //         }
  //       ]
  //     },
  //     {
  //       id: 'beziehung',
  //       type: 'choice',

  //       title: 'Wie stand die nahestehende Person zum Mordopfer?',
  //       description: 'Gebe an, wie die nahestehende Person zum Mordopfer stand.',

  //       choices: [
  //         {
  //           id: 'beste-freunde',
  //           text: 'Die nahestehende Person war der beste Freund des Mordopfers',
  //         },
  //         {
  //           id: 'liebespartner',
  //           text: 'Die nahestehende Person war der Liebespartner des Mordopfers',
  //         },
  //         {
  //           id: 'verwandt',
  //           text: 'Die nahestehende Person war mit dem Mordopfer verwandt',
  //         },
  //         {
  //           id: 'kindheitsfreunde',
  //           text: 'Die nahestehende Person war der Kindheitsfreund des Mordopfers',
  //         },
  //         {
  //           id: 'ritual-partner',
  //           text: 'Die nahestehende Person war der Ritualpartner des Mordopfers',
  //         },
  //         {
  //           id: 'pakt',
  //           text: 'Die nahestehende Person hatte einen Pakt mit dem Mordopfer',
  //         }
  //       ],
  //       points: 2,
  //       deductPoints: 1,
  //       multiple: true,
  //       solutionIds: ['beste-freunde', 'kindheitsfreunde'],
  //     },
  //     {
  //       id: 'beziehung-indizien',
  //       type: 'entry',

  //       title: 'Welche Indizien deuten darauf hin?',
  //       description: 'Gebe Indizien an, die darauf hindeuten, wie die nahestehende Person zum Mordopfer stand.',

  //       morePossible: {
  //         max: 2,
  //         points: 1
  //       },
  //       amount: 2,
  //       deductPoints: 1,

  //       solutions: [
  //         {
  //           id: 'phineas-kindheitsfoto',
  //           points: 1
  //         },
  //         {
  //           id: 'phoebe-enge-freunde',
  //           points: 1
  //         },
  //         {
  //           id: 'phone-phoebe-weisheiten',
  //           points: 1
  //         },
  //         {
  //           id: 'diary-phoebe-sagt',
  //           points: 1
  //         }
  //       ],
  //     },
  //     {
  //       id: 'beziehung-besonderheit',
  //       type: 'choice',

  //       title: 'Was war besonders an der Beziehung?',
  //       description: 'Gebe an, was die Beziehung zwischen der nahestehenden Person und dem Mordopfer besonders machte.',

  //       choices: [
  //         {
  //           id: 'ritual',
  //           text: 'Die Beziehung war Teil eines Rituals',
  //         },
  //         {
  //           id: 'geheimnis',
  //           text: 'Die Beziehung war ein Geheimnis',
  //         },
  //         {
  //           id: 'verboten',
  //           text: 'Die Beziehung war verboten',
  //         },
  //         {
  //           id: 'rivalitaet',
  //           text: 'Die Beziehung war von Rivalität geprägt',
  //         },
  //         {
  //           id: 'verrat',
  //           text: 'Die Beziehung war von Verrat geprägt',
  //         },
  //         {
  //           id: 'vertrauen',
  //           text: 'Die Beziehung war von Vertrauen geprägt',
  //         }
  //       ],
  //       points: 2,
  //       deductPoints: 1,
  //       multiple: true,
  //       solutionIds: ['geheimnis', 'vertrauen'],
  //     },
  //     {
  //       id: 'beziehung-besonderheit-indizien',
  //       type: 'entry',

  //       title: 'Welche Indizien deuten darauf hin?',
  //       description: 'Gebe Indizien an, die darauf hindeuten, was die Beziehung besonders machte.',

  //       morePossible: {
  //         max: 2,
  //         points: 1
  //       },
  //       amount: 1,
  //       deductPoints: 2,

  //       solutions: [
  //         {
  //           id: 'phoebe-geheimnis',
  //           points: 1
  //         },
  //         {
  //           id: 'phoebe-phineas-wenig-miteinander-zu-tun',
  //           points: 1
  //         },
  //         // Vertrauen Handy/Tagebuch
  //       ],
  //     }
  //   ]
  // },
  
  // {
  //   title: 'Was hat es mit dem Okkult auf sich?',
  //   description: 'Fragen zum Okkult',

  //   fields: [
  //     {
  //       id: 'wer-okkult',
  //       type: 'suspect',
        
  //       title: 'Wer ist der Leiter des Okkult-Clubs?',
  //       solutions: [
  //         {
  //           suspectId: 'cassandra',
  //           points: 3
  //         }
  //       ]
  //     },
  //     {
  //       id: 'wer-okkult-indizien',
  //       type: 'entry',

  //       title: 'Welche Indizien deuten darauf hin?',
  //       description: 'Gebe Indizien an, die darauf hindeuten, dass die nahestehende Person der Leiter des Okkult-Clubs ist.',
        
  //       morePossible: {
  //         max: 2,
  //         points: 0
  //       },
  //       amount: 1,

  //       solutions: [
  //         {
  //           id: 'cassandra-okkult-leiterin',
  //           points: 2
  //         }
  //       ]
  //     },
  //     {
  //       id: 'was-okkult',
  //       type: 'choice',

  //       title: 'Was macht der Okkult-Club?',
  //       description: 'Gebe an, was der Okkult-Club macht.',

  //       choices: [
  //         {
  //           id: 'menschen-opfern',
  //           text: 'Der Okkult-Club verfolgt Menschen und opfert sie',
  //         },
  //         {
  //           id: 'rituale',
  //           text: 'Der Okkult-Club führt Rituale durch',
  //         },
  //         {
  //           id: 'horrorfilme-schauen',
  //           text: 'Der Okkult-Club schaut Horrorfilme',
  //         },
  //         {
  //           id: 'orakel-verehrung',
  //           text: 'Der Okkult-Club verehrt das Orakel',
  //         },
  //         {
  //           id: 'verschwoerungstheorien',
  //           text: 'Der Okkult-Club diskutiert Verschwörungstheorien',
  //         },
  //         {
  //           id: 'kräuter-sammeln',
  //           text: 'Der Okkult-Club sammelt Kräuter',
  //         }
  //       ],
  //       points: 2,
  //       deductPoints: 1,
  //       multiple: true,
  //       solutionIds: ['rituale', 'orakel-verehrung'],
  //     },
  //     {
  //       id: 'okkult-echt',
  //       type: 'choice',

  //       title: 'Ist das was der Okkult-Club macht wirklich echt?',
  //       description: 'Gebe an, ob das was der Okkult-Club macht wirklich echt ist.',

  //       choices: [
  //         {
  //           id: 'wahr',
  //           text: 'Das was der Okkult-Club macht ist wahr',
  //         },
  //         {
  //           id: 'falsch',
  //           text: 'Das was der Okkult-Club macht ist falsch',
  //         }
  //       ],
  //       points: 2,
  //       solutionIds: ['falsch'],
  //     },
  //     {
  //       id: 'wer-noch-okkult',
  //       type: 'suspect',

  //       title: 'Wer ist noch im Okkult-Club?',
  //       description: 'Gebe an, wer noch im Okkult-Club ist.',

  //       solutions: [
  //         {
  //           suspectId: 'ivy',
  //           points: 2
  //         }
  //       ]
  //     },
  //     {
  //       id: 'wer-noch-okkult-indizien',
  //       type: 'entry',

  //       title: 'Welche Indizien deuten darauf hin?',
  //       description: 'Gebe Indizien an, die darauf hindeuten, dass die nahestehende Person noch im Okkult-Club ist.',

  //       morePossible: {
  //         max: 2,
  //         points: 0
  //       },
  //       deductPoints: 1,
  //       amount: 1,

  //       solutions: [
  //         {
  //           id: 'ivy-okkult-club',
  //           points: 2
  //         }
  //       ]
  //     }
  //   ]
  // },

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
          max: 4,
          points: 1
        },
        solutions: [
          {
            id: 'radio-phineas-lebendig-begraben',
            points: 3
          },
          {
            id: 'zeitung-leiche-im-wald',
            points: 3
          },
          {
            id: 'ivy-todesdatum',
            points: 3
          },
          {
            id: 'phineas-todesdatum',
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
            text: textContent(['Streit zwischen ', css(timelineText('phoebe'), 'Phoebe'), ' und ', css(timelineText('phineas'), 'Phineas'), ' 🤬']),
          }, // 0700-0800
          {
            id: 'ivy-liebesgestaendnis',
            text: textContent([css(timelineText('ivy'), 'Ivy'), ' gesteht ihre Liebe 💌']),
          }, // 1115
          {
            id: 'phoebe-liebesgestaendnis',
            text: textContent([css(timelineText('phoebe'), 'Phoebe'), ' gesteht ihre Liebe 💌']),
          }, // falsch
          {
            id: 'phineas-lehnt-ab',
            text: textContent([css(timelineText('phineas'), 'Phineas'), ' lehnt ab 💔']),
          }, // 1115
          {
            id: 'ivy-liebesritual',
            text: textContent([css(timelineText('ivy'), 'Ivy'), ' führt das Ritual der ewigen Liebe durch 💘']),
          }, // 1326-1328
          {
            id: 'ivy-selbstmord',
            text: textContent([css(timelineText('ivy'), 'Ivy'), ' begeht Selbstmord ☠️']),
          }, // 1326-1328
          {
            id: 'ivy-holt-liebesritual',
            text: textContent([css(timelineText('ivy'), 'Ivy'), ' holt sich das Liebesritual von ', css(timelineText('cassandra'), 'Cassandra'), ' 💘']),
          }, // falsch
          {
            id: 'ivy-klaut-liebesritual',
            text: textContent([css(timelineText('ivy'), 'Ivy'), ' klaut sich das Liebesritual aus dem Okkult-Club 💘']),
          }, // 1300-1326
          {
            id: 'ivy-klaut-dolch-hugo',
            text: textContent([css(timelineText('ivy'), 'Ivy'), ' klaut den Dolch von ', css(timelineText('hugo'), 'Hr. Montague'), ' 🔪']),
          }, // 1300-1326
          {
            id: 'ivy-klaut-dolch-cassy',
            text: textContent([css(timelineText('ivy'), 'Ivy'), ' klaut den Dolch von ', css(timelineText('cassandra'), 'Cassandra'), ' 🔪']),
          }, // falsch
          {
            id: 'justin-phineas-streit',
            text: textContent([css(timelineText('justin'), 'Justin'), ' schlägt ', css(timelineText('phineas'), 'Phineas'), ' zusammen 👊']),
          }, // 1343-1345
          {
            id: 'justin-selbstmord',
            text: textContent([css(timelineText('justin'), 'Justin'), ' begeht Selbstmord ☠️']),
          }, // falsch
          {
            id: 'justin-notruf',
            text: textContent([css(timelineText('justin'), 'Justin'), ' ruft 112 an 🚑']),
          }, // falsch
          {
            id: 'cassandra-ritual',
            text: textContent([css(timelineText('cassandra'), 'Cassandra'), ' führt das Ritual des Orakels durch 🔮']),
          }, // falsch
          {
            id: 'cassandra-notruf',
            text: textContent([css(timelineText('cassandra'), 'Cassandra'), ' ruft 112 an 🚑']),
          }, // 1343-1345
          {
            id: 'hugo-holzfällerhütte',
            text: textContent([css(timelineText('hugo'), 'Hr. Montague'), ' geht zur Holzfällerhütte 🌲']),
          }, // 1400-1430
          {
            id: 'hugo-holzfällerhütte-cello',
            text: textContent([css(timelineText('hugo'), 'Hr. Montague'), ' geht zur Holzfällerhütte mit seinem Cello-Koffer 🎵']),
          }, // 1700-1800
          {
            id: 'hugo-sieht-notarzt',
            text: textContent([css(timelineText('hugo'), 'Hr. Montague'), ' sieht den Krankenwagen im Park mit ', css(timelineText('phineas'), 'Phineas'), ' 🚑']),
          }, // 1400-1430
          {
            id: 'phineas-krankenhaus',
            text: textContent([css(timelineText('phineas'), 'Phineas'), ' wird ins Krankenhaus gebracht 🏥']),
          }, // 1400-1430
          {
            id: 'cassandra-besuch',
            text: textContent([css(timelineText('cassandra'), 'Cassandra'), ' besucht ', css(timelineText('phineas'), 'Phineas'), ' im Krankenhaus 🏥']),
          }, // 1430
          {
            id: 'hugo-cello-koffer',
            text: textContent([css(timelineText('hugo'), 'Hr. Montague'), ' nimmt seinen Cello-Koffer mit 🎵']),
          }, // 1500-1600
          {
            id: 'hugo-entdeckt-ivy',
            text: textContent([css(timelineText('hugo'), 'Hr. Montague'), ' entdeckt ', css(timelineText('ivy'), 'Ivy'), ' Tod ☠️']),
          }, // 1400-1430
          {
            id: 'hugo-bringt-ivy-zurueck',
            text: textContent([css(timelineText('hugo'), 'Hr. Montague'), ' bringt ', css(timelineText('ivy'), 'Ivy'), ' nach Hause 🏡']),
          }, // 1400-1430
          {
            id: 'hugo-kommt-an-1',
            text: textContent([css(timelineText('hugo'), 'Hr. Montague'), ' kommt zu Hause an 🏡']),
          }, // 1500-1600, 1900
          {
            id: 'hugo-kommt-an-2',
            text: textContent([css(timelineText('hugo'), 'Hr. Montague'), ' kommt zu Hause an 🏡']),
          }, // 1500-1600, 1900
          {
            id: 'hugo-besuch',
            text: textContent([css(timelineText('hugo'), 'Hr. Montague'), ' besucht ', css(timelineText('phineas'), 'Phineas'), ' im Krankenhaus 🏥']),
          }, // 1638
          {
            id: 'phineas-betäubt',
            text: textContent([css(timelineText('phineas'), 'Phineas'), ' wird betäubt 💉']),
          }, // 1638
          {
            id: 'kissen-taeuschung',
            text: textContent(['Kissen werden als Täuschung benutzt 🛏️']),
          }, // 1638
          {
            id: 'phineas-erstickt',
            text: textContent([css(timelineText('phineas'), 'Phineas'), ' wird mit einem Kissen erstickt 🛏️']),
          }, // falsch
          {
            id: 'phineas-cello',
            text: textContent([css(timelineText('phineas'), 'Phineas'), ' wird in den Cello-Koffer gestopft 🎵']),
          }, // 1638
          {
            id: 'phoebe-besuch',
            text: textContent([css(timelineText('phoebe'), 'Phoebe'), ' besucht ', css(timelineText('phineas'), 'Phineas'), ' im Krankenhaus 🏥']),
          }, // 1654
          {
            id: 'phoebe-entschuldigt-sich',
            text: textContent([css(timelineText('phoebe'), 'Phoebe'), ' entschuldigt sich bei ', css(timelineText('phineas'), 'Phineas'), ' 🙏']),
          }, // 1654
          {
            id: 'hugo-vergräbt-phineas',
            text: textContent([css(timelineText('hugo'), 'Hr. Montague'), ' vergräbt ', css(timelineText('phineas'), 'Phineas'), ' 🌲']),
          }, // 1700-1800
          {
            id: 'hugo-geht-zurueck',
            text: textContent([css(timelineText('hugo'), 'Hr. Montague'), ' geht nach Hause 🏡']),
          }, // 1700-1800
          {
            id: 'hugo-notruf',
            text: textContent([css(timelineText('hugo'), 'Hr. Montague'), ' ruft 112 an 🚑']),
          }, // 1900
          {
            id: 'justin-besuch',
            text: textContent([css(timelineText('justin'), 'Justin'), ' besucht ', css(timelineText('phineas'), 'Phineas'), ' im Krankenhaus 🏥']),
          }, // falsch
          {
            id: 'cassy-liebesritual',
            text: textContent([css(timelineText('cassandra'), 'Cassandra'), ' führt das Ritual der ewigen Liebe durch 🩸']),
          }, // falsch
          {
            id: 'cassy-opfert-phineas',
            text: textContent([css(timelineText('cassandra'), 'Cassandra'), ' opfert ', css(timelineText('phineas'), 'Phineas'), ' für ihr Ritual 🩸']),
          }, // falsch
          {
            id: 'cassy-selbstmord',
            text: textContent([css(timelineText('cassandra'), 'Cassandra'), ' begeht Selbstmord ☠️']),
          }, // falsch
          {
            id: 'phineas-selbstmord',
            text: textContent([css(timelineText('phineas'), 'Phineas'), ' begeht Selbstmord ☠️']),
          }, // falsch
          {
            id: 'cassy-opfert',
            text: textContent([css(timelineText('cassandra'), 'Cassandra'), ' opfert sich für ihr Ritual 🩸']),
          }, // falsch
          {
            id: 'hugo-selbstmord',
            text: textContent([css(timelineText('hugo'), 'Hr. Montague'), ' begeht Selbstmord ☠️']),
          }, // falsch
          {
            id: 'phoebe-selbstmord',
            text: textContent([css(timelineText('phoebe'), 'Phoebe'), ' begeht Selbstmord ☠️']),
          }, // falsch
          {
            id: 'justin-enderdrache',
            text: textContent([css(timelineText('justin'), 'Justin'), ' besiegt den Enderdrachen in Minecraft 🎮']),
          } // falsch
        ].sort(() => Math.random() - 0.5),
        points: 2,
        deductPoints: 1,
        multiple: true,
        solutionPairs: [
          {
            a: '0700-0800',
            b: ['streit-phoebe-phineas'],
          },
          {
            a: '1115',
            b: ['ivy-liebesgestaendnis', 'phineas-lehnt-ab'],
          },
          {
            a: '1300-1326',
            b: ['ivy-klaut-liebesritual', 'ivy-klaut-dolch-hugo'],
          },
          {
            a: '1326-1328',
            b: ['ivy-selbstmord', 'ivy-liebesritual'],
          },
          {
            a: '1343-1345',
            b: ['justin-phineas-streit', 'cassandra-notruf'],
          },
          {
            a: '1400-1430',
            b: ['hugo-holzfällerhütte', 'hugo-sieht-notarzt', 'phineas-krankenhaus', 'hugo-entdeckt-ivy', 'hugo-bringt-ivy-zurueck'],
          },
          {
            a: '1430',
            b: ['cassandra-besuch'],
          },
          {
            a: '1500-1600',
            b: ['hugo-kommt-an-1', 'hugo-kommt-an-2', 'hugo-cello-koffer'],
          },
          {
            a: '1638',
            b: ['hugo-besuch', 'phineas-betäubt', 'kissen-taeuschung', 'phineas-cello'],
          },
          {
            a: '1654',
            b: ['phoebe-besuch', 'phoebe-entschuldigt-sich'],
          },
          {
            a: '1700-1800',
            b: ['hugo-holzfällerhütte-cello', 'hugo-vergräbt-phineas', 'hugo-geht-zurueck'],
          },
          {
            a: '1900',
            b: ['hugo-notruf', 'hugo-kommt-an-1', 'hugo-kommt-an-2'],
          },
        ],
      }
    ]
  },

  // {
  //   title: 'Sonstiges',
  //   description: 'Sonstige Fragen',

  //   fields: [
  //     {
  //       id: 'illegales-hobby',
  //       type: 'entry',

  //       title: 'Was war Phineas\' illegales Hobby?',

  //       amount: 1,
        
  //       solutions: [
  //         {
  //           id: 'diary-dvd',
  //           points: 1
  //         },
  //         {
  //           id: 'phineas-dvd-fotos',
  //           points: 1
  //         }
  //       ]
  //     },
  //     {
  //       id: 'wann-phineas-schule',
  //       type: 'entry',

  //       title: 'Wann kam Phineas auf das Max-Planck-Gymnasium?',

  //       amount: 1,

  //       solutions: [
  //         {
  //           id: 'phineas-erster-schultag',
  //           points: 1
  //         }
  //       ]
  //     },
  //     {
  //       id: 'hugo-gefehlt',
  //       type: 'entry',

  //       title: 'Warum hat Hr. Montague eine Woche gefehlt?',

  //       amount: 1,

  //       solutions: [
  //         {
  //           id: 'hugo-elenas-tod',
  //           points: 2
  //         }
  //       ]
  //     },
  //     {
  //       id: 'wer-phineas-stalker',
  //       type: 'suspect',

  //       title: 'Wer hat Phineas gestalkt?',

  //       solutions: [
  //         {
  //           suspectId: 'cassandra',
  //           points: 1
  //         }
  //       ]
  //     },
  //     {
  //       id: 'justin-am-wichtigsten',
  //       type: 'choice',

  //       title: 'Was ist Justin am wichtigsten?',

  //       choices: [
  //         {
  //           id: 'babo',
  //           text: 'Zeigen, wer der Babo ist',
  //         },
  //         {
  //           id: 'minecraft',
  //           text: 'Seine Minecraft-Welt',
  //         },
  //         {
  //           id: 'mobben',
  //           text: 'Phineas mobben',
  //         },
  //         {
  //           id: 'chayas-klaeren',
  //           text: 'Chayas klären',
  //         }
  //       ],
  //       multiple: true,
  //       points: 1,
  //       solutionIds: ['babo', 'minecraft', 'mobben', 'chayas-klaeren'],
  //     },
  //     {
  //       id: 'phoebes-leistung',
  //       type: 'entry',

  //       title: 'Wie ist Phoebes Leistung in der Schule?',
  //       description: 'Gebe an, wie Phoebes Leistung in der Schule ist.',

  //       amount: 1,

  //       solutions: [
  //         {
  //           id: 'phoebe-top-a-student',
  //           points: 2
  //         }
  //       ]
  //     }
  //   ]
  // }
]

export function getFieldFromId (id: string) {
  return form.flatMap(f => f.fields).find(f => f.id === id)
}

function timelineText (suspect: string) {
  return {
    background: Color(getSuspectById(suspect)?.color ?? '').alpha(0.1).string(),
    'borderRadius': '.25rem',
    padding: '0 .2rem',
    margin: '0 -.2rem',
    color: getSuspectById(suspect)?.color ?? ''
  }
}