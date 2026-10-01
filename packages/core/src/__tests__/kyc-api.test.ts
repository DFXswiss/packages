import { KycApi } from '../client/KycApi';
import { DfxHttpClient } from '../client/DfxHttpClient';
import { Country } from '../definitions/country';
import {
  AccountType,
  buildKycUrl,
  DocumentType,
  FundOrigin,
  GoodsCategory,
  GoodsType,
  InvestmentDate,
  isStepDone,
  KycAddress,
  KycChangeAddressData,
  KycChangeNameData,
  KycManualIdentData,
  KycNationalityData,
  KycPersonalData,
  KycStepName,
  KycStepStatus,
  KycStepType,
  LegalEntity,
  Limit,
  MerchantCategory,
  SignatoryPower,
  StoreType,
  TfaLevel,
  toKycNationalityRequest,
} from '../definitions/kyc';

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

  it('forwards standard authenticated user and file requests to the expected API versions', async () => {
    const request = jest.fn().mockResolvedValue({ fixture: true });
    const requestAbsolute = jest.fn();
    const http = {
      request,
      requestAbsolute,
      getApiUrl: () => 'https://api.dfx.swiss/v1',
      getBaseUrl: () => 'https://api.dfx.swiss',
    } as unknown as DfxHttpClient;
    const api = new KycApi(http);
    const name = { firstName: 'Ada', lastName: 'Lovelace' };
    const address: KycAddress = {
      street: 'Example Street',
      city: 'Bern',
      zip: '3000',
      country: {
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
      },
    };
    const user = {
      mail: 'ada@example.test',
      accountType: AccountType.PERSONAL,
      firstName: 'Ada',
      lastName: 'Lovelace',
      phone: '+41791234567',
      address,
    };

    await api.setName(name);
    expect(request).toHaveBeenLastCalledWith({ url: 'user/name', method: 'PUT', data: name });
    await api.setData(user);
    expect(request).toHaveBeenLastCalledWith({ url: 'user/data', method: 'POST', data: user });
    await api.getFile('file-123');
    expect(request).toHaveBeenLastCalledWith({ url: 'kyc/file/file-123', method: 'GET', version: 'v2' });
    await api.check2fa();
    expect(request).toHaveBeenLastCalledWith({ url: 'kyc/2fa', method: 'GET', version: 'v2' });
    await api.check2fa(TfaLevel.STRICT);
    expect(request).toHaveBeenLastCalledWith({ url: 'kyc/2fa?level=Strict', method: 'GET', version: 'v2' });
    expect(requestAbsolute).not.toHaveBeenCalled();
  });

  it('routes KYC code requests with their method, URL, body, and code header', async () => {
    const request = jest.fn();
    const requestAbsolute = jest.fn().mockResolvedValue({ fixture: true });
    const http = {
      request,
      requestAbsolute,
      getApiUrl: () => 'https://api.dfx.swiss/v1',
      getBaseUrl: () => 'https://api.dfx.swiss',
    } as unknown as DfxHttpClient;
    const api = new KycApi(http);
    const code = 'kyc-session-code';
    const base = 'https://api.dfx.swiss/v2/kyc/step';
    const country: Country = {
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
    const address: KycAddress = { street: 'Example Street', city: 'Bern', zip: '3000', country };
    const personalData: KycPersonalData = {
      accountType: AccountType.PERSONAL,
      firstName: 'Ada',
      lastName: 'Lovelace',
      phone: '+41791234567',
      address,
    };
    const manualIdentData: KycManualIdentData = {
      firstName: 'Ada',
      lastName: 'Lovelace',
      birthday: new Date('1815-12-10T00:00:00.000Z'),
      nationality: country,
      documentType: DocumentType.PASSPORT,
      documentNumber: 'A1',
      document: { file: 'fixture-document' },
    };
    const legalEntityData = { file: 'fixture-register', legalEntity: LegalEntity.AG };
    const paymentData = {
      name: 'Example Shop',
      registrationNumber: 'CHE-123.456.789',
      storeType: StoreType.ONLINE,
      merchantCategory: MerchantCategory.OTHER,
      goodsType: GoodsType.TANGIBLE,
      goodsCategory: GoodsCategory.OTHERS,
      purpose: 'fixture business purpose',
      contractAccepted: true,
    };
    const addressChangeData: KycChangeAddressData = {
      file: 'fixture-address-proof',
      fileName: 'address-proof.pdf',
      address,
    };
    const nameChangeData: KycChangeNameData = {
      file: 'fixture-name-proof',
      fileName: 'name-proof.pdf',
      firstName: 'Ada',
      lastName: 'Byron Lovelace',
    };
    const limitRequest = {
      limit: Limit.K_500,
      investmentDate: InvestmentDate.NOW,
      fundOrigin: FundOrigin.SAVINGS,
    };
    const rows: Array<[() => Promise<unknown>, string, 'GET' | 'PUT' | 'POST' | 'DELETE', unknown?]> = [
      [() => api.getInfo(code), 'https://api.dfx.swiss/v2/kyc', 'GET'],
      [() => api.continue(code), 'https://api.dfx.swiss/v2/kyc', 'PUT'],
      [() => api.continue(code, true), 'https://api.dfx.swiss/v2/kyc?autoStep=true', 'PUT'],
      [() => api.startStep(code, KycStepName.CONTACT_DATA), 'https://api.dfx.swiss/v2/kyc/ContactData', 'GET'],
      [
        () => api.startStep(code, KycStepName.IDENT, KycStepType.MANUAL, 2),
        'https://api.dfx.swiss/v2/kyc/Ident?type=Manual&sequence=2',
        'GET',
      ],
      [
        () => api.setContactData(code, `${base}/contact`, { mail: 'ada@example.test' }),
        `${base}/contact`,
        'PUT',
        { mail: 'ada@example.test' },
      ],
      [() => api.setPersonalData(code, `${base}/personal`, personalData), `${base}/personal`, 'PUT', personalData],
      [() => api.setManualIdentData(code, `${base}/ident`, manualIdentData), `${base}/ident`, 'PUT', manualIdentData],
      [() => api.setLegalEntityData(code, `${base}/entity`, legalEntityData), `${base}/entity`, 'PUT', legalEntityData],
      [
        () => api.setSoleProprietorshipData(code, `${base}/sole`, { file: 'doc' }),
        `${base}/sole`,
        'PUT',
        { file: 'doc' },
      ],
      [
        () => api.setRecommendationData(code, `${base}/recommendation`, { key: 'rec' }),
        `${base}/recommendation`,
        'PUT',
        { key: 'rec' },
      ],
      [() => api.setFileData(code, `${base}/file`, { file: 'doc' }), `${base}/file`, 'PUT', { file: 'doc' }],
      [
        () => api.setSignatoryPowerData(code, `${base}/power`, { signatoryPower: SignatoryPower.SINGLE }),
        `${base}/power`,
        'PUT',
        { signatoryPower: SignatoryPower.SINGLE },
      ],
      [
        () =>
          api.setBeneficialData(code, `${base}/beneficial`, {
            hasBeneficialOwners: false,
            isAccountHolderInvolved: true,
          }),
        `${base}/beneficial`,
        'PUT',
        { hasBeneficialOwners: false, isAccountHolderInvolved: true },
      ],
      [
        () => api.setOperationalData(code, `${base}/operational`, { isOperational: true }),
        `${base}/operational`,
        'PUT',
        { isOperational: true },
      ],
      [() => api.getFinancialData(code, `${base}/financial`), `${base}/financial`, 'GET'],
      [() => api.getFinancialData(code, `${base}/financial`, 'de-CH'), `${base}/financial?lang=de-CH`, 'GET'],
      [
        () => api.setFinancialData(code, `${base}/financial`, { responses: [{ key: 'income', value: 'salary' }] }),
        `${base}/financial`,
        'PUT',
        { responses: [{ key: 'income', value: 'salary' }] },
      ],
      [() => api.setPaymentData(code, `${base}/payment`, paymentData), `${base}/payment`, 'PUT', paymentData],
      [
        () => api.setRecallData(code, `${base}/recall`, { accepted: true }),
        `${base}/recall`,
        'PUT',
        { accepted: true },
      ],
      [
        () => api.setAddressChangeData(code, `${base}/address`, addressChangeData),
        `${base}/address`,
        'PUT',
        addressChangeData,
      ],
      [() => api.setNameChangeData(code, `${base}/name`, nameChangeData), `${base}/name`, 'PUT', nameChangeData],
      [
        () => api.setPhoneChangeData(code, `${base}/phone`, { phone: '+41791234567' }),
        `${base}/phone`,
        'PUT',
        { phone: '+41791234567' },
      ],
      [() => api.setup2fa(code), 'https://api.dfx.swiss/v2/kyc/2fa', 'POST'],
      [() => api.setup2fa(code, TfaLevel.BASIC), 'https://api.dfx.swiss/v2/kyc/2fa?level=Basic', 'POST'],
      [() => api.verify2fa(code, '123456'), 'https://api.dfx.swiss/v2/kyc/2fa/verify', 'POST', { token: '123456' }],
      [() => api.increaseLimit(code, limitRequest), 'https://api.dfx.swiss/v2/kyc/limit', 'POST', limitRequest],
      [
        () => api.addTransferClient(code, 'some client/id'),
        'https://api.dfx.swiss/v2/kyc/transfer?client=some%20client%2Fid',
        'POST',
      ],
      [
        () => api.removeTransferClient(code, 'some client/id'),
        'https://api.dfx.swiss/v2/kyc/transfer?client=some%20client%2Fid',
        'DELETE',
      ],
      [() => api.cancelStep(code, `${base}/cancel`), `${base}/cancel`, 'DELETE'],
    ];

    for (const [invoke, url, method, data] of rows) {
      requestAbsolute.mockClear();
      await invoke();
      expect(requestAbsolute).toHaveBeenCalledWith({
        url,
        method,
        ...(data === undefined ? {} : { data }),
        token: false,
        headers: { 'x-kyc-code': code },
      });
    }
    expect(request).not.toHaveBeenCalled();
  });

  it('builds KYC URL roots from the configured versioned API URL', () => {
    const http = {
      request: jest.fn(),
      requestAbsolute: jest.fn(),
      getApiUrl: () => 'https://api.dfx.swiss/v1/',
      getBaseUrl: () => 'https://api.dfx.swiss',
    } as unknown as DfxHttpClient;

    expect(new KycApi(http).buildKycUrl()).toEqual({
      setName: 'user/name',
      setData: 'user/data',
      file: 'kyc/file',
      base: 'https://api.dfx.swiss/v2/kyc',
      tfa: 'https://api.dfx.swiss/v2/kyc/2fa',
      checkTfa: 'kyc/2fa',
      limit: 'https://api.dfx.swiss/v2/kyc/limit',
      transfer: expect.any(Function),
    });
    expect(new KycApi(http).buildKycUrl().transfer('a b/c')).toBe(
      'https://api.dfx.swiss/v2/kyc/transfer?client=a%20b%2Fc',
    );
  });

  it('builds a v2 KYC URL for versioned and unversioned API roots', () => {
    expect(buildKycUrl('https://api.dfx.swiss/v1')).toMatchObject({
      base: 'https://api.dfx.swiss/v2/kyc',
      tfa: 'https://api.dfx.swiss/v2/kyc/2fa',
    });
    expect(buildKycUrl('https://api.dfx.swiss')).toMatchObject({
      base: 'https://api.dfx.swiss/kyc',
      limit: 'https://api.dfx.swiss/kyc/limit',
    });
  });

  it('marks review, hold, and complete statuses as done while keeping unfinished states open', () => {
    const step = (status: KycStepStatus) => ({
      name: KycStepName.CONTACT_DATA,
      status,
      sequenceNumber: 1,
    });

    expect(isStepDone(step(KycStepStatus.IN_REVIEW))).toBe(true);
    expect(isStepDone(step(KycStepStatus.ON_HOLD))).toBe(true);
    expect(isStepDone(step(KycStepStatus.COMPLETED))).toBe(true);
    expect(isStepDone(step(KycStepStatus.NOT_STARTED))).toBe(false);
    expect(isStepDone(step(KycStepStatus.IN_PROGRESS))).toBe(false);
    expect(isStepDone(step(KycStepStatus.FAILED))).toBe(false);
  });

  it('rejects KYC nationality input without either supported country property', () => {
    expect(() => toKycNationalityRequest({} as KycNationalityData)).toThrow('KYC nationality is required');
  });
});
