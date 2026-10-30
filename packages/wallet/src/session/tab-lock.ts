/** Web Locks surface the wallet needs (browsers and fakes in tests). */
export interface LockManagerLike {
  request(
    name: string,
    options: { mode?: string; ifAvailable?: boolean; steal?: boolean },
    callback: (lock: unknown) => Promise<void>,
  ): Promise<undefined | 'acquired'>;
}

/**
 * Whether this tab owns the wallet (X24): one open wallet per browser, "use here" steals the lock. The
 * lock is held from inside the request callback; a stolen lock rejects the request and informs the
 * `onLost` handlers, exactly like the Web Locks API.
 */
export class TabLock {
  private held = false;
  private lostHandlers: (() => void)[] = [];
  private releaseResolver?: () => void;

  constructor(
    private readonly locks: LockManagerLike | undefined = (
      globalThis.navigator as unknown as { locks?: LockManagerLike }
    )?.locks,
    private readonly name = 'dfx-wallet',
  ) {}

  get isHeld(): boolean {
    return this.held;
  }

  /** Acquires the lock when free; never waits. */
  acquire(): Promise<'acquired' | 'busy'> {
    const locks = this.locks;
    if (!locks) {
      this.held = true;
      return Promise.resolve('acquired');
    }
    return new Promise((resolve) => {
      let settled = false;
      const finish = (result: 'acquired' | 'busy'): void => {
        if (!settled) {
          settled = true;
          resolve(result);
        }
      };

      void locks
        .request(this.name, { ifAvailable: true }, async () => {
          this.held = true;
          finish('acquired');
          await new Promise<void>((resolveRelease) => (this.releaseResolver = resolveRelease));
          this.held = false;
        })
        .catch(() => this.onStolen())
        .finally(() => finish(this.held ? 'acquired' : 'busy'));
    });
  }

  /** "Use here": takes the lock from the other tab; the loser is informed through `onLost`. */
  takeOver(): void {
    if (!this.locks) {
      this.held = true;
      return;
    }
    const locks = this.locks;
    if (!locks) {
      this.held = true;
      return;
    }
    void locks
      .request(this.name, { steal: true }, async () => {
        this.held = true;
        await new Promise<void>(() => undefined); // holds until the next steal takes it over
      })
      .catch(() => this.onStolen());
  }

  onLost(callback: () => void): void {
    this.lostHandlers.push(callback);
  }

  release(): void {
    this.held = false;
    this.releaseResolver?.();
    this.releaseResolver = undefined;
  }

  private onStolen(): void {
    this.held = false;
    for (const handler of this.lostHandlers.splice(0)) handler();
  }
}
