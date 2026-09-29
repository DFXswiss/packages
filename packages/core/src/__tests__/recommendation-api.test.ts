import { DfxHttpClient } from '../client/DfxHttpClient';
import { RecommendationApi } from '../client/RecommendationApi';
import {
  Recommendation,
  RecommendationMethod,
  RecommendationStatus,
  RecommendationType,
} from '../definitions/recommendation';

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

const recommendation: Recommendation = {
  id: 42,
  code: 'ABC123',
  status: RecommendationStatus.CREATED,
  type: RecommendationType.INVITATION,
  method: RecommendationMethod.MAIL,
  name: 'Alias',
};

describe('RecommendationApi', () => {
  describe('list', () => {
    it('requests the recommendations of the authenticated account', async () => {
      const mockHttp = createMockHttpClient([recommendation]);
      const api = new RecommendationApi(mockHttp);

      const result = await api.list();

      expect(result).toEqual([recommendation]);
      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'recommendation', method: 'GET' });
    });

    it('does not opt out of the auth token', async () => {
      const mockHttp = createMockHttpClient([]);
      const api = new RecommendationApi(mockHttp);

      await api.list();

      expect(mockHttp.request.mock.calls[0][0]).not.toHaveProperty('token');
    });
  });

  describe('create', () => {
    it('posts alias and mail to the recommendation endpoint', async () => {
      const mockHttp = createMockHttpClient(recommendation);
      const api = new RecommendationApi(mockHttp);

      const result = await api.create({ recommendedAlias: 'Alias', recommendedMail: 'someone@example.com' });

      expect(result).toEqual(recommendation);
      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'recommendation',
        method: 'POST',
        data: { recommendedAlias: 'Alias', recommendedMail: 'someone@example.com' },
      });
    });

    it('sends the alias alone when no mail is given', async () => {
      const mockHttp = createMockHttpClient(recommendation);
      const api = new RecommendationApi(mockHttp);

      await api.create({ recommendedAlias: 'Alias' });

      expect(mockHttp.request).toHaveBeenCalledWith({
        url: 'recommendation',
        method: 'POST',
        data: { recommendedAlias: 'Alias' },
      });
    });
  });

  describe('confirm and reject', () => {
    it('confirms by id', async () => {
      const mockHttp = createMockHttpClient(undefined);
      const api = new RecommendationApi(mockHttp);

      await api.confirm(42);

      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'recommendation/42/confirm', method: 'PUT' });
    });

    it('rejects by id', async () => {
      const mockHttp = createMockHttpClient(undefined);
      const api = new RecommendationApi(mockHttp);

      await api.reject(42);

      expect(mockHttp.request).toHaveBeenCalledWith({ url: 'recommendation/42/reject', method: 'PUT' });
    });
  });
});
