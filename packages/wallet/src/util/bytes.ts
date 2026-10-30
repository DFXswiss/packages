import { base64urlnopad } from '@scure/base';
import { bytesToHex, bytesToUtf8, concatBytes, hexToBytes, isBytes, utf8ToBytes } from '@noble/hashes/utils';

export { bytesToHex, bytesToUtf8, concatBytes, hexToBytes, isBytes, utf8ToBytes };

/** Base64url without padding, as used by WebAuthn JSON and JWT. */
export function base64UrlEncode(bytes: Uint8Array): string {
  return base64urlnopad.encode(bytes);
}

/** Decodes base64url; trailing `=` padding is accepted and ignored. */
export function base64UrlDecode(text: string): Uint8Array {
  return base64urlnopad.decode(text.replace(/=+$/, ''));
}

/** Compares two byte arrays in time independent of the position of the first difference. */
export function equalBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/** Overwrites the given buffers with zeros, e.g. key material that is no longer needed. */
export function wipeBytes(...arrays: (Uint8Array | undefined)[]): void {
  for (const array of arrays) array?.fill(0);
}
