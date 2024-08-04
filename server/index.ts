import express from 'express';
import expressWs from 'express-ws';
import { handleConnection } from './connectionHandler';
import { Game } from './game/game';
import { readFile } from 'fs/promises';
import { configDotenv } from 'dotenv';
import { Database } from './database';
import { createServer, Server } from 'https';
import path from 'path';
import fs from 'fs';
import { Asset } from '../shared/asset';
import {
  colorize,
  Fg,
  Bg,
  init as initConsole
} from './console';

const isDevelopment = process.env.NODE_ENV === 'development';

initConsole()
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

    console.log(colorize('[Server]', Fg.Black, Bg.Gray), 'Loading SSL certificate and key');

    console.log(colorize('[Server]', Fg.Black, Bg.Gray), 'Private Key Path:', privateKeyPath);
    console.log(colorize('[Server]', Fg.Black, Bg.Gray), 'Certificate Path:', certificatePath);

    const [privateKey, certificate] = await Promise.all([
      readFile(privateKeyPath, 'utf8'),
      readFile(certificatePath, 'utf8')
    ]);
    
    server = createServer({
      key: privateKey,
      cert: certificate
    }, expressApp);

    server.listen(port, () => {
      console.log(colorize('[Server]', Fg.Black, Bg.Gray), `Server listening on port ${port}`);
    })
  }

  const ews = expressWs(expressApp, server ?? undefined);
  const app = ews.app;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  await Database.get(!isDevelopment).loadCollections();

  if (isDevelopment) {
    Database.get().createBackups = false;
  }

  const game = Game.get();

  app.ws('/api/ws', handleConnection);

  app.post('/api/login', game.handleLogin.bind(game))
  app.post('/api/admin/login', game.handleAdminLogin.bind(game))

  //#region Assets
  function walk(dir) {
    return new Promise<string[]>((resolve, reject) => {
      let results: string[] = [];
      fs.readdir(dir, function(err, list) {
        if (err) return reject(err);

        var pending = list.length;

        if (!pending) return resolve(results);

        list.forEach(function(file) {
          const filepath = path.resolve(dir, file);

          fs.stat(filepath, function(err, stat) {
            if (stat && stat.isDirectory()) {
              walk(filepath).then((res) => {
                results = results.concat(res);
                if (!--pending) resolve(results);
              });
            } else {
              results.push(filepath);
              if (!--pending) resolve(results);
            }
          });
        });
      });
    });
  };

  const assetFolder = 'assets';
  const assetPath = path.resolve(__dirname, `../client/${assetFolder}`);

  const sharedAssetPath = path.resolve(assetPath, 'shared');
  const sharedAssets: Asset[] = (await walk(sharedAssetPath)
    .catch((err) => {
      console.error(colorize('[Server]', Fg.Black, Bg.Gray), 'Error walking directory:', err);
      return [];
    }))
    .map((asset) => ({
      name: path.relative(sharedAssetPath, asset),
      url: `/${assetFolder}/shared/${path.relative(sharedAssetPath, asset)}`
    }));

  const teamAssetPath = path.resolve(assetPath, 'team')
  const teamAssets: Asset[] = (await walk(teamAssetPath)
    .catch((err) => {
      console.error(colorize('[Server]', Fg.Black, Bg.Gray), 'Error walking directory:', err);
      return [];
    }))
    .map((asset) => ({
      name: path.relative(teamAssetPath, asset),
      url: `/${assetFolder}/team/${path.relative(teamAssetPath, asset)}`
    }));

  const boardAssetPath = path.resolve(assetPath, 'board')
  const boardAssets: Asset[] = (await walk(boardAssetPath)
    .catch((err) => {
      console.error(colorize('[Server]', Fg.Black, Bg.Gray), 'Error walking directory:', err);
      return [];
    }))
    .map((asset) => ({
      name: path.relative(boardAssetPath, asset),
      url: `/${assetFolder}/board/${path.relative(boardAssetPath, asset)}`
    }));

  app.get('/api/assets/:type', async (req, res) => {
    const type = req.params.type;
    
    if (type === 'all') {
      res.json({
        shared: sharedAssets,
        team: teamAssets,
        board: boardAssets
      });

      return;
    }

    if (!['team', 'board'].includes(type)) {
      res.status(400).send('Invalid type');
      return;
    }

    res.json(
      sharedAssets.concat(
        type === 'team' ? teamAssets : boardAssets
      )
    );
  });
  //#endregion

  if (isDevelopment) {
    console.log(colorize('[Server]', Fg.Black, Bg.Gray), 'Development mode!');

    app.listen(port, () => {
      console.log(colorize('[Server]', Fg.Black, Bg.Gray), `Server listening on port ${port}`);
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
  console.error(colorize('[Server]', Fg.Black, Bg.Gray), 'Uncaught exception:', err);

  Database.get().createBackup('uncaughtException', true);
})

process.on('SIGINT', async () => {
  console.log(colorize('[Server]', Fg.Black, Bg.Gray), 'Caught interrupt signal. Saving collections and creating backup.');

  await Database.get().saveCollections();
  await Database.get().createBackup('SIGINT', true);

  process.exit();
});