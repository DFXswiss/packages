import { Country } from './country';
import { Language } from './language';

export const KycUrl = {
  setData: 'kyc/data',
  base: `${process.env.REACT_APP_API_URL}/v2/kyc`,
  tfa: `${process.env.REACT_APP_API_URL}/v2/kyc/2fa`,
  limit: `${process.env.REACT_APP_API_URL}/v2/kyc/limit`,
};
export const KycLevel = {
  Link: 10,
  Sell: 20,
  Completed: 50,
};

export enum AccountType {
  PERSONAL = 'Personal',
  BUSINESS = 'Business',
  SOLE_PROPRIETORSHIP = 'SoleProprietorship',
}

// --- LEGACY --- //

export enum KycStatus {
  NA = 'NA',
  CHATBOT = 'Chatbot',
  ONLINE_ID = 'OnlineId',
  VIDEO_ID = 'VideoId',
  CHECK = 'Check',
  COMPLETED = 'Completed',
  REJECTED = 'Rejected',
}

export enum KycState {
  NA = 'NA',
  FAILED = 'Failed',
  REMINDED = 'Reminded',
  REVIEW = 'Review',
}

export interface KycData {
  accountType: AccountType;
  firstname: string;
  surname: string;
  street: string;
  houseNumber: string;
  zip: string;
  location: string;
  country: Country;

  mail: string;
  phone: string;

  organizationName: string;
  organizationStreet: string;
  organizationHouseNumber: string;
  organizationLocation: string;
  organizationZip: string;
  organizationCountry: Country;
}

// --- NEW --- //

// info
export enum LimitPeriod {
  DAY = 'Day',
  YEAR = 'Year',
}

export interface TradingLimit {
  limit: number;
  period: LimitPeriod;
}

export interface KycInfo {
  kycLevel: number;
  tradingLimit: TradingLimit;
  twoFactorEnabled: boolean;
  language: Language;
  kycSteps: KycStep[];
}

export interface KycSession extends KycInfo {
  currentStep?: KycStepSession;
}

// steps
export enum KycStepName {
  CONTACT_DATA = 'ContactData',
  PERSONAL_DATA = 'PersonalData',
  IDENT = 'Ident',
  FINANCIAL_DATA = 'FinancialData',
  DOCUMENT_UPLOAD = 'DocumentUpload',
}

export enum KycStepType {
  // ident
  AUTO = 'Auto',
  VIDEO = 'Video',
  MANUAL = 'Manual',
}

export enum KycStepStatus {
  NOT_STARTED = 'NotStarted',
  IN_PROGRESS = 'InProgress',
  IN_REVIEW = 'InReview',
  FAILED = 'Failed',
  COMPLETED = 'Completed',
  OUTDATED = 'Outdated',
}

export enum UrlType {
  BROWSER = 'Browser',
  API = 'API',
}

export interface KycSessionInfo {
  url: string;
  type: UrlType;
}

export interface KycStepBase {
  name: KycStepName;
  type?: KycStepType;
  status: KycStepStatus;
  sequenceNumber: number;
}

export interface KycStep extends KycStepBase {
  isCurrent: boolean;
}

export interface KycStepSession extends KycStepBase {
  session?: KycSessionInfo;
}

export interface KycResult {
  status: KycStepStatus;
}

// personal data
export interface KycContactData {
  mail: string;
}

export interface KycAddress {
  street: string;
  houseNumber?: string;
  city: string;
  zip: string;
  country: Country;
}

export interface KycPersonalData {
  accountType: AccountType;
  firstName: string;
  lastName: string;
  phone: string;
  address: KycAddress;
  organizationName?: string;
  organizationAddress?: KycAddress;
}

// financial data
export enum QuestionType {
  CONFIRMATION = 'Confirmation',
  SINGLE_CHOICE = 'SingleChoice',
  MULTIPLE_CHOICE = 'MultipleChoice',
  TEXT = 'Text',
}

export interface KycFinancialResponse {
  key: string;
  value: string;
}

export interface KycFinancialResponses {
  responses: KycFinancialResponse[];
}

export interface KycFinancialOption {
  key: string;
  text: string;
}

export interface KycFinancialQuestion {
  key: string;
  type: QuestionType;
  title: string;
  description: string;
  options?: KycFinancialOption[];
}

export interface KycFinancialQuestions extends KycFinancialResponses {
  questions: KycFinancialQuestion[];
}

// 2FA
export interface TfaSetup {
  secret: string;
  uri: string;
}

// limit
export enum Limit {
  K_500 = 500000,
  M_1 = 1000000,
  M_5 = 5000000,
  M_10 = 10000000,
  M_15 = 15000000,
  INFINITY = 1000000000,
}

export enum InvestmentDate {
  NOW = 'Now',
  FUTURE = 'Future',
}

export enum FundOrigin {
  SAVINGS = 'Savings',
  BUSINESS_PROFITS = 'BusinessProfits',
  STOCK_GAINS = 'StockGains',
  CRYPTO_GAINS = 'CryptoGains',
  INHERITANCE = 'Inheritance',
  OTHER = 'Other',
}

export interface LimitRequest {
  limit: Limit;
  investmentDate: InvestmentDate;
  fundOrigin: FundOrigin;
  fundOriginText?: string;
  documentProof?: string;
  documentProofName?: string;
}

// helpers
export function isStepDone(result: KycResult): boolean {
  return [KycStepStatus.IN_REVIEW, KycStepStatus.COMPLETED].includes(result.status);
}
