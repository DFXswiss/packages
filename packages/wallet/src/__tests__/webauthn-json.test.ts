import { bytesToBase64Url, credentialToJSON } from '../passkey/webauthn-json';

function fakeCredential(
  withToJson: boolean,
  clientExtensionResults: Record<string, unknown> = {},
): PublicKeyCredential {
  return {
    id: 'cred-id',
    rawId: new Uint8Array([1, 2, 3]).buffer,
    type: 'public-key',
    authenticatorAttachment: 'platform',
    response: {
      clientDataJSON: new Uint8Array([9]).buffer,
      attestationObject: new Uint8Array([8]).buffer,
      userHandle: new Uint8Array([7]).buffer,
      getTransports: () => ['internal', 'hybrid'],
    },
    getClientExtensionResults: () => clientExtensionResults,
    ...(withToJson ? { toJSON: () => ({ id: 'cred-id', clientExtensionResults: { ...clientExtensionResults } }) } : {}),
  } as unknown as PublicKeyCredential;
}

describe('bytesToBase64Url / base64UrlToBytes', () => {
  it('round-trips without padding', async () => {
    const { base64UrlToBytes } = await import('../passkey/webauthn-json');
    const bytes = new Uint8Array([0, 1, 2, 250, 255]);
    const encoded = bytesToBase64Url(bytes);
    expect(encoded).not.toContain('=');
    expect(encoded).not.toContain('+');
    expect(base64UrlToBytes(encoded)).toEqual(bytes);
  });
});

describe('credentialToJSON', () => {
  it('serializes the manual path with base64url fields, attachment and transports', () => {
    const json = credentialToJSON(fakeCredential(false));
    expect(json['id']).toBe('cred-id');
    expect(json['rawId']).toBe(bytesToBase64Url(new Uint8Array([1, 2, 3])));
    expect(json['authenticatorAttachment']).toBe('platform');
    const response = json['response'] as Record<string, unknown>;
    expect(response['attestationObject']).toBe(bytesToBase64Url(new Uint8Array([8])));
    expect(response['transports']).toEqual(['internal', 'hybrid']);
  });

  it('strips PRF results from clientExtensionResults on both paths', () => {
    const withPrf = { prf: { results: { first: new Uint8Array(32).fill(1) } }, other: true };
    for (const withToJson of [false, true]) {
      const json = credentialToJSON(fakeCredential(withToJson, withPrf));
      const extensions = json['clientExtensionResults'] as Record<string, unknown>;
      expect(extensions['prf']).toBeUndefined();
      expect(extensions['other']).toBe(true);
    }
  });
});
