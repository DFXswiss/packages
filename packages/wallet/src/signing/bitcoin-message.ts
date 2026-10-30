import { secp256k1 } from '@noble/curves/secp256k1';
import { sha256 } from '@noble/hashes/sha2';
import { base64 } from '@scure/base';
import type { BitcoinNetwork } from '../config/environment';
import { p2wpkhAddress } from '../derivation/bitcoin-keys';
import { concatBytes, utf8ToBytes } from '../util/bytes';

/**
 * BIP-137 message signatures for the wallet's P2WPKH login address: Electrum-style compact signature with
 * header 39..42 (27 + 12 + recovery id), base64, over the double-SHA-256 magic hash — exactly what the DFX
 * API verifies with bitcoinjs-message. Header values of other script types are not produced by this wallet.
 */
const MAGIC_PREFIX = 'Bitcoin Signed Message:\n';
const P2WPKH_HEADER_BASE = 39;

function varInt(length: number): Uint8Array {
  if (length < 0xfd) return new Uint8Array([length]);
  if (length <= 0xffff) return new Uint8Array([0xfd, length & 0xff, (length >>> 8) & 0xff]);
  if (length <= 0xffffffff)
    return new Uint8Array([0xfe, length & 0xff, (length >>> 8) & 0xff, (length >>> 16) & 0xff, length >>> 24]);
  return new Uint8Array([
    0xff,
    length & 0xff,
    (length >>> 8) & 0xff,
    (length >>> 16) & 0xff,
    (length >>> 24) & 0xff,
    0,
    0,
    0,
  ]);
}

/** BIP-137 magic hash: double SHA-256 over varint-length prefix and message. */
export function bitcoinMessageMagicHash(message: string): Uint8Array {
  const messageBytes = utf8ToBytes(message);
  const preimage = concatBytes(
    varInt(MAGIC_PREFIX.length),
    utf8ToBytes(MAGIC_PREFIX),
    varInt(messageBytes.length),
    messageBytes,
  );
  return sha256(sha256(preimage));
}

/** Signs the message with a private key (called through `withPrivateKey`); base64, header 39..42. */
export function signBitcoinMessageBip137(message: string, privateKey: Uint8Array): string {
  const signature = secp256k1.sign(bitcoinMessageMagicHash(message), privateKey);
  return base64.encode(
    concatBytes(new Uint8Array([P2WPKH_HEADER_BASE + signature.recovery]), signature.toBytes('compact')),
  );
}

/**
 * Verifies a BIP-137 P2WPKH signature (header 39..42) of the given message against the given native segwit
 * address. Everything else — other headers, malformed base64, wrong length, failed recovery — is `false`.
 */
export function verifyBitcoinMessage(
  network: BitcoinNetwork,
  address: string,
  message: string,
  signature: string,
): boolean {
  try {
    const decoded = base64.decode(signature);
    if (decoded.length !== 65) return false;
    const header = decoded[0];
    if (header < P2WPKH_HEADER_BASE || header > P2WPKH_HEADER_BASE + 3) return false;
    const compact = secp256k1.Signature.fromCompact(decoded.subarray(1)).addRecoveryBit(header - P2WPKH_HEADER_BASE);
    const publicKey = compact.recoverPublicKey(bitcoinMessageMagicHash(message)).toRawBytes(true);
    return p2wpkhAddress(publicKey, network) === address;
  } catch {
    return false;
  }
}
