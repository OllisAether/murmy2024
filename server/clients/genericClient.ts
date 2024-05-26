import { idGen } from "../../shared/random";
import { AdminClient } from "./adminClient";
import { BoardClient } from "./boardClient";
import { WebSocketClient, handleActions } from "./client";
import WebSocket from 'ws';
import { TeamClient } from "./teamClient";
import { Role } from "../../shared/roles";
import { Game } from "../game/game";

export class GenericClient extends WebSocketClient {
  type: Role.Unauthorized = Role.Unauthorized;

  constructor (
    ws: WebSocket,
    id?: string,
    userAgent?: string
  ) {
    super(ws, id ?? idGen(), userAgent);
  }

  promoteToAdmin () {
    this.send('auth', {
      type: 'admin'
    })
    console.log('Promoting to admin', this.id)
    return new AdminClient(this.ws, this.id, this.userAgent);
  }

  promoteToBoard (password: string) {
    this.send('auth', {
      type: 'board',
      password
    })
    return new BoardClient(this.ws, this.id, this.userAgent);
  }

  promoteToTeam (teamId: string, teamName: string, teamCode: string) {
    this.send('auth', {
      type: 'team',
      teamId,
      teamName,
      teamCode
    })
    return new TeamClient(this.ws, this.id, teamId, teamName, this.userAgent);
  }
}