import { JsonMap } from '../../../shared/json'
import { colorize, Fg } from '../../console'
import { Game } from '../game'
import { CueHandle, CueHandleCtx, CueHandleNext } from './CueHandle'

export class OpenVote extends CueHandle {
  public start(next: CueHandleNext, ctx: CueHandleCtx<{
    pool?: string,
    title?: string,
    autoClose?: boolean
  }>): void {
    const game = Game.get()
    const voteManager = game.voteManager

    const options = ctx.options

    const pool = ctx.getFieldValue(options.pool)

    if (!pool || typeof pool !== 'string') {
      console.error(colorize('[Cue: OpenVote]', Fg.Magenta), 'Invalid pool', pool)
      next()
      return
    }

    const title = ctx.getFieldValue(options.title) as string | null | undefined

    if ((title ?? null) !== null && typeof title !== 'string') {
      console.error(colorize('[Cue: OpenVote]', Fg.Magenta), 'Invalid title', title)
      next()
      return
    }

    const autoClose = ctx.getFieldValue(options.autoClose) as boolean | undefined

    if (autoClose && typeof autoClose !== 'boolean') {
      console.error(colorize('[Cue: OpenVote]', Fg.Magenta), 'Invalid autoClose', autoClose)
      next()
      return
    }

    voteManager.openVote({
      pool,
      title: title ?? undefined,
      autoClose: autoClose ?? true
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
      console.error(colorize('[Cue: AddVoteOption]', Fg.Magenta), 'Invalid options', options)
      next()
      return
    }

    Object.keys(options).forEach((pool) => {
      const opts = options[pool]

      if (!opts || !Array.isArray(opts) || opts.some(opt => typeof opt !== 'string')) {
        console.error(colorize('[Cue: AddVoteOption]', Fg.Magenta), 'Invalid options', options)
        return
      }

      const filtered = opts.filter((opt) => {
        const option = voteManager.getVoteOptions().find(o => o.id === opt)

        if (!option) {
          return false
        }

        const media = option.media

        if (!media) {
          return true
        }

        return !game.getWatchedMedia().includes(media)
      })

      voteManager.addOptionsToPool(pool, filtered)
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
      console.error(colorize('[Cue: RemoveVoteOption]', Fg.Magenta), 'Invalid pool', pool)
      next()
      return
    }

    if (!option || typeof option !== 'string') {
      console.error(colorize('[Cue: RemoveVoteOption]', Fg.Magenta), 'Invalid option', option)
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
      console.error(colorize('[Cue: ClearVotePool]', Fg.Magenta), 'Invalid pool', pool)
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

    console.log(colorize('[Cue: WaitForVote]', Fg.Magenta), 'Start')

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