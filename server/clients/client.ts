import WebSocket from 'ws';
import { Role } from '../../shared/roles';
import { GenericClient } from './genericClient';
import { Game } from '../game/game';

export abstract class WebSocketClient {
  abstract type: Role;

  constructor (
    protected ws: WebSocket,
    public id: string,
    public userAgent = 'Unknown'
  ) {}

  send (
    action: string,
    payload?: any
  ) {
    this.ws.send(JSON.stringify({
      action,
      payload
    }));
  }

  disconnect () {
    this.ws.removeAllListeners();
    this.ws.close(1000, 'Disconnecting');
  }

  promoteToGeneric () {
    this.ws.removeAllListeners();
    return new GenericClient(this.ws, this.id, this.userAgent);
  }
}

export function genericActions (client: WebSocketClient): {
  action: string,
  handler: (payload: any) => void
}[] {
  const game = Game.get();

  return [
    {
      action: 'getTimer',
      handler: () => {
        game.sendTimerToClients(client);
      }
    },
    {
      action: 'timeSync',
      handler: () => {
        client.send('timeSync:response', Date.now());
      }
    },
    {
      action: 'getPhase',
      handler: () => {
        game.sendPhaseToClients(client);
      }
    },
    {
      action: 'getVoteSession',
      handler: () => {
        game.sendVoteSessionToClients(client);
      }
    },
    {
      action: 'getVotePools',
      handler: () => {
        game.sendVotePoolsToClients(client);
      }
    },
    {
      action: 'getVoteOptions',
      handler: () => {
        game.sendVoteOptionsToClients(client);
      }
    }
  ]
}

export function handleActions (actions: {
  action: string,
  handler: (payload: any) => void
}[]) {
  return (message: any) => {
    const { action, payload } = JSON.parse(message.toString());
    
    const actionHandler = actions.find((a) => a.action === action);

    if (actionHandler) {
      actionHandler.handler(payload);
    }
  }
}
