import { CueJson, CueType, VoteOptions } from "../../../shared/cue"
import { Phase } from "../../../shared/phase"
import { Game } from "../game";
import { Cue, CueNext, CueObject, CueRecord } from "./cue";

export class VoteCue extends Cue {
  type = CueType.Vote

  constructor (
    private voteOptions: VoteOptions,
    private duration?: number,
    private tieBreakerDuration?: number
  ) {
    super();
  }

  private resultNext (media: string): CueNext {
    return () => ({
      id: 'media',
      phase: Phase.Media,
      options: {
        media
      }
    })
  }

  private createNext (voteCount: number): CueNext {
    const game = Game.get()

    return () => {
      const results = game.getResults()

      if (!results) {
        console.error('[VoteCue] No results found')
        return
      }

      if (results.winners.length === 0) {
        console.error('[VoteCue] No winners found')
        return
      }

      if (voteCount < 3 && results.winners.length > 1) {
        // Tiebreaker
        return {
          id: `tiebreaker-${voteCount}`,
          phase: Phase.Vote,
          duration: this.tieBreakerDuration ?? 10000,
          delay: 2000,
          meta: {
            tiebreaker: true
          },
          options: {
            vote: results.winners.map(winner => ({
              media: winner.media,
              unlockClues: winner.unlockClues
            }))
          },
          next: this.createNext(voteCount + 1)
        }
      } else if (results.winners.length === 1) {
        // Winner
        return {
          id: 'result',
          phase: Phase.VoteResult,
          duration: 2000,
          options: {
            voteResult: game.winners[0]
          },
          next: this.resultNext(game.winners[0])
        }
      } else {
        game.setRandomWinner()

        return {
          id: 'random',
          phase: Phase.VoteResult,
          duration: 3000,
          options: {
            voteResult: game.winners[0]
          },
          next: this.resultNext(game.winners[0])
        }
      }
    }
  }

  public init (): CueObject {
    return {
      record: {
        id: 'vote',
        phase: Phase.Vote,
        duration: this.duration ?? 30000,
        options: {
          vote: this.voteOptions
        },
        next: this.createNext(0)
      }
    }
  }

  public getRecordNextFnById (id: string): void | CueNext {
    switch (id) {
      case 'vote':
        return this.init().record.next
      case 'tiebreaker-0':
      case 'tiebreaker-1':
      case 'tiebreaker-2':
        const voteCount = parseInt(id.split('-')[1])
        return this.createNext(voteCount)
      case 'result':
      case 'random':
        return this.resultNext(Game.get().winners[0])
      default:
        return undefined
    }
  }

  public toJSON (): CueJson {
    return {
      type: this.type,
      vote: {
        voteOptions: this.voteOptions,
        tieBreakerDuration: this.tieBreakerDuration ?? 10000
      },
      unlockClues: this.unlockClues,
      duration: this.duration,
    }
  }
}