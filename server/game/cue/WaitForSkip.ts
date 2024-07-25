import { Game } from "../game";
import { CueHandle, CueHandleNext } from "./CueHandle";

export class WaitForSkip extends CueHandle {
  public start(): void {
    console.log('[WaitForSkip] Start')
  }
  public stop(): void {}
}

export class WaitForBoardSkip extends CueHandle {
  private off: (() => void) | null = null

  public start(next: CueHandleNext): void {
    console.log('[WaitForBoardSkip] Start')

    const game = Game.get()
    
    this.off = game.onceBoardSkip(() => {
      next()
    })
  }
  public stop(): void {
    this.off?.()
  }
}