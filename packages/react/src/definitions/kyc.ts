import { Country } from './country';
import { Language } from './language';

export const KycUrl = {
  setName: 'user/name',
  setData: 'user/data',
  base: `${process.env.REACT_APP_API_URL}/v2/kyc`,
  tfa: `${process.env.REACT_APP_API_URL}/v2/kyc/2fa`,
  limit: `${process.env.REACT_APP_API_URL}/v2/kyc/limit`,
  transfer: (client: string) => `${process.env.REACT_APP_API_URL}/v2/kyc/transfer?client=${encodeURIComponent(client)}`,
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

export enum LegalEntity {
  PUBLIC_LIMITED_COMPANY = 'PublicLimitedCompany',
  LIMITED_LIABILITY_COMPANY = 'LimitedLiabilityCompany',
  ASSOCIATION = 'Association',
  FOUNDATION = 'Foundation',
  LIFE_INSURANCE = 'LifeInsurance',
  TRUST = 'Trust',
  OTHER = 'Other',
}

export enum SignatoryPower {
  SINGLE = 'Single',
  DOUBLE = 'Double',
  NONE = 'None',
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

export interface UserName {
  firstName: string;
  lastName: string;
}

export type UserData = KycContactData & KycPersonalData;

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
  kycClients: string[];
}

export interface KycSession extends KycInfo {
  currentStep?: KycStepSession;
}

// steps
export enum KycStepName {
  CONTACT_DATA = 'ContactData',
  PERSONAL_DATA = 'PersonalData',
  LEGAL_ENTITY = 'LegalEntity',
  STOCK_REGISTER = 'StockRegister',
  NATIONALITY_DATA = 'NationalityData',
  COMMERCIAL_REGISTER = 'CommercialRegister',
  SIGNATORY_POWER = 'SignatoryPower',
  AUTHORITY = 'Authority',
  IDENT = 'Ident',
  FINANCIAL_DATA = 'FinancialData',
  ADDITIONAL_DOCUMENTS = 'AdditionalDocuments',
  RESIDENCE_PERMIT = 'ResidencePermit',
  DFX_APPROVAL = 'DfxApproval',
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

export interface KycNationalityData {
  country: Country;
}

export interface KycLegalEntityData {
  legalEntity: LegalEntity;
}

export interface KycSignatoryPowerData {
  signatoryPower: SignatoryPower;
}

export interface KycFileData {
  file: string;
  fileName?: string;
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
