import { secp256k1 } from '@noble/curves/secp256k1';
import { keccak_256 } from '@noble/hashes/sha3';
import { bytesToHex, concatBytes, hexToBytes, utf8ToBytes } from '../util/bytes';

/**
 * D31 Spark login for passkey Spark addresses: ECDSA secp256k1 over
 * Keccak-256(0x18 ‖ UTF-8 tag ‖ UTF-8 message) with the Spark identity key, RFC 6979, low-S, 64-byte
 * compact r‖s as lowercase hex. The tag length 0x18 = 24 is the length of the tag itself. Pinned by the
 * DFX API test vectors in the derivation fixture (private key 32 × 0x11) and by every login vector.
 */
export const SPARK_LOGIN_TAG = 'dfx.swiss/spark-login/v1';

/** D31 digest of the login message. */
export function sparkLoginDigestV1(message: string): Uint8Array {
  const tag = utf8ToBytes(SPARK_LOGIN_TAG);
  return keccak_256(concatBytes(new Uint8Array([tag.length]), tag, utf8ToBytes(message)));
}

/** Signs the D31 digest with a private key (called through `withPrivateKey`); compact r‖s lowercase hex. */
export function signSparkLogin(message: string, privateKey: Uint8Array): string {
  const signature = secp256k1.sign(sparkLoginDigestV1(message), privateKey);
  return bytesToHex(signature.toBytes('compact'));
}

/**
 * Verifies a D31 signature against the expected identity public key by recovering it from the digest and the
 * compact signature (recovery ids 0..3). Malformed input never throws, it just does not verify.
 */
export function verifySparkLogin(message: string, signature: string, publicKey: Uint8Array): boolean {
  try {
    const compact = typeof signature === 'string' && /^[0-9a-f]{128}$/.test(signature) ? hexToBytes(signature) : null;
    if (!compact) return false;
    const digest = sparkLoginDigestV1(message);
    for (let recoveryId = 0; recoveryId < 4; recoveryId++) {
      try {
        const recovered = secp256k1.Signature.fromCompact(compact)
          .addRecoveryBit(recoveryId)
          .recoverPublicKey(digest)
          .toRawBytes(true);
        if (recovered.length === publicKey.length && recovered.every((byte, i) => byte === publicKey[i])) {
          return true;
        }
      } catch {
        // try the next recovery id
      }
    }
    return false;
  } catch {
    return false;
  }
}
