/**
 * Allowlisted passkey diagnostics: stage, outcome, error name, one sanitized message line, attachment,
 * transports, backup flags, PRF presence, OS label and client capabilities. Never PRF bytes, mnemonics,
 * keys, signatures or challenges (§6.6).
 */
export interface PasskeyDiagnosticInput {
  stage: string;
  outcome: 'started' | 'completed' | 'failed' | 'aborted';
  errorName?: string;
  message?: string;
  attachment?: string | null;
  transports?: string[];
  backupEligible?: boolean;
  backedUp?: boolean;
  prf?: boolean;
  os?: string;
  clientCapabilities?: Record<string, boolean>;
}

export type PasskeyDiagnostic = Record<string, unknown>;

/** Message characters diagnostics may carry; anything else (urls, keys, base64 blobs) is dropped. */
const SAFE_MESSAGE = /^[A-Za-z0-9 .,:;'()_-]{1,120}$/;

/** Builds the sanitized diagnostic record; the app forwards it to `POST auth/passkey/diagnostics`. */
export function passkeyDiagnostic(input: PasskeyDiagnosticInput): PasskeyDiagnostic {
  const record: PasskeyDiagnostic = { stage: String(input.stage).slice(0, 64), outcome: input.outcome };
  if (input.errorName !== undefined) record['errorName'] = String(input.errorName).slice(0, 64);
  if (input.message !== undefined)
    record['message'] = SAFE_MESSAGE.test(input.message) ? input.message : '<unavailable>';
  if (input.attachment !== undefined) record['attachment'] = input.attachment;
  if (input.transports !== undefined)
    record['transports'] = input.transports.filter((t) => typeof t === 'string').slice(0, 8);
  if (input.backupEligible !== undefined) record['backupEligible'] = input.backupEligible;
  if (input.backedUp !== undefined) record['backedUp'] = input.backedUp;
  if (input.prf !== undefined) record['prf'] = input.prf;
  if (input.os !== undefined) record['os'] = String(input.os).slice(0, 32);
  if (input.clientCapabilities !== undefined) {
    record['clientCapabilities'] = Object.fromEntries(
      Object.entries(input.clientCapabilities)
        .filter(([, value]) => typeof value === 'boolean')
        .slice(0, 16),
    );
  }
  return record;
}
