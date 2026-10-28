import { WalletError } from './errors';

// crypto.getRandomValues fills at most 65536 bytes per call.
const MAX_CHUNK = 65536;

/** Cryptographically secure random bytes from the platform CSPRNG (Web Crypto). */
export function randomBytes(length: number): Uint8Array {
  if (!Number.isSafeInteger(length) || length < 0) throw new RangeError(`Invalid random byte length: ${length}`);

  const crypto = globalThis.crypto;
  if (typeof crypto?.getRandomValues !== 'function') {
    throw new WalletError('csprng-unavailable', 'crypto.getRandomValues is not available');
  }

  const bytes = new Uint8Array(length);
  for (let offset = 0; offset < length; offset += MAX_CHUNK) {
    crypto.getRandomValues(bytes.subarray(offset, Math.min(offset + MAX_CHUNK, length)));
  }
  return bytes;
}
