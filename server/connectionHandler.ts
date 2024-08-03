import { Request } from "express";
import WebSocket from "ws";
import { GenericClient } from "./clients/genericClient";
import { Game } from "./game/game";
import { Bg, colorize, Fg } from "./console";

export function handleConnection (ws: WebSocket, req: Request) {
  console.log(colorize('[Server]', Fg.Black, Bg.Gray), 'Established connection');

  const game = Game.get();
  
  const client = new GenericClient(ws);
  if (game.getClient(client.id)) {
    console.warn(colorize('[Server]', Fg.Black, Bg.Gray), 'Client ID already in use');
    client.disconnect();
    return;
  }

  const userAgents = req.headers['user-agent'];
  client.userAgent = userAgents ? userAgents.toString() : 'Unknown';

  game.addClient(client);

  client.send('connected', { id: client.id });

  ws.on('close', () => {
    console.log(colorize('[Server]', Fg.Black, Bg.Gray), 'Connection closed');

    game.removeClient(client);
  });

  ws.on('error', () => {
    console.error(colorize('[Server]', Fg.Black, Bg.Gray), 'Connection error');
    
    client.disconnect();
    game.removeClient(client);
  });
}