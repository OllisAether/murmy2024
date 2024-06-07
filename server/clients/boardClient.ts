import { Role } from "../../shared/roles";
import { Game } from "../game/game";
import { WebSocketClient, genericActions, handleActions } from "./client";
import WebSocket from 'ws';

export class BoardClient extends WebSocketClient {
  type: Role.Board = Role.Board;

  constructor (
    ws: WebSocket,
    id: string,
    userAgent?: string
  ) {
    super(ws, id, userAgent);

    const game = Game.get();

    ws.on('message', handleActions([
      ...genericActions(this),
    ]));
  }
}