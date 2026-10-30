import type { WalletDataApi } from '@dfx.swiss/core';
import type { SnapshotBlocklists } from './snapshot';

/**
 * Local blocklist matching over the bundled snapshot, refreshed through the DFX list capability (§9.2).
 * Matching is local and synchronous; a failed refresh keeps the last state.
 */
export class Blocklists {
  private phishingDomains: Set<string>;
  private scamAddresses: Set<string>;
  refreshedAt?: Date;

  constructor(snapshot: SnapshotBlocklists) {
    this.phishingDomains = new Set(snapshot.phishingDomains.map((d) => d.toLowerCase()));
    this.scamAddresses = new Set(snapshot.scamAddresses.map((a) => a.toLowerCase()));
  }

  isPhishingDomain(hostname: string): boolean {
    return this.phishingDomains.has(hostname.toLowerCase());
  }

  isScamAddress(address: string): boolean {
    return this.scamAddresses.has(address.toLowerCase());
  }

  get sizes(): { phishingDomains: number; scamAddresses: number } {
    return { phishingDomains: this.phishingDomains.size, scamAddresses: this.scamAddresses.size };
  }

  /** Best-effort refresh through the DFX API; never throws. */
  async refresh(walletData: WalletDataApi, now = new Date()): Promise<void> {
    try {
      const [domains, addresses] = await Promise.all([
        walletData.list('PhishingDomains'),
        walletData.list('ScamAddresses'),
      ]);
      if (isStringArray(domains)) this.phishingDomains = new Set(domains.map((d) => d.toLowerCase()));
      if (isStringArray(addresses)) this.scamAddresses = new Set(addresses.map((a) => a.toLowerCase()));
      this.refreshedAt = now;
    } catch {
      // keep the bundled state; the next refresh retries
    }
  }
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}
