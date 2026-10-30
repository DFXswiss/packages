import { CachedPasskeyCredential, CredentialCache, CredentialStorage } from '../passkey/credential-cache';

class MemoryStorage implements CredentialStorage {
  readonly map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
}

function entry(credentialId: string, state: CachedPasskeyCredential['state'] = 'active'): CachedPasskeyCredential {
  return { credentialId, rpId: 'app.dfx.swiss', state, createdAt: 1_700_000_000_000 };
}

describe('CredentialCache', () => {
  it('stores entries per RP ID and keeps them across instances', () => {
    const storage = new MemoryStorage();
    const cache = new CredentialCache(storage, 'dfx.wallet.credentials.v1', 'app.dfx.swiss');
    cache.put(entry('id-1'));
    cache.put(entry('id-2', 'pending'));

    const reloaded = new CredentialCache(storage, 'dfx.wallet.credentials.v1', 'app.dfx.swiss');
    expect(
      reloaded
        .list()
        .map((e) => e.credentialId)
        .sort(),
    ).toEqual(['id-1', 'id-2']);
    expect(reloaded.list()[0].state).toBe('active');

    const otherRp = new CredentialCache(storage, 'dfx.wallet.credentials.v1', 'dev.app.dfx.swiss');
    expect(otherRp.list()).toEqual([]);
  });

  it('updates, removes and never proposes revoked ids again', () => {
    const cache = new CredentialCache(new MemoryStorage(), 'dfx.wallet.credentials.v1', 'app.dfx.swiss');
    cache.put(entry('id-1'));
    cache.put(entry('id-2'));
    cache.put(entry('id-3', 'revoked'));

    expect(cache.activeIds().sort()).toEqual(['id-1', 'id-2']);

    cache.update('id-1', { state: 'revoked', backupSeen: true });
    expect(cache.activeIds()).toEqual(['id-2']);
    expect(cache.list().find((e) => e.credentialId === 'id-1')).toMatchObject({ backupSeen: true });

    cache.remove('id-2');
    expect(cache.activeIds()).toEqual([]);
  });

  it('replaces an entry with the same credential id and survives broken storage content', () => {
    const storage = new MemoryStorage();
    const cache = new CredentialCache(storage, 'dfx.wallet.credentials.v1', 'app.dfx.swiss');
    cache.put({ ...entry('id-1'), seedCheckAddress: '0xold' });
    cache.put({ ...entry('id-1'), seedCheckAddress: '0xnew' });
    expect(cache.list()).toHaveLength(1);
    expect(cache.list()[0].seedCheckAddress).toBe('0xnew');

    storage.setItem('dfx.wallet.credentials.v1.app.dfx.swiss', 'not json');
    expect(cache.list()).toEqual([]);
  });
});
