import type { ChainApi, WalletDataApi } from '@dfx.swiss/core';
import { ApiException } from '@dfx.swiss/core';
import { WalletError } from '../util/errors';

/** The DFX data capability is unreachable (rate-limited out, network, or paused server-side). */
export class ProviderUnavailableError extends WalletError {
  constructor(cause?: unknown) {
    super('provider-unavailable', 'The DFX wallet data capability is currently unavailable', { cause });
  }
}

export interface DfxDataOptions {
  /** Retries on 429/5xx with linear backoff (default 2). */
  retries?: number;
  backoffMs?: (attempt: number) => number;
}

/**
 * Every wallet data call goes through the DFX API (D8): two retries with backoff on 429/5xx, everything
 * else fails fast; after the last attempt the wallet shows "unavailable" instead of guessing.
 */
export class DfxData {
  constructor(
    private readonly walletData: WalletDataApi,
    private readonly chain: ChainApi,
    private readonly options: DfxDataOptions = {},
  ) {}

  async chains<T>(run: (chain: ChainApi) => Promise<T>): Promise<T> {
    return this.run(() => run(this.chain));
  }

  async query<T>(run: (walletData: WalletDataApi) => Promise<T>): Promise<T> {
    return this.run(() => run(this.walletData));
  }

  private async run<T>(call: () => Promise<T>): Promise<T> {
    const retries = this.options.retries ?? 2;
    const backoff = this.options.backoffMs ?? ((attempt: number) => 250 * (attempt + 1));

    for (let attempt = 0; ; attempt++) {
      try {
        return await call();
      } catch (error) {
        const retryable = error instanceof ApiException && (error.statusCode === 429 || error.statusCode >= 500);
        if (!retryable || attempt >= retries) {
          if (error instanceof WalletError) throw error;
          throw new ProviderUnavailableError(error);
        }
        await new Promise((resolve) => setTimeout(resolve, backoff(attempt)));
      }
    }
  }
}
