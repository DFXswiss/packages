import { useMemo } from 'react';
import {
  KycContactData,
  KycData,
  KycFinancialQuestions,
  KycFinancialResponses,
  KycInfo,
  KycPersonalData,
  KycResult,
  KycSession,
  KycStepName,
  KycStepType,
  KycUrl,
} from '../definitions/kyc';
import { useApi } from './api.hook';
import { Country } from '../definitions/country';

export interface CallConfig {
  url: string;
  code: string;
  method: 'GET' | 'PUT' | 'POST' | 'DELETE';
  data?: any;
  noJson?: boolean;
}

export interface KycInterface {
  // legacy
  setKycData: (data: KycData) => Promise<void>;

  // process
  getKycInfo: (code: string) => Promise<KycInfo>;
  continueKyc: (code: string, autoStep?: boolean) => Promise<KycSession>;
  startStep: (code: string, name: KycStepName, type?: KycStepType) => Promise<KycSession>;
  getCountries: (code: string) => Promise<Country[]>;

  // updates
  setContactData: (code: string, url: string, data: KycContactData) => Promise<KycResult>;
  setPersonalData: (code: string, url: string, data: KycPersonalData) => Promise<KycResult>;
  getFinancialData: (code: string, url: string, lang?: string) => Promise<KycFinancialQuestions>;
  setFinancialData: (code: string, url: string, data: KycFinancialResponses) => Promise<KycResult>;
}

export function useKyc(): KycInterface {
  const { call: callApi } = useApi();

  async function setKycData(data: KycData): Promise<void> {
    return callApi({
      url: KycUrl.setData,
      method: 'POST',
      data,
    });
  }
  async function getKycInfo(code: string): Promise<KycInfo> {
    return call({ url: KycUrl.base, code, method: 'GET' });
  }

  async function continueKyc(code: string, autoStep = true): Promise<KycSession> {
    const url = `${KycUrl.base}?autoStep=${autoStep.toString()}`;
    return call({ url, code, method: 'PUT' });
  }

  async function startStep(code: string, name: KycStepName, type?: KycStepType): Promise<KycSession> {
    let url = `${KycUrl.base}/${name}`;
    type && (url += `?type=${type}`);

    return call({ url, code, method: 'GET' });
  }

  async function getCountries(code: string): Promise<Country[]> {
    return call({ url: `${KycUrl.base}/countries`, code, method: 'GET' });
  }

  async function setContactData(code: string, url: string, data: KycContactData): Promise<KycResult> {
    return call({ url, code, method: 'PUT', data });
  }

  async function setPersonalData(code: string, url: string, data: KycPersonalData): Promise<KycResult> {
    return call({ url, code, method: 'PUT', data });
  }

  async function getFinancialData(code: string, url: string, lang?: string): Promise<KycFinancialQuestions> {
    lang && (url += `?lang=${lang}`);
    return call({ url, code, method: 'GET' });
  }

  async function setFinancialData(code: string, url: string, data: KycFinancialResponses): Promise<KycResult> {
    return call({ url, code, method: 'PUT', data });
  }

  // --- HELPER METHODS --- //
  async function call<T>(config: CallConfig): Promise<T> {
    return fetch(config.url, buildInit(config)).then((response) => {
      if (response.ok) {
        return response.json().catch(() => undefined);
      }
      return response.json().then((body) => {
        throw body;
      });
    });
  }

  function buildInit({ code, method, data, noJson }: CallConfig): RequestInit {
    return {
      method: method,
      headers: {
        ...(noJson ? undefined : { 'Content-Type': 'application/json' }),
        'x-kyc-code': code,
      },
      body: noJson ? data : JSON.stringify(data),
    };
  }

  return useMemo(
    () => ({
      setKycData,
      getKycInfo,
      continueKyc,
      startStep,
      getCountries,
      setContactData,
      setPersonalData,
      getFinancialData,
      setFinancialData,
    }),
    [callApi],
  );
}
