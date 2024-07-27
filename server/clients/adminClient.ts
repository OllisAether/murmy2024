import { Role } from "../../shared/roles";
import { validateCode } from "../../shared/teamcode";
import { Game } from "../game/game";
import { Team } from "../game/team";
import { idGen } from "../../shared/random";
import { WebSocketClient, genericActions, handleActions } from "./client";
import WebSocket from 'ws';
import { TeamClient } from "./teamClient";

export class AdminClient extends WebSocketClient {
  type: Role.Admin = Role.Admin;

  constructor (
    ws: WebSocket,
    id: string,
    userAgents?: string
  ) {
    super(ws, id, userAgents);

    const game = Game.get();

    ws.on('message', handleActions([
      ...genericActions(this),

      // #region Team management
      {
        action: 'addTeam',
        handler: (payload) => {
          console.log('Adding team', payload);

          const name = payload.name;
          const code = payload.code;

          if (typeof name !== 'string' || typeof code !== 'string') {
            console.error('Invalid payload', payload);

            this.send('addTeam:response', {
              success: false,
              message: 'Invalid payload'
            });

            return;
          }

          if (name.length === 0 || code.length === 0) {
            console.error('Some fields are empty', payload);

            this.send('addTeam:response', {
              success: false,
              message: 'Empty fields'
            });

            return;
          }

          const valid = validateCode(code);

          if (!valid.valid) {
            console.error('Invalid code', code, valid.message);

            this.send('addTeam:response', {
              success: false,
              message: 'Validation failed'
            });

            return;
          }

          if (game.getTeams().find((t) => t.name === name)) {
            console.error('Name already exists', name);

            this.send('addTeam:response', {
              success: false,
              message: 'Name already exists'
            });

            return;
          }

          if (game.getTeams().find((t) => t.code === code)) {
            console.error('Code already exists', code);

            this.send('addTeam:response', {
              success: false,
              message: 'Code already exists'
            });

            return;
          }

          game.addTeam(new Team(
            idGen(),
            payload.name,
            payload.code
          ));

          this.send('teams', game.getTeams());

          this.send('addTeam:response', {
            success: true,
          });
        }
      },
      {
        action: 'editTeam',
        handler: (payload) => {
          console.log('Editing team', payload);

          const id = payload.id;
          const name = payload.name;
          const code = payload.code;

          if (typeof name !== 'string' || typeof code !== 'string') {
            console.error('Invalid payload', payload);

            this.send('editTeam:response', {
              success: false,
              message: 'Invalid payload'
            });

            return;
          }

          if (name.length === 0 || code.length === 0) {
            console.error('Some fields are empty', payload);

            this.send('editTeam:response', {
              success: false,
              message: 'Empty fields'
            });

            return;
          }

          const valid = validateCode(code);

          if (!valid.valid) {
            console.error('Invalid code', code, valid.message);

            this.send('editTeam:response', {
              success: false,
              message: 'Validation failed'
            });

            return;
          }

          const team = game.getTeams().find((t) => t.id === id);

          if (!team) {
            console.error('Team not found', id);

            this.send('editTeam:response', {
              success: false,
              message: 'Team not found'
            });

            return;
          }

          if (game.getTeams().find((t) => t.name === name && t.id !== id)) {
            console.error('Name already exists', name);

            this.send('editTeam:response', {
              success: false,
              message: 'Name already exists'
            });

            return;
          }

          if (game.getTeams().find((t) => t.code === code && t.id !== id)) {
            console.error('Code already exists', code);

            this.send('editTeam:response', {
              success: false,
              message: 'Code already exists'
            });

            return;
          }

          team.name = name;
          team.code = code;

          game.saveTeams();

          this.send('teams', game.getTeams());

          this.send('editTeam:response', {
            success: true,
          });
        }
      },
      {
        action: 'removeTeam',
        handler: (payload) => {
          console.log('Removing team', payload);

          const id = payload.id;

          const team = game.getTeams().find((t) => t.id === id);

          if (!team) {
            console.error('Team not found', id);

            this.send('removeTeam:response', {
              success: false,
              message: 'Team not found'
            });

            return;
          }

          game.removeTeam(team);

          this.send('teams', game.getTeams());

          this.send('removeTeam:response', {
            success: true,
          });
        }
      },
      {
        action: 'getTeams',
        handler: () => {
          console.log('Getting teams', game.getTeams());
          this.send('teams', game.getTeams());
        }
      },
      // #endregion

      // #region Client management
      {
        action: 'getClients',
        handler: () => {
          game.sendClientsToAdmins(this);
        }
      },
      {
        action: 'kickClient',
        handler: (payload) => {
          console.log('Kicking client', payload);

          const id = payload.id;

          const client = game.getClient(id);

          if (!client) {
            console.error('Client not found', id);

            this.send('kickClient:response', {
              success: false,
              message: 'Client not found'
            });

            return;
          }

          game.removeClient(client);
          client.disconnect()

          this.send('kickClient:response', {
            success: true,
          });
        }
      },
      {
        action: 'logoutClient',
        handler: (payload) => {
          console.log('Logging out client', payload);

          const id = payload.id;

          const client = game.getClient(id);

          if (!client) {
            console.error('Client not found', id);

            this.send('logoutClient:response', {
              success: false,
              message: 'Client not found'
            });

            return;
          }

          client.send('logout');

          this.send('logoutClient:response', {
            success: true,
          });
        }
      },
      {
        action: 'setClientTeam',
        handler: (payload) => {
          console.log('Setting client team', payload);

          const clientId = payload.clientId;
          const teamId = payload.teamId;

          if (game.getClients().find((c) => c.type === Role.Team && (c as TeamClient).teamId === teamId)) {
            console.error('Team already linked to a client', teamId);

            this.send('setClientTeam:response', {
              success: false,
              message: 'Team already linked to a client'
            });

            return;
          }

          game.promoteClientToTeam(clientId, teamId);
        }
      },
      {
        action: 'setClientBoard',
        handler: (payload) => {
          console.log('Setting client board', payload);

          const clientId = payload.clientId;

          if (game.getClients().find((c) => c.type === Role.Board)) {
            console.error('Board already exists');

            this.send('setClientBoard:response', {
              success: false,
              message: 'Board already exists'
            });

            return;
          }

          game.promoteClientToBoard(clientId);
        }
      },
      // #endregion

      // #region Help
      {
        action: 'getHelpRequests',
        handler: () => {
          game.sendHelpRequestsToAdmins(this);
        }
      },
      {
        action: 'removeHelpRequest',
        handler: (payload) => {
          console.log('Removing help request', payload);

          const teamId = payload.teamId;

          game.removeHelpRequest(teamId);
        }
      },
      // #endregion

      // #region Timer
      {
        action: 'pauseTimer',
        handler: () => {
          game.pauseTimer();
        }
      },
      {
        action: 'resumeTimer',
        handler: () => {
          game.resumeTimer();
        }
      },
      {
        action: 'setTime',
        handler: (payload) => {
          const time = payload.time;

          if (typeof time !== 'number') {
            console.error('Invalid payload', payload);

            this.send('setTime:response', {
              success: false,
              message: 'Invalid payload'
            });

            return;
          }
          
          game.setTime(time);
        }
      },
      {
        action: 'setDuration',
        handler: (payload) => {
          const duration = payload.duration;

          if (typeof duration !== 'number') {
            console.error('Invalid payload', payload);

            this.send('setDuration:response', {
              success: false,
              message: 'Invalid payload'
            });

            return;
          }
          
          game.setDuration(duration);
        }
      },
      // #endregion

      // #region Playbacks & Cues
      {
        action: 'nextPlayback',
        handler: () => {
          game.cueManager.nextPlayback();
        }
      },
      {
        action: 'nextCue',
        handler: (payload) => {
          const index = payload.index;

          if (typeof index !== 'number' && index !== undefined) {
            console.error('Invalid payload', payload);

            this.send('nextCue:response', {
              success: false,
              message: 'Invalid payload'
            });

            return;
          }

          game.cueManager.nextCue(index);
        }
      },
      {
        action: 'getPlaybacks',
        handler: () => {
          game.sendPlaybacksToAdmins(this);
        }
      },
      {
        action: 'getCurrentPlayback',
        handler: () => {
          game.sendCurrentPlaybackToAdmins(this);
        }
      },
      {
        action: 'setCurrentPlayback',
        handler: (payload) => {
          const index = payload.index;

          if (typeof index !== 'number') {
            console.error('Invalid payload', payload);

            this.send('setCurrentPlayback:response', {
              success: false,
              message: 'Invalid payload'
            });

            return;
          }

          game.cueManager.setCurrentPlayback(index);
        }
      },
      // #endregion

      // #region Vote
      {
        action: 'addVoteOption',
        handler: (payload) => {
          console.log('Adding vote option', payload);

          const title = payload.title;
          const image = payload.image;
          const description = payload.description;
          const unlockClues = payload.unlockClues;
          const addToPool = payload.addToPool;
          const media = payload.media;

          if (typeof title !== 'string') {
            console.error('Invalid payload', payload);

            this.send('addVoteOption:response', {
              success: false,
              message: 'Invalid payload'
            });

            return;
          }

          game.voteManager.addOptions([{
            id: idGen(),
            title,
            image,
            description,
            unlockClues,
            addToPool,
            media
          }]);

          this.send('addVoteOption:response', {
            success: true,
          });
        }
      },
      // #endregion

      // #region Media
      {
        action: 'playMedia',
        handler: () => {
          game.playMedia();
        }
      },
      {
        action: 'pauseMedia',
        handler: () => {
          game.pauseMedia();
        }
      },
      {
        action: 'seekMedia',
        handler: (payload) => {
          const time = payload.time;

          if (typeof time !== 'number') {
            console.error('Invalid payload', payload);
            return;
          }

          game.seekMedia(time);
        }
      },
      {
        action: 'getMediaState',
        handler: () => {
          game.requestMedia();
        }
      },
      // #endregion
    
      // #region Suspect Database
      {
        action: 'getSuspectDatabases',
        handler: () => {
          game.sendSuspectDatabasesToAdmins(this);
        }
      },
      // #endregion
      
      // #region Clues
      {
        action: 'getClues',
        handler: () => {
          game.sendCluesToClients(this);
        }
      },
      // #endregion
    ]))
  }
}
