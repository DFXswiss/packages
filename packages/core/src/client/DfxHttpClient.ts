import { ApiError, ApiException } from '../definitions/error';
import { CustomFile } from '../definitions/file';

export enum ResponseType {
  JSON = 'json',
  TEXT = 'text',
  BLOB = 'blob',
}

export interface RequestConfig {
  url: string;
  method: 'GET' | 'PUT' | 'POST' | 'DELETE';
  version?: string;
  data?: any;
  noJson?: boolean;
  responseType?: ResponseType;
  token?: string | false;
}

export interface DfxHttpClientConfig {
  apiUrl: string;
  fetchFn?: typeof fetch;
}

export class DfxHttpClient {
  private readonly apiUrl: string;
  private readonly fetchFn: typeof fetch;
  private authToken?: string;

  constructor(config: DfxHttpClientConfig) {
    this.apiUrl = config.apiUrl.replace(/\/$/, '');
    this.fetchFn = config.fetchFn ?? globalThis.fetch.bind(globalThis);
  }

  setToken(token: string | undefined): void {
    this.authToken = token;
  }

  getToken(): string | undefined {
    return this.authToken;
  }

  async request<T>(config: RequestConfig): Promise<T> {
    const version = config.version ?? this.getDefaultVersion();
    const baseUrl = `${this.getBaseUrl()}/${version}`;
    const responseType = config.responseType ?? ResponseType.JSON;
    const token = config.token === false ? undefined : (config.token ?? this.authToken);

    let response: Response;
    try {
      response = await this.fetchFn(`${baseUrl}/${config.url}`, this.buildInit(config.method, token, config.data, config.noJson));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new ApiException(0, `Network error: ${message}`);
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

    const body: Partial<ApiError> | null = await response.json().catch(() => null);
    throw new ApiException(
      body?.statusCode ?? response.status,
      body?.message ?? response.statusText ?? 'Unknown error',
    );
  }

  getBaseUrl(): string {
    return this.apiUrl.replace(/\/v\d+\/?$/, '');
  }

  getApiUrl(): string {
    return this.apiUrl;
  }

  private getDefaultVersion(): string {
    const match = this.apiUrl.match(/\/(v\d+)\/?$/);
    return match ? match[1] : 'v1';
  }

  private buildInit(
    method: 'GET' | 'PUT' | 'POST' | 'DELETE',
    accessToken?: string,
    data?: any,
    noJson?: boolean,
  ): RequestInit {
    return {
      method,
      headers: {
        ...(noJson ? undefined : { 'Content-Type': 'application/json' }),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: data !== undefined ? (noJson ? data : JSON.stringify(data)) : undefined,
    };
  }
}
