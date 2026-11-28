import type { WalletBitcoinBlockchain } from '@dfx.swiss/core';
import type { BitcoinNetwork, WalletEnv } from './environment';
import { isRegtestAllowed, WALLET_NETWORKS } from './environment';

/** wallet-api `:blockchain` of each wallet Bitcoin network. */
export const WALLET_API_BITCOIN_BLOCKCHAINS: Readonly<Record<BitcoinNetwork, WalletBitcoinBlockchain>> = Object.freeze({
  mainnet: 'Bitcoin',
  testnet4: 'BitcoinTestnet4',
  regtest: 'BitcoinRegtest',
});

/**
 * Bitcoin network of the wallet-api passkey wallet: mainnet on PRD; regtest (HRP `bcrt`, coin type 1') in every
 * environment {@link isRegtestAllowed} admits (default DEV, STG, LOC); otherwise the environment's network.
 */
export function walletApiBitcoinNetwork(env: WalletEnv, regtestEnvs?: readonly WalletEnv[]): BitcoinNetwork {
  if (env === 'prd') return 'mainnet';
  return isRegtestAllowed(env, regtestEnvs) ? 'regtest' : WALLET_NETWORKS[env].bitcoin;
}
