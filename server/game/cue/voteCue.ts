import { CueJson, CueType, VoteOption } from "../../../shared/cue"
import { Phase } from "../../../shared/phase"
import { Game } from "../game";
import { Cue, CueNext, CueObject, CueRecord } from "./cue";

export class VoteCue extends Cue {
  type = CueType.Vote

  constructor (
    private voteOptions: VoteOption[],
    private duration: number = 30000,
    private tieBreakerDuration: number = 10000,
  ) {
    super();
  }

  public init (): CueObject {
    return {
      next: (lastRecord) => {
        console.log('[VoteCue] Next', lastRecord)

        const game = Game.get()

        function result(winners: string[]): CueRecord {
          return {
            id: 'result',
            phase: Phase.VoteResult,
            duration: 2000,
            next: {
              id: 'media',
              phase: Phase.Media,
              options: {
                media: winners[0]
              }
            }
          }
        }

        function random(winners: string[]): CueRecord {
          game.setRandomWinner()

          return {
            id: 'random',
            phase: Phase.VoteResult,
            duration: 5000,
            meta: {
              random: winners
            }
          }
        }

        let winners: string[] = []
        switch (lastRecord?.id) {
          case 'vote':
            game.endVote()
            winners = game.getVoteResults()

            if (winners.length === 1) {
              return result(winners)
            } else if (winners.length > 1) {
              return {
                id: 'result',
                phase: Phase.VoteResult,
                duration: 3000,
                next: {
                  id: 'tiebreaker',
                  phase: Phase.Vote,
                  duration: this.tieBreakerDuration,
                  delay: 2000,
                  meta: {
                    tiebreaker: true
                  },
                  options: {
                    vote: winners.map(winner => ({
                      media: winner,
                      unlockFiles: this.unlockFiles
                    }))
                  }
                }
              }
            } else {
              return random(winners)
            }
          case 'tiebreaker':
            game.endVote()
            winners = game.getVoteResults()

            if (winners.length === 1) {
              return result(winners)
            } else {
              return random(winners)
            }
          case undefined:
            return {
              id: 'vote',
              phase: Phase.Vote,
              duration: this.duration,
              options: {
                vote: this.voteOptions
              }
            }
        }
      }
    }
  }

  public toJSON (): CueJson {
    return {
      type: this.type,
      vote: {
        options: this.voteOptions,
        tieBreakerDuration: this.tieBreakerDuration,
      },
      unlockFiles: this.unlockFiles,
      duration: this.duration,
    }
  }
}