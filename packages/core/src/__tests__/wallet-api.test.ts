import { BuyApi } from '../client/BuyApi';
import { DfxApiClient } from '../client/DfxApiClient';
import { DfxHttpClient, ResponseType } from '../client/DfxHttpClient';
import { SellApi } from '../client/SellApi';
import { WalletApi } from '../client/WalletApi';
import { ApiException } from '../definitions/error';

function createMockHttpClient(resolve?: unknown) {
  const request = jest.fn().mockImplementation(() => Promise.resolve(resolve));
  return { request } as unknown as DfxHttpClient & { request: jest.Mock };
}

function lastCall(mock: ReturnType<typeof createMockHttpClient>) {
  const calls = mock.request.mock.calls;
  return calls[calls.length - 1][0];
}

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: 'status',
    json: async () => body,
    text: async () => String(body),
    headers: new Map(),
  } as unknown as Response;
}

describe('WalletApi passkeys', () => {
  it('keeps the ceremonies public and sends the wallet-api bodies', async () => {
    const mock = createMockHttpClient({});
    const api = new WalletApi(mock);
    api.setSessionToken('wallet-token');

    await api.registerBegin();
    expect(lastCall(mock)).toEqual({ url: 'wallet/register/begin', method: 'POST', token: false });

    await api.registerFinish({ challengeId: 'c', response: { id: 'r' } });
    expect(lastCall(mock)).toEqual({
      url: 'wallet/register/finish',
      method: 'POST',
      data: { challengeId: 'c', response: { id: 'r' } },
      token: false,
    });

    await api.authenticateBegin();
    expect(lastCall(mock)).toEqual({ url: 'wallet/authenticate/begin', method: 'POST', data: {}, token: false });

    await api.authenticateBegin('cred-id');
    expect(lastCall(mock)).toMatchObject({ data: { credentialId: 'cred-id' }, token: false });

    await api.authenticateFinish({ challengeId: 'c', response: { id: 'r' } });
    expect(lastCall(mock)).toMatchObject({ url: 'wallet/authenticate/finish', method: 'POST', token: false });
  });

  it('sends the wallet session on revoke and credentials, explicit token first', async () => {
    const mock = createMockHttpClient([]);
    const api = new WalletApi(mock);

    await api.credentials();
    expect(lastCall(mock)).toEqual({ url: 'wallet/credentials', method: 'GET', token: false });

    api.setSessionToken('stored');
    await api.credentials();
    expect(lastCall(mock)).toMatchObject({ token: 'stored' });

    await api.revokeBegin('explicit');
    expect(lastCall(mock)).toEqual({ url: 'wallet/revoke/begin', method: 'POST', token: 'explicit' });

    await api.revokeFinish({ challengeId: 'c', response: { id: 'r' } });
    expect(lastCall(mock)).toMatchObject({ url: 'wallet/revoke/finish', method: 'POST', token: 'stored' });

    api.setSessionToken(undefined);
    expect(api.getSessionToken()).toBeUndefined();
  });
});

describe('WalletApi addresses, config and data', () => {
  it('uses the documented paths', async () => {
    const mock = createMockHttpClient({});
    const api = new WalletApi(mock);

    await api.upsertAddress({ chain: 'bitcoin', address: 'bcrt1q…' }, 't');
    expect(lastCall(mock)).toEqual({
      url: 'wallet/addresses',
      method: 'PUT',
      data: { chain: 'bitcoin', address: 'bcrt1q…' },
      token: 't',
    });
    await api.addresses('t');
    expect(lastCall(mock)).toEqual({ url: 'wallet/addresses', method: 'GET', token: 't' });

    await api.config();
    expect(lastCall(mock)).toEqual({ url: 'wallet/config', method: 'GET', token: false });
    await api.chains();
    expect(lastCall(mock)).toMatchObject({ url: 'wallet/chains', token: false });
    await api.list('PhishingDomains');
    expect(lastCall(mock)).toMatchObject({ url: 'wallet/lists/PhishingDomains', token: false });
    await api.prices();
    expect(lastCall(mock)).toMatchObject({ url: 'wallet/prices', token: false });
    await api.ensAddress('vitalik.eth');
    expect(lastCall(mock)).toMatchObject({ url: 'wallet/ens/address?name=vitalik.eth', token: false });
    await api.ensName('0xabc');
    expect(lastCall(mock)).toMatchObject({ url: 'wallet/ens/name?address=0xabc', token: false });
    await api.lnurl('https://x.example/lnurl');
    expect(lastCall(mock).url).toBe(`wallet/lnurl?url=${encodeURIComponent('https://x.example/lnurl')}`);
    await api.lightningAddress('user@x.example');
    expect(lastCall(mock)).toMatchObject({ url: 'wallet/lightning-address/user%40x.example', token: false });
    await api.esplora('BitcoinRegtest', '/blocks/tip/height');
    expect(lastCall(mock)).toEqual({
      url: 'wallet/esplora/BitcoinRegtest/blocks/tip/height',
      method: 'GET',
      responseType: ResponseType.TEXT,
      token: false,
    });
    await api.evmRpc(1, { jsonrpc: '2.0', id: 1, method: 'eth_chainId' });
    expect(lastCall(mock)).toMatchObject({ url: 'wallet/evm/1/rpc', method: 'POST', token: false });
  });

  it('sends diagnostics with the optional session', async () => {
    const mock = createMockHttpClient({ accepted: true });
    const api = new WalletApi(mock);
    await api.diagnostics({ stage: 'Registration' });
    expect(lastCall(mock)).toMatchObject({ url: 'wallet/diagnostics', method: 'POST', token: false });
    api.setSessionToken('s');
    await api.diagnostics({ stage: 'Registration' });
    expect(lastCall(mock)).toMatchObject({ token: 's' });
  });
});

describe('WalletApi Bitcoin', () => {
  it('posts account, prepare and submit under the blockchain prefix with the session', async () => {
    const mock = createMockHttpClient({});
    const api = new WalletApi(mock);
    api.setSessionToken('s');

    await api.bitcoinAccount('BitcoinRegtest', { addresses: ['a'], historyLimit: 10 });
    expect(lastCall(mock)).toEqual({
      url: 'wallet/bitcoin/BitcoinRegtest/account',
      method: 'POST',
      data: { addresses: ['a'], historyLimit: 10 },
      token: 's',
    });

    await api.bitcoinFees('BitcoinRegtest');
    expect(lastCall(mock)).toEqual({ url: 'wallet/bitcoin/BitcoinRegtest/fees', method: 'GET', token: 's' });

    const prepare = {
      addresses: ['a'],
      changeAddress: 'c',
      destination: 'd',
      amount: '1000',
      feeRate: 'normal' as const,
    };
    await api.bitcoinPrepare('BitcoinRegtest', prepare);
    expect(lastCall(mock)).toEqual({
      url: 'wallet/bitcoin/BitcoinRegtest/prepare',
      method: 'POST',
      data: prepare,
      token: 's',
    });

    await api.bitcoinSubmit('BitcoinRegtest', { prepareId: 'p', transactionHex: '00' }, 'other');
    expect(lastCall(mock)).toEqual({
      url: 'wallet/bitcoin/BitcoinRegtest/submit',
      method: 'POST',
      data: { prepareId: 'p', transactionHex: '00' },
      token: 'other',
    });
  });
});

describe('WalletApi through DfxApiClient', () => {
  it('reaches /v1/wallet/* on the API host and never sends the customer token', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(jsonResponse({ families: { bitcoin: true, spark: false, evm: false } }));
    const client = new DfxApiClient({ apiUrl: 'https://stg.api.dfx.swiss/v1', fetchFn });
    client.setToken('customer-token');

    const config = await client.wallet.config();
    expect(config.families.bitcoin).toBe(true);
    const [url, init] = fetchFn.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://stg.api.dfx.swiss/v1/wallet/config');
    expect((init.headers as Record<string, string>).Authorization).toBeUndefined();

    await client.wallet.addresses();
    const [, sessionInit] = fetchFn.mock.calls[1] as [string, RequestInit];
    expect((sessionInit.headers as Record<string, string>).Authorization).toBeUndefined();

    client.wallet.setSessionToken('wallet-token');
    await client.wallet.addresses();
    const [, walletInit] = fetchFn.mock.calls[2] as [string, RequestInit];
    expect((walletInit.headers as Record<string, string>).Authorization).toBe('Bearer wallet-token');
    expect(client.getToken()).toBe('customer-token');
  });

  it('surfaces the wallet-api error code', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(
        jsonResponse({ statusCode: 422, code: 'InsufficientFunds', message: 'Not enough funds' }, 422),
      );
    const client = new DfxApiClient({ apiUrl: 'https://stg.api.dfx.swiss/v1', fetchFn });
    const failure = client.wallet.bitcoinPrepare(
      'BitcoinRegtest',
      { addresses: ['a'], changeAddress: 'c', destination: 'd', amount: 'max' },
      's',
    );
    await expect(failure).rejects.toBeInstanceOf(ApiException);
    await expect(failure).rejects.toMatchObject({ statusCode: 422, code: 'InsufficientFunds' });
  });
});

describe('simulate endpoints (DFX backend)', () => {
  it('simulates a buy payment and a sell payout', async () => {
    const mock = createMockHttpClient(undefined);
    await new BuyApi(mock).simulatePayment(12, { amount: 100, currency: 'CHF', idempotencyKey: 'k' });
    expect(lastCall(mock)).toEqual({
      url: 'buy/12/simulatePayment',
      method: 'PUT',
      data: { amount: 100, currency: 'CHF', idempotencyKey: 'k' },
    });

    await new SellApi(mock).simulatePayout(34);
    expect(lastCall(mock)).toEqual({ url: 'sell/34/simulatePayout', method: 'PUT' });
  });
});
