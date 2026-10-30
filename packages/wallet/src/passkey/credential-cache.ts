import type { SeedPublicData } from '../derivation/public-data';

/** Public, non-secret per-credential record cached per origin after a server-verified seed check (§11.4). */
export interface CachedPasskeyCredential {
  /** Credential id, base64url. */
  credentialId: string;
  rpId: string;
  state: 'pending' | 'active' | 'revoked';
  seedCheckAddress?: string;
  publicData?: SeedPublicData;
  backupEligible?: boolean;
  backupSeen?: boolean;
  createdAt: number;
}

/** Storage abstraction: the browser's `localStorage`, or anything with the same shape in tests. */
export interface CredentialStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

class MemoryStorage implements CredentialStorage {
  private readonly map = new Map<string, string>();
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

/**
 * The credential list of one RP ID in `localStorage` (`dfx.wallet.credentials.v1`): public data only —
 * never PRF bytes, mnemonics or signatures. Written after a server-verified seed check; feeds
 * `excludeCredentials` with every non-revoked credential id.
 */
export class CredentialCache {
  private readonly key: string;

  constructor(
    private readonly storage: CredentialStorage = defaultStorage(),
    key = 'dfx.wallet.credentials.v1',
    private readonly rpId: string = '',
  ) {
    this.key = `${key}.${this.rpId}`;
  }

  list(): CachedPasskeyCredential[] {
    try {
      const raw = this.storage.getItem(this.key);
      const parsed = raw ? (JSON.parse(raw) as unknown) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isCachedCredential);
    } catch {
      return [];
    }
  }

  put(entry: CachedPasskeyCredential): void {
    const all = this.list().filter((existing) => existing.credentialId !== entry.credentialId);
    all.push(entry);
    this.write(all);
  }

  update(credentialId: string, patch: Partial<Omit<CachedPasskeyCredential, 'credentialId' | 'rpId'>>): void {
    const all = this.list();
    const entry = all.find((existing) => existing.credentialId === credentialId);
    if (!entry) return;
    Object.assign(entry, patch);
    this.write(all);
  }

  remove(credentialId: string): void {
    this.write(this.list().filter((existing) => existing.credentialId !== credentialId));
  }

  /** Credential ids that must not be created again: everything not revoked. */
  activeIds(): string[] {
    return this.list()
      .filter((entry) => entry.state !== 'revoked')
      .map((entry) => entry.credentialId);
  }

  private write(all: CachedPasskeyCredential[]): void {
    this.storage.setItem(this.key, JSON.stringify(all));
  }
}

function defaultStorage(): CredentialStorage {
  try {
    return (globalThis as unknown as { localStorage?: CredentialStorage }).localStorage ?? new MemoryStorage();
  } catch {
    return new MemoryStorage();
  }
}

function isCachedCredential(value: unknown): value is CachedPasskeyCredential {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry['credentialId'] === 'string' &&
    typeof entry['rpId'] === 'string' &&
    (entry['state'] === 'pending' || entry['state'] === 'active' || entry['state'] === 'revoked') &&
    typeof entry['createdAt'] === 'number'
  );
}
