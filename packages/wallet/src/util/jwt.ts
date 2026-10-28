import { base64UrlDecode, bytesToUtf8 } from './bytes';
import { WalletError } from './errors';

/**
 * Decodes the payload of a JWT without verifying it. The wallet only reads claims of tokens it received from
 * the DFX API over TLS (e.g. expiry, account, passkey credential); it never trusts them for key decisions.
 */
export function decodeJwtPayload<T extends object = Record<string, unknown>>(token: string): T {
  const parts = token.split('.');
  if (parts.length !== 3 || !parts[1]) throw new WalletError('invalid-jwt', 'Malformed JWT');

  let payload: unknown;
  try {
    payload = JSON.parse(bytesToUtf8(base64UrlDecode(parts[1])));
  } catch (error) {
    throw new WalletError('invalid-jwt', 'Malformed JWT payload', { cause: error });
  }

  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    throw new WalletError('invalid-jwt', 'JWT payload is not an object');
  }
  return payload as T;
}
