import { TextContent } from "./textContent"

export type Form = FormPage[]

export interface FormPage {
  title: TextContent | string
  description?: TextContent | string
  fields: FormField[]
}

export type FormFieldType =
  'entry' | 'choice' | 'order' | 'suspect' | 'connect' | 'assign'

export type FormField = FormFieldEntry | FormFieldChoice | FormFieldOrder | FormFieldSuspect | FormFieldConnect | FormFieldAssign
export type FormFieldValue = FormFieldEntryValue | FormFieldChoiceValue | FormFieldOrderValue | FormFieldSuspectValue | FormFieldConnectValue | FormFieldAssignValue

export interface FormFieldBase {
  id: string
  type: FormFieldType
  title: TextContent | string
  description?: TextContent | string
}

export interface FormFieldEntry extends FormFieldBase {
  type: 'entry'
  amount?: number
  morePossible?: {
    max: number
    points: number
  } | false
  solutions: {
    id: string
    points: number
  }[]
  deductPoints?: number
}
export type FormFieldEntryValue = string[]

export interface FormFieldChoice extends FormFieldBase {
  type: 'choice'
  multiple?: {
    max: number
  } | boolean
  choices: {
    id: string
    text: TextContent | string
  }[]
  solutionIds: FormFieldChoiceValue
  points: number
  deductPoints?: number
}
export type FormFieldChoiceValue = string[]

export interface FormFieldOrder extends FormFieldBase {
  type: 'order'
  choices: {
    id: string
    text: TextContent | string
  }[]
  solutionOrder: FormFieldOrderValue
  points: number
}
export type FormFieldOrderValue = string[]

export interface FormFieldConnect extends FormFieldBase {
  type: 'connect'
  choicesA: {
    id: string
    text: TextContent | string
  }[]
  choicesB: {
    id: string
    text: TextContent | string
  }[]
  solutionPairs: FormFieldConnectValue
  points: number
}
export type FormFieldConnectValue = {
  a: string
  b: string
}[]

export interface FormFieldAssign extends FormFieldBase {
  type: 'assign'
  multiple?: boolean
  choicesA: {
    id: string
    text: TextContent | string
  }[]
  choicesB: {
    id: string
    text: TextContent | string
  }[]
  solutionPairs: FormFieldAssignValue
  points: number
  deductPoints?: number
}
export type FormFieldAssignValue = {
  a: string
  b: string[]
}[]

export interface FormFieldSuspect extends FormFieldBase {
  type: 'suspect'
  solutions: {
    suspectId: string
    points: number
  }[]
}
export type FormFieldSuspectValue = string

export function getMaxPoints (field: FormField): number {
  switch (field.type) {
    case 'entry':
      if (field.amount) {
        let points = field.solutions
          .map(s => s.points).sort((a, b) => b - a)
          .slice(0, field.amount)
          .reduce((acc, points) => acc + points, 0)

        if (field.morePossible) {
          points += (field.morePossible.max - field.amount) * field.morePossible.points
        }

        return points
      }

      return field.solutions.reduce((acc, solution) => acc + solution.points, 0)
    case 'choice':
      if (field.multiple === true) {
        return field.solutionIds.length * field.points
      }
      
      if (field.multiple) {
        return field.multiple.max * field.points
      }

      return field.points
    case 'order':
      return (field.solutionOrder.length - 1) * field.points
    case 'connect':
      return field.choicesA.length * field.points
    case 'assign':
      return field.solutionPairs
        .reduce((acc, pair) => [...acc, ...pair.b], [] as string[])
        .filter((v, i, a) => a.indexOf(v) === i).length * field.points
    case 'suspect':
      return field.solutions.map(s => s.points).sort((a, b) => b - a)[0]
  }
}

export function getPoints (field: FormField, _value: FormFieldValue): number {
  let points = 0
  switch (field.type) {
    case 'entry':
      var entryValue = _value as FormFieldEntryValue
      
      let amount = field.amount ?? entryValue.length
      let sortedPoints = entryValue
        .map(e => field.solutions.find(s => s.id === e)?.points || 0)
        .sort((a, b) => b - a)

      points = sortedPoints.slice(0, amount)
        .reduce((acc, points) => acc + points, 0)

      if (field.morePossible) {
        points += Math.min(sortedPoints.filter(p => p).length - amount,
          field.morePossible.max - amount) * field.morePossible.points

        if (field.deductPoints) {
          points -= field.deductPoints * sortedPoints.slice(0, field.morePossible.max).filter(p => !p).length
        }
      }

      return Math.max(0, points)
    case 'choice':
      var choiceValue = (_value as FormFieldChoiceValue).sort((a, b) => {
        if (field.solutionIds.includes(a) && !field.solutionIds.includes(b)) return -1
        return 1
      })

      if (field.multiple === true) {
        points = field.solutionIds.filter(id => choiceValue.includes(id)).length * field.points

        if (field.deductPoints) {
          points -= field.deductPoints * choiceValue.filter(id => !field.solutionIds.includes(id)).length
        }

        return Math.max(0, points)
      }

      if (field.multiple) {
        choiceValue = choiceValue.slice(0, field.multiple.max)

        let points = field.solutionIds.filter(id => choiceValue.includes(id)).length * field.points

        if (field.deductPoints) {
          points -= field.deductPoints * choiceValue.filter(id => !field.solutionIds.includes(id)).length
        }

        return Math.max(0, points)
      }

      if (!choiceValue[0])
        return 0

      if (field.solutionIds.includes(choiceValue[0]))
        return field.points

      return 0
    case 'order':
      var orderValue = _value as FormFieldOrderValue

      for (let i = 1; i < orderValue.length; i++) {
        let cur = orderValue[i]
        let prev = orderValue[i - 1]

        if (field.solutionOrder.indexOf(cur) < field.solutionOrder.indexOf(prev)) {
          points += field.points
        }
      }

      return points
    case 'connect':
      var connectValue = _value as FormFieldConnectValue

      connectValue.forEach(pair => {
        if (field.solutionPairs.find(p => p.a === pair.a && p.b === pair.b)) {
          points += field.points
        }
      })

      return points
    case 'assign':
      var assignValue = _value as FormFieldAssignValue

      assignValue.forEach(pair => {
        const a = pair.a

        pair.b.forEach(b => {
          if (field.solutionPairs.find(p => p.a === a && p.b.includes(b))) {
            points += field.points
          } else {
            points -= field.deductPoints ?? 0
          }
        })
      })

      return Math.max(0, points)
    case 'suspect':
      var suspectValue = _value as FormFieldSuspectValue

      return field.solutions.find(s => s.suspectId === suspectValue)?.points ?? 0
  }
}