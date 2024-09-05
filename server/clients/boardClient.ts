import { Role } from "../../shared/roles";
import { colorize, Fg } from "../console";
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
          console.log(colorize('[Client: Board]', Fg.Blue), 'Skipping board');
          game.boardSkip();
        }
      },
      {
        action: 'mediaDuration',
        handler: (payload) => {
          console.log(colorize('[Client: Board]', Fg.Blue), 'Received media duration', payload);
          const duration = payload?.duration;

          if (typeof duration !== 'number') {
            console.error(colorize('[Client: Board]', Fg.Blue), 'Invalid duration', duration);
            return;
          }

          game.sendMediaDurationToAdmins(duration);
        }
      },
      {
        action: 'mediaState',
        handler: (payload) => {
          console.log(colorize('[Client: Board]', Fg.Blue), 'Received media state', payload);
          const state = payload?.state;

          if (typeof state !== 'string') {
            console.error(colorize('[Client: Board]', Fg.Blue), 'Invalid state', state);
            return;
          }

          if (state !== 'playing' && state !== 'paused') {
            console.error(colorize('[Client: Board]', Fg.Blue), 'Invalid state', state);
            return;
          }

          game.sendMediaStateToAdmins(state);
        }
      },
      {
        action: 'mediaProgress',
        handler: (payload) => {
          console.log(colorize('[Client: Board]', Fg.Blue), 'Received media progress', payload);

          // in seconds
          const progress = payload?.progress;

          if (typeof progress !== 'number') {
            return;
          }

          game.mediaTime(progress);
        }
      },
      {
        action: 'mediaFinished',
        handler: () => {
          console.log(colorize('[Client: Board]', Fg.Blue), 'Received media finished');
          game.mediaFinished();
        }
      },

      {
        action: 'getResults',
        handler: () => {
          console.log(colorize('[Client: Board]', Fg.Blue), 'Getting results');

          game.sendResultsToBoard();
        }
      },
    ]));
  }
}