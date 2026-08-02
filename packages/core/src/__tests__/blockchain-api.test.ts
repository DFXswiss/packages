import { BlockchainApi } from '../client/BlockchainApi';
import { DfxHttpClient } from '../client/DfxHttpClient';
import { Blockchain } from '../definitions/blockchain';

function createMockHttpClient(response?: any) {
  const requestMock = jest.fn().mockResolvedValue(response);

  return {
    request: requestMock,
    requestAbsolute: jest.fn(),
    getBaseUrl: jest.fn().mockReturnValue('https://api.dfx.swiss'),
    getApiUrl: jest.fn().mockReturnValue('https://api.dfx.swiss/v1'),
    setToken: jest.fn(),
    getToken: jest.fn(),
  } as unknown as DfxHttpClient & { request: jest.Mock };
}

describe('BlockchainApi', () => {
  describe('getBalances', () => {
    it('posts address, blockchain and asset ids', async () => {
      const balances = { balances: [{ assetId: 1, balance: 2.5 }] };
      const mockHttp = createMockHttpClient(balances);
      const api = new BlockchainApi(mockHttp);

      const result = await api.getBalances({ address: '0xabc', blockchain: Blockchain.ETHEREUM, assetIds: [1, 2] });

      expect(result).toEqual(balances);
      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'blockchain/balances',
        method: 'POST',
        data: { address: '0xabc', blockchain: Blockchain.ETHEREUM, assetIds: [1, 2] },
      });
    });

    it('leaves out the asset filter when none was given', async () => {
      const mockHttp = createMockHttpClient({ balances: [] });
      const api = new BlockchainApi(mockHttp);

      await api.getBalances({ address: '0xabc', blockchain: Blockchain.ETHEREUM });

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'blockchain/balances',
        method: 'POST',
        data: { address: '0xabc', blockchain: Blockchain.ETHEREUM },
      });
    });
  });

  describe('createTransaction', () => {
    it('posts the transfer and returns it unsigned', async () => {
      const unsigned = { rawTransaction: 'AAA=', encoding: 'base64' as const };
      const mockHttp = createMockHttpClient(unsigned);
      const api = new BlockchainApi(mockHttp);

      const result = await api.createTransaction({
        blockchain: Blockchain.SOLANA,
        fromAddress: 'from',
        toAddress: 'to',
        amount: 1,
        assetId: 3,
      });

      expect(result).toEqual(unsigned);
      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'blockchain/transaction',
        method: 'POST',
        data: { blockchain: Blockchain.SOLANA, fromAddress: 'from', toAddress: 'to', amount: 1, assetId: 3 },
      });
    });
  });

  describe('broadcastTransaction', () => {
    it('returns the resulting hash', async () => {
      const mockHttp = createMockHttpClient({ txHash: '0xdeadbeef' });
      const api = new BlockchainApi(mockHttp);

      const result = await api.broadcastTransaction({ blockchain: Blockchain.TRON, signedTransaction: 'signed' });

      expect(result).toEqual({ txHash: '0xdeadbeef' });
      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'blockchain/broadcast',
        method: 'POST',
        data: { blockchain: Blockchain.TRON, signedTransaction: 'signed' },
      });
    });
  });
});
