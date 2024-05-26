import { Role } from "../../shared/roles";
import { Game } from "../game/game";
import { WebSocketClient, handleActions } from "./client";
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

    ws.on('message', handleActions([
      {
        action: 'help',
        handler: () => {
          const success = Game.get().addHelpRequest(this.teamId);

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
      }
    ]));
  }
}