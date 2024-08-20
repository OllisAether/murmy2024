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
    matterId: string
    points: number
  }[]
}

export interface FormFieldChoice extends FormFieldBase {
  type: 'choice'
  multiple?: {
    max: number
  } | boolean
  choices: {
    id: string
    text: TextContent | string
  }[]
  solutionIds: string[]
  points: number
}

export interface FormFieldOrder extends FormFieldBase {
  type: 'order'
  choices: {
    id: string
    text: TextContent | string
  }[]
  solutionOrder: string[]
  points: number
}

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
  solutionPairs: {
    a: string
    b: string
  }[]
  points: number
}

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
  solutionPairs: {
    a: string
    b: string[]
  }[]
  points: number
}

export interface FormFieldSuspect extends FormFieldBase {
  type: 'suspect'
  solutions: {
    suspectId: string
    points: number
  }[]
}