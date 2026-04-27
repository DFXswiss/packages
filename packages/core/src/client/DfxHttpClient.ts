import { ApiError, ApiException } from '../definitions/error';

export enum ResponseType {
  JSON = 'json',
  TEXT = 'text',
  BLOB = 'blob',
}

export interface SpecialHandling {
  statusCode: number;
  action: () => void;
}

export interface RequestConfig {
  url: string;
  method: 'GET' | 'PUT' | 'POST' | 'DELETE';
  version?: string;
  data?: any;
  noJson?: boolean;
  responseType?: ResponseType;
  token?: string | false;
  headers?: Record<string, string>;
  specialHandling?: SpecialHandling;
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

  /**
   * Send a request to a versioned API endpoint (e.g. /v1/buy/quote).
   */
  async request<T>(config: RequestConfig): Promise<T> {
    const version = config.version ?? this.getDefaultVersion();
    const baseUrl = `${this.getBaseUrl()}/${version}`;
    return this.rawRequest<T>({ ...config, url: `${baseUrl}/${config.url}` });
  }

  /**
   * Send a request to an absolute URL (e.g. for KYC endpoints that use full URLs).
   */
  async requestAbsolute<T>(config: RequestConfig): Promise<T> {
    return this.rawRequest<T>(config);
  }

  getBaseUrl(): string {
    return this.apiUrl.replace(/\/v\d+\/?$/, '');
  }

  getApiUrl(): string {
    return this.apiUrl;
  }

  private async rawRequest<T>(config: RequestConfig): Promise<T> {
    const responseType = config.responseType ?? ResponseType.JSON;
    const token = config.token === false ? undefined : config.token ?? this.authToken;

    let response: Response;
    try {
      response = await this.fetchFn(
        config.url,
        this.buildInit(config.method, token, config.data, config.noJson, config.headers),
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new ApiException(0, `Network error: ${message}`);
    }

    if (config.specialHandling && response.status === config.specialHandling.statusCode) {
      config.specialHandling.action();
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
      body?.code,
    );
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
    extraHeaders?: Record<string, string>,
  ): RequestInit {
    return {
      method,
      headers: {
        ...(noJson ? undefined : { 'Content-Type': 'application/json' }),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...extraHeaders,
      },
      body: data !== undefined ? (noJson ? data : JSON.stringify(data)) : undefined,
    };
  }
}
