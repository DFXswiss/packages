export interface ApiError {
  /**
   * HTTP status code from the API response.
   * A value of 0 indicates a network-level error (e.g., server unreachable, CORS, timeout).
   */
  statusCode: number;
  message: string;
}

export class ApiException extends Error implements ApiError {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiException';
    Object.setPrototypeOf(this, ApiException.prototype);
  }
}
