import { PasskeyApi } from '../client/PasskeyApi';
import { DfxHttpClient } from '../client/DfxHttpClient';

function createMockHttpClient(resolve?: any) {
  const requestMock = jest.fn().mockImplementation(() => Promise.resolve(resolve));
  return { request: requestMock } as unknown as DfxHttpClient & { request: jest.Mock };
}

function lastCall(mock: ReturnType<typeof createMockHttpClient>) {
  const calls = (mock.request as jest.Mock).mock.calls;
  return calls[calls.length - 1][0];
}

const proof = {
  challengeId: 'a'.repeat(64),
  credential: { id: 'cred', type: 'public-key' },
  userHandle: 'dXNlci1oYW5kbGU',
  derivationVersion: 'V1' as const,
  address: '0xd82de0A6A49120ed9006B337EB6c9AfdE03DD37A',
  signature: '0xabc',
  sparkAddress: 'spark1pgss9qfk8ygtphqqzkj2yhn43k3s7r3g8z822ffvpcm38ym094800574x5numh',
  sparkSignature: 'ab'.repeat(64),
};

describe('PasskeyApi', () => {
  it('keeps the ceremony endpoints public', async () => {
    const mock = createMockHttpClient({ challengeId: 'x', challenge: 'y', rpId: 'app.dfx.swiss', timeout: 600000 });
    const api = new PasskeyApi(mock);

    await api.registerBegin();
    expect(lastCall(mock)).toMatchObject({ url: 'auth/passkey/register/begin', method: 'POST', token: false });

    await api.authenticateBegin();
    expect(lastCall(mock)).toMatchObject({ url: 'auth/passkey/authenticate/begin', method: 'POST', token: false });

    await api.registerFinish({ ...proof });
    expect(lastCall(mock)).toMatchObject({
      url: 'auth/passkey/register/finish',
      method: 'POST',
      token: false,
      data: proof,
    });

    await api.authenticateFinish({ challengeId: 'x', credential: {} });
    expect(lastCall(mock)).toMatchObject({
      url: 'auth/passkey/authenticate/finish',
      method: 'POST',
      token: false,
    });

    await api.revokeBegin();
    expect(lastCall(mock)).toMatchObject({ url: 'auth/passkey/revoke/begin', method: 'POST', token: false });

    await api.revokeFinish({ challengeId: 'x', credential: {}, reason: 'Lost' });
    expect(lastCall(mock)).toMatchObject({ url: 'auth/passkey/revoke/finish', method: 'POST', token: false });
  });

  it('carries the passkey token explicitly and never retries', async () => {
    const mock = createMockHttpClient({ accessToken: 't', wallet: null });
    const api = new PasskeyApi(mock);

    await api.claimBegin('account-token');
    expect(lastCall(mock)).toMatchObject({ url: 'auth/passkey/claim/begin', method: 'POST', token: 'account-token' });

    await api.claimFinish({ ...proof }, 'account-token');
    expect(lastCall(mock)).toMatchObject({ url: 'auth/passkey/claim/finish', method: 'POST', token: 'account-token' });

    const link = { address: 'bc1q…', signature: 'sig', family: 'Bitcoin' as const, path: "m/84'/0'/0'/0/0" };
    await api.link(link, 'passkey-token');
    expect(lastCall(mock)).toMatchObject({
      url: 'auth/passkey/link',
      method: 'POST',
      token: 'passkey-token',
      data: link,
    });
    expect((mock.request as jest.Mock).mock.calls).toHaveLength(3);
  });

  it('uses the management endpoints with ids', async () => {
    const mock = createMockHttpClient([]);
    const api = new PasskeyApi(mock);

    await api.credentialStatus(['id-1', 'id-2']);
    expect(lastCall(mock)).toMatchObject({
      url: 'auth/passkey/credentialStatus?ids=id-1%2Cid-2',
      method: 'GET',
      token: false,
    });

    await api.wallets('token');
    expect(lastCall(mock)).toMatchObject({ url: 'passkey/wallets', method: 'GET', token: 'token' });

    await api.backupSeen(7, 'token');
    expect(lastCall(mock)).toMatchObject({ url: 'passkey/wallets/7/backupSeen', method: 'PUT', token: 'token' });

    await api.revoke(7, 'Compromised', 'token');
    expect(lastCall(mock)).toMatchObject({
      url: 'passkey/wallets/7/revoke',
      method: 'PUT',
      token: 'token',
      data: { reason: 'Compromised' },
    });

    await api.diagnostics({ stage: 'Registration', outcome: 'Failure', errorName: 'NotAllowedError' });
    expect(lastCall(mock)).toMatchObject({ url: 'passkey/diagnostics', method: 'POST', token: false });
  });
});
