import { FormFieldValue } from "../../shared/form";
import { Role } from "../../shared/roles";
import { colorize, Fg } from "../console";
import { Game } from "../game/game";
import { WebSocketClient, genericActions, handleActions } from "./client";
import WebSocket from 'ws';

export class TeamClient extends WebSocketClient {
  type: Role.Team = Role.Team;

  constructor (
    ws: WebSocket,
    id: string,
    public teamId: string,
    public teamName: string,
    userAgent?: string
  ) {
    super(ws, id, userAgent);

    const game = Game.get();

    ws.on('message', handleActions([
      ...genericActions(this),
      {
        action: 'help',
        handler: () => {
          console.log(colorize('[Client: Team]', Fg.Blue), 'Requesting help');
          const success = game.addHelpRequest(this.teamId);

          if (success) {
            this.send('help:response', {
              success: true
            });
          } else {
            this.send('help:response', {
              success: false,
              message: 'Hilfe ist bereits auf dem Weg'
            });
          }
        }
      },
      {
        action: 'vote',
        handler: (payload) => {
          console.log(colorize('[Client: Team]', Fg.Blue), 'Voting', payload);
          const vote = payload?.option;

          if (typeof vote !== 'string') {
            console.error(colorize('[Client: Team]', Fg.Blue), 'Invalid vote', vote)
            this.send('vote:response', {
              success: false,
              message: 'Invalid Format'
            })
            return
          }

          const success = game.voteManager.vote(this.teamId, vote)

          if (!success) {
            this.send('vote:response', {
              success: false,
              message: 'Invalid Vote'
            })
          }

          this.send('vote:response', {
            vote: vote,
            success: true
          })
        }
      },
      {
        action: 'suspectDatabaseEntry',
        handler: (payload) => {
          console.log(colorize('[Client: Team]', Fg.Blue), 'Adding suspect database entry', payload);
          const game = Game.get();
          const entryId = payload?.entryId;

          if (!entryId || typeof entryId !== 'string') {
            console.error(colorize('[Client: Team]', Fg.Blue), 'Invalid entry', entryId)
            this.send('suspectDatabaseEntry:response', {
              success: false,
              message: 'Invalid Format'
            })
            return
          }

          game.suspectDatabaseManager.addEntry(this.teamId, entryId)

          this.send('suspectDatabaseEntry:response', {
            success: true
          })
        }
      },
      {
        action: 'getSuspectDatabase',
        handler: () => {
          const game = Game.get();
          game.sendSuspectDatabaseToTeams(this);
        }
      },
      {
        action: 'unlockClue',
        handler: (payload) => {
          console.log(colorize('[Client: Team]', Fg.Blue), 'Unlocking clue', payload);
          const clueId = payload?.clueId;

          if (typeof clueId !== 'string') {
            console.error(colorize('[Client: Team]', Fg.Blue), 'Invalid clueId', clueId)
            this.send('unlockClue:response', {
              success: false,
              message: 'Invalid Format'
            })
            return
          }

          const success = game.clueManager.unlockClue(this.teamId, clueId)

          if (!success) {
            this.send('unlockClue:response', {
              success: false,
              message: 'Clue not available'
            })
            return
          }

          this.send('unlockClue:response', {
            success: true
          })
        }
      },
      {
        action: 'setMainClueUnlocked',
        handler: (payload) => {
          console.log(colorize('[Client: Team]', Fg.Blue), 'Setting main clue unlocked', payload);
          const unlocked = payload?.unlocked;

          if (typeof unlocked !== 'boolean') {
            console.error(colorize('[Client: Team]', Fg.Blue), 'Invalid unlocked', unlocked)
            this.send('setMainClueUnlocked:response', {
              success: false,
              message: 'Invalid Format'
            })
            return
          }

          game.clueManager.setMainClueUnlocked(this.teamId, unlocked)

          this.send('setMainClueUnlocked:response', {
            success: true
          })
        }
      },

      // #region Form
      {
        action: 'setField',
        handler: (payload) => {
          console.log(colorize('[Client: Team]', Fg.Blue), 'Setting form', payload);
          const fieldId = payload?.fieldId;
          const value = payload?.value;

          if (typeof fieldId !== 'string') {
            console.error(colorize('[Client: Team]', Fg.Blue), 'Invalid value', fieldId, value)
            return
          }

          game.formManager.setField(this.teamId, fieldId, value as FormFieldValue)
        }
      },
      {
        action: 'getForm',
        handler: () => {
          game.sendFormToTeamClient(this)
        }
      },
      {
        action: 'getFormPage',
        handler: () => {
          game.sendFormPageToTeamClient(this)
        }
      },
      {
        action: 'nextPage',
        handler: () => {
          game.formManager.goToNextFormPage(this.teamId)
        }
      },
      {
        action: 'submitForm',
        handler: () => {
          game.formManager.submitForm(this.teamId)
        }
      }
      // #endregion
    ]));
  }
}