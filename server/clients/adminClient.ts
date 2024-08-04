import { Role } from "../../shared/roles";
import { validateCode } from "../../shared/teamcode";
import { Game } from "../game/game";
import { Team } from "../game/team";
import { WebSocketClient, genericActions, handleActions } from "./client";
import WebSocket from 'ws';
import { TeamClient } from "./teamClient";
import { VoteOption } from "../../shared/vote";
import { colorize, Fg } from "../console";

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
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Adding team', payload);

          const id = payload.id;
          const name = payload.name;
          const code = payload.code;

          if (typeof name !== 'string' || typeof code !== 'string' || typeof id !== 'string') {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Invalid payload', payload);

            this.send('addTeam:response', {
              success: false,
              message: 'Invalid payload'
            });

            return;
          }

          if (name.length === 0 || code.length === 0 || id.length === 0) {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Some fields are empty', payload);

            this.send('addTeam:response', {
              success: false,
              message: 'Empty fields'
            });

            return;
          }

          const valid = validateCode(code);

          if (!valid.valid) {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Invalid code', code, valid.message);

            this.send('addTeam:response', {
              success: false,
              message: 'Validation failed'
            });

            return;
          }

          if (game.getTeams().find((t) => t.name === name)) {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Name already exists', name);

            this.send('addTeam:response', {
              success: false,
              message: 'Name already exists'
            });

            return;
          }

          if (game.getTeams().find((t) => t.code === code)) {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Code already exists', code);

            this.send('addTeam:response', {
              success: false,
              message: 'Code already exists'
            });

            return;
          }

          if (game.getTeams().find((t) => t.id === id)) {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'ID already exists', id);

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
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Editing team', payload);

          const id = payload.id;
          const name = payload.name;
          const code = payload.code;

          if (typeof name !== 'string' || typeof code !== 'string') {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Invalid payload', payload);

            this.send('editTeam:response', {
              success: false,
              message: 'Invalid payload'
            });

            return;
          }

          if (name.length === 0 || code.length === 0) {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Some fields are empty', payload);

            this.send('editTeam:response', {
              success: false,
              message: 'Empty fields'
            });

            return;
          }

          const valid = validateCode(code);

          if (!valid.valid) {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Invalid code', code, valid.message);

            this.send('editTeam:response', {
              success: false,
              message: 'Validation failed'
            });

            return;
          }

          const team = game.getTeams().find((t) => t.id === id);

          if (!team) {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Team not found', id);

            this.send('editTeam:response', {
              success: false,
              message: 'Team not found'
            });

            return;
          }

          if (game.getTeams().find((t) => t.name === name && t.id !== id)) {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Name already exists', name);

            this.send('editTeam:response', {
              success: false,
              message: 'Name already exists'
            });

            return;
          }

          if (game.getTeams().find((t) => t.code === code && t.id !== id)) {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Code already exists', code);

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
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Removing team', payload);

          const id = payload.id;

          const team = game.getTeams().find((t) => t.id === id);

          if (!team) {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Team not found', id);

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
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Kicking client', payload);

          const id = payload.id;

          const client = game.getClient(id);

          if (!client) {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Client not found', id);

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
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Logging out client', payload);

          const id = payload.id;

          const client = game.getClient(id);

          if (!client) {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Client not found', id);

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
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Setting client team', payload);

          const clientId = payload.clientId;
          const teamId = payload.teamId;

          if (game.getClients().find((c) => c.type === Role.Team && (c as TeamClient).teamId === teamId)) {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Team already linked to a client', teamId);

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
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Setting client board', payload);

          const clientId = payload.clientId;

          if (game.getClients().find((c) => c.type === Role.Board)) {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Board already exists');

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
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Removing help request', payload);

          const teamId = payload.teamId;

          game.removeHelpRequest(teamId);
        }
      },
      // #endregion

      // #region Timer
      {
        action: 'pauseTimer',
        handler: () => {
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Pausing timer');
          game.pauseTimer();
        }
      },
      {
        action: 'resumeTimer',
        handler: () => {
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Resuming timer');
          game.resumeTimer();
        }
      },
      {
        action: 'setTime',
        handler: (payload) => {
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Setting time', payload);
          const time = payload.time;

          if (typeof time !== 'number') {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Invalid payload', payload);

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
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Setting duration', payload);
          const duration = payload.duration;

          if (typeof duration !== 'number') {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Invalid payload', payload);

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
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Next playback');
          game.cueManager.nextPlayback();
        }
      },
      {
        action: 'nextCue',
        handler: (payload) => {
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Next cue', payload);
          const index = payload.index;

          if (typeof index !== 'number' && index !== undefined) {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Invalid payload', payload);

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
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Setting current playback', payload);
          const index = payload.index;

          if (typeof index !== 'number') {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Invalid payload', payload);

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
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Setting playback fields', payload);
          const index = payload.index;
          const fields = payload.fields;

          if (typeof index !== 'number' || typeof fields !== 'object') {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Invalid payload', payload);

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
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Setting playback trigger', payload);
          const index = payload.index;
          const trigger = payload.trigger;

          if (typeof index !== 'number' || typeof trigger !== 'string' || ['auto', 'manual'].indexOf(trigger) === -1) {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Invalid payload', payload);

            this.send('setPlaybackTrigger:response', {
              success: false,
              message: 'Invalid payload'
            });

            return;
          }

          game.cueManager.setPlaybackTrigger(index, trigger as 'auto' | 'manual');
        }
      },
      {
        action: 'setManualTriggerOverride',
        handler: (payload) => {
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Setting manual trigger override', payload);
          const value = payload.value;

          if (typeof value !== 'boolean') {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Invalid payload', payload);

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
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Adding vote option', payload);

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
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Invalid payload', payload);

            this.send('addVoteOption:response', {
              success: false,
              message: 'Invalid payload'
            });
            return
          }

          if (game.voteManager.getVoteOptions().find((o) => o.id === option.id)) {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'ID already exists', option.id);

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
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Editing vote option', payload);

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
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Invalid payload', payload.option);

            this.send('editVoteOption:response', {
              success: false,
              message: 'Invalid payload'
            });
            return
          }

          if (!game.voteManager.getVoteOptions().find((o) => o.id === option.id)) {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'ID not found', option.id);

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
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Removing vote option', payload);

          const id = payload.id;

          if (!game.voteManager.getVoteOptions().find((o) => o.id === id)) {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'ID not found', id);

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
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Adding pool', payload);

          const pool = payload.pool;

          if (typeof pool !== 'string' || pool.length === 0) {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Invalid payload', payload);

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
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Removing pool', payload);

          const pool = payload.pool;

          if (typeof pool !== 'string' || pool.length === 0) {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Invalid payload', payload);

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
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Adding option to pool', payload);

          const pool = payload.pool;
          const option = payload.option;

          if (typeof pool !== 'string' || pool.length === 0 ||
              typeof option !== 'string' || option.length === 0) {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Invalid payload', payload);

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
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Removing option from pool', payload);

          const pool = payload.pool;
          const option = payload.option;

          if (typeof pool !== 'string' || pool.length === 0 ||
              typeof option !== 'string' || option.length === 0) {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Invalid payload', payload);

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
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Playing media');
          game.playMedia();
        }
      },
      {
        action: 'setMedia',
        handler: (payload) => {
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Setting media', payload);
          const media = payload.media;

          if (typeof media !== 'string') {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Invalid payload', payload);
            return;
          }

          game.setMedia(media);
        }
      },
      {
        action: 'pauseMedia',
        handler: () => {
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Pausing media');
          game.pauseMedia();
        }
      },
      {
        action: 'seekMedia',
        handler: (payload) => {
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Seeking media', payload);
          const time = payload.time;

          if (typeof time !== 'number') {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Invalid payload', payload);
            return;
          }

          game.seekMedia(time);
        }
      },
      {
        action: 'skipMedia',
        handler: () => {
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Skipping media');
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
      {
        action: 'addEntry',
        handler: (payload) => {
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Adding entry', payload);

          const teamId = payload.teamId;
          const entry = payload.entry;

          if (typeof teamId !== 'string' || typeof entry !== 'object') {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Invalid payload', payload);

            this.send('addEntry:response', {
              success: false,
              message: 'Invalid payload'
            });

            return;
          }

          game.suspectDatabaseManager.addEntry(teamId, entry);

          this.send('addEntry:response', {
            success: true,
          });
        }
      },
      {
        action: 'removeEntry',
        handler: (payload) => {
          console.log(colorize('[Clients: Admin]', Fg.Red), 'Removing entry', payload);

          const teamId = payload.teamId;
          const matterId = payload.matterId;

          if (typeof teamId !== 'string' || typeof matterId !== 'string') {
            console.error(colorize('[Clients: Admin]', Fg.Red), 'Invalid payload', payload);

            this.send('removeEntry:response', {
              success: false,
              message: 'Invalid payload'
            });

            return;
          }

          game.suspectDatabaseManager.removeEntry(teamId, matterId);

          this.send('removeEntry:response', {
            success: true,
          });
        }
      }
      // #endregion
    ]))
  }
}
