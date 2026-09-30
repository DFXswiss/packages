import * as sdk from '../index';
import * as kycDefinitions from '../definitions/kyc';
import * as transactionDefinitions from '../definitions/transaction';
import * as errorDefinitions from '../definitions/error';
import type { Country } from '../definitions/country';

describe('React package public exports', () => {
  it('exports the KYC nationality request converter from the package barrel', () => {
    const nationality = { id: 756, symbol: 'CH' } as Country;
    expect(sdk.toKycNationalityRequest({ nationality })).toEqual({ nationality });
    expect(sdk.toKycNationalityRequest({ country: nationality })).toEqual({ nationality });
    expect(() => sdk.toKycNationalityRequest({} as any)).toThrow('KYC nationality is required');
  });

  it('exposes defined runtime values for every public SDK barrel export', () => {
    const exports = Object.entries(sdk);
    expect(exports.length).toBeGreaterThan(80);
    expect(exports.every(([, value]) => value !== undefined)).toBe(true);
    expect(typeof sdk.useAuth).toBe('function');
    expect(typeof sdk.useUserContext).toBe('function');
    expect(sdk.UserRole.USER).toBe('User');
    expect(sdk.TransactionType.BUY).toBe('Buy');
    expect(sdk.RecommendationStatus.PENDING).toBe('Pending');
  });

  it('keeps definition sub-barrels populated with their public contract values', () => {
    expect(Object.values(kycDefinitions).every((value) => value !== undefined)).toBe(true);
    expect(kycDefinitions.KycStepName.FINANCIAL_DATA).toBe('FinancialData');
    expect(kycDefinitions.buildKycUrl('https://api.example/v1').base).toBe('https://api.example/v2/kyc');
    expect(kycDefinitions.buildKycUrl('https://api.example/v1/').base).toBe('https://api.example/v2/kyc');
    expect(kycDefinitions.isStepDone({ status: 'Completed' } as any)).toBe(true);
    expect(kycDefinitions.isStepDone({ status: 'InReview' } as any)).toBe(true);
    expect(kycDefinitions.isStepDone({ status: 'OnHold' } as any)).toBe(true);
    expect(kycDefinitions.isStepDone({ status: 'InProgress' } as any)).toBe(false);

    expect(Object.values(transactionDefinitions).every((value) => value !== undefined)).toBe(true);
    expect(transactionDefinitions.TransactionUrl.refund(5)).toBe('transaction/5/refund');
    expect(transactionDefinitions.TransactionUrl.bankRefund(5)).toBe('transaction/5/refund/bank');
    expect(transactionDefinitions.TransactionType.SWAP).toBe('Swap');
    expect(Object.values(errorDefinitions).every((value) => value !== undefined)).toBe(true);
    expect(new errorDefinitions.ApiException(409, 'conflict')).toMatchObject({ statusCode: 409, message: 'conflict' });
    expect(
      new errorDefinitions.ApiException(409, 'already exists', 'PAYMENT_INFO_ALREADY_EXISTS', undefined, {
        existingUid: 'existing-uid',
        requestStatus: 'WaitingForPayment',
      }).paymentInfoConflict,
    ).toEqual({ existingUid: 'existing-uid', requestStatus: 'WaitingForPayment' });
    expect(
      new errorDefinitions.ApiException(409, 'already exists', 'PAYMENT_INFO_ALREADY_EXISTS', undefined, {
        existingUid: '',
        requestStatus: 'WaitingForPayment',
      }).paymentInfoConflict,
    ).toBeUndefined();
    expect(
      new errorDefinitions.ApiException(409, 'already exists', 'PAYMENT_INFO_ALREADY_EXISTS', undefined, {
        requestStatus: 'Unknown',
      }).paymentInfoConflict,
    ).toEqual({ requestStatus: 'Unknown' });
  });
});
