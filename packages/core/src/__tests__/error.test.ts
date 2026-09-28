import { ApiException } from '..';
import type { ApiError, PaymentInfoConflictDetails, PaymentInfoRequestStatus } from '..';

describe('ApiException', () => {
  it('has correct statusCode and message', () => {
    const error = new ApiException(404, 'Not found');
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Not found');
  });

  it('is instanceof Error', () => {
    const error = new ApiException(500, 'Server error');
    expect(error).toBeInstanceOf(Error);
  });

  it('is instanceof ApiException', () => {
    const error = new ApiException(401, 'Unauthorized');
    expect(error).toBeInstanceOf(ApiException);
  });

  it('has correct name', () => {
    const error = new ApiException(400, 'Bad request');
    expect(error.name).toBe('ApiException');
  });

  it('works in catch blocks with instanceof', () => {
    try {
      throw new ApiException(409, 'Conflict');
    } catch (e) {
      expect(e).toBeInstanceOf(ApiException);
      if (e instanceof ApiException) {
        expect(e.statusCode).toBe(409);
      }
    }
  });

  it('carries switchToCode when provided', () => {
    const error = new ApiException(401, 'User is merged', undefined, 'MASTER-CODE');
    expect(error.switchToCode).toBe('MASTER-CODE');
  });

  it('leaves switchToCode undefined when not provided', () => {
    const error = new ApiException(401, 'Unauthorized');
    expect(error.switchToCode).toBeUndefined();
  });

  it('exposes only validated payment-info conflict details', () => {
    const error: ApiError = new ApiException(409, 'Already exists', 'PAYMENT_INFO_ALREADY_EXISTS', undefined, {
      existingUid: 'quote-123',
      requestStatus: 'WaitingForPayment',
      iban: 'must not be exposed',
    });

    const recovery: PaymentInfoConflictDetails | undefined = error.paymentInfoConflict;
    const status: PaymentInfoRequestStatus | undefined = recovery?.requestStatus;
    expect(recovery).toEqual({ existingUid: 'quote-123', requestStatus: 'WaitingForPayment' });
    expect(status).toBe('WaitingForPayment');
  });

  it.each([
    [400, 'PAYMENT_INFO_ALREADY_EXISTS', { requestStatus: 'Processing' }],
    [409, 'OTHER_CONFLICT', { requestStatus: 'Processing' }],
    [409, 'PAYMENT_INFO_ALREADY_EXISTS', { requestStatus: 'Other' }],
    [409, 'PAYMENT_INFO_ALREADY_EXISTS', { requestStatus: 'Processing', existingUid: 42 }],
  ])('does not expose untrusted conflict details for status %s', (status, code, details) => {
    const error = new ApiException(status as number, 'Conflict', code as string, undefined, details);
    expect(error.paymentInfoConflict).toBeUndefined();
  });
});
