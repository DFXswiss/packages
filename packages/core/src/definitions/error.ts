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
  /**
   * Code of the master account to redirect to when a request targets a merged
   * account (HTTP 401). Absent otherwise.
   */
  switchToCode?: string;
  details?: unknown;
}

export type PaymentInfoRequestStatus = 'Processing' | 'Created' | 'WaitingForPayment' | 'Completed' | 'Unknown';

export interface PaymentInfoConflictDetails {
  existingUid?: string;
  requestStatus: PaymentInfoRequestStatus;
}

const paymentInfoRequestStatuses: readonly PaymentInfoRequestStatus[] = [
  'Processing',
  'Created',
  'WaitingForPayment',
  'Completed',
  'Unknown',
];

export function readPaymentInfoConflictDetails(
  statusCode: number,
  code: string | undefined,
  details: unknown,
): PaymentInfoConflictDetails | undefined {
  if (statusCode !== 409 || code !== 'PAYMENT_INFO_ALREADY_EXISTS' || details == null || typeof details !== 'object')
    return undefined;

  const value = details as Record<string, unknown>;
  if (!paymentInfoRequestStatuses.includes(value.requestStatus as PaymentInfoRequestStatus)) return undefined;
  if (
    value.existingUid !== undefined &&
    (typeof value.existingUid !== 'string' || value.existingUid.length === 0 || value.existingUid.length > 128)
  )
    return undefined;

  return {
    requestStatus: value.requestStatus as PaymentInfoRequestStatus,
    ...(typeof value.existingUid === 'string' ? { existingUid: value.existingUid } : {}),
  };
}

export class ApiException extends Error implements ApiError {
  public readonly paymentInfoConflict?: PaymentInfoConflictDetails;

  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string,
    public readonly switchToCode?: string,
    details?: unknown,
  ) {
    super(message);
    this.name = 'ApiException';
    this.paymentInfoConflict = readPaymentInfoConflictDetails(statusCode, code, details);
    Object.setPrototypeOf(this, ApiException.prototype);
  }
}
