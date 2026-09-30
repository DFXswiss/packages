import * as Core from '..';
import * as Definitions from '../definitions';
import { ApiException as ApiExceptionFromRoot } from '..';
import Validations from '../validations';
import { DfxApiClient } from '../client';
import { DfxHttpClient, ResponseType } from '../client/DfxHttpClient';
import { Utils } from '../utils';
import { ApiException } from '../definitions/error';
import { BuyUrl } from '../definitions/buy';
import { PaymentLinksUrl } from '../definitions/route';
import { SellUrl } from '../definitions/sell';
import { SwapUrl } from '../definitions/swap';
import { TransactionUrl } from '../definitions/transaction';
import type { Country } from '../definitions/country';

describe('core public package contract', () => {
  it('keeps every runtime definition available from the package root as the canonical value', () => {
    const root = Core as unknown as Record<string, unknown>;
    const definitions = Definitions as unknown as Record<string, unknown>;

    for (const [name, value] of Object.entries(definitions)) {
      expect(root[name]).toBe(value);
    }
  });

  it('exposes the client and conflict types through the supported package entry point', () => {
    expect(Core.DfxApiClient).toBe(DfxApiClient);
    expect(Core.DfxHttpClient).toBe(DfxHttpClient);
    expect(Core.ResponseType).toBe(ResponseType);
    expect(ApiExceptionFromRoot).toBe(ApiException);

    const failure = new Core.ApiException(409, 'Conflict', 'PAYMENT_INFO_ALREADY_EXISTS', undefined, {
      requestStatus: 'WaitingForPayment',
    });
    expect(failure.paymentInfoConflict).toEqual({ requestStatus: 'WaitingForPayment' });
  });

  it('exposes the canonical query and validation utilities at the package root', () => {
    expect(Core.Utils).toBe(Utils);
    expect(Core.Validations).toBe(Validations);
    expect(Core.Utils.buildQuery({ clientRequestId: 'request-123', enabled: false })).toBe(
      '?clientRequestId=request-123&enabled=false',
    );
    const switzerland: Country = {
      id: 756,
      symbol: 'CH',
      name: 'Switzerland',
      locationAllowed: true,
      kycAllowed: true,
      nationalityAllowed: true,
      bankAllowed: true,
      cardAllowed: true,
      cryptoAllowed: true,
      kycOrganizationAllowed: true,
    };
    expect(Core.Validations.Iban([switzerland]).validate('CH9300762011623852957')).toBe(true);
  });

  it('keeps payment-info recovery and transaction routes stable at the public boundary', () => {
    expect(BuyUrl.confirm(23)).toBe('buy/paymentInfos/23/confirm');
    expect(SellUrl.confirm(24)).toBe('sell/paymentInfos/24/confirm');
    expect(SwapUrl.confirm(25)).toBe('swap/paymentInfos/25/confirm');
    expect(PaymentLinksUrl.recipient('route-42')).toBe('paymentLink/recipient?id=route-42');
    expect(TransactionUrl.bankRefund(26)).toBe('transaction/26/refund/bank');
    expect(TransactionUrl.setTarget(26)).toBe('transaction/26/target');
    expect(TransactionUrl.invoice('tx-a')).toBe('transaction/tx-a/invoice');
    expect(TransactionUrl.receipt(26)).toBe('transaction/26/receipt');
  });
});
