import { KycApi } from '../client/KycApi';
import { DfxHttpClient } from '../client/DfxHttpClient';
import {
  AccountType,
  KycFinancialQuestions,
  KycFinancialResponses,
  KycPersonalData,
  KycStepName,
  KycStepStatus,
  KycStepSubmit,
  QuestionType,
} from '../definitions/kyc';

function createMockHttpClient(response?: unknown) {
  const requestAbsoluteMock = jest.fn().mockResolvedValue(response);

  return {
    request: jest.fn(),
    requestAbsolute: requestAbsoluteMock,
    getBaseUrl: jest.fn().mockReturnValue('https://api.dfx.swiss'),
    getApiUrl: jest.fn().mockReturnValue('https://api.dfx.swiss/v1'),
    setToken: jest.fn(),
    getToken: jest.fn(),
  } as unknown as DfxHttpClient & { requestAbsolute: jest.Mock };
}

const personalData: KycPersonalData = {
  accountType: AccountType.PERSONAL,
  firstName: 'Ada',
  lastName: 'Lovelace',
  phone: '+491701234567',
  address: {
    street: 'Main',
    city: 'Berlin',
    zip: '10115',
    country: {
      id: 1,
      symbol: 'DE',
      name: 'Germany',
      locationAllowed: true,
      kycAllowed: true,
      nationalityAllowed: true,
      bankAllowed: true,
      cardAllowed: true,
      cryptoAllowed: true,
      kycOrganizationAllowed: true,
    },
  },
};

const financialData: KycFinancialResponses = {
  responses: [{ key: 'income', value: '50000' }],
};

const submitUrl = 'https://api.dfx.swiss/v2/kyc/data/personal/42';
const kycCode = 'kyc-code-1';

describe('KycApi', () => {
  describe('setPersonalData', () => {
    it('returns complete=false and missingFields from the HTTP response', async () => {
      const response: KycStepSubmit = {
        name: KycStepName.PERSONAL_DATA,
        status: KycStepStatus.IN_PROGRESS,
        sequenceNumber: 1,
        complete: false,
        missingFields: ['address.city', 'phone'],
      };
      const mockHttp = createMockHttpClient(response);
      const api = new KycApi(mockHttp);

      const result = await api.setPersonalData(kycCode, submitUrl, personalData);

      expect(result).toEqual(response);
      expect(result.complete).toBe(false);
      expect(mockHttp.requestAbsolute).toHaveBeenCalledTimes(1);
      expect(mockHttp.requestAbsolute).toHaveBeenCalledWith({
        url: submitUrl,
        method: 'PUT',
        data: personalData,
        token: false,
        headers: { 'x-kyc-code': kycCode },
      });
    });

    it('returns complete=true with empty missingFields from the HTTP response', async () => {
      const response: KycStepSubmit = {
        name: KycStepName.PERSONAL_DATA,
        status: KycStepStatus.IN_REVIEW,
        sequenceNumber: 1,
        complete: true,
        missingFields: [],
      };
      const mockHttp = createMockHttpClient(response);
      const api = new KycApi(mockHttp);

      const result = await api.setPersonalData(kycCode, submitUrl, personalData);

      expect(result).toEqual(response);
      expect(result.complete).toBe(true);
    });

    it('returns undefined fields when the API does not report completeness', async () => {
      const response: KycStepSubmit = {
        name: KycStepName.PERSONAL_DATA,
        status: KycStepStatus.IN_PROGRESS,
        sequenceNumber: 1,
      };
      const mockHttp = createMockHttpClient(response);
      const api = new KycApi(mockHttp);

      const result = await api.setPersonalData(kycCode, submitUrl, personalData);

      expect(result).toEqual(response);
      expect(result.complete).toBeUndefined();
      expect(result.missingFields).toBeUndefined();
    });
  });

  describe('setFinancialData', () => {
    const financialUrl = 'https://api.dfx.swiss/v2/kyc/data/financial/7';

    it('returns complete and missingFields from the HTTP response', async () => {
      const response: KycStepSubmit = {
        name: KycStepName.FINANCIAL_DATA,
        status: KycStepStatus.IN_PROGRESS,
        sequenceNumber: 2,
        complete: false,
        missingFields: ['income', 'assets'],
      };
      const mockHttp = createMockHttpClient(response);
      const api = new KycApi(mockHttp);

      const result = await api.setFinancialData(kycCode, financialUrl, financialData);

      expect(result).toEqual(response);
      expect(result.missingFields).toEqual(['income', 'assets']);
      expect(mockHttp.requestAbsolute).toHaveBeenCalledTimes(1);
      expect(mockHttp.requestAbsolute).toHaveBeenCalledWith({
        url: financialUrl,
        method: 'PUT',
        data: financialData,
        token: false,
        headers: { 'x-kyc-code': kycCode },
      });
    });
  });

  describe('getFinancialData', () => {
    const financialUrl = 'https://api.dfx.swiss/v2/kyc/data/financial/7';

    it('returns question conditions from the HTTP response', async () => {
      const response: KycFinancialQuestions = {
        responses: [],
        questions: [
          {
            key: 'occupation_description',
            type: QuestionType.TEXT,
            title: 'Describe your occupation',
            description: 'Only if employed',
            conditions: [{ question: 'occupation', response: 'employed' }],
          },
          {
            key: 'income',
            type: QuestionType.SINGLE_CHOICE,
            title: 'Income',
            description: 'Annual income',
          },
        ],
      };
      const mockHttp = createMockHttpClient(response);
      const api = new KycApi(mockHttp);

      const result = await api.getFinancialData(kycCode, financialUrl, 'en');

      expect(result).toEqual(response);
      expect(result.questions[0].conditions).toEqual([{ question: 'occupation', response: 'employed' }]);
      expect(mockHttp.requestAbsolute).toHaveBeenCalledTimes(1);
      expect(mockHttp.requestAbsolute).toHaveBeenCalledWith({
        url: `${financialUrl}?lang=en`,
        method: 'GET',
        token: false,
        headers: { 'x-kyc-code': kycCode },
      });
    });
  });
});
