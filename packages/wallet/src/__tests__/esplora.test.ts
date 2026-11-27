import { EsploraClient, FetchLike, normalizeEsploraUrl } from '../providers/esplora';
import { WalletError } from '../util/errors';

const TXID = 'bcc94b98ca658d7a6165af037893fecd9943a05e2f2f999b06d068e0ab41dd80';

function mockFetch(answer: (url: string) => { status?: number; body: string }) {
  const calls: { url: string; init?: Parameters<FetchLike>[1] }[] = [];
  const fetch: FetchLike = async (url, init) => {
    calls.push({ url, init });
    const { status = 200, body } = answer(url);
    return { ok: status >= 200 && status < 300, status, text: async () => body };
  };
  return { fetch, calls };
}

describe('normalizeEsploraUrl', () => {
  it('accepts HTTPS and plain HTTP on the loopback host only', () => {
    expect(normalizeEsploraUrl('https://esplora.example/regtest/api/')).toBe('https://esplora.example/regtest/api');
    expect(normalizeEsploraUrl('http://localhost:3002')).toBe('http://localhost:3002');
    expect(normalizeEsploraUrl('http://127.0.0.1:3002/api')).toBe('http://127.0.0.1:3002/api');
    expect(() => normalizeEsploraUrl('http://192.168.1.10:3002')).toThrow(WalletError);
    expect(() => normalizeEsploraUrl('ftp://esplora.example')).toThrow(WalletError);
    expect(() => normalizeEsploraUrl('https://user:pw@esplora.example')).toThrow(WalletError);
    expect(() => normalizeEsploraUrl('https://esplora.example/api?key=1')).toThrow(WalletError);
    expect(() => normalizeEsploraUrl('not a url')).toThrow(WalletError);
  });
});

describe('EsploraClient', () => {
  it('is not available for regtest in PRD or a disabled environment', () => {
    const { fetch } = mockFetch(() => ({ body: '' }));
    expect(() => new EsploraClient('https://e.example', { network: 'regtest', env: 'prd', fetch })).toThrow(
      /not enabled/,
    );
    expect(
      () => new EsploraClient('https://e.example', { network: 'regtest', env: 'stg', regtestEnvs: ['dev'], fetch }),
    ).toThrow(/not enabled/);
    expect(() => new EsploraClient('https://e.example', { network: 'regtest', fetch })).toThrow(/not enabled/);
    expect(new EsploraClient('https://e.example', { network: 'regtest', env: 'dev', fetch }).network).toBe('regtest');
  });

  it('reads balance, UTXOs and history directly from the configured endpoint', async () => {
    const { fetch, calls } = mockFetch((url) => {
      if (url.endsWith('/utxo'))
        return { body: JSON.stringify([{ txid: TXID, vout: 0, value: 5000, status: { confirmed: true } }]) };
      if (url.includes('/txs')) return { body: '[]' };
      return {
        body: JSON.stringify({
          address: 'a',
          chain_stats: { funded_txo_sum: 9000, spent_txo_sum: 4000, tx_count: 2 },
          mempool_stats: { funded_txo_sum: 100, spent_txo_sum: 0, tx_count: 1 },
        }),
      };
    });
    const client = new EsploraClient('http://localhost:3002/', { network: 'regtest', env: 'loc', fetch });

    await expect(client.balance('bcrt1qx')).resolves.toEqual({ confirmed: 5000, unconfirmed: 100 });
    await expect(client.utxos('bcrt1qx')).resolves.toHaveLength(1);
    await client.transactions('bcrt1qx', TXID);
    expect(calls.map((call) => call.url)).toEqual([
      'http://localhost:3002/address/bcrt1qx',
      'http://localhost:3002/address/bcrt1qx/utxo',
      `http://localhost:3002/address/bcrt1qx/txs/chain/${TXID}`,
    ]);
  });

  it('broadcasts raw hex as text/plain and checks the returned txid', async () => {
    const { fetch, calls } = mockFetch(() => ({ body: `${TXID.toUpperCase()}\n` }));
    const client = new EsploraClient('https://e.example/api', { network: 'regtest', env: 'dev', fetch });
    await expect(client.broadcast('0200')).resolves.toBe(TXID);
    expect(calls[0]).toEqual({
      url: 'https://e.example/api/tx',
      init: { method: 'POST', body: '0200', headers: { 'Content-Type': 'text/plain' } },
    });
    await expect(client.broadcast('xyz')).rejects.toThrow(WalletError);
  });

  it('reports endpoint errors and malformed answers', async () => {
    const failing = mockFetch(() => ({ status: 400, body: 'sendrawtransaction RPC error: bad-txns' }));
    const client = new EsploraClient('https://e.example', { network: 'testnet4', fetch: failing.fetch });
    await expect(client.broadcast('0200')).rejects.toThrow(/400/);

    const garbage = mockFetch(() => ({ body: 'tip' }));
    const other = new EsploraClient('https://e.example', { network: 'testnet4', fetch: garbage.fetch });
    await expect(other.tipHeight()).rejects.toThrow(WalletError);
    await expect(other.feeEstimates()).rejects.toThrow(WalletError);

    const down: FetchLike = () => Promise.reject(new TypeError('Failed to fetch'));
    await expect(
      new EsploraClient('https://e.example', { network: 'mainnet', fetch: down }).tipHeight(),
    ).rejects.toThrow(/unreachable/);
  });
});
