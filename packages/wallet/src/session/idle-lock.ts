/** When the wallet locks itself after inactivity (D5): 60 minutes by default, or when the tab hides. */
export type IdleDelay = number | 'tab';

export interface IdleLockOptions {
  delay: IdleDelay;
  onIdle(): void;
  target?: EventTarget;
  now?: () => number;
}

const CHECK_INTERVAL_MS = 30_000;
const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;

/**
 * Idle auto-lock: activity touches the timer, a 30 s tick and `visibilitychange` check it (background
 * timers are throttled). `'tab'` locks as soon as the page hides. The check never locks on a hidden page
 * with a plain delay — only on the tick after it becomes visible again.
 */
export class IdleLock {
  private readonly events: EventTarget;
  private readonly now: () => number;
  private lastActivity: number;
  private timer?: ReturnType<typeof setInterval>;
  private stopped = false;

  constructor(private readonly options: IdleLockOptions) {
    this.events = options.target ?? (globalThis as unknown as EventTarget);
    this.now = options.now ?? Date.now;
    this.lastActivity = this.now();
    this.start();
  }

  touch(): void {
    this.lastActivity = this.now();
  }

  stop(): void {
    this.stopped = true;
    if (this.timer !== undefined) clearInterval(this.timer);
    this.timer = undefined;
    for (const type of ACTIVITY_EVENTS) this.events.removeEventListener(type, this.onActivity);
    this.events.removeEventListener('visibilitychange', this.onVisibility);
  }

  private start(): void {
    for (const type of ACTIVITY_EVENTS) this.events.addEventListener(type, this.onActivity, { passive: true });
    this.events.addEventListener('visibilitychange', this.onVisibility);
    if (typeof this.options.delay === 'number') {
      this.timer = setInterval(() => this.check(), CHECK_INTERVAL_MS);
    }
  }

  private onActivity = (): void => {
    this.touch();
  };

  private onVisibility = (): void => {
    if (this.stopped) return;
    const document = this.events as unknown as { visibilityState?: string };
    if (this.options.delay === 'tab' && document.visibilityState === 'hidden') this.lock();
    if (document.visibilityState === 'visible') this.check();
  };

  private check(): void {
    if (this.stopped) return;
    if (typeof this.options.delay === 'number' && this.now() - this.lastActivity >= this.options.delay) this.lock();
  }

  private lock(): void {
    if (this.stopped) return;
    this.stop();
    this.options.onIdle();
  }
}
