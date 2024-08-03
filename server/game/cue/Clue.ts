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

export class AddClues extends CueHandle {
  public start(next: CueHandleNext, ctx: CueHandleCtx<{
    clues?: string[]
  }>): void {
    const game = Game.get()
    
    const availableClues = ctx.getFieldValue(ctx.options.clues) as string[]

    console.log(`[AddClues] Adding clues`, availableClues)

    if (!Array.isArray(availableClues) || availableClues.some(clueId => typeof clueId !== 'string')) {
      console.error('[AddClues] ClueIds is not an array')
      next()
      return
    }

    game.clueManager.addClues(availableClues)
    next()
  }
  public stop(): void {}
}