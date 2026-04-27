export interface ApiError {
  /**
   * HTTP status code from the API response.
   * A value of 0 indicates a network-level error (e.g., server unreachable, CORS, timeout).
   */
  statusCode: number;
  message: string;
  /**
   * Machine-readable error code from the API response body (e.g. 'TFA_REQUIRED',
   * 'KYC_LEVEL_REQUIRED'). Absent for generic errors.
   */
  code?: string;
}

export class ApiException extends Error implements ApiError {
  constructor(public readonly statusCode: number, message: string, public readonly code?: string) {
    super(message);
    this.name = 'ApiException';
    Object.setPrototypeOf(this, ApiException.prototype);
  }
}
