import { DfxHttpClient } from '../client/DfxHttpClient';
import { KycApi } from '../client/KycApi';
import { KycContactData, KycStepName, KycStepStatus } from '../definitions/kyc';

function createMockHttpClient(response?: unknown): DfxHttpClient & { requestAbsolute: jest.Mock } {
  return {
    request: jest.fn(),
    requestAbsolute: jest.fn().mockResolvedValue(response),
    getBaseUrl: jest.fn().mockReturnValue('https://api.dfx.swiss'),
    getApiUrl: jest.fn().mockReturnValue('https://api.dfx.swiss/v1'),
    setToken: jest.fn(),
    getToken: jest.fn(),
  } as unknown as DfxHttpClient & { requestAbsolute: jest.Mock };
}

describe('KycApi', () => {
  describe('setContactData', () => {
    const url = 'https://api.dfx.swiss/v2/kyc/data/contact/1';

    it.each<[string, KycContactData, KycStepStatus]>([
      ['the mail alone (code is sent)', { mail: 'a@b.ch' }, KycStepStatus.IN_PROGRESS],
      ['the mail with the confirmation token', { mail: 'a@b.ch', token: '123456' }, KycStepStatus.COMPLETED],
    ])('sends %s unchanged with the KYC code', async (_, data, status) => {
      const step = { name: KycStepName.CONTACT_DATA, status, sequenceNumber: 0 };
      const mockHttp = createMockHttpClient(step);
      const api = new KycApi(mockHttp);

      await expect(api.setContactData('kyc-code', url, data)).resolves.toEqual(step);
      expect(mockHttp.requestAbsolute).toHaveBeenCalledWith({
        url,
        method: 'PUT',
        data,
        token: false,
        headers: { 'x-kyc-code': 'kyc-code' },
      });
    });
  });
});
