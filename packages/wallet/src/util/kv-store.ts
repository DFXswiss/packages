import { WalletError } from './errors';

/**
 * Persistent key-value storage for local wallet data (never secrets). Entries are grouped in namespaces, e.g.
 * one per wallet and data kind, so several wallets on one device stay separated. Values must be
 * structured-cloneable; they are stored and returned as copies.
 */
export interface KeyValueStore {
  get<T = unknown>(namespace: string, key: string): Promise<T | undefined>;
  set(namespace: string, key: string, value: unknown): Promise<void>;
  delete(namespace: string, key: string): Promise<void>;
  /** Keys of a namespace in ascending order. */
  keys(namespace: string): Promise<string[]>;
  /** Removes every entry of a namespace. */
  clear(namespace: string): Promise<void>;
}

export const WALLET_DB_NAME = 'dfx-wallet';

const DB_VERSION = 1;
const OBJECT_STORE = 'kv';

/** In-memory store for tests, server-side rendering and browsers without IndexedDB. */
export class MemoryKeyValueStore implements KeyValueStore {
  private readonly data = new Map<string, Map<string, unknown>>();

  async get<T = unknown>(namespace: string, key: string): Promise<T | undefined> {
    checkKey(namespace, key);
    const entries = this.data.get(namespace);
    return entries?.has(key) ? (structuredClone(entries.get(key)) as T) : undefined;
  }

  async set(namespace: string, key: string, value: unknown): Promise<void> {
    checkKey(namespace, key);
    const copy = structuredClone(value);
    let entries = this.data.get(namespace);
    if (!entries) {
      entries = new Map();
      this.data.set(namespace, entries);
    }
    entries.set(key, copy);
  }

  async delete(namespace: string, key: string): Promise<void> {
    checkKey(namespace, key);
    const entries = this.data.get(namespace);
    entries?.delete(key);
    if (entries?.size === 0) this.data.delete(namespace);
  }

  async keys(namespace: string): Promise<string[]> {
    checkNamespace(namespace);
    return Array.from(this.data.get(namespace)?.keys() ?? []).sort();
  }

  async clear(namespace: string): Promise<void> {
    checkNamespace(namespace);
    this.data.delete(namespace);
  }
}

export interface IndexedDbKeyValueStoreOptions {
  /** Database name, default `dfx-wallet`. */
  name?: string;
  /** IndexedDB implementation, default `globalThis.indexedDB`. */
  indexedDB?: IDBFactory;
  /** Key range constructor of the same implementation, default `globalThis.IDBKeyRange`. */
  keyRange?: typeof IDBKeyRange;
}

/** IndexedDB store: one object store with compound keys `[namespace, key]`. */
export class IndexedDbKeyValueStore implements KeyValueStore {
  private readonly name: string;
  private readonly factory?: IDBFactory;
  private readonly keyRange?: typeof IDBKeyRange;
  private db?: Promise<IDBDatabase>;

  constructor(options: IndexedDbKeyValueStoreOptions = {}) {
    this.name = options.name ?? WALLET_DB_NAME;
    this.factory = options.indexedDB ?? globalThis.indexedDB;
    this.keyRange = options.keyRange ?? globalThis.IDBKeyRange;
  }

  async get<T = unknown>(namespace: string, key: string): Promise<T | undefined> {
    checkKey(namespace, key);
    return (await this.run('readonly', (store) => store.get([namespace, key]))) as T | undefined;
  }

  async set(namespace: string, key: string, value: unknown): Promise<void> {
    checkKey(namespace, key);
    await this.run('readwrite', (store) => store.put(value, [namespace, key]));
  }

  async delete(namespace: string, key: string): Promise<void> {
    checkKey(namespace, key);
    await this.run('readwrite', (store) => store.delete([namespace, key]));
  }

  async keys(namespace: string): Promise<string[]> {
    checkNamespace(namespace);
    const range = this.namespaceRange(namespace);
    const keys = await this.run('readonly', (store) => store.getAllKeys(range));
    return keys.map((compound) => (compound as [string, string])[1]);
  }

  async clear(namespace: string): Promise<void> {
    checkNamespace(namespace);
    const range = this.namespaceRange(namespace);
    await this.run('readwrite', (store) => store.delete(range));
  }

  // [namespace] sorts before every [namespace, key], and an array sorts after every string, so
  // [namespace, []] is an upper bound for all string keys of the namespace.
  private namespaceRange(namespace: string): IDBKeyRange {
    if (!this.keyRange) throw new WalletError('storage-unavailable', 'IDBKeyRange is not available');
    return this.keyRange.bound([namespace], [namespace, []]);
  }

  private open(): Promise<IDBDatabase> {
    if (!this.db) {
      const factory = this.factory;
      const db = new Promise<IDBDatabase>((resolve, reject) => {
        if (!factory) throw new WalletError('storage-unavailable', 'IndexedDB is not available');

        const request = factory.open(this.name, DB_VERSION);
        request.onupgradeneeded = () => {
          if (!request.result.objectStoreNames.contains(OBJECT_STORE)) request.result.createObjectStore(OBJECT_STORE);
        };
        request.onsuccess = () => {
          const opened = request.result;
          // Let a newer version in another tab upgrade the database; the next call reopens it.
          opened.onversionchange = () => {
            opened.close();
            this.db = undefined;
          };
          resolve(opened);
        };
        request.onerror = () =>
          reject(new WalletError('storage-unavailable', 'IndexedDB could not be opened', { cause: request.error }));
      });
      // A failed open is retried on the next call.
      db.catch(() => {
        if (this.db === db) this.db = undefined;
      });
      this.db = db;
    }
    return this.db;
  }

  private async run<T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
    const db = await this.open();
    return new Promise<T>((resolve, reject) => {
      const transaction = db.transaction(OBJECT_STORE, mode);
      const request = operation(transaction.objectStore(OBJECT_STORE));
      transaction.oncomplete = () => resolve(request.result);
      transaction.onerror = () =>
        reject(
          new WalletError('storage-failed', 'IndexedDB request failed', { cause: request.error ?? transaction.error }),
        );
      transaction.onabort = () =>
        reject(new WalletError('storage-failed', 'IndexedDB transaction aborted', { cause: transaction.error }));
    });
  }
}

/** IndexedDB store when the platform has IndexedDB, otherwise an in-memory store. */
export function createDefaultKeyValueStore(): KeyValueStore {
  return typeof globalThis.indexedDB !== 'undefined' ? new IndexedDbKeyValueStore() : new MemoryKeyValueStore();
}

function checkNamespace(namespace: string): void {
  if (typeof namespace !== 'string' || !namespace) throw new WalletError('invalid-storage-key', 'Empty namespace');
}

function checkKey(namespace: string, key: string): void {
  checkNamespace(namespace);
  if (typeof key !== 'string') throw new WalletError('invalid-storage-key', 'Key must be a string');
}
