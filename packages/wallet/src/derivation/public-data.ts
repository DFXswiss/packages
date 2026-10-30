import { bytesToHex } from '../util/bytes';
import type { BitcoinNetwork } from '../config/environment';
import type { EvmAddress } from './evm-keys';
import type { KeyRing } from './keyring';

/**
 * Public data of a seed, cached per origin after a successful seed check so that addresses render while the
 * wallet is locked. Contains no secret.
 */
export interface SeedPublicData {
  seedCheckAddress: EvmAddress;
  evm: { index: number; address: EvmAddress }[];
  bitcoin: { network: BitcoinNetwork; xpub: string; fingerprint: string; receive0: string };
  spark: { identityPubkey: string; address: string };
}

export function seedPublicData(keys: KeyRing, evmIndexes: readonly number[] = [0]): SeedPublicData {
  const indexes = Array.from(new Set([0, ...evmIndexes])).sort((a, b) => a - b);
  const evm = indexes.map((index) => ({ index, address: keys.evm(index).address }));
  const account = keys.bitcoinAccount();
  const spark = keys.sparkIdentity();

  return {
    seedCheckAddress: evm[0].address,
    evm,
    bitcoin: {
      network: keys.bitcoinNetwork,
      xpub: account.xpub,
      fingerprint: account.fingerprint,
      receive0: keys.bitcoinAddress(0, 0).address,
    },
    spark: { identityPubkey: bytesToHex(spark.publicKey), address: spark.address },
  };
}
