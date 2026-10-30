import { IdleLock } from '../session/idle-lock';
import { TabLock } from '../session/tab-lock';

class FakeEventTarget {
  private readonly listeners = new Map<string, Set<() => void>>();
  private visibilityState = 'visible';

  addEventListener(type: string, listener: () => void): void {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type)!.add(listener);
  }

  removeEventListener(type: string, listener: () => void): void {
    this.listeners.get(type)?.delete(listener);
  }

  dispatch(type: string): void {
    for (const listener of this.listeners.get(type) ?? []) listener();
  }

  hide(): void {
    this.visibilityState = 'hidden';
    this.dispatch('visibilitychange');
  }

  show(): void {
    this.visibilityState = 'visible';
    this.dispatch('visibilitychange');
  }
}

describe('IdleLock', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('locks after the delay without activity', () => {
    const target = new FakeEventTarget();
    const onIdle = jest.fn();
    let now = 1_000_000;
    new IdleLock({ delay: 60_000, onIdle, target, now: () => now });

    now += 59_999;
    jest.advanceTimersByTime(59_999);
    expect(onIdle).not.toHaveBeenCalled();

    now += 1;
    jest.advanceTimersByTime(1);
    expect(onIdle).toHaveBeenCalledTimes(1);
  });

  it('activity pushes the lock back', () => {
    const target = new FakeEventTarget();
    const onIdle = jest.fn();
    let now = 0;
    new IdleLock({ delay: 1_000, onIdle, target, now: () => now });

    now += 29_999;
    jest.advanceTimersByTime(29_999);
    target.dispatch('pointerdown'); // touch at t=29'999
    now += 1;
    jest.advanceTimersByTime(1); // first 30 s tick: only 1 ms since the touch
    expect(onIdle).not.toHaveBeenCalled();

    now += 29_999;
    jest.advanceTimersByTime(29_999);
    now += 1;
    jest.advanceTimersByTime(1); // second tick: 30 s since the touch
    expect(onIdle).toHaveBeenCalledTimes(1);
  });

  it("locks on hidden in 'tab' mode and stops afterwards", () => {
    const target = new FakeEventTarget();
    const onIdle = jest.fn();
    const lock = new IdleLock({ delay: 'tab', onIdle, target });

    target.hide();
    expect(onIdle).toHaveBeenCalledTimes(1);
    lock.stop();
  });
});

async function flush(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe('TabLock', () => {
  /** Real Web Locks semantics: request() settles when the callback promise settles; a steal rejects it. */
  function locks() {
    const holders: { rejectRequest: (error: Error) => void }[] = [];
    const request = (
      _name: string,
      options: { ifAvailable?: boolean; steal?: boolean },
      callback: (lock: unknown) => Promise<void>,
    ) =>
      new Promise<undefined | 'acquired'>((resolveRequest, rejectRequest) => {
        const holder: { rejectRequest: (error: Error) => void } = { rejectRequest };
        if (options.steal) {
          for (const existing of holders.splice(0)) existing.rejectRequest(new Error('stolen'));
          holders.push(holder);
          void Promise.resolve(callback({})).catch(() => undefined);
          return; // stays pending while the callback holds the lock
        }
        if (options.ifAvailable) {
          if (holders.length > 0) {
            resolveRequest(undefined);
            return;
          }
          holders.push(holder);
          void Promise.resolve(callback({}))
            .catch(() => undefined)
            .finally(() => {
              const index = holders.indexOf(holder);
              if (index >= 0) holders.splice(index, 1);
            });
          return;
        }
        resolveRequest(undefined);
      });
    return { request };
  }

  it('acquires when free and reports busy while another tab holds the lock', async () => {
    const manager = locks();
    const first = new TabLock(manager as never);
    expect(await first.acquire()).toBe('acquired');

    const second = new TabLock(manager as never);
    expect(await second.acquire()).toBe('busy');

    first.release();
    await flush();
    expect(await second.acquire()).toBe('acquired');
  });

  it('takeOver releases the previous holder and informs its lost handler', async () => {
    const manager = locks();
    const first = new TabLock(manager as never);
    await first.acquire();
    const onLost = jest.fn();
    first.onLost(onLost);

    const second = new TabLock(manager as never);
    second.takeOver();
    await flush();

    expect(second.isHeld).toBe(true);
    expect(first.isHeld).toBe(false);
    expect(onLost).toHaveBeenCalledTimes(1);
  });
});
