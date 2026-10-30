import { CeremonySupersededError } from './errors';

/** One ceremony at a time: a run ticket that goes stale when a newer ceremony begins. */
export interface CeremonyRun {
  readonly id: number;
  /** Whether this run is still the newest one. */
  isCurrent(): boolean;
  /** Throws `CeremonySupersededError` when a newer ceremony has begun. */
  checkCurrent(): void;
  /** Marks the run as finished; stale runs may finish silently. */
  finish(): void;
}

/**
 * Serializes the wallet's passkey ceremonies: beginning a new run supersedes the previous one, and
 * `cancelActive()` supersedes without starting anything new (§6). Cancel handlers run synchronously —
 * they abort the underlying WebAuthn call where the platform allows an AbortSignal.
 */
export class CeremonyGate {
  private next = 0;
  private current?: number;
  private readonly cancelHandlers = new Map<number, Set<() => void>>();

  /** Begins a new run, superseding the previous one. */
  begin(onCancel?: () => void): CeremonyRun {
    const id = ++this.next;
    this.current = id;
    if (onCancel) this.cancelHandlers.set(id, new Set([onCancel]));

    return {
      id,
      isCurrent: () => this.current === id,
      checkCurrent: () => {
        if (this.current !== id) throw new CeremonySupersededError();
      },
      finish: () => {
        this.cancelHandlers.delete(id);
        if (this.current === id) this.current = undefined;
      },
    };
  }

  /** Supersedes the active run, if any, without starting a new one. */
  cancelActive(): void {
    const id = this.current;
    if (id === undefined) return;
    this.current = undefined;
    const handlers = this.cancelHandlers.get(id);
    this.cancelHandlers.delete(id);
    for (const handler of handlers ?? []) handler();
  }
}
