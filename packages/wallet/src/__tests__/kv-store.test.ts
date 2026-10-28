import { isWalletError } from '../util/errors';
import { createDefaultKeyValueStore, MemoryKeyValueStore } from '../util/kv-store';

describe('MemoryKeyValueStore', () => {
  let store: MemoryKeyValueStore;

  beforeEach(() => {
    store = new MemoryKeyValueStore();
  });

  it('returns undefined for missing entries', async () => {
    await expect(store.get('wallet-a', 'missing')).resolves.toBeUndefined();
    await expect(store.keys('wallet-a')).resolves.toEqual([]);
  });

  it('stores, overwrites and deletes values', async () => {
    await store.set('wallet-a', 'settings', { currency: 'CHF' });
    await expect(store.get('wallet-a', 'settings')).resolves.toEqual({ currency: 'CHF' });

    await store.set('wallet-a', 'settings', { currency: 'EUR' });
    await expect(store.get('wallet-a', 'settings')).resolves.toEqual({ currency: 'EUR' });

    await store.delete('wallet-a', 'settings');
    await expect(store.get('wallet-a', 'settings')).resolves.toBeUndefined();
    await expect(store.delete('wallet-a', 'settings')).resolves.toBeUndefined();
  });

  it('keeps falsy values apart from missing entries', async () => {
    await store.set('wallet-a', 'zero', 0);
    await store.set('wallet-a', 'null', null);
    await expect(store.get('wallet-a', 'zero')).resolves.toBe(0);
    await expect(store.get('wallet-a', 'null')).resolves.toBeNull();
    await expect(store.keys('wallet-a')).resolves.toEqual(['null', 'zero']);
  });

  it('stores and returns copies', async () => {
    const value = { labels: ['a'], amount: 1n, at: new Date(0), bytes: new Uint8Array([1, 2]) };
    await store.set('wallet-a', 'entry', value);
    value.labels.push('b');

    const first = await store.get<typeof value>('wallet-a', 'entry');
    expect(first).toEqual({ labels: ['a'], amount: 1n, at: new Date(0), bytes: new Uint8Array([1, 2]) });

    first?.labels.push('c');
    await expect(store.get('wallet-a', 'entry')).resolves.toEqual(expect.objectContaining({ labels: ['a'] }));
  });

  it('refuses values that are not structured-cloneable', async () => {
    await expect(store.set('wallet-a', 'fn', () => 1)).rejects.toThrow();
    await expect(store.get('wallet-a', 'fn')).resolves.toBeUndefined();
  });

  it('separates namespaces', async () => {
    await store.set('wallet-a', 'k', 'a');
    await store.set('wallet-b', 'k', 'b');
    await expect(store.get('wallet-a', 'k')).resolves.toBe('a');
    await expect(store.get('wallet-b', 'k')).resolves.toBe('b');

    await store.clear('wallet-a');
    await expect(store.get('wallet-a', 'k')).resolves.toBeUndefined();
    await expect(store.keys('wallet-a')).resolves.toEqual([]);
    await expect(store.get('wallet-b', 'k')).resolves.toBe('b');
  });

  it('lists the keys of a namespace in ascending order', async () => {
    for (const key of ['tx:2', 'addr:1', 'tx:10', 'addr:0']) await store.set('wallet-a', key, key);
    await store.set('wallet-b', 'other', 1);
    await expect(store.keys('wallet-a')).resolves.toEqual(['addr:0', 'addr:1', 'tx:10', 'tx:2']);
  });

  it('refuses an empty namespace', async () => {
    const error = await store.get('', 'k').catch((e) => e);
    expect(isWalletError(error, 'invalid-storage-key')).toBe(true);
    await expect(store.set('', 'k', 1)).rejects.toThrow('Empty namespace');
    await expect(store.keys('')).rejects.toThrow('Empty namespace');
    await expect(store.clear('')).rejects.toThrow('Empty namespace');
  });
});

describe('createDefaultKeyValueStore', () => {
  it('falls back to memory without IndexedDB', () => {
    expect(globalThis.indexedDB).toBeUndefined();
    expect(createDefaultKeyValueStore()).toBeInstanceOf(MemoryKeyValueStore);
  });
});
