import { Role } from "../../shared/roles";
import { validateCode } from "../../shared/teamcode";
import { Game } from "../game/game";
import { Team } from "../game/team";
import { idGen } from "../../shared/random";
import { WebSocketClient, handleActions } from "./client";
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

    ws.on('message', handleActions([
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

          if (Game.get().getTeams().find((t) => t.name === name)) {
            console.error('Name already exists', name);

            this.send('addTeam:response', {
              success: false,
              message: 'Name already exists'
            });

            return;
          }

          if (Game.get().getTeams().find((t) => t.code === code)) {
            console.error('Code already exists', code);

            this.send('addTeam:response', {
              success: false,
              message: 'Code already exists'
            });

            return;
          }

          Game.get().addTeam(new Team(
            idGen(),
            payload.name,
            payload.code
          ));

          this.send('teams', Game.get().getTeams());

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

          const team = Game.get().getTeams().find((t) => t.id === id);

          if (!team) {
            console.error('Team not found', id);

            this.send('editTeam:response', {
              success: false,
              message: 'Team not found'
            });

            return;
          }

          if (Game.get().getTeams().find((t) => t.name === name && t.id !== id)) {
            console.error('Name already exists', name);

            this.send('editTeam:response', {
              success: false,
              message: 'Name already exists'
            });

            return;
          }

          if (Game.get().getTeams().find((t) => t.code === code && t.id !== id)) {
            console.error('Code already exists', code);

            this.send('editTeam:response', {
              success: false,
              message: 'Code already exists'
            });

            return;
          }

          team.name = name;
          team.code = code;

          Game.get().saveTeams();

          this.send('teams', Game.get().getTeams());

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

          const team = Game.get().getTeams().find((t) => t.id === id);

          if (!team) {
            console.error('Team not found', id);

            this.send('removeTeam:response', {
              success: false,
              message: 'Team not found'
            });

            return;
          }

          Game.get().removeTeam(team);

          this.send('teams', Game.get().getTeams());

          this.send('removeTeam:response', {
            success: true,
          });
        }
      },
      {
        action: 'getTeams',
        handler: () => {
          console.log('Getting teams', Game.get().getTeams());
          this.send('teams', Game.get().getTeams());
        }
      },
      // #endregion

      // #region Client management
      {
        action: 'getClients',
        handler: () => {
          Game.get().sendClientsToAdmins(this);
        }
      },
      {
        action: 'kickClient',
        handler: (payload) => {
          console.log('Kicking client', payload);

          const id = payload.id;

          const client = Game.get().getClient(id);

          if (!client) {
            console.error('Client not found', id);

            this.send('kickClient:response', {
              success: false,
              message: 'Client not found'
            });

            return;
          }

          Game.get().removeClient(client);
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

          const client = Game.get().getClient(id);

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

          if (Game.get().getClients().find((c) => c.type === Role.Team && (c as TeamClient).teamId === teamId)) {
            console.error('Team already linked to a client', teamId);

            this.send('setClientTeam:response', {
              success: false,
              message: 'Team already linked to a client'
            });

            return;
          }

          Game.get().promoteClientToTeam(clientId, teamId);
        }
      },
      {
        action: 'setClientBoard',
        handler: (payload) => {
          console.log('Setting client board', payload);

          const clientId = payload.clientId;

          if (Game.get().getClients().find((c) => c.type === Role.Board)) {
            console.error('Board already exists');

            this.send('setClientBoard:response', {
              success: false,
              message: 'Board already exists'
            });

            return;
          }

          Game.get().promoteClientToBoard(clientId);
        }
      },
      // #endregion

      // #region Help
      {
        action: 'getHelpRequests',
        handler: () => {
          Game.get().sendHelpRequestsToAdmins(this);
        }
      },
      {
        action: 'removeHelpRequest',
        handler: (payload) => {
          console.log('Removing help request', payload);

          const teamId = payload.teamId;

          Game.get().removeHelpRequest(teamId);
        }
      },

      {
        action: 'logout',
        handler: () => {
          Game.get().removeClient(this);
        }
      }
    ]))
  }
}
