import { DfxHttpClient, DfxHttpClientConfig } from './DfxHttpClient';
import { AuthApi } from './AuthApi';
import { AssetApi } from './AssetApi';
import { BankApi } from './BankApi';
import { BankAccountApi } from './BankAccountApi';
import { BuyApi } from './BuyApi';
import { CountryApi } from './CountryApi';
import { FiatApi } from './FiatApi';
import { KycApi } from './KycApi';
import { LanguageApi } from './LanguageApi';
import { PaymentLinksApi } from './PaymentLinksApi';
import { PaymentRoutesApi } from './PaymentRoutesApi';
import { SellApi } from './SellApi';
import { SettingsApi } from './SettingsApi';
import { SupportApi } from './SupportApi';
import { SwapApi } from './SwapApi';
import { TransactionApi } from './TransactionApi';
import { UserApi } from './UserApi';

export interface DfxApiClientConfig {
  apiUrl?: string;
  fetchFn?: typeof fetch;
}

const DEFAULT_API_URL = 'https://api.dfx.swiss/v1';

export class DfxApiClient {
  private readonly http: DfxHttpClient;

  readonly auth: AuthApi;
  readonly asset: AssetApi;
  readonly bank: BankApi;
  readonly bankAccount: BankAccountApi;
  readonly buy: BuyApi;
  readonly country: CountryApi;
  readonly fiat: FiatApi;
  readonly kyc: KycApi;
  readonly language: LanguageApi;
  readonly paymentLinks: PaymentLinksApi;
  readonly paymentRoutes: PaymentRoutesApi;
  readonly sell: SellApi;
  readonly settings: SettingsApi;
  readonly support: SupportApi;
  readonly swap: SwapApi;
  readonly transaction: TransactionApi;
  readonly user: UserApi;

  constructor(config?: DfxApiClientConfig) {
    this.http = new DfxHttpClient({
      apiUrl: config?.apiUrl ?? DEFAULT_API_URL,
      fetchFn: config?.fetchFn,
    });

    this.auth = new AuthApi(this.http);
    this.asset = new AssetApi(this.http);
    this.bank = new BankApi(this.http);
    this.bankAccount = new BankAccountApi(this.http);
    this.buy = new BuyApi(this.http);
    this.country = new CountryApi(this.http);
    this.fiat = new FiatApi(this.http);
    this.kyc = new KycApi(this.http);
    this.language = new LanguageApi(this.http);
    this.paymentLinks = new PaymentLinksApi(this.http);
    this.paymentRoutes = new PaymentRoutesApi(this.http);
    this.sell = new SellApi(this.http);
    this.settings = new SettingsApi(this.http);
    this.support = new SupportApi(this.http);
    this.swap = new SwapApi(this.http);
    this.transaction = new TransactionApi(this.http);
    this.user = new UserApi(this.http);
  }

  setToken(token: string | undefined): void {
    this.http.setToken(token);
  }

  getToken(): string | undefined {
    return this.http.getToken();
  }

  getApiUrl(): string {
    return this.http.getApiUrl();
  }

  getBaseUrl(): string {
    return this.http.getBaseUrl();
  }
}
