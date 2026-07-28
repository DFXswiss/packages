import { KycApi } from '../client/KycApi';
import { DfxHttpClient } from '../client/DfxHttpClient';
import {
  AccountType,
  KycFinancialCondition,
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

/** Compile-time guard: fails tsc/ts-jest if the value is not a full KycStepSubmit. */
function requireKycStepSubmit(value: KycStepSubmit): KycStepSubmit {
  return value;
}

/** Compile-time guard: fails if KycFinancialCondition loses question/response as string. */
function requireKycFinancialCondition(value: KycFinancialCondition): KycFinancialCondition {
  return value;
}

/** Compile-time guard: fails if conditions is not KycFinancialCondition[]. */
function requireKycFinancialConditions(value: KycFinancialCondition[]): KycFinancialCondition[] {
  return value;
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
    it('passes complete and missingFields through from the HTTP response unchanged', async () => {
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

      // Runtime: fields must survive the client unchanged (no mapper that drops them).
      expect(result.complete).toBe(false);
      expect(result.missingFields).toEqual(['address.city', 'phone']);
      expect(result).toEqual(response);

      // Type-level: return value must be a KycStepSubmit (breaks if return type is KycStepBase).
      const typed = requireKycStepSubmit(result);
      expect(typed.complete).toBe(false);
      expect(typed.missingFields).toEqual(['address.city', 'phone']);

      expect(mockHttp.requestAbsolute).toHaveBeenCalledTimes(1);
      expect(mockHttp.requestAbsolute).toHaveBeenCalledWith({
        url: submitUrl,
        method: 'PUT',
        data: personalData,
        token: false,
        headers: { 'x-kyc-code': kycCode },
      });
    });

    it('passes complete=true with empty missingFields through unchanged', async () => {
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
      requireKycStepSubmit(result);

      expect(result.complete).toBe(true);
      expect(result.missingFields).toEqual([]);
    });
  });

  describe('setFinancialData', () => {
    const financialUrl = 'https://api.dfx.swiss/v2/kyc/data/financial/7';

    it('passes complete and missingFields through from the HTTP response unchanged', async () => {
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

      expect(result.complete).toBe(false);
      expect(result.missingFields).toEqual(['income', 'assets']);
      expect(result).toEqual(response);

      const typed = requireKycStepSubmit(result);
      expect(typed.complete).toBe(false);
      expect(typed.missingFields).toEqual(['income', 'assets']);

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

    it('passes question conditions through from the HTTP response unchanged', async () => {
      const conditions: KycFinancialCondition[] = [{ question: 'occupation', response: 'employed' }];
      const response: KycFinancialQuestions = {
        responses: [],
        questions: [
          {
            key: 'occupation_description',
            type: QuestionType.TEXT,
            title: 'Describe your occupation',
            description: 'Only if employed',
            conditions,
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

      // Runtime: conditions must survive the client unchanged (no mapper that drops them).
      expect(result.questions[0].conditions).toEqual([{ question: 'occupation', response: 'employed' }]);
      expect(result.questions[0].conditions?.[0].question).toBe('occupation');
      expect(result.questions[0].conditions?.[0].response).toBe('employed');
      expect(result).toEqual(response);

      // Type-level: conditions is KycFinancialCondition[] with string question/response.
      const rawConditions = result.questions[0].conditions;
      if (!rawConditions) {
        throw new Error('expected conditions on first question');
      }
      const typedConditions = requireKycFinancialConditions(rawConditions);
      const typedCondition = requireKycFinancialCondition(typedConditions[0]);
      const question: string = typedCondition.question;
      const responseValue: string = typedCondition.response;
      expect(question).toBe('occupation');
      expect(responseValue).toBe('employed');

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
