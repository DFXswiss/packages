import { secp256k1 } from '@noble/curves/secp256k1';
import { sha256 } from '@noble/hashes/sha2';
import { base64 } from '@scure/base';
import type { BitcoinNetwork } from '../config/environment';
import { hash160, p2wpkhKeyHash, p2wpkhScript } from '../derivation/bitcoin-keys';
import { findBitcoinKey, KeyRing, withPrivateKey } from '../derivation/keyring';
import { concatBytes, equalBytes, utf8ToBytes } from '../util/bytes';
import { WalletError } from '../util/errors';
import { isDfxLoginText } from './login-text-guard';

/**
 * BIP-322 "simple" message signatures of the wallet's native segwit v0 (P2WPKH) addresses on every network,
 * including regtest `bcrt1q…` addresses: a virtual `to_spend` transaction commits to the tagged message hash
 * and the address script, a virtual `to_sign` transaction spends it, and the signature is the base64 encoded
 * witness of that spend (BIP-143 sighash, SIGHASH_ALL, DER low-S signature, compressed public key).
 */
const MESSAGE_TAG = 'BIP0322-signed-message';
const SIGHASH_ALL = 0x01;
const MESSAGE_TAG_HASH = sha256(utf8ToBytes(MESSAGE_TAG));

/** BIP-340 tagged hash `SHA256(SHA256(tag) ‖ SHA256(tag) ‖ message)` with tag `BIP0322-signed-message`. */
export function bip322MessageHash(message: string | Uint8Array): Uint8Array {
  const bytes = typeof message === 'string' ? utf8ToBytes(message) : message;
  return sha256(concatBytes(MESSAGE_TAG_HASH, MESSAGE_TAG_HASH, bytes));
}

/** Signs `message` for the P2WPKH address of `publicKey` with `privateKey` (called through `withPrivateKey`). */
export function signBip322Simple(message: string, privateKey: Uint8Array, publicKey: Uint8Array): string {
  const sighash = bip322Sighash(hash160(publicKey), message);
  const signature = secp256k1.sign(sighash, privateKey, { lowS: true });
  const der = concatBytes(signature.toDERRawBytes(), new Uint8Array([SIGHASH_ALL]));
  return base64.encode(encodeWitness([der, publicKey]));
}

/**
 * Verifies a BIP-322 simple signature of a P2WPKH `address` on `network`. Everything else — another network,
 * another script type, a legacy (BIP-137) signature, malformed base64 or witness, a high-S or non-SIGHASH_ALL
 * signature, a wrong key — is `false`.
 */
export function verifyBip322Simple(
  network: BitcoinNetwork,
  address: string,
  message: string,
  signature: string,
): boolean {
  try {
    const keyHash = p2wpkhKeyHash(address, network);
    if (!keyHash) return false;

    const witness = decodeWitness(base64.decode(signature));
    if (!witness || witness.length !== 2) return false;
    const [sigWithType, publicKey] = witness;
    if (publicKey.length !== 33 || (publicKey[0] !== 0x02 && publicKey[0] !== 0x03)) return false;
    if (!equalBytes(hash160(publicKey), keyHash)) return false;
    if (sigWithType.length < 9 || sigWithType[sigWithType.length - 1] !== SIGHASH_ALL) return false;

    const parsed = secp256k1.Signature.fromDER(sigWithType.subarray(0, sigWithType.length - 1));
    if (parsed.hasHighS()) return false;
    return secp256k1.verify(parsed.toBytes('compact'), bip322Sighash(keyHash, message), publicKey, {
      lowS: true,
      format: 'compact',
    });
  } catch {
    return false;
  }
}

/**
 * Signs an arbitrary text with one of the wallet's own P2WPKH addresses (receive or change, index `0..scan-1`)
 * as a BIP-322 simple signature. Only for texts the user has seen and confirmed: a DFX login text is refused
 * (that proof is produced only by the login auto-signer), as is an address that is not the ring's.
 */
export function signBitcoinMessageBip322(keys: KeyRing, address: string, message: string, scan?: number): string {
  if (typeof message !== 'string') throw new WalletError('invalid-message', 'The message must be a string');
  if (isDfxLoginText(message)) {
    throw new WalletError('login-text-refused', 'DFX login texts are signed only by the login auto-signer');
  }
  const key = findBitcoinKey(keys, address, scan);
  if (!key) throw new WalletError('unknown-address', `${address} is not a Bitcoin address of this wallet`);
  return withPrivateKey(keys, { family: 'bitcoin', chain: key.chain, index: key.index }, (privateKey) =>
    signBip322Simple(message, privateKey, key.publicKey),
  );
}

// ---------------------------------------------------------------------------------------------------------------
// Virtual transactions (BIP-322 "Full" section) and the BIP-143 sighash of the to_sign input

function bip322Sighash(keyHash: Uint8Array, message: string): Uint8Array {
  const toSpendTxid = doubleSha256(toSpendTransaction(p2wpkhScript(keyHash), bip322MessageHash(message)));
  const outpoint = concatBytes(toSpendTxid, u32le(0));
  const sequence = u32le(0);
  const scriptCode = concatBytes(new Uint8Array([0x19, 0x76, 0xa9, 0x14]), keyHash, new Uint8Array([0x88, 0xac]));
  const opReturnOutput = concatBytes(u64le(0), new Uint8Array([0x01, 0x6a]));

  return doubleSha256(
    concatBytes(
      u32le(0), // to_sign nVersion
      doubleSha256(outpoint), // hashPrevouts
      doubleSha256(sequence), // hashSequence
      outpoint,
      scriptCode,
      u64le(0), // value of the spent to_spend output
      sequence,
      doubleSha256(opReturnOutput), // hashOutputs
      u32le(0), // nLockTime
      u32le(SIGHASH_ALL),
    ),
  );
}

/** Non-witness serialization of to_spend: one input `0000…:0xFFFFFFFF` with `OP_0 PUSH32 <message hash>`. */
function toSpendTransaction(messageChallenge: Uint8Array, messageHash: Uint8Array): Uint8Array {
  const scriptSig = concatBytes(new Uint8Array([0x00, 0x20]), messageHash);
  return concatBytes(
    u32le(0), // nVersion
    new Uint8Array([0x01]), // one input
    new Uint8Array(32), // prevout hash
    u32le(0xffffffff), // prevout index
    compactSize(scriptSig.length),
    scriptSig,
    u32le(0), // nSequence
    new Uint8Array([0x01]), // one output
    u64le(0), // value
    compactSize(messageChallenge.length),
    messageChallenge,
    u32le(0), // nLockTime
  );
}

function encodeWitness(items: Uint8Array[]): Uint8Array {
  return concatBytes(compactSize(items.length), ...items.flatMap((item) => [compactSize(item.length), item]));
}

/** Decodes a witness stack that uses exactly all bytes; `undefined` for anything malformed. */
function decodeWitness(bytes: Uint8Array): Uint8Array[] | undefined {
  let offset = 0;
  const readSize = (): number | undefined => {
    if (offset >= bytes.length) return undefined;
    const first = bytes[offset++];
    if (first < 0xfd) return first;
    // Larger items never occur in a P2WPKH witness; refusing them keeps the parser trivially bounded.
    return undefined;
  };

  const count = readSize();
  if (count === undefined) return undefined;
  const items: Uint8Array[] = [];
  for (let i = 0; i < count; i++) {
    const length = readSize();
    if (length === undefined || offset + length > bytes.length) return undefined;
    items.push(bytes.subarray(offset, offset + length));
    offset += length;
  }
  return offset === bytes.length ? items : undefined;
}

function compactSize(value: number): Uint8Array {
  if (value < 0xfd) return new Uint8Array([value]);
  if (value <= 0xffff) return new Uint8Array([0xfd, value & 0xff, value >>> 8]);
  throw new WalletError('invalid-message', 'Script element too large');
}

function u32le(value: number): Uint8Array {
  const bytes = new Uint8Array(4);
  new DataView(bytes.buffer).setUint32(0, value >>> 0, true);
  return bytes;
}

function u64le(value: number): Uint8Array {
  const bytes = new Uint8Array(8);
  new DataView(bytes.buffer).setBigUint64(0, BigInt(value), true);
  return bytes;
}

function doubleSha256(data: Uint8Array): Uint8Array {
  return sha256(sha256(data));
}
