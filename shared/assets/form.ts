import { Form } from "../form";
import { gallery } from "./phone/gallery";

export const form: Form = [
  {
    title: 'Entries',
    description: 'Beschreibung',
    fields: [
      {
        id: '1',
        type: 'entry',
        title: 'Vandalismus?',
        description: 'Beschreibung',
        amount: 1,
        solutions: (gallery.map(g => g.entries?.[0].entry.id).filter(Boolean) as string[])
          .map(id => ({
            id: id,
            points: 2,
          })),
      },
      {
        id: '2',
        type: 'entry',
        title: 'Vandalismus 2?',
        amount: 2,
        morePossible: {
          max: 3,
          points: 1,
        },
        solutions: (gallery.map(g => g.entries?.[0].entry.id).filter(Boolean) as string[])
          .map(id => ({
            id: id,
            points: 2,
          })),
      },
    ],
  },
  {
    title: 'Choices',
    description: 'Beschreibung',
    fields: [
      {
        id: '3',
        type: 'choice',
        title: 'Multiple choice',
        multiple: true,
        choices: Array.from({ length: 4 }, (_, i) => ({
          id: String(i),
          text: `Choice ${i + 1}`,
        })),
        solutionIds: ['1', '2', '3'],
        points: 2,
      },
      {
        id: '3.5',
        type: 'choice',
        title: '2 choices',
        multiple: {
          max: 2,
        },
        choices: Array.from({ length: 4 }, (_, i) => ({
          id: String(i),
          text: `Choice ${i + 1}`,
        })),
        solutionIds: ['1', '2'],
        points: 3,
      },
      {
        id: '3.7',
        type: 'choice',
        title: 'Single choice',
        choices: Array.from({ length: 4 }, (_, i) => ({
          id: String(i),
          text: `Choice ${i + 1}`,
        })),
        solutionIds: ['1', '2'],
        points: 3,
      },
    ],
  },
  {
    title: 'Zuordnung',
    description: 'Beschreibung',
    fields: [
      {
        id: '4',
        type: 'order',
        title: 'Order',
        choices: [
          {
            id: '1',
            text: 'Choice 1',
          },
          {
            id: '2',
            text: 'Choice 2',
          },
        ],
        solutionOrder: ['2', '1'],
        points: 4,
      },
      {
        id: '4.5',
        type: 'connect',
        title: 'Connect',
        choicesA: [
          {
            id: '1',
            text: 'Choice 1',
          },
          {
            id: '2',
            text: 'Choice 2',
          },
        ],
        choicesB: [
          {
            id: '1',
            text: 'Choice 1',
          },
          {
            id: '2',
            text: 'Choice 2',
          },
          {
            id: '3',
            text: 'Choice 3',
          },
        ],
        solutionPairs: [
          { a: '1', b: '2' },
          { a: '2', b: '1' },
        ],
        points: 4,
      },
      {
        id: '4.7',
        type: 'assign',
        title: 'Assign',
        multiple: true,
        choicesA: Array.from({ length: 10 }, (_, i) => ({
          id: `a${i}`,
          text: `${i + 10}:00 - ${i + 11}:00`,
        })),
        choicesB: Array.from({ length: 10 }, (_, i) => ({
          id: `b${i}`,
          text: `Choice ${i + 1}`,
        })),
        solutionPairs: Array.from({ length: 10 }, (_, i) => ({
          a: `a${i}`,
          b: [`b${i}`],
        })),
        points: 1,
      }
    ],
  },
  {
    title: 'Suspects',
    description: 'Beschreibung',
    fields: [
      {
        id: '5',
        type: 'suspect',
        title: 'Suspect',
        solutions: [
          {
            suspectId: 'lumine',
            points: 5,
          },
          {
            suspectId: 'carpentier',
            points: 6,
          },
        ],
      }
    ],
  }
]

export function getFieldFromId (id: string) {
  return form.flatMap(f => f.fields).find(f => f.id === id)
}