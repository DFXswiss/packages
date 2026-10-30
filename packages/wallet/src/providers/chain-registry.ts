import type { Blockchain, ChainInfo } from '@dfx.swiss/core';
import type { BitcoinNetwork, WalletEnv } from '../config/environment';
import { WALLET_NETWORKS } from '../config/environment';
import type { WalletSnapshot } from './snapshot';
import { WalletError } from '../util/errors';

function bitcoinBlockchain(network: BitcoinNetwork): Blockchain {
  return network === 'mainnet' ? ('Bitcoin' as Blockchain) : ('BitcoinTestnet4' as Blockchain);
}

/**
 * The chains the wallet may use, from the DFX chain classification (D23) with a release-pinned snapshot as
 * the offline fallback. `walletSupported` already encodes the environment rule server-side (PRD: mainnets;
 * DEV/LOC: testnets + Spark); the registry additionally ties Bitcoin to the compiled network of the
 * environment and only ever exposes EVM chains with a numeric chain id.
 */
export class ChainRegistry {
  private constructor(
    private readonly chains: ChainInfo[],
    private readonly source: 'api' | 'snapshot',
  ) {}

  static fromApi(chains: ChainInfo[]): ChainRegistry {
    return new ChainRegistry(chains, 'api');
  }

  static fromSnapshot(snapshot: WalletSnapshot): ChainRegistry {
    return new ChainRegistry(snapshot.chains, 'snapshot');
  }

  get isLive(): boolean {
    return this.source === 'api';
  }

  all(): ChainInfo[] {
    return this.chains;
  }

  /** Bitcoin of this environment (PRD mainnet, DEV/LOC testnet4), `walletSupported` checked. */
  bitcoin(env: WalletEnv): ChainInfo {
    const network = WALLET_NETWORKS[env].bitcoin;
    const chain = this.chains.find((c) => c.blockchain === bitcoinBlockchain(network) && c.walletSupported);
    if (!chain) throw new WalletError('chain-unavailable', `Bitcoin (${network}) is not available in this environment`);
    return chain;
  }

  /** Every wallet-supported EVM chain of the environment kind; Haqq (no chain id) is never included. */
  evmChains(env: WalletEnv): ChainInfo[] {
    const kind = WALLET_NETWORKS[env].evm;
    return this.chains.filter(
      (chain) =>
        chain.family === 'Evm' &&
        chain.chainId !== undefined &&
        chain.walletSupported &&
        (kind === 'mainnet' ? !chain.isTestnet : chain.isTestnet),
    );
  }

  evmChain(chainId: number): ChainInfo {
    const chain = this.chains.find((c) => c.family === 'Evm' && c.chainId === chainId && c.walletSupported);
    if (!chain) throw new WalletError('chain-unavailable', `Chain ${chainId} is not wallet-supported`);
    return chain;
  }

  /** Spark runs on mainnet in every environment (D28). */
  spark(): ChainInfo {
    const chain = this.chains.find((c) => c.family === 'Spark' && c.walletSupported);
    if (!chain) throw new WalletError('chain-unavailable', 'Spark is not available in this environment');
    return chain;
  }
}
