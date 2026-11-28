import { ripemd160 } from '@noble/hashes/legacy';
import { sha256 } from '@noble/hashes/sha2';
import { bech32 } from '@scure/base';
import type { Versions } from '@scure/bip32';
import type { BitcoinNetwork } from '../config/environment';
import { equalBytes, isBytes } from '../util/bytes';
import { WalletError } from '../util/errors';

/** BIP-84 chain: 0 = receive (external), 1 = change (internal). */
export type BitcoinChain = 0 | 1;

/** BIP-44 coin type per network: mainnet 0', every test network 1'. */
export const BITCOIN_COIN_TYPE: Readonly<Record<BitcoinNetwork, number>> = Object.freeze({
  mainnet: 0,
  testnet4: 1,
  regtest: 1,
});

const TESTNET_BIP32_VERSIONS: Readonly<Versions> = Object.freeze({ private: 0x04358394, public: 0x043587cf });

/** BIP-32 serialization versions (xpub/xprv; tpub/tprv on testnet4 and regtest). */
export const BITCOIN_BIP32_VERSIONS: Readonly<Record<BitcoinNetwork, Readonly<Versions>>> = Object.freeze({
  mainnet: Object.freeze({ private: 0x0488ade4, public: 0x0488b21e }),
  testnet4: TESTNET_BIP32_VERSIONS,
  regtest: TESTNET_BIP32_VERSIONS,
});

/** Segwit address HRP per network (BIP-173; `bcrt` is the HRP of Bitcoin Core's regtest). */
export const BITCOIN_HRP: Readonly<Record<BitcoinNetwork, string>> = Object.freeze({
  mainnet: 'bc',
  testnet4: 'tb',
  regtest: 'bcrt',
});

/** Base58 address and WIF versions per network (regtest shares the testnet values). */
export const BITCOIN_BASE58_VERSIONS: Readonly<
  Record<BitcoinNetwork, Readonly<{ pubKeyHash: number; scriptHash: number; wif: number }>>
> = Object.freeze({
  mainnet: Object.freeze({ pubKeyHash: 0x00, scriptHash: 0x05, wif: 0x80 }),
  testnet4: Object.freeze({ pubKeyHash: 0x6f, scriptHash: 0xc4, wif: 0xef }),
  regtest: Object.freeze({ pubKeyHash: 0x6f, scriptHash: 0xc4, wif: 0xef }),
});

/** BIP-84 account 0: `m/84'/0'/0'` on mainnet, `m/84'/1'/0'` on testnet4 and regtest. */
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

/** Native segwit v0 P2WPKH address (`bc1q…` / `tb1q…` / `bcrt1q…`) of a compressed public key. */
export function p2wpkhAddress(publicKey: Uint8Array, network: BitcoinNetwork): string {
  if (!isBytes(publicKey) || publicKey.length !== 33 || (publicKey[0] !== 0x02 && publicKey[0] !== 0x03)) {
    throw new WalletError('invalid-public-key', 'P2WPKH needs a 33-byte compressed public key');
  }
  return bech32.encode(hrp(network), [0, ...bech32.toWords(hash160(publicKey))]);
}

/**
 * The 20-byte key hash of a P2WPKH address of exactly this network, or `undefined` for every other address
 * (another network, another script type, a bech32m or malformed string). Lower and upper case are accepted,
 * mixed case is not (BIP-173).
 */
export function p2wpkhKeyHash(address: string, network: BitcoinNetwork): Uint8Array | undefined {
  try {
    if (typeof address !== 'string' || (address !== address.toLowerCase() && address !== address.toUpperCase())) {
      return undefined;
    }
    const decoded = bech32.decode(address.toLowerCase() as `${string}1${string}`);
    if (decoded.prefix !== hrp(network) || decoded.words[0] !== 0) return undefined;
    const program = bech32.fromWords(decoded.words.slice(1));
    return program.length === 20 ? program : undefined;
  } catch {
    return undefined;
  }
}

/** P2WPKH output script `OP_0 <20-byte key hash>`. */
export function p2wpkhScript(keyHash: Uint8Array): Uint8Array {
  if (!isBytes(keyHash) || keyHash.length !== 20) {
    throw new WalletError('invalid-public-key', 'P2WPKH needs a 20-byte key hash');
  }
  return Uint8Array.from([0x00, 0x14, ...keyHash]);
}

/** Whether `publicKey` is the key of the P2WPKH `address` on `network`. */
export function isP2wpkhAddressOf(address: string, publicKey: Uint8Array, network: BitcoinNetwork): boolean {
  const keyHash = p2wpkhKeyHash(address, network);
  return keyHash !== undefined && equalBytes(keyHash, hash160(publicKey));
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
  const coin = Object.prototype.hasOwnProperty.call(BITCOIN_COIN_TYPE, network)
    ? BITCOIN_COIN_TYPE[network]
    : undefined;
  if (coin === undefined) throw new WalletError('invalid-network', `Unknown Bitcoin network: ${network}`);
  return coin;
}

function hrp(network: BitcoinNetwork): string {
  const prefix = Object.prototype.hasOwnProperty.call(BITCOIN_HRP, network) ? BITCOIN_HRP[network] : undefined;
  if (prefix === undefined) throw new WalletError('invalid-network', `Unknown Bitcoin network: ${network}`);
  return prefix;
}
