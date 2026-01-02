export interface ApiError {
  /**
   * HTTP status code from the API response.
   * A value of 0 indicates a network-level error (e.g., server unreachable, CORS, timeout).
   */
  statusCode: number;
  message: string;
}
