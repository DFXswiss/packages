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
    this.phishingDomains = new Set(snapshot.phishingDomains.map(canonicalHost));
    this.scamAddresses = new Set(snapshot.scamAddresses.map((a) => a.toLowerCase()));
  }

  /** Listed host, or a subdomain of one. A trailing DNS dot does not bypass the list. */
  isPhishingDomain(hostname: string): boolean {
    let host = canonicalHost(hostname);
    while (host.includes('.')) {
      if (this.phishingDomains.has(host)) return true;
      host = host.slice(host.indexOf('.') + 1);
    }
    return false;
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
      if (isStringArray(domains)) this.phishingDomains = new Set(domains.map(canonicalHost));
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

/** Lower case, trailing dots removed. The matcher never consults a single label such as `com`. */
function canonicalHost(value: string): string {
  return value.trim().toLowerCase().replace(/\.+$/, '');
}
