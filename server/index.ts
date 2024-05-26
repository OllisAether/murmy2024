import express from 'express';
import expressWs from 'express-ws';
import { handleConnection } from './connectionHandler';
import { Game } from './game/game';
import { readFile } from 'fs/promises';
import { configDotenv } from 'dotenv';
import { Database } from './database';

configDotenv({
  path: '.env'
});

const port = process.env.PORT || 3000;

(async () => {
  const ews = expressWs(express());
  const app = ews.app;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  await Database.get().loadCollections();
  const game = Game.get();

  app.ws('/api/ws', handleConnection);

  app.post('/api/login', game.handleLogin.bind(game))
  app.post('/api/admin/login', game.handleAdminLogin.bind(game))

  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode!');
  } else {
    app.use(express.static('../client'));

    // Serve the index.html file for all other routes
    app.get('*', (req, res) => {
      res.sendFile('./index.html', { root: '../client' });
    });
  }

  app.listen(port, () => {
    console.log('Server started on http://localhost:' + port);
  });
})();