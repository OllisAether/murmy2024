import { ConditionOrValue } from "../shared/cue/Condition";
import { JsonContent } from "../shared/json";

export function conditionToString (condition: ConditionOrValue | JsonContent): string {
  if ((condition as any).$condition) {
    const _condition = condition as any
    const left = conditionToString(_condition.$condition[0])
    const right = conditionToString(_condition.$condition[2])

    return `${left} ${_condition.$condition[1]} ${right}`
  } else if ((condition as any).$modifier) {
    const modifiedValue = condition as any
    const value = conditionToString(modifiedValue.$value)

    return `${modifiedValue.$modifier}(${value})`
  } else if ((condition as any).$ref) {
    return (condition as any).$ref
  }
  else {
    return JSON.stringify(condition)
  }
}