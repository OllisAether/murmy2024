import { JsonMap } from '../../../shared/json'
import { Game } from '../game'
import { CueHandle, CueHandleCtx, CueHandleNext } from './CueHandle'

export class OpenVote extends CueHandle {
  public start(next: CueHandleNext, ctx: CueHandleCtx<JsonMap>): void {
    const game = Game.get()
    const voteManager = game.voteManager

    const options = ctx.options

    const pool = ctx.getFieldValue(options.pool)

    if (!pool || typeof pool !== 'string') {
      console.error('[Cue: OpenVote] Invalid pool', pool)
      next()
      return
    }

    const title = ctx.getFieldValue(options.title)

    if (title !== undefined && typeof title !== 'string') {
      console.error('[Cue: OpenVote] Invalid title', title)
      next()
      return
    }

    voteManager.openVote({
      pool,
      title
    })

    next()
  }
  public stop(): void {}
}

export class CloseVote extends CueHandle {
  public start(next: CueHandleNext): void {
    const game = Game.get()
    const voteManager = game.voteManager

    voteManager.closeVote()

    next()
  }
  public stop(): void {}
}

export class AddVoteOptions extends CueHandle {
  public start(next: CueHandleNext, ctx: CueHandleCtx<JsonMap>): void {
    const game = Game.get()
    const voteManager = game.voteManager

    const option = ctx.options

    const options = ctx.getFieldValue(option.options) as Record<string, string[]> | undefined

    if (!options) {
      console.error('[Cue: AddVoteOption] Invalid options', options)
      next()
      return
    }

    Object.keys(options).forEach((pool) => {
      const opts = options[pool]

      if (!opts || !Array.isArray(opts) || opts.some(opt => typeof opt !== 'string')) {
        console.error('[Cue: AddVoteOption] Invalid options', options)
        return
      }

      voteManager.addOptionsToPool(pool, opts)
    })

    next()
  }
  public stop(): void {}
}

export class RemoveVoteOption extends CueHandle {
  public start(next: CueHandleNext, ctx: CueHandleCtx<JsonMap>): void {
    const game = Game.get()
    const voteManager = game.voteManager

    const options = ctx.options
    const pool = ctx.getFieldValue(options.pool)
    const option = ctx.getFieldValue(options.option)

    if (!pool || typeof pool !== 'string') {
      console.error('[Cue: RemoveVoteOption] Invalid pool', pool)
      next()
      return
    }

    if (!option || typeof option !== 'string') {
      console.error('[Cue: RemoveVoteOption] Invalid option', option)
      next()
      return
    }

    voteManager.removeOptionFromPool(pool, option)

    next()
  }
  public stop(): void {}
}

export class ClearVotePool extends CueHandle {
  public start(next: CueHandleNext, ctx: CueHandleCtx<JsonMap>): void {
    const game = Game.get()
    const voteManager = game.voteManager

    const options = ctx.options

    const pool = ctx.getFieldValue(options.pool)

    if (!pool || typeof pool !== 'string') {
      console.error('[Cue: ClearVotePool] Invalid pool', pool)
      next()
      return
    }

    voteManager.clearPool(pool)

    next()
  }
  public stop(): void {}
}

export class StartTiebreaker extends CueHandle {
  public start(next: CueHandleNext): void {
    const game = Game.get()
    const voteManager = game.voteManager

    voteManager.startTiebreaker()

    next()
  }
  public stop(): void {}
}

export class SetRandomWinner extends CueHandle {
  public start(next: CueHandleNext): void {
    const game = Game.get()
    const voteManager = game.voteManager

    voteManager.setRandom()

    next()
  }
  public stop(): void {}
}

export class EndVote extends CueHandle {
  public start(next: CueHandleNext): void {
    const game = Game.get()
    const voteManager = game.voteManager

    voteManager.endVote()

    next()
  }
  public stop(): void {}
}

export class PauseVote extends CueHandle {
  public start(next: CueHandleNext): void {
    const game = Game.get()
    const voteManager = game.voteManager

    voteManager.pauseVote()

    next()
  }
  public stop(): void {}
}

export class ResumeVote extends CueHandle {
  public start(next: CueHandleNext): void {
    const game = Game.get()
    const voteManager = game.voteManager

    voteManager.resumeVote()

    next()
  }
  public stop(): void {}
}

export class WaitForVote extends CueHandle {
  off: (() => void) | null = null

  public start(next: CueHandleNext): void {
    const game = Game.get()
    const voteManager = game.voteManager

    const offTimer = game.getTimer().onceFinished(() => {
      next()
      this.off?.()
    })
    const offVote = voteManager.onceAllVotesReceived(() => {
      next()
      this.off?.()
    })

    this.off = () => {
      offTimer()
      offVote()
    }
  }
  public stop(): void {
    this.off?.()
    
    const game = Game.get()
    const voteManager = game.voteManager

    voteManager.closeVote()

    game.getTimer().stop()
  }
}