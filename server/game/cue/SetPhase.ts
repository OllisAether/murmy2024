import { JsonMap } from "../../../shared/json"
import { Phase } from "../../../shared/phase"
import { Game } from "../game"
import { CueHandle, CueHandleCtx, CueHandleNext } from "./CueHandle"

export class SetPhase extends CueHandle {
  public start(next: CueHandleNext, ctx: CueHandleCtx<{
    phase: Phase
    meta: JsonMap
  }>): void {
    const game = Game.get()
    const phase = ctx.getFieldValue(ctx.options.phase) as Phase
    const meta = ctx.getFieldValue(ctx.options.meta) as JsonMap

    game.setPhase(phase, meta)
    next()
  }
  public stop(): void {}
}