import { Blockchain } from './blockchain';
import { UserStatus } from './user';

/** Routes of the passkey seed wallet (backend `PasskeyAuthController`, `PasskeyController`). */
export const PasskeyUrl = {
  registerBegin: 'auth/passkey/register/begin',
  registerFinish: 'auth/passkey/register/finish',
  authenticateBegin: 'auth/passkey/authenticate/begin',
  authenticateFinish: 'auth/passkey/authenticate/finish',
  claimBegin: 'auth/passkey/claim/begin',
  claimFinish: 'auth/passkey/claim/finish',
  link: 'auth/passkey/link',
  revokeBegin: 'auth/passkey/revoke/begin',
  revokeFinish: 'auth/passkey/revoke/finish',
  credentialStatus: 'auth/passkey/credentialStatus',
  wallets: 'passkey/wallets',
  diagnostics: 'passkey/diagnostics',
};

export function passkeyWalletUrl(id: number, action: 'backupSeen' | 'revoke'): string {
  return `passkey/wallets/${id}/${action}`;
}

/** Derivation parameters behind a seed; frozen per version. */
export type PasskeyDerivationVersion = 'V1';

/** Chain family of a passkey address. */
export type PasskeyAddressFamily = 'Bitcoin' | 'Evm' | 'Spark';

/** Lifecycle of a passkey credential. */
export type PasskeyCredentialStatus = 'Active' | 'Lost' | 'Compromised';

/** Why a passkey wallet was revoked. */
export type PasskeyRevocationReason = 'Lost' | 'Compromised';

/** Server challenge of a ceremony; the client builds all WebAuthn options itself (§6.2). */
export interface PasskeyChallenge {
  challengeId: string;
  /** Base64url, 32 random bytes. */
  challenge: string;
  rpId: string;
  timeout: number;
}

/** The credential proof shared by register and claim (backend `PasskeyCredentialProofDto`). */
export interface PasskeyCredentialProof {
  challengeId: string;
  /** `RegistrationResponseJSON`, WebAuthn Level 3 shape, PRF results stripped. */
  credential: Record<string, unknown>;
  /** Base64url of the client-generated user handle. */
  userHandle: string;
  derivationVersion: PasskeyDerivationVersion;
  /** EVM seed check address `m/44'/60'/0'/0/0`, EIP-55. */
  address: string;
  /** EIP-191 over the login text of `address`. */
  signature: string;
  /** Spark identity address `m/8797555'/1'/0'`. */
  sparkAddress: string;
  /** D31 signature, 128 hex chars. */
  sparkSignature: string;
}

export interface RegisterPasskeyParams extends PasskeyCredentialProof {
  language?: string;
  usedRef?: string;
  recommendationCode?: string;
  specialCode?: string;
}

/** Claim sends exactly the same proof as register, into an existing account. */
export type ClaimPasskeyParams = PasskeyCredentialProof;

/** An authentication assertion (backend `PasskeyAssertionDto`). */
export interface PasskeyAssertionParams {
  challengeId: string;
  /** `AuthenticationResponseJSON`. */
  credential: Record<string, unknown>;
}

/** Revoke a wallet by proving the credential one last time (backend `RevokePasskeyByAssertionDto`). */
export interface RevokePasskeyByAssertionParams extends PasskeyAssertionParams {
  reason: PasskeyRevocationReason;
}

/** Link a derived address to the passkey account (backend `LinkPasskeyAddressDto`). */
export interface LinkPasskeyAddressParams {
  address: string;
  signature: string;
  family: PasskeyAddressFamily;
  path: string;
}

export interface PasskeyAddress {
  address: string;
  family: PasskeyAddressFamily;
  path: string;
  status: UserStatus;
  blockchains: Blockchain[];
}

/** A passkey wallet as the account sees it (backend `PasskeyWalletDto`). */
export interface PasskeyWallet {
  id: number;
  credentialId: string;
  status: PasskeyCredentialStatus;
  created: string;
  revokedDate?: string;
  derivationVersion: PasskeyDerivationVersion;
  seedCheckAddress: string;
  backupEligible: boolean;
  backedUp: boolean;
  backupSeenDate?: string;
  /** `!backupEligible && !backupSeenDate`: the wallet must nag about the backup. */
  backupRequired: boolean;
  aaguid?: string;
  transports?: string[];
  addresses: PasskeyAddress[];
}

export interface PasskeyAuthResponse {
  accessToken: string;
  wallet: PasskeyWallet;
}

export interface PasskeyLinkResponse {
  accessToken: string;
  address: PasskeyAddress;
}

export interface PasskeyCredentialStatusResult {
  credentialId: string;
  status: PasskeyCredentialStatus | 'Unknown';
}

/** Allowlisted diagnostics record (backend `PasskeyDiagnosticDto`); extra fields are free-form. */
export interface PasskeyDiagnosticParams {
  stage: string;
  outcome: 'Success' | 'Failure' | 'Aborted';
  [field: string]: unknown;
}
