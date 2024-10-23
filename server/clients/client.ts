import WebSocket from 'ws';
import { Role } from '../../shared/roles';
import { GenericClient } from './genericClient';
import { Game } from '../game/game';
import { JsonMap } from '../../shared/json';
import { colorize, Fg } from '../console';

export abstract class WebSocketClient {
  abstract type: Role;

  constructor (
    protected ws: WebSocket,
    public id: string,
    public userAgent = 'Unknown'
  ) {

    ws.on('message', handleActions([
      {
        action: 'ACK',
        handler: (payload) => {
          const action = payload?.action

          if (typeof action !== 'string') {
            console.log(colorize('[Client]', Fg.Blue), 'No action in ACK payload');
            return;
          }
  
          this.ack(action);
        }
      }
    ]));
  }

  sendStack: Record<string, {
    payload: any
    pendingAck: NodeJS.Timeout | false
  } | null> = {};

  reloadInterval: NodeJS.Timeout | null = null;

  ack (action: string) {
    if (this.sendStack[action] === null || this.sendStack[action] === undefined) {
      return
    }

    console.log(colorize('[Client]', Fg.Blue), 'Received ack for', action);

    this.sendStack[action] = null;
  }

  send (
    action: string,
    payload?: any,
    bypassTimeout: boolean = false
  ) {
    console.log(colorize('[Client]', Fg.Blue), 'Sending', action, 'with payload', payload, 'bypassTimeout', bypassTimeout);

    if (bypassTimeout) {
      this.ws.send(JSON.stringify({
        action,
        payload
      }));

      return
    }

    const alreadySending = this.sendStack[action] !== null && this.sendStack[action] !== undefined && this.sendStack[action].pendingAck === false;

    if (this.sendStack[action] && this.sendStack[action].pendingAck !== false) {
      console.log(colorize('[Client]', Fg.Blue), 'Already waiting for ack for', action)
      clearTimeout(this.sendStack[action].pendingAck as NodeJS.Timeout);
    }

    this.sendStack[action] = {
      payload,
      pendingAck: false
    };

    if (alreadySending) {
      console.log(colorize('[Client]', Fg.Blue), 'Already sending', action)
      return
    };

    setTimeout(() => {
      if (!this) {
        console.log(colorize('[Client]', Fg.Blue), 'Client is gone');
        return;
      }

      if (this.sendStack[action] === null || this.sendStack[action] === undefined) {
        console.log(colorize('[Client]', Fg.Blue), 'No payload to send');
        return;
      };

      const sendAndWaitForAck = (n: number) => {
        if (!this) {
          console.log(colorize('[Client]', Fg.Blue), 'Client is gone');
          return;
        }

        if (n >= 3) {
          console.log(colorize('[Client]', Fg.Blue), 'Retry limit reached for', action, '. Reloading client');

          if (this.reloadInterval) {
            clearInterval(this.reloadInterval);
          }

          let i = 0
          let reloadInterval = setInterval(() => {
            if (!this || this.ws.readyState === this.ws.CLOSED || this.ws.readyState === this.ws.CLOSING) {
              clearInterval(reloadInterval);
              return
            }
            
            if (i >= 3) {
              this.disconnect();
            }

            Game.get().sendReloadRequestToClient(this);
            i++
          }, 1000);
          this.reloadInterval = reloadInterval
          return
        }

        if (this.sendStack[action] === null || this.sendStack[action] === undefined) {
          console.log(colorize('[Client]', Fg.Blue), 'No payload to send');
          return;
        }

        console.log(colorize('[Client]', Fg.Blue), 'Sending', action, 'with payload', this.sendStack[action]);
        this.ws.send(JSON.stringify({
          action,
          payload: this.sendStack[action].payload
        }));

        this.sendStack[action].pendingAck = setTimeout(() => {
          if (!this) return

          if (this.sendStack[action] !== null && this.sendStack[action] !== undefined) {
            // no ack received
            console.log(colorize('[Client]', Fg.Blue), 'No ack received for', action, 'retrying', n + 1);

            sendAndWaitForAck(n + 1);
          }
        }, 500);
      }

      sendAndWaitForAck(0)
    }, 50)
  }

  disconnect () {
    if (this.reloadInterval) {
      clearInterval(this.reloadInterval);
    }

    Object.keys(this.sendStack).forEach((action) => {
      if (this.sendStack[action]?.pendingAck) {
        clearTimeout(this.sendStack[action]?.pendingAck as NodeJS.Timeout);
      }
    })

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
        client.send('timeSync:response', Date.now(), true);
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
    },
    {
      action: 'getClues',
      handler: () => {
        game.sendCluesToClients(client);
      }
    },
    {
      action: 'getMedia',
      handler: () => {
        game.sendMediaToClients(client);
      }
    },
    {
      action: 'getShownSuspects',
      handler: () => {
        game.sendShownSuspectsToClients(client);
      }
    }
  ]
}

export function handleActions (actions: {
  action: string,
  handler: (payload?: JsonMap) => void
}[]) {
  return (message: any) => {
    const { action, payload } = JSON.parse(message.toString());
    
    const actionHandler = actions.find((a) => a.action === action);

    if (actionHandler) {
      actionHandler.handler(payload);
    }
  }
}
