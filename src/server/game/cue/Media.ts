import { CueType } from "../../../shared/cue/CueTypes";
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

export class WhenMediaAt extends CueHandle {
  private off?: () => void;

  public start(next: CueHandleNext, ctx: CueHandleCtx<{
    time: number // in milliseconds
    executeIfAlreadyAtTime?: boolean
  }>): void {
    console.log(colorize('[Cue: WhenMediaAt]', Fg.Magenta), `Waiting for media to reach ${ctx.options.time}ms`);

    const executeIfAlreadyAtTime = ctx.getFieldValue(ctx.options.executeIfAlreadyAtTime) ?? true;
    const time = ctx.getFieldValue(ctx.options.time);

    if (typeof time !== 'number') {
      console.warn(colorize('[Cue: WhenMediaAt]', Fg.Magenta), 'Time is not a number');
      skip();
      return;
    }

    const game = Game.get();

    if (game.getMedia()) {
      if (game.getProgress() /* in Seconds */ * 1000 >= time) {
        if (!executeIfAlreadyAtTime) {
          console.warn(colorize('[Cue: WhenMediaAt]', Fg.Magenta), 'Media is already at time, skipping');
          skip();
          return;
        } else {
          console.warn(colorize('[Cue: WhenMediaAt]', Fg.Magenta), 'Media is already at time, executing');
          next();
        }
        return;
      }

      const offMediaTime = game.onMediaTime(time, () => {
        next();
      })

      const offMediaFinished = game.onMediaFinished(() => {
        skip();
      })

      this.off = () => {
        offMediaTime();
        offMediaFinished();
      }
    } else {
      skip();
    }

    function skip () {
      console.warn(colorize('[Cue: WhenMediaAt]', Fg.Magenta), 'No media, skipping');

      // Find the next ElseIf or Else or EndIf
      let ignore = 0
      for (let i = ctx.index + 1; i < ctx.playback.cues.length; i++) {
        const cue = ctx.playback.cues[i]

        if (cue.type === CueType.If) {
          ignore++
        }

        if (cue.type === CueType.ElseIf || cue.type ===  CueType.Else || cue.type === CueType.EndIf) {
          if (ignore === 0) {
            next(i, {
              dontSkip: true
            })
            return
          }

          if (cue.type === CueType.EndIf) {
            ignore--
          }
        }
      }

      // No ElseIf or Else or EndIf found
      console.warn(colorize('[Cue: WhenMediaAt]', Fg.Magenta), 'No ElseIf or Else or EndIf found')
      next()
    }
  }
  public stop(): void {
    this.off?.();
  }
}

export class WaitForMediaFinished extends CueHandle {
  private off?: () => void;
  
  public start(next: CueHandleNext): void {
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