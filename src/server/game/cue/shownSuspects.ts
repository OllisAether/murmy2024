import { colorize, Fg } from "../../console";
import { Game } from "../game";
import { CueHandle, CueHandleCtx, CueHandleNext } from "./CueHandle";

export class AddShownSuspects extends CueHandle {
  public start(next: CueHandleNext, ctx: CueHandleCtx<{
    suspects: string[]
  }>): void {
    const suspects = ctx.getFieldValue(ctx.options.suspects) as string[];

    if (!Array.isArray(suspects)) {
      console.error(colorize('[Cue: AddShownSuspects]', Fg.Magenta), 'Invalid suspects', suspects);
      next();
      return;
    }

    const game = Game.get();

    for (const suspect of suspects) {
      game.suspectDatabaseManager.addShownSuspect(suspect);
    }

    next();
  }
  public stop(): void {}
}