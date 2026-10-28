export type Listener<T> = (payload: T) => void;

/**
 * Minimal typed event emitter. A throwing listener neither stops the other listeners nor the emitting code;
 * its error goes to `onListenerError`, by default rethrown asynchronously so that it still surfaces.
 */
export class Emitter<Events extends object> {
  private readonly listeners = new Map<keyof Events, Set<Listener<any>>>();

  constructor(private readonly onListenerError: (error: unknown) => void = rethrowAsync) {}

  /** Registers a listener and returns a function that removes it. */
  on<E extends keyof Events>(event: E, listener: Listener<Events[E]>): () => void {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    set.add(listener);
    return () => this.off(event, listener);
  }

  off<E extends keyof Events>(event: E, listener: Listener<Events[E]>): void {
    const set = this.listeners.get(event);
    if (!set) return;
    set.delete(listener);
    if (set.size === 0) this.listeners.delete(event);
  }

  emit<E extends keyof Events>(event: E, payload: Events[E]): void {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const listener of Array.from(set)) {
      try {
        listener(payload);
      } catch (error) {
        this.onListenerError(error);
      }
    }
  }

  listenerCount(event: keyof Events): number {
    return this.listeners.get(event)?.size ?? 0;
  }

  removeAllListeners(): void {
    this.listeners.clear();
  }
}

function rethrowAsync(error: unknown): void {
  setTimeout(() => {
    throw error;
  }, 0);
}
