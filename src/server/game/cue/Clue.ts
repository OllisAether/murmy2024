import { Votes } from '../../../shared/vote'
import { Game } from '../game'
import { CueHandle, CueHandleCtx, CueHandleNext } from './CueHandle'

export class AddInvestigationCoins extends CueHandle {
  public start(next: CueHandleNext, ctx: CueHandleCtx<{
    amount?: number
  }>): void {
    const game = Game.get()

    const amount = ctx.getFieldValue(ctx.options.amount) as number

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

    if (!Array.isArray(availableClues) || availableClues.some(clueId => typeof clueId !== 'string')) {
      console.warn('[Cue: AddClues] ClueIds is not an array')
      next()
      return
    }

    game.clueManager.addClues(availableClues)
    next()
  }
  public stop(): void {}
}

export class ClearNewClues extends CueHandle {
  public start(next: CueHandleNext): void {
    const game = Game.get()

    game.clueManager.clearNewAvailableClues()
    next()
  }
  public stop(): void {}
}

export class UnlockClueForAll extends CueHandle {
  public start(next: CueHandleNext, ctx: CueHandleCtx<{
    clueId?: string
  }>): void {
    const game = Game.get()

    const clueId = ctx.getFieldValue(ctx.options.clueId) as string

    game.clueManager.unlockClueForAll(clueId)
    next()
  }
  public stop(): void {}
}

export class MarkEntryForAll extends CueHandle {
  public start(next: CueHandleNext, ctx: CueHandleCtx<{
    entryId?: string
  }>): void {
    const game = Game.get()

    const entryId = ctx.getFieldValue(ctx.options.entryId) as string

    game.suspectDatabaseManager.addEntryForAll(entryId)
    next()
  }
  public stop(): void {}
}

export class AssignMainClueType extends CueHandle {
  public start(next: CueHandleNext, ctx: CueHandleCtx<{
    votes: Votes
  }>): void {
    const game = Game.get()

    const votes = ctx.getFieldValue(ctx.options.votes) as Votes

    game.clueManager.assignMainClueTypeFromVote(votes)
    next()
  }
  public stop(): void {}
}

export class AssignMainClueTypeRandomly extends CueHandle {
  public start(next: CueHandleNext): void {
    const game = Game.get()

    game.clueManager.assignRandomMainClueType()
    next()
  }
  public stop(): void {}
}

export class SetAssignFurtherMainClueTypesRandomly extends CueHandle {
  public start(next: CueHandleNext, ctx: CueHandleCtx<{
    value: boolean
  }>): void {
    const game = Game.get()

    const value = ctx.getFieldValue(ctx.options.value) as boolean

    game.clueManager.setAssignFurtherMainClueTypesRandomly(value)
    next()
  }
  public stop(): void {}
}