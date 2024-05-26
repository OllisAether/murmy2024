import WebSocket from 'ws';
import { AdminClient } from './adminClient';
import { Role } from '../../shared/roles';
import { GenericClient } from './genericClient';

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

export function handleActions (actions: {
  action: string,
  handler: (payload: any) => void
}[]) {
  return (message) => {
    const { action, payload } = JSON.parse(message.toString());
    
    const actionHandler = actions.find((a) => a.action === action);

    if (actionHandler) {
      actionHandler.handler(payload);
    }
  }
}
