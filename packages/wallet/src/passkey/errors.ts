import { WalletError } from '../util/errors';

/** Base of every passkey ceremony failure; `code` is stable and branchable. */
export class PasskeyError extends WalletError {}

/** The page runs inside an iframe or another embedded context (NG3). */
export class EmbeddedContextError extends PasskeyError {
  constructor() {
    super('embedded-context', 'The wallet must run in a top-level browser context');
  }
}

/** The page is not served from the RP ID of its environment. */
export class WrongOriginError extends PasskeyError {
  constructor(hostname: string, expected: string) {
    super('wrong-origin', `Passkey ceremonies need ${expected}, this page is ${hostname}`);
  }
}

/** The browser or OS cannot run the wallet's passkey ceremonies at all. */
export class PlatformUnsupportedError extends PasskeyError {
  constructor(reason: string) {
    super('platform-unsupported', reason);
  }
}

/** The page runs inside an in-app browser that cannot complete a ceremony. */
export class InAppBrowserError extends PasskeyError {
  constructor() {
    super('in-app-browser', 'This browser is embedded in an app and cannot create passkeys');
  }
}

/** A cross-platform (hybrid/roaming) credential may never hold the wallet seed (D21). */
export class CrossDeviceRegistrationError extends PasskeyError {
  constructor() {
    super('cross-device-registration', 'The passkey was created cross-platform; wallet seeds stay on-device');
  }
}

/** `create` and `get` returned different PRF outputs for the same credential. */
export class PrfMismatchError extends PasskeyError {
  constructor() {
    super('prf-mismatch', 'The authenticator returned a different PRF output for the new credential');
  }
}

/** The authenticator has no PRF extension; no seed can be derived. */
export class PrfUnavailableError extends PasskeyError {
  constructor() {
    super('prf-unavailable', 'This passkey cannot derive a wallet seed (no PRF extension)');
  }
}

/** A newer ceremony superseded this one. */
export class CeremonySupersededError extends PasskeyError {
  constructor() {
    super('ceremony-superseded', 'A newer passkey ceremony superseded this one');
  }
}

/** The ceremony was cancelled by the app. */
export class CeremonyCancelledError extends PasskeyError {
  constructor() {
    super('ceremony-cancelled', 'The passkey ceremony was cancelled');
  }
}

/** The user gesture requirement (WebKit 291258) was not met. */
export class UserActivationMissingError extends PasskeyError {
  constructor() {
    super('user-activation-missing', 'The passkey ceremony must start from a user gesture');
  }
}

/** Classification of raw WebAuthn failures for the UI. */
export type WebAuthnErrorKind = 'cancel' | 'timeout' | 'exists' | 'unsupported' | 'security' | 'generic';

/** Maps a WebAuthn rejection to a stable UI discriminant. */
export function classifyWebAuthnError(error: unknown): WebAuthnErrorKind {
  const name = error && typeof error === 'object' && 'name' in error ? String((error as { name: string }).name) : '';
  switch (name) {
    case 'NotAllowedError':
      return 'cancel';
    case 'TimeoutError':
    case 'AbortError':
      return 'timeout';
    case 'InvalidStateError':
      return 'exists';
    case 'NotSupportedError':
    case 'SecurityError':
      return name === 'SecurityError' ? 'security' : 'unsupported';
    default: {
      const message = error instanceof Error ? error.message : String(error ?? '');
      if (/time\s*out/i.test(message)) return 'timeout';
      return 'generic';
    }
  }
}
