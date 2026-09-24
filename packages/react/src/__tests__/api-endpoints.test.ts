const mockCall = jest.fn();

jest.mock('react', () => {
  const actual = jest.requireActual('react');
  return {
    ...actual,
    useCallback: (callback: (...args: any[]) => unknown) => callback,
    useMemo: (factory: () => unknown) => factory(),
  };
});

jest.mock('../hooks/api.hook', () => ({
  useApi: () => ({ call: mockCall }),
}));

jest.mock('../contexts/auth.context', () => ({
  useAuthContext: () => ({ session: undefined }),
}));

jest.mock('../contexts/fiat.context', () => ({
  useFiatContext: () => ({ currencies: undefined }),
}));

jest.mock('../hooks/user.hook', () => ({
  useUser: () => ({ changeUserAddress: jest.fn() }),
}));

jest.mock('../contexts/user.context', () => ({
  useUserContext: () => ({ user: undefined }),
}));

jest.mock('../contexts/session.context', () => ({
  useSessionContext: () => ({ tokenStore: { get: jest.fn(), set: jest.fn() } }),
}));

import { useAuth } from '../hooks/auth.hook';
import { useBuy } from '../hooks/buy.hook';
import { usePaymentRoutes } from '../hooks/payment-routes.hook';
import { useRecommendation } from '../hooks/recommendation.hook';
import { useSell } from '../hooks/sell.hook';
import { useSwap } from '../hooks/swap.hook';
import { useTransaction } from '../hooks/transaction.hook';
import type { CreateRecommendation } from '../definitions/recommendation';
import type { BuyPaymentInfo } from '../definitions/buy';
import type { SellPaymentInfo } from '../definitions/sell';
import type { SwapPaymentInfo } from '../definitions/swap';

describe('SDK endpoint methods', () => {
  beforeEach(() => {
    mockCall.mockReset();
    mockCall.mockResolvedValue(undefined);
  });

  it('encodes invoice query values while preserving the GET contract', async () => {
    const routes = usePaymentRoutes();
    const expiryDate = '2026-09-23T12:30:00.000Z';

    await routes.createPaymentLinkInvoice({
      routeId: 'route 7',
      amount: 12.5,
      currency: 'CHF&EUR',
      message: 'coffee & cake=great?',
      expiryDate,
    });

    const request = mockCall.mock.calls[0][0];
    expect(request.method).toBe('GET');
    const query = new URLSearchParams(request.url.split('?')[1]);
    expect(Object.fromEntries(query.entries())).toEqual({
      routeId: 'route 7',
      amount: '12.5',
      currency: 'CHF&EUR',
      message: 'coffee & cake=great?',
      expiryDate,
    });
  });

  it('loads payment-link history through the history GET endpoint', async () => {
    await usePaymentRoutes().getPaymentLinkHistory();

    expect(mockCall).toHaveBeenCalledWith({ url: 'paymentLink/history', method: 'GET' });
  });

  it('loads one transaction request detail by its encoded UID', async () => {
    await useTransaction().getTransactionDetailByUid('request / 42');

    expect(mockCall).toHaveBeenCalledWith({
      url: 'transaction/detail/single?uid=request%20%2F%2042',
      method: 'GET',
    });
  });

  it('looks up only the safe payment-request claim status by key and trade type', async () => {
    await useTransaction().getPaymentInfoRequestStatus('cdab92dc-8f3f-4a90-bb37-a7026e12a9fa', 'Buy');

    expect(mockCall).toHaveBeenCalledWith({
      url: 'transaction/payment-info-request?clientRequestId=cdab92dc-8f3f-4a90-bb37-a7026e12a9fa&type=Buy',
      method: 'GET',
    });
  });

  it('looks up a payment link by external payment ID in the GET query', async () => {
    await usePaymentRoutes().getPaymentLinks(undefined, undefined, 'payment & 42');

    const request = mockCall.mock.calls[0][0];
    expect(request.method).toBe('GET');
    expect(request.url.split('?')[0]).toBe('paymentLink');
    const query = new URLSearchParams(request.url.split('?')[1]);
    expect(query.get('externalPaymentId')).toBe('payment & 42');
    expect(query.has('linkId')).toBe(false);
    expect(query.has('externalLinkId')).toBe(false);
  });

  it('sends sell route creation and activation using their distinct API contracts', async () => {
    const routes = usePaymentRoutes();
    const body = { iban: 'CH9300762011623852957', currency: { id: 17 }, blockchain: 'Bitcoin' };

    await routes.createSellPaymentRoute(body);
    await routes.activatePaymentRoute(23, 'sell');

    expect(mockCall.mock.calls[0][0]).toMatchObject({ url: '/sell', method: 'POST', data: body });
    expect(mockCall.mock.calls[1][0]).toMatchObject({
      url: '/sell/23',
      method: 'PUT',
      data: { active: true },
    });
  });

  it('keeps the idempotency key out of all public quote requests', async () => {
    const clientRequestId = 'cdab92dc-8f3f-4a90-bb37-a7026e12a9fa';
    const buyInfo: BuyPaymentInfo = {
      currency: { id: 1 } as BuyPaymentInfo['currency'],
      asset: { id: 2 } as BuyPaymentInfo['asset'],
      amount: 3,
      clientRequestId,
    };
    const sellInfo: SellPaymentInfo = {
      currency: { id: 1 } as SellPaymentInfo['currency'],
      asset: { id: 2 } as SellPaymentInfo['asset'],
      amount: 3,
      clientRequestId,
    };
    const swapInfo: SwapPaymentInfo = {
      sourceAsset: { id: 2 } as SwapPaymentInfo['sourceAsset'],
      targetAsset: { id: 4 } as SwapPaymentInfo['targetAsset'],
      amount: 3,
      clientRequestId,
    };

    await useBuy().quote(buyInfo);
    await useSell().quote(sellInfo);
    await useSwap().quote(swapInfo);

    expect(mockCall.mock.calls.map(([request]) => request)).toEqual([
      {
        url: 'buy/quote',
        method: 'PUT',
        data: { currency: { id: 1 }, asset: { id: 2 }, amount: 3 },
        token: false,
      },
      {
        url: 'sell/quote',
        method: 'PUT',
        data: { currency: { id: 1 }, asset: { id: 2 }, amount: 3 },
        token: false,
      },
      {
        url: 'swap/quote',
        method: 'PUT',
        data: { sourceAsset: { id: 2 }, targetAsset: { id: 4 }, amount: 3 },
        token: false,
      },
    ]);
  });

  it('forwards the same client request UUID only with authenticated payment-info calls', async () => {
    const clientRequestId = 'cdab92dc-8f3f-4a90-bb37-a7026e12a9fa';
    const buyInfo: BuyPaymentInfo = {
      currency: { id: 1 } as BuyPaymentInfo['currency'],
      asset: { id: 2 } as BuyPaymentInfo['asset'],
      amount: 3,
      clientRequestId,
    };
    const sellInfo: SellPaymentInfo = {
      iban: 'CH9300762011623852957',
      currency: { id: 1 } as SellPaymentInfo['currency'],
      asset: { id: 2 } as SellPaymentInfo['asset'],
      amount: 3,
      clientRequestId,
    };
    const swapInfo: SwapPaymentInfo = {
      sourceAsset: { id: 2 } as SwapPaymentInfo['sourceAsset'],
      targetAsset: { id: 4 } as SwapPaymentInfo['targetAsset'],
      amount: 3,
      clientRequestId,
    };

    await useBuy().receiveFor(buyInfo);
    await useSell().receiveFor(sellInfo);
    await useSwap().receiveFor(swapInfo);

    expect(mockCall.mock.calls.map(([request]) => request)).toEqual([
      { url: 'buy/paymentInfos', method: 'PUT', data: buyInfo },
      { url: 'sell/paymentInfos', method: 'PUT', data: sellInfo },
      { url: 'swap/paymentInfos', method: 'PUT', data: swapInfo },
    ]);
  });

  it('encodes account merge codes and uses anonymous access only when requested', async () => {
    const auth = useAuth();

    await auth.confirmAccountMerge('otp &/?', true);
    await auth.confirmAccountMerge('anonymous code', false);

    expect(mockCall.mock.calls[0][0]).toEqual({
      url: 'auth/mail/confirm?code=otp%20%26%2F%3F',
      method: 'GET',
    });
    expect(mockCall.mock.calls[1][0]).toEqual({
      url: 'auth/mail/confirm?code=anonymous%20code',
      method: 'GET',
      token: false,
    });
  });

  it('routes recommendation actions by the supplied recommendation ID', async () => {
    const recommendation = useRecommendation();
    await recommendation.confirmRecommendation(91);
    await recommendation.rejectRecommendation(92);

    expect(mockCall.mock.calls.map(([request]) => request)).toEqual([
      { url: 'recommendation/91/confirm', method: 'PUT' },
      { url: 'recommendation/92/reject', method: 'PUT' },
    ]);
  });

  it('loads recommendations and creates them with the supplied bodies', async () => {
    const recommendation = useRecommendation();
    const body: CreateRecommendation = {
      recommendedAlias: 'Buyer',
      recommendedMail: 'buyer@example.test',
    };
    const aliasOnlyBody: CreateRecommendation = { recommendedAlias: 'Another buyer' };

    await recommendation.getRecommendations();
    await recommendation.createRecommendation(body);
    await recommendation.createRecommendation(aliasOnlyBody);

    expect(mockCall.mock.calls.map(([request]) => request)).toEqual([
      { url: 'recommendation', method: 'GET' },
      { url: 'recommendation', method: 'POST', data: body },
      { url: 'recommendation', method: 'POST', data: aliasOnlyBody },
    ]);
  });
});
