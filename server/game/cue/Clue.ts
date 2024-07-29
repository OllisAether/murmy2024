import { Game } from '../game'
import { CueHandle, CueHandleCtx, CueHandleNext } from './CueHandle'

export class AddInvestigationCoins extends CueHandle {
  public start(next: CueHandleNext, ctx: CueHandleCtx<{
    amount?: number
  }>): void {
    const game = Game.get()

    const amount = ctx.options.amount ?? 0

    game.clueManager.giveInvestigationCoins(amount)

    next()
  }
  public stop(): void {}
}

export class AddClue extends CueHandle {
  public start(next: CueHandleNext, ctx: CueHandleCtx<{
    clueId?: string
  }>): void {
    const game = Game.get()
    
    const clueId = ctx.options.clueId ?? ''

    game.clueManager.addClue(clueId)

    next()
  }
  public stop(): void {}
}