import { Game } from "../game"
import { CueHandle, CueHandleNext } from "./CueHandle"

export class WaitForTimer extends CueHandle {
  off: (() => void) | null = null

  start(next: CueHandleNext): void {
    const game = Game.get()
    const timer = game.getTimer()

    this.off = timer.onceFinished(next)
  }
  stop () {
    const game = Game.get()
    const timer = game.getTimer()

    timer.stop()

    this.off?.()
  }
}