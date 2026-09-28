import { KycApi } from '../client/KycApi';
import { DfxHttpClient } from '../client/DfxHttpClient';
import { Country } from '../definitions/country';
import { KycNationalityData } from '../definitions/kyc';

describe('KycApi', () => {
  it('sends nationality data using the backend wire field', async () => {
    const nationality: Country = {
      id: 756,
      symbol: 'CH',
      name: 'Switzerland',
      locationAllowed: true,
      kycAllowed: true,
      nationalityAllowed: true,
      bankAllowed: true,
      cardAllowed: true,
      cryptoAllowed: true,
      kycOrganizationAllowed: true,
    };
    const data: KycNationalityData = { nationality };
    const legacyData: KycNationalityData = { country: nationality };

    const requestAbsolute = jest.fn().mockResolvedValue({ name: 'NationalityData' });
    const http = { requestAbsolute } as unknown as DfxHttpClient;
    const api = new KycApi(http);

    await api.setNationalityData('kyc-code', 'https://api.dfx.swiss/v2/kyc/nationality', data);

    expect(requestAbsolute).toHaveBeenCalledWith({
      url: 'https://api.dfx.swiss/v2/kyc/nationality',
      method: 'PUT',
      data: { nationality },
      token: false,
      headers: { 'x-kyc-code': 'kyc-code' },
    });

    requestAbsolute.mockClear();
    await api.setNationalityData('kyc-code', 'https://api.dfx.swiss/v2/kyc/nationality', legacyData);
    expect(requestAbsolute).toHaveBeenCalledWith({
      url: 'https://api.dfx.swiss/v2/kyc/nationality',
      method: 'PUT',
      data: { nationality },
      token: false,
      headers: { 'x-kyc-code': 'kyc-code' },
    });
  });
});
