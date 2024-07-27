import { Role } from "../../shared/roles";
import { Entry } from "../../shared/suspectDatabase/entry";
import { Game } from "../game/game";
import { WebSocketClient, genericActions, handleActions } from "./client";
import WebSocket from 'ws';

export class TeamClient extends WebSocketClient {
  type: Role.Team = Role.Team;

  constructor (
    ws: WebSocket,
    id: string,
    public teamId: string,
    public teamName: string,
    userAgent?: string
  ) {
    super(ws, id, userAgent);

    const game = Game.get();

    ws.on('message', handleActions([
      ...genericActions(this),
      {
        action: 'help',
        handler: () => {
          const success = game.addHelpRequest(this.teamId);

          if (success) {
            this.send('help:response', {
              success: true
            });
          } else {
            this.send('help:response', {
              success: false,
              message: 'Hilfe ist bereits auf dem Weg'
            });
          }
        }
      },
      {
        action: 'vote',
        handler: (payload) => {
          const vote = payload.option;

          if (typeof vote !== 'string') {
            console.log('Invalid vote', vote)
            this.send('vote:response', {
              success: false,
              message: 'Invalid Format'
            })
            return
          }

          const success = game.voteManager.vote(this.teamId, vote)

          if (!success) {
            this.send('vote:response', {
              success: false,
              message: 'Invalid Vote'
            })
          }

          this.send('vote:response', {
            vote: vote,
            success: true
          })
        }
      },
      {
        action: 'suspectDatabaseEntry',
        handler: (payload) => {
          const game = Game.get();
          const entry: Entry = payload.entry;

          if (!entry || typeof entry !== 'object') {
            console.error('[TeamClient] Invalid entry', entry)
            this.send('suspectDatabaseEntry:response', {
              success: false,
              message: 'Invalid Format'
            })
            return
          }

          game.suspectDatabaseManager.addEntry(this.teamId, entry)

          this.send('suspectDatabaseEntry:response', {
            success: true
          })
        }
      },
      {
        action: 'getSuspectDatabase',
        handler: () => {
          const game = Game.get();
          game.sendSuspectDatabaseToTeams(this);
        }
      },
      {
        action: 'getClues',
        handler: () => {
          const game = Game.get();
          game.sendCluesToClients(this);
        }
      },
      {
        action: 'unlockClue',
        handler: (payload) => {
          const clueId = payload.clueId;

          if (typeof clueId !== 'string') {
            console.error('[TeamClient] Invalid clueId', clueId)
            this.send('unlockClue:response', {
              success: false,
              message: 'Invalid Format'
            })
            return
          }

          const success = game.clueManager.unlockClue(this.teamId, clueId)

          if (!success) {
            this.send('unlockClue:response', {
              success: false,
              message: 'Clue not available'
            })
            return
          }

          this.send('unlockClue:response', {
            success: true
          })
        }
      }
    ]));
  }
}