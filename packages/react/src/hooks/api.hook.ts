import { useMemo } from 'react';
import { useAuthContext } from '../contexts/auth.context';
import { ApiError } from '../definitions/error';

export interface ApiInterface {
  baseUrl: string;
  call: <T>(config: CallConfig) => Promise<T>;
}

export interface CallConfig {
  url: string;
  method: 'GET' | 'PUT' | 'POST' | 'DELETE';
  data?: any;
  noJson?: boolean;
  specialHandling?: SpecialHandling;
}

interface SpecialHandling {
  action: () => void;
  statusCode: number;
}

export function useApi(): ApiInterface {
  const { authenticationToken, setAuthenticationToken } = useAuthContext();

  const url = process.env.REACT_APP_API_URL ?? 'https://api.dfx.swiss';
  const version = process.env.REACT_APP_API_VERSION ?? 'v1';
  const baseUrl = `${url}/${version}`;

  async function call<T>(config: CallConfig): Promise<T> {
    return fetchFrom<T>(config).catch((error: ApiError) => {
      if (error.statusCode === 401) {
        setAuthenticationToken(undefined);
      }

      throw error;
    });
  }

  async function fetchFrom<T>(config: CallConfig): Promise<T> {
    return fetch(
      `${baseUrl}/${config.url}`,
      buildInit(config.method, authenticationToken, config.data, config.noJson),
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

  return useMemo(() => ({ baseUrl, call }), [authenticationToken]);
}
