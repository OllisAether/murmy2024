import { Role } from "../../shared/roles";
import { validateCode } from "../../shared/teamcode";
import { Game } from "../game/game";
import { Team } from "../game/team";
import { WebSocketClient, genericActions, handleActions } from "./client";
import WebSocket from 'ws';
import { TeamClient } from "./teamClient";
import { VoteOption } from "../../shared/vote";

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

          const id = payload.id;
          const name = payload.name;
          const code = payload.code;

          if (typeof name !== 'string' || typeof code !== 'string' || typeof id !== 'string') {
            console.error('Invalid payload', payload);

            this.send('addTeam:response', {
              success: false,
              message: 'Invalid payload'
            });

            return;
          }

          if (name.length === 0 || code.length === 0 || id.length === 0) {
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

          if (game.getTeams().find((t) => t.id === id)) {
            console.error('ID already exists', id);

            this.send('addTeam:response', {
              success: false,
              message: 'ID already exists'
            });

            return;
          }

          game.addTeam(new Team(
            id,
            name,
            code
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
      {
        action: 'setPlaybackFields',
        handler: (payload) => {
          const index = payload.index;
          const fields = payload.fields;

          if (typeof index !== 'number' || typeof fields !== 'object') {
            console.error('Invalid payload', payload);

            this.send('setPlaybackFields:response', {
              success: false,
              message: 'Invalid payload'
            });

            return;
          }

          game.cueManager.setPlaybackFields(index, fields);
        }
      },
      {
        action: 'setPlaybackTrigger',
        handler: (payload) => {
          const index = payload.index;
          const trigger = payload.trigger;

          if (typeof index !== 'number' || typeof trigger !== 'string' || ['auto', 'manual'].indexOf(trigger) === -1) {
            console.error('Invalid payload', payload);

            this.send('setPlaybackTrigger:response', {
              success: false,
              message: 'Invalid payload'
            });

            return;
          }

          console.log('Setting playback trigger', index, trigger);

          game.cueManager.setPlaybackTrigger(index, trigger as 'auto' | 'manual');
        }
      },
      {
        action: 'getManualTriggerOverride',
        handler: () => {
          this.send('getManualTriggerOverride:response', {
            value: game.cueManager.getManualTriggerOverride()
          });
        }
      },
      {
        action: 'setManualTriggerOverride',
        handler: (payload) => {
          const value = payload.value;

          if (typeof value !== 'boolean') {
            console.error('Invalid payload', payload);

            this.send('setManualTriggerOverride:response', {
              success: false,
              message: 'Invalid payload'
            });

            return;
          }

          game.cueManager.setManualTriggerOverride(value);
        }
      },
      // #endregion

      // #region Vote
      {
        action: 'addVoteOption',
        handler: (payload) => {
          console.log('Adding vote option', payload);

          const option = payload.option as VoteOption;

          if (typeof option.title !== 'string' || option.title.length === 0 ||
              typeof option.id !== 'string' || option.id.length === 0 ||
              (option.description && typeof option.description !== 'string') ||
              (option.image && typeof option.image !== 'string') ||
              (option.media && typeof option.media !== 'string') ||
              (option.removeSelf && typeof option.removeSelf !== 'boolean') ||
              (option.availableClues && (!Array.isArray(option.availableClues) ||
                option.availableClues.some(c => typeof c !== 'string'))) ||
              (option.options && (typeof option.options !== 'object' ||
                Object.keys(option.options).some(k => typeof k !== 'string' ||
                  !Array.isArray(option.options![k]) || option.options![k].some(o => typeof o !== 'string')
              )))) {
            console.error('Invalid payload', payload);

            this.send('addVoteOption:response', {
              success: false,
              message: 'Invalid payload'
            });
            return
          }

          if (game.voteManager.getVoteOptions().find((o) => o.id === option.id)) {
            console.error('ID already exists', option.id);

            this.send('addVoteOption:response', {
              success: false,
              message: 'ID already exists'
            });

            return;
          }

          game.voteManager.addOptions([option]);

          this.send('addVoteOption:response', {
            success: true,
          });
        }
      },
      {
        action: 'editVoteOption',
        handler: (payload) => {
          console.log('Editing vote option', payload);

          const option = payload.option as VoteOption;

          if (typeof option.title !== 'string' || option.title.length === 0 ||
              typeof option.id !== 'string' || option.id.length === 0 ||
              (option.description && typeof option.description !== 'string') ||
              (option.image && typeof option.image !== 'string') ||
              (option.media && typeof option.media !== 'string') ||
              (option.removeSelf && typeof option.removeSelf !== 'boolean') ||
              (option.availableClues && (!Array.isArray(option.availableClues) ||
                option.availableClues.some(c => typeof c !== 'string'))) ||
              (option.options && (typeof option.options !== 'object' ||
                Object.keys(option.options).some(k => typeof k !== 'string' ||
                  !Array.isArray(option.options![k]) || option.options![k].some(o => typeof o !== 'string')
              )))) {
            console.error('Invalid payload', payload.option);

            this.send('editVoteOption:response', {
              success: false,
              message: 'Invalid payload'
            });
            return
          }

          if (!game.voteManager.getVoteOptions().find((o) => o.id === option.id)) {
            console.error('ID not found', option.id);

            this.send('editVoteOption:response', {
              success: false,
              message: 'ID not found'
            });

            return;
          }

          game.voteManager.editOption(option);

          this.send('editVoteOption:response', {
            success: true,
          });
        }
      },
      {
        action: 'removeVoteOption',
        handler: (payload) => {
          console.log('Removing vote option', payload);

          const id = payload.id;

          if (!game.voteManager.getVoteOptions().find((o) => o.id === id)) {
            console.error('ID not found', id);

            this.send('removeVoteOption:response', {
              success: false,
              message: 'ID not found'
            });

            return;
          }

          game.voteManager.removeOption(id);

          this.send('removeVoteOption:response', {
            success: true,
          });
        }
      },
      {
        action: 'addPool',
        handler: (payload) => {
          console.log('Adding pool', payload);

          const pool = payload.pool;

          if (typeof pool !== 'string' || pool.length === 0) {
            console.error('Invalid payload', payload);

            this.send('addPool:response', {
              success: false,
              message: 'Invalid payload'
            });

            return;
          }

          game.voteManager.addPool(pool);

          this.send('addPool:response', {
            success: true,
          });
        }
      },
      {
        action: 'removePool',
        handler: (payload) => {
          console.log('Removing pool', payload);

          const pool = payload.pool;

          if (typeof pool !== 'string' || pool.length === 0) {
            console.error('Invalid payload', payload);

            this.send('removePool:response', {
              success: false,
              message: 'Invalid payload'
            });

            return;
          }

          game.voteManager.removePool(pool);

          this.send('removePool:response', {
            success: true,
          });
        }
      },
      {
        action: 'addOptionToPool',
        handler: (payload) => {
          console.log('Adding option to pool', payload);

          const pool = payload.pool;
          const option = payload.option;

          if (typeof pool !== 'string' || pool.length === 0 ||
              typeof option !== 'string' || option.length === 0) {
            console.error('Invalid payload', payload);

            this.send('addOptionToPool:response', {
              success: false,
              message: 'Invalid payload'
            });

            return;
          }

          game.voteManager.addOptionsToPool(pool, [option]);

          this.send('addOptionToPool:response', {
            success: true,
          });
        }
      },
      {
        action: 'removeOptionFromPool',
        handler: (payload) => {
          console.log('Removing option from pool', payload);

          const pool = payload.pool;
          const option = payload.option;

          if (typeof pool !== 'string' || pool.length === 0 ||
              typeof option !== 'string' || option.length === 0) {
            console.error('Invalid payload', payload);

            this.send('removeOptionFromPool:response', {
              success: false,
              message: 'Invalid payload'
            });

            return;
          }

          game.voteManager.removeOptionFromPool(pool, option);

          this.send('removeOptionFromPool:response', {
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
        action: 'setMedia',
        handler: (payload) => {
          const media = payload.media;

          if (typeof media !== 'string') {
            console.error('Invalid payload', payload);
            return;
          }

          game.setMedia(media);
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
        action: 'skipMedia',
        handler: () => {
          game.mediaFinished();
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
    ]))
  }
}
