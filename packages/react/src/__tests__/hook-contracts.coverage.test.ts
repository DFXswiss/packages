const mockCall = jest.fn();
const mockTokenStore = { get: jest.fn(), set: jest.fn() };
let mockCurrencies: Fiat[] | undefined;
let mockUser: { activeAddress?: { address?: string } } | undefined;
let mockSession: { address?: string } | undefined;

jest.mock('react', () => {
  const actual = jest.requireActual('react');
  return {
    ...actual,
    useCallback: (callback: (...args: unknown[]) => unknown) => callback,
    useMemo: (factory: () => unknown) => factory(),
  };
});

jest.mock('../hooks/api.hook', () => ({
  useApi: () => ({ call: mockCall, defaultUrl: 'https://api.example/v1' }),
  ResponseType: { JSON: 'json', TEXT: 'text', BLOB: 'blob' },
}));

jest.mock('../contexts/auth.context', () => ({
  useAuthContext: () => ({ session: mockSession }),
}));

jest.mock('../contexts/fiat.context', () => ({
  useFiatContext: () => ({ currencies: mockCurrencies }),
}));

jest.mock('../contexts/user.context', () => ({ useUserContext: () => ({ user: mockUser }) }));

jest.mock('../contexts/session.context', () => ({ useSessionContext: () => ({ tokenStore: mockTokenStore }) }));

import { useAuth } from '../hooks/auth.hook';
import { useBuy } from '../hooks/buy.hook';
import { useKyc } from '../hooks/kyc.hook';
import { usePaymentRoutes } from '../hooks/payment-routes.hook';
import { useSell } from '../hooks/sell.hook';
import { useSwap } from '../hooks/swap.hook';
import { useTransaction } from '../hooks/transaction.hook';
import { useUser } from '../hooks/user.hook';
import type { BuyPaymentInfo } from '../definitions/buy';
import type { SellPaymentInfo } from '../definitions/sell';
import type { SwapPaymentInfo } from '../definitions/swap';
import { AuthWalletType } from '../definitions/auth';
import { AssetCategory, AssetType } from '../definitions/asset';
import type { Asset } from '../definitions/asset';
import { Blockchain } from '../definitions/blockchain';
import type { Country } from '../definitions/country';
import {
  AccountType,
  DocumentType,
  FundOrigin,
  GoodsCategory,
  GoodsType,
  GenderType,
  InvestmentDate,
  KycStepName,
  KycStepType,
  LegalEntity,
  Limit,
  MerchantCategory,
  SignatoryPower,
  StoreType,
  TfaLevel,
} from '../definitions/kyc';
import type {
  KycAddress,
  KycBeneficialData,
  KycChangeAddressData,
  KycChangeNameData,
  KycChangePhoneData,
  KycContactData,
  KycFileData,
  KycFinancialResponses,
  KycLegalEntityData,
  KycManualIdentData,
  KycOperationalData,
  KycPersonalData,
  KycRecommendationData,
  KycSignatoryPowerData,
  LimitRequest,
  PaymentData,
  RecallData,
  UserData,
  UserName,
} from '../definitions/kyc';
import { PaymentLinkPaymentMode, PaymentLinkMode, PaymentStandardType } from '../definitions/route';
import type {
  CreatePaymentLink,
  CreatePaymentLinkPayment,
  UpdatePaymentLink,
  UpdatePaymentLinkConfig,
} from '../definitions/route';
import { ExportFormat, ExportType } from '../definitions/transaction';
import type {
  TransactionFilterKey,
  TransactionHistoryQuery,
  TransactionRefundTarget,
} from '../definitions/transaction';
import { PhoneCallTime } from '../definitions/user';
import type { Fiat } from '../definitions/fiat';
import type { User } from '../definitions/user';

const fiat: Fiat = {
  id: 756,
  name: 'Swiss franc',
  buyable: true,
  sellable: true,
  cardBuyable: false,
  cardSellable: false,
  instantBuyable: false,
  instantSellable: false,
};

const asset: Asset = {
  id: 1,
  name: 'Bitcoin',
  uniqueName: 'BTC',
  description: 'Bitcoin',
  buyable: true,
  sellable: true,
  cardBuyable: false,
  cardSellable: false,
  instantBuyable: false,
  instantSellable: false,
  blockchain: Blockchain.BITCOIN,
  comingSoon: false,
  type: AssetType.COIN,
  category: AssetCategory.PUBLIC,
};

const country: Country = {
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

function jsonResponse(body: unknown): Response {
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

describe('SDK hook request contracts', () => {
  beforeEach(() => {
    mockCall.mockReset().mockResolvedValue({ result: 'ok' });
    mockTokenStore.get.mockReset();
    mockTokenStore.set.mockReset();
    mockTokenStore.get.mockReturnValue(undefined);
    mockUser = undefined;
    mockSession = undefined;
    mockCurrencies = undefined;
  });

  it('covers authentication endpoints, parameter normalization, and the anonymous conflict retry', async () => {
    const auth = useAuth();
    const response = { accessToken: 'access-token' };
    mockCall.mockResolvedValue(response);

    await auth.confirmAccountMerge('a&b', false);
    await auth.confirmAccountMerge('default-auth');
    mockCall.mockResolvedValueOnce({ message: 'Sign this message' });
    await expect(auth.getSignMessage('0xabc')).resolves.toBe('Sign this message');
    await expect(
      auth.authenticate(
        '0xabc',
        'sig',
        'key',
        'special',
        '27',
        '123-456',
        AuthWalletType.WALLET_CONNECT,
        'r-code',
        'de',
      ),
    ).resolves.toEqual(response);
    mockCall.mockRejectedValueOnce({ statusCode: 409 }).mockResolvedValueOnce(response);
    await auth.authenticate('0xdef', 'sig-2', undefined, undefined, 'wallet-name');
    await auth.signIn('0xabc', 'signed', 'key', 'special', AuthWalletType.LEDGER);
    await auth.signUp(
      '0xabc',
      'signed',
      undefined,
      undefined,
      'metamask',
      'ref',
      AuthWalletType.WALLET_CONNECT,
      'rec',
      'fr',
    );
    await auth.signInWithMail('person@example.test', 'https://return.example/?a=1', 'rec', 'wallet');
    await auth.check2fa();
    await auth.check2fa(TfaLevel.STRICT);
    await auth.setup2fa();
    await auth.setup2fa(TfaLevel.BASIC);
    await auth.verify2fa('123456');
    await auth.createLnurlAuth();
    await auth.getLnurlAuth('challenge & 1');
    const forbidden = { statusCode: 403, message: 'Forbidden' };
    mockCall.mockRejectedValueOnce(forbidden);
    await expect(auth.authenticate('0xbad', 'invalid-signature')).rejects.toBe(forbidden);

    expect(mockCall.mock.calls.map(([config]) => config)).toEqual([
      { url: 'auth/mail/confirm?code=a%26b', method: 'GET', token: false },
      { url: 'auth/mail/confirm?code=default-auth', method: 'GET' },
      { url: 'auth/signMessage?address=0xabc', method: 'GET' },
      {
        url: 'auth',
        method: 'POST',
        data: {
          address: '0xabc',
          signature: 'sig',
          key: 'key',
          specialCode: 'special',
          walletId: 27,
          usedRef: '123-456',
          walletType: 'WalletConnect',
          recommendationCode: 'r-code',
          language: 'de',
        },
      },
      {
        url: 'auth',
        method: 'POST',
        data: {
          address: '0xdef',
          signature: 'sig-2',
          key: undefined,
          usedRef: undefined,
          specialCode: undefined,
          walletType: undefined,
          recommendationCode: undefined,
          language: undefined,
          wallet: 'wallet-name',
        },
      },
      {
        url: 'auth',
        method: 'POST',
        token: false,
        data: expect.objectContaining({ address: '0xdef', wallet: 'wallet-name' }),
      },
      { url: 'auth/signIn', method: 'POST', data: expect.objectContaining({ address: '0xabc', walletType: 'Ledger' }) },
      {
        url: 'auth/signUp',
        method: 'POST',
        data: expect.objectContaining({
          wallet: 'metamask',
          usedRef: 'ref',
          recommendationCode: 'rec',
          language: 'fr',
        }),
      },
      {
        url: 'auth/mail',
        method: 'POST',
        data: {
          mail: 'person@example.test',
          redirectUri: 'https://return.example/?a=1',
          recommendationCode: 'rec',
          wallet: 'wallet',
        },
      },
      { url: 'auth/2fa', method: 'GET' },
      { url: 'auth/2fa?level=Strict', method: 'GET' },
      { url: 'auth/2fa', method: 'POST' },
      { url: 'auth/2fa?level=Basic', method: 'POST' },
      { url: 'auth/2fa/verify', method: 'POST', data: { token: '123456' } },
      { url: 'lnurla', method: 'POST' },
      { url: 'lnurla/status?k1=challenge & 1', method: 'GET' },
      {
        url: 'auth',
        method: 'POST',
        data: expect.objectContaining({ address: '0xbad', signature: 'invalid-signature' }),
      },
    ]);
  });

  it('filters buy and sell currencies and sends their payment, invoice, and confirmation requests', async () => {
    mockCurrencies = [
      { ...fiat, id: 1, sellable: true, buyable: false },
      { ...fiat, id: 2, sellable: false, cardSellable: true, buyable: false, cardBuyable: true },
      {
        ...fiat,
        id: 3,
        sellable: false,
        cardSellable: false,
        instantSellable: true,
        buyable: false,
        instantBuyable: true,
      },
      {
        ...fiat,
        id: 4,
        sellable: false,
        cardSellable: false,
        instantSellable: false,
        buyable: false,
        cardBuyable: false,
        instantBuyable: false,
      },
      { ...fiat, id: 5, buyable: true, sellable: false, cardSellable: false, instantSellable: false },
    ];
    const buy = useBuy();
    const sell = useSell();
    const paymentInfo: BuyPaymentInfo = { currency: fiat, asset, amount: 25 };
    const sellPaymentInfo: SellPaymentInfo = { currency: fiat, asset, amount: 25 };
    const quoteInfo = { ...paymentInfo, clientRequestId: 'request-1' };

    expect(buy.currencies?.map(({ id }) => id)).toEqual([1, 2, 3]);
    expect(sell.currencies?.map(({ id }) => id)).toEqual([2, 3, 5]);
    await buy.quote(quoteInfo);
    await buy.receiveFor(paymentInfo);
    await buy.getPersonalIbans();
    await buy.invoiceFor(88);
    await buy.invoiceFor(88, true);
    await buy.confirmFor(88);
    await sell.quote({ ...sellPaymentInfo, clientRequestId: 'request-1' });
    await sell.receiveFor(sellPaymentInfo);
    await sell.receiveFor(sellPaymentInfo, true);
    await sell.confirmSell(89, { txHash: 'transaction-hash' });

    expect(mockCall.mock.calls.map(([config]) => config)).toEqual([
      { url: 'buy/quote', method: 'PUT', data: paymentInfo, token: false },
      { url: 'buy/paymentInfos', method: 'PUT', data: paymentInfo },
      { url: 'buy/personalIban', method: 'GET' },
      { url: 'buy/paymentInfos/88/invoice', method: 'PUT' },
      { url: 'buy/paymentInfos/88/invoice?collectionAccount=true', method: 'PUT' },
      { url: 'buy/paymentInfos/88/confirm', method: 'PUT' },
      { url: 'sell/quote', method: 'PUT', data: sellPaymentInfo, token: false },
      { url: 'sell/paymentInfos', method: 'PUT', data: sellPaymentInfo },
      { url: 'sell/paymentInfos?includeTx=true', method: 'PUT', data: sellPaymentInfo },
      { url: 'sell/paymentInfos/89/confirm', method: 'PUT', data: { txHash: 'transaction-hash' } },
    ]);
  });

  it('scopes swap receives to the active address and clears a rejected address token', async () => {
    const swap = useSwap();
    const info: SwapPaymentInfo = { sourceAsset: asset, targetAsset: { ...asset, id: 2 }, amount: 7 };
    mockUser = { activeAddress: { address: 'address-a' } };
    await swap.quote({ ...info, clientRequestId: 'swap-request' });
    expect(mockCall.mock.calls[0][0]).toEqual({ url: 'swap/quote', method: 'PUT', data: info, token: false });
    await swap.receiveFor({ ...info, receiverAddress: 'address-a' });
    await swap.receiveFor(info, true);

    mockTokenStore.get.mockReturnValue('address-token');
    await swap.receiveFor({ ...info, receiverAddress: 'address-b' });
    expect(mockCall).toHaveBeenLastCalledWith({
      url: 'swap/paymentInfos',
      method: 'PUT',
      data: { ...info, receiverAddress: 'address-b' },
      token: 'address-token',
    });

    mockTokenStore.get.mockReturnValue(undefined);
    mockCall.mockResolvedValueOnce({ accessToken: 'fresh-address-token' });
    await swap.receiveFor({ ...info, receiverAddress: 'address-c' });
    expect(mockTokenStore.set).toHaveBeenCalledWith('address-c', 'fresh-address-token');
    expect(mockCall.mock.calls[mockCall.mock.calls.length - 2][0]).toEqual({
      url: 'user/change',
      data: { address: 'address-c' },
      method: 'POST',
      token: undefined,
    });
    expect(mockCall).toHaveBeenLastCalledWith(expect.objectContaining({ token: 'fresh-address-token' }));

    mockTokenStore.get.mockReturnValue('expired-address-token');
    mockCall.mockRejectedValueOnce({ statusCode: 401 });
    await expect(swap.receiveFor({ ...info, receiverAddress: 'address-d' })).rejects.toMatchObject({ statusCode: 401 });
    expect(mockTokenStore.set).toHaveBeenLastCalledWith('address-d', null);
    await swap.confirmSwap(90, { txHash: 'swap-transaction-hash' });
    expect(mockCall).toHaveBeenLastCalledWith({
      url: 'swap/paymentInfos/90/confirm',
      method: 'POST',
      data: { txHash: 'swap-transaction-hash' },
    });
  });

  it('covers payment-link CRUD, assignment, route operations, and sticker filters', async () => {
    const routes = usePaymentRoutes();
    const link: CreatePaymentLink = { recipient: { name: 'Campaign' } };
    const update: UpdatePaymentLink = { label: 'Updated campaign', mode: PaymentLinkMode.SINGLE };
    const payment: CreatePaymentLinkPayment = {
      mode: PaymentLinkPaymentMode.SINGLE,
      amount: 4,
      externalId: 'payment-1',
      currency: fiat,
      expiryDate: new Date('2026-12-31T23:59:59Z'),
    };
    const config: UpdatePaymentLinkConfig = { displayQr: true, standards: [PaymentStandardType.OPEN_CRYPTO_PAY] };

    await routes.getPaymentLinks('link 1', 'external 2', 'payment 3');
    await routes.getPaymentRoutes();
    await routes.getPaymentRoutes({ includeInactiveSell: true });
    await routes.createPaymentLink(link);
    await routes.updatePaymentLink(update, 'link 1', 'external 2', 'payment 3');
    await routes.assignPaymentLink({ publicName: 'Campaign' }, 'link 1', 'external 2');
    await routes.getUserPaymentLinksConfig();
    await routes.updateUserPaymentLinksConfig(config);
    await routes.createPaymentLinkPayment(payment, 'link 1', 'external 2');
    await routes.cancelPaymentLinkPayment('link 1', 'external 2', 'payment 3');
    await routes.deletePaymentRoute(10, 'sell');
    await routes.getPaymentRecipient('route 11');
    await routes.getPaymentStickers('route 12');
    await routes.getPaymentStickers('route 13', 'e-1,e-2', '1,2', 'label', 'test', 'de');
    await routes.createPosLink('link 14', 'external 15', 'payment 16');
    await routes.getPaymentLinkHistory();
    await routes.createPaymentLinkInvoice({
      routeId: 17,
      amount: 12.5,
      currency: 'CHF',
      message: 'Lunch & dinner',
      expiryDate: '2026-12-31T23:59:59Z',
    });
    const sellRoute = { iban: 'CH9300762011623852957', blockchain: Blockchain.BITCOIN };
    await routes.createSellPaymentRoute(sellRoute);
    await routes.activatePaymentRoute(18, 'buy');

    expect(mockCall.mock.calls.map(([request]) => request)).toEqual([
      { url: 'paymentLink?linkId=link%201&externalLinkId=external%202&externalPaymentId=payment%203', method: 'GET' },
      { url: 'route', method: 'GET' },
      { url: 'route?includeInactiveSell=true', method: 'GET' },
      { url: 'paymentLink', method: 'POST', data: link },
      {
        url: 'paymentLink?linkId=link%201&externalLinkId=external%202&externalPaymentId=payment%203',
        method: 'PUT',
        data: update,
      },
      {
        url: 'paymentLink/assign?linkId=link%201&externalLinkId=external%202',
        method: 'PUT',
        data: { publicName: 'Campaign' },
      },
      { url: 'paymentLink/config', method: 'GET' },
      { url: 'paymentLink/config', method: 'PUT', data: config },
      { url: 'paymentLink/payment?linkId=link%201&externalLinkId=external%202', method: 'POST', data: payment },
      {
        url: 'paymentLink/payment?linkId=link%201&externalLinkId=external%202&externalPaymentId=payment%203',
        method: 'DELETE',
      },
      { url: 'sell/10', method: 'PUT', data: { active: false } },
      { url: 'paymentLink/recipient?id=route 11', method: 'GET' },
      { url: 'paymentLink/stickers?route=route+12', method: 'GET', responseType: 'blob' },
      {
        url: 'paymentLink/stickers?route=route+13&externalIds=e-1%2Ce-2&ids=1%2C2&type=label&mode=test&lang=de',
        method: 'GET',
        responseType: 'blob',
      },
      {
        url: 'paymentLink/pos?linkId=link%2014&externalLinkId=external%2015&externalPaymentId=payment%2016',
        method: 'PUT',
      },
      { url: 'paymentLink/history', method: 'GET' },
      {
        url: 'paymentLink/payment?routeId=17&amount=12.5&currency=CHF&message=Lunch+%26+dinner&expiryDate=2026-12-31T23%3A59%3A59Z',
        method: 'GET',
      },
      { url: '/sell', method: 'POST', data: sellRoute },
      { url: '/buy/18', method: 'PUT', data: { active: true } },
    ]);
  });

  it('covers transaction lookups, export filters, targets, and refund calls', async () => {
    const transaction = useTransaction();
    await expect(transaction.getTransactions()).rejects.toThrow('No active session');
    mockSession = {};
    await useTransaction().getTransactions();
    mockSession = { address: 'address / one' };
    mockCall.mockResolvedValue('csv-key');
    const scopedTransaction = useTransaction();
    await scopedTransaction.getTransactions();
    await scopedTransaction.getDetailTransactions();
    const start = new Date('2026-01-02T03:04:05.000Z');
    const end = new Date('2026-02-03T04:05:06.000Z');
    await scopedTransaction.getDetailTransactions(start, end);
    await scopedTransaction.getTransactionDetailByUid('uid & 1');
    await scopedTransaction.getPaymentInfoRequestStatus('request-id', 'Buy');
    await scopedTransaction.getTransactionByUid('uid / 2');
    await scopedTransaction.getTransactionByCkoId('cko&3');
    await scopedTransaction.getTransactionByRequestId(4);
    await expect(scopedTransaction.getTransactionCsv()).resolves.toBe(
      'https://api.example/v1/transaction/csv?key=csv-key',
    );
    await scopedTransaction.getTransactionCsv(start, end);
    await expect(scopedTransaction.getTransactionHistory(ExportType.COIN_TRACKING, {})).rejects.toThrow(
      'No user address provided',
    );
    const historyQuery: TransactionHistoryQuery = {
      from: start,
      to: end,
      format: ExportFormat.JSON,
      userAddress: '0xabc & def',
      buy: true,
      sell: false,
      staking: true,
      ref: false,
      lm: true,
    };
    await scopedTransaction.getTransactionHistory(ExportType.COIN_TRACKING, historyQuery);
    await scopedTransaction.getTransactionInvoice('invoice / 5');
    await scopedTransaction.getTransactionReceipt(6);
    await scopedTransaction.getUnassignedTransactions();
    await scopedTransaction.getTransactionTargets();
    await scopedTransaction.setTransactionTarget(7, 8);
    await scopedTransaction.getTransactionRefund(9);
    const refundTarget: TransactionRefundTarget = { refundTarget: 'CH9300762011623852957' };
    await scopedTransaction.setTransactionRefundTarget(9, refundTarget);

    expect(mockCall.mock.calls.map(([config]) => config)).toEqual([
      { url: 'transaction', method: 'GET' },
      { url: 'transaction?userAddress=address%20%2F%20one', method: 'GET' },
      { url: 'transaction/detail?', method: 'GET' },
      {
        url: `transaction/detail?${new URLSearchParams({ from: start.toISOString(), to: end.toISOString() })}`,
        method: 'GET',
      },
      { url: 'transaction/detail/single?uid=uid%20%26%201', method: 'GET' },
      { url: 'transaction/payment-info-request?clientRequestId=request-id&type=Buy', method: 'GET' },
      { url: 'transaction/single?uid=uid / 2', method: 'GET' },
      { url: 'transaction/single?cko-id=cko&3', method: 'GET' },
      { url: 'transaction/single?request-id=4', method: 'GET' },
      { url: 'transaction/detail/csv?', method: 'PUT', responseType: 'text' },
      {
        url: `transaction/detail/csv?${new URLSearchParams({ from: start.toISOString(), to: end.toISOString() })}`,
        method: 'PUT',
        responseType: 'text',
      },
      {
        url: `transaction/CoinTracking?${new URLSearchParams({
          from: start.toISOString(),
          to: end.toISOString(),
          format: 'json',
          userAddress: '0xabc & def',
          buy: 'true',
          sell: 'false',
          staking: 'true',
          ref: 'false',
          lm: 'true',
        })}`,
        method: 'GET',
        responseType: 'text',
      },
      { url: 'transaction/invoice / 5/invoice', method: 'PUT' },
      { url: 'transaction/6/receipt', method: 'PUT' },
      { url: 'transaction/unassigned', method: 'GET' },
      { url: 'transaction/target', method: 'GET' },
      { url: 'transaction/7/target?buyId=8', method: 'PUT' },
      { url: 'transaction/9/refund', method: 'GET' },
      { url: 'transaction/9/refund', method: 'PUT', data: refundTarget },
    ]);
  });

  it('covers user read, write, address, key, and call-setting methods', async () => {
    const user = useUser();
    const action = jest.fn();
    await user.getUser();
    await user.getUser('token-x');
    await user.getRef();
    await user.getProfile();
    expect(await user.updateUser()).toBeUndefined();
    const update = { mail: 'next@example.test' } satisfies Partial<User>;
    await user.updateUser(update, action, 'token-y');
    await user.updateMail('mail@example.test');
    await user.updateMail('mail@example.test', 'token-z');
    await user.verifyMail('verify-token', 'token-v');
    await user.changeUserAddress('address-2', 'token-a');
    expect(await user.renameUserAddress('', 'label')).toBeUndefined();
    expect(await user.renameUserAddress('address-1', '')).toBeUndefined();
    await user.renameUserAddress('address-1', 'Primary', 'token-r');
    await user.deleteUserAddress('address-1', 'token-d');
    await user.deleteUserAccount('token-delete');
    await user.addSpecialCode('special & code', 'token-special');
    await user.generateCTApiKey();
    const filterKeys: TransactionFilterKey[] = ['buy', 'sell'];
    await user.generateCTApiKey(filterKeys, 'token-key');
    await user.deleteCTApiKey('token-key-delete');
    await user.updateCTApiFilter();
    await user.updateCTApiFilter(filterKeys, 'token-filter');
    await user.updateCallSettings();
    await user.updateCallSettings([PhoneCallTime.H_9_TO_10, PhoneCallTime.H_10_TO_11], false, 'token-call');

    expect(mockCall.mock.calls.map(([config]) => config)).toEqual([
      { url: 'user', version: 'v2', method: 'GET', token: undefined },
      { url: 'user', version: 'v2', method: 'GET', token: 'token-x' },
      { url: 'user/ref', version: 'v2', method: 'GET' },
      { url: 'user/profile', version: 'v2', method: 'GET' },
      {
        url: 'user',
        version: 'v2',
        method: 'PUT',
        data: { mail: 'next@example.test' },
        token: 'token-y',
        specialHandling: { action, statusCode: 202 },
      },
      { url: 'user/mail', version: 'v2', method: 'PUT', data: { mail: 'mail@example.test' }, token: undefined },
      { url: 'user/mail', version: 'v2', method: 'PUT', data: { mail: 'mail@example.test' }, token: 'token-z' },
      { url: 'user/mail/verify', version: 'v2', method: 'POST', data: { token: 'verify-token' }, token: 'token-v' },
      { url: 'user/change', data: { address: 'address-2' }, method: 'POST', token: 'token-a' },
      { url: 'user/addresses/address-1', version: 'v2', method: 'PUT', data: { label: 'Primary' }, token: 'token-r' },
      { url: 'user/addresses/address-1', version: 'v2', method: 'DELETE', token: 'token-d' },
      { url: 'user', version: 'v2', method: 'DELETE', token: 'token-delete' },
      { url: 'user/specialCodes?code=special & code', method: 'PUT', token: 'token-special' },
      { url: 'user/apiKey/CT', method: 'POST', token: undefined },
      { url: 'user/apiKey/CT?buy&sell', method: 'POST', token: 'token-key' },
      { url: 'user/apiKey/CT', method: 'DELETE', token: 'token-key-delete' },
      { url: 'user/apiFilter/CT', method: 'PUT', token: undefined },
      { url: 'user/apiFilter/CT?buy&sell', method: 'PUT', token: 'token-filter' },
      {
        url: 'user',
        version: 'v2',
        method: 'PUT',
        data: { preferredPhoneTimes: undefined, acceptCall: undefined },
        token: undefined,
      },
      {
        url: 'user',
        version: 'v2',
        method: 'PUT',
        data: { preferredPhoneTimes: [PhoneCallTime.H_9_TO_10, PhoneCallTime.H_10_TO_11], acceptCall: false },
        token: 'token-call',
      },
    ]);
  });

  it('sends KYC reads and writes through their declared API helpers and request scopes', async () => {
    const originalFetch = global.fetch;
    const fetchMock = jest.fn().mockResolvedValue(jsonResponse({ accepted: true }));
    global.fetch = fetchMock as unknown as typeof fetch;
    try {
      const kyc = useKyc();
      const code = 'kyc-session';
      const url = 'https://step.example/kyc/contact';
      const name: UserName = { firstName: 'Ada', lastName: 'Lovelace' };
      const address: KycAddress = { street: 'Main street', city: 'Zürich', zip: '8000', country };
      const contactData: KycContactData = { mail: 'person@example.test' };
      const personalData: KycPersonalData = {
        accountType: AccountType.PERSONAL,
        firstName: 'Ada',
        lastName: 'Lovelace',
        phone: '+41790000000',
        address,
      };
      const data: UserData = { ...contactData, ...personalData };
      const fileData: KycFileData = { file: 'file-content', fileName: 'proof.pdf' };
      const manualIdentData: KycManualIdentData = {
        firstName: 'Ada',
        lastName: 'Lovelace',
        birthday: new Date('1815-12-10T00:00:00.000Z'),
        nationality: country,
        gender: GenderType.FEMALE,
        documentType: DocumentType.PASSPORT,
        documentNumber: 'P123456',
        document: fileData,
      };
      const serializedManualIdentData = {
        ...manualIdentData,
        birthday: manualIdentData.birthday.toISOString(),
      };
      const legalEntityData: KycLegalEntityData = { ...fileData, legalEntity: LegalEntity.GMBH };
      const recommendationData: KycRecommendationData = { key: 'recommendation-key' };
      const signatoryPowerData: KycSignatoryPowerData = { signatoryPower: SignatoryPower.SINGLE };
      const beneficialData: KycBeneficialData = { hasBeneficialOwners: false, isAccountHolderInvolved: true };
      const operationalData: KycOperationalData = { isOperational: true, websiteUrl: 'https://example.test' };
      const paymentData: PaymentData = {
        name: 'Example merchant',
        registrationNumber: 'CHE-123.456.789',
        storeType: StoreType.ONLINE,
        merchantCategory: MerchantCategory.OTHER,
        goodsType: GoodsType.VIRTUAL,
        goodsCategory: GoodsCategory.OTHERS,
        purpose: 'Test payment collection',
        contractAccepted: true,
      };
      const recallData: RecallData = { accepted: true };
      const addressChangeData: KycChangeAddressData = { ...fileData, fileName: 'proof.pdf', address };
      const nameChangeData: KycChangeNameData = {
        ...fileData,
        fileName: 'proof.pdf',
        firstName: 'Ada',
        lastName: 'Lovelace',
      };
      const phoneChangeData: KycChangePhoneData = { phone: '+41790000000' };
      const limitRequest: LimitRequest = {
        limit: Limit.K_500,
        investmentDate: InvestmentDate.NOW,
        fundOrigin: FundOrigin.SAVINGS,
      };
      const financialResponses: KycFinancialResponses = { responses: [{ key: 'source', value: 'salary' }] };
      await kyc.setName(name);
      await kyc.setData(data);
      const response = await kyc.getKycInfo(code);
      await kyc.continueKyc(code);
      await kyc.continueKyc(code, false);
      await kyc.startStep(code, KycStepName.FINANCIAL_DATA, KycStepType.AUTO, 3);
      await kyc.startStep(code, KycStepName.CONTACT_DATA);
      await kyc.setContactData(code, url, contactData);
      await kyc.setPersonalData(code, url, personalData);
      await kyc.setManualIdentData(code, url, manualIdentData);
      await kyc.setLegalEntityData(code, url, legalEntityData);
      await kyc.setSoleProprietorshipData(code, url, fileData);
      await kyc.setNationalityData(code, url, { nationality: country });
      await kyc.setRecommendationData(code, url, recommendationData);
      await kyc.setFileData(code, url, fileData);
      await kyc.setSignatoryPowerData(code, url, signatoryPowerData);
      await kyc.setBeneficialData(code, url, beneficialData);
      await kyc.setOperationalData(code, url, operationalData);
      await kyc.getFinancialData(code, url);
      await kyc.getFinancialData(code, url, 'de');
      await kyc.setFinancialData(code, url, financialResponses);
      await kyc.setPaymentData(code, url, paymentData);
      await kyc.setRecallData(code, url, recallData);
      await kyc.setAddressChangeData(code, url, addressChangeData);
      await kyc.setNameChangeData(code, url, nameChangeData);
      await kyc.setPhoneChangeData(code, url, phoneChangeData);
      await kyc.getFile('file-22');
      await kyc.check2fa();
      await kyc.check2fa(TfaLevel.STRICT);
      await kyc.setup2fa(code);
      await kyc.setup2fa(code, TfaLevel.BASIC);
      await kyc.verify2fa(code, '123456');
      await kyc.increaseLimit(code, limitRequest);
      await kyc.addTransferClient(code, 'client & id');
      await kyc.removeTransferClient(code, 'client & id');
      await kyc.cancelStep(code, url);

      expect(mockCall.mock.calls.map(([request]) => request)).toEqual([
        { url: 'user/name', method: 'PUT', data: name },
        { url: 'user/data', method: 'POST', data },
        { url: 'kyc/file/file-22', version: 'v2', method: 'GET' },
        { url: 'kyc/2fa', version: 'v2', method: 'GET' },
        { url: 'kyc/2fa?level=Strict', version: 'v2', method: 'GET' },
      ]);
      expect(
        fetchMock.mock.calls.map(([requestUrl, init]) => ({
          url: requestUrl,
          method: init?.method,
          headers: init?.headers,
          body: typeof init?.body === 'string' ? JSON.parse(init.body) : init?.body,
        })),
      ).toEqual([
        {
          url: 'https://api.example/v2/kyc',
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'x-kyc-code': code },
          body: undefined,
        },
        {
          url: 'https://api.example/v2/kyc?autoStep=true',
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-kyc-code': code },
          body: undefined,
        },
        {
          url: 'https://api.example/v2/kyc?autoStep=false',
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-kyc-code': code },
          body: undefined,
        },
        {
          url: 'https://api.example/v2/kyc/FinancialData?type=Auto&sequence=3',
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'x-kyc-code': code },
          body: undefined,
        },
        {
          url: 'https://api.example/v2/kyc/ContactData?',
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'x-kyc-code': code },
          body: undefined,
        },
        { url, method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-kyc-code': code }, body: contactData },
        { url, method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-kyc-code': code }, body: personalData },
        {
          url,
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-kyc-code': code },
          body: serializedManualIdentData,
        },
        {
          url,
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-kyc-code': code },
          body: legalEntityData,
        },
        { url, method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-kyc-code': code }, body: fileData },
        {
          url,
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-kyc-code': code },
          body: { nationality: country },
        },
        {
          url,
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-kyc-code': code },
          body: recommendationData,
        },
        { url, method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-kyc-code': code }, body: fileData },
        {
          url,
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-kyc-code': code },
          body: signatoryPowerData,
        },
        {
          url,
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-kyc-code': code },
          body: beneficialData,
        },
        {
          url,
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-kyc-code': code },
          body: operationalData,
        },
        { url, method: 'GET', headers: { 'Content-Type': 'application/json', 'x-kyc-code': code }, body: undefined },
        {
          url: `${url}?lang=de`,
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'x-kyc-code': code },
          body: undefined,
        },
        {
          url,
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-kyc-code': code },
          body: financialResponses,
        },
        { url, method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-kyc-code': code }, body: paymentData },
        { url, method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-kyc-code': code }, body: recallData },
        {
          url,
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-kyc-code': code },
          body: addressChangeData,
        },
        {
          url,
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-kyc-code': code },
          body: nameChangeData,
        },
        {
          url,
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-kyc-code': code },
          body: phoneChangeData,
        },
        {
          url: 'https://api.example/v2/kyc/2fa',
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-kyc-code': code },
          body: undefined,
        },
        {
          url: 'https://api.example/v2/kyc/2fa?level=Basic',
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-kyc-code': code },
          body: undefined,
        },
        {
          url: 'https://api.example/v2/kyc/2fa/verify',
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-kyc-code': code },
          body: { token: '123456' },
        },
        {
          url: 'https://api.example/v2/kyc/limit',
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-kyc-code': code },
          body: limitRequest,
        },
        {
          url: 'https://api.example/v2/kyc/transfer?client=client%20%26%20id',
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-kyc-code': code },
          body: undefined,
        },
        {
          url: 'https://api.example/v2/kyc/transfer?client=client%20%26%20id',
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', 'x-kyc-code': code },
          body: undefined,
        },
        { url, method: 'DELETE', headers: { 'Content-Type': 'application/json', 'x-kyc-code': code }, body: undefined },
      ]);
      expect(response).toEqual({ accepted: true });
    } finally {
      global.fetch = originalFetch;
    }
  });

  it('preserves KYC empty-success and failure response behavior', async () => {
    const originalFetch = global.fetch;
    const failure = { statusCode: 422, message: 'Invalid KYC data' };
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.reject(new SyntaxError('empty response')) })
      .mockResolvedValueOnce({ ok: false, json: () => Promise.resolve(failure) })
      .mockResolvedValueOnce({ ok: false, json: () => Promise.reject(new SyntaxError('invalid error body')) });
    global.fetch = fetchMock as unknown as typeof fetch;
    try {
      const kyc = useKyc();
      await expect(kyc.getKycInfo('code')).resolves.toBeUndefined();
      await expect(kyc.getKycInfo('code')).rejects.toBe(failure);
      await expect(kyc.getKycInfo('code')).rejects.toThrow('invalid error body');
    } finally {
      global.fetch = originalFetch;
    }
  });
});
