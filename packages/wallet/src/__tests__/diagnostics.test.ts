import { passkeyDiagnostic } from '../passkey/diagnostics';

describe('passkeyDiagnostic', () => {
  it('keeps the allowlisted fields', () => {
    const record = passkeyDiagnostic({
      stage: 'register.confirm',
      outcome: 'failed',
      errorName: 'NotAllowedError',
      message: 'The operation either timed out or was not allowed.',
      attachment: 'platform',
      transports: ['internal'],
      backupEligible: true,
      backedUp: false,
      prf: true,
      os: '18.1',
      clientCapabilities: { 'extension:prf': true, conditionalCreate: false },
    });
    expect(record).toEqual({
      stage: 'register.confirm',
      outcome: 'Failure',
      errorName: 'NotAllowedError',
      message: 'The operation either timed out or was not allowed.',
      authenticatorAttachment: 'platform',
      transports: ['internal'],
      backupEligible: true,
      backedUp: false,
      prfPresent: true,
      os: '18.1',
      clientCapabilities: JSON.stringify({ 'extension:prf': true, conditionalCreate: false }),
    });
  });

  it('drops messages that could carry secrets and unknown fields', () => {
    const record = passkeyDiagnostic({
      stage: 'x'.repeat(100),
      outcome: 'failed',
      message: 'https://evil.example/?prf=secret',
      transports: ['internal', 'hybrid', 'usb', 'nfc', 'ble', 'smart-card', 'cable', 'internal', 'usb', 'ble'],
      clientCapabilities: { 'extension:prf': true, corrupt: 'not-boolean' },
    } as Parameters<typeof passkeyDiagnostic>[0]);
    expect(record['message']).toBe('<unavailable>');
    expect((record['stage'] as string).length).toBeLessThanOrEqual(64);
    expect((record['transports'] as string[]).length).toBeLessThanOrEqual(8);
    expect(record['clientCapabilities']).toBe(JSON.stringify({ 'extension:prf': true }));
  });

  it('omits optional fields entirely when not given', () => {
    expect(passkeyDiagnostic({ stage: 's', outcome: 'completed' })).toEqual({ stage: 's', outcome: 'Success' });
  });

  it('maps aborted to the API Aborted literal', () => {
    expect(passkeyDiagnostic({ stage: 's', outcome: 'aborted' })).toEqual({ stage: 's', outcome: 'Aborted' });
  });
});
