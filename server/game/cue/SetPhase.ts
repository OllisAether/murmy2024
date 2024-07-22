import { Phase } from "../../../shared/phase"
import { Game } from "../game"
import { CueHandle, CueHandleCtx, CueHandleNext } from "./CueHandle"

export class SetPhase extends CueHandle {
  public start(next: CueHandleNext, ctx: CueHandleCtx<{
    phase: Phase
  }>): void {
    const game = Game.get()
    const phase = ctx.options.phase as Phase

    game.setPhase(phase)
    next()
  }
  public stop(): void {}
}