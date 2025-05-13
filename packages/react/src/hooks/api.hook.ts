import { useEffect, useMemo } from 'react';
import { useAuthContext } from '../contexts/auth.context';
import { ApiError } from '../definitions/error';
import { useStore } from './store.hook';

export interface ApiInterface {
  defaultUrl: string;
  call: <T>(config: CallConfig) => Promise<T>;
}

export enum ResponseType {
  JSON = 'json',
  TEXT = 'text',
  BLOB = 'blob',
}

export interface CallConfig {
  url: string;
  method: 'GET' | 'PUT' | 'POST' | 'DELETE';
  version?: string;
  data?: any;
  noJson?: boolean;
  responseType?: ResponseType;
  specialHandling?: SpecialHandling;
  token?: string | false;
}

interface SpecialHandling {
  action: () => void;
  statusCode: number;
}

export function useApi(): ApiInterface {
  const { authenticationToken, setAuthenticationToken } = useAuthContext();
  const { authenticationToken: authenticationTokenStore } = useStore();

  const url = process.env.REACT_APP_API_URL ?? 'https://api.dfx.swiss';
  const defaultVersion = 'v1';

  async function call<T>(config: CallConfig): Promise<T> {
    config.token ??= authenticationToken;

    return fetchFrom<T>(config).catch((error: ApiError) => {
      if (error.statusCode === 401) {
        if (config.token === authenticationTokenStore.get()) {
          setAuthenticationToken(undefined);
        } else {
          return call<T>({
            ...config,
            token: authenticationTokenStore.get(),
          });
        }
      }

      throw error;
    });
  }

  async function fetchFrom<T>(config: CallConfig): Promise<T> {
    const version = config.version ?? defaultVersion;
    const baseUrl = `${url}/${version}`;
    const responseType = config.responseType ?? ResponseType.JSON;

    return fetch(
      `${baseUrl}/${config.url}`,
      buildInit(config.method, config.token === false ? undefined : config.token, config.data, config.noJson),
    ).then((response) => {
      if (response.status === config.specialHandling?.statusCode) {
        config.specialHandling?.action?.();
      }
      if (response.ok) {
        switch (responseType) {
          case ResponseType.JSON:
            return response.json().catch(() => undefined) as Promise<T>;
          case ResponseType.TEXT:
            return response.text() as Promise<T>;
          case ResponseType.BLOB:
            return response.blob() as Promise<T>;
          default:
            throw new Error('Unknown response type');
        }
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

  return useMemo(
    () => ({ defaultUrl: `${url}/${defaultVersion}`, call }),
    [authenticationToken, authenticationTokenStore],
  );
}
