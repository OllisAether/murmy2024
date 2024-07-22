import { CueHandle } from "./CueHandle";

export class WaitForSkip extends CueHandle {
  public start(): void {
    console.log('[WaitForSkip] Start')
  }
  public stop(): void {}
}