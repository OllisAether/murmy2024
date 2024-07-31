import { JsonContent, JsonMap } from "../../../shared/json";
import { CueHandle, CueHandleCtx, CueHandleNext } from "./CueHandle";
import { FieldReference } from "../../../shared/cue/FieldRefrence";
import { Condition, ConditionOrValue, ModifiedConditionOrValue, modifierFunctions, operatorFunctions } from "../../../shared/cue/Condition";
import { CueType } from "../../../shared/cue/CueTypes";

export function evaluateCondition(ctx: CueHandleCtx<{
  condition: ConditionOrValue
}>, condition: ConditionOrValue): JsonContent {
  function getValue(ctx: CueHandleCtx<{
    condition: ConditionOrValue
  }>, value: ConditionOrValue): JsonContent {
    // FieldReference
    if ((value as FieldReference).$ref) {
      return ctx.getFieldValue(value as FieldReference)

    // Condition
    } else if ((value as Condition).$condition) {
      return evaluateCondition(ctx, value as Condition)

    // ModifiedConditionOrValue
    } else if ((value as ModifiedConditionOrValue).$modifier) {
      const modifiedValue = value as ModifiedConditionOrValue
      const _value = evaluateCondition(ctx, modifiedValue.$value)

      return modifierFunctions[modifiedValue.$modifier](_value)

    // Value
    } else {
      return value as JsonContent
    }
  }
  
  if ((condition as Condition).$condition) {
    const _condition = condition as Condition
    const left = getValue(ctx, _condition.$condition[0])
    const right = getValue(ctx, _condition.$condition[2])

    return operatorFunctions[_condition.$condition[1]](left, right)
  } else if ((condition as ModifiedConditionOrValue).$modifier) {
    const modifiedValue = condition as ModifiedConditionOrValue
    const value = getValue(ctx, modifiedValue.$value)

    return modifierFunctions[modifiedValue.$modifier](value)
  } else {
    return getValue(ctx, condition)
  }
}

export class If extends CueHandle {
  public start(next: CueHandleNext, ctx: CueHandleCtx<{
    condition: ConditionOrValue
  }>): void {
    const options = ctx.options

    const condition = options.condition as ConditionOrValue

    const evaluatedValue = evaluateCondition(ctx, condition)
    console.log('[Cue: If] Evaluated value', evaluatedValue)

    if (evaluatedValue) {
      next()
    } else {
      // Find the next ElseIf or Else or EndIf
      let ignore = 0
      for (let i = ctx.index + 1; i < ctx.playback.cues.length; i++) {
        const cue = ctx.playback.cues[i]

        if (cue.type === CueType.If) {
          ignore++
        }

        if (cue.type === CueType.ElseIf || cue.type ===  CueType.Else || cue.type === CueType.EndIf) {
          if (ignore === 0) {
            console.log('[Cue: If] Found ElseIf or Else or EndIf', cue)

            next(i, {
              dontSkip: true
            })
            return
          }

          if (cue.type === CueType.EndIf) {
            ignore--
          }
        }
      }

      // No ElseIf or Else or EndIf found
      console.error('[Cue: If] No ElseIf or Else or EndIf found')
      next()
    }
  }
  stop(): void {}
}

export class ElseIf extends If {
  public start(next: CueHandleNext, ctx: CueHandleCtx<{
    condition: ConditionOrValue
  }>): void {
    const options = ctx.options

    const condition = options.condition as ConditionOrValue

    if (ctx.meta.dontSkip) {
      if (evaluateCondition(ctx, condition)) {
        next()
        return
      }
    }

    // Find the next ElseIf or Else or EndIf
    let ignore = 0
    for (let i = ctx.index + 1; i < ctx.playback.cues.length; i++) {
      const cue = ctx.playback.cues[i]

      if (cue.type === CueType.If) {
        ignore++
      }

      if (cue.type === CueType.ElseIf || cue.type === CueType.Else || cue.type === CueType.EndIf) {
        if (ignore === 0) {
          next(i, {
            dontSkip: true
          })
          return
        }

        if (cue.type === CueType.EndIf) {
          ignore--
        }
      }
    }
  }
  stop(): void {}
}

export class Else extends CueHandle {
  public start(next: CueHandleNext, ctx: CueHandleCtx<JsonMap>): void {
    if (ctx.meta.dontSkip) {
      next()
      return
    }

    // Find the next ElseIf or Else or EndIf
    let ignore = 0
    for (let i = ctx.index + 1; i < ctx.playback.cues.length; i++) {
      const cue = ctx.playback.cues[i]

      if (cue.type === CueType.If) {
        ignore++
      }

      if (cue.type === CueType.ElseIf || cue.type === CueType.Else || cue.type === CueType.EndIf) {
        if (ignore === 0) {
          next(i, {
            dontSkip: true
          })
          return
        }

        if (cue.type === CueType.EndIf) {
          ignore--
        }
      }
    }
  }
  stop(): void {}
}

export class EndIf extends CueHandle {
  public start(next: CueHandleNext): void {
    next()
  }
  stop(): void {}
}

export class Break extends CueHandle {
  public start(next: CueHandleNext, ctx: CueHandleCtx<{}>): void {
    // Find the next EndIf
    let ignore = 0
    for (let i = ctx.index + 1; i < ctx.playback.cues.length; i++) {
      const cue = ctx.playback.cues[i]

      if (cue.type === CueType.If) {
        ignore++
      }

      if (cue.type === CueType.EndIf) {
        if (ignore === 0) {
          next(i)
          return
        }
        ignore--
      }
    }
  }
  stop(): void {}
}
