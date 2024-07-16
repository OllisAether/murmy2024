import { Role } from "../../shared/roles";
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
          const vote = payload.vote;

          if (typeof vote !== 'number') {
            console.log('Invalid vote', vote)
            this.send('vote:response', {
              success: false,
              message: 'Invalid Format'
            })
            return
          }

          const success = game.addVote(this.teamId, vote)

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
        action: 'getVoted',
        handler: () => {
          const voted = game.getVoted(this.teamId)

          if (voted !== null) {
            this.send('getVoted:response', voted)
          } else {
            this.send('getVoted:response', null)
          }
        }
      }
    ]));
  }
}