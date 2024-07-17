import { useMemo } from 'react';
import { useAuthContext } from '../contexts/auth.context';
import { ApiError } from '../definitions/error';

export interface ApiInterface {
  defaultUrl: string;
  call: <T>(config: CallConfig) => Promise<T>;
}

export interface CallConfig {
  url: string;
  method: 'GET' | 'PUT' | 'POST' | 'DELETE';
  version?: string;
  data?: any;
  noJson?: boolean;
  specialHandling?: SpecialHandling;
  token?: string;
}

interface SpecialHandling {
  action: () => void;
  statusCode: number;
}

export function useApi(): ApiInterface {
  const { authenticationToken, setAuthenticationToken } = useAuthContext();

  const url = process.env.REACT_APP_API_URL ?? 'https://api.dfx.swiss';
  const defaultVersion = 'v1';

  async function call<T>(config: CallConfig): Promise<T> {
    return fetchFrom<T>(config).catch((error: ApiError) => {
      if (error.statusCode === 401) {
        if (!config.token) setAuthenticationToken(undefined);
      }

      throw error;
    });
  }

  async function fetchFrom<T>(config: CallConfig): Promise<T> {
    const version = config.version ?? defaultVersion;
    const baseUrl = `${url}/${version}`;

    return fetch(
      `${baseUrl}/${config.url}`,
      buildInit(config.method, config.token ?? authenticationToken, config.data, config.noJson),
    ).then((response) => {
      if (response.status === config.specialHandling?.statusCode) {
        config.specialHandling?.action?.();
      }
      if (response.ok) {
        return response.json().catch(() => undefined);
      }
      return response.json().then((body) => {
        throw body;
      });
    });
  }

  function buildInit(
    method: 'GET' | 'PUT' | 'POST' | 'DELETE',
    accessToken?: string,
    data?: any,
    noJson?: boolean,
  ): RequestInit {
    return {
      method: method,
      headers: {
        ...(noJson ? undefined : { 'Content-Type': 'application/json' }),
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
      body: noJson ? data : JSON.stringify(data),
    };
  }

  return useMemo(() => ({ defaultUrl: `${url}/${defaultVersion}`, call }), [authenticationToken]);
}
