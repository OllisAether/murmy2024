import { JsonMap } from "../../../shared/json";
import { colorize, Fg } from "../../console";
import { Game } from "../game";
import { CueHandle, CueHandleCtx, CueHandleNext } from "./CueHandle";

export class CalculateResults extends CueHandle {
  public start(next: CueHandleNext, ctx: CueHandleCtx<JsonMap>): void {
    Game.get().formManager.calculateResults()
    next()
  }
  public stop(): void {}
}

export class ClearAllForms extends CueHandle {
  public start(next: CueHandleNext, ctx: CueHandleCtx<JsonMap>): void {
    Game.get().formManager.clearAllForms()
    next()
  }
  public stop(): void {}
}

export class WaitForAllFormsSubmitted extends CueHandle {
  off: (() => void) | null = null

  public start(next: CueHandleNext): void {
    const game = Game.get()
    const formManager = game.formManager

    if (formManager.getAllFormsSubmitted()) {
      next()
      return
    }

    const offTimer = game.getTimer().onceFinished(() => {
      next()
      this.off?.()
    })
    const offAllFormsSubmitted = formManager.onceAllFormsSubmitted(() => {
      next()
      this.off?.()
    })

    console.log(colorize('[Cue: WaitForAllFormsSubmitted]', Fg.Magenta), 'Start')

    this.off = () => {
      offTimer()
      offAllFormsSubmitted()
    }
  }
  public stop(): void {
    this.off?.()

    const game = Game.get()

    game.getTimer().stop()
  }
}