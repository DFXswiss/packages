import { useCallback, useMemo } from 'react';
import {
  KycFileData,
  KycContactData,
  KycFinancialQuestions,
  KycFinancialResponses,
  KycInfo,
  KycLegalEntityData,
  KycNationalityData,
  KycPersonalData,
  KycSession,
  KycStepName,
  KycStepType,
  KycUrl,
  LimitRequest,
  TfaSetup,
  UserData,
  UserName,
  KycSignatoryPowerData,
  KycManualIdentData,
  TfaLevel,
  KycFile,
  KycStepBase,
  KycBeneficialData,
  KycOperationalData,
  PaymentData,
  RecallData,
  KycRecommendationData,
  KycChangeAddressData,
  KycChangeNameData,
  KycChangePhoneData,
} from '../definitions/kyc';
import { useApi } from './api.hook';

export interface CallConfig {
  url: string;
  code: string;
  method: 'GET' | 'PUT' | 'POST' | 'DELETE';
  data?: any;
  noJson?: boolean;
}

export interface KycInterface {
  // KYC data
  setName: (name: UserName) => Promise<void>;
  setData: (data: UserData) => Promise<void>;

  // process
  getKycInfo: (code: string) => Promise<KycInfo>;
  continueKyc: (code: string, autoStep?: boolean) => Promise<KycSession>;
  startStep: (code: string, name: KycStepName, type?: KycStepType, sequence?: number) => Promise<KycSession>;

  // updates
  setContactData: (code: string, url: string, data: KycContactData) => Promise<KycStepBase>;
  setPersonalData: (code: string, url: string, data: KycPersonalData) => Promise<KycStepBase>;
  setManualIdentData: (code: string, url: string, data: KycManualIdentData) => Promise<KycStepBase>;
  setLegalEntityData: (code: string, url: string, data: KycLegalEntityData) => Promise<KycStepBase>;
  setSoleProprietorshipData: (code: string, url: string, data: KycFileData) => Promise<KycStepBase>;
  setNationalityData: (code: string, url: string, data: KycNationalityData) => Promise<KycStepBase>;
  setRecommendationData: (code: string, url: string, data: KycRecommendationData) => Promise<KycStepBase>;
  setFileData: (code: string, url: string, data: KycFileData) => Promise<KycStepBase>;
  setSignatoryPowerData: (code: string, url: string, data: KycSignatoryPowerData) => Promise<KycStepBase>;
  setBeneficialData: (code: string, url: string, data: KycBeneficialData) => Promise<KycStepBase>;
  setOperationalData: (code: string, url: string, data: KycOperationalData) => Promise<KycStepBase>;
  getFinancialData: (code: string, url: string, lang?: string) => Promise<KycFinancialQuestions>;
  setFinancialData: (code: string, url: string, data: KycFinancialResponses) => Promise<KycStepBase>;
  setPaymentData: (code: string, url: string, data: PaymentData) => Promise<KycStepBase>;
  setRecallData: (code: string, url: string, data: RecallData) => Promise<KycStepBase>;
  setAddressChangeData: (code: string, url: string, data: KycChangeAddressData) => Promise<KycStepBase>;
  setNameChangeData: (code: string, url: string, data: KycChangeNameData) => Promise<KycStepBase>;
  setPhoneChangeData: (code: string, url: string, data: KycChangePhoneData) => Promise<KycStepBase>;
  getFile: (kycFileId: string) => Promise<KycFile>;

  // 2fa
  check2fa: (level?: TfaLevel) => Promise<TfaSetup>;
  setup2fa: (code: string, level?: TfaLevel) => Promise<TfaSetup>;
  verify2fa: (code: string, token: string) => Promise<void>;

  // limit
  increaseLimit: (code: string, request: LimitRequest) => Promise<void>;

  // transfer
  addTransferClient: (code: string, client: string) => Promise<void>;
  removeTransferClient: (code: string, client: string) => Promise<void>;

  // cancel step
  cancelStep: (code: string, url: string) => Promise<void>;
}

export function useKyc(): KycInterface {
  const { call: callApi } = useApi();

  // --- HELPER METHODS --- //
  const buildInit = useCallback(({ code, method, data, noJson }: CallConfig): RequestInit => {
    return {
      method: method,
      headers: {
        ...(noJson ? undefined : { 'Content-Type': 'application/json' }),
        'x-kyc-code': code,
      },
      body: noJson ? data : JSON.stringify(data),
    };
  }, []);

  const call = useCallback(
    async <T,>(config: CallConfig): Promise<T> => {
      return fetch(config.url, buildInit(config)).then((response) => {
        if (response.ok) {
          return response.json().catch(() => undefined);
        }
        return response.json().then((body) => {
          throw body;
        });
      });
    },
    [buildInit],
  );

  const setName = useCallback(
    async (data: UserName): Promise<void> => {
      return callApi({
        url: KycUrl.setName,
        method: 'PUT',
        data,
      });
    },
    [callApi],
  );

  const setData = useCallback(
    async (data: UserData): Promise<void> => {
      return callApi({
        url: KycUrl.setData,
        method: 'POST',
        data,
      });
    },
    [callApi],
  );

  const getKycInfo = useCallback(
    async (code: string): Promise<KycInfo> => {
      return call({ url: KycUrl.base, code, method: 'GET' });
    },
    [call],
  );

  const continueKyc = useCallback(
    async (code: string, autoStep = true): Promise<KycSession> => {
      const url = `${KycUrl.base}?autoStep=${autoStep.toString()}`;
      return call({ url, code, method: 'PUT' });
    },
    [call],
  );

  const startStep = useCallback(
    async (code: string, name: KycStepName, type?: KycStepType, sequence?: number): Promise<KycSession> => {
      const params = new URLSearchParams();
      type && params.set('type', type);
      sequence != null && params.set('sequence', `${sequence}`);

      const url = `${KycUrl.base}/${name}?${params.toString()}`;

      return call({ url, code, method: 'GET' });
    },
    [call],
  );

  const setContactData = useCallback(
    async (code: string, url: string, data: KycContactData): Promise<KycStepBase> => {
      return call({ url, code, method: 'PUT', data });
    },
    [call],
  );

  const setPersonalData = useCallback(
    async (code: string, url: string, data: KycPersonalData): Promise<KycStepBase> => {
      return call({ url, code, method: 'PUT', data });
    },
    [call],
  );

  const setManualIdentData = useCallback(
    async (code: string, url: string, data: KycManualIdentData): Promise<KycStepBase> => {
      return call({ url, code, method: 'PUT', data });
    },
    [call],
  );

  const setLegalEntityData = useCallback(
    (code: string, url: string, data: KycLegalEntityData): Promise<KycStepBase> => {
      return call({ url, code, method: 'PUT', data });
    },
    [call],
  );

  const setSoleProprietorshipData = useCallback(
    (code: string, url: string, data: KycFileData): Promise<KycStepBase> => {
      return call({ url, code, method: 'PUT', data });
    },
    [call],
  );

  const setNationalityData = useCallback(
    async (code: string, url: string, data: KycNationalityData): Promise<KycStepBase> => {
      return call({ url, code, method: 'PUT', data });
    },
    [call],
  );

  const setRecommendationData = useCallback(
    async (code: string, url: string, data: KycRecommendationData): Promise<KycStepBase> => {
      return call({ url, code, method: 'PUT', data });
    },
    [call],
  );

  const setFileData = useCallback(
    async (code: string, url: string, data: KycFileData): Promise<KycStepBase> => {
      return call({ url, code, method: 'PUT', data });
    },
    [call],
  );

  const setSignatoryPowerData = useCallback(
    (code: string, url: string, data: KycSignatoryPowerData): Promise<KycStepBase> => {
      return call({ url, code, method: 'PUT', data });
    },
    [call],
  );

  const setBeneficialData = useCallback(
    (code: string, url: string, data: KycBeneficialData): Promise<KycStepBase> => {
      return call({ url, code, method: 'PUT', data });
    },
    [call],
  );

  const setOperationalData = useCallback(
    (code: string, url: string, data: KycOperationalData): Promise<KycStepBase> => {
      return call({ url, code, method: 'PUT', data });
    },
    [call],
  );

  const getFinancialData = useCallback(
    async (code: string, url: string, lang?: string): Promise<KycFinancialQuestions> => {
      lang && (url += `?lang=${lang}`);
      return call({ url, code, method: 'GET' });
    },
    [call],
  );

  const setPaymentData = useCallback(
    async (code: string, url: string, data: PaymentData): Promise<KycStepBase> => {
      return call({ url, code, method: 'PUT', data });
    },
    [call],
  );

  const setRecallData = useCallback(
    async (code: string, url: string, data: RecallData): Promise<KycStepBase> => {
      return call({ url, code, method: 'PUT', data });
    },
    [call],
  );

  const setAddressChangeData = useCallback(
    async (code: string, url: string, data: KycChangeAddressData): Promise<KycStepBase> => {
      return call({ url, code, method: 'PUT', data });
    },
    [call],
  );

  const setNameChangeData = useCallback(
    async (code: string, url: string, data: KycChangeNameData): Promise<KycStepBase> => {
      return call({ url, code, method: 'PUT', data });
    },
    [call],
  );

  const setPhoneChangeData = useCallback(
    async (code: string, url: string, data: KycChangePhoneData): Promise<KycStepBase> => {
      return call({ url, code, method: 'PUT', data });
    },
    [call],
  );

  const getFile = useCallback(
    async (kycFileId: string): Promise<KycFile> => {
      return callApi({
        url: `${KycUrl.file}/${kycFileId}`,
        method: 'GET',
        version: 'v2',
      });
    },
    [callApi],
  );

  const setFinancialData = useCallback(
    async (code: string, url: string, data: KycFinancialResponses): Promise<KycStepBase> => {
      return call({ url, code, method: 'PUT', data });
    },
    [call],
  );

  const check2fa = useCallback(
    async (level?: TfaLevel): Promise<TfaSetup> => {
      const url = level ? `${KycUrl.checkTfa}?level=${level}` : KycUrl.checkTfa;
      return callApi({ url, version: 'v2', method: 'GET' });
    },
    [callApi],
  );

  const setup2fa = useCallback(
    async (code: string, level?: TfaLevel): Promise<TfaSetup> => {
      const url = level ? `${KycUrl.tfa}?level=${level}` : KycUrl.tfa;
      return call({ url, code, method: 'POST' });
    },
    [call],
  );

  const verify2fa = useCallback(
    async (code: string, token: string): Promise<void> => {
      return call({ url: `${KycUrl.tfa}/verify`, code, method: 'POST', data: { token } });
    },
    [call],
  );

  const increaseLimit = useCallback(
    async (code: string, request: LimitRequest): Promise<void> => {
      return call({ url: KycUrl.limit, code, method: 'POST', data: request });
    },
    [call],
  );

  const addTransferClient = useCallback(
    async (code: string, client: string): Promise<void> => {
      return call({ url: KycUrl.transfer(client), code, method: 'POST' });
    },
    [call],
  );

  const removeTransferClient = useCallback(
    async (code: string, client: string): Promise<void> => {
      return call({ url: KycUrl.transfer(client), code, method: 'DELETE' });
    },
    [call],
  );

  const cancelStep = useCallback(
    async (code: string, url: string): Promise<void> => {
      return call({ url, code, method: 'DELETE' });
    },
    [call],
  );

  return useMemo(
    () => ({
      setName,
      setData,
      getKycInfo,
      continueKyc,
      startStep,
      setContactData,
      setPersonalData,
      setManualIdentData,
      setLegalEntityData,
      setSoleProprietorshipData,
      setNationalityData,
      setRecommendationData,
      setFileData,
      setSignatoryPowerData,
      setBeneficialData,
      setOperationalData,
      getFinancialData,
      getFile,
      setFinancialData,
      setPaymentData,
      setRecallData,
      setAddressChangeData,
      setNameChangeData,
      setPhoneChangeData,
      check2fa,
      setup2fa,
      verify2fa,
      increaseLimit,
      addTransferClient,
      removeTransferClient,
      cancelStep,
    }),
    [
      setName,
      setData,
      getKycInfo,
      continueKyc,
      startStep,
      setContactData,
      setPersonalData,
      setManualIdentData,
      setLegalEntityData,
      setSoleProprietorshipData,
      setNationalityData,
      setRecommendationData,
      setFileData,
      setSignatoryPowerData,
      setBeneficialData,
      setOperationalData,
      getFinancialData,
      getFile,
      setFinancialData,
      setPaymentData,
      setRecallData,
      setAddressChangeData,
      setNameChangeData,
      setPhoneChangeData,
      check2fa,
      setup2fa,
      verify2fa,
      increaseLimit,
      addTransferClient,
      removeTransferClient,
      cancelStep,
    ],
  );
}
