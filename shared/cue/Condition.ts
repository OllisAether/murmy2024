import { JsonContent, JsonMap } from '../json'
import { FieldReference } from './FieldRefrence'

export const modifierFunctions = {
  'not': (value: JsonContent): JsonContent => !value,
  'truthy': (value: JsonContent): JsonContent => !!value,
}

export const operatorFunctions = {
  '==': (left: JsonContent, right: JsonContent): JsonContent => left === right,
  '!=': (left: JsonContent, right: JsonContent): JsonContent => left !== right,
  '>': (left: JsonContent, right: JsonContent): JsonContent => {
    if (nullOrUndefined(left) || nullOrUndefined(right)) {
      return false
    }

    return left! > right!
  },
  '<': (left: JsonContent, right: JsonContent): JsonContent => {
    if (nullOrUndefined(left) || nullOrUndefined(right)) {
      return false
    }

    return left! < right!
  },
  '>=': (left: JsonContent, right: JsonContent): JsonContent => {
    if (nullOrUndefined(left) || nullOrUndefined(right)) {
      return false
    }

    return left! >= right!
  },
  '<=': (left: JsonContent, right: JsonContent): JsonContent => {
    if (nullOrUndefined(left) || nullOrUndefined(right)) {
      return false
    }

    return left! <= right!
  },
  'and': (left: JsonContent, right: JsonContent): JsonContent => left && right,
  'or': (left: JsonContent, right: JsonContent): JsonContent => left || right,
}

function nullOrUndefined(value: JsonContent): boolean {
  return value === undefined || value === null
}

export interface Condition extends JsonMap {
  $condition: [ConditionOrValue, Operator, ConditionOrValue]
}

export function condition (left: ConditionOrValue, operator: Operator, right: ConditionOrValue): Condition {
  return { $condition: [left, operator, right] }
}
export function mod(modifier: Modifier, value: ConditionOrValue): ModifiedConditionOrValue {
  return { $modifier: modifier, $value: value }
}

export interface ModifiedConditionOrValue extends JsonMap {
  $modifier: Modifier
  $value: ConditionOrValue
}

export type ConditionOrValue = Condition | ModifiedConditionOrValue | FieldReference | number | string | boolean

export type ModifierFunction = (value: JsonContent) => JsonContent
export type Modifier = keyof typeof modifierFunctions

export type OperatorFunction = (left: JsonContent, right: JsonContent) => JsonContent
export type Operator = keyof typeof operatorFunctions
