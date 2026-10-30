import { secp256k1 } from '@noble/curves/secp256k1';
import { bech32m } from '@scure/base';
import { concatBytes, isBytes } from '../util/bytes';
import { WalletError } from '../util/errors';

/**
 * Spark identity key: Spark SDK default derivation on the main mnemonic, mainnet account 1 (Breez SDK Spark
 * `defaultExternalSigners(mnemonic, null, 'mainnet', 1)`). Pinned by the known-answer vectors.
 */
export const SPARK_IDENTITY_PATH = "m/8797555'/1'/0'" as const;

const SPARK_HRP = 'spark';

// Protobuf `SparkAddress { bytes identity_public_key = 1; }` with a 33-byte key: tag 0x0a, length 0x21.
const PAYLOAD_PREFIX = new Uint8Array([0x0a, 0x21]);
const PAYLOAD_BYTES = PAYLOAD_PREFIX.length + 33;

// Longer than any bech32m string we accept; the payload length check below is the real limit.
const BECH32_LIMIT = 1024;

/** Plain mainnet Spark address: bech32m(`spark`, 0x0a 0x21 ‖ identity public key), no invoice fields. */
export function encodeSparkAddress(publicKey: Uint8Array): string {
  checkIdentityPublicKey(publicKey);
  return bech32m.encode(SPARK_HRP, bech32m.toWords(concatBytes(PAYLOAD_PREFIX, publicKey)), BECH32_LIMIT);
}

/**
 * Strict decoder for plain mainnet Spark addresses: lowercase, HRP `spark`, payload exactly 0x0a 0x21 followed by
 * a valid compressed secp256k1 point. Invoice addresses, other networks and raw-key payloads are refused.
 * Returns the 33-byte identity public key.
 */
export function decodeSparkAddress(address: string): Uint8Array {
  if (typeof address !== 'string' || address !== address.toLowerCase()) {
    throw invalid('Spark address must be lowercase');
  }

  let decoded: { prefix: string; words: number[] };
  try {
    decoded = bech32m.decode(address as `${string}1${string}`, BECH32_LIMIT);
  } catch (error) {
    throw invalid('Spark address is not valid bech32m', error);
  }
  if (decoded.prefix !== SPARK_HRP) throw invalid(`Spark address prefix must be "${SPARK_HRP}"`);

  const payload = bech32m.fromWordsUnsafe(decoded.words);
  if (
    !payload ||
    payload.length !== PAYLOAD_BYTES ||
    payload[0] !== PAYLOAD_PREFIX[0] ||
    payload[1] !== PAYLOAD_PREFIX[1]
  ) {
    throw invalid('Spark address payload must be a plain identity public key');
  }

  const publicKey = payload.slice(PAYLOAD_PREFIX.length);
  checkIdentityPublicKey(publicKey);
  return publicKey;
}

function checkIdentityPublicKey(publicKey: Uint8Array): void {
  if (!isBytes(publicKey) || publicKey.length !== 33 || (publicKey[0] !== 0x02 && publicKey[0] !== 0x03)) {
    throw invalid('Spark identity public key must be a 33-byte compressed key');
  }
  try {
    secp256k1.ProjectivePoint.fromHex(publicKey).assertValidity();
  } catch (error) {
    throw invalid('Spark identity public key is not a secp256k1 point', error);
  }
}

function invalid(message: string, cause?: unknown): WalletError {
  return new WalletError('invalid-spark-address', message, cause === undefined ? undefined : { cause });
}
