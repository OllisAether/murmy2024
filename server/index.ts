import express from 'express';
import expressWs from 'express-ws';
import { handleConnection } from './connectionHandler';
import { Game } from './game/game';
import { readFile } from 'fs/promises';
import { configDotenv } from 'dotenv';
import { Database } from './database';
import { createServer, Server } from 'https';
import path from 'path';

const isDevelopment = process.env.NODE_ENV === 'development';

configDotenv({
  path: './.env'
});

const port = process.env.PORT || 3000;

(async () => {
  const expressApp = express();

  let server: Server | undefined = undefined;

  if (!isDevelopment) {
    const privateKeyPath = path.resolve(process.cwd(), process.env.SSL_KEY_PATH ?? '');
    const certificatePath = path.resolve(process.cwd(), process.env.SSL_CERT_PATH ?? '');

    console.log('Loading SSL certificate and key');

    console.log('Private Key Path:', privateKeyPath);
    console.log('Certificate Path:', certificatePath);

    const [privateKey, certificate] = await Promise.all([
      readFile(privateKeyPath, 'utf8'),
      readFile(certificatePath, 'utf8')
    ]);
    
    server = createServer({
      key: privateKey,
      cert: certificate
    }, expressApp);

    server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    })
  }

  const ews = expressWs(expressApp, server ?? undefined);
  const app = ews.app;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  await Database.get(!isDevelopment).loadCollections();
  const game = Game.get();

  app.ws('/api/ws', handleConnection);

  app.post('/api/login', game.handleLogin.bind(game))
  app.post('/api/admin/login', game.handleAdminLogin.bind(game))

  if (isDevelopment) {
    console.log('Development mode!');

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } else {
    app.use(express.static(path.resolve(__dirname, '../client')));

    // Serve the index.html file for all other routes
    app.get('*', (req, res) => {
      res.sendFile('./index.html', { root: path.resolve(__dirname, '../client') });
    });
  }
})();

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);

  Database.get().createBackup('uncaughtException', true);
})

process.on('SIGINT', async () => {
  console.log('Caught interrupt signal. Saving collections and creating backup.');

  await Database.get().saveCollections();
  await Database.get().createBackup('SIGINT', true);

  process.exit();
});