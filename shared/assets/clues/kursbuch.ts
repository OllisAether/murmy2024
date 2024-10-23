import { Clue } from "../../clue";

export const kursbuch: Clue<'book'> = {
  type: 'book',
  id: 'kursbuch',

  cost: 20,
  title: 'Kursbuch',
  thumbnailAssetId: 'clues/kursbuch/Kursbuch-01.webp',
  images: {
    assetIds: Array.from({ length: 22 }, (_, i) => `clues/kursbuch/Kursbuch-${(i + 1).toString().padStart(2, '0')}.webp`),
    entries: [
      {
        index: 1,
        rect: {
          x: 0.8438770967371324,
          y: 0.5311955122514205,
          width: 0.1340087890625,
          height: 0.02585110751065341,
        },
        entry: {
          id: 'justin-fehlzeiten',
          title: 'Fehlzeiten',
          description: 'Justin hat viele Fehlstunden, die er nicht entschuldigt hat.',
          suspectId: 'justin',
        }
      },
      {
        index: 2,
        rect: {
          x: 0.7931188246783089,
          y: 0.4136600008877841,
          width: 0.1067431640625,
          height: 0.025709062056107953,
        },
        entryId: 'justin-fehlzeiten',
      },
      {
        index: 2,
        rect: {
          x: 0.012916618795955882,
          y: 0.8763020463423296,
          width: 0.37132956112132354,
          height: 0.0788482666015625,
        },
        entry: {
          id: 'justin-problemschueler',
          title: 'Problemschüler',
          description: 'Justin ist ein Problemschüler und treibt öfters Unfug im Unterricht.',
          suspectId: 'justin',
        }
      },
      {
        index: 3,
        rect: {
          x: 0.7932291187959559,
          y: 0.2734291770241477,
          width: 0.1103461052389706,
          height: 0.027030084783380683,
        },
        entryId: 'justin-fehlzeiten',
      },
      {
        index: 3,
        rect: {
          x: 0.10116110409007353,
          y: 0.13142633611505683,
          width: 0.3524370978860294,
          height: 0.03184897682883523,
        },
        entry: {
          id: 'phineas-vorstellung',
          title: '03.12.2012 - Der erste Schultag',
          description: 'Phineas hatte am 03.12.2012 seinen ersten Schultag und stellte sich vor dem Geographie-Orientierungskurs vor.',
          suspectId: 'phineas',
        }
      },
      {
        index: 4,
        rect: {
          x: 0.7878752585018383,
          y: 0.13292136452414774,
          width: 0.1132321346507353,
          height: 0.026248834783380682,
        },
        entryId: 'justin-fehlzeiten',
      },
      {
        index: 4,
        rect: {
          x: 0.7880452952665441,
          y: 0.2725804554332386,
          width: 0.1664214728860294,
          height: 0.032580510919744315,
        },
        entryId: 'justin-fehlzeiten',
      },
      {
        index: 5,
        rect: {
          x: 0.10116110409007353,
          y: 0.13142633611505683,
          width: 0.7995694508272059,
          height: 0.2793454256924716,
        },
        entry: {
          id: 'beurlaubung',
          title: 'Beurlaubung vom 10.12. bis 14.12.2012',
          description: 'Herr Montague war vom 10.12. bis 14.12.2012 beurlaubt.',
          suspectId: 'hugo',
        }
      },
      {
        index: 6,
        rect: {
          x: 0.003109633501838235,
          y: 0.8648212224786932,
          width: 0.7740455537683823,
          height: 0.032580510919744315,
        },
        entryId: 'justin-problemschueler',
      },
      {
        index: 6,
        rect: {
          x: 0.7878752585018383,
          y: 0.13292136452414774,
          width: 0.1132321346507353,
          height: 0.026248834783380682,
        },
        entryId: 'justin-fehlzeiten',
      },
      {
        index: 7,
        rect: {
          x: 0.7878752585018383,
          y: 0.13292136452414774,
          width: 0.1132321346507353,
          height: 0.026248834783380682,
        },
        entryId: 'justin-fehlzeiten',
      },
      {
        index: 8,
        rect: {
          x: 0.7878752585018383,
          y: 0.13292136452414774,
          width: 0.1132321346507353,
          height: 0.026248834783380682,
        },
        entryId: 'justin-fehlzeiten',
      },
      {
        index: 9,
        rect: {
          x: 0.7947456629136029,
          y: 0.2731273304332386,
          width: 0.10106301700367647,
          height: 0.03063803932883523,
        },
        entryId: 'justin-fehlzeiten',
      },
      {
        index: 9,
        rect: {
          x: 0.008578383501838236,
          y: 0.8696933815696023,
          width: 0.9708745978860294,
          height: 0.04988519841974432,
        },
        entryId: 'justin-problemschueler',
      },
      {
        index: 10,
        rect: {
          x: 0.7878752585018383,
          y: 0.13292136452414774,
          width: 0.1132321346507353,
          height: 0.026248834783380682,
        },
        entryId: 'justin-fehlzeiten',
      },
      {
        index: 10,
        rect: {
          x: 0.7947456629136029,
          y: 0.2731273304332386,
          width: 0.10106301700367647,
          height: 0.03063803932883523,
        },
        entryId: 'justin-fehlzeiten',
      },
      {
        index: 10,
        rect: {
          x: 0.008578383501838236,
          y: 0.8696933815696023,
          width: 0.5055841423483456,
          height: 0.04988519841974432,
        },
        entryId: 'justin-problemschueler',
      },
      {
        index: 11,
        rect: {
          x: 0.7878752585018383,
          y: 0.13292136452414774,
          width: 0.1132321346507353,
          height: 0.026248834783380682,
        },
        entryId: 'justin-fehlzeiten',
      },
    ]
  },
}