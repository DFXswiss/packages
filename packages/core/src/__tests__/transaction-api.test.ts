import { TransactionApi } from '../client/TransactionApi';
import { DfxHttpClient, ResponseType } from '../client/DfxHttpClient';
import { ExportFormat, TransactionRefundTarget } from '../definitions/transaction';

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

describe('TransactionApi', () => {
  describe('list', () => {
    it('requests the transaction list without a query when no address is given', async () => {
      const response = [{ uid: 'U1' }];
      const mockHttp = createMockHttpClient(response);
      const api = new TransactionApi(mockHttp);

      const result = await api.list();

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'transaction', method: 'GET' });
      expect(result).toEqual(response);
    });

    it('appends userAddress when an address is given', async () => {
      const response = [{ uid: 'U1' }];
      const mockHttp = createMockHttpClient(response);
      const api = new TransactionApi(mockHttp);

      const result = await api.list('0xabc');

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'transaction?userAddress=0xabc', method: 'GET' });
      expect(result).toEqual(response);
    });
  });

  describe('getDetail', () => {
    it('requests detail transactions without a query when no dates are given', async () => {
      const response = [{ uid: 'U1' }];
      const mockHttp = createMockHttpClient(response);
      const api = new TransactionApi(mockHttp);

      const result = await api.getDetail();

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'transaction/detail', method: 'GET' });
      expect(result).toEqual(response);
    });

    it('appends from and to query params when dates are given', async () => {
      const response = [{ uid: 'U1' }];
      const mockHttp = createMockHttpClient(response);
      const api = new TransactionApi(mockHttp);

      const result = await api.getDetail('2024-01-01', '2024-02-01');

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'transaction/detail?from=2024-01-01&to=2024-02-01',
        method: 'GET',
      });
      expect(result).toEqual(response);
    });
  });

  describe('getSingle', () => {
    it('requests a single transaction by uid', async () => {
      const response = { uid: 'U1' };
      const mockHttp = createMockHttpClient(response);
      const api = new TransactionApi(mockHttp);

      const result = await api.getSingle({ uid: 'U1' });

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'transaction/single?uid=U1', method: 'GET' });
      expect(result).toEqual(response);
    });

    it('maps ckoId to the cko-id query key', async () => {
      const response = { uid: 'U1' };
      const mockHttp = createMockHttpClient(response);
      const api = new TransactionApi(mockHttp);

      const result = await api.getSingle({ ckoId: 'CKO' });

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'transaction/single?cko-id=CKO', method: 'GET' });
      expect(result).toEqual(response);
    });

    it('maps requestId to the request-id query key', async () => {
      const response = { uid: 'U1' };
      const mockHttp = createMockHttpClient(response);
      const api = new TransactionApi(mockHttp);

      const result = await api.getSingle({ requestId: 'R1' });

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'transaction/single?request-id=R1', method: 'GET' });
      expect(result).toEqual(response);
    });
  });

  describe('exportCsv', () => {
    it('exports csv without a query when the filter is empty', async () => {
      const response = 'csv-body';
      const mockHttp = createMockHttpClient(response);
      const api = new TransactionApi(mockHttp);

      const result = await api.exportCsv({});

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'transaction/detail/csv',
        method: 'PUT',
        responseType: ResponseType.TEXT,
      });
      expect(result).toEqual(response);
    });

    it('builds the filter query with every history field including dates and booleans', async () => {
      const response = 'csv-body';
      const mockHttp = createMockHttpClient(response);
      const api = new TransactionApi(mockHttp);

      const result = await api.exportCsv({
        userAddress: '0xabc',
        from: new Date('2024-01-01T00:00:00.000Z'),
        to: new Date('2024-02-01T00:00:00.000Z'),
        format: ExportFormat.CSV,
        buy: true,
        sell: true,
        staking: false,
        ref: false,
        lm: false,
      });

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({
        url:
          'transaction/detail/csv?userAddress=0xabc' +
          '&from=2024-01-01T00%3A00%3A00.000Z' +
          '&to=2024-02-01T00%3A00%3A00.000Z' +
          '&format=csv&buy=true&sell=true&staking=false&ref=false&lm=false',
        method: 'PUT',
        responseType: ResponseType.TEXT,
      });
      expect(result).toEqual(response);
    });
  });

  describe('getHistory', () => {
    it('requests history text for the given type and filter', async () => {
      const response = 'history-body';
      const mockHttp = createMockHttpClient(response);
      const api = new TransactionApi(mockHttp);

      const result = await api.getHistory('cointracking', { buy: true });

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'transaction/cointracking?buy=true',
        method: 'GET',
        responseType: ResponseType.TEXT,
      });
      expect(result).toEqual(response);
    });
  });

  describe('getUnassigned', () => {
    it('requests unassigned transactions', async () => {
      const response = [{ uid: 'U1' }];
      const mockHttp = createMockHttpClient(response);
      const api = new TransactionApi(mockHttp);

      const result = await api.getUnassigned();

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'transaction/unassigned', method: 'GET' });
      expect(result).toEqual(response);
    });
  });

  describe('getTargets', () => {
    it('requests transaction targets', async () => {
      const response = [{ id: 1 }];
      const mockHttp = createMockHttpClient(response);
      const api = new TransactionApi(mockHttp);

      const result = await api.getTargets();

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'transaction/target', method: 'GET' });
      expect(result).toEqual(response);
    });
  });

  describe('setTarget', () => {
    it('puts the buyId query on the transaction target url', async () => {
      const mockHttp = createMockHttpClient(undefined);
      const api = new TransactionApi(mockHttp);

      const result = await api.setTarget(9, 4);

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'transaction/9/target?buyId=4', method: 'PUT' });
      expect(result).toBeUndefined();
    });
  });

  describe('getInvoice', () => {
    it('requests an invoice by numeric id', async () => {
      const response = { pdfData: 'base64' };
      const mockHttp = createMockHttpClient(response);
      const api = new TransactionApi(mockHttp);

      const result = await api.getInvoice(3);

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'transaction/3/invoice', method: 'PUT' });
      expect(result).toEqual(response);
    });

    it('requests an invoice by string id', async () => {
      const response = { pdfData: 'base64' };
      const mockHttp = createMockHttpClient(response);
      const api = new TransactionApi(mockHttp);

      const result = await api.getInvoice('abc');

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'transaction/abc/invoice', method: 'PUT' });
      expect(result).toEqual(response);
    });
  });

  describe('getReceipt', () => {
    it('requests a receipt by id', async () => {
      const response = { pdfData: 'base64' };
      const mockHttp = createMockHttpClient(response);
      const api = new TransactionApi(mockHttp);

      const result = await api.getReceipt(3);

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'transaction/3/receipt', method: 'PUT' });
      expect(result).toEqual(response);
    });
  });

  describe('getRefund', () => {
    it('requests refund data by id', async () => {
      const response = { expiryDate: new Date('2024-03-01T00:00:00.000Z') };
      const mockHttp = createMockHttpClient(response);
      const api = new TransactionApi(mockHttp);

      const result = await api.getRefund(3);

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'transaction/3/refund', method: 'GET' });
      expect(result).toEqual(response);
    });
  });

  describe('setRefundTarget', () => {
    it('puts the refund target data', async () => {
      const data: TransactionRefundTarget = { refundTarget: 'CH9300762011623852957' };
      const mockHttp = createMockHttpClient(undefined);
      const api = new TransactionApi(mockHttp);

      const result = await api.setRefundTarget(3, data);

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'transaction/3/refund',
        method: 'PUT',
        data,
      });
      expect(result).toBeUndefined();
    });
  });
});
