import type { WalletDataApi, WalletPrice } from '@dfx.swiss/core';
import { ProviderUnavailableError } from './dfx-data';

/** A price older than this is stale; a stale price must not enter a fiat amount (§9.6). */
export const PRICE_STALE_MS = 5 * 60 * 1000;

export type PricedAsset = { assetId: number; price?: number; stale?: boolean };

export interface PricePolicyOptions {
  now?: () => number;
}

/**
 * Fiat prices of public assets, always by asset id — never by symbol (D32). A missing asset is simply
 * unpriced ("–"); a stale price is returned as stale so callers can refuse fiat entry (§9.6). Prices never
 * feed fee caps.
 */
export class PricePolicy {
  constructor(
    private readonly walletData: WalletDataApi,
    private readonly options: PricePolicyOptions = {},
  ) {}

  async prices(
    assetIds: number[],
    currency: string,
    now = this.options.now ?? Date.now,
  ): Promise<Map<number, { price: number; stale: boolean }>> {
    const clock = now();
    const ids = [...new Set(assetIds)].slice(0, 100);
    let remote: WalletPrice[] = [];
    try {
      remote = await this.walletData.prices({ assetIds: ids, currency });
    } catch (error) {
      if (error instanceof ProviderUnavailableError) return new Map();
      throw error;
    }

    const result = new Map<number, { price: number; stale: boolean }>();
    for (const entry of remote) {
      if (typeof entry.price !== 'number' || !Number.isFinite(entry.price)) continue;
      const timestamp = Date.parse(entry.timestamp);
      result.set(entry.assetId, {
        price: entry.price,
        stale: Number.isNaN(timestamp) || clock - timestamp > PRICE_STALE_MS,
      });
    }
    return result;
  }

  /** Convenience: price with staleness, or `undefined` when the asset has none. */
  priceOf(
    prices: Map<number, { price: number; stale: boolean }>,
    assetId: number,
  ): { price: number; stale: boolean } | undefined {
    return prices.get(assetId);
  }
}
