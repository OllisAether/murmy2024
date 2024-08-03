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
      {
        action: 'boardSkip',
        handler: () => {
          game.boardSkip();
        }
      },
      {
        action: 'getMedia',
        handler: () => {
          game.sendCurrentMediaToBoardAndAdmins(this);
        }
      },
      {
        action: 'mediaDuration',
        handler: (payload) => {
          const { duration } = payload;

          if (typeof duration !== 'number') {
            console.log('Invalid duration', duration);
            return;
          }

          game.sendMediaDurationToAdmins(duration);
        }
      },
      {
        action: 'mediaState',
        handler: (payload) => {
          const { state } = payload;

          if (typeof state !== 'string') {
            console.log('Invalid state', state);
            return;
          }

          if (state !== 'playing' && state !== 'paused') {
            console.log('Invalid state', state);
            return;
          }

          game.sendMediaStateToAdmins(state);
        }
      },
      {
        action: 'mediaProgress',
        handler: (payload) => {
          const { progress } = payload;

          if (typeof progress !== 'number') {
            return;
          }

          game.sendMediaProgressToAdmins(progress);
        }
      },
      {
        action: 'mediaFinished',
        handler: () => {
          game.mediaFinished();
        }
      }
    ]));
  }
}