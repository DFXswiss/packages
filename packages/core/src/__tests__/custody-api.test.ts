import { CustodyApi } from '../client/CustodyApi';
import { DfxHttpClient } from '../client/DfxHttpClient';
import { Blockchain } from '../definitions/blockchain';
import {
  CustodyAccessLevel,
  CustodyAccount,
  CustodyAddressType,
  CustodyOrderType,
  CustodyValueCurrency,
  LegacyCustodyAccountId,
  toCustodyAccountId,
} from '../definitions/custody';

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

describe('CustodyApi', () => {
  describe('signup', () => {
    it('posts the address type', async () => {
      const mockHttp = createMockHttpClient({ accessToken: 'token' });
      const api = new CustodyApi(mockHttp);

      const result = await api.signup({ addressType: CustodyAddressType.EVM });

      expect(result).toEqual({ accessToken: 'token' });
      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'custody',
        method: 'POST',
        data: { addressType: CustodyAddressType.EVM },
      });
    });
  });

  describe('account scoped reads', () => {
    it('addresses an account by its id', async () => {
      const mockHttp = createMockHttpClient({});
      const api = new CustodyApi(mockHttp);

      await api.getAccountBalance(7);

      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'custody/account/7/balance', method: 'GET' });
    });

    it('addresses the legacy account by its marker, not by an id', async () => {
      const mockHttp = createMockHttpClient({});
      const api = new CustodyApi(mockHttp);

      await api.getAccountHistory(LegacyCustodyAccountId);

      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'custody/account/legacy/history', method: 'GET' });
    });

    it('reads the own account through the plain endpoints', async () => {
      const mockHttp = createMockHttpClient({});
      const api = new CustodyApi(mockHttp);

      await api.getBalance();
      await api.getHistory();
      await api.getOrders();

      expect(mockHttp.request.mock.calls.map((c: any[]) => c[0].url)).toEqual([
        'custody',
        'custody/history',
        'custody/order',
      ]);
    });
  });

  describe('orders', () => {
    it('sends the custody token with a new order rather than the session token', async () => {
      const mockHttp = createMockHttpClient({});
      const api = new CustodyApi(mockHttp);

      await api.createOrder(
        { type: CustodyOrderType.DEPOSIT, sourceAsset: 'EUR', targetAsset: 'dEURO', sourceAmount: 10 },
        'custody-token',
      );

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'custody/order',
        method: 'POST',
        data: { type: CustodyOrderType.DEPOSIT, sourceAsset: 'EUR', targetAsset: 'dEURO', sourceAmount: 10 },
        token: 'custody-token',
      });
    });

    it('confirms an order by id', async () => {
      const mockHttp = createMockHttpClient(undefined);
      const api = new CustodyApi(mockHttp);

      await api.confirmOrder(42, 'custody-token');

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'custody/order/42/confirm',
        method: 'POST',
        token: 'custody-token',
      });
    });

    it('carries the destination of a send order', async () => {
      const mockHttp = createMockHttpClient({});
      const api = new CustodyApi(mockHttp);

      await api.createOrder(
        {
          type: CustodyOrderType.SEND,
          sourceAsset: 'ZCHF',
          targetAsset: 'ZCHF',
          sourceAmount: 5,
          targetAddress: '0xabc',
          targetBlockchain: Blockchain.ETHEREUM,
        },
        'custody-token',
      );

      expect((mockHttp.request.mock.calls[0][0] as { data: Record<string, unknown> }).data).toEqual({
        type: CustodyOrderType.SEND,
        sourceAsset: 'ZCHF',
        targetAsset: 'ZCHF',
        sourceAmount: 5,
        targetAddress: '0xabc',
        targetBlockchain: Blockchain.ETHEREUM,
      });
    });

    it('carries the destination account of a withdrawal', async () => {
      const mockHttp = createMockHttpClient({});
      const api = new CustodyApi(mockHttp);

      await api.createOrder(
        {
          type: CustodyOrderType.WITHDRAWAL,
          sourceAsset: 'ZCHF',
          targetAsset: 'CHF',
          targetAmount: 5,
          targetIban: 'CH9300762011623852957',
        },
        'custody-token',
      );

      expect((mockHttp.request.mock.calls[0][0] as { data: Record<string, unknown> }).data).toEqual({
        type: CustodyOrderType.WITHDRAWAL,
        sourceAsset: 'ZCHF',
        targetAsset: 'CHF',
        targetAmount: 5,
        targetIban: 'CH9300762011623852957',
      });
    });
  });

  describe('account addressing', () => {
    it('resolves the legacy account to its marker rather than to a null id', () => {
      const legacy: CustodyAccount = {
        id: null,
        title: 'Safe',
        isLegacy: true,
        accessLevel: CustodyAccessLevel.WRITE,
        isOwner: true,
      };

      expect(toCustodyAccountId(legacy)).toBe(LegacyCustodyAccountId);
    });

    it('resolves an ordinary account to its id', () => {
      const account: CustodyAccount = {
        id: 7,
        title: 'Safe',
        isLegacy: false,
        accessLevel: CustodyAccessLevel.READ,
        isOwner: false,
      };

      expect(toCustodyAccountId(account)).toBe(7);
    });
  });

  describe('pdf', () => {
    it('passes currency and date as query parameters', async () => {
      const mockHttp = createMockHttpClient({ pdfData: '' });
      const api = new CustodyApi(mockHttp);

      await api.getPdf({ currency: CustodyValueCurrency.CHF, date: new Date('2026-01-31T00:00:00.000Z') });

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'custody/pdf?currency=CHF&date=2026-01-31T00%3A00%3A00.000Z',
        method: 'GET',
      });
    });
  });

  describe('access grants', () => {
    it('grants access on an account', async () => {
      const mockHttp = createMockHttpClient({});
      const api = new CustodyApi(mockHttp);

      await api.grantAccess(3, { mail: 'someone@example.com', accessLevel: CustodyAccessLevel.READ });

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'custody/account/3/access',
        method: 'POST',
        data: { mail: 'someone@example.com', accessLevel: CustodyAccessLevel.READ },
      });
    });

    it('revokes a single grant', async () => {
      const mockHttp = createMockHttpClient(undefined);
      const api = new CustodyApi(mockHttp);

      await api.revokeAccess(3, 9);

      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'custody/account/3/access/9', method: 'DELETE' });
    });
  });
});
