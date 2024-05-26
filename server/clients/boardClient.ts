import { Role } from "../../shared/roles";
import { WebSocketClient } from "./client";
import WebSocket from 'ws';

export class BoardClient extends WebSocketClient {
  type: Role.Board = Role.Board;

  constructor (
    ws: WebSocket,
    id: string,
    userAgent?: string
  ) {
    super(ws, id, userAgent);
  }
}