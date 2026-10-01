import { Utils } from '@dfx.swiss/core';
import { useCallback, useMemo } from 'react';
import { useAuthContext } from '../contexts/auth.context';
import { hasSameUserScope } from '../contexts/user-identity';
import { ApiError, ApiErrorResponse, ApiException } from '../definitions/error';

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
  const { getAuthToken, getAuthTokenSession, setAuthToken } = useAuthContext();

  const url = process.env.REACT_APP_API_URL ?? 'https://api.dfx.swiss';
  const defaultVersion = 'v1';

  const fetchFrom = useCallback(
    async function <T>(config: CallConfig): Promise<T> {
      const version = config.version ?? defaultVersion;
      const baseUrl = Utils.joinUrl(url, version);
      const responseType = config.responseType ?? ResponseType.JSON;

      return fetch(
        Utils.joinUrl(baseUrl, config.url),
        buildInit(config.method, config.token === false ? undefined : config.token, config.data, config.noJson),
      )
        .catch((error: unknown) => {
          const message = error instanceof Error ? error.message : String(error);
          throw new ApiException(0, `Network error: ${message}`);
        })
        .then((response) => {
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
                return response.blob().then((blob) => ({
                  data: blob,
                  headers: Object.fromEntries(response.headers.entries()),
                })) as Promise<T>;
              default:
                throw new Error('Unknown response type');
            }
          }

          return response
            .json()
            .catch(() => null)
            .then((body: Partial<ApiErrorResponse> | null) => {
              throw new ApiException(
                body?.statusCode ?? response.status,
                body?.message ?? response.statusText ?? 'Unknown error',
                body?.code,
                body?.switchToCode,
                body?.details,
              );
            });
        });
    },
    [url, defaultVersion],
  );

  const call = useCallback(
    async function callApi<T>(config: CallConfig): Promise<T> {
      const requestToken = config.token ?? getAuthToken();
      const requestConfig = { ...config, token: requestToken };
      const requestSession = typeof requestToken === 'string' ? getAuthTokenSession(requestToken) : undefined;

      return fetchFrom<T>(requestConfig).catch((error: ApiError) => {
        if (error.statusCode === 401) {
          const currentToken = getAuthToken();
          if (typeof requestToken === 'string' && requestToken.length > 0 && requestToken === currentToken) {
            setAuthToken(undefined);
          } else if (
            config.method === 'GET' &&
            typeof requestToken === 'string' &&
            requestToken.length > 0 &&
            typeof currentToken === 'string' &&
            currentToken.length > 0 &&
            hasSameUserScope(requestSession, getAuthTokenSession(currentToken))
          ) {
            return callApi<T>({
              ...requestConfig,
              token: currentToken,
            });
          }
        }

        throw error;
      });
    },
    [getAuthToken, getAuthTokenSession, setAuthToken, fetchFrom],
  );

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

  return useMemo(() => ({ defaultUrl: Utils.joinUrl(url, defaultVersion), call }), [url, defaultVersion, call]);
}
