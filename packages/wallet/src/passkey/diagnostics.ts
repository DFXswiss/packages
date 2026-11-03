/**
 * Allowlisted passkey diagnostics: stage, outcome, error name, one sanitized message line, attachment,
 * transports, backup flags, PRF presence, OS label and client capabilities. Never PRF bytes, mnemonics,
 * keys, signatures or challenges (§6.6).
 */
export interface PasskeyDiagnosticInput {
  stage: string;
  outcome: 'completed' | 'failed' | 'aborted';
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

/** Hex, a base64url blob, or a 12-word phrase is a secret, not a diagnostic sentence. */
function isSecretShaped(message: string): boolean {
  const compact = message.replace(/\s+/g, '');
  if (/^[0-9a-fA-F]{32,}$/.test(compact)) return true;
  if (!message.includes(' ') && /^[A-Za-z0-9_-]{32,}$/.test(message)) return true;
  const words = message.trim().split(/\s+/);
  return words.length >= 12 && words.every((word) => /^[a-z]+$/.test(word));
}

function diagnosticOutcome(outcome: PasskeyDiagnosticInput['outcome']): 'Success' | 'Failure' | 'Aborted' {
  switch (outcome) {
    case 'completed':
      return 'Success';
    case 'failed':
      return 'Failure';
    case 'aborted':
      return 'Aborted';
  }
}

/** Builds the sanitized diagnostic record; the app forwards it to `POST passkey/diagnostics`. */
export function passkeyDiagnostic(input: PasskeyDiagnosticInput): PasskeyDiagnostic {
  const record: PasskeyDiagnostic = {
    stage: String(input.stage).slice(0, 64),
    outcome: diagnosticOutcome(input.outcome),
  };
  if (input.errorName !== undefined) record['errorName'] = String(input.errorName).slice(0, 64);
  if (input.message !== undefined)
    record['message'] =
      SAFE_MESSAGE.test(input.message) && !isSecretShaped(input.message) ? input.message : '<unavailable>';
  if (input.attachment !== undefined) record['authenticatorAttachment'] = input.attachment;
  if (input.transports !== undefined)
    record['transports'] = input.transports.filter((t) => typeof t === 'string').slice(0, 8);
  if (input.backupEligible !== undefined) record['backupEligible'] = input.backupEligible;
  if (input.backedUp !== undefined) record['backedUp'] = input.backedUp;
  if (input.prf !== undefined) record['prfPresent'] = input.prf;
  if (input.os !== undefined) record['os'] = String(input.os).slice(0, 32);
  if (input.clientCapabilities !== undefined) {
    const entries = Object.entries(input.clientCapabilities)
      .filter(([, value]) => typeof value === 'boolean')
      .slice(0, 16);
    let serialized = JSON.stringify(Object.fromEntries(entries));
    while (serialized.length > 1024 && entries.length > 0) {
      entries.pop();
      serialized = JSON.stringify(Object.fromEntries(entries));
    }
    record['clientCapabilities'] = serialized;
  }
  return record;
}
