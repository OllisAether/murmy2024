import { colorize, Fg } from "../../console";
import { Game } from "../game";
import { CueHandle, CueHandleCtx, CueHandleNext } from "./CueHandle";

export class SetMedia extends CueHandle {
  public start(next: CueHandleNext, ctx: CueHandleCtx<{
    media: string
  }>): void {
    console.log(colorize('[Cue: SetMedia]', Fg.Magenta), `Setting media to ${ctx.options.media}`);
    const media = ctx.getFieldValue(ctx.options.media);

    if (typeof media !== 'string') {
      console.warn(colorize('[Cue: SetMedia]', Fg.Magenta), 'Media is not a string');
      next();
      return;
    }

    Game.get().setMedia(media);
    next();
  }
  public stop(): void {}
}

export class WaitForMediaFinished extends CueHandle {
  private off: () => void;
  
  public start(next: CueHandleNext, ctx: CueHandleCtx<{}>): void {
    console.log(colorize('[Cue: WaitForMediaFinished]', Fg.Magenta), 'Start');

    if (!Game.get().getMedia()) {
      console.warn(colorize('[Cue: WaitForMediaFinished]', Fg.Magenta), 'No media');
      next();
      return;
    }

    this.off = Game.get().onMediaFinished(() => {
      next();
    })
  }
  public stop(): void {
    this.off?.();
    Game.get().mediaFinished();
  }
}