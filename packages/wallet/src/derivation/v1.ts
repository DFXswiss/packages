import { hkdf } from '@noble/hashes/hkdf';
import { sha256 } from '@noble/hashes/sha2';
import { entropyToMnemonic, mnemonicToSeedSync, validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { isBytes, utf8ToBytes, wipeBytes } from '../util/bytes';
import { WalletError } from '../util/errors';

/**
 * Derivation version v1: PRF output → BIP-39 mnemonic. These values are frozen forever; changing any of them
 * changes every wallet. They are pinned by the known-answer vectors in `__tests__/fixtures/derivation-v1.json`.
 */
export const DERIVATION_V1 = Object.freeze({
  version: 'v1',
  /** PRF input (`prf.eval.first`) = SHA-256 of this UTF-8 label. */
  prfInputLabel: 'dfx.swiss/passkey-seed/prf/v1',
  /** HKDF-SHA-256 salt (UTF-8). */
  hkdfSalt: 'dfx.swiss/passkey-seed/hkdf/v1',
  /** HKDF-SHA-256 info (UTF-8). */
  hkdfInfo: 'bip39-entropy-128',
  /** BIP-39 entropy length: 16 bytes = 12 English words. */
  entropyBytes: 16,
  /** BIP-39 passphrase. */
  passphrase: '',
} as const);

/** Length of a WebAuthn PRF output. */
export const PRF_OUTPUT_BYTES = 32;

const MNEMONIC_WORDS = 12;

/** The PRF input of every v1 ceremony: SHA-256(UTF-8 label), 32 bytes. */
export function prfInputV1(): Uint8Array {
  return sha256(utf8ToBytes(DERIVATION_V1.prfInputLabel));
}

/** HKDF-SHA-256 over the PRF output → 16 bytes of BIP-39 entropy. */
export function entropyFromPrfV1(prfOutput: Uint8Array): Uint8Array {
  if (!isBytes(prfOutput) || prfOutput.length !== PRF_OUTPUT_BYTES) {
    throw new WalletError('invalid-prf-output', `PRF output must be ${PRF_OUTPUT_BYTES} bytes`);
  }
  return hkdf(
    sha256,
    prfOutput,
    utf8ToBytes(DERIVATION_V1.hkdfSalt),
    utf8ToBytes(DERIVATION_V1.hkdfInfo),
    DERIVATION_V1.entropyBytes,
  );
}

/** BIP-39 English mnemonic of the given entropy. */
export function mnemonicFromEntropy(entropy: Uint8Array): string {
  return entropyToMnemonic(entropy, wordlist);
}

/** PRF output → 12-word English mnemonic (derivation v1). */
export function mnemonicFromPrfV1(prfOutput: Uint8Array): string {
  const entropy = entropyFromPrfV1(prfOutput);
  try {
    return mnemonicFromEntropy(entropy);
  } finally {
    wipeBytes(entropy);
  }
}

/** Collapses whitespace and checks that the mnemonic is a valid 12-word English BIP-39 phrase. */
export function normalizeMnemonicV1(mnemonic: string): string {
  const normalized = typeof mnemonic === 'string' ? mnemonic.trim().split(/\s+/).join(' ') : '';
  if (normalized.split(' ').length !== MNEMONIC_WORDS || !validateMnemonic(normalized, wordlist)) {
    throw new WalletError('invalid-mnemonic', `Expected a valid ${MNEMONIC_WORDS}-word English BIP-39 mnemonic`);
  }
  return normalized;
}

/** BIP-39 seed (64 bytes). v1 always uses the empty passphrase; other values exist for the BIP-39 test vectors. */
export function seedFromMnemonic(mnemonic: string, passphrase: string = DERIVATION_V1.passphrase): Uint8Array {
  return mnemonicToSeedSync(mnemonic, passphrase);
}
