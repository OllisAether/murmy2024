import { Request } from "express";
import WebSocket from "ws";
import { WebSocketClient } from "./clients/client";
import { GenericClient } from "./clients/genericClient";
import { Game } from "./game/game";
import { couldStartTrivia } from "typescript";

export function handleConnection (ws: WebSocket, req: Request) {
  const game = Game.get();
  
  const client = new GenericClient(ws);
  if (game.getClient(client.id)) {
    console.error('Client ID already in use');
    client.disconnect();
    return;
  }

  const userAgents = req.headers['user-agent'];
  client.userAgent = userAgents ? userAgents.toString() : 'Unknown';

  game.addClient(client);

  console.log('Client ID:', client.id);

  client.send('connected', { id: client.id });

  ws.on('close', () => {
    console.log('Connection closed');

    game.removeClient(client);
  });

  ws.on('error', () => {
    console.error('Connection error');
    
    client.disconnect();
    game.removeClient(client);
  });
}