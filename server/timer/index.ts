export class Timer {
  private startTime: number | null = null
  private currentTime: number = 0
  private duration: number = 60 * 1000
  private state: 'stopped' | 'running' | 'paused' = 'stopped'

  constructor() { }

  public getStartTime() {
    return this.startTime
  }

  public getDuration() {
    return this.duration
  }

  public getState() {
    return this.state
  }

  public getElapsedTime() {
    if (this.startTime === null) {
      return this.currentTime
    }
    
    return Math.max(0, Math.min(this.duration, Date.now() - this.startTime))
  }

  public getRemainingTime() {
    return this.duration - this.getElapsedTime()
  }

  private INTERVAL_TIME = 500
  private interval: NodeJS.Timeout | null = null
  private startInterval() {
    if (this.interval) {
      clearInterval(this.interval)
    }

    this.interval = setInterval(() => {
      this.currentTime = this.getElapsedTime()
      const remainingTime = this.getRemainingTime()

      this.emitTick()

      if (remainingTime <= 0) {
        this.finish()
      }
    }, this.INTERVAL_TIME)
  }
  private stopInterval() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  setDuration(duration: number) {
    console.log('[Timer] Setting Timer duration', duration)
    this.duration = duration
    this.emitUpdated()
  }

  setTime(time: number) {
    console.log('[Timer] Setting Timer time', time)

    this.startTime = Date.now() - time
    this.currentTime = time
    this.emitUpdated()
  }

  public start(duration?: number, delay?: number) {
    if (duration) {
      this.setDuration(duration)
    }

    console.log('[Timer] Starting timer')

    this.state = 'running'
    this.startTime = Date.now() + 1000 + (delay ?? 0)
    this.startInterval()
    this.emitStart()

    return new Promise<void>((resolve) => {
      this.onceFinished(() => {
        resolve()
      })
    })
  }

  public resume() {
    if (this.state === 'running') {
      return
    }

    console.log('[Timer] Resuming timer')

    this.state = 'running'
    this.startTime = Date.now() - this.currentTime
    this.startInterval()
    this.emitStart()
  }

  public pause() {
    if (this.state === 'paused') {
      return
    }

    console.log('[Timer] Pausing timer')

    this.state = 'paused'
    this.stopInterval()
    this.startTime = null
    this.emitPause()
  }

  public stop() {
    console.log('[Timer] Stopping timer', this.state)

    this.state = 'stopped'
    this.stopInterval()
    this.startTime = null
    this.currentTime = 0
    this.emitStopped()
  }

  public finish () {
    console.log('[Timer] Finishing timer')

    this.state = 'stopped'
    this.stopInterval()
    this.startTime = null
    this.currentTime = 0
    this.emitFinished()
  }

  private onFinishedListeners: (() => void)[] = []
  public onFinished(callback: () => void) {
    this.onFinishedListeners.push(callback)
    return () => this.offFinished(callback)
  }
  public offFinished(callback: () => void) {
    this.onFinishedListeners = this.onFinishedListeners.filter(listener => listener !== callback)
  }
  public onceFinished(callback: () => void) {
    function cb () {
      callback()
      off()
    }

    const off = this.onFinished(cb)

    return off
  }
  private emitFinished() {
    this.onFinishedListeners.forEach(listener => listener())
  }

  private onStartListeners: ((startTime: number | null, duration: number) => void)[] = []
  public onStart(callback: (startTime: number | null, duration: number) => void) {
    this.onStartListeners.push(callback)
    return () => this.offStart(callback)
  }
  public offStart(callback: (startTime: number | null, duration: number) => void) {
    this.onStartListeners = this.onStartListeners.filter(listener => listener !== callback)
  }
  public onceStart(callback: (startTime: number | null, duration: number) => void) {
    function cb (startTime: number | null, duration: number) {
      callback(startTime, duration)
      off()
    }

    const off = this.onStart(cb)

    return off
  }
  private emitStart() {
    this.onStartListeners.forEach(listener => listener(this.startTime, this.duration))
  }

  private onPauseListeners: (() => void)[] = []
  public onPause(callback: () => void) {
    this.onPauseListeners.push(callback)
    return () => this.offPause(callback)
  }
  public offPause(callback: () => void) {
    this.onPauseListeners = this.onPauseListeners.filter(listener => listener !== callback)
  }
  public oncePause(callback: () => void) {
    function cb () {
      callback()
      off()
    }

    const off = this.onPause(cb)

    return off
  }
  private emitPause() {
    this.onPauseListeners.forEach(listener => listener())
  }

  private onStoppedListeners: (() => void)[] = []
  public onStopped(callback: () => void) {
    this.onStoppedListeners.push(callback)
    return () => this.offStopped(callback)
  }
  public offStopped(callback: () => void) {
    this.onStoppedListeners = this.onStoppedListeners.filter(listener => listener !== callback)
  }
  public onceStopped(callback: () => void) {
    function cb () {
      callback()
      off()
    }

    const off = this.onStopped(cb)

    return off
  }
  private emitStopped() {
    this.onStoppedListeners.forEach(listener => listener())
  }

  private onUpdatedListeners: ((startTime: number | null, duration: number) => void)[] = []
  public onUpdated(callback: (startTime: number | null, duration: number) => void) {
    this.onUpdatedListeners.push(callback)
  }
  private emitUpdated() {
    this.onUpdatedListeners.forEach(listener => listener(this.startTime, this.duration))
  }

  private onTickListeners: ((remainingTime: number) => void)[] = []
  public onTick(callback: (remainingTime: number) => void) {
    this.onTickListeners.push(callback)
  }
  private emitTick() {
    this.onTickListeners.forEach(listener => listener(this.getRemainingTime()))
  }
}