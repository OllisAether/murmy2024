import { Game } from "../game";
import { CueHandle, CueHandleCtx, CueHandleNext } from "./CueHandle";

export class SetMedia extends CueHandle {
  public start(next: CueHandleNext, ctx: CueHandleCtx<{
    media: string
  }>): void {
    console.log(`[SetMedia] Setting media to ${ctx.options.media}`);
    const media = ctx.getFieldValue(ctx.options.media);

    if (typeof media !== 'string') {
      console.error(`[SetMedia] Media is not a string`);
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
    console.log(`[WaitForMediaFinished] Waiting for media to finish`);

    this.off = Game.get().onMediaFinished(() => {
      next();
    })
  }
  public stop(): void {
    this.off();
  }
}