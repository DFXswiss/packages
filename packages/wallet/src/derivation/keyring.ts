import { HDKey } from '@scure/bip32';
import type { BitcoinNetwork, WalletEnv } from '../config/environment';
import { isBitcoinNetwork, isRegtestAllowed } from '../config/environment';
import { equalBytes, wipeBytes } from '../util/bytes';
import { WalletError } from '../util/errors';
import {
  BITCOIN_BIP32_VERSIONS,
  BitcoinChain,
  bitcoinAccountPath,
  bitcoinAddressPath,
  checkChain,
  checkIndex,
  hash160,
  p2wpkhAddress,
  p2wpkhKeyHash,
} from './bitcoin-keys';
import { EvmAddress, evmAddressFromPublicKey, evmAddressPath } from './evm-keys';
import { encodeSparkAddress, SPARK_IDENTITY_PATH } from './spark-keys';
import { normalizeMnemonicV1, seedFromMnemonic } from './v1';

export interface KeyRingOptions {
  bitcoinNetwork: BitcoinNetwork;
  /** Environment of the app build; required for `regtest`, which PRD never gets (see `isRegtestAllowed`). */
  env?: WalletEnv;
  /** Environments the app build enables regtest for; default `DEFAULT_REGTEST_ENVS` (DEV, LOC). */
  regtestEnvs?: readonly WalletEnv[];
}

export type BitcoinNetworkGate = Omit<KeyRingOptions, 'bitcoinNetwork'>;

export interface BitcoinAccountInfo {
  path: string;
  /** Account extended public key (xpub on mainnet, tpub on testnet4 and regtest). */
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
    const network = checkNetwork(options?.bitcoinNetwork, options);
    const normalized = normalizeMnemonicV1(mnemonic);
    const seed = seedFromMnemonic(normalized);
    const master = HDKey.fromMasterSeed(seed, BITCOIN_BIP32_VERSIONS[network]);
    return new KeyRing({ mnemonic: normalized, seed, master }, network);
  }

  /**
   * A separate ring of the same seed whose Bitcoin account lives on `network`, e.g. the regtest ring
   * (`m/84'/1'/0'`, `bcrt1q…`) next to the testnet4 ring of a DEV build. EVM and Spark keys are the same. The
   * new ring owns its own copy of the key material: wipe it when it is no longer needed; wiping either ring
   * leaves the other intact. `regtest` needs `gate.env` of an enabled non-PRD environment.
   */
  forBitcoinNetwork(network: BitcoinNetwork, gate?: BitcoinNetworkGate): KeyRing {
    const checked = checkNetwork(network, gate);
    const secret = this.secret();
    const seed = secret.seed.slice();
    const master = HDKey.fromMasterSeed(seed, BITCOIN_BIP32_VERSIONS[checked]);
    return new KeyRing({ mnemonic: secret.mnemonic, seed, master }, checked);
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

/** Default number of receive and change indexes searched for an own Bitcoin address. */
export const BITCOIN_ADDRESS_SCAN = 100;

/**
 * The BIP-84 key path of one of the ring's own P2WPKH addresses: receive and change indexes `0..scan-1` are
 * searched, receive first. `undefined` when the address is not the ring's (another network included).
 */
export function findBitcoinKey(
  keys: KeyRing,
  address: string,
  scan: number = BITCOIN_ADDRESS_SCAN,
): OwnBitcoinKey | undefined {
  const keyHash = p2wpkhKeyHash(address, keys.bitcoinNetwork);
  return keyHash ? findBitcoinKeyByHash(keys, keyHash, scan) : undefined;
}

export interface OwnBitcoinKey {
  chain: BitcoinChain;
  index: number;
  publicKey: Uint8Array;
}

/** Same as {@link findBitcoinKey} for the 20-byte key hash of a P2WPKH script. */
export function findBitcoinKeyByHash(
  keys: KeyRing,
  keyHash: Uint8Array,
  scan: number = BITCOIN_ADDRESS_SCAN,
): OwnBitcoinKey | undefined {
  if (!Number.isSafeInteger(scan) || scan < 1 || scan > 10_000) {
    throw new WalletError('invalid-derivation-path', `Invalid address scan: ${scan}`);
  }
  if (keyHash.length !== 20) return undefined;
  for (const chain of [0, 1] as const) {
    for (let index = 0; index < scan; index++) {
      const { publicKey } = keys.bitcoinAddress(chain, index);
      if (equalBytes(hash160(publicKey), keyHash)) return { chain, index, publicKey };
    }
  }
  return undefined;
}

function checkNetwork(network: unknown, gate?: BitcoinNetworkGate): BitcoinNetwork {
  if (!isBitcoinNetwork(network)) throw new WalletError('invalid-network', `Unknown Bitcoin network: ${network}`);
  if (network === 'regtest' && !isRegtestAllowed(gate?.env, gate?.regtestEnvs)) {
    throw new WalletError('network-not-allowed', `Bitcoin regtest is not enabled in environment ${String(gate?.env)}`);
  }
  return network;
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
