/**
 * Pins the TypeScript contract of `GET paymentLink/payment` (`PaymentLinkInvoicePaymentQuery`).
 *
 * The type requires `amount` and treats every other field as optional. Negative calls sit
 * under `@ts-expect-error`; if those mismatches start to type-check — for example if `amount`
 * is relaxed to optional — the unused directive is TS2578 and ts-jest fails the suite.
 */

import { PaymentLinksApi } from '../client/PaymentLinksApi';
import { PaymentStandardType } from '../definitions/route';

function getInvoicePayment(params: Parameters<PaymentLinksApi['getInvoicePayment']>[0]) {
  return params;
}

describe('PaymentLinkInvoicePaymentQuery', () => {
  it('requires amount on getInvoicePayment', () => {
    const valid = getInvoicePayment({
      routeId: '1',
      route: 'shop',
      externalId: 'ext-1',
      message: 'inv-1',
      label: 'L',
      note: 'N',
      amount: '10.5',
      currency: 'CHF',
      expiryDate: new Date('2027-01-01T00:00:00.000Z'),
      standard: PaymentStandardType.OPEN_CRYPTO_PAY,
      webhookUrl: 'https://example.com/hook',
    });

    // @ts-expect-error amount is required
    getInvoicePayment({ routeId: '1' });

    // @ts-expect-error amount is a string
    getInvoicePayment({ routeId: '1', amount: 5 });

    // @ts-expect-error unknown query fields are rejected
    getInvoicePayment({ routeId: '1', amount: '5', notAQueryField: 'x' });

    expect(valid.amount).toBe('10.5');
  });
});
