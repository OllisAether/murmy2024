import { JsonContent } from "../../../shared/json"
import { Game } from "../game"
import { CueHandle, CueHandleCtx, CueHandleNext } from "./CueHandle"

export class StartTimer extends CueHandle {
  public start(next: CueHandleNext, ctx: CueHandleCtx<{
    duration: JsonContent
    delay: JsonContent
  }>): void {
    const options = ctx.options

    const game = Game.get()
    const timer = game.getTimer()

    const duration = ctx.getFieldValue(options.duration)

    if (
      !duration ||
      typeof duration !== 'number' ||
      duration <= 0
    ) {
      console.error('StartTimer: invalid duration', options.duration)
      next()
      return
    }

    let delay = ctx.getFieldValue(options.delay)

    if (
      !delay ||
      typeof delay !== 'number' ||
      delay < 0
    ) {
      delay = 0
    }

    timer.start(duration, delay)
    next()
  }
  stop(): void {
    
  }
}
