import { Country } from './country';
import { Language } from './language';

export const KycUrl = {
  setName: 'user/name',
  setData: 'user/data',
  file: 'kyc/file',
  base: `${process.env.REACT_APP_API_URL}/v2/kyc`,
  tfa: `${process.env.REACT_APP_API_URL}/v2/kyc/2fa`,
  checkTfa: 'kyc/2fa',
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
  ORGANIZATION = 'Organization',
  SOLE_PROPRIETORSHIP = 'SoleProprietorship',
}

export enum LegalEntity {
  AG = 'AG',
  GMBH = 'GmbH',
  UG = 'UG',
  GBR = 'GbR',
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
  MONTH = 'Month',
  YEAR = 'Year',
}

export interface TradingLimit {
  limit: number;
  period: LimitPeriod;
}

export interface KycInfo {
  kycLevel: number;
  tradingLimit: TradingLimit;
  language: Language;
  kycSteps: KycStep[];
  kycClients: string[];
}

export interface KycSession extends KycInfo {
  currentStep?: KycStepSession;
}

// steps
export enum KycStepName {
  // standard KYC
  CONTACT_DATA = 'ContactData',
  PERSONAL_DATA = 'PersonalData',
  LEGAL_ENTITY = 'LegalEntity',
  OWNER_DIRECTORY = 'OwnerDirectory',
  NATIONALITY_DATA = 'NationalityData',
  COMMERCIAL_REGISTER = 'CommercialRegister',
  SIGNATORY_POWER = 'SignatoryPower',
  AUTHORITY = 'Authority',
  BENEFICIAL_OWNER = 'BeneficialOwner',
  OPERATIONAL_ACTIVITY = 'OperationalActivity',
  IDENT = 'Ident',
  FINANCIAL_DATA = 'FinancialData',
  ADDITIONAL_DOCUMENTS = 'AdditionalDocuments',
  RESIDENCE_PERMIT = 'ResidencePermit',
  STATUTES = 'Statutes',
  DFX_APPROVAL = 'DfxApproval',

  // additional features
  PAYMENT_AGREEMENT = 'PaymentAgreement',
}

export enum KycStepType {
  // ident
  AUTO = 'Auto',
  VIDEO = 'Video',
  MANUAL = 'Manual',
  SUMSUB_AUTO = 'SumsubAuto',
  SUMSUB_VIDEO = 'SumsubVideo',
}

export enum KycStepStatus {
  NOT_STARTED = 'NotStarted',
  IN_PROGRESS = 'InProgress',
  IN_REVIEW = 'InReview',
  FAILED = 'Failed',
  COMPLETED = 'Completed',
  OUTDATED = 'Outdated',
  DATA_REQUESTED = 'DataRequested',
  ON_HOLD = 'OnHold',
}

export enum UrlType {
  BROWSER = 'Browser',
  API = 'API',
  TOKEN = 'Token',
  NONE = 'None',
}

export enum KycStepReason {
  ACCOUNT_EXISTS = 'AccountExists',
  ACCOUNT_MERGE_REQUESTED = 'AccountMergeRequested',
}

export enum FileType {
  NAME_CHECK = 'NameCheck',
  USER_INFORMATION = 'UserInformation',
  IDENTIFICATION = 'Identification',
  USER_NOTES = 'UserNotes',
  TRANSACTION_NOTES = 'TransactionNotes',
  STOCK_REGISTER = 'StockRegister',
  COMMERCIAL_REGISTER = 'CommercialRegister',
  RESIDENCE_PERMIT = 'ResidencePermit',
  ADDITIONAL_DOCUMENTS = 'AdditionalDocuments',
  AUTHORITY = 'Authority',
}

export interface KycAdditionalInfo {
  accountHolder?: string;
}

export interface KycSessionInfo {
  url: string;
  type: UrlType;
  additionalInfo?: KycAdditionalInfo;
}

export interface KycStepBase {
  name: KycStepName;
  type?: KycStepType;
  status: KycStepStatus;
  reason?: KycStepReason;
  sequenceNumber: number;
}

export interface KycStep extends KycStepBase {
  isCurrent: boolean;
}

export interface KycStepSession extends KycStepBase {
  session?: KycSessionInfo;
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

export interface KycLegalEntityData extends KycFileData {
  legalEntity: LegalEntity;
}

export enum DocumentType {
  IDCARD = 'IDCARD',
  PASSPORT = 'PASSPORT',
  DRIVERS_LICENSE = 'DRIVERS_LICENSE',
  RESIDENCE_PERMIT = 'RESIDENCE_PERMIT',
}

export enum GenderType {
  MALE = 'Male',
  FEMALE = 'Female',
}

export interface KycManualIdentData {
  firstName: string;
  lastName: string;
  birthName?: string;
  birthday: Date;
  nationality: Country;
  birthplace?: string;
  gender?: GenderType;
  documentType: DocumentType;
  documentNumber: string;
  document: KycFileData;
}

export interface KycSignatoryPowerData {
  signatoryPower: SignatoryPower;
}

export interface KycBeneficialData {
  hasBeneficialOwners: boolean;
  isAccountHolderInvolved: boolean;
  managingDirector?: ContactPersonData;
  beneficialOwners?: ContactPersonData[];
}

export interface ContactPersonData extends KycAddress {
  firstName: string;
  lastName: string;
}

export interface KycOperationalData {
  isOperational: boolean;
  websiteUrl?: string;
}

export interface KycFileData {
  file: string;
  fileName?: string;
}

export interface KycFile {
  uid: string;
  name: string;
  type: FileType;
  contentType: string;
  content: any;
}

export enum GoodsType {
  TANGIBLE = 'Tangible',
  VIRTUAL = 'Virtual',
}

export enum GoodsCategory {
  ELECTRONICS_COMPUTERS = 'ElectronicsComputers',
  BOOKS_MUSIC_MOVIES = 'BooksMusicMovies',
  HOME_GARDEN_TOOLS = 'HomeGardenTools',
  CLOTHES_SHOES_BAGS = 'ClothesShoesBags',
  TOYS_KIDS_BABY = 'ToysKidsBaby',
  AUTOMOTIVE_ACCESSORIES = 'AutomotiveAccessories',
  GAME_RECHARGE = 'GameRecharge',
  ENTERTAINMENT_COLLECTION = 'EntertainmentCollection',
  JEWELRY = 'Jewelry',
  DOMESTIC_SERVICE = 'DomesticService',
  BEAUTY_CARE = 'BeautyCare',
  PHARMACY = 'Pharmacy',
  SPORTS_OUTDOORS = 'SportsOutdoors',
  FOOD_GROCERY_HEALTH_PRODUCTS = 'FoodGroceryHealthProducts',
  PET_SUPPLIES = 'PetSupplies',
  INDUSTRY_SCIENCE = 'IndustryScience',
  OTHERS = 'Others',
}

export enum StoreType {
  ONLINE = 'Online',
  PHYSICAL = 'Physical',
  ONLINE_AND_PHYSICAL = 'OnlineAndPhysical',
}

export enum MerchantCategory {
  ACCOMMODATION_AND_FOOD_SERVICES = 'AccommodationAndFoodServices',
  ADMINISTRATIVE_SUPPORT_WASTE_MANAGEMENT = 'AdministrativeSupportWasteManagement',
  AGRICULTURE_FORESTRY_FISHING_HUNTING = 'AgricultureForestryFishingHunting',
  ARTS_ENTERTAINMENT_RECREATION = 'ArtsEntertainmentRecreation',
  CONSTRUCTION = 'Construction',
  BROKER = 'Broker',
  CRYPTO_ATM = 'CryptoATM',
  CRYPTO_MINING = 'CryptoMining',
  PROPRIETARY_CRYPTO_TRADERS = 'ProprietaryCryptoTraders',
  ALGORITHM_CRYPTO_TRADERS = 'AlgorithmCryptoTraders',
  P2P_MERCHANTS = 'P2PMerchants',
  OTHER_DIGITAL_ASSET_SERVICES_PROVIDER = 'OtherDigitalAssetServicesProvider',
  BANK = 'Bank',
  NON_BANK_FINANCIAL_INSTITUTION = 'NonBankFinancialInstitution',
  MONEY_SERVICES_BUSINESS_PAYMENT_SERVICE_PROVIDERS = 'MoneyServicesBusinessPaymentServiceProviders',
  FAMILY_OFFICE = 'FamilyOffice',
  PERSONAL_INVESTMENT_COMPANIES = 'PersonalInvestmentCompanies',
  SUPERANNUATION_FUND = 'SuperannuationFund',
  SOVEREIGN_WEALTH_FUND = 'SovereignWealthFund',
  INVESTMENT_FUNDS = 'InvestmentFunds',
  EDUCATIONAL_SERVICES = 'EducationalServices',
  BETTING = 'Betting',
  HEALTH_CARE_SOCIAL_ASSISTANCE = 'HealthCareSocialAssistance',
  INFORMATION = 'Information',
  GENERAL_WHOLESALERS = 'GeneralWholesalers',
  MANAGEMENT_OF_COMPANIES_ENTERPRISES = 'ManagementOfCompaniesEnterprises',
  PRECIOUS_STONES_PRECIOUS_METALS_DEALERS = 'PreciousStonesPreciousMetalsDealers',
  CRUDE_OIL_NATURAL_GAS_DEALERS = 'CrudeOilNaturalGasDealers',
  GENERAL_MANUFACTURING = 'GeneralManufacturing',
  MARIJUANA = 'Marijuana',
  MINING_EXTRACTION = 'MiningExtraction',
  PAWN_SHOPS = 'PawnShops',
  PROFESSIONAL_SERVICES = 'ProfessionalServices',
  SCIENTIFIC_TECHNICAL_SERVICES = 'ScientificTechnicalServices',
  PUBLIC_ADMINISTRATION = 'PublicAdministration',
  REAL_ESTATE_RENTAL_LEASING = 'RealEstateRentalLeasing',
  RETAIL_STORES_ELECTRONICS = 'RetailStoresElectronics',
  RETAIL_STORES_FB = 'RetailStoresFB',
  RETAIL_STORES_JEWELRY = 'RetailStoresJewelry',
  RETAIL_TRADE_OTHERS = 'RetailTradeOthers',
  SALE_OF_DRUGS_PHARMACEUTICAL_PRODUCTS = 'SaleOfDrugsPharmaceuticalProducts',
  TOBACCO = 'Tobacco',
  TRANSPORTATION_WAREHOUSING = 'TransportationWarehousing',
  UTILITIES = 'Utilities',
  OTHER_CRYPTO_WEB3_SERVICES = 'OtherCryptoWeb3Services',
  OTHER = 'Other',
}

export interface PaymentData {
  purpose: string;
  website?: string;
  registrationNumber: string;
  storeType: StoreType;
  merchantCategory: MerchantCategory;
  goodsType: GoodsType;
  goodsCategory: GoodsCategory;
  contractAccepted: boolean;
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
  conditions?: {
    question: string;
    response: string;
  }[];
}

export interface KycFinancialQuestions extends KycFinancialResponses {
  questions: KycFinancialQuestion[];
}

// 2FA
export enum TfaType {
  APP = 'App',
  MAIL = 'Mail',
}

export enum TfaLevel {
  BASIC = 'Basic',
  STRICT = 'Strict',
}

export interface TfaSetup {
  type: TfaType;
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
export function isStepDone(result: KycStepBase): boolean {
  return [KycStepStatus.IN_REVIEW, KycStepStatus.ON_HOLD, KycStepStatus.COMPLETED].includes(result.status);
}
