import { ripemd160 } from '@noble/hashes/legacy';
import { sha256 } from '@noble/hashes/sha2';
import { bech32 } from '@scure/base';
import type { Versions } from '@scure/bip32';
import type { BitcoinNetwork } from '../config/environment';
import { isBytes } from '../util/bytes';
import { WalletError } from '../util/errors';

/** BIP-84 chain: 0 = receive (external), 1 = change (internal). */
export type BitcoinChain = 0 | 1;

/** BIP-44 coin type per network: mainnet 0', every test network 1'. */
export const BITCOIN_COIN_TYPE: Readonly<Record<BitcoinNetwork, number>> = Object.freeze({ mainnet: 0, testnet4: 1 });

/** BIP-32 serialization versions (xpub/xprv, tpub/tprv). */
export const BITCOIN_BIP32_VERSIONS: Readonly<Record<BitcoinNetwork, Readonly<Versions>>> = Object.freeze({
  mainnet: Object.freeze({ private: 0x0488ade4, public: 0x0488b21e }),
  testnet4: Object.freeze({ private: 0x04358394, public: 0x043587cf }),
});

/** Segwit address HRP per network (BIP-173). */
export const BITCOIN_HRP: Readonly<Record<BitcoinNetwork, string>> = Object.freeze({ mainnet: 'bc', testnet4: 'tb' });

/** BIP-84 account 0: `m/84'/0'/0'` on mainnet, `m/84'/1'/0'` on testnet4. */
export function bitcoinAccountPath(network: BitcoinNetwork): string {
  return `m/84'/${coinType(network)}'/0'`;
}

export function bitcoinAddressPath(network: BitcoinNetwork, chain: BitcoinChain, index: number): string {
  checkChain(chain);
  checkIndex(index);
  return `${bitcoinAccountPath(network)}/${chain}/${index}`;
}

export function hash160(data: Uint8Array): Uint8Array {
  return ripemd160(sha256(data));
}

/** Native segwit v0 P2WPKH address (`bc1q…` / `tb1q…`) of a compressed public key. */
export function p2wpkhAddress(publicKey: Uint8Array, network: BitcoinNetwork): string {
  if (!isBytes(publicKey) || publicKey.length !== 33 || (publicKey[0] !== 0x02 && publicKey[0] !== 0x03)) {
    throw new WalletError('invalid-public-key', 'P2WPKH needs a 33-byte compressed public key');
  }
  return bech32.encode(BITCOIN_HRP[network], [0, ...bech32.toWords(hash160(publicKey))]);
}

export function checkChain(chain: number): asserts chain is BitcoinChain {
  if (chain !== 0 && chain !== 1) throw new WalletError('invalid-derivation-path', `Invalid BIP-84 chain: ${chain}`);
}

/** Non-hardened BIP-32 child index. */
export function checkIndex(index: number): void {
  if (!Number.isSafeInteger(index) || index < 0 || index >= 0x80000000) {
    throw new WalletError('invalid-derivation-path', `Invalid address index: ${index}`);
  }
}

function coinType(network: BitcoinNetwork): number {
  const coin = BITCOIN_COIN_TYPE[network];
  if (coin === undefined) throw new WalletError('invalid-network', `Unknown Bitcoin network: ${network}`);
  return coin;
}
