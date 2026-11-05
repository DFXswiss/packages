import { HDKey } from '@scure/bip32';
import type { BitcoinNetwork } from '../config/environment';
import { wipeBytes } from '../util/bytes';
import { WalletError } from '../util/errors';
import {
  BITCOIN_BIP32_VERSIONS,
  BitcoinChain,
  bitcoinAccountPath,
  bitcoinAddressPath,
  checkChain,
  checkIndex,
  p2wpkhAddress,
} from './bitcoin-keys';
import { EvmAddress, evmAddressFromPublicKey, evmAddressPath } from './evm-keys';
import { encodeSparkAddress, SPARK_IDENTITY_PATH } from './spark-keys';
import { normalizeMnemonicV1, seedFromMnemonic } from './v1';

export interface KeyRingOptions {
  bitcoinNetwork: BitcoinNetwork;
}

export interface BitcoinAccountInfo {
  path: string;
  /** Account extended public key (xpub on mainnet, tpub on testnet4). */
  xpub: string;
  /** Master key fingerprint, 8 lowercase hex characters. */
  fingerprint: string;
}

export interface BitcoinAddressInfo {
  path: string;
  address: string;
  publicKey: Uint8Array;
}

export interface SparkIdentityInfo {
  path: typeof SPARK_IDENTITY_PATH;
  publicKey: Uint8Array;
  address: string;
}

/** A key the wallet signs with; package-internal (see `withPrivateKey`). */
export type KeyPath =
  | { family: 'evm'; index: number }
  | { family: 'bitcoin'; chain: BitcoinChain; index: number }
  | { family: 'spark' };

interface Secrets {
  mnemonic: string;
  seed: Uint8Array;
  master: HDKey;
}

interface PublicNodes {
  bitcoinAccount: HDKey;
  bitcoinChains: [HDKey, HDKey];
  evmChain: HDKey;
  fingerprint: string;
  spark?: SparkIdentityInfo;
}

// Secrets live outside the instance, so nothing reachable from a KeyRing object exposes key material.
const secrets = new WeakMap<KeyRing, Secrets>();

/**
 * The unlocked keys of one wallet. Every path is derived from the master node (BIP-84 Bitcoin account 0,
 * MetaMask EVM accounts, Spark identity of account 1); address derivation uses public account nodes only.
 */
export class KeyRing {
  readonly bitcoinNetwork: BitcoinNetwork;
  private nodes?: PublicNodes;

  private constructor(secret: Secrets, bitcoinNetwork: BitcoinNetwork) {
    this.bitcoinNetwork = bitcoinNetwork;
    secrets.set(this, secret);

    const bitcoinAccount = neutered(secret.master.derive(bitcoinAccountPath(bitcoinNetwork)));
    this.nodes = {
      bitcoinAccount,
      bitcoinChains: [bitcoinAccount.deriveChild(0), bitcoinAccount.deriveChild(1)],
      evmChain: neutered(secret.master.derive("m/44'/60'/0'/0")),
      fingerprint: secret.master.fingerprint.toString(16).padStart(8, '0'),
    };
  }

  static fromMnemonic(mnemonic: string, options: KeyRingOptions): KeyRing {
    const network = options?.bitcoinNetwork;
    if (!network || !BITCOIN_BIP32_VERSIONS[network]) {
      throw new WalletError('invalid-network', `Unknown Bitcoin network: ${network}`);
    }
    const normalized = normalizeMnemonicV1(mnemonic);
    const seed = seedFromMnemonic(normalized);
    const master = HDKey.fromMasterSeed(seed, BITCOIN_BIP32_VERSIONS[network]);
    return new KeyRing({ mnemonic: normalized, seed, master }, network);
  }

  get wiped(): boolean {
    return this.nodes === undefined;
  }

  /** EVM account `m/44'/60'/0'/0/index`; index 0 is the seed check address. */
  evm(index: number): { path: string; address: EvmAddress } {
    const path = evmAddressPath(index);
    return { path, address: evmAddressFromPublicKey(publicKeyOf(this.publicNodes().evmChain.deriveChild(index))) };
  }

  bitcoinAccount(): BitcoinAccountInfo {
    const nodes = this.publicNodes();
    return {
      path: bitcoinAccountPath(this.bitcoinNetwork),
      xpub: nodes.bitcoinAccount.publicExtendedKey,
      fingerprint: nodes.fingerprint,
    };
  }

  /** BIP-84 P2WPKH address of the receive (0) or change (1) chain. */
  bitcoinAddress(chain: BitcoinChain, index: number): BitcoinAddressInfo {
    checkChain(chain);
    checkIndex(index);
    const nodes = this.publicNodes();
    const publicKey = publicKeyOf(nodes.bitcoinChains[chain].deriveChild(index));
    return {
      path: bitcoinAddressPath(this.bitcoinNetwork, chain, index),
      address: p2wpkhAddress(publicKey, this.bitcoinNetwork),
      publicKey,
    };
  }

  /** Spark identity key `m/8797555'/1'/0'` and its plain mainnet `spark1` address. */
  sparkIdentity(): SparkIdentityInfo {
    const nodes = this.publicNodes();
    if (!nodes.spark) {
      const node = this.secret().master.derive(SPARK_IDENTITY_PATH);
      const publicKey = publicKeyOf(node);
      node.wipePrivateData();
      nodes.spark = { path: SPARK_IDENTITY_PATH, publicKey, address: encodeSparkAddress(publicKey) };
    }
    const { path, publicKey, address } = nodes.spark;
    return { path, publicKey: publicKey.slice(), address };
  }

  /** The mnemonic, only for the export screen and the Spark client. */
  mnemonic(): string {
    return this.secret().mnemonic;
  }

  /** Drops all key material; every later call throws. */
  wipe(): void {
    const secret = secrets.get(this);
    if (secret) {
      secret.master.wipePrivateData();
      wipeBytes(secret.seed);
      secrets.delete(this);
    }
    this.nodes = undefined;
  }

  private publicNodes(): PublicNodes {
    if (!this.nodes) throw wipedError();
    return this.nodes;
  }

  private secret(): Secrets {
    const secret = secrets.get(this);
    if (!secret) throw wipedError();
    return secret;
  }
}

/**
 * Package-internal signing access: derives the private key of `path`, passes it to the synchronous `use` and
 * wipes it afterwards. Not exported from the package index.
 */
export function withPrivateKey<T>(keys: KeyRing, path: KeyPath, use: (privateKey: Uint8Array) => T): T {
  const secret = secrets.get(keys);
  if (!secret) throw wipedError();

  const node = secret.master.derive(keyPathString(keys.bitcoinNetwork, path));
  const privateKey = node.privateKey?.slice();
  node.wipePrivateData();
  if (!privateKey) throw new WalletError('key-unavailable', 'No private key for this path');

  try {
    const result = use(privateKey);
    if (result instanceof Promise)
      throw new WalletError('async-key-use', 'Private keys may only be used synchronously');
    return result;
  } finally {
    wipeBytes(privateKey);
  }
}

function keyPathString(network: BitcoinNetwork, path: KeyPath): string {
  switch (path?.family) {
    case 'evm':
      return evmAddressPath(path.index);
    case 'bitcoin':
      return bitcoinAddressPath(network, path.chain, path.index);
    case 'spark':
      return SPARK_IDENTITY_PATH;
    default:
      throw new WalletError('invalid-derivation-path', 'Unknown key family');
  }
}

function neutered(node: HDKey): HDKey {
  const publicNode = HDKey.fromExtendedKey(node.publicExtendedKey, node.versions);
  node.wipePrivateData();
  return publicNode;
}

function publicKeyOf(node: HDKey): Uint8Array {
  if (!node.publicKey) throw new WalletError('key-unavailable', 'No public key for this path');
  return node.publicKey;
}

function wipedError(): WalletError {
  return new WalletError('keyring-wiped', 'The key ring has been wiped');
}
