import { ChainApi } from '../client/ChainApi';
import { WalletDataApi } from '../client/WalletDataApi';
import { DfxHttpClient, ResponseType } from '../client/DfxHttpClient';

function createMockHttpClient(resolve?: any) {
  const requestMock = jest.fn().mockImplementation(() => Promise.resolve(resolve));
  return { request: requestMock } as unknown as DfxHttpClient & { request: jest.Mock };
}

function lastCall(mock: ReturnType<typeof createMockHttpClient>) {
  const calls = (mock.request as jest.Mock).mock.calls;
  return calls[calls.length - 1][0];
}

describe('ChainApi', () => {
  it('lists the chain classification publicly', async () => {
    const mock = createMockHttpClient([]);
    await new ChainApi(mock).list();
    expect(lastCall(mock)).toEqual({ url: 'walletData/chains', method: 'GET', token: false });
  });
});

describe('WalletDataApi', () => {
  it('exposes both Bitcoin networks Esplora-shaped', async () => {
    const mock = createMockHttpClient({});
    const api = new WalletDataApi(mock);

    await api.bitcoin.utxos('bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu');
    expect(lastCall(mock)).toMatchObject({
      url: 'walletData/esplora/Bitcoin/address/bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu/utxo',
      token: false,
    });

    await api.bitcoinTestnet4.tipHeight();
    expect(lastCall(mock)).toMatchObject({
      url: 'walletData/esplora/BitcoinTestnet4/blocks/tip/height',
      responseType: ResponseType.TEXT,
    });
  });

  it('broadcasts raw transactions as text/plain and returns the txid as text', async () => {
    const mock = createMockHttpClient('txid');
    await new WalletDataApi(mock).bitcoin.broadcast('deadbeef');
    expect(lastCall(mock)).toMatchObject({
      url: 'walletData/esplora/Bitcoin/tx',
      method: 'POST',
      data: 'deadbeef',
      noJson: true,
      responseType: ResponseType.TEXT,
      headers: { 'Content-Type': 'text/plain' },
    });
  });

  it('passes JSON-RPC bodies through and keeps them public', async () => {
    const mock = createMockHttpClient({ jsonrpc: '2.0', id: 1, result: '0x1' });
    const request = { jsonrpc: '2.0' as const, id: 1, method: 'eth_blockNumber' };
    await new WalletDataApi(mock).evmRpc(1, request);
    expect(lastCall(mock)).toEqual({ url: 'walletData/evm/1/rpc', method: 'POST', data: request, token: false });
  });

  it('builds the index, price, lookup and list URLs', async () => {
    const mock = createMockHttpClient([]);
    const api = new WalletDataApi(mock);

    await api.evmTransfers(1, '0xabc', { direction: 'out', pageKey: 'p' });
    expect(lastCall(mock).url).toBe('walletData/evm/1/transfers/0xabc?direction=out&pageKey=p');

    await api.evmTokens(1, '0xabc');
    expect(lastCall(mock).url).toBe('walletData/evm/1/tokens/0xabc');

    await api.evmNfts(1, '0xabc');
    expect(lastCall(mock).url).toBe('walletData/evm/1/nfts/0xabc');

    await api.evmApprovals(1, '0xabc');
    expect(lastCall(mock).url).toBe('walletData/evm/1/approvals/0xabc');

    await api.ensAddress('name.eth');
    expect(lastCall(mock).url).toBe('walletData/ens/address?name=name.eth');

    await api.ensName('0xabc');
    expect(lastCall(mock).url).toBe('walletData/ens/name?address=0xabc');

    await api.prices({ assetIds: [1, 2], currency: 'CHF' });
    expect(lastCall(mock).url).toBe('walletData/prices?assetIds=1%2C2&currency=CHF');

    await api.lnurl('LNURL1…');
    expect(lastCall(mock).url).toBe('walletData/lnurl?lnurl=LNURL1%E2%80%A6');

    await api.bip353('user@domain');
    expect(lastCall(mock).url).toBe('walletData/bip353/user@domain');

    await api.list('PhishingDomains');
    expect(lastCall(mock).url).toBe('walletData/lists/PhishingDomains');

    for (const call of (mock.request as jest.Mock).mock.calls) expect(call[0].token).toBe(false);
  });
});
