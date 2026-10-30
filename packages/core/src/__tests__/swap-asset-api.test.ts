import { AssetApi } from '../client/AssetApi';
import { SwapApi } from '../client/SwapApi';
import { DfxHttpClient } from '../client/DfxHttpClient';

function createMockHttpClient(resolve?: any) {
  const requestMock = jest.fn().mockImplementation(() => Promise.resolve(resolve));
  return { request: requestMock } as unknown as DfxHttpClient & { request: jest.Mock };
}

function lastCall(mock: ReturnType<typeof createMockHttpClient>) {
  const calls = (mock.request as jest.Mock).mock.calls;
  return calls[calls.length - 1][0];
}

describe('SwapApi.confirm', () => {
  it('confirms with PUT (backend @Put paymentInfos/:id/confirm, intern#352)', async () => {
    const mock = createMockHttpClient({});
    await new SwapApi(mock).confirm(5, {} as never);
    expect(lastCall(mock)).toMatchObject({ method: 'PUT' });
  });
});

describe('AssetApi.list', () => {
  it('loads public assets without a token and without a blockchain filter', async () => {
    const mock = createMockHttpClient([]);
    await new AssetApi(mock).list();
    expect(lastCall(mock)).toEqual({ url: 'asset', method: 'GET', token: false });
  });

  it('keeps the blockchain filter when given', async () => {
    const mock = createMockHttpClient([]);
    await new AssetApi(mock).list({ blockchains: ['Ethereum'] as never });
    expect(lastCall(mock).url).toBe('asset?blockchains=Ethereum');
  });
});
