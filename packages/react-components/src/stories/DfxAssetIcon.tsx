import { createContext, ReactElement, useContext } from 'react';

interface DfxAssetIconProps {
  size?: AssetIconSize;
  asset: AssetIconVariant;
  disabled?: boolean;
}

export enum AssetIconVariant {
  USDT = 'USDT',
  BNB = 'BNB',
  DFI = 'DFI',
  USDC = 'USDC',
  USDCe = 'USDC.e',
  USDbC = 'USDbC',
  BUSD = 'BUSD',
  ETH = 'ETH',
  DAI = 'DAI',
  BTC = 'BTC',
  WBTC = 'WBTC',
  BTCB = 'BTCB',
  kBTC = 'kBTC',
  cBTC = 'cBTC',
  MATIC = 'MATIC',
  POL = 'POL',
  GMX = 'GMX',
  CHZ = 'CHZ',
  RPL = 'RPL',
  ARB = 'ARB',
  SUSHI = 'SUSHI',
  INCH = '1INCH',
  TUSD = 'TUSD',
  SNX = 'SNX',
  MKR = 'MKR',
  ENJ = 'ENJ',
  COMP = 'COMP',
  BAT = 'BAT',
  CRV = 'CRV',
  AXS = 'AXS',
  GRT = 'GRT',
  AAVE = 'AAVE',
  MANA = 'MANA',
  SAND = 'SAND',
  APE = 'APE',
  LINK = 'LINK',
  UNI = 'UNI',
  QNT = 'QNT',
  XCHF = 'XCHF',
  FOX = 'FOX',
  BGB = 'BGB',
  XMR = 'XMR',
  ZCHF = 'ZCHF',
  FPS = 'FPS',
  WFPS = 'WFPS',
  YLD = 'YLD',
  ISLM = 'ISLM',
  MKX = 'MKX',
  TGT = 'TGT',
  EURS = 'EURS',
  EURT = 'EURt',
  EDLC = 'EDLC',
  dEURO = 'dEURO',
  DEPS = 'DEPS',
  nDEPS = 'nDEPS',
  dEURO_PRESALE = 'dEUROPresale',
  DEPS_PRESALE = 'DEPSPresale',
  SOL = 'SOL',
  xDAI = 'xDAI',
  TRX = 'TRX',
  ZANO = 'ZANO',
  FUSD = 'fUSD',

  EUR = 'EUR',
  USD = 'USD',
  CHF = 'CHF',
  GBP = 'GBP',
}

export enum AssetIconSize {
  SM = 'SMALL',
  MD = 'MEDIUM',
  LG = 'LARGE',
}

export const SizeContext = createContext(AssetIconSize.MD);

const SIZE_MAPS: Record<AssetIconSize, string> = {
  [AssetIconSize.SM]: '16px',
  [AssetIconSize.MD]: '24px',
  [AssetIconSize.LG]: '32px',
};

const VARIANT_MAPS: Record<AssetIconVariant, (props: BaseAssetIconProps) => ReactElement> = {
  [AssetIconVariant.USDT]: ({ forceColor }) => <DfxAssetIconUSDT forceColor={forceColor} />,
  [AssetIconVariant.BNB]: ({ forceColor }) => <DfxAssetIconBNB forceColor={forceColor} />,
  [AssetIconVariant.DFI]: ({ forceColor }) => <DfxAssetIconDFI forceColor={forceColor} />,
  [AssetIconVariant.USDC]: ({ forceColor }) => <DfxAssetIconUSDC forceColor={forceColor} />,
  [AssetIconVariant.USDCe]: ({ forceColor }) => <DfxAssetIconUSDC forceColor={forceColor} />,
  [AssetIconVariant.USDbC]: ({ forceColor }) => <DfxAssetIconUSDC forceColor={forceColor} />,
  [AssetIconVariant.BUSD]: ({ forceColor }) => <DfxAssetIconBUSD forceColor={forceColor} />,
  [AssetIconVariant.ETH]: ({ forceColor }) => <DfxAssetIconETH forceColor={forceColor} />,
  [AssetIconVariant.DAI]: ({ forceColor }) => <DfxAssetIconDAI forceColor={forceColor} />,
  [AssetIconVariant.BTC]: ({ forceColor }) => <DfxAssetIconBTC forceColor={forceColor} />,
  [AssetIconVariant.WBTC]: ({ forceColor }) => <DfxAssetIconWBTC forceColor={forceColor} />,
  [AssetIconVariant.BTCB]: ({ forceColor }) => <DfxAssetIconBTCB forceColor={forceColor} />,
  [AssetIconVariant.kBTC]: ({ forceColor }) => <DfxAssetIconKBTC forceColor={forceColor} />,
  [AssetIconVariant.cBTC]: ({ forceColor }) => <DfxAssetIconBTC forceColor={forceColor} />,
  [AssetIconVariant.MATIC]: ({ forceColor }) => <DfxAssetIconPOL forceColor={forceColor} />,
  [AssetIconVariant.POL]: ({ forceColor }) => <DfxAssetIconPOL forceColor={forceColor} />,
  [AssetIconVariant.GMX]: ({ forceColor }) => <DfxAssetIconGMX forceColor={forceColor} />,
  [AssetIconVariant.CHZ]: ({ forceColor }) => <DfxAssetIconCHZ forceColor={forceColor} />,
  [AssetIconVariant.RPL]: ({ forceColor }) => <DfxAssetIconRPL forceColor={forceColor} />,
  [AssetIconVariant.ARB]: ({ forceColor }) => <DfxAssetIconARB forceColor={forceColor} />,
  [AssetIconVariant.SUSHI]: ({ forceColor }) => <DfxAssetIconSUSHI forceColor={forceColor} />,
  [AssetIconVariant.INCH]: ({ forceColor }) => <DfxAssetIconINCH forceColor={forceColor} />,
  [AssetIconVariant.TUSD]: ({ forceColor }) => <DfxAssetIconTUSD forceColor={forceColor} />,
  [AssetIconVariant.SNX]: ({ forceColor }) => <DfxAssetIconSNX forceColor={forceColor} />,
  [AssetIconVariant.MKR]: ({ forceColor }) => <DfxAssetIconMKR forceColor={forceColor} />,
  [AssetIconVariant.ENJ]: ({ forceColor }) => <DfxAssetIconENJ forceColor={forceColor} />,
  [AssetIconVariant.COMP]: ({ forceColor }) => <DfxAssetIconCOMP forceColor={forceColor} />,
  [AssetIconVariant.BAT]: ({ forceColor }) => <DfxAssetIconBAT forceColor={forceColor} />,
  [AssetIconVariant.CRV]: ({ forceColor }) => <DfxAssetIconCRV forceColor={forceColor} />,
  [AssetIconVariant.AXS]: ({ forceColor }) => <DfxAssetIconAXS forceColor={forceColor} />,
  [AssetIconVariant.GRT]: ({ forceColor }) => <DfxAssetIconGRT forceColor={forceColor} />,
  [AssetIconVariant.AAVE]: ({ forceColor }) => <DfxAssetIconAAVE forceColor={forceColor} />,
  [AssetIconVariant.MANA]: ({ forceColor }) => <DfxAssetIconMANA forceColor={forceColor} />,
  [AssetIconVariant.SAND]: ({ forceColor }) => <DfxAssetIconSAND forceColor={forceColor} />,
  [AssetIconVariant.APE]: ({ forceColor }) => <DfxAssetIconAPE forceColor={forceColor} />,
  [AssetIconVariant.LINK]: ({ forceColor }) => <DfxAssetIconLINK forceColor={forceColor} />,
  [AssetIconVariant.UNI]: ({ forceColor }) => <DfxAssetIconUNI forceColor={forceColor} />,
  [AssetIconVariant.QNT]: ({ forceColor }) => <DfxAssetIconQNT forceColor={forceColor} />,
  [AssetIconVariant.XCHF]: ({ forceColor }) => <DfxAssetIconXCHF forceColor={forceColor} />,
  [AssetIconVariant.FOX]: ({ forceColor }) => <DfxAssetIconFOX forceColor={forceColor} />,
  [AssetIconVariant.BGB]: ({ forceColor }) => <DfxAssetIconBGB forceColor={forceColor} />,
  [AssetIconVariant.XMR]: ({ forceColor }) => <DfxAssetIconXMR forceColor={forceColor} />,
  [AssetIconVariant.ZCHF]: ({ forceColor }) => <DfxAssetIconZCHF forceColor={forceColor} />,
  [AssetIconVariant.FPS]: ({ forceColor }) => <DfxAssetIconFPS forceColor={forceColor} />,
  [AssetIconVariant.WFPS]: ({ forceColor }) => <DfxAssetIconFPS forceColor={forceColor} />,
  [AssetIconVariant.YLD]: ({ forceColor }) => <DfxAssetIconYLD forceColor={forceColor} />,
  [AssetIconVariant.ISLM]: ({ forceColor }) => <DfxAssetIconISLM forceColor={forceColor} />,
  [AssetIconVariant.MKX]: ({ forceColor }) => <DfxAssetIconMKX forceColor={forceColor} />,
  [AssetIconVariant.TGT]: ({ forceColor }) => <DfxAssetIconTGT forceColor={forceColor} />,
  [AssetIconVariant.EURS]: ({ forceColor }) => <DfxAssetIconEURS forceColor={forceColor} />,
  [AssetIconVariant.EURT]: ({ forceColor }) => <DfxAssetIconEURt forceColor={forceColor} />,
  [AssetIconVariant.EDLC]: ({ forceColor }) => <DfxAssetIconEDLC forceColor={forceColor} />,
  [AssetIconVariant.dEURO]: ({ forceColor }) => <DfxAssetIconDEURO forceColor={forceColor} />,
  [AssetIconVariant.DEPS]: ({ forceColor }) => <DfxAssetIconDEPS forceColor={forceColor} />,
  [AssetIconVariant.nDEPS]: ({ forceColor }) => <DfxAssetIconNDEPS forceColor={forceColor} />,
  [AssetIconVariant.dEURO_PRESALE]: ({ forceColor }) => <DfxAssetIconDEURO forceColor={forceColor} />,
  [AssetIconVariant.DEPS_PRESALE]: ({ forceColor }) => <DfxAssetIconDEPS forceColor={forceColor} />,
  [AssetIconVariant.SOL]: ({ forceColor }) => <DfxAssetIconSOL forceColor={forceColor} />,
  [AssetIconVariant.xDAI]: ({ forceColor }) => <DfxAssetIconXDAI forceColor={forceColor} />,
  [AssetIconVariant.TRX]: ({ forceColor }) => <DfxAssetIconTRX forceColor={forceColor} />,
  [AssetIconVariant.ZANO]: ({ forceColor }) => <DfxAssetIconZANO forceColor={forceColor} />,
  [AssetIconVariant.FUSD]: ({ forceColor }) => <DfxAssetIconFUSD forceColor={forceColor} />,

  [AssetIconVariant.EUR]: ({ forceColor }) => <DfxAssetIconEUR forceColor={forceColor} />,
  [AssetIconVariant.USD]: ({ forceColor }) => <DfxAssetIconUSD forceColor={forceColor} />,
  [AssetIconVariant.CHF]: ({ forceColor }) => <DfxAssetIconCHF forceColor={forceColor} />,
  [AssetIconVariant.GBP]: ({ forceColor }) => <DfxAssetIconGBP forceColor={forceColor} />,
};

export default function DfxAssetIcon({ size = AssetIconSize.MD, asset, disabled }: DfxAssetIconProps) {
  const icon = VARIANT_MAPS[asset];
  return (
    <SizeContext.Provider value={size}>
      {icon ? icon({ forceColor: disabled ? '#B8C4D8' : undefined }) : DfxAssetIconPlaceholder()}
    </SizeContext.Provider>
  );
}

interface BaseAssetIconProps {
  forceColor?: string;
}

function DfxAssetIconUSDT({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="16" r="16" fill={forceColor ?? '#50AF95'} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.9856 17.6759C17.8747 17.6843 17.3017 17.7185 16.0236 17.7185C15.007 17.7185 14.2852 17.688 14.032 17.6759C10.1033 17.5029 7.17092 16.8182 7.17092 15.9984C7.17092 15.1785 10.1033 14.4947 14.032 14.3189V16.994C14.2889 17.0125 15.0245 17.056 16.0411 17.056C17.261 17.056 17.8719 17.0051 17.9819 16.9949V14.3208C21.9022 14.4957 24.8282 15.1804 24.8282 15.9984C24.8282 16.8163 21.9032 17.5011 17.9819 17.675L17.9856 17.6759ZM17.9856 14.0441V11.6503H23.4567V8H8.56088V11.6503H14.0311V14.0432C9.58486 14.2477 6.2412 15.1295 6.2412 16.1862C6.2412 17.2429 9.58486 18.1238 14.0311 18.3292V26H17.9847V18.3264C22.4207 18.1219 25.7588 17.241 25.7588 16.1853C25.7588 15.1295 22.4235 14.2486 17.9847 14.0432L17.9856 14.0441Z"
        fill="white"
      />
    </svg>
  );
}

function DfxAssetIconUSDC({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_102_23)">
        <path
          d="M16 32C24.8667 32 32 24.8667 32 16C32 7.13328 24.8667 0 16 0C7.13328 0 0 7.13328 0 16C0 24.8667 7.13328 32 16 32Z"
          fill={forceColor ?? '#2775CA'}
        />
        <path
          d="M20.4 18.5333C20.4 16.2 19 15.4 16.2 15.0667C14.2 14.8 13.8 14.2667 13.8 13.3333C13.8 12.3998 14.4667 11.8 15.8 11.8C17 11.8 17.6667 12.2 18 13.2C18.0667 13.4 18.2667 13.5333 18.4667 13.5333H19.5333C19.8 13.5333 20 13.3333 20 13.0667V13C19.7333 11.5333 18.5333 10.4 17 10.2667V8.66672C17 8.4 16.8 8.2 16.4667 8.13328H15.4667C15.2 8.13328 15 8.33328 14.9333 8.66672V10.2C12.9333 10.4667 11.6667 11.8 11.6667 13.4667C11.6667 15.6667 13 16.5333 15.8 16.8667C17.6667 17.2 18.2667 17.6 18.2667 18.6667C18.2667 19.7334 17.3333 20.4667 16.0667 20.4667C14.3333 20.4667 13.7333 19.7333 13.5333 18.7333C13.4667 18.4667 13.2667 18.3333 13.0667 18.3333H11.9333C11.6667 18.3333 11.4667 18.5333 11.4667 18.8V18.8667C11.7333 20.5333 12.8 21.7333 15 22.0667V23.6667C15 23.9333 15.2 24.1333 15.5333 24.2H16.5333C16.8 24.2 17 24 17.0667 23.6667V22.0667C19.0667 21.7333 20.4 20.3333 20.4 18.5333Z"
          fill="white"
        />
        <path
          d="M12.6 25.5333C7.4 23.6667 4.73328 17.8667 6.66672 12.7333C7.66672 9.93328 9.86672 7.8 12.6 6.8C12.8667 6.66672 13 6.46672 13 6.13328V5.2C13 4.93328 12.8667 4.73328 12.6 4.66672C12.5333 4.66672 12.4 4.66672 12.3333 4.73328C6 6.73328 2.53328 13.4667 4.53328 19.8C5.73328 23.5333 8.6 26.4 12.3333 27.6C12.6 27.7333 12.8667 27.6 12.9333 27.3333C13 27.2667 13 27.2 13 27.0667V26.1333C13 25.9333 12.8 25.6667 12.6 25.5333ZM19.6667 4.73328C19.4 4.6 19.1333 4.73328 19.0667 5C19 5.06672 19 5.13328 19 5.26672V6.2C19 6.46672 19.2 6.73328 19.4 6.86672C24.6 8.73328 27.2667 14.5333 25.3333 19.6667C24.3333 22.4667 22.1333 24.6 19.4 25.6C19.1333 25.7333 19 25.9333 19 26.2667V27.2C19 27.4667 19.1333 27.6667 19.4 27.7333C19.4667 27.7333 19.6 27.7333 19.6667 27.6667C26 25.6667 29.4667 18.9333 27.4667 12.6C26.2667 8.8 23.3333 5.93328 19.6667 4.73328Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_102_23">
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function DfxAssetIconETH({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23.25 12C23.25 18.2132 18.2132 23.25 12 23.25C5.7868 23.25 0.75 18.2132 0.75 12C0.75 5.7868 5.7868 0.75 12 0.75C18.2132 0.75 23.25 5.7868 23.25 12Z"
        fill="white"
        stroke={forceColor ?? 'url(#paint0_linear_1817_5282)'}
        strokeWidth="1.5"
      />
      <path
        d="M11.9989 4.125L11.8933 4.48389V14.8981L11.9989 15.0035L16.8436 12.146L11.9989 4.125Z"
        fill={forceColor ?? '#424242'}
      />
      <path d="M11.9989 4.125L7.1543 12.146L11.9989 15.0035V4.125Z" fill={forceColor ?? '#424242'} />
      <path
        d="M11.9989 15.9185L11.9395 15.991V19.7008L11.9989 19.8746L16.8466 13.0625L11.9989 15.9185Z"
        fill={forceColor ?? '#FF0079'}
      />
      <path d="M11.9989 19.8746V15.9185L7.1543 13.0625L11.9989 19.8746Z" fill={forceColor ?? '#FF0079'} />
      <defs>
        <linearGradient id="paint0_linear_1817_5282" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#444243" />
          <stop offset="1" stopColor="#FD0078" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function DfxAssetIconDFI({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_297_30)">
        <path
          d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
          fill={forceColor ?? '#FF00AF'}
        />
        <path
          d="M18.217 23.454V8.546C21.427 9.504 23.772 12.483 23.772 16C23.772 19.517 21.426 22.496 18.217 23.454ZM15.994 6V14.428L14.725 13.158L14.563 9.991L15.887 6.006C15.0581 6.01602 14.2337 6.12957 13.433 6.344L12.793 8.27L10.977 7.36C10.2597 7.77551 9.59661 8.27834 9.003 8.857L12.366 10.542L12.464 12.47L10.537 12.371L8.85 9.01C8.27145 9.60333 7.76862 10.266 7.353 10.983L8.264 12.799L6.337 13.439C6.12326 14.2395 6.01005 15.0635 6 15.892L9.986 14.568L13.154 14.73L14.424 16L13.154 17.27L9.986 17.432L6 16.108C6.009 16.957 6.13 17.777 6.338 18.562L8.265 19.202L7.354 21.018C7.772 21.737 8.274 22.401 8.851 22.991L10.537 19.629L12.464 19.53L12.366 21.458L9.003 23.143C9.59662 23.7219 10.2597 24.2251 10.977 24.641L12.792 23.73L13.432 25.656C14.233 25.8706 15.0578 25.9842 15.887 25.994L14.563 22.009L14.725 18.841L15.995 17.571V26C21.517 26 25.995 21.523 25.995 16C25.995 10.477 21.517 6 15.995 6"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_297_30">
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function DfxAssetIconDAI({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_4_65)">
        <path
          d="M16 0C24.8374 0 32 7.16407 32 16C32 24.8374 24.8374 32 16 32C7.16407 32 0 24.8366 0 16C0 7.16407 7.16407 0 16 0Z"
          fill={forceColor ?? '#F5AC37'}
        />
        <path
          d="M16.5897 17.1297H22.6694C22.799 17.1297 22.8602 17.1297 22.8696 16.9598C22.9193 16.3413 22.9193 15.7192 22.8696 15.1C22.8696 14.9798 22.8098 14.9301 22.6795 14.9301H10.5798C10.43 14.9301 10.3897 14.9797 10.3897 15.1202V16.9C10.3897 17.1297 10.3897 17.1297 10.6295 17.1297H16.5897ZM22.1906 12.85C22.2079 12.8046 22.2079 12.7549 22.1906 12.7103C22.0891 12.4892 21.9689 12.2783 21.8292 12.0803C21.6189 11.7419 21.3713 11.4301 21.089 11.15C20.9558 10.9808 20.8017 10.8289 20.6289 10.7C19.7635 9.96346 18.7346 9.44217 17.6287 9.18009C17.0707 9.05481 16.5004 8.99505 15.9287 9.00009H10.5589C10.4091 9.00009 10.389 9.05985 10.389 9.19017V12.7398C10.389 12.8896 10.389 12.9299 10.5791 12.9299H22.1186C22.1186 12.9299 22.2187 12.9097 22.2389 12.85H22.1899H22.1906ZM22.1906 19.2098C22.0207 19.1911 21.8493 19.1911 21.6794 19.2098H10.5899C10.4401 19.2098 10.3897 19.2098 10.3897 19.41V22.8804C10.3897 23.0402 10.3897 23.0806 10.5899 23.0806H15.7098C15.9546 23.0993 16.1994 23.082 16.4392 23.0309C17.1823 22.9776 17.9131 22.8163 18.61 22.5506C18.8635 22.4628 19.1083 22.3483 19.3394 22.2108H19.4092C20.6095 21.5865 21.5844 20.6059 22.1993 19.402C22.1993 19.402 22.2691 19.2508 22.1906 19.2112V19.2098ZM8.38016 24.8798V24.8201V22.4901V21.7003V19.3502C8.38016 19.2199 8.38016 19.2004 8.22032 19.2004H6.05022C5.92998 19.2004 5.8803 19.2004 5.8803 19.0406V17.1405H8.20016C8.32976 17.1405 8.38016 17.1405 8.38016 16.9706V15.0906C8.38016 14.9704 8.38016 14.9409 8.22032 14.9409H6.05022C5.92998 14.9409 5.8803 14.9409 5.8803 14.781V13.0213C5.8803 12.9112 5.8803 12.8816 6.04014 12.8816H8.19008C8.33984 12.8816 8.38016 12.8816 8.38016 12.6916V7.30159C8.38016 7.14175 8.38016 7.10143 8.58033 7.10143H16.0799C16.6242 7.12303 17.165 7.18279 17.6999 7.28143C18.8023 7.48519 19.8614 7.87904 20.8298 8.44136C21.4721 8.81937 22.0632 9.27585 22.5895 9.80146C22.9855 10.2126 23.3426 10.6575 23.6594 11.1313C23.9741 11.6116 24.2354 12.1249 24.4406 12.6613C24.4658 12.801 24.5998 12.8953 24.7394 12.8716H26.5294C26.7591 12.8716 26.7591 12.8716 26.7691 13.0919V14.7321C26.7691 14.8919 26.7094 14.9322 26.5488 14.9322H25.1686C25.0289 14.9322 24.9886 14.9322 24.9987 15.1122C25.0534 15.7214 25.0534 16.3326 24.9987 16.9418C24.9987 17.1117 24.9986 17.1319 25.1895 17.1319H26.7684C26.8383 17.2219 26.7684 17.3119 26.7684 17.4026C26.7785 17.5185 26.7785 17.6359 26.7684 17.7518V18.9621C26.7684 19.132 26.7187 19.1824 26.5683 19.1824H24.6782C24.5465 19.1572 24.4183 19.2415 24.3881 19.3725C23.9381 20.5425 23.2181 21.5916 22.2878 22.4325C21.948 22.7385 21.5909 23.0265 21.2179 23.2922C20.8176 23.5226 20.428 23.7624 20.0176 23.9525C19.2624 24.2923 18.4703 24.5429 17.6575 24.702C16.8856 24.8402 16.103 24.9029 15.3174 24.8921H8.37728V24.882L8.38016 24.8798Z"
          fill="#FEFEFD"
        />
      </g>
      <defs>
        <clipPath id="clip0_4_65">
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function DfxAssetIconBUSD({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 0C24.8372 0 32 7.16282 32 16C32 24.8372 24.8372 32 16 32C7.16282 32 0 24.8372 0 16C0 7.16282 7.16282 0 16 0Z"
        fill={forceColor ?? '#F0B90B'}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.6845 7.78274L15.9673 5L9.125 11.9077L11.8423 14.625L18.6845 7.78274ZM22.8095 11.9077L20.0923 9.125L9.125 20.1577L11.8423 22.875L22.8095 11.9077ZM7.71726 13.25L10.4345 16.0327L7.71726 18.75L5 16.0327L7.71726 13.25ZM26.9345 16.0327L24.2173 13.25L13.25 24.2827L15.9673 27L26.9345 16.0327Z"
        fill="white"
      />
    </svg>
  );
}

function DfxAssetIconBTC({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="16" r="16" fill={forceColor ?? '#F99602'} />
      <path
        d="M19.5141 9.30328L20.3141 6.30338L18.5141 5.80339L17.8142 8.7033C17.3142 8.6033 16.8142 8.5033 16.3142 8.40331L17.0142 5.40341L15.1143 5.00342L14.4143 8.00332C14.0143 7.90332 13.6143 7.80333 13.2143 7.70333L10.7144 7.10335L10.2144 9.10328C10.2144 9.10328 11.6144 9.40327 11.5144 9.40327C12.2144 9.60327 12.4143 10.1033 12.4143 10.5032L10.3144 18.703C10.2144 18.903 10.0144 19.303 9.41444 19.103L8.11449 18.803L7.21452 20.9029L9.61444 21.5029L10.9144 21.8029L10.1144 24.8028L11.9144 25.3028L12.7143 22.3029C13.2143 22.4029 13.7143 22.6028 14.2143 22.7028L13.5143 25.7027L15.3143 26.2027L16.1142 23.2028C19.2141 23.8028 21.614 23.6028 22.614 20.7029C23.414 18.403 22.614 17.103 20.9141 16.303C22.114 16.0031 23.014 15.2031 23.214 13.6031C23.514 11.3032 21.914 10.1033 19.5141 9.30328ZM19.0141 19.4029C18.4142 21.7029 14.6143 20.4029 13.4143 20.1029L14.4143 16.1031C15.6142 16.403 19.6141 17.003 19.0141 19.4029ZM19.6141 13.5031C19.1141 15.6031 15.9142 14.5031 14.9143 14.3031L15.8142 10.6032C16.8142 10.8032 20.1141 11.3032 19.6141 13.5031Z"
        fill="white"
      />
    </svg>
  );
}

function DfxAssetIconBNB({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 0C24.8372 0 32 7.16282 32 16C32 24.8372 24.8372 32 16 32C7.16282 32 0 24.8372 0 16C0 7.16282 7.16282 0 16 0Z"
        fill={forceColor ?? '#F0B90B'}
      />
      <path
        d="M8.79359 16L8.80513 20.2308L12.4 22.3461V24.8231L6.70128 21.4808V14.7628L8.79359 16ZM8.79359 11.7692V14.2346L6.7 12.9961V10.5308L8.79359 9.2923L10.8974 10.5308L8.79359 11.7692ZM13.9013 10.5308L15.9949 9.2923L18.0987 10.5308L15.9949 11.7692L13.9013 10.5308Z"
        fill="white"
      />
      <path
        d="M10.3064 19.3538V16.8769L12.4 18.1154V20.5808L10.3064 19.3538ZM13.9013 23.2333L15.9949 24.4718L18.0987 23.2333V25.6987L15.9949 26.9372L13.9013 25.6987V23.2333ZM21.1013 10.5308L23.1949 9.2923L25.2987 10.5308V12.9961L23.1949 14.2346V11.7692L21.1013 10.5308ZM23.1949 20.2308L23.2064 16L25.3 14.7615V21.4795L19.6013 24.8218V22.3449L23.1949 20.2308Z"
        fill="white"
      />
      <path d="M21.6936 19.3538L19.6 20.5808V18.1154L21.6936 16.8769V19.3538Z" fill="white" />
      <path
        d="M21.6936 12.6461L21.7051 15.1231L18.1 17.2384V21.4795L16.0064 22.7064L13.9128 21.4795V17.2384L10.3077 15.1231V12.6461L12.4103 11.4077L15.9936 13.5333L19.5987 11.4077L21.7026 12.6461H21.6936ZM10.3064 8.41665L15.9949 5.06281L21.6936 8.41665L19.6 9.65511L15.9949 7.52947L12.4 9.65511L10.3064 8.41665Z"
        fill="white"
      />
    </svg>
  );
}

function DfxAssetIconPOL({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" fill={forceColor ?? '#8247E5'} />
      <path
        d="M15.9463 9.37611C15.6659 9.21588 15.3054 9.21588 14.9849 9.37611L12.7416 10.6981L11.2193 11.5393L9.01604 12.8613C8.73563 13.0215 8.3751 13.0215 8.05462 12.8613L6.33207 11.8197C6.05165 11.6595 5.85136 11.339 5.85136 10.9785V8.97552C5.85136 8.65504 6.01159 8.33457 6.33207 8.13427L8.05462 7.13279C8.33504 6.97255 8.69557 6.97255 9.01604 7.13279L10.7386 8.17433C11.019 8.33457 11.2193 8.65504 11.2193 9.01558V10.3375L12.7416 9.45623V8.09421C12.7416 7.77374 12.5813 7.45326 12.2609 7.25297L9.0561 5.37018C8.77569 5.20994 8.41515 5.20994 8.09468 5.37018L4.80981 7.29303C4.48934 7.45326 4.3291 7.77374 4.3291 8.09421V11.8598C4.3291 12.1803 4.48934 12.5007 4.80981 12.701L8.05462 14.5838C8.33504 14.7441 8.69557 14.7441 9.01604 14.5838L11.2193 13.3019L12.7416 12.4206L14.9448 11.1387C15.2252 10.9785 15.5858 10.9785 15.9063 11.1387L17.6288 12.1402C17.9092 12.3004 18.1095 12.6209 18.1095 12.9815V14.9844C18.1095 15.3049 17.9493 15.6254 17.6288 15.8257L15.9463 16.8272C15.6659 16.9874 15.3054 16.9874 14.9849 16.8272L13.2623 15.8257C12.9819 15.6654 12.7816 15.345 12.7816 14.9844V13.7025L11.2594 14.5838V15.9058C11.2594 16.2263 11.4196 16.5467 11.7401 16.747L14.9849 18.6298C15.2653 18.7901 15.6258 18.7901 15.9463 18.6298L19.1911 16.747C19.4715 16.5868 19.6718 16.2663 19.6718 15.9058V12.1001C19.6718 11.7797 19.5116 11.4592 19.1911 11.2589L15.9463 9.37611Z"
        fill="white"
      />
    </svg>
  );
}

function DfxAssetIconBTCB({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1817_1412)">
        <circle cx="12" cy="12" r="12" fill={forceColor ?? '#333333'} />
        <g clipPath="url(#clip1_1817_1412)">
          <path
            d="M7.9218 10.3242L12 6.246L16.0803 10.3263L18.4533 7.9533L12 1.5L5.5488 7.9512L7.9218 10.3242ZM1.5 12L3.873 9.627L6.246 12L3.873 14.373L1.5 12ZM7.9218 13.6758L12 17.754L16.0803 13.6737L18.4543 16.0456H18.4533L12 22.5L5.5488 16.0488L5.54565 16.0456L7.9218 13.6758ZM17.754 12.001L20.127 9.62805L22.5 12.001L20.127 14.374L17.754 12.001Z"
            fill={forceColor ? '#ffffff' : '#E7BB41'}
          />
          <path
            d="M14.4063 11.9985L11.9986 9.59082L10.2189 11.3706L10.0141 11.5753L9.59202 11.9974L9.58887 12.0006L9.59202 12.0037L11.9976 14.4093L14.4052 12.0016H14.4063L14.4042 11.9995"
            fill={forceColor ? '#ffffff' : '#E7BB41'}
          />
        </g>
        <mask
          id="mask0_1817_1412"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <circle cx="12" cy="12" r="12" fill={forceColor ?? '#333333'} />
        </mask>
        <g mask="url(#mask0_1817_1412)">
          <ellipse cx="17.25" cy="19.3496" rx="4.5" ry="4.5" fill={forceColor ? '#cccccc' : '#F99602'} />
          <path
            d="M18.2386 17.4662L18.4636 16.6224L17.9573 16.4818L17.7604 17.2974C17.6198 17.2693 17.4792 17.2412 17.3386 17.2131L17.5355 16.3693L17.0011 16.2568L16.8042 17.1006C16.6917 17.0724 16.5792 17.0443 16.4667 17.0162L15.7636 16.8474L15.623 17.4099C15.623 17.4099 16.0168 17.4943 15.9886 17.4943C16.1855 17.5505 16.2417 17.6912 16.2417 17.8037L15.6511 20.1098C15.623 20.1661 15.5668 20.2786 15.398 20.2223L15.0324 20.138L14.7793 20.7286L15.4543 20.8973L15.8199 20.9817L15.5949 21.8254L16.1011 21.966L16.3261 21.1223C16.4667 21.1504 16.6074 21.2067 16.748 21.2348L16.5511 22.0785L17.0573 22.2191L17.2823 21.3754C18.1542 21.5442 18.8292 21.4879 19.1104 20.6723C19.3354 20.0255 19.1104 19.6598 18.6323 19.4349C18.9698 19.3505 19.2229 19.1255 19.2792 18.6755C19.3635 18.0287 18.9135 17.6912 18.2386 17.4662ZM18.0979 20.3067C17.9292 20.9536 16.8605 20.5879 16.523 20.5036L16.8042 19.3786C17.1417 19.463 18.2667 19.6317 18.0979 20.3067ZM18.2667 18.6474C18.1261 19.238 17.2261 18.9286 16.9449 18.8724L17.198 17.8318C17.4792 17.888 18.4073 18.0287 18.2667 18.6474Z"
            fill="white"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_1817_1412">
          <rect width="24" height="24" fill="white" />
        </clipPath>
        <clipPath id="clip1_1817_1412">
          <rect width="21" height="21" fill="white" transform="translate(1.5 1.5)" />
        </clipPath>
      </defs>
    </svg>
  );
}

function DfxAssetIconKBTC({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="16" r="16" fill={forceColor ?? '#7132F5'} />
      <path
        d="M19.5141 9.30328L20.3141 6.30338L18.5141 5.80339L17.8142 8.7033C17.3142 8.6033 16.8142 8.5033 16.3142 8.40331L17.0142 5.40341L15.1143 5.00342L14.4143 8.00332C14.0143 7.90332 13.6143 7.80333 13.2143 7.70333L10.7144 7.10335L10.2144 9.10328C10.2144 9.10328 11.6144 9.40327 11.5144 9.40327C12.2144 9.60327 12.4143 10.1033 12.4143 10.5032L10.3144 18.703C10.2144 18.903 10.0144 19.303 9.41444 19.103L8.11449 18.803L7.21452 20.9029L9.61444 21.5029L10.9144 21.8029L10.1144 24.8028L11.9144 25.3028L12.7143 22.3029C13.2143 22.4029 13.7143 22.6028 14.2143 22.7028L13.5143 25.7027L15.3143 26.2027L16.1142 23.2028C19.2141 23.8028 21.614 23.6028 22.614 20.7029C23.414 18.403 22.614 17.103 20.9141 16.303C22.114 16.0031 23.014 15.2031 23.214 13.6031C23.514 11.3032 21.914 10.1033 19.5141 9.30328ZM19.0141 19.4029C18.4142 21.7029 14.6143 20.4029 13.4143 20.1029L14.4143 16.1031C15.6142 16.403 19.6141 17.003 19.0141 19.4029ZM19.6141 13.5031C19.1141 15.6031 15.9142 14.5031 14.9143 14.3031L15.8142 10.6032C16.8142 10.8032 20.1141 11.3032 19.6141 13.5031Z"
        fill="white"
      />
    </svg>
  );
}

function DfxAssetIconWBTC({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1759_11423)">
        <circle cx="12" cy="12" r="12" fill="white" />
        <path
          d="M19.5692 5.03784L18.9092 5.69784C22.1684 9.26184 22.1684 14.7242 18.9092 18.2882L19.5692 18.9482C23.1956 15.0146 23.1956 8.95704 19.5692 5.02344V5.03784Z"
          fill={forceColor ?? '#5A5564'}
        />
        <path
          d="M5.71249 5.09269C9.27649 1.83349 14.7389 1.83349 18.3029 5.09269L18.9629 4.43269C15.0293 0.806291 8.97169 0.806291 5.03809 4.43269L5.71249 5.09269Z"
          fill={forceColor ?? '#5A5564'}
        />
        <path
          d="M5.09269 18.293C1.83829 14.729 1.83829 9.2714 5.09269 5.7098L4.43269 5.0498C0.806291 8.9834 0.806291 15.041 4.43269 18.9746L5.09269 18.293Z"
          fill={forceColor ?? '#5A5564'}
        />
        <path
          d="M18.2924 18.9023C14.7284 22.1615 9.26599 22.1615 5.70199 18.9023L5.04199 19.5623C8.97559 23.1887 15.0332 23.1887 18.9668 19.5623L18.2924 18.9023Z"
          fill={forceColor ?? '#5A5564'}
        />
        <path
          d="M16.1592 9.80186C16.0272 8.42666 14.8416 7.96586 13.3416 7.82426V5.93066H12.1824V7.78826H11.256V5.93066H10.104V7.83626H7.75195V9.07706C7.75195 9.07706 8.60875 9.06266 8.59435 9.07706C8.91595 9.04106 9.20635 9.26666 9.25435 9.58586V14.8059C9.24715 14.9163 9.19675 15.0171 9.11275 15.0891C9.03115 15.1611 8.92315 15.1995 8.81515 15.1899C8.82955 15.2019 7.97275 15.1899 7.97275 15.1899L7.75195 16.5771H10.0824V18.5139H11.2416V16.6059H12.168V18.5067H13.3296V16.5915C15.288 16.4739 16.656 15.9891 16.8264 14.1555C16.9656 12.6795 16.2696 12.0195 15.1608 11.7555C15.8352 11.4243 16.2528 10.8099 16.1592 9.80186ZM14.5344 13.9275C14.5344 15.3675 12.0648 15.2043 11.28 15.2043V12.6483C12.0672 12.6483 14.5344 12.4251 14.5344 13.9299V13.9275ZM13.9968 10.3251C13.9968 11.6427 11.9352 11.4819 11.2824 11.4819V9.15866C11.9376 9.15866 13.9968 8.95226 13.9968 10.3251Z"
          fill={forceColor ?? '#F09242'}
        />
        <path
          d="M11.9976 24C5.3712 23.9976 0 18.6264 0 11.9976C0 5.3712 5.3736 0 12.0024 0C18.6288 0 24 5.3712 24 11.9976C24 18.624 18.6288 23.9976 12.0024 24H11.9976ZM11.9976 0.936C5.892 0.9408 0.9432 5.8944 0.948 12.0024C0.9528 18.1104 5.9064 23.0568 12.0144 23.052C18.1152 23.0472 23.0616 18.1008 23.064 11.9976C23.0664 5.8896 18.1176 0.9384 12.0096 0.936C12.0048 0.936 12 0.936 11.9976 0.936Z"
          fill={forceColor ?? '#282138'}
        />
      </g>
      <defs>
        <clipPath id="clip0_1759_11423">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function DfxAssetIconGMX({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 810 810"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="gmx_e">
          <path d="M0 109h810v592H0Zm0 0" />
        </clipPath>
        <clipPath id="gmx_f">
          <path d="M810 700.164 406.297 109.836 0 700.164h565.703l-159.406-225.18-79.703 118.258h-84.89l164.593-236.195 236.195 343.117Zm0 0" />
        </clipPath>
        <clipPath id="gmx_b">
          <path d="M0 0h810v811H0z" />
        </clipPath>
        <linearGradient
          id="gmx_d"
          x1={1343.3}
          x2={157.828}
          y1={-454.415}
          y2={2564.809}
          gradientTransform="matrix(.324 0 0 -.324 0 810.92)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} stopColor="#03D1CF" />
          <stop offset={0.125} stopColor="#03D1CF" />
          <stop offset={0.188} stopColor="#03D1CF" />
          <stop offset={0.219} stopColor="#03D1CF" />
          <stop offset={0.227} stopColor="#03D1CF" />
          <stop offset={0.23} stopColor="#03D0CF" />
          <stop offset={0.234} stopColor="#04CFCF" />
          <stop offset={0.238} stopColor="#04CED0" />
          <stop offset={0.242} stopColor="#05CDD0" />
          <stop offset={0.246} stopColor="#05CCD0" />
          <stop offset={0.25} stopColor="#06CAD0" />
          <stop offset={0.254} stopColor="#06C9D1" />
          <stop offset={0.258} stopColor="#06C8D1" />
          <stop offset={0.262} stopColor="#07C7D1" />
          <stop offset={0.266} stopColor="#07C6D1" />
          <stop offset={0.27} stopColor="#08C4D2" />
          <stop offset={0.273} stopColor="#08C3D2" />
          <stop offset={0.277} stopColor="#09C2D2" />
          <stop offset={0.281} stopColor="#09C1D2" />
          <stop offset={0.285} stopColor="#0AC0D3" />
          <stop offset={0.289} stopColor="#0ABED3" />
          <stop offset={0.293} stopColor="#0ABDD3" />
          <stop offset={0.297} stopColor="#0BBCD3" />
          <stop offset={0.301} stopColor="#0BBBD4" />
          <stop offset={0.305} stopColor="#0CBAD4" />
          <stop offset={0.309} stopColor="#0CB9D4" />
          <stop offset={0.313} stopColor="#0DB7D4" />
          <stop offset={0.316} stopColor="#0DB6D5" />
          <stop offset={0.32} stopColor="#0EB5D5" />
          <stop offset={0.324} stopColor="#0EB4D5" />
          <stop offset={0.328} stopColor="#0EB3D5" />
          <stop offset={0.332} stopColor="#0FB1D6" />
          <stop offset={0.336} stopColor="#0FB0D6" />
          <stop offset={0.34} stopColor="#10AFD6" />
          <stop offset={0.344} stopColor="#10AED6" />
          <stop offset={0.348} stopColor="#11ADD7" />
          <stop offset={0.352} stopColor="#11ABD7" />
          <stop offset={0.355} stopColor="#12AAD7" />
          <stop offset={0.359} stopColor="#12A9D7" />
          <stop offset={0.363} stopColor="#12A8D8" />
          <stop offset={0.367} stopColor="#13A7D8" />
          <stop offset={0.371} stopColor="#13A6D8" />
          <stop offset={0.375} stopColor="#14A4D8" />
          <stop offset={0.379} stopColor="#14A3D8" />
          <stop offset={0.383} stopColor="#15A2D9" />
          <stop offset={0.387} stopColor="#15A1D9" />
          <stop offset={0.391} stopColor="#16A0D9" />
          <stop offset={0.395} stopColor="#169ED9" />
          <stop offset={0.398} stopColor="#179DDA" />
          <stop offset={0.402} stopColor="#179CDA" />
          <stop offset={0.406} stopColor="#179BDA" />
          <stop offset={0.41} stopColor="#189ADA" />
          <stop offset={0.414} stopColor="#1898DB" />
          <stop offset={0.418} stopColor="#1997DB" />
          <stop offset={0.422} stopColor="#1996DB" />
          <stop offset={0.426} stopColor="#1A95DB" />
          <stop offset={0.43} stopColor="#1A94DC" />
          <stop offset={0.434} stopColor="#1B92DC" />
          <stop offset={0.438} stopColor="#1B91DC" />
          <stop offset={0.441} stopColor="#1B90DC" />
          <stop offset={0.445} stopColor="#1C8FDD" />
          <stop offset={0.449} stopColor="#1C8EDD" />
          <stop offset={0.453} stopColor="#1D8DDD" />
          <stop offset={0.457} stopColor="#1D8BDD" />
          <stop offset={0.461} stopColor="#1E8ADE" />
          <stop offset={0.465} stopColor="#1E89DE" />
          <stop offset={0.469} stopColor="#1F88DE" />
          <stop offset={0.473} stopColor="#1F87DE" />
          <stop offset={0.477} stopColor="#1F85DF" />
          <stop offset={0.48} stopColor="#2084DF" />
          <stop offset={0.484} stopColor="#2083DF" />
          <stop offset={0.488} stopColor="#2182DF" />
          <stop offset={0.492} stopColor="#2181E0" />
          <stop offset={0.496} stopColor="#227FE0" />
          <stop offset={0.5} stopColor="#227EE0" />
          <stop offset={0.504} stopColor="#237DE0" />
          <stop offset={0.508} stopColor="#237CE1" />
          <stop offset={0.512} stopColor="#237BE1" />
          <stop offset={0.516} stopColor="#2479E1" />
          <stop offset={0.52} stopColor="#2478E1" />
          <stop offset={0.523} stopColor="#2577E2" />
          <stop offset={0.527} stopColor="#2576E2" />
          <stop offset={0.531} stopColor="#2675E2" />
          <stop offset={0.535} stopColor="#2674E2" />
          <stop offset={0.539} stopColor="#2772E2" />
          <stop offset={0.543} stopColor="#2771E3" />
          <stop offset={0.547} stopColor="#2770E3" />
          <stop offset={0.551} stopColor="#286FE3" />
          <stop offset={0.555} stopColor="#286EE3" />
          <stop offset={0.559} stopColor="#296CE4" />
          <stop offset={0.563} stopColor="#296BE4" />
          <stop offset={0.566} stopColor="#2A6AE4" />
          <stop offset={0.57} stopColor="#2A69E4" />
          <stop offset={0.574} stopColor="#2B68E5" />
          <stop offset={0.578} stopColor="#2B66E5" />
          <stop offset={0.582} stopColor="#2B65E5" />
          <stop offset={0.586} stopColor="#2C64E5" />
          <stop offset={0.59} stopColor="#2C63E6" />
          <stop offset={0.594} stopColor="#2D62E6" />
          <stop offset={0.598} stopColor="#2D60E6" />
          <stop offset={0.602} stopColor="#2E5FE6" />
          <stop offset={0.605} stopColor="#2E5EE7" />
          <stop offset={0.609} stopColor="#2F5DE7" />
          <stop offset={0.613} stopColor="#2F5CE7" />
          <stop offset={0.617} stopColor="#2F5BE7" />
          <stop offset={0.621} stopColor="#3059E8" />
          <stop offset={0.625} stopColor="#3058E8" />
          <stop offset={0.629} stopColor="#3157E8" />
          <stop offset={0.633} stopColor="#3156E8" />
          <stop offset={0.637} stopColor="#3255E9" />
          <stop offset={0.641} stopColor="#3253E9" />
          <stop offset={0.645} stopColor="#3352E9" />
          <stop offset={0.648} stopColor="#3351E9" />
          <stop offset={0.652} stopColor="#3350EA" />
          <stop offset={0.656} stopColor="#344FEA" />
          <stop offset={0.66} stopColor="#344DEA" />
          <stop offset={0.664} stopColor="#354CEA" />
          <stop offset={0.668} stopColor="#354BEB" />
          <stop offset={0.672} stopColor="#364AEB" />
          <stop offset={0.676} stopColor="#3649EB" />
          <stop offset={0.68} stopColor="#3748EB" />
          <stop offset={0.684} stopColor="#3746EC" />
          <stop offset={0.688} stopColor="#3745EC" />
          <stop offset={0.691} stopColor="#3844EC" />
          <stop offset={0.695} stopColor="#3843EC" />
          <stop offset={0.699} stopColor="#3942EC" />
          <stop offset={0.703} stopColor="#3940ED" />
          <stop offset={0.707} stopColor="#3A3FED" />
          <stop offset={0.711} stopColor="#3A3EED" />
          <stop offset={0.715} stopColor="#3B3DED" />
          <stop offset={0.719} stopColor="#3B3CEE" />
          <stop offset={0.723} stopColor="#3B3AEE" />
          <stop offset={0.727} stopColor="#3C39EE" />
          <stop offset={0.73} stopColor="#3C38EE" />
          <stop offset={0.734} stopColor="#3D37EF" />
          <stop offset={0.738} stopColor="#3D36EF" />
          <stop offset={0.742} stopColor="#3E34EF" />
          <stop offset={0.746} stopColor="#3E33EF" />
          <stop offset={0.75} stopColor="#3F32F0" />
          <stop offset={0.754} stopColor="#3F31F0" />
          <stop offset={0.758} stopColor="#4030F0" />
          <stop offset={0.762} stopColor="#402FF0" />
          <stop offset={0.766} stopColor="#402DF1" />
          <stop offset={0.77} stopColor="#412CF1" />
          <stop offset={0.773} stopColor="#412BF1" />
          <stop offset={0.777} stopColor="#422AF1" />
          <stop offset={0.781} stopColor="#4229F2" />
          <stop offset={0.785} stopColor="#4327F2" />
          <stop offset={0.789} stopColor="#4326F2" />
          <stop offset={0.793} stopColor="#4425F2" />
          <stop offset={0.797} stopColor="#4424F3" />
          <stop offset={0.801} stopColor="#4423F3" />
          <stop offset={0.805} stopColor="#4521F3" />
          <stop offset={0.809} stopColor="#4520F3" />
          <stop offset={0.813} stopColor="#461FF4" />
          <stop offset={0.816} stopColor="#461EF4" />
          <stop offset={0.82} stopColor="#471DF4" />
          <stop offset={0.824} stopColor="#471BF4" />
          <stop offset={0.828} stopColor="#481AF5" />
          <stop offset={0.832} stopColor="#4819F5" />
          <stop offset={0.836} stopColor="#4818F5" />
          <stop offset={0.84} stopColor="#4917F5" />
          <stop offset={0.844} stopColor="#4916F6" />
          <stop offset={0.848} stopColor="#4A14F6" />
          <stop offset={0.852} stopColor="#4A13F6" />
          <stop offset={0.855} stopColor="#4B12F6" />
          <stop offset={0.859} stopColor="#4B11F7" />
          <stop offset={0.863} stopColor="#4C10F7" />
          <stop offset={0.867} stopColor="#4C0EF7" />
          <stop offset={0.871} stopColor="#4C0DF7" />
          <stop offset={0.875} stopColor="#4D0CF7" />
          <stop offset={0.879} stopColor="#4D0BF8" />
          <stop offset={0.883} stopColor="#4E0AF8" />
          <stop offset={0.891} stopColor="#4E09F8" />
          <stop offset={0.906} stopColor="#4E09F8" />
          <stop offset={0.938} stopColor="#4E09F8" />
          <stop offset={1} stopColor="#4E09F8" />
        </linearGradient>
        <pattern
          id="gmx_g"
          width={810}
          height={811}
          x={0}
          y={0}
          patternTransform="matrix(1 0 0 -1 0 810.92)"
          patternUnits="userSpaceOnUse"
          preserveAspectRatio="xMidYMid meet"
        >
          <g clipPath="url(#gmx_b)" mask="url(#gmx_c)">
            <path fill={forceColor ?? 'url(#gmx_d)'} d="M-178.2-177.28H988.2v1166.4H-178.2z" />
          </g>
        </pattern>
        <filter id="gmx_a" width="100%" height="100%" x="0%" y="0%">
          <feColorMatrix colorInterpolationFilters="sRGB" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
        </filter>
        <mask id="gmx_c">
          <g filter="url(#gmx_a)">
            <image
              xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyoAAAMrCAYAAACmlWZiAAAABmJLR0QA/wD/AP+gvaeTAAAaJElEQVR4nO3dOZIjxxJF0fw07n/L/AJZ3ahqDJGZMbh7nKPBoITgZnhXwv+O4/jnAID1/B4B8Mvfqx8AwPYECgB/ECoArCBOAHhLqAAwk0ABoIlQAWA0cQLAaUIFgFEECgCXCRUAehInAHQhVAC4S5wA0J1QAeAqgQLAMEIFgDPECQBTCBUAWggUAKYSKgC8Ik4AWEaoAPCTQAFgOaECwHGIEwCCESoAexMoAIQkVAD2I04ACE+oAOxDoACQhlABqE2cAJCSUAGoR5wAkJ5QAahDoABQhlAByE2cAFCSUAHISaAAUJpQAchDnACwDaECEJ9AAWA7QgUgJnECwNaECkAsAgUADqECEIE4AYAfhArAOgIFAF4QKgBziRMAaCBUAMYTJwBwklABGEegAMBFQgWgL3ECAB0IFYA+BAoAdCRUAK4TJwAwiFABOE+gAMBgQgWgjTgBgImECsB7AgUAFhAqAH8SJwCwmFAB+E2gAEAQQgXYnTgBgICECrAjcQIAwQkVYCcCBQCSECpAdeIEABISKkBVAgUAEhMqQCXiBACKECpABQIFAIoRKkBW4gQAChMqQDYCBQA2IFSADMQJAGxGqACRCRQA2JRQAaIRJwCAUAFCECcAwDdCBVhJoAAATwkVYDZxAgB8JFSAWQQKANBMqAAjiRMA4BKhAowgUACAW4QK0Is4AQC6ESrAXQIFAOhOqABXiBMAYCihArQSJwDANEIF+ESgAADTCRXgGXECACwlVIBHAgUACEGoAOIEAAhHqMC+BAoAEJZQgb2IEwAgBaECexAoAEAqQgXqEicAQFpCBeoRKABAekIFahAnAEApQgXyEicAQFlCBfIRKABAeUIFchAnAMBWhArEJlAAgC0JFYhHnAAA2xMqEIdAAQD4j1CBtcQJAMATQgXWECgAAG8IFZhHnAAANBIqMJ5AAQA4SajAGOIEAOAGoQL9iBMAgE6ECtwnUAAAOhMqcI04AQAYSKjAOQIFAGACoQKfiRMAgMmECrwmUAAAFhEq8J04AQAIQKjAvwQKAEAgQoWdiRMAgKCECjsSKAAAwQkVdiFOAAASESpUJk4AAJISKlQkUAAAkhMqVCFOAAAKESpkJ1AAAAoSKmQkTgAAihMqZCJQAAA2IVSITpwAAGxIqBCVQAEA2JhQIRJxAgDAcRxChRgECgAA3wgVVhEnAAC8JFSYSZwAANDiH6HCDAIFAIAWv3ajUGEUcQIAQIunu1Go0JtAAQCgxdvdKFToQZwAANCieTcKFe4QKAAAtDi9G4UKZ4kTAABa3NqNQoVWAgUAgBZddqNQ4R1xAgBAi+67UajwjEABAKDFsN0oVPgiTgAAaDFlNwqVvYkTAABaTN+NQmVPAgUAgBbLdqNQ2Yc4AQCgRYjdKFTqC3FoAACEF2o3CpWaQh0ZAABhhd2NQqWWsIcGAEAo4XejUMkv/JEBABBCqt0oVPJKdWgAACyTcjcKlVxSHhkAANOl341CJYf0hwYAwBRldqNQiavMkQEAMFTJ3ShUYil5ZAAAdFd+NwqVGMofGgAAXWyzG4XKOtscGQAAt2y5G4XKfFseGgAAp229G4XKHFsfGQAAzezG/wiVsRwaAAAt7MYfhEp/jgwAgBZ24xtCpR+HBgBAC7uxgVC5x5EBANDCbjxJqJznyAAAaGE33iBU2jk0AABa2I0dCJX3HBkAAC3sxs6EynMODQCAFnbjIELlN0cGAEALu3ECoeLQAABoYzdOtGuoODIAAFrYjYvsFioODQCAFnbjYjuEiiMDAKCF3RhI5VBxaAAAtLAbA6oWKo4MAIAWdmNwVULFoQEA8InNmEjmUHFoAAC0sBsTyhYqjgwAgBZ2Y3JZQsWhAQDQwm4sInKoODIAAFrYjQVFDBWHBgBAC7uxsCih4sgAAGhhN25idag4NAAAWtiNm1kRKo4MAIAWduPGZoaKQwMAoIXdyPBQcWQAALSwG/lmRKg4MgAAWtiNvNQzVBwaAAAt7EY+uhsqjgwAgBZ2I6dcDRWHBgBAC7uRS86EiiMDAKCF3chtLaHi0AAAaGE30s2rUHFkAAC0sBsZ4meoODQAAFrYjQz19+HIAABoYzcyzeh/pgcAID+BwnRCBQCAZ8QJSwkVAAC+iBPCECoAAAgUwhEqAAB7EieEJlQAAPYiUEhBqAAA1CdOSEeoAADUJVBIS6gAANQiTihBqAAA1CBQKEWoAADkJU4oS6gAAOQjUChPqAAA5CBO2IpQAQCIS5ywLaECABCPQGF7QgUAIAZxAg+ECgDAWgIFnhAqAADziRP4QKgAAMwjUKCRUAEAGEucwAVCBQBgDIECNwgVAIB+xAl0IlQAAO4TKNCZUAEAuEacwEBCBQCgnTiBSYQKAMBnAgUmEyoAAM+JE1hIqAAAfCdQIAChAgAgTiAcoQIA7EygQFBCBQDYjTiBBIQKALALgQKJCBUAoDJxAkkJFQCgGnECBQgVAKAKgQKFCBUAIDNxAkUJFQAgI4ECxQkVACALcQIbESoAQHQCBTYkVACAiMQJbE6oAACRCBTgOA6hAgCsJ06APwgVAGAVgQK8JFQAgJnECdBEqAAAo4kT4DShAgCMIlCAy4QKANCTOAG6ECoAQA8CBehKqAAAV4kTYBihAgCcJVCA4YQKANBCnABTCRUA4B2BAiwhVACAn8QJsJxQAQC+CBQgDKECAHsTJ0BIQgUA9iNOgPCECgDsQ6AAaQgVAKhNnAApCRUAqEmgAKkJFQCoQ5wAZQgVAMhPoADlCBUAyEmcAKUJFQDIRaAAWxAqABCfOAG2I1QAIC6BAmxLqABALOIE4BAqABCBOAH4QagAwDoCBeAFoQIAc4kTgAZCBQDmECgAJwgVABhHnABcJFQAoD+BAnCTUAGAPsQJQEdCBQDuESgAAwgVADhPnAAMJlQAoJ1AAZhEqADAe+IEYAGhAgB/EicAiwkVAPhNoAAEIVQA2J04AQhIqACwK4ECEJhQAWAn4gQgCaECwA4ECkAyQgWAqsQJQGJCBYBqBApAAUIFgArECUAxQgWAzAQKQFFCBYBsxAnABoQKABmIE4DNCBUAIhMoAJsSKgBEI04AECoAhCFQAPhFqACwkjgB4CmhAsAKAgWAt4QKALOIEwCaCRUARhMoAJwmVAAYQZwAcItQAaAXcQJAN0IFgLsECgDdCRUArhAnAAwlVAA4Q6AAMIVQAeATcQLAdEIFgFcECgDLCBUAHokTAEIQKgAch0ABIBihArAvcQJAWEIFYD8CBYDwhArAHsQJAKkIFYC6xAkAaQkVgHoECgDpCRWAGsQJAKUIFYDcBAoAJQkVgHzECQDlCRWAPAQKANsQKgCxiRMAtiRUAGISKABsTagAxCFOAOA/QgVgPYECAD8IFYA1xAkAvCFUAOYRJwDQSKgAjCdQAOAkoQIwhjgBgBuECkBfAgUAOhAqAPeJEwDoTKgAXCdQAGAQoQJwjjgBgAmECkAbgQIAEwkVgNfECQAsIlQA/iRQAGAxoQLwL3ECAIEIFWBn4gQAghIqwI4ECgAEJ1SAXYgTAEhEqADVCRQASEioABWJEwBITqgAlQgUAChCqADZiRMAKEioAFkJFAAoTKgAmYgTANiEUAEyECgAsBmhAkQlTgBgY0IFiEScAADHcQgVIAaBAgB8I1SAVcQJAPCSUAFmEygAwEdCBZhBnAAApwgVYCSBAgBcIlSA3sQJAHCbUAF6ESgAQDdCBbhDnAAAQwgV4AqBAgAMJVSAVuIEAJhGqADviBMAYAmhAjwjUACApYQK8EWcAABhCBVAoAAA4QgV2JM4AQBCEyqwF4ECAKQgVKA+cQIApCNUoC6BAgCkJVSgFnECAJQgVCA/cQIAlCNUIC+BAgCUJVQgF3ECAGxBqEAOAgUA2IpQgbjECQCwLaEC8QgUAGB7QgViECcAAA+ECqwlUAAAnhAqMJ84AQD4QKjAPAIFAKCRUIGxxAkAwAVCBfoTJwAANwkV6EegAAB0IlTgHnECADCAUIFrBAoAwEBCBdqJEwCASYQKfCZQAAAmEyrwnDgBAFhIqMB3AgUAIAChAuIEACAcocLOBAoAQFBChd2IEwCABIQKOxAnAADJCBUqEygAAEkJFaoRJwAABQgVqhAoAACFCBUyEycAAEUJFTISKAAAxQkVshAnAAAbESpEJ1AAADYkVIhInAAAbE6oEIlAAQDgOA6hwnriBACAPwgVVhAnAAC8JVSYSaAAANBEqDCaOAEA4DShwigCBQCAy4QKPYkTAAC6ECr0IFAAAOhKqHCVOAEAYBihwlkCBQCA4YQKLcQJAABTCRVeEScAACwjVPhJoAAAsJxQ4TjECQAAwQiVvQkUAABCEir7EScAAIQnVPYhUAAASEOo1CZOAABISajUJFAAAEhNqNQhTgAAKEOo5CdQAAAoR6jkJE4AAChNqOQiUAAA2IJQiU+cAACwHaESkzgBAGBrQiUWgQIAAIdQiUCcAADAD0JlHYECAAAvCJW5xAkAADQQKnMIFAAAOEGojCNOAADgIqHSn0ABAICbhEof4gQAADoSKteJEwAAGESonCdQAABgMKHSRpwAAMBEQuU9gQIAAAsIlT+JEwAAWEyo/CZQAAAgiN1DRZwAAEBAu4aKQAEAgMB2ChVxAgAASewQKgIFAACSqRoq4gQAABKrFCriBAAAiqgQKgIFAACKyRoq4gQAAArLFioCBQAANpAhVMQJAABsJnKoCBQAANhUtFARJwAAQJhQESgAAMAvK0NFnAAAAE+tCBWBAgAAvDUrVMQJAADQbGSoiBMAAOCSEaEiUAAAgFt6hYo4AQAAurkbKgIFAADo7kqoiBMAAGCoM6EiUAAAgCk+hYo4AQAApnsVKgIFAABY5jFUxAkAABDC34dAAQAAgvlr9QMAAAB+EioAAEA4QgUAAAhHqAAAAOEIFQAAIByhAgAAhCNUAACAcIQKAAAQjlABAADC+Xv1AwAAAB78cxxCBQAAiOGfxw9CBQAAWOWfV18IFQAAYLaXgfJFqAAAADN8jJNHQgUAABjpVKB8ESoAAEBvl+LkkVABAAB6uR0oX4QKAABwR7c4eSRUAACAs4bEySOhAgAAtBoeKF+ECgAA8M60OHkkVAAAgGeWBMoXoQIAAHxZGiePhAoAABAmUL4IFQAA2FO4OHkkVAAAYC+hA+WLUAEAgPpSxMkjoQIAAHWlC5QvQgUAAGpJGyePhAoAAORXIk4eCRUAAMirXKB8ESoAAJBL2Th5JFQAACCHLQLli1ABAIC4toqTR0IFAADi2TZQvggVAACIYfs4eSRUAABgLYHyhFABAID5xMkHQgUAAOYRKI2ECgAAjCVOLhAqAADQnzi5SagAAEA/AqUToQIAAPeIkwGECgAAXCNQBhIqAADQTpxMIlQAAOAzgTKZUAEAgOfEyUJCBQAAvhMoAQgVAAAQJ+EIFQAAdiZQghIqAADsRpwkIFQAANiBOElGqAAAUJlASUqoAABQjTgpQKgAAFCFQClEqAAAkJk4KUqoAACQkUApTqgAAJCFONmIUAEAIDqBsiGhAgBAROJkc0IFAIAoxAm/CBUAAFYTKPxBqAAAsII44S2hAgDATAKFJkIFAIDRxAmnCRUAAEYRKFwmVAAA6Emc0IVQAQCgB4FCV0IFAICrxAnDCBUAAM4SKAwnVAAAaCFOmEqoAADwijhhGaECAMBPAoXlhAoAAMchTghGqAAA7E2gEJJQAQDYjzghPKECALAPgUIaQgUAoDZxQkpCBQCgJoFCakIFAKAOcUIZQgUAID+BQjlCBQAgJ3FCaUIFACAPccI2hAoAQHwChe0IFQCAmMQJWxMqAACxCBQ4hAoAQATiBH4QKgAA6wgUeEGoAADMJU6ggVABAJhDoMAJQgUAYBxxAhcJFQCA/gQK3CRUAAD6ECfQkVABALhOnMAgQgUA4DyBAoMJFQCANuIEJhIqAADvCRRYQKgAAPxJnMBiQgUA4DeBAkEIFQBgd+IEAhIqAMCuBAoEJlQAgJ2IE0hCqAAAOxAokIxQAQCqEieQmFABACoRJ1CEUAEAKhAoUIxQAQCyEidQmFABALIRKLABoQIAZCBOYDNCBQCITKDApoQKABCNOAGECgAQhkABfhEqAMBK4gR4SqgAACsIFOAtoQIAzCJOgGZCBQAYSZwAlwgVAGAEgQLcIlQAgF7ECdCNUAEA7hIoQHdCBQC4QpwAQwkVAOAMgQJMIVQAgE/ECTCdUAEAXhEowDJCBQB4JE6AEIQKACBOgHCECgDsS6AAYQkVANiLOAFSECoAsAeBAqQiVACgLnECpCVUAKAegQKkJ1QAoAZxApQiVAAgN4EClCRUACAfcQKUJ1QAIA+BAmxDqABAbOIE2JJQAYB4xAmwPaECAHEIFID/CBUAWEucADwhVABgDYEC8IZQAYB5xAlAI6ECAOMJFICThAoAjCFOAG4QKgDQl0AB6ECoAMB94gSgM6ECANcJFIBBhAoAnCNOACYQKgDwmTgBmEyoAMBrAgVgEaECAN+JE4AAhAoA/EugAAQiVADYmTgBCEqoALAjgQIQnFABYBfiBCARoQJAdQIFICGhAkBF4gQgOaECQCUCBaAIoQJAduIEoCChAkBG4gSgOKECQCYCBWATQgWA6MQJwIaECgBRCRSAjQkVACIRJwAcxyFUAIhBoADwjVABYBVxAsBLQgWA2QQKAB8JFQBmECcAnCJUABhJoABwiVABoDdxAsBtQgWAHsQJAF0JFQDuECgADCFUADhLnAAwnFABoJVAAWAaoQLAO+IEgCWECgDPCBQAlhIqAHwRJwCEIVQAECgAhCNUAPYkTgAITagA7EWgAJCCUAGoT5wAkI5QAahJnACQmlABqEWgAFCCUAHIT5wAUI5QAchLoABQllAByEWcALAFoQKQg0ABYCtCBSAucQLAtoQKQDwCBYDtCRWAGMQJADwQKgDriBMAeEGoAMwnUADgA6ECMIc4AYAThArAWAIFAC4QKgD9iRMAuEmoAPQjUACgE6ECcI84AYABhArANQIFAAYSKgDtxAkATCJUAD4TKAAwmVABeE6cAMBCQgXgN3ECAEEIFQCBAgDhCBVgV+IEAAITKsBuBAoAJCBUgB2IEwBIRqgAlQkUAEhKqADViBMAKECoAFUIFAAoRKgAmYkTAChKqAAZCRQAKE6oAFmIEwDYiFABIhMnALApoQJEJFAAYHNCBYhCnAAAvwgVYDWBAgD8QagAK4gTAOAtoQLMJFAAgCZCBRhNnAAApwkVYBSBAgBcJlSAnsQJANCFUAF6ECgAQFdCBbhKnAAAwwgV4AxxAgBMIVSAFgIFAJhKqACviBMAYBmhAvwkUACA5YQKcBziBAAIRqjA3gQKABCSUIH9iBMAIDyhAvsQKABAGkIFahMnAEBKQgVqEigAQGpCBeoQJwBAGUIFchMnAEBJQgVyEigAQGlCBfIQJwDANoQKxCdQAIDtCBWISZwAAFsTKhCLQAEAOIQKRCBOAAB+ECqwjkABAHhBqMBc4gQAoIFQgTkECgDACUIFxhEnAAAXCRXoS5wAAHQgVKAPgQIA0JFQgevECQDAIEIFzhMoAACDCRVoI04AACYSKvCeQAEAWECowJ/ECQDAYkIFfhMoAABBCBV2J04AAAISKuxInAAABCdU2IlAAQBIQqhQnTgBAEhIqFCVQAEASEyoUIk4AQAoQqhQgUABAChGqJCVOAEAKEyokI1AAQDYgFAhA3ECALAZoUJkAgUAYFNChWjECQAAQoUQxAkAAN8IFVYSKAAAPCVUmE2cAADwkVBhFoECAEAzocJI4gQAgEuECiMIFAAAbhEq9CJOAADoRqhwl0ABAKA7ocIV4gQAgKGECmcIFAAAphAqfCJOAACYTqjwjDgBAGApocIjgQIAQAhCBXECAEA4QmVfAgUAgLCEyl7ECQAAKQiVPQgUAABSESp1iRMAANISKvUIFAAA0hMqNYgTAABKESq5CRQAAEoSKvmIEwAAyhMqOYgTAAC2IlRiEygAAGxJqMQjTgAA2J5QiUOgAADAf4TKWuIEAACeECprCBQAAHhDqMwjTgAAoJFQGU+gAADASUJlDHECAAA3CJW+BAoAAHQgVO4TJwAA0JlQuUacAADAQELlHIECAAATCJXPxAkAAEwmVF4TKAAAsIhQ+U6cAABAAELlXwIFAAAC2TlUxAkAAAS1Y6gIFAAACG6XUBEnAACQSPVQESgAAJBQxVARJwAAkFyVUBEnAABQSPZQESgAAFBQxlARJwAAUFymUBEoAACwieihIk4AAGBDUUNFoAAAwMYihYo4AQAAjuOIESoCBQAA+GZVqIgTAADgpZmhIk4AAIAmM0JFoAAAAKeMChVxAgAAXNY7VAQKAABwW49QEScAAEBXd0JFoAAAAEOcDRVxAgAADNcaKgIFAACY5l2oiBMAAGCJZ6EiUAAAgKW+QkWcAAAAYfx1iBQAACCYv1Y/AAAA4CehAgAAhCNUAACAcIQKAAAQjlABAADCESoAAEA4QgUAAAhHqAAAAOEIFQAAIByhAgAAhCNUAACAcIQKAAAQjlABAADCESoAAEA4QgUAAAhHqAAAAOEIFQAAIByhAgAAhCNUAACAcIQKAAAQjlABAADCESoAAEA4QgUAAAhHqAAAAOEIFQAAIByhAgAAhCNUAACAcIQKAAAQjlABAADCESoAAEA4QgUAAAhHqAAAAOEIFQAAIByhAgAAhCNUAACAcIQKAAAQjlABAADCESoAAEA4QgUAAAhHqAAAAOEIFQAAIByhAgAAhCNUAACAcIQKAAAQjlABAADCESoAAEA4QgUAAAhHqAAAAOEIFQAAIByhAgAAhCNUAACAcIQKAAAQjlABAADCESoAAEA4QgUAAAhHqAAAAOEIFQAAIByhAgAAhCNUAACAcIQKAAAQzv8BqVsuJsioi/kAAAAASUVORK5CYII="
              width={810}
              height={811}
            />
          </g>
        </mask>
      </defs>
      <g clipPath="url(#gmx_e)">
        <g clipPath="url(#gmx_f)">
          <path fill={forceColor ?? 'url(#gmx_g)'} d="M0 109.836h810v590.328H0Zm0 0" />
        </g>
      </g>
    </svg>
  );
}

function DfxAssetIconCHZ({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.8,15.7c0-.2,0-.3-.2-.4-.7-.5-1.5-1-2.2-1.5a.45.45,0,0,0-.5,0l-2.2,1.6a.55.55,0,0,0-.3.5,1.07,1.07,0,0,1-.2.6.45.45,0,0,0,0,.5c.8,1.6,1.5,3.2,2.3,4.8.3.5.5,1.1.8,1.7.1-.1.1-.2.2-.3.9-2,1.7-4,2.6-6,.1-.2.1-.3-.1-.4A1.31,1.31,0,0,1,17.8,15.7Z"
        fill={forceColor ?? '#cd0124'}
      />
      <path
        d="M14.4,13.1c-2-1.4-4-2.8-5.9-4.1l-.1.1c.1.2.1.3.2.5l2.1,4.5c.2.4.3.8.9.9a.9.9,0,0,0,.5-.1c.6-.5,1.3-.9,1.9-1.4Z"
        fill={forceColor ?? '#cd0124'}
      />
      <path
        d="M15,0A15,15,0,1,0,30,15,15,15,0,0,0,15,0Zm8.1,8.7c-.2,0-.3.1-.4.3-.8,2-1.7,4-2.5,6v.4a1.3,1.3,0,0,1-.8,1.8q-.15,0-.3.3c-.9,2-1.8,4.1-2.6,6.1a.45.45,0,0,0,0,.5,1.26,1.26,0,0,1-.2,1.7,1.22,1.22,0,0,1-1.6.1,1.15,1.15,0,0,1-.3-1.6.64.64,0,0,0,0-.6c-1-2-1.9-4-2.9-6a.7.7,0,0,0-.5-.4,1.28,1.28,0,0,1-.9-1.9.45.45,0,0,0,0-.5C9.2,12.9,8.3,11,7.3,9c0-.1-.1-.2-.4-.2A1.28,1.28,0,0,1,5.8,7.6a1.54,1.54,0,0,1,.9-1.3,1.24,1.24,0,0,1,1.5.5c.1.2.2.2.5.2H21.4c.2,0,.4,0,.5-.3a1.15,1.15,0,0,1,1.4-.5,1.4,1.4,0,0,1,.9,1.2A1.3,1.3,0,0,1,23.1,8.7Z"
        fill={forceColor ?? '#cd0124'}
      />
      <path
        d="M15,12.4a.45.45,0,0,0,.5,0c1.9-1.4,3.8-2.7,5.6-4.1.1-.1.2-.1.2-.2V8H8.7a.77.77,0,0,1,.3.2Z"
        fill={forceColor ?? '#cd0124'}
      />
      <path
        d="M16,13.1c.8.6,1.6,1.1,2.4,1.6.2.1.5,0,.8,0,.1,0,.2-.2.2-.3.7-1.6,1.4-3.3,2.1-4.9,0-.1.1-.2.1-.3h-.1C19.8,10.4,17.9,11.7,16,13.1Z"
        fill={forceColor ?? '#cd0124'}
      />
    </svg>
  );
}

function DfxAssetIconRPL({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 250 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <clipPath id="rpl_c">
        <path d="M250.371 125.184c0 69.14-56.047 125.187-125.187 125.187C56.047 250.371 0 194.324 0 125.184 0 56.047 56.047 0 125.184 0c69.14 0 125.187 56.047 125.187 125.184zm0 0" />
      </clipPath>
      <linearGradient id="rpl_b" x1={-1.089} x2={249.534} y1={249.534} y2={2} gradientUnits="userSpaceOnUse">
        <stop offset={0} stopColor="#ffd275" />
        <stop offset={0.132} stopColor="#feca74" />
        <stop offset={0.358} stopColor="#fbb570" />
        <stop offset={0.652} stopColor="#f79569" />
        <stop offset={1} stopColor="#f2665f" />
      </linearGradient>
      <clipPath id="rpl_d">
        <path d="M30 46h36v45H30zm0 0" />
      </clipPath>
      <clipPath id="rpl_e">
        <path d="M250.371 125.184c0 69.14-56.047 125.187-125.187 125.187C56.047 250.371 0 194.324 0 125.184 0 56.047 56.047 0 125.184 0c69.14 0 125.187 56.047 125.187 125.184zm0 0" />
      </clipPath>
      <clipPath id="rpl_f">
        <path d="M34 0h27v31H34zm0 0" />
      </clipPath>
      <clipPath id="rpl_g">
        <path d="M250.371 125.184c0 69.14-56.047 125.187-125.187 125.187C56.047 250.371 0 194.324 0 125.184 0 56.047 56.047 0 125.184 0c69.14 0 125.187 56.047 125.187 125.184zm0 0" />
      </clipPath>
      <clipPath id="rpl_h">
        <path d="M65 2h72v42H65zm0 0" />
      </clipPath>
      <clipPath id="rpl_i">
        <path d="M250.371 125.184c0 69.14-56.047 125.187-125.187 125.187C56.047 250.371 0 194.324 0 125.184 0 56.047 56.047 0 125.184 0c69.14 0 125.187 56.047 125.187 125.184zm0 0" />
      </clipPath>
      <clipPath id="rpl_j">
        <path d="M169 39h40v83h-40zm0 0" />
      </clipPath>
      <clipPath id="rpl_k">
        <path d="M250.371 125.184c0 69.14-56.047 125.187-125.187 125.187C56.047 250.371 0 194.324 0 125.184 0 56.047 56.047 0 125.184 0c69.14 0 125.187 56.047 125.187 125.184zm0 0" />
      </clipPath>
      <clipPath id="rpl_l">
        <path d="M139 90h23v36h-23zm0 0" />
      </clipPath>
      <clipPath id="rpl_m">
        <path d="M250.371 125.184c0 69.14-56.047 125.187-125.187 125.187C56.047 250.371 0 194.324 0 125.184 0 56.047 56.047 0 125.184 0c69.14 0 125.187 56.047 125.187 125.184zm0 0" />
      </clipPath>
      <clipPath id="rpl_n">
        <path d="M120 142h17v29h-17zm0 0" />
      </clipPath>
      <clipPath id="rpl_o">
        <path d="M250.371 125.184c0 69.14-56.047 125.187-125.187 125.187C56.047 250.371 0 194.324 0 125.184 0 56.047 56.047 0 125.184 0c69.14 0 125.187 56.047 125.187 125.184zm0 0" />
      </clipPath>
      <clipPath id="rpl_p">
        <path d="M144 172h18v27h-18zm0 0" />
      </clipPath>
      <clipPath id="rpl_q">
        <path d="M250.371 125.184c0 69.14-56.047 125.187-125.187 125.187C56.047 250.371 0 194.324 0 125.184 0 56.047 56.047 0 125.184 0c69.14 0 125.187 56.047 125.187 125.184zm0 0" />
      </clipPath>
      <clipPath id="rpl_r">
        <path d="M161 200h26v43h-26zm0 0" />
      </clipPath>
      <clipPath id="rpl_s">
        <path d="M250.371 125.184c0 69.14-56.047 125.187-125.187 125.187C56.047 250.371 0 194.324 0 125.184 0 56.047 56.047 0 125.184 0c69.14 0 125.187 56.047 125.187 125.184zm0 0" />
      </clipPath>
      <clipPath id="rpl_t">
        <path d="M0 170h95v80H0zm0 0" />
      </clipPath>
      <clipPath id="rpl_u">
        <path d="M250.371 125.184c0 69.14-56.047 125.187-125.187 125.187C56.047 250.371 0 194.324 0 125.184 0 56.047 56.047 0 125.184 0c69.14 0 125.187 56.047 125.187 125.184zm0 0" />
      </clipPath>
      <clipPath id="rpl_v">
        <path d="M250.371 125.184c0 69.14-56.047 125.187-125.187 125.187C56.047 250.371 0 194.324 0 125.184 0 56.047 56.047 0 125.184 0c69.14 0 125.187 56.047 125.187 125.184zm0 0" />
      </clipPath>
      <filter id="rpl_a" width="100%" height="100%" x="0%" y="0%">
        <feColorMatrix in="SourceGraphic" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
      </filter>
      <mask id="rpl_x">
        <g filter="url(#rpl_a)">
          <path fillOpacity={0.7} d="M0 0h250v250H0z" />
        </g>
      </mask>
      <clipPath id="rpl_w">
        <path d="M0 0h250v250H0z" />
      </clipPath>
      <g fill={forceColor != null ? '#fff' : 'url(#rpl_b)'} clipPath="url(#rpl_c)">
        <path d="M0 0h250v250H0z" />
        <path d="M0 0h250v250H0z" />
      </g>
      <g clipPath="url(#rpl_d)">
        <g clipPath="url(#rpl_e)">
          <path
            fill={forceColor != null ? '#fff' : '#f8a171'}
            d="M63.195 90.254H33.566a2.787 2.787 0 0 1-2.78-2.777V48.89a2.787 2.787 0 0 1 2.78-2.782h29.63a2.787 2.787 0 0 1 2.777 2.782v38.586a2.786 2.786 0 0 1-2.778 2.777zm0 0"
          />
        </g>
      </g>
      <g clipPath="url(#rpl_f)">
        <g clipPath="url(#rpl_g)">
          <path
            fill={forceColor != null ? '#fff' : '#faaa71'}
            d="M57.34 30.832H37.594a2.786 2.786 0 0 1-2.778-2.777V.973a2.786 2.786 0 0 1 2.778-2.778H57.34A2.786 2.786 0 0 1 60.117.973v27.082a2.786 2.786 0 0 1-2.777 2.777zm0 0"
          />
        </g>
      </g>
      <g clipPath="url(#rpl_h)">
        <g clipPath="url(#rpl_i)">
          <path
            fill={forceColor != null ? '#fff' : '#f9a471'}
            d="M133.566 43.797H68.75a2.786 2.786 0 0 1-2.777-2.777V5.602a2.786 2.786 0 0 1 2.777-2.778h64.816a2.786 2.786 0 0 1 2.778 2.778V41.02a2.77 2.77 0 0 1-2.778 2.777zm0 0"
          />
        </g>
      </g>
      <g clipPath="url(#rpl_j)">
        <g clipPath="url(#rpl_k)">
          <path
            fill={forceColor != null ? '#fff' : '#f7956b'}
            d="M205.484 121.574h-33.656a2.786 2.786 0 0 1-2.777-2.777V41.945a2.786 2.786 0 0 1 2.777-2.777h33.637a2.786 2.786 0 0 1 2.777 2.777v76.852c.024 1.527-1.226 2.777-2.758 2.777zm0 0"
          />
        </g>
      </g>
      <g clipPath="url(#rpl_l)">
        <g clipPath="url(#rpl_m)">
          <path
            fill={forceColor != null ? '#fff' : '#faab72'}
            d="M158.266 125.277h-15.743a2.786 2.786 0 0 1-2.777-2.777V93.496a2.786 2.786 0 0 1 2.777-2.777h15.743a2.786 2.786 0 0 1 2.777 2.777V122.5a2.786 2.786 0 0 1-2.777 2.777zm0 0"
          />
        </g>
      </g>
      <g clipPath="url(#rpl_n)">
        <g clipPath="url(#rpl_o)">
          <path
            fill={forceColor != null ? '#fff' : '#f9a571'}
            d="M133.566 170.184h-10.488a2.786 2.786 0 0 1-2.777-2.778v-22.523a2.786 2.786 0 0 1 2.777-2.778h10.488a2.786 2.786 0 0 1 2.778 2.778v22.523a2.786 2.786 0 0 1-2.778 2.778zm0 0"
          />
        </g>
      </g>
      <g clipPath="url(#rpl_p)">
        <g clipPath="url(#rpl_q)">
          <path
            fill={forceColor != null ? '#fff' : '#fbb171'}
            d="M158.266 198.75h-11.414a2.786 2.786 0 0 1-2.778-2.777V175.3a2.786 2.786 0 0 1 2.778-2.778h11.414a2.786 2.786 0 0 1 2.777 2.778v20.672a2.786 2.786 0 0 1-2.777 2.777zm0 0"
          />
        </g>
      </g>
      <g clipPath="url(#rpl_r)">
        <g clipPath="url(#rpl_s)">
          <path
            fill={forceColor != null ? '#fff' : '#f89e71'}
            d="M163.82 200.277h20.371a2.786 2.786 0 0 1 2.778 2.778v37.039a2.786 2.786 0 0 1-2.778 2.777h-20.37a2.786 2.786 0 0 1-2.778-2.777v-37.04c0-1.503 1.25-2.777 2.777-2.777zm0 0"
          />
        </g>
      </g>
      <g clipPath="url(#rpl_t)">
        <g clipPath="url(#rpl_u)">
          <path
            fill={forceColor != null ? '#fff' : '#fcbb71'}
            d="M-.695 249.816h91.968a2.787 2.787 0 0 0 2.778-2.78v-74.071a2.787 2.787 0 0 0-2.778-2.781H-.695a2.787 2.787 0 0 0-2.778 2.78v74.071a2.787 2.787 0 0 0 2.778 2.781zm0 0"
          />
        </g>
      </g>
      <path
        fill={forceColor != null ? '#fff' : '#ffd48a'}
        d="M125.184 11.574c15.347 0 30.21 3.008 44.214 8.91 13.52 5.72 25.672 13.914 36.11 24.356 10.441 10.437 18.637 22.59 24.351 36.11 5.926 14.003 8.914 28.866 8.914 44.21 0 15.348-3.007 30.211-8.914 44.215-5.714 13.52-13.91 25.672-24.351 36.11-10.438 10.44-22.59 18.636-36.11 24.355-14.003 5.926-28.867 8.91-44.214 8.91-15.344 0-30.207-3.008-44.211-8.91-13.52-5.719-25.672-13.914-36.114-24.356-10.437-10.437-18.632-22.59-24.351-36.109-5.926-13.98-8.934-28.867-8.934-44.191 0-15.325 3.008-30.207 8.91-44.211 5.72-13.52 13.914-25.672 24.356-36.114 10.437-10.437 22.59-18.632 36.11-24.351 14.003-5.926 28.89-8.934 44.234-8.934m0-11.574C56.043 0 0 56.043 0 125.184 0 194.328 56.043 250.37 125.184 250.37c69.144 0 125.187-56.043 125.187-125.187C250.371 56.043 194.305 0 125.184 0zm0 0"
      />
      <g clipPath="url(#rpl_v)">
        <g clipPath="url(#rpl_w)" mask="url(#rpl_x)">
          <path
            fill={forceColor != null ? '#fff' : '#f04b36'}
            d="M125.184 258.45c-17.985 0-35.438-3.52-51.875-10.485-15.88-6.715-30.114-16.32-42.36-28.567-12.246-12.222-21.851-26.48-28.566-42.34-6.942-16.433-10.485-33.886-10.485-51.874 0-17.985 3.52-35.438 10.485-51.875 6.715-15.88 16.32-30.114 28.566-42.36C43.195 18.703 57.43 9.098 73.31 2.383c16.414-6.965 33.867-10.485 51.875-10.485 17.988 0 35.441 3.52 51.875 10.485 15.882 6.715 30.117 16.32 42.363 28.566 12.246 12.246 21.851 26.48 28.562 42.36 6.946 16.437 10.489 33.89 10.489 51.875 0 17.988-3.52 35.441-10.489 51.875-6.71 15.882-16.316 30.117-28.562 42.363s-26.48 21.851-42.363 28.562c-16.434 6.946-33.887 10.465-51.875 10.465zm0-238.774c-14.258 0-28.055 2.777-41.063 8.289-12.57 5.32-23.844 12.914-33.543 22.613S33.266 71.551 27.965 84.121c-5.512 12.984-8.29 26.805-8.29 41.063 0 14.261 2.778 28.058 8.29 41.066 5.32 12.57 12.914 23.844 22.613 33.543s20.973 17.312 33.543 22.613c12.984 5.489 26.805 8.29 41.063 8.29 14.261 0 28.058-2.778 41.066-8.29 12.57-5.324 23.844-12.914 33.543-22.613s17.312-20.973 22.613-33.543c5.489-12.984 8.29-26.805 8.29-41.066 0-14.258-2.778-28.055-8.29-41.063-5.324-12.57-12.914-23.844-22.613-33.543S178.82 33.266 166.25 27.965c-13.008-5.512-26.828-8.29-41.066-8.29zm0 0"
          />
        </g>
      </g>
      <path
        fill={forceColor ?? '#ffd48a'}
        d="M125.184 11.574c15.347 0 30.21 3.008 44.214 8.91 13.52 5.72 25.672 13.914 36.11 24.356 10.441 10.437 18.637 22.59 24.351 36.11 5.926 14.003 8.914 28.866 8.914 44.21 0 15.348-3.007 30.211-8.914 44.215-5.714 13.52-13.91 25.672-24.351 36.11-10.438 10.44-22.59 18.636-36.11 24.355-14.003 5.926-28.867 8.91-44.214 8.91-15.344 0-30.207-3.008-44.211-8.91-13.52-5.719-25.672-13.914-36.114-24.356-10.437-10.437-18.632-22.59-24.351-36.109-5.926-13.98-8.934-28.867-8.934-44.191 0-15.325 3.008-30.207 8.91-44.211 5.72-13.52 13.914-25.672 24.356-36.114 10.437-10.437 22.59-18.632 36.11-24.351 14.003-5.926 28.89-8.934 44.234-8.934m0-11.574C56.043 0 0 56.043 0 125.184 0 194.328 56.043 250.37 125.184 250.37c69.144 0 125.187-56.043 125.187-125.187C250.371 56.043 194.305 0 125.184 0zm0 0"
      />
      <path
        fill={forceColor != null ? '#fff' : '#fe8c2c'}
        d="M98.195 148.91c1.434 1.414 2.848 2.824 4.282 4.238.878.856 1.132.88 1.968 0 1.782-1.828 3.586-3.632 5.371-5.464.325-.344.625-.461 1.086-.301 3.102 1.09 6.297 1.183 9.516.836 1.25-.14 1.273-.14 1.363 1.203-1.039.094-2.058.23-3.078.3-.738.048-1.504.024-2.246.024h-.879c-1.25-.277-2.523-.512-3.773-.879-.672-.21-1.133-.117-1.621.414a362.96 362.96 0 0 1-5.278 5.442c-.691.695-.996.695-1.71 0-1.481-1.48-3.012-2.965-4.446-4.493-.277-.37-.371-.902-.555-1.32zm0 0"
      />
      <path
        fill={forceColor ?? '#fefefe'}
        d="M51.594 200.68a2.7 2.7 0 0 1-.535-.395c-.856-.902-1.735-1.781-2.59-2.707-.094-.113-.164-.254-.235-.394l2.594-2.454 2.547-2.382 3.844-3.614c.254-.207.531-.414.785-.644a1364.77 1364.77 0 0 0 6.113-5.719l18.817-17.57c3.52-3.285 7.039-6.598 10.578-9.883.742-.695 1.62-.672 2.34.066.347.348.671.743 1.02 1.114.714.785.714 1.574-.048 2.312a93.042 93.042 0 0 1-2.129 1.992c-3.379 3.149-6.761 6.297-10.117 9.446-4.906 4.582-9.816 9.187-14.746 13.773-2.66 2.5-5.324 4.977-7.984 7.477-.395.37-.743.785-1.09 1.18l-4.422 4.003-2.406 2.246zm6.527 5.996-3.543-3.266 2.152-2.082 2.34-2.176 4.075-3.797c.136-.113.3-.207.414-.324 2.086-1.941 4.168-3.886 6.25-5.855l15.578-14.582a739.81 739.81 0 0 1 6.02-5.602c.741-.695 1.62-.648 2.34.113.253.278.483.536.714.813 1.09 1.133 1.09 1.781-.043 2.848-4.633 4.328-9.238 8.68-13.867 13.007-1.598 1.48-3.196 2.942-4.77 4.446a832.839 832.839 0 0 0-4.722 4.488l-4.211 3.914-2.895 2.73-1.598 1.504-.925.813-1.758 1.617zm-15.879-16.574 1.504-1.598.672-.531 1.852-1.782 1.898-1.785c.23-.136.437-.3.625-.46.855-.837 1.71-1.692 2.543-2.524l1.113-1.09c.278-.16.531-.324.762-.531 1.297-1.203 2.57-2.406 3.867-3.61 2.082-1.968 4.168-3.937 6.25-5.906.902-.808 1.805-1.617 2.684-2.453 3.125-2.914 6.25-5.879 9.398-8.797 1.067-.992 2.2-1.941 3.29-2.914.741-.117 1.32.16 1.804.695.23.278.488.532.719.809.949 1.09.925 1.715-.141 2.707-1.086 1.02-2.2 2.04-3.285 3.059a9148.19 9148.19 0 0 0-15.813 14.812c-1.597 1.48-3.191 2.942-4.765 4.422-.903.855-1.762 1.734-2.664 2.594-.418.347-.832.672-1.227 1.039-.855.812-1.71 1.644-2.57 2.476l-2.613 2.41-2.895 2.637c-.672-.761-1.367-1.527-2.016-2.312-.367-.395-.668-.903-.992-1.367zm56.875-41.297c-.648-.996-.672-1.02.16-1.989 1.434-1.691 2.918-3.336 4.375-5 .23-.28.418-.511.184-.882-1.41-2.22-1.895-4.7-1.895-7.313 0-.047 0-.094-.023-.14.113-1.016.113-1.016-.79-1.32-3.077-1.016-6.155-2.036-9.233-3.056a494.98 494.98 0 0 0-5.348-1.687c-.879-.672-.902-.926-.188-1.738 3.59-4.051 7.176-8.102 10.813-12.153.348-.394.902-.648 1.387-.832.765-.277 1.55-.441 2.34-.648.093-.024.183-.024.277-.047 4.027-.973 8.054-1.922 12.058-2.895a.954.954 0 0 0 .465-.277c1.02-1.156 2.035-2.336 3.055-3.52 2.523-2.89 5.14-5.714 8.078-8.214 1.922-1.645 3.844-3.29 5.766-4.91 1.226-.903 2.406-1.805 3.632-2.707 5.211-3.797 10.672-7.106 16.575-9.7 1.992-.879 4.05-1.62 6.09-2.453.136-.023.253-.047.39-.094a57.787 57.787 0 0 1 12.617-2.683c.141 0 .278.023.418.023 2.106.047 4.211.047 6.317.137 1.23.07 1.23.164 1.554 1.508.16 2.89 0 5.808-.464 8.656-1.368 7.961-4.446 15.277-8.59 22.152-6.664 11.086-15.184 20.579-25.043 28.868a2 2 0 0 0-.742 1.226c-1.02 4.813-2.036 9.653-3.102 14.465-.094.418-.3.79-.602 1.09a1468.924 1468.924 0 0 1-12.5 11.133c-.253.21-.671.21-1.043.324-.23-.414-.507-.785-.648-1.203-.715-2.082-1.387-4.168-2.082-6.274-.766-2.406-1.55-4.836-2.316-7.246-.024-.09-.137-.16-.207-.23-.07-1.227-.094-1.227-1.25-1.11-2.965.325-5.903.23-8.774-.765-.441-.16-.695-.047-1.02.277-1.617 1.692-3.285 3.356-4.93 5.047-.784.809-1.019.785-1.827 0a272.106 272.106 0 0 1-3.934-3.82zm33.38-31.227.136.188c.07.16.187.3.3.437 2.641 2.57 5.79 3.45 9.399 2.707 1.367-.277 2.64-.832 3.703-1.781 2.246-1.734 3.45-4.05 3.684-6.852.16-1.945-.117-3.843-1.184-5.554-.043-.118-.09-.207-.137-.301-3.75-6.297-13.078-6.25-16.738.113-1.55 2.688-1.781 5.535-.668 8.473.508.86.992 1.715 1.504 2.57zm0 0"
      />
      <path
        fill={forceColor != null ? '#fff' : '#fecaa8'}
        d="M145.945 119.2c-1.066.948-2.316 1.503-3.683 1.757-3.563.742-6.711-.137-9.352-2.684a3.247 3.247 0 0 1-.3-.441l-.137-.184v.024a4.877 4.877 0 0 0-.188-.555c-1.156-2.152-1.363-4.422-.601-6.738a8.424 8.424 0 0 1 2.5-3.727c2.34-2.035 5.046-2.636 8.011-1.851 1.551.418 2.848 1.297 3.957 2.5 2.477 2.664 2.985 6.804 1.133 9.906-.414.672-.902 1.32-1.34 1.992zm0 0"
      />
      <path
        fill={forceColor != null ? '#fff' : '#fe7837'}
        d="M148.422 106.86c-.14-.067-.324-.09-.418-.208-1.805-2.082-4.027-3.242-6.805-3.449-2.34-.183-4.445.395-6.297 1.762-2.336 1.71-3.75 4.004-3.89 6.941-.043.95.07 1.922.093 2.871 0 .094-.07.188-.113.278-1.137-2.914-.883-5.739.668-8.403 3.637-6.32 12.918-6.367 16.668-.117.024.117.07.211.094.324zm0 0"
      />
    </svg>
  );
}

function DfxAssetIconARB({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 2500 2500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <g>
          <path
            d="M226 760v980c0 63 33 120 88 152l849 490c54 31 121 31 175 0l849-490c54-31 88-89 88-152V760c0-63-33-120-88-152l-849-490c-54-31-121-31-175 0L314 608c-54 31-87 89-87 152h-1z"
            fill={forceColor != null ? '#fff' : '#213147'}
          />
          <path
            d="m1435 1440-121 332c-3 9-3 19 0 29l208 571 241-139-289-793c-7-18-32-18-39 0zM1678 882c-7-18-32-18-39 0l-121 332c-3 9-3 19 0 29l341 935 241-139-422-1156v-1z"
            fill={forceColor ?? '#12aaff'}
          />
          <path
            d="M1250 155c6 0 12 2 17 5l918 530c11 6 17 18 17 30v1060c0 12-7 24-17 30l-918 530c-5 3-11 5-17 5s-12-2-17-5l-918-530c-11-6-17-18-17-30V719c0-12 7-24 17-30l918-530c5-3 11-5 17-5v1zm0-155c-33 0-65 8-95 25L237 555c-59 34-95 96-95 164v1060c0 68 36 130 95 164l918 530c29 17 62 25 95 25s65-8 95-25l918-530c59-34 95-96 95-164V719c0-68-36-130-95-164L1344 25c-29-17-62-25-95-25h1z"
            fill={forceColor ?? '#9dcced'}
          />
          <path d="m642 2179 85-232 170 141-159 146z" fill={forceColor ?? '#213147'} />
          <path
            d="M1172 644H939c-17 0-33 11-39 27L401 2039l241 139 550-1507c5-14-5-28-19-28l-1 1zM1580 644h-233c-17 0-33 11-39 27L738 2233l241 139 620-1701c5-14-5-28-19-28v1z"
            fill={forceColor ?? '#fff'}
          />
        </g>
      </g>
    </svg>
  );
}

function DfxAssetIconSUSHI({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <path id="sushi_a" d="M0 0h24v24H0z" />
      </defs>
      <clipPath id="sushi_b">
        <use xlinkHref="#sushi_a" style={{ overflow: 'visible' }} />
      </clipPath>
      <g style={{ clipPath: 'url(#sushi_b)' }}>
        <linearGradient
          id="sushi_c"
          x1={20.644}
          x2={24.333}
          y1={1011.506}
          y2={998.84}
          gradientTransform="matrix(1 0 0 -1 -12 1012)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} style={{ stopColor: '#03b8ff' }} />
          <stop offset={1} style={{ stopColor: '#fa52a0' }} />
        </linearGradient>
        <path d="M5 2.3 23.6 15 19 21.8.4 9 5 2.3z" fill={forceColor ?? 'url(#sushi_c)'} />
        <linearGradient
          id="sushi_d"
          x1={23.682}
          x2={27.37}
          y1={1012.39}
          y2={999.724}
          gradientTransform="matrix(1 0 0 -1 -12 1012)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} style={{ stopColor: '#03b8ff' }} />
          <stop offset={1} style={{ stopColor: '#fa52a0' }} />
        </linearGradient>
        <path
          d="M23.6 15c-1.6 2.3-7 1.4-12.1-2.2C6.3 9.3 3.5 4.6 5 2.3 6.6 0 12 .9 17.1 4.5c5.2 3.4 8 8.2 6.5 10.5z"
          fill={forceColor ?? 'url(#sushi_d)'}
        />
        <linearGradient
          id="sushi_e"
          x1={17.616}
          x2={21.305}
          y1={1010.624}
          y2={997.958}
          gradientTransform="matrix(1 0 0 -1 -12 1012)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} style={{ stopColor: '#03b8ff' }} />
          <stop offset={1} style={{ stopColor: '#fa52a0' }} />
        </linearGradient>
        <path
          d="M19 21.7c-1.6 2.3-7 1.4-12.1-2.2s-8-8.2-6.4-10.6c1.6-2.3 7-1.4 12.1 2.2s7.9 8.3 6.4 10.6z"
          fill={forceColor ?? 'url(#sushi_e)'}
        />
        <path
          d="M23.6 15 19 21.8c-1.6 2.3-7 1.3-12.1-2.2-1-.7-1.9-1.4-2.8-2.2.7-.1 1.6-.5 2.5-1.5 1.6-1.7 2.4-2.1 3.1-2 .7 0 1.5.7 2.8 2.4 1.3 1.7 3.1 2.2 4.2 1.3.1-.1.2-.1.3-.2.9-.7 1.2-1 2.9-4.2.4-.8 1.8-2.1 3.7-1.5.5 1.3.5 2.4 0 3.3z"
          fill={forceColor ?? '#0e0f23'}
        />
        <path
          d="M22.9 14.6c-1.4 2-6.3 1-11-2.3C7.1 9 4.3 4.8 5.7 2.8s6.3-1 11 2.3 7.5 7.5 6.2 9.5zm-4.4-3c-.7 1-3.1.5-5.5-1.1-2.3-1.6-3.7-3.7-3-4.7.7-1 3.1-.5 5.5 1.1 2.3 1.6 3.7 3.7 3 4.7z"
          style={{
            fillRule: 'evenodd',
            clipRule: 'evenodd',
            fill: '#fff',
          }}
        />
        <path
          d="M4.6 4.6c0-.1-.1-.2-.2-.1s-.2.1-.2.2c.1.3.2.5.2.7 0 .1.1.2.2.1.1 0 .2-.1.1-.2 0-.2 0-.4-.1-.7zM5.1 6.2c0-.1-.1-.2-.2-.1s-.1.1-.1.2c1.1 2.5 3.4 5.2 6.4 7.2.1.1.2 0 .3 0 .1-.1 0-.2 0-.3-3.1-2-5.3-4.6-6.4-7zM17.2 16c-.1 0-.2 0-.2.1s0 .2.1.2c.3.1.7.2 1 .3.1 0 .2 0 .2-.1s0-.2-.1-.2c-.3-.1-.7-.2-1-.3zM19 16.4c-.1 0-.2.1-.2.2s.1.2.2.2c.8.1 1.7.2 2.4.1.1 0 .2-.1.2-.2s-.1-.2-.2-.2c-.8.1-1.6 0-2.4-.1z"
          fill="#fff"
        />
      </g>
    </svg>
  );
}

function DfxAssetIconINCH({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 706.8 665.2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M168.2 366.5 186.9 226 24.7 113.4l148.2 50.2 35-53.7 127.8-79.3 281.7 155.2L632 422.6 506.5 597l-99.2 15.2 51.3-93.9v-90.4l-37.3-70.6-37.9-25.1-58.3 60.1v63.6l-45.5 42.6-57.8 7-25.6 14.5-42-13.4-17.5-63 31.5-44.3v-32.8z"
        fill={forceColor ?? '#fff'}
      />
      <path
        d="M427.2 112.2c-30.9-6.4-64.7-4.7-64.7-4.7s-11.1 51.3-79.9 64.8c.5 0 90.9 30.9 144.6-60.1zM455.2 577.7c37.3-29.2 65.3-69.4 78.2-114.9.6-1.7 5.8-4.7 9.3-7 5.8-3.5 11.7-6.4 12.8-11.1 2.3-13.4 3.5-27.4 3.5-41.4 0-5.2-5.3-10.5-10.5-15.7-4.1-3.5-8.2-7.6-8.2-10.5-5.8-53.1-30.3-102.7-69.4-138.8l-4.1 4.1c37.9 35.6 62.4 84 67.7 135.3.6 4.7 5.2 9.3 9.9 14 4.1 3.5 8.8 8.8 8.8 11.1 0 13.4-1.2 26.8-3.5 40.2-.6 2.3-5.8 4.7-9.9 7-5.8 2.9-11.1 5.8-12.2 10.5-14 49.6-46.1 92.8-88.7 120.8 7.6-16.3 31.5-69.4 44.3-96.3l-2.3-86.3-74.1-71.7-42 5.8-46.1 74.7s21.6 27.4-8.8 59.5c-29.7 31.5-53.1 38.5-53.1 38.5l-21.6-11.7c6.4-8.2 19.3-20.4 29.2-28.6 16.9-14 33.8-15.2 33.8-30.3.7-31.6-33.2-22.9-33.2-22.9l-12.3 11.7-5.2 43.2-25.6 32.1-2.9-.6-42-9.3s25.7-13.4 29.8-28.6c4.1-14.6-8.2-63-8.8-65.9.6.6 12.3 10.5 17.5 26.8 9.3-25.7 21.6-50.2 25.1-52.5 3.5-2.3 50.7-27.4 50.7-27.4l-15.7 41.4 11.7-6.4 28-68.8s27.4-13.4 47.8-13.4c36.7-.6 91-45.5 66.5-126 7 2.9 128.3 63.6 149.3 182.6 15.7 91.5-36.2 177.2-123.7 226.8z"
        fill={forceColor ?? '#94a6c3'}
      />
      <path
        d="M316.4 125c13.4-15.8 8.2-39.1 8.2-39.1l-39.1 57.8c-.6 0 13.9.6 30.9-18.7zM185.1 440.6l4.7-23.3s-19.3 33.8-21 38.5c-1.8 5.3 1.2 14.6 8.7 14 7.6-.6 16.9-11.7 16.9-19.8 0-10.5-9.3-9.4-9.3-9.4z"
        fill={forceColor ?? '#1b314f'}
      />
      <path
        d="M531.6 69.6s29.2 1.2 59.5 4.7c-68.3-53.7-133-69.4-185.5-69.4-72.3 0-121.3 29.8-124.3 31.5L304.1.2s-91-8.8-123.1 87.5c-8.2-20.4-15.7-50.2-15.7-50.2S118 79 140.2 147.8C85.9 128 8.4 100.5 5.4 100c-4.1-.6-5.3 1.2-5.3 1.2s-1.2 1.7 2.3 4.7c6.5 5.1 129 95.6 155.9 113.1-5.8 21-5.8 30.9 0 40.8 8.2 13.4 8.7 20.4 7.6 30.3-1.2 9.9-11.7 95.7-14 106.2-2.3 10.5-26.8 47.8-25.7 58.9 1.2 11.1 16.3 58.3 29.8 63.6 9.9 3.5 34.4 11.1 50.7 11.1 5.8 0 11.1-1.2 13.4-3.5 9.9-8.7 12.8-10.5 19.8-10.5h1.7c2.9 0 6.4.6 10.5.6 9.3 0 21.6-1.8 30.3-9.9 12.8-12.8 35-30.3 42-38.5 8.8-11.1 13.4-26.2 11.1-41.4-1.8-14 5.8-26.3 14.6-38.5 11.1-14.6 31.5-40.8 31.5-40.8C421.9 377.6 447 423.7 447 475c0 91-79.3 164.5-177.3 164.5-15.2 0-29.7-1.7-44.3-5.2 44.9 15.7 82.8 21 113.8 21 65.9 0 100.9-23.9 100.9-23.9s-12.2 15.8-32.1 33.8h.6c109.1-15.2 162.2-105 162.2-105s-4.1 29.2-9.3 49c145.1-109.1 120.6-245.6 120-250.2 1.2 1.7 15.8 19.2 23.3 28.6 23.4-240.4-173.2-318-173.2-318zM308.2 453.5c-2.3 2.9-12.2 11.7-19.2 18.1-7 6.4-14.6 12.8-20.4 18.7-2.3 2.3-7 3.5-14 3.5h-17.5c8.8-11.7 34.4-38.5 43.2-44.3 10.5-7 15.8-14 9.3-26.2-6.4-12.3-23.3-9.3-23.3-9.3s9.9-4.1 18.7-4.1c-11.1-2.9-25.1 0-31.5 6.4-7 6.4-5.8 29.2-8.7 43.7-2.9 15.2-12.8 22.8-28 36.8-8.2 7.6-14 9.9-18.7 9.9-9.9-1.7-21.6-4.7-29.8-7.6-5.8-7.6-14.6-32.7-16.9-43.2 1.7-5.8 8.7-18.1 12.2-25.1 7-13.4 11.1-21 12.3-28 2.3-9.9 9.9-71.2 12.8-96.8 7.6 9.9 18.1 26.3 15.7 36.8 16.9-23.9 4.7-47.3-1.2-56.6-5.2-9.3-12.2-28-6.4-47.8 5.8-19.8 26.8-74.7 26.8-74.7s7 12.3 16.9 9.9c9.9-2.3 89.8-122.5 89.8-122.5s21.6 47.2-1.2 81.7c-23.3 34.4-46.1 40.8-46.1 40.8s32.1 5.8 61.8-15.8c12.2 28.6 23.9 58.3 24.5 62.4-1.8 4.1-25.1 60.1-27.4 63.6-1.2 1.2-9.3 3.5-15.2 4.7-9.9 2.9-15.7 4.7-18.1 6.4-4.1 3.5-22.8 54.8-31.5 79.9-10.5 2.9-21 8.8-28.6 20.4 4.1-2.9 16.9-4.7 26.3-5.8 8.2-.6 33.2 12.8 39.7 37.9v1.2c1.3 9.2-1.6 18-6.3 25zm-54.8 7c5.3-7.6 4.7-20.4 5.3-24.5.6-4.1 1.7-11.7 6.4-12.8 4.7-1.2 15.8.6 15.8 8.7 0 7.6-8.2 9.3-14 14.6-4.2 4-12.4 12.8-13.5 14zM486.1 349c5.8-29.7 6.4-55.4 4.7-76.4 22.7 30.3 36.7 67.1 40.8 105 .6 4.7 5.2 9.3 9.9 14 4.1 3.5 8.8 8.2 8.8 11.1 0 13.4-1.2 26.8-3.5 40.3-.6 1.7-5.8 4.7-9.9 7-5.8 2.9-11.1 5.8-12.2 10.5-12.8 44.9-40.3 84.6-77 112.6 54.2-56.6 80.4-150 38.4-224.1zm-36.7 229.3c37.9-29.2 67.1-70 79.9-116.1.6-1.7 5.8-4.7 9.3-7 5.8-2.9 11.7-6.4 12.8-11.1 2.3-13.4 3.5-27.4 3.5-41.4 0-5.2-5.3-10.5-10.5-15.7-2.9-3.5-7.6-7.6-7.6-10.5-4.7-42.6-21.6-82.8-47.8-116.1-11.7-70-58.3-91.6-59.5-92.2 1.2 1.8 31.5 45.5 10.5 96.8-21.6 51.9-77 43.8-81.7 44.3-4.7 0-22.7 23.3-45.5 66.5-2.9-1.2-15.2-4.1-29.2-1.7 10.5-29.2 26.3-70.6 29.2-74.1 1.2-1.2 9.9-3.5 15.8-5.2 11.1-2.9 16.3-4.7 18.1-7 1.2-1.8 7-15.2 12.8-29.2 5.3 0 18.7-1.2 19.8-1.8 1.2-1.2 12.3-29.7 12.3-33.2 0-2.9-22.8-59.5-31.5-81.1 4.1-4.7 8.2-10.5 12.2-16.9 119.6 12.9 213 114.4 213 237.4 0 94.5-55.4 176.8-135.9 215.3z"
        fill={forceColor ?? '#1b314f'}
      />
      <path
        d="M294.2 263.3c11.1-12.8 5.3-36.7-15.2-40.8 5.3-12.2 12.8-36.7 12.8-36.7s-59.5 93.3-64.7 95.1c-5.3 1.8-10.5-18.7-10.5-18.7-11.1 42.6 18.7 48.4 22.2 35 16.3-4.2 44.3-21.7 55.4-33.9z"
        fill={forceColor ?? '#1b314f'}
      />
      <path d="m243.4 286 30.3-51.9s17.5 8.8 8.7 22.8c-11 16.3-39 29.1-39 29.1z" fill={forceColor ?? '#ffd923'} />
      <path
        d="M618.5 526.4c-8.8 11.7-18.7 23.9-30.3 35.6 75.2-144.7 3.5-277.1.6-282.3 5.3 5.3 10.5 11.1 15.2 16.3 57.7 64.1 64.7 160.4 14.5 230.4zM688.5 340.3c-26.3-70.6-63.6-130.7-145.8-184.9-79.3-52.5-164.5-48.4-169.2-47.8h-1.2c2.9-1.2 5.8-1.8 8.7-2.3 18.1-5.8 41.4-10.5 64.8-13.4C507.7 83 570.1 104 612.7 149l1.2 1.2c48.4 51.3 73.5 115.4 74.6 190.1zM524 51.5c-86.9-16.3-142.9-8.2-183.2 7-1.2-4.7-5.3-14-8.8-21.6-12.1 14.6-25 32.1-33.1 43.2-22.2 15.2-31.5 29.8-31.5 29.8 12.8-43.8 50.2-76.4 95.7-84.6 12.8-2.3 26.8-3.5 42-3.5 40.2.6 80.4 10.5 118.9 29.7zM202.6 163.5c-68.2-2.3-45.5-81.7-44.3-86.3 0 .6 4.6 62.4 44.3 86.3zM269.7 20.6c-52.5 31.5-42 106.7-42 106.7-50.2-76.3 37.9-104.9 42-106.7z"
        fill={forceColor ?? '#d82122'}
      />
      <path
        d="M183.4 184.5c3.5 2.9 7 8.2 2.9 15.8-2.3 4.1-5.8 3.5-11.1 1.2-7-3.5-49-28-86.9-53.1 43.2 15.2 86.9 31.5 93.9 35 0 0 .6.6 1.2 1.1z"
        fill={forceColor ?? '#fff'}
      />
    </svg>
  );
}

function DfxAssetIconTUSD({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 2500 2500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fillRule="evenodd" clipRule="evenodd">
        <circle cx={1250} cy={1250} r={1250} fill={forceColor ?? '#1B5AFE'} />
        <g fill="#FFF">
          <path d="M615.1 646v425.9c235.2 0 425.9-190.7 425.9-425.8l-425.9-.1zM1041 1925.2v-857.4c0-3.6 0-7.2.1-10.8.1-3.6.2-7.2.4-10.8.2-3.6.4-7.2.7-10.7.3-3.6.6-7.1 1-10.6s.8-7.1 1.2-10.6c.4-3.5.9-7 1.5-10.5.5-3.5 1.1-7 1.7-10.4.6-3.5 1.3-6.9 2-10.3.7-3.4 1.4-6.8 2.2-10.2.8-3.4 1.6-6.8 2.5-10.1s1.8-6.7 2.7-10c.9-3.3 1.9-6.6 3-9.9 1-3.3 2.1-6.6 3.2-9.8 1.1-3.3 2.2-6.5 3.4-9.7 1.2-3.2 2.4-6.4 3.7-9.6 1.3-3.2 2.6-6.3 3.9-9.5 1.3-3.2 2.7-6.3 4.1-9.4 1.4-3.1 2.9-6.2 4.3-9.3 1.5-3.1 3-6.1 4.6-9.2l4.8-9c1.6-3 3.3-6 5-8.9 1.7-2.9 3.4-5.9 5.2-8.8 1.8-2.9 3.6-5.8 5.4-8.6 1.8-2.8 3.7-5.7 5.6-8.5 1.9-2.8 3.8-5.6 5.8-8.3 2-2.8 4-5.5 6-8.2s4.1-5.4 6.2-8c2.1-2.7 4.2-5.3 6.4-7.9 2.2-2.6 4.3-5.2 6.6-7.7 2.2-2.5 4.5-5.1 6.7-7.6 2.3-2.5 4.6-5 6.9-7.4 2.3-2.4 4.7-4.9 7.1-7.2 2.4-2.4 4.8-4.8 7.2-7.1 2.4-2.3 4.9-4.6 7.4-6.9 2.5-2.3 5-4.5 7.6-6.7 2.6-2.2 5.1-4.4 7.7-6.5 2.6-2.2 5.2-4.3 7.9-6.4 2.7-2.1 5.3-4.2 8.1-6.2 2.7-2 5.4-4 8.2-6 2.8-2 5.5-3.9 8.3-5.8 2.8-1.9 5.6-3.8 8.5-5.6 2.8-1.8 5.7-3.6 8.6-5.4 2.9-1.8 5.8-3.5 8.8-5.2 2.9-1.7 5.9-3.4 8.9-5l9-4.8c3-1.6 6.1-3.1 9.2-4.6 3.1-1.5 6.2-2.9 9.3-4.3 3.1-1.4 6.2-2.8 9.4-4.1 3.2-1.3 6.3-2.6 9.5-3.9 3.2-1.3 6.4-2.5 9.6-3.7 3.2-1.2 6.5-2.3 9.7-3.4s6.5-2.2 9.8-3.2l9.9-3c3.3-1 6.7-1.9 10-2.7 3.4-.9 6.7-1.7 10.1-2.5 3.4-.8 6.8-1.5 10.2-2.2 3.4-.7 6.9-1.4 10.3-2 3.4-.6 6.9-1.2 10.4-1.7l10.5-1.5c3.5-.5 7-.9 10.6-1.2 3.5-.4 7.1-.7 10.6-1 3.6-.3 7.1-.5 10.7-.7 3.6-.2 7.2-.3 10.8-.4 3.6-.1 7.2-.1 10.8-.1h422.1v421.8h-422.1v857.4l-421.5-.5z" />
        </g>
      </g>
    </svg>
  );
}

function DfxAssetIconSNX({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 192 192"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="scale(.26458)">
        <linearGradient
          id="snx_a"
          x1={1621.495}
          x2={1621.495}
          y1={225.489}
          y2={-30.511}
          gradientTransform="matrix(.75 0 0 -.75 -853.271 169.115)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} style={{ stopColor: '#090220' }} />
          <stop offset={1} style={{ stopColor: '#170659' }} />
        </linearGradient>
        <circle cx={362.8} cy={362.8} r={362.8} fill={forceColor ?? 'url(#snx_a)'} />
        <path
          d="M243.3 272.6c-2.9-3.6-7.3-5.6-12-5.6h-96.9c-.8 0-1.5-.3-2.1-.8-.5-.5-.8-1.1-.8-1.8v-65.3c0-.7.3-1.3.8-1.8.6-.6 1.3-.9 2.1-.8h102.4c25.8 0 48.1 10.6 66.9 31.7l24.9 30.4-48.5 59.1-36.8-45.1zm179-44.7c18.7-20.9 41.1-31.4 67.2-31.4h102.1c.7-.1 1.4.2 1.9.6.5.5.7 1.2.6 2v65.3c0 .7-.2 1.3-.6 1.8-.5.6-1.2.9-1.9.8h-96.9c-4.6-.1-9 2-12 5.6l-71.4 86.9L483 447c2.9 3.3 7.2 5.3 11.6 5.2h96.9c.7-.1 1.5.3 1.9.8.4.6.7 1.4.6 2.1v65.3c0 .7-.2 1.3-.6 1.8-.5.6-1.2.9-1.9.8h-102c-26.1 0-48.3-10.6-66.9-31.7l-59.4-72.5-59.4 72.5c-18.7 21.1-41.1 31.7-67.2 31.7H134.4c-.7.1-1.5-.3-1.9-.8-.5-.6-.7-1.4-.6-2.1v-65.3c0-.7.2-1.3.6-1.8.5-.6 1.2-.9 1.9-.8h96.9c4.6 0 9-2.1 12-5.6l70.1-85.6 108.9-133.1z"
          fill={forceColor != null ? '#fff' : '#00d1ff'}
        />
      </g>
    </svg>
  );
}

function DfxAssetIconMKR({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="mkr_a"
          x1={300}
          x2={300}
          y1={602}
          y2={2}
          gradientTransform="matrix(1 0 0 -1 0 602)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} stopColor="#4fa89b" />
          <stop offset={1} stopColor="#6acebb" />
        </linearGradient>
      </defs>
      <g data-name="Layer 2">
        <g data-name="Layer 1">
          <circle cx={300} cy={300} r={300} fill={forceColor ?? 'url(#mkr_a)'} />
          <path
            d="M152.34 390V248.8l107.08 80.59V390h27.33v-66.3a15.94 15.94 0 0 0-6.35-12.7l-129.86-97.77A16 16 0 0 0 125 226v164Zm296.14 0V248.8L341.4 329.39V390h-27.33v-66.3a15.94 15.94 0 0 1 6.35-12.7l129.86-97.73A16 16 0 0 1 475.82 226v164Z"
            fill="#fff"
          />
        </g>
      </g>
    </svg>
  );
}

function DfxAssetIconENJ({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 141.7 141.7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx={70.9} cy={70.9} r={70.9} fill={forceColor ?? '#7866d5'} />
      <path
        d="M99.6 36.4c2.4.3 4.9.5 7.3.9 4.7.9 6.3 3.3 5.5 8.1-.2 1.8-1.6 3.2-3.4 3.5-1.1.2-2.3.3-3.4.2-15.6 0-31.1.1-46.7.1-2.3 0-4.7.2-7 .6C44.2 51 41.2 54.2 40.6 62c-.3 3.6-.3 3.6 3.4 3.6h63.8c1 0 1.9.3 2.8.8 2.8 1.8 2.1 4.7 2 7.3-.1 2.1-1.4 3.3-3.6 3.7-.9.2-1.8.2-2.8.2H42.6c-2.3 0-2.3 0-2.1 2.3.1 2.1.3 4.2.8 6.3 1 3.8 3.3 6.2 7.2 7.3 4.2 1.2 8.6 1.4 12.9 1.5h45.5c1.9 0 3.7.2 4.9 2 1.9 3 .9 6.9-2.1 8.8-.4.3-.8.5-1.3.6-3.3 1.1-6.7 1.3-10.2 1.4-14.3.3-28.5.3-42.7 0-4.4-.1-8.8-.6-13.1-1.5-10.1-2.1-15.2-7.3-16.9-17.5-.4-2.3-.6-4.7-.9-7.1V63.1c.2-1.8.4-3.7.6-5.5 1.3-11.5 6.5-17.2 17.8-19.8 4-.9 8.2-1.1 12.2-1.5l44.4.1z"
        fill="#fff"
      />
      <path
        d="M76.8 109.8c-7.2 0-14.3-.1-21.4-.2-4.5-.1-9-.6-13.4-1.6-10.9-2.3-16.5-8.1-18.3-18.9-.3-1.7-.5-3.4-.6-5-.1-.7-.2-1.4-.3-2.2v-19l.2-1.8c.1-1.3.3-2.5.4-3.7 1.4-12.3 7.2-18.6 19.3-21.3 3.2-.7 6.3-1 9.4-1.3l3-.3H99.9c.7.1 1.5.2 2.2.2 1.7.2 3.4.3 5.2.7 5.7 1.1 7.9 4.3 6.9 10.1-.3 2.5-2.3 4.6-5 5-1.2.2-2.4.3-3.7.3-15.5.1-31.1.2-46.6.2-2.2 0-4.5.2-6.7.6-6.9 1.1-9.2 3.6-9.8 10.6 0 .6-.1 1.2-.1 1.7h65.5c1.3 0 2.6.4 3.7 1 3.4 2.2 3.1 5.5 2.9 7.9 0 .3-.1.7-.1 1-.2 2.8-1.9 4.7-5 5.3-1.1.2-2.1.2-3.1.2H42.3v.4c.1 2.1.3 4.1.8 6.1.8 3.1 2.7 5 5.9 5.9 4.3 1.2 8.7 1.4 12.5 1.4 11.8.1 23.8.1 35.5.1h10c1.5 0 4.6 0 6.4 2.9 1.2 1.9 1.5 4.1 1 6.2s-1.8 3.9-3.7 5.1c-.5.3-1.1.6-1.7.8-3.7 1.2-7.5 1.4-10.7 1.5-7.1 0-14.3.1-21.5.1zM26.4 81.6c.1.7.2 1.4.2 2.1l.6 4.8c1.6 9.4 6.1 14 15.5 16 4.2.9 8.5 1.4 12.8 1.5 14.1.3 28.5.3 42.7 0 2.9-.1 6.4-.3 9.6-1.3.3-.1.6-.3.9-.4 1-.7 1.8-1.7 2.1-2.9.3-1.2.1-2.4-.6-3.5-.6-.9-1.4-1.2-3.3-1.2h-10c-11.6 0-23.7 0-35.5-.1-4 0-8.7-.2-13.4-1.6-4.5-1.2-7.3-4.1-8.4-8.6-.5-2.2-.8-4.5-.8-6.7v-.1c-.1-1.4-.2-2.4.6-3.3.8-.9 1.9-.9 3.3-.9h63.6c.8 0 1.7 0 2.5-.2 1.6-.3 2-1 2.1-2 0-.4.1-.7.1-1.1.2-2.5.2-3.7-1.2-4.6-.5-.3-1.2-.5-1.8-.5H44c-2.2 0-3.5 0-4.5-1s-.8-2.4-.7-4.5c.7-8.6 4.3-12.5 12.8-13.8 2.4-.4 4.8-.6 7.3-.7 15.6 0 31.1-.1 46.7-.1 1.1 0 2.1 0 3.1-.2 1-.1 1.8-.9 1.9-1.9.7-4-.3-5.3-4.1-6.1-1.6-.3-3.2-.5-4.8-.6-.7-.1-1.5-.2-2.2-.2H55.3l-3 .3c-3.1.3-6 .5-9 1.2C32.8 42 28.2 47.1 27 57.9c-.1 1.2-.3 2.4-.4 3.7l-.2 1.7v18.3z"
        fill="#fff"
      />
    </svg>
  );
}

function DfxAssetIconCOMP({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 2000 2000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1000 2000c552.3 0 1000-447.7 1000-1000S1552.3 0 1000 0 0 447.7 0 1000s447.7 1000 1000 1000z"
        fill={forceColor ?? '#070a0e'}
      />
      <path
        d="M577.7 1335.3c-29.9-18.3-48.2-50.8-48.2-85.8v-195.4c0-23.2 18.9-42 42.1-41.9 7.4 0 14.7 2 21.1 5.7l440.9 257.1c25.8 15 41.7 42.6 41.7 72.5v202.4c.1 27.8-22.4 50.4-50.2 50.4-9.3 0-18.5-2.6-26.4-7.4l-421-257.6zm657.2-370.9c25.8 15 41.6 42.7 41.7 72.5v410.8c0 12.1-6.5 23.3-17.1 29.2l-96.5 54.3c-1.2.7-2.5 1.2-3.9 1.6v-228.1c0-29.5-15.5-56.9-40.9-72.1L731 1001V743.5c0-23.2 18.9-42 42.1-41.9 7.4 0 14.7 2 21.1 5.7l440.7 257.1zm193-303.4c25.9 15 41.8 42.7 41.8 72.6v600c-.1 12.3-6.9 23.6-17.7 29.5l-91.5 49.4V994.8c0-29.5-15.5-56.8-40.7-72L924 685.4V441.2c0-7.4 2-14.7 5.6-21.1 11.7-20 37.4-26.8 57.4-15.2L1427.9 661z"
        style={{
          fillRule: 'evenodd',
          clipRule: 'evenodd',
          fill: forceColor != null ? '#fff' : '#00d395',
        }}
      />
    </svg>
  );
}

function DfxAssetIconBAT({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 2000 1719"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill={forceColor ?? '#662d91'} d="m2000 1716.64-995.21-569.86L0 1719l2000-2.36z" />
      <path fill={forceColor ?? '#9e1f63'} d="m1005.11 0-.32 1146.78L2000 1716.64 1005.11 0z" />
      <path fill={forceColor ?? '#ff5000'} d="m0 1719 1004.79-572.22L1005.11 0 0 1719z" />
      <path
        fill="#fff"
        stroke={forceColor != null ? '#fff' : '#ff5000'}
        strokeMiterlimit={10}
        strokeWidth={25}
        d="M1002.75 695.67 591.9 1381.92h823.54l-412.69-686.25z"
      />
    </svg>
  );
}

function DfxAssetIconCRV({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 810 810"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="a">
          <path d="M5.813 328H18v82H5.812Zm0 0" />
        </clipPath>
        <clipPath id="b">
          <path d="M5.813 278H15v81H5.812Zm0 0" />
        </clipPath>
        <clipPath id="c">
          <path d="M5.813 358H14v80H5.812Zm0 0" />
        </clipPath>
        <clipPath id="d">
          <path d="M240 .004h62V6h-62Zm0 0" />
        </clipPath>
        <clipPath id="e">
          <path d="M794 365h15.621v47H794Zm0 0" />
        </clipPath>
        <clipPath id="f">
          <path d="M5.813 308H11v79H5.812Zm0 0" />
        </clipPath>
        <clipPath id="g">
          <path d="M254 .004h57V12h-57Zm0 0" />
        </clipPath>
        <clipPath id="h">
          <path d="M199 .004h56V4h-56Zm0 0" />
        </clipPath>
        <clipPath id="i">
          <path d="M795 341h14.621v49H795Zm0 0" />
        </clipPath>
        <clipPath id="j">
          <path d="M793 317h16.621v51H793Zm0 0" />
        </clipPath>
        <clipPath id="k">
          <path d="M217 .004h52V9h-52Zm0 0" />
        </clipPath>
        <clipPath id="l">
          <path d="M803 389h6.621v45H803Zm0 0" />
        </clipPath>
        <clipPath id="m">
          <path d="M804 367h5.621v47H804Zm0 0" />
        </clipPath>
        <clipPath id="n">
          <path d="M802 346h7.621v47H802Zm0 0" />
        </clipPath>
        <clipPath id="o">
          <path d="M210 805h31v4.996h-31Zm0 0" />
        </clipPath>
        <clipPath id="p">
          <path d="M235 801h31v8.996h-31Zm0 0" />
        </clipPath>
        <clipPath id="q">
          <path d="M205 805h31v4.996h-31Zm0 0" />
        </clipPath>
        <clipPath id="r">
          <path d="M228 801h32v8.996h-32Zm0 0" />
        </clipPath>
      </defs>
      <DfxAssetIconCRV0 forceColor={forceColor} />
      <DfxAssetIconCRV1 forceColor={forceColor} />
      <DfxAssetIconCRV2 forceColor={forceColor} />
    </svg>
  );
}
function DfxAssetIconCRV0({ forceColor }: BaseAssetIconProps) {
  return (
    <>
      <path fill={forceColor ?? '#00f'} d="m347.727 491.273-61.25 13.57-7.754-28.69 65.32-11.829Zm0 0" />
      <path fill={forceColor ?? '#00f'} d="m286.477 504.844-53.497 18.031-11.437-29.86 57.18-16.863Zm0 0" />
      <path fill={forceColor ?? '#0028ff'} d="m343.852 464.324-65.13 11.828-6.78-33.543 68.613-10.078Zm0 0" />
      <path fill={forceColor ?? '#0018ff'} d="m278.723 476.152-57.18 16.864-10.465-34.895 60.863-15.512Zm0 0" />
      <path fill={forceColor ?? '#0000f1'} d="m351.797 513.18-57.18 14.93-8.336-23.266 61.446-13.57Zm0 0" />
      <path fill={forceColor ?? '#0000da'} d="m294.617 528.11-49.23 18.995-12.407-24.23 53.497-18.031Zm0 0" />
      <path fill={forceColor ?? '#0058ff'} d="M340.555 432.531 271.94 442.61l-6.011-37.414 71.718-8.144Zm0 0" />
      <path fill={forceColor ?? '#0048ff'} d="m271.941 442.61-60.863 15.511-8.918-39.164 63.77-13.762Zm0 0" />
      <path fill={forceColor ?? '#0014ff'} d="m414.793 482.547-67.066 8.726-3.684-26.949 70.555-7.172Zm0 0" />
      <path fill={forceColor ?? '#0000da'} d="m356.254 529.27-53.11 15.898-8.527-17.059 57.18-14.93Zm0 0" />
      <path fill={forceColor ?? '#0000e8'} d="m232.98 522.875-43.613 22.488-15.504-30.828 47.68-21.52Zm0 0" />
      <path fill={forceColor ?? '#0000c4'} d="m303.145 545.168-44.774 19.969-12.984-18.032 49.23-18.996Zm0 0" />
      <path fill={forceColor ?? '#003cff'} d="m414.598 457.152-70.555 7.172-3.488-31.793 73.847-5.043Zm0 0" />
      <path fill={forceColor ?? '#0008ff'} d="m221.543 493.016-47.488 21.52-13.953-36.06 50.976-20.355Zm0 0" />
      <path fill={forceColor ?? '#00f'} d="m415.18 502.71-63.383 10.47-4.07-21.907 67.066-8.726Zm0 0" />
      <path fill={forceColor ?? '#0000c8'} d="m245.387 547.105-39.543 23.075-16.477-24.817 43.613-22.488Zm0 0" />
      <path fill={forceColor ?? '#0090ff'} d="m337.648 397.05-71.718 8.145-4.844-40.52 74.234-6.01Zm0 0" />
      <path fill={forceColor ?? '#0084ff'} d="m265.93 405.195-63.77 13.762-7.363-42.457 66.289-11.824Zm0 0" />
      <path fill={forceColor ?? '#0068ff'} d="m414.402 427.488-73.847 5.043-2.907-35.48 76.563-2.715Zm0 0" />
      <path fill={forceColor ?? '#003cff'} d="m211.078 458.121-50.976 20.356-12.02-40.325 54.078-19.195Zm0 0" />
      <path fill={forceColor ?? '#0000f6'} d="m415.566 517.64-59.312 11.63-4.457-16.09 63.383-10.47Zm0 0" />
      <path fill={forceColor ?? '#0000d1'} d="m360.52 539.16-48.653 16.672-8.722-10.664 53.109-15.898Zm0 0" />
      <path fill={forceColor ?? '#0000ad'} d="m258.371 565.137-35.277 23.457-17.25-18.414 39.543-23.075Zm0 0" />
      <path fill={forceColor ?? '#00b'} d="m311.867 555.832-40.316 20.356-13.18-11.051 44.774-19.969Zm0 0" />
      <path fill={forceColor ?? '#009cff'} d="m414.21 394.336-76.562 2.715-2.328-38.387 78.89-.387Zm0 0" />
      <path fill={forceColor ?? '#0078ff'} d="m202.16 418.957-54.078 19.195-9.883-43.816 56.598-17.836Zm0 0" />
      <path fill={forceColor ?? '#0000ed'} d="M415.953 526.559 360.52 539.16l-4.266-9.89 59.312-11.63Zm0 0" />
      <path fill={forceColor ?? '#0cf'} d="m335.32 358.664-74.234 6.012-3.684-42.653 76.176-3.878Zm0 0" />
      <path fill={forceColor ?? '#002cff'} d="m484.57 477.895-69.777 4.652-.195-25.395 72.879-2.52Zm0 0" />
      <path fill={forceColor ?? '#00c4ff'} d="M261.086 364.676 194.602 376.5l-5.622-44.59 68.422-9.887Zm0 0" />
      <path fill={forceColor ?? '#0014ff'} d="m481.469 496.508-66.29 6.203-.386-20.164 69.777-4.652Zm0 0" />
      <path fill={forceColor ?? '#0050ff'} d="m487.477 454.633-72.88 2.52-.195-29.47 75.79-.386Zm0 0" />
      <path fill={forceColor ?? '#0000da'} d="m189.367 545.363-33.336 26.172-18.996-31.215 36.828-25.785Zm0 0" />
      <path fill={forceColor ?? '#00f'} d="m173.863 514.535-36.828 25.785-17.058-36.836 40.125-25.007Zm0 0" />
      <path fill={forceColor ?? '#0000a4'} d="m271.55 576.188-31.01 23.652-17.446-11.246 35.277-23.457Zm0 0" />
      <path fill={forceColor ?? '#0000b6'} d="m205.844 570.18-29.656 26.558-20.157-25.203 33.336-26.172Zm0 0" />
      <path fill={forceColor ?? '#0000d6'} d="m364.977 542.648-44.387 17.059-8.723-3.875 48.653-16.672Zm0 0" />
      <path fill={forceColor ?? '#0004ff'} d="m478.367 509.883-62.8 7.758-.387-14.93 66.289-6.203Zm0 0" />
      <path fill={forceColor ?? '#0078ff'} d="m490.191 427.297-75.789.191-.191-33.152 78.305 2.133Zm0 0" />
      <path fill={forceColor ?? '#0000bf'} d="m320.59 559.707-35.86 20.55-13.18-4.07 40.317-20.355Zm0 0" />
      <path fill={forceColor ?? '#00d8ff'} d="m414.21 358.277-78.89.387-1.742-40.52 80.633 1.942Zm0 0" />
      <path fill={forceColor ?? '#0034ff'} d="m160.102 478.477-40.125 25.007-14.922-41.097 43.027-24.235Zm0 0" />
      <path fill={forceColor ?? '#0000f1'} d="m416.344 529.465-51.367 13.183-4.457-3.296 55.433-12.793Zm0 0" />
      <path fill={forceColor ?? '#00009f'} d="m223.094 588.594-25.586 26.562-21.32-18.418 29.656-26.558Zm0 0" />
      <path fill={forceColor ?? '#00bcff'} d="m194.602 376.5-56.403 17.836-7.558-46.14 58.34-16.286Zm0 0" />
      <path fill={forceColor ?? '#00f'} d="m475.266 517.64-59.313 8.919-.387-8.918 62.801-7.758Zm0 0" />
      <path fill={forceColor ?? '#23ffd4'} d="m333.578 318.145-76.176 3.878-2.324-43.816 77.336-1.742Zm0 0" />
      <path fill={forceColor ?? '#00acff'} d="m492.516 396.469-78.305-2.133v-36.059l80.437 4.653Zm0 0" />
      <path fill={forceColor ?? '#1cffdb'} d="m257.402 322.023-68.226 9.887-3.684-45.754 69.586-7.949Zm0 0" />
      <path fill={forceColor ?? '#0000ad'} d="m284.73 580.258-26.746 23.652-17.445-4.07 31.012-23.653Zm0 0" />
      <path fill={forceColor ?? '#0070ff'} d="m148.082 438.152-43.027 24.235-12.211-44.98 45.355-23.071Zm0 0" />
      <path fill={forceColor ?? '#0000e8'} d="M369.242 539.547 328.926 556.8l-8.336 2.906 44.387-17.059Zm0 0" />
      <path fill={forceColor ?? '#000096'} d="m240.54 599.84-21.517 26.367-21.515-11.05 25.586-26.563Zm0 0" />
      <path fill={forceColor ?? '#26ffd1'} d="m414.21 320.086-80.632-1.941-1.164-41.68 81.988 4.457Zm0 0" />
      <path fill={forceColor ?? '#00f'} d="m472.164 519.77-55.82 9.5-.39-2.711 59.312-8.918Zm0 0" />
      <path fill={forceColor ?? '#04f'} d="m553.574 477.313-69.004.582 2.907-23.262 71.718 1.742Zm0 0" />
      <path fill={forceColor ?? '#002cff'} d="m547.563 493.988-66.094 2.52 3.101-18.613 69.004-.582Zm0 0" />
      <path fill={forceColor ?? '#0000d1'} d="m329.117 556.8-31.785 20.356-12.602 3.102 35.86-20.551Zm0 0" />
      <path fill={forceColor ?? '#00e0fb'} d="m494.648 362.93-80.437-4.653v-38.191l81.988 7.367Zm0 0" />
      <path fill={forceColor ?? '#00f'} d="m416.73 525.977-47.488 13.57-4.265 3.101 51.367-13.183Zm0 0" />
      <path fill={forceColor ?? '#0064ff'} d="m559.195 456.375-71.718-1.742 2.714-27.336 74.043 4.07Zm0 0" />
      <path fill={forceColor ?? '#19ffde'} d="m189.176 331.91-58.535 16.285-5.043-47.496 59.894-14.543Zm0 0" />
      <path fill={forceColor ?? '#001cff'} d="m541.555 505.813-63.188 4.07 3.102-13.375 66.094-2.52Zm0 0" />
      <path fill={forceColor ?? '#0000d1'} d="m156.031 571.535-23.261 29.082-21.903-31.215 26.168-29.082Zm0 0" />
      <path fill={forceColor ?? '#0000a8'} d="m176.188 596.738-19.77 28.887-23.648-25.008 23.261-29.082Zm0 0" />
      <path fill={forceColor ?? '#5aff9d'} d="m332.414 276.465-77.336 1.742-.969-44.008 77.918.582Zm0 0" />
      <path fill={forceColor ?? '#008cff'} d="m564.234 431.367-74.043-4.07 2.325-30.828 76.175 6.594Zm0 0" />
      <path fill={forceColor ?? '#00f'} d="m137.035 540.32-26.36 29.082-19.773-37.027 29.075-28.89Zm0 0" />
      <path fill={forceColor ?? '#00b8ff'} d="m138.2 394.336-45.356 23.266-9.305-47.5 47.102-21.907Zm0 0" />
      <path fill={forceColor ?? '#5aff9d'} d="m255.078 278.207-69.586 7.95-1.746-45.755 70.363-6.203Zm0 0" />
      <path fill={forceColor ?? '#0018ff'} d="m535.352 512.406-60.086 5.235 3.101-7.758 63.188-4.07Zm0 0" />
      <path fill={forceColor ?? '#0000bf'} d="m297.332 577.156-22.293 23.266-17.055 3.488 26.746-23.652Zm0 0" />
      <path fill={forceColor ?? '#00009b'} d="m257.984 603.91-17.445 25.98-21.32-3.683 21.32-26.172Zm0 0" />
      <path fill={forceColor ?? '#000092'} d="m197.508 615.156-16.281 28.5-24.614-18.031 19.575-28.887Zm0 0" />
      <path fill={forceColor ?? '#000cff'} d="m469.063 516.09-52.333 9.887-.386 3.488 55.82-9.695Zm0 0" />
      <path fill={forceColor ?? '#002cff'} d="m119.977 503.484-29.075 28.891-17.441-41.492 31.594-28.496Zm0 0" />
      <path fill={forceColor ?? '#5dff9a'} d="m414.402 280.922-81.988-4.457-.387-41.684 82.57 6.98Zm0 0" />
      <path fill={forceColor ?? '#2cffca'} d="m496.2 327.453-81.99-7.367.192-39.164 82.961 9.887Zm0 0" />
      <path fill={forceColor ?? '#00b8ff'} d="m568.691 403.063-76.175-6.594 2.132-33.54 77.918 9.114Zm0 0" />
      <path fill={forceColor ?? '#00f'} d="m373.313 529.852-36.247 16.867-7.949 10.082 40.125-17.254Zm0 0" />
      <path fill={forceColor ?? '#000cff'} d="m417.313 516.477-44 13.375-4.07 9.695 47.487-13.57Zm0 0" />
      <path fill={forceColor ?? '#0018ff'} d="m529.148 513.762-56.984 6.008 3.102-2.13 60.086-5.234Zm0 0" />
      <path fill={forceColor ?? '#0000f1'} d="m337.066 546.719-27.718 19.968-12.016 10.47 31.785-20.356Zm0 0" />
      <path fill={forceColor ?? '#56ffa0'} d="M185.492 286.156 125.598 300.7l-2.13-47.5 60.278-12.797Zm0 0" />
      <path fill={forceColor ?? '#000089'} d="m219.219 626.207-12.793 28.11-25.2-10.66 16.282-28.5Zm0 0" />
      <path fill={forceColor ?? '#006cff'} d="M105.055 462.387 73.46 490.883 59.309 445.52l33.535-28.114Zm0 0" />
      <path fill={forceColor ?? '#16ffe1'} d="m130.64 348.195-47.1 21.907-6.204-48.66 48.262-20.743Zm0 0" />
      <path fill={forceColor ?? '#06ecf1'} d="m572.566 372.043-77.918-9.113 1.551-35.477 79.278 11.824Zm0 0" />
      <path fill={forceColor ?? '#94ff63'} d="m332.027 234.781-77.918-.582.387-42.652 77.723 2.715Zm0 0" />
      <path fill={forceColor ?? '#0024ff'} d="m466.352 506.781-49.04 9.696-.582 9.5 52.332-9.887Zm0 0" />
      <path fill={forceColor ?? '#0000ad'} d="m275.04 600.422-13.567 25.398-20.934 4.07 17.445-25.98Zm0 0" />
      <path fill={forceColor ?? '#04f'} d="m609.781 494.957-62.218-.969 6.011-16.675 64.348 2.91Zm0 0" />
      <path fill={forceColor ?? '#005cff'} d="m617.922 480.223-64.348-2.91 5.621-20.938 66.48 5.043Zm0 0" />
      <path fill={forceColor ?? '#5dff9a'} d="m497.363 290.809-82.96-9.887.195-39.16 83.539 12.406Zm0 0" />
      <path fill={forceColor ?? '#94ff63'} d="m254.11 234.2-70.364 6.202.582-44.78 70.168-4.075Zm0 0" />
      <path fill={forceColor ?? '#0028ff'} d="m523.336 509.691-54.274 6.399 3.102 3.68 56.984-6.008Zm0 0" />
      <path fill={forceColor ?? '#0000df'} d="m309.348 566.688-18.414 22.683-15.895 11.05 22.293-23.265Zm0 0" />
      <path fill={forceColor ?? '#0038ff'} d="m601.254 505.23-59.7.582 6.009-11.824 62.218.969Zm0 0" />
      <path fill={forceColor ?? '#0078ff'} d="m625.676 461.418-66.48-5.043 5.038-25.008 68.422 7.367Zm0 0" />
      <path fill={forceColor ?? '#90ff66'} d="m414.598 241.762-82.57-6.98.19-40.52 82.575 9.113Zm0 0" />
      <path fill={forceColor ?? '#00008d'} d="m240.54 629.89-9.11 27.337-25.004-2.91 12.793-28.11Zm0 0" />
      <path fill={forceColor ?? '#001cff'} d="m377.188 513.762-32.95 16.285-7.172 16.672 36.247-16.867Zm0 0" />
      <path fill={forceColor ?? '#0034ff'} d="m592.531 510.66-57.18 1.746 6.204-6.593 59.504-.583Zm0 0" />
      <path fill={forceColor ?? '#0030ff'} d="m417.7 500.965-40.512 12.797-3.875 16.09 44-13.375Zm0 0" />
      <path fill={forceColor ?? '#00a0ff'} d="m632.656 438.734-68.422-7.367 4.457-28.305 70.164 10.079Zm0 0" />
      <path fill={forceColor ?? '#33ffc4'} d="m575.477 339.277-79.278-11.824 1.164-36.644 80.242 14.543Zm0 0" />
      <path fill={forceColor ?? '#00b0ff'} d="M92.844 417.406 59.309 445.52l-10.852-48.082 35.082-27.336Zm0 0" />
      <path fill={forceColor ?? '#0000c8'} d="m132.77 600.617-13.567 31.02-24.617-30.828 16.09-31.407Zm0 0" />
      <path fill={forceColor ?? '#0000a4'} d="m156.613 625.625-11.05 30.438-26.36-24.426 13.567-31.02Zm0 0" />
      <path fill={forceColor ?? '#0008ff'} d="m344.238 530.047-23.84 19.387-11.05 17.254 27.718-19.97Zm0 0" />
      <path fill={forceColor ?? '#00f'} d="M110.867 569.402 94.586 600.81l-22.094-36.641 18.41-31.793Zm0 0" />
      <path fill={forceColor ?? '#94ff63'} d="M183.746 240.402 123.47 253.2l.578-46.336 60.281-11.242Zm0 0" />
      <path fill={forceColor ?? '#0034ff'} d="m584.004 511.242-54.856 2.52 6.204-1.356 57.18-1.746Zm0 0" />
      <path fill={forceColor ?? '#003cff'} d="m517.906 500.383-51.554 6.398 2.71 9.309 54.274-6.399Zm0 0" />
      <path fill={forceColor ?? '#56ffa0'} d="M125.598 300.7 77.336 321.44l-2.715-48.855 48.848-19.387Zm0 0" />
      <path fill={forceColor ?? '#000089'} d="m181.227 643.656-8.141 29.66-27.524-17.254 11.051-30.437Zm0 0" />
      <path fill={forceColor ?? '#04f'} d="m464.023 491.66-46.324 9.305-.387 15.512 49.04-9.696Zm0 0" />
      <path fill={forceColor ?? '#00c8ff'} d="m638.855 413.14-70.164-10.077 3.875-31.02 71.524 12.793Zm0 0" />
      <path fill={forceColor ?? '#90ff66'} d="m498.137 254.168-83.54-12.406.196-38.387 83.344 14.926Zm0 0" />
      <path fill={forceColor ?? '#caff2c'} d="m332.219 194.262-77.723-2.715 1.742-40.711 77.145 4.848Zm0 0" />
      <path fill={forceColor ?? '#0000cd'} d="m290.934 589.371-9.692 24.621-19.77 11.828 13.567-25.398Zm0 0" />
      <path fill={forceColor ?? '#0028ff'} d="m90.902 532.375-18.41 31.793L53.11 522.68l20.352-31.797Zm0 0" />
      <path fill={forceColor ?? '#ceff29'} d="m254.496 191.547-70.168 4.074 2.52-42.46 69.39-2.325Zm0 0" />
      <path fill={forceColor ?? '#c7ff30'} d="m414.793 203.375-82.574-9.113 1.164-38.578 81.601 11.242Zm0 0" />
      <path fill={forceColor ?? '#00009f'} d="m261.473 625.82-5.621 26.559-24.422 4.848 9.304-27.336Zm0 0" />
      <path fill={forceColor ?? '#60ff97'} d="m577.605 305.352-80.242-14.543.774-36.641 80.633 17.062Zm0 0" />
      <path fill={forceColor ?? '#0040ff'} d="m576.055 506.781-52.72 2.91 5.813 4.07 54.856-2.519Zm0 0" />
      <path fill={forceColor ?? '#00f'} d="m320.398 549.238-14.734 21.91-14.73 18.223 18.414-22.683Zm0 0" />
      <path fill={forceColor ?? 'navy'} d="m206.426 654.316-5.235 28.696-28.105-9.696 8.14-29.66Zm0 0" />
      <path fill={forceColor ?? '#16ffe1'} d="m83.54 370.102-35.083 27.336-7.172-49.63 36.05-26.367Zm0 0" />
      <path fill={forceColor ?? '#0ff8e7'} d="m644.09 384.836-71.524-12.793 2.91-32.766 72.684 15.512Zm0 0" />
      <path fill={forceColor ?? '#0058ff'} d="m418.086 479.836-37.602 11.824-3.296 22.102 40.511-12.797Zm0 0" />
      <path fill={forceColor ?? '#0048ff'} d="m380.484 491.66-29.656 15.317-6.59 23.07 32.95-16.285Zm0 0" />
      <path fill={forceColor ?? '#0058ff'} d="m513.063 485.844-49.04 5.816 2.329 15.121 51.554-6.398Zm0 0" />
      <path fill={forceColor ?? '#0068ff'} d="M73.46 490.883 53.11 522.68 37.214 477.12l22.094-31.601Zm0 0" />
      <path fill={forceColor ?? '#0060ff'} d="m664.055 498.832-54.274-3.875 8.14-14.734 56.02 5.816Zm0 0" />
      <path fill={forceColor ?? '#0054ff'} d="m653.781 507.559-52.527-2.329 8.527-10.273 54.274 3.875Zm0 0" />
      <path fill={forceColor ?? '#0074ff'} d="m673.941 486.04-56.02-5.817 7.755-18.805 57.566 7.754Zm0 0" />
      <path fill={forceColor ?? '#006cff'} d="m461.89 471.496-43.804 8.34-.387 21.129 46.324-9.305Zm0 0" />
      <path fill={forceColor ?? '#0038ff'} d="m350.828 506.977-20.738 18.222-9.692 24.04 23.84-19.192Zm0 0" />
      <path fill={forceColor ?? '#0054ff'} d="m568.305 497.281-50.399 3.102 5.43 9.308 52.527-2.91Zm0 0" />
      <path fill={forceColor ?? '#c1ff36'} d="m498.137 218.3-83.344-14.925.191-36.45 82.961 17.063Zm0 0" />
      <path fill={forceColor ?? '#000084'} d="m231.43 657.227-2.52 27.918-27.719-1.942 5.235-28.887Zm0 0" />
      <path fill={forceColor ?? '#97ff60'} d="M123.469 253.2 74.62 272.585l.777-47.887 48.649-17.836Zm0 0" />
      <path fill={forceColor ?? '#004cff'} d="m643.316 511.629-50.785-.969 8.723-5.43 52.527 2.329Zm0 0" />
      <path fill={forceColor ?? '#d1ff26'} d="m184.328 195.621-60.281 11.242 3.297-44.203 59.504-9.5Zm0 0" />
      <path fill={forceColor ?? '#0090ff'} d="m683.242 469.172-57.566-7.754 6.98-22.684 59.117 10.274Zm0 0" />
      <path fill={forceColor ?? '#36ffc1'} d="m648.16 354.79-72.683-15.513 2.128-33.925 73.27 18.222Zm0 0" />
      <path fill={forceColor ?? '#8dff6a'} d="m578.77 271.23-80.633-17.062v-35.867l80.633 19.582Zm0 0" />
      <path fill={forceColor ?? '#ffea00'} d="m333.383 155.684-77.145-4.848 3.102-37.418 75.594 6.594Zm0 0" />
      <path fill={forceColor ?? '#00f'} d="m305.664 571.148-6.394 23.844-18.028 19 9.692-24.62Zm0 0" />
      <path fill={forceColor ?? '#0050ff'} d="m633.043 511.434-49.04-.192 8.528-.582 50.785.969Zm0 0" />
      <path fill={forceColor ?? '#0000c4'} d="m281.242 613.992-2.52 25.785-22.87 12.602 5.62-26.559Zm0 0" />
      <path fill={forceColor ?? '#00b0ff'} d="m691.773 449.008-59.117-10.274 6.2-25.593 60.476 12.605Zm0 0" />
      <path fill={forceColor ?? '#fbf100'} d="m414.984 166.926-81.601-11.242 1.55-35.672 80.438 13.18Zm0 0" />
      <path fill={forceColor ?? '#0080ff'} d="m508.797 466.652-46.906 4.844 2.132 20.164 49.04-5.816Zm0 0" />
      <path fill={forceColor ?? '#ffe200'} d="m256.238 150.836-69.39 2.324L191.5 114l67.84-.582Zm0 0" />
      <path fill={forceColor ?? '#53ffa4'} d="m77.336 321.441-36.05 26.368-3.298-49.825 36.633-25.398Zm0 0" />
      <path fill={forceColor ?? '#00b0ff'} d="M59.309 445.52 37.215 477.12l-12.02-48.273 23.262-31.41Zm0 0" />
      <path fill={forceColor ?? '#002cff'} d="m330.09 525.2-11.633 20.745-12.793 25.203 14.734-21.91Zm0 0" />
      <path fill={forceColor ?? '#0070ff'} d="m561.52 483.324-48.457 2.52 4.843 14.539 50.399-3.102Zm0 0" />
      <path fill={forceColor ?? '#00009f'} d="m145.563 656.063-2.325 29.468-27.523-24.039 3.488-29.855Zm0 0" />
      <path fill={forceColor ?? '#0000c8'} d="m119.203 631.637-3.488 29.855-25.586-30.437 4.457-30.246Zm0 0" />
      <path fill={forceColor ?? '#008cff'} d="m418.668 453.469-35.277 10.66-2.907 27.531 37.602-11.824Zm0 0" />
      <path fill={forceColor ?? '#005cff'} d="m623.352 506.59-47.489.191 8.14 4.461 49.04.192Zm0 0" />
      <path fill={forceColor ?? '#007cff'} d="m383.39 464.129-27.136 13.766-5.426 29.082 29.656-15.317Zm0 0" />
      <path fill={forceColor ?? '#00d8ff'} d="m699.332 425.746-60.477-12.605 5.235-28.305 61.445 15.316Zm0 0" />
      <path fill={forceColor ?? '#000089'} d="m173.086 673.316-1.16 28.887-28.688-16.672 2.325-29.468Zm0 0" />
      <path fill={forceColor ?? '#00009b'} d="m255.852 652.379.195 26.754-27.137 6.012 2.52-27.918Zm0 0" />
      <path fill={forceColor ?? '#63ff94'} d="m650.875 323.574-73.27-18.222 1.165-34.122 73.656 20.938Zm0 0" />
      <path fill={forceColor ?? '#0000fa'} d="m94.586 600.809-4.457 30.246-23.067-36.45 5.43-30.437Zm0 0" />
      <path fill={forceColor ?? '#009cff'} d="m460.148 446.488-41.48 6.98-.387 26.368 43.61-8.34Zm0 0" />
      <path fill={forceColor ?? '#f1fc06'} d="m497.945 183.988-82.96-17.062.386-33.735 81.602 19.196Zm0 0" />
      <path fill={forceColor ?? '#beff39'} d="m578.77 237.883-80.633-19.774-.192-34.12 80.051 21.906Zm0 0" />
      <path fill={forceColor ?? '#0070ff'} d="m356.254 477.895-18.024 17.062-8.14 30.242 20.738-18.222Zm0 0" />
      <path fill={forceColor ?? 'navy'} d="M201.191 683.203v28.305l-29.265-9.305 1.16-28.887Zm0 0" />
      <path fill={forceColor ?? '#006cff'} d="M614.047 497.281h-45.742l7.75 9.5 47.297-.191Zm0 0" />
      <path fill={forceColor ?? '#d4ff23'} d="m124.047 206.863-48.649 18.032 4.07-45.754 47.876-16.48Zm0 0" />
      <path fill={forceColor ?? '#19ffde'} d="m705.535 400.152-61.445-15.316 4.07-30.047 62.028 18.027Zm0 0" />
      <path fill={forceColor ?? '#ffdb00'} d="m186.848 153.16-59.504 9.5 6.203-40.71L191.5 114Zm0 0" />
      <path fill={forceColor ?? '#0024ff'} d="m72.492 564.168-5.43 30.437-20.156-41.293 6.203-30.632Zm0 0" />
      <path fill={forceColor ?? '#0094ff'} d="m555.703 465.102-46.906 1.55 4.265 19.192 48.458-2.52Zm0 0" />
      <path fill={forceColor ?? '#00acff'} d="m505.309 443-45.16 3.488 1.742 25.008 46.906-4.844Zm0 0" />
      <path fill={forceColor ?? '#ffb200'} d="m334.934 120.012-75.594-6.594 4.46-33.152 73.653 8.144Zm0 0" />
      <path fill={forceColor ?? '#13fce4'} d="m48.457 397.438-23.262 31.41-7.945-50.02 24.035-31.02Zm0 0" />
      <path fill={forceColor ?? '#0000f1'} d="m299.27 594.992.386 24.621-20.933 20.164 2.52-25.785Zm0 0" />
      <path fill={forceColor ?? '#ffbd00'} d="m415.371 133.191-80.437-13.18 2.328-31.6 78.5 14.925Zm0 0" />
      <path fill={forceColor ?? '#0020ff'} d="m318.457 545.945-3.293 22.68-15.894 26.367 6.394-23.844Zm0 0" />
      <path fill={forceColor ?? '#8dff6a'} d="M652.426 291.973 578.77 271.23v-33.347l73.656 23.265Zm0 0" />
      <path fill={forceColor ?? '#006cff'} d="m695.648 512.016-41.867-4.457 10.274-8.727 43.03 6.012Zm0 0" />
      <path fill={forceColor ?? '#0078ff'} d="m707.086 504.844-43.031-6.012 9.886-12.793 44.192 7.754Zm0 0" />
      <path fill={forceColor ?? '#97ff60'} d="m74.621 272.586-36.633 25.398.969-48.855 36.441-24.43Zm0 0" />
      <path fill={forceColor ?? '#0068ff'} d="m684.02 515.117-40.704-3.488 10.465-4.07 41.867 4.457Zm0 0" />
      <path fill={forceColor ?? '#008cff'} d="m718.133 493.793-44.192-7.754 9.301-16.867 45.356 9.887Zm0 0" />
      <path fill={forceColor ?? '#ffa700'} d="M259.34 113.418 191.5 114l6.59-34.898 65.71 1.164Zm0 0" />
      <path fill={forceColor ?? '#00c4ff'} d="m419.055 422.64-33.532 8.919-2.132 32.378 35.277-10.468Zm0 0" />
      <path fill={forceColor ?? '#000084'} d="m228.91 685.145 1.164 27.914-28.883-1.551v-28.305Zm0 0" />
      <path fill={forceColor ?? '#00b'} d="m278.723 639.777 2.714 25.785-25.39 13.57-.195-26.753Zm0 0" />
      <path fill={forceColor ?? '#0084ff'} d="m605.906 483.71-44.386-.386 6.785 13.957h45.742Zm0 0" />
      <path fill={forceColor ?? '#0068ff'} d="m338.23 494.957-8.918 19.578-10.855 31.602 11.633-20.938Zm0 0" />
      <path fill={forceColor ?? '#3cffba'} d="M710.188 372.816 648.16 354.79l2.715-31.215 62.605 20.746Zm0 0" />
      <path fill={forceColor ?? '#00d0ff'} d="m458.984 417.406-39.93 5.235-.386 30.828 41.48-6.98Zm0 0" />
      <path fill={forceColor ?? '#0064ff'} d="m53.11 522.68-6.204 30.633L30.43 507.75l6.785-30.629Zm0 0" />
      <path fill={forceColor ?? '#0068ff'} d="m672.777 514.148-39.734-2.714 10.273.195 40.704 3.488Zm0 0" />
      <path fill={forceColor ?? '#00b8ff'} d="m385.523 431.559-25.003 12.214-4.266 34.122 27.137-13.766Zm0 0" />
      <path fill={forceColor ?? '#00a4ff'} d="m728.598 479.059-45.356-9.887 8.531-20.164 46.325 12.215Zm0 0" />
      <path fill={forceColor ?? '#ebff0c'} d="m577.996 205.895-80.05-21.907-.973-31.601 79.082 23.847Zm0 0" />
      <path fill={forceColor ?? '#ffc800'} d="M496.973 152.387 415.37 133.19l.39-29.855 79.856 20.746Zm0 0" />
      <path fill={forceColor ?? '#00bcff'} d="m550.86 442.805-45.551.195 3.488 23.652 46.906-1.55Zm0 0" />
      <path fill={forceColor ?? '#0074ff'} d="m661.73 508.914-38.378-2.324 9.691 4.844 39.734 2.714Zm0 0" />
      <path fill={forceColor ?? '#00c4ff'} d="m738.098 461.223-46.325-12.215 7.364-23.262 47.101 14.73Zm0 0" />
      <path fill={forceColor ?? '#00dcfe'} d="m502.79 415.664-43.806 1.742 1.164 29.082 45.16-3.488Zm0 0" />
      <path fill={forceColor ?? '#00b0ff'} d="m360.52 443.773-15.895 15.512-6.395 35.672 18.024-17.062Zm0 0" />
      <path fill={forceColor ?? '#b7ff40'} d="m652.426 261.148-73.656-23.265-.97-31.988 73.266 25.59Zm0 0" />
      <path fill={forceColor ?? '#00a4ff'} d="m598.734 466.262-43.03-1.16 5.816 18.222 44.386.387Zm0 0" />
      <path fill={forceColor ?? '#63ff94'} d="m713.48 344.32-62.605-20.746 1.55-31.406 62.802 23.266Zm0 0" />
      <path fill={forceColor ?? '#000096'} d="m256.047 679.133 2.133 27.336-28.106 6.59-1.164-27.914Zm0 0" />
      <path fill={forceColor ?? '#53ffa4'} d="m41.285 347.809-24.035 31.02-3.684-50.407 24.422-30.438Zm0 0" />
      <path fill={forceColor ?? 'gold'} d="m127.344 162.66-47.875 16.48 7.754-42.07 46.324-15.12Zm0 0" />
      <path fill={forceColor ?? '#ff7a00'} d="M337.262 88.41 263.8 80.266l5.812-28.11 70.746 9.5Zm0 0" />
      <path fill={forceColor ?? '#ff9c00'} d="m191.5 114-57.953 7.95 8.914-36.255 55.629-6.593Zm0 0" />
      <path fill={forceColor ?? '#ff8900'} d="M415.762 103.336 337.453 88.41l2.906-26.754 75.79 16.285Zm0 0" />
      <path fill={forceColor ?? '#0084ff'} d="m651.648 499.61-37.601-2.329 9.305 9.309 38.378 2.324Zm0 0" />
      <path fill={forceColor ?? '#00009f'} d="m143.238 685.531 3.293 26.754-27.328-23.847-3.488-26.946Zm0 0" />
      <path fill={forceColor ?? '#00e4f8'} d="m746.238 440.477-46.906-14.73 6.203-25.595 47.68 17.063Zm0 0" />
      <path fill={forceColor ?? '#0000c8'} d="m115.715 661.492 3.488 26.946L93.617 658l-3.488-26.945Zm0 0" />
      <path fill={forceColor ?? '#0018ff'} d="m315.164 568.625 3.102 23.652-18.61 27.336-.386-24.62Zm0 0" />
      <path fill={forceColor ?? '#00acff'} d="m37.215 477.121-6.785 30.824-12.598-48.468 7.363-30.63Zm0 0" />
      <path fill={forceColor ?? '#000089'} d="m171.926 702.203 3.293 26.95-28.688-16.868-3.293-26.754Zm0 0" />
      <path fill={forceColor ?? '#005cff'} d="m329.313 514.535-.97 21.52-13.179 32.57 3.293-22.488Zm0 0" />
      <path fill={forceColor ?? '#16ffe1'} d="m419.25 387.938-32.176 6.98-1.55 36.64 33.53-8.917Zm0 0" />
      <path fill={forceColor ?? '#0000ed'} d="m299.656 619.613 5.235 24.625-23.454 21.324-2.714-25.785Zm0 0" />
      <path fill={forceColor ?? 'gold'} d="m576.055 176.234-79.082-23.847-1.356-28.305 77.531 25.59Zm0 0" />
      <path fill={forceColor ?? '#1cffdb'} d="m458.207 384.836-38.957 3.101-.195 34.704 39.93-5.235Zm0 0" />
      <path fill={forceColor ?? '#d7ff1f'} d="m75.398 224.7-36.441 24.429 4.848-46.918 35.664-23.07Zm0 0" />
      <path fill={forceColor ?? '#0000fa'} d="M90.129 631.055 93.617 658l-23.066-36.254-3.489-27.14Zm0 0" />
      <path fill={forceColor ?? '#02e8f4'} d="m547.176 417.215-44.387-1.55L505.31 443l45.55-.195Zm0 0" />
      <path fill={forceColor ?? '#ff6f00'} d="m263.8 80.266-65.71-1.164 8.531-29.274 62.992 2.328Zm0 0" />
      <path fill={forceColor ?? '#ff9800'} d="m495.617 124.082-79.855-20.746.386-25.395 77.727 22.102Zm0 0" />
      <path fill={forceColor ?? '#13fce4'} d="m387.074 394.918-23.648 10.277-2.906 38.578 25.003-12.214Zm0 0" />
      <path fill={forceColor ?? '#009cff'} d="m642.348 486.621-36.442-2.91 8.14 13.57 37.411 2.328Zm0 0" />
      <path fill={forceColor ?? '#00a8ff'} d="m344.625 459.285-6.977 18.223-8.336 37.027 8.918-19.578Zm0 0" />
      <path fill={forceColor ?? '#0cf'} d="m592.727 445.324-41.868-2.52 4.844 22.298 43.031 1.16Zm0 0" />
      <path fill={forceColor ?? '#1fffd7'} d="m753.215 417.215-47.68-17.063 4.653-27.336 48.261 19.582Zm0 0" />
      <path fill={forceColor ?? 'navy'} d="m201 711.508 3.293 26.949-29.074-9.305-3.293-26.949Zm0 0" />
      <path fill={forceColor ?? '#8dff6a'} d="m715.227 315.434-62.801-23.266v-31.02l62.8 25.786Zm0 0" />
      <path fill={forceColor ?? '#e1ff16'} d="m651.066 231.484-73.07-25.59-1.941-29.66 72.3 27.528Zm0 0" />
      <path fill={forceColor ?? '#23ffd4'} d="m501.238 385.227-43.031-.391.777 32.57 43.805-1.742Zm0 0" />
      <path fill={forceColor ?? '#0024ff'} d="m67.063 594.605 3.488 27.141-20.156-41.293-3.489-27.14Zm0 0" />
      <path fill={forceColor ?? '#0084ff'} d="m724.14 518.61-28.492-6.594 11.438-7.172 29.074 7.949Zm0 0" />
      <path fill={forceColor ?? '#00b'} d="m281.438 665.563 3.292 26.753-26.55 14.153-2.133-27.336Zm0 0" />
      <path fill={forceColor ?? '#0080ff'} d="m711.93 520.547-27.91-5.43 11.628-3.101 28.493 6.593Zm0 0" />
      <path fill={forceColor ?? '#0090ff'} d="m736.16 512.793-29.074-7.95 11.047-11.05 29.847 9.5Zm0 0" />
      <path fill={forceColor ?? '#0084ff'} d="m699.914 518.996-27.137-4.848 11.243.97 27.91 5.429Zm0 0" />
      <path fill={forceColor ?? '#00a0ff'} d="m747.98 503.293-29.847-9.5 10.465-14.734 30.238 11.437Zm0 0" />
      <path fill={forceColor ?? '#0cf4eb'} d="m363.426 405.195-14.535 13.762-4.266 40.328 15.895-15.512Zm0 0" />
      <path fill={forceColor ?? '#13fce4'} d="m25.195 428.848-7.363 30.629-8.336-50.016 7.754-30.633Zm0 0" />
      <path fill={forceColor ?? '#00b8ff'} d="m634.398 470.14-35.664-3.878 7.172 17.449 36.442 2.91Zm0 0" />
      <path fill={forceColor ?? '#ff6000'} d="M416.148 77.941 340.36 61.656l3.493-21.133 72.878 17.254Zm0 0" />
      <path fill={forceColor ?? '#43ffb4'} d="m758.45 392.398-48.263-19.582 3.293-28.496 48.653 22.098Zm0 0" />
      <path fill={forceColor ?? '#97ff60'} d="m37.988 297.984-24.422 30.438.97-49.824 24.421-29.47Zm0 0" />
      <path fill={forceColor ?? '#000084'} d="m230.074 713.059 3.293 26.949-29.074-1.551-3.102-26.95Zm0 0" />
      <path fill={forceColor ?? '#ff4e00'} d="m340.36 61.656-70.747-9.5 6.59-22.297 67.649 10.664Zm0 0" />
      <path fill={forceColor ?? '#ffab00'} d="m573.148 149.672-77.53-25.59-1.743-24.039 75.59 26.945Zm0 0" />
      <path fill={forceColor ?? '#008cff'} d="m688.281 513.375-26.55-4.46 11.046 5.233 27.137 4.848Zm0 0" />
      <path fill={forceColor ?? '#2cffca'} d="m544.852 388.91-43.614-3.683 1.551 30.437 44.387 1.55Zm0 0" />
      <path fill={forceColor ?? '#00b8ff'} d="m758.836 490.496-30.238-11.437 9.5-17.836 30.816 13.375Zm0 0" />
      <path fill={forceColor ?? '#ff9400'} d="m133.547 121.95-46.324 15.12 10.851-37.61 44.387-13.765Zm0 0" />
      <path fill={forceColor ?? '#ff6400'} d="m198.09 79.102-55.63 6.593 11.243-30.824 52.918-5.043Zm0 0" />
      <path fill={forceColor ?? '#0cf4eb'} d="m588.46 421.48-41.284-4.265 3.683 25.59 41.868 2.52Zm0 0" />
      <path fill={forceColor ?? '#50ffa7'} d="m458.016 349.555-38.38.968-.386 37.414 38.957-3.101Zm0 0" />
      <path fill={forceColor ?? '#4dffaa'} d="m419.637 350.523-31.594 4.457-.969 39.938 32.176-6.98Zm0 0" />
      <path fill={forceColor ?? '#b4ff43'} d="m715.227 286.934-62.801-25.786-1.36-29.664 62.414 27.918Zm0 0" />
      <path fill={forceColor ?? '#0058ff'} d="m328.344 536.055 5.426 22.492-15.504 33.73-3.102-23.652Zm0 0" />
      <path fill={forceColor ?? '#ff6f00'} d="m493.875 100.043-77.727-22.102.582-20.164 75.012 23.266Zm0 0" />
      <path fill={forceColor ?? '#0068ff'} d="m46.906 553.313 3.489 27.14-16.477-45.172-3.488-27.531Zm0 0" />
      <path fill={forceColor ?? '#ffe200'} d="m648.355 203.762-72.3-27.528-2.907-26.562 71.137 29.273Zm0 0" />
      <path fill={forceColor ?? '#0014ff'} d="m318.266 592.277 7.171 23.653-20.546 28.308-5.235-24.625Zm0 0" />
      <path fill={forceColor ?? '#00a0ff'} d="m337.648 477.508 1.16 20.164-10.464 38.383.969-21.52Zm0 0" />
      <path fill={forceColor ?? '#009cff'} d="m677.621 504.262-26.164-4.457 10.273 9.11 26.551 4.46Zm0 0" />
      <path fill={forceColor ?? '#53ffa4'} d="m500.656 352.46-42.64-2.714.191 35.09 43.031.39Zm0 0" />
      <path fill={forceColor ?? '#00d4ff'} d="m768.914 474.598-30.816-13.375 8.14-20.746 31.207 15.511Zm0 0" />
      <path fill={forceColor ?? '#ff3f00'} d="m269.613 52.156-62.992-2.328 10.27-23.266 59.312 3.297Zm0 0" />
      <path fill={forceColor ?? '#ffd300'} d="m79.469 179.14-35.664 23.07 8.914-43.233 34.504-21.907Zm0 0" />
      <path fill={forceColor ?? '#49ffad'} d="m388.043 354.98-23.066 8.336-1.551 41.88 23.648-10.278Zm0 0" />
      <path fill={forceColor ?? '#00dcfe'} d="m627.809 450.559-35.082-5.235 6.007 20.938 35.664 3.879Zm0 0" />
      <path fill={forceColor ?? '#66ff90'} d="M762.133 366.418 713.48 344.32l1.747-28.886 48.648 24.62Zm0 0" />
      <path fill={forceColor ?? '#09f0ee'} d="m348.89 418.957-5.43 16.676-5.812 41.875 6.977-18.223Zm0 0" />
      <path fill={forceColor ?? '#00009b'} d="m258.18 706.664 3.097 26.945-27.91 6.399-3.293-26.95Zm0 0" />
      <path fill={forceColor ?? '#0000e8'} d="m304.89 644.238 4.266 26.364-24.426 21.714-3.293-26.754Zm0 0" />
      <path fill={forceColor ?? '#00b0ff'} d="m667.738 491.66-25.39-5.039 9.3 12.988 25.973 4.653Zm0 0" />
      <path fill={forceColor ?? '#0cf4eb'} d="m777.445 455.988-31.207-15.511 6.977-23.262 31.594 18.027Zm0 0" />
      <path fill={forceColor ?? '#33ffc4'} d="m585.555 395.305-40.703-6.395 2.324 28.305 41.285 4.265Zm0 0" />
      <path fill={forceColor ?? '#56ffa0'} d="m543.883 358.473-43.418-6.012.773 32.766 43.614 3.683Zm0 0" />
      <path fill={forceColor ?? '#ff3b00'} d="m416.73 57.777-72.878-17.254 3.875-14.93 69.39 18.032Zm0 0" />
      <path fill={forceColor ?? '#0000a8'} d="m146.531 712.285 5.235 24.235-27.137-23.653-5.426-24.43Zm0 0" />
      <path fill={forceColor ?? '#d7ff1f'} d="m713.48 259.402-62.414-27.918-2.71-27.722 61.832 30.05Zm0 0" />
      <path fill={forceColor ?? '#ff8600'} d="m569.465 126.988-75.59-26.945-2.133-19 73.266 27.918Zm0 0" />
      <path fill={forceColor ?? '#0000cd'} d="m119.203 688.438 5.426 24.43-25.39-30.247L93.616 658Zm0 0" />
      <g clipPath="url(#a)">
        <path fill={forceColor ?? '#53ffa4'} d="m17.25 378.828-7.754 30.633-3.684-50.797 7.754-30.242Zm0 0" />
      </g>
      <path fill={forceColor ?? '#46ffb1'} d="m364.977 363.316-13.762 11.829-2.324 43.812 14.535-13.762Zm0 0" />
      <path fill={forceColor ?? '#ff2900'} d="M343.852 40.523 276.203 29.86l7.754-15.507 63.77 11.242Zm0 0" />
      <path fill={forceColor ?? '#00b0ff'} d="m30.43 507.75 3.488 27.531-12.598-48.273-3.488-27.531Zm0 0" />
      <path fill={forceColor ?? '#80ff77'} d="m458.402 312.719-38.57-1.746-.195 39.55 38.379-.777Zm0 0" />
      <path fill={forceColor ?? '#000092'} d="m175.219 729.152 4.847 24.04-28.3-16.672-5.235-24.235Zm0 0" />
      <path fill={forceColor ?? '#ffb900'} d="m644.285 178.945-71.137-29.273-3.683-22.684 69.586 30.633Zm0 0" />
      <path fill={forceColor ?? '#80ff77'} d="m419.832 310.973-31.789 2.132v41.875l31.594-4.457Zm0 0" />
      <path fill={forceColor ?? '#16ffe1'} d="m622.965 428.266-34.504-6.786 4.266 24.04 35.082 5.039Zm0 0" />
      <path fill={forceColor ?? '#ff4e00'} d="M491.742 81.043 416.73 57.777l.387-14.152 71.91 23.652Zm0 0" />
      <path fill={forceColor ?? '#8aff6d'} d="m763.875 340.055-48.648-24.621v-28.5l48.648 26.945Zm0 0" />
      <path fill={forceColor ?? '#d7ff1f'} d="m38.957 249.129-24.422 29.469 5.621-47.5 23.649-28.887Zm0 0" />
      <path fill={forceColor ?? '#00f'} d="m93.617 658 5.621 24.621-22.87-35.863-5.817-25.012Zm0 0" />
      <path fill={forceColor ?? '#00c8ff'} d="m659.402 475.957-25.004-5.816 7.95 16.48 25.39 5.04Zm0 0" />
      <path fill={forceColor ?? '#80ff77'} d="m501.043 318.145-42.64-5.426-.387 36.836 42.449 2.906Zm0 0" />
      <path fill={forceColor ?? '#29ffce'} d="m784.809 435.242-31.594-18.027 5.234-24.817 31.98 20.551Zm0 0" />
      <path fill={forceColor ?? '#ff3000'} d="m206.621 49.828-52.918 5.043 13.57-24.234 49.426-4.075Zm0 0" />
      <path fill={forceColor ?? '#ff5900'} d="M142.46 85.695 98.075 99.461l13.957-31.988 41.672-12.602Zm0 0" />
      <path fill={forceColor ?? '#0098ff'} d="m724.723 527.719-12.793-7.172 12.21-1.938 12.989 7.95Zm0 0" />
      <path fill={forceColor ?? '#009cff'} d="m737.129 526.559-12.988-7.95 12.02-5.816 13.179 9.11Zm0 0" />
      <path fill={forceColor ?? '#000084'} d="m204.293 738.457 4.652 23.848-28.879-9.114-4.847-24.039Zm0 0" />
      <path fill={forceColor ?? '#0098ff'} d="m712.316 525.395-12.402-6.399 12.016 1.55 12.793 7.173Zm0 0" />
      <path fill={forceColor ?? '#80ff77'} d="m388.043 313.105-23.066 6.012v44.2l23.066-8.337Zm0 0" />
      <path fill={forceColor ?? '#00a4ff'} d="m749.34 521.902-13.18-9.109 11.82-9.5 13.184 10.664Zm0 0" />
      <path fill={forceColor ?? '#009cff'} d="m338.809 497.672 6.98 21.324-12.02 39.55-5.425-22.491Zm0 0" />
      <path fill={forceColor ?? '#00b'} d="m284.73 692.316 3.102 27.141-26.36 14.152-3.292-26.945Zm0 0" />
      <path fill={forceColor ?? '#0054ff'} d="m333.77 558.547 8.918 22.68-17.25 34.703-7.172-23.653Zm0 0" />
      <path fill={forceColor ?? '#ff1600'} d="M276.203 29.86 216.7 26.562l11.63-16.477 55.628 4.266Zm0 0" />
      <path fill={forceColor ?? '#5aff9d'} d="m584.39 367.195-40.507-8.722.969 30.437 40.703 6.395Zm0 0" />
      <path fill={forceColor ?? '#00a0ff'} d="m700.688 519.578-12.407-6.203 11.633 5.621 12.402 6.399Zm0 0" />
      <path fill={forceColor ?? '#0028ff'} d="m70.55 621.746 5.817 25.012-19.77-40.715-6.202-25.59Zm0 0" />
      <path fill={forceColor ?? '#06ecf1'} d="m343.46 435.633 2.52 18.805-7.171 43.234-1.16-20.164Zm0 0" />
      <path fill={forceColor ?? '#fbf100'} d="m710.188 233.813-61.833-30.051-4.07-24.817 60.86 31.602Zm0 0" />
      <path fill={forceColor ?? '#80ff77'} d="m544.46 326.871-43.417-8.726-.578 34.316 43.418 6.012Zm0 0" />
      <path fill={forceColor ?? '#00b4ff'} d="m761.164 513.957-13.184-10.664 10.856-12.797 13.57 12.215Zm0 0" />
      <path fill={forceColor ?? '#02e8f4'} d="m652.426 457.734-24.617-7.175 6.59 19.582 25.003 5.816Zm0 0" />
      <path fill={forceColor ?? '#ff6400'} d="m565.008 108.96-73.266-27.917-2.715-13.766 70.746 28.5Zm0 0" />
      <path fill={forceColor ?? '#ff9100'} d="m87.223 137.07-34.504 21.907 12.601-38.965L98.074 99.46Zm0 0" />
      <path fill={forceColor ?? '#46ffb1'} d="m790.238 412.95-31.789-20.552 3.684-25.98 31.98 22.879Zm0 0" />
      <path fill={forceColor ?? '#39ffbe'} d="m619.668 404.031-34.113-8.726 2.906 26.175 34.504 6.786Zm0 0" />
      <path fill={forceColor ?? '#f20'} d="m417.117 43.625-69.39-18.031 4.265-8.14L417.7 35.675Zm0 0" />
      <path fill={forceColor ?? '#adff49'} d="m763.875 313.879-48.648-27.14-1.747-27.337 48.457 29.082Zm0 0" />
      <path fill={forceColor ?? '#43ffb4'} d="m351.215 375.145-4.844 14.925-2.91 45.563 5.43-16.676Zm0 0" />
      <path fill={forceColor ?? '#00b0ff'} d="m689.64 510.66-12.019-6.398 10.66 9.113 12.407 6.203Zm0 0" />
      <path fill={forceColor ?? '#ff9800'} d="m639.05 157.621-69.585-30.633-4.457-18.027 67.84 31.406Zm0 0" />
      <path fill={forceColor ?? '#0014ff'} d="m325.438 615.93 5.039 25.785-21.32 28.887-4.266-26.364Zm0 0" />
      <path fill={forceColor ?? '#b4ff43'} d="m459.18 275.105-39.157-4.457-.191 40.325 38.57 1.746Zm0 0" />
      <path fill={forceColor ?? '#00c8ff'} d="m772.406 502.71-13.57-12.214 10.078-15.898 13.57 14.156Zm0 0" />
      <path fill={forceColor ?? '#00008d'} d="m233.367 740.008 4.266 23.847-28.688-1.55-4.652-23.848Zm0 0" />
      <path fill={forceColor ?? '#ff3800'} d="m489.027 67.277-71.91-23.652.582-7.95 68.422 23.653Zm0 0" />
      <path fill={forceColor ?? '#13fce4'} d="m17.832 459.477 3.488 27.53-8.14-49.823-3.684-27.723Zm0 0" />
      <path fill={forceColor ?? '#adff49'} d="m502.402 283.441-43.222-8.336-.778 37.614 42.641 5.426Zm0 0" />
      <path fill={forceColor ?? '#b7ff40'} d="m420.023 270.648-32.562-.582.582 43.04 31.789-2.133Zm0 0" />
      <path fill={forceColor ?? '#f60b00'} d="m347.727 25.594-63.77-11.242 8.336-8.532 59.7 11.633Zm0 0" />
      <path fill={forceColor ?? '#80ff77'} d="m364.977 319.117-13.762 9.692v46.336l13.762-11.829Zm0 0" />
      <g clipPath="url(#b)">
        <path fill={forceColor ?? '#97ff60'} d="m13.566 328.422-7.754 30.242.97-50.02 7.753-29.855Zm0 0" />
      </g>
      <path fill={forceColor ?? '#00c0ff'} d="m679.754 498.445-12.016-6.785 9.883 12.602 12.02 6.398Zm0 0" />
      <path fill={forceColor ?? '#0068ff'} d="m50.395 580.453 6.203 25.59-16.282-44.781-6.398-25.98Zm0 0" />
      <path fill={forceColor ?? '#1fffd7'} d="m647.191 436.988-24.226-8.722 4.844 22.293 24.617 7.175Zm0 0" />
      <path fill={forceColor ?? '#00e0fb'} d="m782.484 488.754-13.761-14.156 8.722-18.61 13.762 16.285Zm0 0" />
      <path fill={forceColor ?? '#80ff77'} d="M584.973 338.309 544.46 326.87l-.578 31.602 40.508 8.722Zm0 0" />
      <path fill={forceColor ?? '#66ff90'} d="m794.113 389.297-31.98-22.879 1.742-26.363 31.984 25.007Zm0 0" />
      <path fill={forceColor ?? '#fc0'} d="m705.145 210.547-60.86-31.602-5.234-21.324 59.699 32.957Zm0 0" />
      <path fill={forceColor ?? '#aaff4d'} d="m546.402 294.883-44-11.442-1.359 34.704 43.418 8.726Zm0 0" />
      <path fill={forceColor ?? '#baff3c'} d="m387.46 270.066-23.839 3.684 1.356 45.367 23.066-6.012Zm0 0" />
      <path fill={forceColor ?? '#5aff9d'} d="m618.313 378.246-33.922-11.05 1.164 28.109 34.113 8.726Zm0 0" />
      <path fill={forceColor ?? '#ff4e00'} d="m559.773 95.777-70.746-28.5-2.906-7.949 68.031 28.5Zm0 0" />
      <path fill={forceColor ?? '#ffd000'} d="m43.805 202.21-23.649 28.888 9.887-44.395 22.676-27.726Zm0 0" />
      <path fill={forceColor ?? '#d1ff26'} d="m761.938 288.484-48.458-29.082-3.293-25.59 47.875 31.02Zm0 0" />
      <path fill={forceColor ?? '#f10800'} d="m216.89 26.563-49.617 4.074 15.313-17.254 45.742-3.297Zm0 0" />
      <path fill={forceColor ?? '#00d8ff'} d="m671.227 483.52-11.825-7.563 8.336 15.703 12.016 6.785Zm0 0" />
      <path fill={forceColor ?? '#0000ed'} d="m309.156 670.602 2.906 27.144-24.23 21.711-3.102-27.14Zm0 0" />
      <path fill={forceColor ?? '#ff7a00'} d="m632.656 140.367-67.648-31.406-5.235-13.184 65.711 31.989Zm0 0" />
      <path fill={forceColor ?? '#df0000'} d="m283.957 14.352-55.629-4.266 12.598-8.918 51.367 4.652Zm0 0" />
      <path fill={forceColor ?? '#e4ff13'} d="m460.535 237.691-40.512-7.367v40.324l39.157 4.457Zm0 0" />
      <path fill={forceColor ?? '#fa0f00'} d="m417.7 35.676-65.708-18.223 4.457-1.164 61.637 17.836Zm0 0" />
      <path fill={forceColor ?? '#ff2500'} d="m153.703 54.871-41.672 12.602 16.477-25.399 38.765-11.437Zm0 0" />
      <path fill={forceColor ?? '#16ffe1'} d="m791.207 472.273-13.762-16.285 7.364-20.746 13.761 18.227Zm0 0" />
      <path fill={forceColor ?? '#00009f'} d="m261.473 733.61 3.875 24.042-27.715 6.203-4.266-23.847Zm0 0" />
      <path fill={forceColor ?? '#ff2500'} d="M486.121 59.328 417.7 35.676l.387-1.551 64.934 23.457Zm0 0" />
      <path fill={forceColor ?? '#dbff1c'} d="m504.922 248.934-44.387-11.243-1.355 37.414 43.222 8.336Zm0 0" />
      <path fill={forceColor ?? '#ebff0c'} d="m420.023 230.324-33.918-3.105 1.356 42.847 32.562.582Zm0 0" />
      <path fill={forceColor ?? '#02e8f4'} d="m345.98 454.438 8.141 20.16-8.332 44.398-6.98-21.324Zm0 0" />
      <path fill={forceColor ?? '#3cffba'} d="m643.895 414.5-24.227-10.469 3.297 24.235 24.226 8.722Zm0 0" />
      <path fill={forceColor ?? '#0098ff'} d="m345.79 518.996 10.464 21.715-13.567 40.516-8.917-22.68Zm0 0" />
      <path fill={forceColor ?? '#43ffb4'} d="m346.371 390.07 3.102 17.45-3.493 46.918-2.52-18.805Zm0 0" />
      <path fill={forceColor ?? '#df0000'} d="M351.992 17.453 292.293 5.82l8.914-1.164 55.242 11.633Zm0 0" />
      <path fill={forceColor ?? '#0000b2'} d="m151.766 736.52 5.039 20.16-26.555-23.262-5.621-20.55Zm0 0" />
      <path fill={forceColor ?? '#8aff6d'} d="m795.86 365.063-31.985-25.008v-26.176l31.984 27.336Zm0 0" />
      <path fill={forceColor ?? '#0000da'} d="m124.629 712.867 5.43 20.551-24.618-29.469-6.203-21.328Zm0 0" />
      <path fill={forceColor ?? '#a7ff50'} d="m587.105 309.035-40.898-14.152-1.746 31.988 40.512 11.438Zm0 0" />
      <path fill={forceColor ?? '#80ff77'} d="m351.215 328.809-4.844 13.183v48.078l4.844-14.925Zm0 0" />
      <path fill={forceColor ?? '#0cf4eb'} d="m664.055 466.262-11.63-8.528 6.977 18.223 11.825 7.563Zm0 0" />
      <path fill={forceColor ?? '#00a8ff'} d="m721.04 536.055 3.487-8.336 12.602-1.16-3.684 9.109Zm0 0" />
      <path fill={forceColor ?? '#ffab00'} d="m698.75 190.578-59.7-32.957-6.394-17.254 58.535 33.735Zm0 0" />
      <path fill={forceColor ?? '#00b0ff'} d="m33.918 535.281 6.398 25.98-12.406-47.5-6.59-26.753Zm0 0" />
      <path fill={forceColor ?? '#d4ff23'} d="m549.504 263.281-44.582-14.347-2.52 34.507 43.805 11.442Zm0 0" />
      <path fill={forceColor ?? '#00acff'} d="m709.023 533.148 3.293-7.753 12.211 2.324-3.488 8.336Zm0 0" />
      <path fill={forceColor ?? '#f50'} d="M98.074 99.46 65.32 120.013l16.282-33.153 30.43-19.386Zm0 0" />
      <g clipPath="url(#c)">
        <path fill={forceColor ?? '#53ffa4'} d="m9.496 409.46 3.684 27.724-3.684-50.602-3.684-27.918Zm0 0" />
      </g>
      <path fill={forceColor ?? '#00009b'} d="m180.066 753.191 4.457 19.774-27.718-16.285-5.04-20.16Zm0 0" />
      <path fill={forceColor ?? '#ff3f00'} d="m554.152 87.828-68.03-28.5-3.102-1.746 64.933 28.113Zm0 0" />
      <path fill={forceColor ?? '#00acff'} d="m733.445 535.668 3.684-9.11 12.21-4.656-3.878 10.082Zm0 0" />
      <path fill={forceColor ?? '#beff39'} d="m363.621 273.75-14.73 7.754 2.324 47.305 13.762-9.692Zm0 0" />
      <path fill={forceColor ?? '#0050ff'} d="m342.688 581.227 5.816 25.203-18.027 35.285-5.04-25.785Zm0 0" />
      <path fill={forceColor ?? '#80ff77'} d="m618.89 351.879-33.917-13.57-.582 28.886 33.922 11.051Zm0 0" />
      <path fill={forceColor ?? '#30ffc7'} d="m798.57 453.469-13.761-18.227 5.43-22.293 13.952 20.356Zm0 0" />
      <path fill={forceColor ?? '#f1fc06'} d="m758.063 264.832-47.875-31.02-5.043-23.265 47.488 32.766Zm0 0" />
      <path fill={forceColor ?? '#00b4ff'} d="m697.395 527.137 3.293-7.559 11.628 5.817-3.293 7.753Zm0 0" />
      <path fill={forceColor ?? '#00f'} d="m99.238 682.621 6.008 21.328-22.289-35.285-6.59-21.906Zm0 0" />
      <path fill={forceColor ?? '#ff6400'} d="m625.484 127.766-65.71-31.989-5.622-7.949 63.383 31.988Zm0 0" />
      <path fill={forceColor ?? '#00b8ff'} d="m745.656 531.984 3.684-10.082 11.824-7.945-3.879 11.242Zm0 0" />
      <path fill={forceColor ?? 'gold'} d="m462.277 201.629-42.254-10.082v38.777l40.512 7.367Zm0 0" />
      <path fill={forceColor ?? '#f1fc06'} d="m386.105 227.219-25.39 1.36 2.71 45.171 24.036-3.684Zm0 0" />
      <path fill={forceColor ?? '#ed0400'} d="m418.086 34.125-61.637-17.836 4.653 5.816 57.37 17.254Zm0 0" />
      <path fill={forceColor ?? '#ff1e00'} d="m483.02 57.582-64.934-23.457.387 5.234 61.25 22.684Zm0 0" />
      <path fill={forceColor ?? '#ffe200'} d="m508.215 215.781-45.938-14.152-1.742 36.062 44.387 11.243Zm0 0" />
      <path fill={forceColor ?? '#00c0ff'} d="m686.54 518.219 3.1-7.559 11.048 8.918-3.293 7.754Zm0 0" />
      <path fill={forceColor ?? '#d7ff1f'} d="m14.535 278.598-7.754 30.047 5.817-47.883 7.558-29.664Zm0 0" />
      <path fill={forceColor ?? '#000092'} d="m208.945 762.305 3.875 19.773-28.297-9.113-4.457-19.774Zm0 0" />
      <path fill={forceColor ?? '#fc0'} d="m420.023 191.547-35.855-5.817 1.937 41.489 33.918 3.105Zm0 0" />
      <path fill={forceColor ?? '#00c4ff'} d="m757.285 525.2 3.88-11.243 11.046-11.246-4.07 12.797Zm0 0" />
      <path fill={forceColor ?? '#5dff9a'} d="m642.348 390.848-24.035-12.602 1.355 25.785 24.227 10.469Zm0 0" />
      <path fill={forceColor ?? '#26ffd1'} d="m658.82 447.07-11.629-10.082 5.235 20.746 11.824 8.528Zm0 0" />
      <path fill={forceColor ?? '#aaff4d'} d="m795.86 341.215-31.985-27.336-1.938-25.395 31.79 29.274Zm0 0" />
      <g clipPath="url(#d)">
        <path fill={forceColor ?? '#c80000'} d="m292.293 5.82-51.367-4.652L254.3.004l46.906 4.652Zm0 0" />
      </g>
      <path fill={forceColor ?? '#0000c4'} d="m287.832 719.457 3.684 24.234-26.168 13.961-4.07-24.043Zm0 0" />
      <path fill={forceColor ?? '#00d0ff'} d="m676.652 506.59 3.102-8.145 9.887 12.215-3.102 7.559Zm0 0" />
      <path fill={forceColor ?? '#cd0000'} d="m228.328 10.086-45.742 3.297 16.668-9.5 41.672-2.715Zm0 0" />
      <path fill={forceColor ?? '#ceff29'} d="m591.176 280.34-41.672-17.059-3.297 31.602 40.898 14.152Zm0 0" />
      <path fill={forceColor ?? '#ff3800'} d="M547.953 85.695 483.02 57.582l-3.102 4.461 61.637 27.14Zm0 0" />
      <path fill={forceColor ?? '#fbf100'} d="m554.152 233.035-45.937-17.254-3.293 33.153 44.582 14.347Zm0 0" />
      <path fill={forceColor ?? '#4dffaa'} d="m804.191 433.305-13.761-20.356 3.683-23.652 13.762 22.488Zm0 0" />
      <path fill={forceColor ?? '#0030ff'} d="m76.367 646.758 6.59 21.906-19.383-39.937-6.976-22.684Zm0 0" />
      <path fill={forceColor ?? '#d10000'} d="M356.45 16.29 301.206 4.655l9.11 6.399 50.785 11.05Zm0 0" />
      <path fill={forceColor ?? '#ff9100'} d="m691.191 174.102-58.343-33.735-7.364-12.601 56.79 34.12Zm0 0" />
      <path fill={forceColor ?? '#0014ff'} d="m330.477 641.715 3.101 27.336-21.32 28.695-3.102-27.144Zm0 0" />
      <path fill={forceColor ?? '#ffa700'} d="m464.605 167.895-44.582-12.989v36.64l42.254 10.083Zm0 0" />
      <path fill={forceColor ?? '#00d8ff'} d="m768.336 515.508 4.07-12.797 10.078-13.957-4.265 14.539Zm0 0" />
      <path fill={forceColor ?? '#a4ff53'} d="m621.414 325.125-34.309-16.09-2.132 29.274 33.918 13.57Zm0 0" />
      <path fill={forceColor ?? '#f50'} d="m617.535 119.816-63.383-31.988-6.199-2.133 61.055 31.602Zm0 0" />
      <path fill={forceColor ?? '#ffdb00'} d="m752.633 243.313-47.488-32.766-6.395-19.969 46.71 33.93Zm0 0" />
      <path fill={forceColor ?? '#ff1e00'} d="m479.918 62.043-61.445-22.684.39 11.828 57.758 21.325Zm0 0" />
      <path fill={forceColor ?? '#ff8d00'} d="m52.719 158.977-22.676 27.726 14.148-39.746 21.13-26.945Zm0 0" />
      <path fill={forceColor ?? '#ffb600'} d="m512.48 184.762-47.875-16.867-2.328 33.734 45.938 14.152Zm0 0" />
      <path fill={forceColor ?? '#f10800'} d="m418.473 39.36-57.371-17.255 4.652 12.989 53.11 16.093Zm0 0" />
      <path fill={forceColor ?? '#e40000'} d="m167.273 30.637-38.765 11.437L147.5 23.852l35.086-10.47Zm0 0" />
      <path fill={forceColor ?? '#02e8f4'} d="m668.32 492.242 2.907-8.722 8.527 14.925-3.102 8.145Zm0 0" />
      <path fill={forceColor ?? '#ffc100'} d="m384.168 185.73-27.719-1.16 4.266 43.813 25.39-1.164Zm0 0" />
      <path fill={forceColor ?? '#ff9800'} d="m420.023 154.906-38.57-8.336 2.715 39.16 35.855 5.817Zm0 0" />
      <path fill={forceColor ?? '#000096'} d="m237.633 763.855 3.293 19.774-28.106-1.55-3.875-19.774Zm0 0" />
      <path fill={forceColor ?? '#f8f500'} d="m360.715 228.383-16.285 5.625 4.46 47.496 14.731-7.754Zm0 0" />
      <path fill={forceColor ?? '#43ffb4'} d="M655.332 426.324 643.895 414.5l3.296 22.488 11.63 10.082Zm0 0" />
      <path fill={forceColor ?? '#13fce4'} d="m21.32 487.008 6.59 26.754-8.14-49.242-6.59-27.336Zm0 0" />
      <path fill={forceColor ?? '#ff3800'} d="m541.555 89.184-61.832-27.141-3.293 10.469 58.73 25.98Zm0 0" />
      <path fill={forceColor ?? '#c1ff36'} d="m348.89 281.504-5.43 11.437 2.911 49.051 4.844-13.183Zm0 0" />
      <path fill={forceColor ?? '#80ff77'} d="m642.926 366.809-24.035-14.93-.578 26.367 24.035 12.602Zm0 0" />
      <path fill={forceColor ?? '#ff7e00'} d="m467.125 137.266-47.293-15.512.191 33.152 44.582 12.989Zm0 0" />
      <path fill={forceColor ?? '#09f0ee'} d="m778.219 503.293 4.265-14.54 8.723-16.48-4.266 16.09Zm0 0" />
      <path fill={forceColor ?? '#83ff73'} d="m346.371 342.188 3.102 15.894v49.438l-3.102-17.45Zm0 0" />
      <path fill={forceColor ?? '#ffc400'} d="m559.969 204.926-47.489-20.164-4.265 31.02 45.937 17.253Zm0 0" />
      <path fill={forceColor ?? '#ff2900'} d="m476.621 72.512-57.758-21.325.387 18.028 54.078 19.777Zm0 0" />
      <path fill={forceColor ?? '#40ffb7'} d="m349.473 407.52 8.914 19.195-4.266 48.078-8.14-20.356Zm0 0" />
      <path fill={forceColor ?? '#ff9100'} d="m517.328 156.844-50.008-19.578-2.715 30.629 47.875 16.867Zm0 0" />
      <path fill={forceColor ?? '#caff2c'} d="m793.727 317.758-31.79-29.274-3.875-23.652 31.594 31.02Zm0 0" />
      <g clipPath="url(#e)">
        <path fill={forceColor ?? '#6aff8d'} d="m807.875 411.785-13.762-22.488 1.746-24.04 13.953 24.427Zm0 0" />
      </g>
      <path fill={forceColor ?? '#f1fc06'} d="m596.602 253.004-42.45-19.969-4.648 30.246 41.672 17.059Zm0 0" />
      <path fill={forceColor ?? '#00e4f8'} d="m354.121 474.793 11.242 20.746-9.11 45.172-10.464-21.715Zm0 0" />
      <path fill={forceColor ?? '#ff7a00'} d="m682.273 161.887-56.789-34.121-7.949-7.95 55.242 34.317Zm0 0" />
      <path fill={forceColor ?? '#ff4e00'} d="m609.008 117.297-61.055-31.602-6.398 3.489 58.535 30.828Zm0 0" />
      <path fill={forceColor ?? '#ff1300'} d="m418.863 51.188-53.11-16.094 4.458 19.386 49.039 14.735Zm0 0" />
      <path fill={forceColor ?? '#d60000'} d="m361.102 22.105-50.786-11.05 9.11 13.765 46.328 10.274Zm0 0" />
      <path fill={forceColor ?? '#ff5900'} d="m470.031 110.703-50.394-17.836.195 28.887 47.293 15.512Zm0 0" />
      <g clipPath="url(#f)">
        <path fill={forceColor ?? '#97ff60'} d="m5.813 358.664 3.683 27.918.969-49.629-3.684-28.308Zm0 0" />
      </g>
      <path fill={forceColor ?? '#ff3b00'} d="M473.328 88.992 419.25 69.215l.387 23.652 50.59 17.836Zm0 0" />
      <path fill={forceColor ?? '#0070ff'} d="m56.598 606.043 6.976 22.684-16.086-43.622-7.172-23.843Zm0 0" />
      <path fill={forceColor ?? '#16ffe1'} d="m661.34 475.957 2.715-9.695 7.172 17.258-2.907 8.918Zm0 0" />
      <path fill={forceColor ?? '#ff4300'} d="m535.16 98.492-58.73-25.98-3.102 16.48 55.629 24.04Zm0 0" />
      <path fill={forceColor ?? '#ff6c00'} d="m419.832 121.754-41.676-10.66 3.297 35.476 38.57 8.336Zm0 0" />
      <path fill={forceColor ?? '#ff6f00'} d="m522.95 132.613-52.723-21.91-2.907 26.563 50.008 19.578Zm0 0" />
      <path fill={forceColor ?? '#c7ff30'} d="m625.676 299.148-34.5-18.808-4.07 28.695 34.308 16.09Zm0 0" />
      <path fill={forceColor ?? '#ff1e00'} d="m112.031 67.473-30.43 19.386 19.383-26.562 27.524-18.223Zm0 0" />
      <g clipPath="url(#g)">
        <path fill={forceColor ?? '#b00'} d="M301.207 4.656 254.301.004l13.762 6.59 42.253 4.46Zm0 0" />
      </g>
      <path fill={forceColor ?? '#ffbd00'} d="m745.46 224.508-46.71-33.93-7.559-16.476 45.547 34.894Zm0 0" />
      <path fill={forceColor ?? '#f50'} d="m528.957 113.031-55.629-24.039-3.101 21.711 52.722 21.91Zm0 0" />
      <path fill={forceColor ?? '#0098ff'} d="m356.254 540.71 6.203 24.813-13.953 40.907-5.817-25.203Zm0 0" />
      <path fill={forceColor ?? '#ff2900'} d="M419.25 69.215 370.21 54.48l4.071 25.594 45.356 12.793Zm0 0" />
      <path fill={forceColor ?? '#ff4700'} d="M419.637 92.867 374.28 80.074l3.875 31.02 41.676 10.66Zm0 0" />
      <path fill={forceColor ?? '#ffa300'} d="m566.754 179.723-49.426-22.88-4.848 27.919 47.489 20.164Zm0 0" />
      <path fill={forceColor ?? '#ff8900'} d="m381.453 146.57-30.625-3.488 5.621 41.488 27.719 1.16Zm0 0" />
      <path fill={forceColor ?? '#1cffdb'} d="m786.941 488.363 4.266-16.09 7.363-18.804-4.457 18.027Zm0 0" />
      <path fill={forceColor ?? '#ff5200'} d="m600.09 120.012-58.535-30.828-6.395 9.308 56.207 29.274Zm0 0" />
      <path fill={forceColor ?? '#60ff97'} d="m653.977 404.418-11.63-13.57 1.548 23.652 11.437 11.633Zm0 0" />
      <path fill={forceColor ?? '#00bcff'} d="m689.832 542.262 19.191-9.114 12.016 2.907-19.574 9.5Zm0 0" />
      <g clipPath="url(#h)">
        <path fill={forceColor ?? '#b20000'} d="m240.926 1.168-41.672 2.715 17.832-1.551L254.3.004Zm0 0" />
      </g>
      <path fill={forceColor ?? '#00b8ff'} d="m701.465 545.555 19.574-9.5 12.406-.387-19.965 10.082Zm0 0" />
      <path fill={forceColor ?? '#0000f1'} d="m312.258 697.746 3.293 24.621-24.035 21.324-3.684-24.234Zm0 0" />
      <path fill={forceColor ?? '#00c4ff'} d="m678.398 536.055 18.997-8.918 11.628 6.011-19.191 9.114Zm0 0" />
      <path fill={forceColor ?? 'gold'} d="m603.387 227.61-43.418-22.684-5.817 28.11 42.45 19.968Zm0 0" />
      <path fill={forceColor ?? '#a0ff56'} d="m645.64 342.574-24.226-17.449-2.523 26.754 24.035 14.734Zm0 0" />
      <path fill={forceColor ?? '#ff6f00'} d="m672.777 154.133-55.242-34.317-8.527-2.52 53.496 33.735Zm0 0" />
      <path fill={forceColor ?? '#e40000'} d="M365.754 35.094 319.426 24.82l8.722 20.742 42.063 8.918Zm0 0" />
      <path fill={forceColor ?? '#ff8200'} d="m574.313 158.008-51.364-25.203-5.62 24.039 49.425 22.879Zm0 0" />
      <path fill={forceColor ?? '#ffd000'} d="m20.156 231.098-7.558 29.664 10.273-44.785 7.172-29.274Zm0 0" />
      <path fill={forceColor ?? '#0000a8'} d="m265.348 757.652 2.91 19.97-27.332 6.007-3.293-19.774Zm0 0" />
      <path fill={forceColor ?? '#ffb900'} d="m356.45 184.57-18.415 3.489 6.395 45.949 16.285-5.625Zm0 0" />
      <path fill={forceColor ?? '#30ffc7'} d="m655.914 457.926 2.906-10.856 5.235 19.192-2.715 9.695Zm0 0" />
      <path fill={forceColor ?? '#00bcff'} d="m713.48 545.75 19.965-10.082 12.016-3.684-20.352 11.051Zm0 0" />
      <g clipPath="url(#i)">
        <path fill={forceColor ?? '#87ff70'} d="m809.813 389.684-13.954-24.426v-24.043l13.762 26.367Zm0 0" />
      </g>
      <path fill={forceColor ?? '#ff5900'} d="M591.367 127.766 535.16 98.492l-6.203 14.54 53.691 27.527Zm0 0" />
      <path fill={forceColor ?? '#e7ff0f'} d="m789.656 295.852-31.593-31.02-5.43-21.52 31.015 32.375Zm0 0" />
      <path fill={forceColor ?? '#00d0ff'} d="m667.93 527.137 18.61-8.918 10.855 9.113-18.997 8.723Zm0 0" />
      <path fill={forceColor ?? '#ff6c00'} d="m582.648 140.559-53.691-27.528-6.008 19.774 51.364 25.203Zm0 0" />
      <path fill={forceColor ?? '#ff5d00'} d="m378.156 111.094-33.918-5.625 6.59 37.613 30.625 3.488Zm0 0" />
      <path fill={forceColor ?? '#0000c4'} d="m156.805 756.68 3.488 15.316-25.973-22.488-4.07-16.09Zm0 0" />
      <path fill={forceColor ?? '#e7ff0f'} d="m631.684 274.523-35.082-21.52-5.426 27.337 34.5 18.808Zm0 0" />
      <path fill={forceColor ?? '#00c4ff'} d="m725.11 543.035 20.35-11.05 11.825-6.786-20.738 12.215Zm0 0" />
      <path fill={forceColor ?? '#ffa700'} d="m736.738 208.996-45.547-34.894-8.918-12.215 44.774 35.285Zm0 0" />
      <path fill={forceColor ?? '#ff1300'} d="m370.21 54.48-42.062-8.917 8.336 27.144 37.797 7.367Zm0 0" />
      <path fill={forceColor ?? '#0000e8'} d="m130.25 733.418 4.07 16.09-24.035-28.692-4.844-16.867Zm0 0" />
      <path fill={forceColor ?? '#36ffc1'} d="m794.113 471.496 4.457-18.027 5.621-20.164-4.652 19.773Zm0 0" />
      <path fill={forceColor ?? '#00e0fb'} d="m658.434 515.7 18.218-9.11 9.887 11.629-18.61 8.918Zm0 0" />
      <path fill={forceColor ?? '#ff3400'} d="m374.281 80.074-37.797-7.367 7.754 32.762 33.918 5.625Zm0 0" />
      <path fill={forceColor ?? '#fbf100'} d="m344.43 234.008-6.977 9.691 6.008 49.242 5.43-11.437Zm0 0" />
      <path fill={forceColor ?? '#0054ff'} d="m348.504 606.43 3.098 27.53-18.024 35.09-3.101-27.335Zm0 0" />
      <path fill={forceColor ?? '#b00'} d="M182.586 13.383 147.5 23.852l20.742-10.278 31.012-9.691Zm0 0" />
      <path fill={forceColor ?? '#bf0000'} d="m310.316 11.055-42.253-4.461 13.761 14.347 37.602 3.88Zm0 0" />
      <path fill={forceColor ?? '#ffb600'} d="m611.527 205.121-44.773-25.398-6.785 25.203 43.418 22.683Zm0 0" />
      <path fill={forceColor ?? '#ff6800'} d="m662.309 151.031-53.301-33.734-8.918 2.715 51.754 32.761Zm0 0" />
      <path fill={forceColor ?? '#0000ad'} d="m184.523 772.965 2.715 14.93-26.945-15.899-3.488-15.316Zm0 0" />
      <path fill={forceColor ?? '#00b4ff'} d="m40.316 561.262 7.172 23.843-12.02-46.722-7.558-24.621Zm0 0" />
      <path fill={forceColor ?? '#53ffa4'} d="m13.18 437.184 6.59 27.336-3.684-49.825-6.59-28.113Zm0 0" />
      <path fill={forceColor ?? '#7dff7a'} d="m654.363 382.316-11.437-15.507-.578 24.039 11.629 13.57Zm0 0" />
      <path fill={forceColor ?? '#ff4e00'} d="m65.32 120.012-21.129 26.945 18.22-34.312L81.6 86.859Zm0 0" />
      <path fill={forceColor ?? '#00d4ff'} d="m736.547 537.414 20.738-12.215 10.856-9.5-20.934 13.184Zm0 0" />
      <path fill={forceColor ?? '#0004ff'} d="m105.441 703.95 4.844 16.866L88.578 686.5l-5.621-17.64Zm0 0" />
      <path fill={forceColor ?? '#49ffad'} d="m652.617 438.54 2.715-12.216 3.488 20.746-2.906 10.856Zm0 0" />
      <path fill={forceColor ?? '#c1ff36'} d="m343.46 292.941 2.52 14.543 3.684 50.598-3.293-15.894Zm0 0" />
      <path fill={forceColor ?? '#0cf4eb'} d="m650.098 502.129 18.222-9.692 8.332 14.153-18.218 9.11Zm0 0" />
      <path fill={forceColor ?? '#c1ff36'} d="m650.098 319.117-24.422-19.969-4.262 25.977 24.031 17.45Zm0 0" />
      <path fill={forceColor ?? '#ff9800'} d="m620.637 185.73-46.324-27.722-7.56 21.715 44.774 25.398Zm0 0" />
      <path fill={forceColor ?? '#ff7e00'} d="m350.828 143.082-21.32 1.742 8.527 43.235 18.414-3.489Zm0 0" />
      <path fill={forceColor ?? '#ff6c00'} d="m651.844 152.773-51.754-32.761-8.723 7.754 49.817 31.601Zm0 0" />
      <g clipPath="url(#j)">
        <path fill={forceColor ?? '#a7ff50'} d="m809.621 367.582-13.762-26.367-2.132-23.457 13.566 28.305Zm0 0" />
      </g>
      <path fill={forceColor ?? '#ffea00'} d="m783.648 275.688-31.015-32.375-7.172-18.805 30.625 33.539Zm0 0" />
      <path fill={forceColor ?? '#ffe600'} d="m639.246 251.844-35.86-24.235-6.784 25.395 35.082 21.52Zm0 0" />
      <path fill={forceColor ?? '#ff9400'} d="m727.047 197.172-44.774-35.285-9.496-7.754 43.418 35.281Zm0 0" />
      <path fill={forceColor ?? '#83ff73'} d="m349.664 358.082 8.723 18.227v50.406l-8.914-19.195Zm0 0" />
    </>
  );
}

function DfxAssetIconCRV1({ forceColor }: BaseAssetIconProps) {
  return (
    <>
      <path fill={forceColor ?? '#ff8200'} d="m630.715 170.418-48.067-29.86-8.336 17.45 46.325 27.722Zm0 0" />
      <path fill={forceColor ?? '#ff7300'} d="m641.184 159.367-49.817-31.601-8.719 12.793 48.067 29.859Zm0 0" />
      <path fill={forceColor ?? '#0000a4'} d="m212.82 782.078 1.942 14.735-27.524-8.918-2.715-14.93Zm0 0" />
      <g clipPath="url(#k)">
        <path fill={forceColor ?? '#a40000'} d="m254.3.004-37.214 2.328 18.414 6.59 32.563-2.328Zm0 0" />
      </g>
      <path fill={forceColor ?? '#50ffa7'} d="m799.54 453.078 4.651-19.773 3.684-21.52-4.652 21.715Zm0 0" />
      <path fill={forceColor ?? '#00e4f8'} d="m747.207 528.883 20.934-13.184 10.078-12.406-21.32 14.539Zm0 0" />
      <path fill={forceColor ?? '#cd0000'} d="m319.426 24.82-37.602-3.879L295.2 42.656l32.95 2.907Zm0 0" />
      <path fill={forceColor ?? '#40ffb7'} d="m358.387 426.715 11.824 20.16-4.652 48.664-11.438-20.941Zm0 0" />
      <path fill={forceColor ?? '#1fffd7'} d="m643.316 486.426 18.024-10.469 6.98 16.48-18.222 9.692Zm0 0" />
      <path fill={forceColor ?? '#d7ff1f'} d="m6.781 308.645 3.684 28.308 5.816-47.887-3.683-28.304Zm0 0" />
      <path fill={forceColor ?? '#da0000'} d="m128.508 42.074-27.524 18.418 22.094-19.195L147.5 23.852Zm0 0" />
      <path fill={forceColor ?? '#0000cd'} d="m291.516 743.691 2.52 20.356-25.778 13.574-2.91-19.969Zm0 0" />
      <path fill={forceColor ?? '#003cff'} d="m82.957 668.86 5.621 17.64-18.996-38.773-6.008-18.805Zm0 0" />
      <path fill={forceColor ?? '#ff4e00'} d="M344.238 105.469h-24.812l10.082 39.355 21.32-1.55Zm0 0" />
      <path fill={forceColor ?? '#9dff5a'} d="m656.883 360.41-11.438-17.836-2.52 24.235 11.438 15.507Zm0 0" />
      <path fill={forceColor ?? '#63ff94'} d="m651.066 418.379 2.91-13.961 1.356 21.906-2.715 12.215Zm0 0" />
      <path fill={forceColor ?? '#e80000'} d="M328.148 45.563 295.2 42.656l12.598 28.305 28.687 1.746Zm0 0" />
      <path fill={forceColor ?? '#ffc400'} d="m648.355 231.68-36.828-26.559-8.14 22.488 35.86 24.235Zm0 0" />
      <path fill={forceColor ?? '#ffae00'} d="m338.035 188.059-9.11 8.144 8.528 47.496 6.977-9.691Zm0 0" />
      <path fill={forceColor ?? '#ff8600'} d="m716.195 189.414-43.418-35.281-10.273-3.102 42.254 34.7Zm0 0" />
      <path fill={forceColor ?? '#deff19'} d="m656.3 296.82-24.616-22.297-6.008 24.625 24.422 19.97Zm0 0" />
      <path fill={forceColor ?? '#00e4f8'} d="m365.363 495.54 6.785 24.62-9.691 45.363-6.203-24.812Zm0 0" />
      <path fill={forceColor ?? '#f20'} d="m336.484 72.707-28.687-1.746 11.629 34.508h24.812Zm0 0" />
      <path fill={forceColor ?? '#0018ff'} d="m333.578 669.05 3.293 25.013-21.32 28.304-3.293-24.62Zm0 0" />
      <path fill={forceColor ?? '#ffd000'} d="m776.086 258.047-30.625-33.54-8.723-15.51 30.239 34.315Zm0 0" />
      <path fill={forceColor ?? '#0ff8e7'} d="m756.898 517.832 21.32-14.539 8.723-14.93-21.707 16.094Zm0 0" />
      <path fill={forceColor ?? '#c1ff36'} d="m807.293 346.063-13.566-28.305-4.07-21.906 13.374 29.855Zm0 0" />
      <path fill={forceColor ?? '#33ffc4'} d="m638.082 469.363 17.832-11.437 5.426 18.031-18.024 10.469Zm0 0" />
      <path fill={forceColor ?? '#0000a8'} d="m240.926 783.629 1.164 14.734-27.328-1.55-1.942-14.735Zm0 0" />
      <g clipPath="url(#l)">
        <path fill={forceColor ?? '#6aff8d'} d="m803.223 433.5 4.652-21.715 1.938-22.101-4.844 23.457Zm0 0" />
      </g>
      <path fill={forceColor ?? '#9f0000'} d="m199.254 3.883-31.012 9.691 21.903-1.937 26.94-9.305Zm0 0" />
      <path fill={forceColor ?? '#00c8ff'} d="m655.719 552.535 34.113-10.273 11.633 3.293-34.504 10.664Zm0 0" />
      <path fill={forceColor ?? '#ffab00'} d="m658.434 214.813-37.797-29.083-9.11 19.391 36.828 26.559Zm0 0" />
      <path fill={forceColor ?? '#00d0ff'} d="m645.059 546.137 33.34-10.082 11.433 6.207-34.113 10.273Zm0 0" />
      <path fill={forceColor ?? '#ff8200'} d="m704.758 185.73-42.45-34.699-10.464 1.742 41.09 33.93Zm0 0" />
      <path fill={forceColor ?? '#16ffe1'} d="m27.91 513.762 7.559 24.62-7.946-48.273-7.753-25.59Zm0 0" />
      <path fill={forceColor ?? '#ff8d00'} d="m30.043 186.703-7.172 29.274 14.926-40.325 6.394-28.695Zm0 0" />
      <path fill={forceColor ?? '#00c8ff'} d="m666.96 556.219 34.505-10.664 12.015.195-35.082 11.246Zm0 0" />
      <path fill={forceColor ?? '#00d8ff'} d="m634.785 537.219 33.145-10.082 10.468 8.918-33.53 10.082Zm0 0" />
      <path fill={forceColor ?? '#a80000'} d="M268.063 6.594 235.5 8.922l18.414 14.539 27.91-2.52Zm0 0" />
      <path fill={forceColor ?? '#feed00'} d="m337.453 243.7 1.164 13.57 7.363 50.214-2.52-14.543Zm0 0" />
      <path fill={forceColor ?? '#ff9800'} d="m669.48 201.242-38.765-30.824-10.078 15.312 37.797 29.083Zm0 0" />
      <path fill={forceColor ?? '#ff8200'} d="m692.934 186.703-41.09-33.93-10.66 6.594 39.93 32.57Zm0 0" />
      <path fill={forceColor ?? '#7dff7a'} d="m651.457 398.02 2.906-15.704-.386 22.102-2.91 13.96Zm0 0" />
      <path fill={forceColor ?? '#baff3c'} d="m661.535 339.082-11.437-19.965-4.457 23.457 11.437 17.836Zm0 0" />
      <path fill={forceColor ?? '#fbf100'} d="m664.25 276.656-25.004-24.812-7.562 22.68L656.3 296.82Zm0 0" />
      <path fill={forceColor ?? '#00c8ff'} d="m678.398 556.996 35.082-11.246 11.63-2.715-35.278 11.828Zm0 0" />
      <path fill={forceColor ?? '#26ffd1'} d="m765.234 504.457 21.707-16.094 7.172-16.867-21.902 17.645Zm0 0" />
      <path fill={forceColor ?? '#02e8f4'} d="m625.676 525.781 32.758-10.082 9.496 11.438-33.145 10.082Zm0 0" />
      <path fill={forceColor ?? '#0078ff'} d="m63.574 628.727 6.008 19-15.504-42.457-6.59-20.165Zm0 0" />
      <path fill={forceColor ?? '#ff8900'} d="m681.113 191.938-39.93-32.57-10.468 11.05 38.765 31.02Zm0 0" />
      <path fill={forceColor ?? '#ffb900'} d="m766.977 243.313-30.239-34.317-9.691-11.824 29.465 34.703Zm0 0" />
      <path fill={forceColor ?? '#0098ff'} d="m362.457 565.523 3.102 27.918-13.957 40.52-3.098-27.531Zm0 0" />
      <path fill={forceColor ?? '#97ff60'} d="m9.496 386.582 6.59 28.113 1.164-49.246-6.785-28.496Zm0 0" />
      <path fill={forceColor ?? '#ff7300'} d="m329.508 144.824-12.02 6.594 11.438 44.785 9.11-8.144Zm0 0" />
      <path fill={forceColor ?? '#4dffaa'} d="m634.785 451.14 17.832-12.6 3.297 19.386-17.832 11.437Zm0 0" />
      <path fill={forceColor ?? '#deff19'} d="m803.031 325.707-13.375-29.855-6.008-20.164 13.372 31.214Zm0 0" />
      <path fill={forceColor ?? '#ff1a00'} d="M81.602 86.86 62.41 112.644l21.711-27.532 16.863-24.816Zm0 0" />
      <path fill={forceColor ?? '#00d0ff'} d="m689.832 554.863 35.277-11.828 11.438-5.62-35.86 12.6Zm0 0" />
      <path fill={forceColor ?? '#13fce4'} d="m617.73 512.406 32.368-10.277 8.336 13.57-32.758 10.082Zm0 0" />
      <g clipPath="url(#m)">
        <path fill={forceColor ?? '#87ff70'} d="m804.969 413.14 4.843-23.456-.19-22.102-4.849 25.203Zm0 0" />
      </g>
      <path fill={forceColor ?? '#c4ff33'} d="m345.98 307.484 8.141 17.254 4.266 51.57-8.723-18.226Zm0 0" />
      <path fill={forceColor ?? '#b60000'} d="m281.824 20.941-27.91 2.52 17.832 22.297 23.453-3.102Zm0 0" />
      <path fill={forceColor ?? 'gold'} d="m673.746 258.82-25.39-27.14-9.11 20.164 25.004 24.812Zm0 0" />
      <path fill={forceColor ?? '#ffa700'} d="m756.512 231.875-29.657-34.703-10.66-7.758 29.075 34.703Zm0 0" />
      <path fill={forceColor ?? '#0000fa'} d="m315.55 722.367 1.938 20.742-23.453 20.938-2.52-20.356Zm0 0" />
      <path fill={forceColor ?? '#00b'} d="m268.258 777.621.387 14.734-26.555 6.008-1.164-14.734Zm0 0" />
      <path fill={forceColor ?? '#3cffba'} d="m772.21 489.14 21.903-17.644 5.426-18.418-22.094 19Zm0 0" />
      <path fill={forceColor ?? '#00dcfe'} d="m700.688 550.016 35.859-12.602 10.66-8.531-36.441 13.765Zm0 0" />
      <path fill={forceColor ?? '#d4ff23'} d="m667.738 319.117-11.437-22.297-6.203 22.297 11.437 19.965Zm0 0" />
      <path fill={forceColor ?? '#ff3f00'} d="m319.426 105.469-15.309 5.043 13.371 40.906 12.02-6.594Zm0 0" />
      <path fill={forceColor ?? '#9aff5d'} d="m653.977 377.86 3.101-17.45-2.715 21.906-2.906 15.704Zm0 0" />
      <path fill={forceColor ?? '#b20000'} d="m147.5 23.852-24.422 17.445 24.23-11.242 20.934-16.48Zm0 0" />
      <path fill={forceColor ?? '#0000d6'} d="m160.293 771.996 1.164 9.887-25.004-21.906-2.133-10.47Zm0 0" />
      <path fill={forceColor ?? '#26ffd1'} d="m611.14 497.281 32.176-10.855 6.782 15.703-32.368 10.277Zm0 0" />
      <path fill={forceColor ?? '#0000fa'} d="m134.32 749.508 2.133 10.469-23.066-27.528-3.102-11.633Zm0 0" />
      <path fill={forceColor ?? '#63ff94'} d="m633.234 432.336 17.832-13.957 1.551 20.16-17.832 12.602Zm0 0" />
      <path fill={forceColor ?? '#83ff73'} d="m358.387 376.309 12.02 19.578-.196 50.988-11.824-20.16Zm0 0" />
      <path fill={forceColor ?? '#d60000'} d="m295.2 42.656-23.454 3.102L288.61 75.03l19.188-4.07Zm0 0" />
      <path fill={forceColor ?? '#960000'} d="m217.086 2.332-26.941 9.11 22.675 6.398 22.68-8.918Zm0 0" />
      <path fill={forceColor ?? '#f4f802'} d="m797.02 306.902-13.372-31.214-7.562-17.641 13.184 32.183Zm0 0" />
      <path fill={forceColor ?? '#ff1300'} d="m307.797 70.96-19.188 4.071 15.313 35.48 15.504-5.042Zm0 0" />
      <path fill={forceColor ?? '#0000bf'} d="m187.238 787.895.192 9.304-25.973-15.316-1.164-9.887Zm0 0" />
      <path fill={forceColor ?? '#ffc100'} d="m684.406 243.895-25.972-29.083-10.079 16.868 25.391 27.14Zm0 0" />
      <path fill={forceColor ?? '#ffd000'} d="m12.598 260.762 3.683 28.304 10.274-44.59-3.684-28.5Zm0 0" />
      <path fill={forceColor ?? '#ff9c00'} d="m745.27 224.117-29.075-34.703-11.437-3.684 28.3 34.512Zm0 0" />
      <g clipPath="url(#n)">
        <path fill={forceColor ?? '#a0ff56'} d="m804.773 392.785 4.848-25.203-2.328-21.52-4.844 26.754Zm0 0" />
      </g>
      <path fill={forceColor ?? '#ffab00'} d="m328.926 196.203-.969 12.211 10.66 48.664-1.164-13.379Zm0 0" />
      <path fill={forceColor ?? '#0014ff'} d="m110.285 720.816 2.91 11.633-20.933-32.96-3.684-12.989Zm0 0" />
      <path fill={forceColor ?? '#06ecf1'} d="m710.766 542.648 36.441-13.765 9.691-11.051-36.828 14.734Zm0 0" />
      <path fill={forceColor ?? '#00bcff'} d="m47.488 585.105 6.59 20.165-11.824-45.172-6.785-21.715Zm0 0" />
      <path fill={forceColor ?? '#0054ff'} d="m351.602 633.96 2.91 25.59-17.64 34.513-3.294-25.012Zm0 0" />
      <path fill={forceColor ?? '#39ffbe'} d="m606.293 480.996 31.789-11.633 5.234 17.063-32.175 10.855Zm0 0" />
      <path fill={forceColor ?? '#ffae00'} d="m696.035 232.262-26.555-31.02-11.046 13.57 25.972 29.083Zm0 0" />
      <path fill={forceColor ?? '#40ffb7'} d="m370.21 446.875 6.978 24.234-5.04 49.051-6.785-24.62Zm0 0" />
      <path fill={forceColor ?? '#ff9800'} d="m733.059 220.242-28.301-34.512-11.824.973 27.718 33.73Zm0 0" />
      <path fill={forceColor ?? '#56ffa0'} d="m19.77 464.52 7.753 25.59-3.683-48.66-7.754-26.755Zm0 0" />
      <path fill={forceColor ?? '#53ffa4'} d="m777.445 472.078 22.094-19 3.684-19.578-22.29 20.55Zm0 0" />
      <path fill={forceColor ?? '#eeff09'} d="m675.879 301.086-11.629-24.43-7.95 20.164 11.63 22.297Zm0 0" />
      <path fill={forceColor ?? '#ff9f00'} d="m708.246 224.313-27.133-32.375-11.633 9.304 26.555 31.02Zm0 0" />
      <path fill={forceColor ?? '#ff9800'} d="m720.652 220.434-27.718-33.73-11.82 5.233 27.132 32.375Zm0 0" />
      <path fill={forceColor ?? '#b4ff43'} d="m658.434 358.664 3.101-19.582-4.457 21.328-3.101 17.45Zm0 0" />
      <path fill={forceColor ?? '#0000b6'} d="m214.762 796.813-.778 8.917-26.554-8.53-.192-9.305Zm0 0" />
      <path fill={forceColor ?? '#00d8ff'} d="m599.121 557.383 45.746-11.246 10.852 6.398-46.324 11.438Zm0 0" />
      <path fill={forceColor ?? '#ffde00'} d="m789.27 290.23-13.184-32.183-9.11-14.735 12.989 32.958Zm0 0" />
      <path fill={forceColor ?? '#7dff7a'} d="m633.816 413.336 17.641-15.316-.39 20.359-17.833 13.957Zm0 0" />
      <path fill={forceColor ?? '#00d0ff'} d="m609.395 563.973 46.324-11.438 11.242 3.684-46.711 11.828Zm0 0" />
      <path fill={forceColor ?? '#00e0fb'} d="m589.43 548.27 45.355-11.051 10.082 8.918-45.746 11.246Zm0 0" />
      <path fill={forceColor ?? '#00d0ff'} d="m620.25 568.047 46.906-11.828 11.242.777-47.293 12.406Zm0 0" />
      <path fill={forceColor ?? '#ff4e00'} d="m44.191 146.957-6.394 28.695 18.992-34.703 5.621-28.304Zm0 0" />
      <path fill={forceColor ?? '#09f0ee'} d="m580.707 536.832 44.969-11.05 9.11 11.437-45.356 11.05Zm0 0" />
      <path fill={forceColor ?? '#19ffde'} d="m720.07 532.566 36.828-14.734 8.336-13.375-37.214 15.895Zm0 0" />
      <path fill={forceColor ?? '#0048ff'} d="m88.578 686.5 3.684 12.988-18.028-37.222-4.652-14.54Zm0 0" />
      <path fill={forceColor ?? '#50ffa7'} d="m603 463.55 31.785-12.41 3.297 18.223-31.789 11.633Zm0 0" />
      <path fill={forceColor ?? '#beff39'} d="m802.45 372.816 4.843-26.753-4.07-20.356-5.04 27.918Zm0 0" />
      <path fill={forceColor ?? '#960000'} d="m235.5 8.922-22.68 8.918 22.68 14.539 18.414-8.918Zm0 0" />
      <path fill={forceColor ?? '#ffe600'} d="m685.375 285.188-11.629-26.368-9.496 17.836 11.629 24.43Zm0 0" />
      <path fill={forceColor ?? '#0000da'} d="m294.035 764.047-.387 15.316-25.003 12.992-.387-14.734Zm0 0" />
      <path fill={forceColor ?? '#00d0ff'} d="m631.105 569.402 47.293-12.406 11.434-2.133-48.066 12.989Zm0 0" />
      <path fill={forceColor ?? '#ffea00'} d="m338.617 257.078 7.172 16.477 8.332 51.183-8.14-17.254Zm0 0" />
      <path fill={forceColor ?? '#16ffe1'} d="m573.148 523.648 44.582-11.242 7.946 13.375-44.969 11.051Zm0 0" />
      <path fill={forceColor ?? '#ff6c00'} d="M317.488 151.418 314 162.468l13.957 45.946.969-12.21Zm0 0" />
      <path fill={forceColor ?? '#d7ff1f'} d="m10.465 336.953 6.785 28.496 5.621-47.11-6.59-29.273Zm0 0" />
      <path fill={forceColor ?? '#6dff8a'} d="m780.934 454.05 22.289-20.55 1.746-20.36-22.485 21.91Zm0 0" />
      <path fill={forceColor ?? '#d10000'} d="M100.984 60.492 84.121 85.113l24.613-20.355 14.344-23.461Zm0 0" />
      <path fill={forceColor ?? '#fc0'} d="m779.965 276.27-12.988-32.957-10.465-11.438 12.793 33.344Zm0 0" />
      <path fill={forceColor ?? '#00e4f8'} d="m372.148 520.16 3.102 27.918-9.691 45.363-3.102-27.918Zm0 0" />
      <path fill={forceColor ?? '#ceff29'} d="m664.637 340.637 3.293-21.52-6.395 19.965-3.101 19.582Zm0 0" />
      <path fill={forceColor ?? '#960000'} d="m168.242 13.574-20.933 16.48 25.586-2.714 17.25-15.703Zm0 0" />
      <path fill={forceColor ?? '#97ff60'} d="m636.145 394.727 17.832-16.868-2.52 20.16-17.64 15.317Zm0 0" />
      <path fill={forceColor ?? '#00b'} d="m242.09 798.363-1.938 8.723-26.168-1.356.778-8.918Zm0 0" />
      <path fill={forceColor ?? '#00d8ff'} d="m641.766 567.852 48.066-12.989 10.856-4.847-48.649 13.765Zm0 0" />
      <path fill={forceColor ?? '#0020ff'} d="m336.871 694.063 1.55 21.519-20.933 27.527-1.937-20.742Zm0 0" />
      <path
        fill={forceColor ?? '#29ffce'}
        d="m728.02 520.352 37.214-15.895 6.977-15.316-37.602 16.867ZM566.754 508.723l44.387-11.442 6.59 15.125-44.583 11.242Zm0 0"
      />
      <path fill={forceColor ?? '#ffd000'} d="m696.23 272.2-11.824-28.305-10.66 14.925 11.629 26.368Zm0 0" />
      <path fill={forceColor ?? '#66ff90'} d="m601.45 445.71 31.784-13.374 1.551 18.805L603 463.55Zm0 0" />
      <path fill={forceColor ?? '#d4ff23'} d="m798.184 353.625 4.847-27.918-6.011-18.805-4.844 29.078Zm0 0" />
      <path fill={forceColor ?? '#ffb900'} d="m769.305 265.219-12.793-33.344-11.242-7.758 12.597 33.348Zm0 0" />
      <path fill={forceColor ?? '#a80000'} d="M253.914 23.46 235.5 32.38l21.902 22.492 14.344-9.113Zm0 0" />
      <path fill={forceColor ?? '#19ffde'} d="m35.469 538.383 6.785 21.715-7.559-46.918-7.172-23.07Zm0 0" />
      <path fill={forceColor ?? '#c4ff33'} d="m354.121 324.738 11.633 19.192 4.652 51.957-12.02-19.578Zm0 0" />
      <path fill={forceColor ?? '#ff3400'} d="m304.117 110.512-6.785 10.273L314 162.47l3.488-11.051Zm0 0" />
      <path fill={forceColor ?? '#0080ff'} d="m69.582 647.727 4.652 14.539-14.925-40.907-5.23-16.09Zm0 0" />
      <path fill={forceColor ?? '#ffc100'} d="m707.86 262.313-11.825-30.051-11.629 11.633 11.824 28.304Zm0 0" />
      <path fill={forceColor ?? '#00e4f8'} d="m652.04 563.781 48.648-13.57 10.078-7.563-49.036 14.348Zm0 0" />
      <path fill={forceColor ?? '#87ff70'} d="m782.484 435.05 22.485-21.91-.196-20.355-22.484 23.266Zm0 0" />
      <path fill={forceColor ?? '#3cffba'} d="m562.102 492.438 44-11.442 5.039 16.48-44.387 11.247Zm0 0" />
      <path fill={forceColor ?? '#e4ff13'} d="m672.582 324.352 3.297-23.266-7.95 18.031-3.292 21.52Zm0 0" />
      <path fill={forceColor ?? '#ffb200'} d="m757.867 257.465-12.597-33.348-12.211-3.875L745.46 253.2Zm0 0" />
      <path fill={forceColor ?? '#c80000'} d="m271.746 45.758-14.344 9.113 20.934 29.856 10.273-9.696Zm0 0" />
      <path fill={forceColor ?? '#f10800'} d="m288.61 75.031-10.274 9.696 18.996 36.058 6.785-10.273Zm0 0" />
      <path fill={forceColor ?? '#b1ff46'} d="m640.215 376.89 18.219-18.226-4.457 19.195-17.832 16.868Zm0 0" />
      <path fill={forceColor ?? '#ffb200'} d="m720.266 255.719-12.211-31.406-12.02 7.949 11.824 30.05Zm0 0" />
      <path fill={forceColor ?? '#ff8d00'} d="m22.871 215.977 3.684 28.5 14.922-39.938-3.68-28.887Zm0 0" />
      <path fill={forceColor ?? '#40ffb7'} d="m734.61 506.008 37.6-16.867 5.235-17.063-37.797 18.031Zm0 0" />
      <path fill={forceColor ?? '#ffab00'} d="m745.46 253.2-12.401-32.958h-12.407l12.211 32.375Zm0 0" />
      <path fill={forceColor ?? '#ffae00'} d="m732.863 252.617-12.21-32.375-12.598 4.07 12.21 31.407Zm0 0" />
      <path fill={forceColor ?? '#7dff7a'} d="m601.836 427.684 31.98-14.348-.582 19-31.785 13.375Zm0 0" />
      <path fill={forceColor ?? '#00dcfe'} d="m544.074 569.79 55.047-12.407 10.274 6.59-55.434 12.992Zm0 0" />
      <path fill={forceColor ?? '#00e4f8'} d="m534.965 560.29 54.465-12.02 9.691 9.113-55.047 12.406Zm0 0" />
      <path fill={forceColor ?? '#97ff60'} d="m16.086 414.695 7.754 26.754 1.164-48.082-7.754-27.918Zm0 0" />
      <path fill={forceColor ?? '#ebff0c'} d="m792.176 335.98 4.844-29.078-7.75-16.672-4.848 30.047Zm0 0" />
      <path fill={forceColor ?? '#0000ed'} d="m161.457 781.883-1.164 3.879-23.84-20.742v-5.043Zm0 0" />
      <path fill={forceColor ?? '#009cff'} d="m365.559 593.441 2.906 25.98-13.953 40.13-2.91-25.395Zm0 0" />
      <path fill={forceColor ?? '#83ff73'} d="m370.406 395.887 6.977 24.043-.195 51.18-6.977-24.235Zm0 0" />
      <path fill={forceColor ?? '#00d4ff'} d="m553.96 576.965 55.435-12.992 10.855 4.074-56.21 13.375Zm0 0" />
      <path fill={forceColor ?? '#00f'} d="M136.453 759.977v5.043l-22.098-26.368-.968-6.203Zm0 0" />
      <path fill={forceColor ?? '#ffa300'} d="m327.957 208.414 5.426 15.703 12.406 49.438-7.172-16.477Zm0 0" />
      <path
        fill={forceColor ?? '#0cf4eb'}
        d="m526.629 548.656 54.078-11.824 8.723 11.438-54.465 12.02ZM661.73 556.996l49.036-14.348 9.304-10.082-49.62 15.121Zm0 0"
      />
      <path fill={forceColor ?? '#0000cd'} d="m268.645 792.355-2.907 9.11-25.39 5.62 1.742-8.722Zm0 0" />
      <path fill={forceColor ?? '#50ffa7'} d="M558.805 475.57 603 463.55l3.102 17.446-44 11.442Zm0 0" />
      <path fill={forceColor ?? '#0000d6'} d="m187.43 797.2-2.325 3.1-24.812-14.538 1.164-3.88Zm0 0" />
      <path fill={forceColor ?? '#f8f500'} d="m681.887 310.195 3.488-25.007-9.496 15.898-3.297 23.266Zm0 0" />
      <path fill={forceColor ?? '#00d4ff'} d="m564.04 581.422 56.21-13.375 10.855 1.355-56.793 13.766Zm0 0" />
      <path fill={forceColor ?? '#890000'} d="m190.145 11.637-17.25 15.703 26.359 5.816L212.82 17.84Zm0 0" />
      <path fill={forceColor ?? '#19ffde'} d="m519.457 535.281 53.691-11.633 7.559 13.184-54.078 12.02Zm0 0" />
      <path fill={forceColor ?? '#00f'} d="m317.488 743.11-.968 15.898-22.872 20.355.387-15.316Zm0 0" />
      <path fill={forceColor ?? '#a0ff56'} d="m782.29 416.05 22.483-23.265-2.324-19.969-22.484 24.43Zm0 0" />
      <path fill={forceColor ?? '#0024ff'} d="m113.387 732.45.968 6.202-19.96-31.406-2.133-7.758Zm0 0" />
      <path fill={forceColor ?? '#ff1600'} d="m62.41 112.645-5.62 28.304 22.483-28.113 4.848-27.723Zm0 0" />
      <path fill={forceColor ?? '#c7ff30'} d="m646.223 360.41 18.414-19.773-6.203 18.027-18.22 18.227Zm0 0" />
      <path fill={forceColor ?? '#feed00'} d="m784.422 320.277 4.848-29.855-9.305-14.152-4.653 30.632Zm0 0" />
      <path fill={forceColor ?? '#56ffa0'} d="m739.648 490.11 37.797-18.032 3.489-18.027-37.993 19.191Zm0 0" />
      <path fill={forceColor ?? '#a80000'} d="m123.078 41.297-14.344 23.46 26.946-12.019 11.629-22.683Zm0 0" />
      <path fill={forceColor ?? '#00d4ff'} d="m574.313 583.168 56.792-13.766 10.66-1.55-57.18 14.347Zm0 0" />
      <path fill={forceColor ?? '#97ff60'} d="m603.969 410.234 32.176-15.507-2.329 18.609-31.98 14.348Zm0 0" />
      <path fill={forceColor ?? '#29ffce'} d="m513.45 520.16 53.304-11.437 6.394 14.925-53.691 11.633Zm0 0" />
      <path fill={forceColor ?? '#00c4ff'} d="m54.078 605.27 5.23 16.09-11.433-43.622-5.621-17.64Zm0 0" />
      <path fill={forceColor ?? '#1cffdb'} d="m670.45 547.688 49.62-15.122 7.95-12.214-50.008 15.703Zm0 0" />
      <path fill={forceColor ?? '#0000cd'} d="m213.984 805.73-3.488 2.715-25.39-8.144 2.324-3.102Zm0 0" />
      <path fill={forceColor ?? '#66ff90'} d="m557.45 458.121 44-12.41 1.55 17.84-44.195 12.02Zm0 0" />
      <path fill={forceColor ?? '#ffde00'} d="m692.547 298.758 3.683-26.559-10.855 12.988-3.488 25.008Zm0 0" />
      <path fill={forceColor ?? '#ffd300'} d="m16.281 289.066 6.59 29.274 10.274-44.008-6.59-29.855Zm0 0" />
      <path fill={forceColor ?? '#40ffb7'} d="m377.188 471.11 3.101 28.304-5.039 48.664-3.102-27.918Zm0 0" />
      <path fill={forceColor ?? '#00dcfe'} d="m584.586 582.2 57.18-14.348 10.273-4.07-57.762 14.734Zm0 0" />
      <path fill={forceColor ?? '#ffdb00'} d="m775.313 306.902 4.652-30.632-10.66-11.051-4.461 31.02Zm0 0" />
      <path fill={forceColor ?? '#b7ff40'} d="m779.965 397.246 22.484-24.43-4.265-19-22.29 25.399Zm0 0" />
      <path fill={forceColor ?? '#ffe600'} d="m345.79 273.555 10.464 18.804 9.5 51.57-11.633-19.19Zm0 0" />
      <path fill={forceColor ?? '#0054ff'} d="m92.262 699.488 2.133 7.758L77.14 671.57l-2.907-9.304Zm0 0" />
      <path fill={forceColor ?? '#56ffa0'} d="m27.523 490.11 7.172 23.07-3.492-47.305-7.363-24.426Zm0 0" />
      <path fill={forceColor ?? '#3cffba'} d="m508.797 504.066 53.305-11.628 4.652 16.285-53.305 11.629Zm0 0" />
      <path fill={forceColor ?? '#005cff'} d="m354.512 659.55 1.355 22.102-17.445 33.93-1.55-21.52Zm0 0" />
      <path fill={forceColor ?? '#ff6400'} d="m314 162.469 3.102 15.316 16.28 46.332-5.425-15.703Zm0 0" />
      <path fill={forceColor ?? '#ffd000'} d="m703.984 290.23 3.875-27.918-11.629 9.887-3.683 26.559Zm0 0" />
      <path fill={forceColor ?? '#deff19'} d="m653.977 345.676 18.605-21.324-7.945 16.285-18.414 19.773Zm0 0" />
      <path fill={forceColor ?? '#890000'} d="m212.82 17.84-13.566 15.316 26.555 14.153 9.691-14.93Zm0 0" />
      <path fill={forceColor ?? '#6dff8a'} d="m742.941 473.242 37.993-19.191 1.55-19-37.992 20.355Zm0 0" />
      <path fill={forceColor ?? '#fc0'} d="m764.652 296.238 4.653-31.02-11.438-7.753-4.652 31.02Zm0 0" />
      <path fill={forceColor ?? '#adff49'} d="m608.04 393.563 32.175-16.672-4.07 17.836-32.176 15.507Zm0 0" />
      <path fill={forceColor ?? '#2cffca'} d="m678.012 536.055 50.008-15.703 6.59-14.344-50.204 16.672Zm0 0" />
      <path fill={forceColor ?? '#7dff7a'} d="m557.645 440.867 44.19-13.183-.386 18.027-44 12.41Zm0 0" />
      <path fill={forceColor ?? '#00dcfe'} d="m487.09 588.594 61.832-14.926-9.5-8.336-62.024 14.734Zm0 0" />
      <path fill={forceColor ?? '#02e8f4'} d="m477.398 580.066 62.024-14.734-8.723-10.469-62.219 14.54Zm0 0" />
      <path fill={forceColor ?? '#ffc400'} d="m716.195 284.8 4.07-29.081-12.406 6.594-3.875 27.917Zm0 0" />
      <path fill={forceColor ?? '#0000ed'} d="m293.648 779.363-3.875 9.5-24.035 12.602 2.907-9.11Zm0 0" />
      <path fill={forceColor ?? '#02e8f4'} d="m594.277 578.516 57.762-14.735 9.691-6.785-58.343 15.121Zm0 0" />
      <path fill={forceColor ?? '#00d4ff'} d="M497.168 594.41 559 579.484l-10.078-5.816-61.832 14.926Zm0 0" />
      <g clipPath="url(#o)">
        <path fill={forceColor ?? '#0000d1'} d="M240.348 807.086 235.5 809.8l-25.2-1.356 3.684-2.715Zm0 0" />
      </g>
      <path fill={forceColor ?? '#ffc400'} d="m753.215 288.484 4.652-31.02-12.406-4.265-4.262 30.824Zm0 0" />
      <path fill={forceColor ?? '#53ffa4'} d="M505.695 487.2 559 475.57l3.102 16.868-53.305 11.628Zm0 0" />
      <path fill={forceColor ?? '#0ff8e7'} d="m468.48 569.402 62.22-14.539-7.75-12.601-62.415 14.343Zm0 0" />
      <path fill={forceColor ?? '#ffc100'} d="m728.598 282.668 4.265-30.05-12.597 3.1-4.07 29.083Zm0 0" />
      <path fill={forceColor ?? '#ceff29'} d="m775.895 379.215 22.289-25.59-6.008-17.645-22.29 26.563Zm0 0" />
      <path fill={forceColor ?? '#ffbd00'} d="m741.2 284.023 4.26-30.628-12.597-.778-4.265 30.051Zm0 0" />
      <path fill={forceColor ?? '#00d4ff'} d="m507.637 597.707 61.636-15.121L559 579.484l-61.832 14.926Zm0 0" />
      <path fill={forceColor ?? '#f1fc06'} d="m662.89 333.074 18.997-22.879-9.305 14.157-18.605 21.324Zm0 0" />
      <path fill={forceColor ?? '#ff2d00'} d="m297.332 120.785.387 14.93 19.383 42.07L314 162.47Zm0 0" />
      <path fill={forceColor ?? '#1cffdb'} d="m460.535 556.605 62.414-14.343-6.785-14.348-62.414 14.152Zm0 0" />
      <path fill={forceColor ?? '#ff4e00'} d="m37.797 175.652 3.68 28.887 18.996-34.703-3.684-28.887Zm0 0" />
      <path fill={forceColor ?? '#c4ff33'} d="m365.754 343.93 6.781 23.847 4.848 52.153-6.977-24.043Zm0 0" />
      <path fill={forceColor ?? '#9b0000'} d="m235.5 32.379-9.691 14.93 25.586 22.296 6.007-14.734Zm0 0" />
      <path fill={forceColor ?? '#d4ff23'} d="m17.25 365.45 7.754 27.917 5.621-46.14-7.754-28.887Zm0 0" />
      <path fill={forceColor ?? '#008cff'} d="m74.234 662.266 2.907 9.304-14.34-38.965-3.492-11.246Zm0 0" />
      <path fill={forceColor ?? '#87ff70'} d="m744.492 455.406 37.992-20.355-.195-19-38.184 21.324Zm0 0" />
      <path fill={forceColor ?? '#00d4ff'} d="m518.102 598.094 61.445-15.121-10.274-.387-61.636 15.121Zm0 0" />
      <path fill={forceColor ?? '#8d0000'} d="m147.309 30.055-11.63 22.683 28.493-3.683 8.723-21.715Zm0 0" />
      <path fill={forceColor ?? '#c4ff33'} d="m613.66 378.246 32.563-17.836-6.008 16.48-32.176 16.673Zm0 0" />
      <path fill={forceColor ?? '#43ffb4'} d="m684.406 522.68 50.203-16.672 5.04-15.899-50.59 17.45Zm0 0" />
      <path fill={forceColor ?? '#0ff8e7'} d="m603.387 572.117 58.343-15.12 8.72-9.31-58.727 15.704Zm0 0" />
      <path fill={forceColor ?? '#0028ff'} d="m338.422 715.582-1.742 16.672-20.16 26.754.968-15.899Zm0 0" />
      <path fill={forceColor ?? '#02e8f4'} d="m375.25 548.078 2.715 26.754-9.5 44.59-2.906-25.98Zm0 0" />
      <path fill={forceColor ?? '#94ff63'} d="m559.773 424 44.196-13.766-2.133 17.45-44.191 13.183Zm0 0" />
      <path fill={forceColor ?? '#1cffdb'} d="m42.254 560.098 5.621 17.64-7.367-44.976-5.813-19.582Zm0 0" />
      <path fill={forceColor ?? '#00f'} d="m160.293 785.762-2.52-2.133-22.484-19.582 1.164.973Zm0 0" />
      <path fill={forceColor ?? '#66ff90'} d="m504.34 469.945 53.11-11.824 1.355 17.45-53.11 11.628Zm0 0" />
      <path fill={forceColor ?? '#0010ff'} d="m136.453 765.02-1.164-.973-20.934-24.813v-.582Zm0 0" />
      <path fill={forceColor ?? '#30ffc7'} d="m453.75 542.066 62.414-14.152-5.234-15.703-62.606 13.957Zm0 0" />
      <path fill={forceColor ?? '#e4ff13'} d="m769.887 362.543 22.289-26.563-7.754-15.703-22.098 27.145Zm0 0" />
      <path fill={forceColor ?? '#e80000'} d="m278.336 84.727-2.715 14.539 22.098 36.449-.387-14.93Zm0 0" />
      <path fill={forceColor ?? '#b00'} d="m257.402 54.871-6.007 14.734 24.226 29.66 2.715-14.538Zm0 0" />
      <path fill={forceColor ?? '#d10000'} d="m84.121 85.113-4.848 27.723 25.782-20.742 3.68-27.336Zm0 0" />
      <path fill={forceColor ?? '#feed00'} d="m673.164 322.797 19.383-24.04-10.66 11.438-18.996 22.88Zm0 0" />
      <path fill={forceColor ?? '#0000f1'} d="m185.105 800.3-3.878-2.71-23.454-13.961 2.52 2.133Zm0 0" />
      <path fill={forceColor ?? '#ff9f00'} d="m333.383 224.117 9.11 18.613 13.956 49.63-10.66-18.805Zm0 0" />
      <path fill={forceColor ?? '#00d8ff'} d="m528.18 595.77 61.25-15.122-9.883 2.325-61.445 15.12Zm0 0" />
      <path fill={forceColor ?? '#0038ff'} d="M114.355 738.652v.582L95.363 709.57l-.968-2.324Zm0 0" />
      <g clipPath="url(#p)">
        <path fill={forceColor ?? '#0000e3'} d="m265.738 801.465-5.816 3.101-24.422 5.235 4.652-2.715Zm0 0" />
      </g>
      <path fill={forceColor ?? '#9dff5a'} d="m744.105 437.375 38.184-21.324-2.324-18.805-38.184 22.102Zm0 0" />
      <path fill={forceColor ?? '#43ffb4'} d="m448.324 526.168 62.606-13.957-3.875-16.48-62.61 13.57Zm0 0" />
      <path fill={forceColor ?? '#f4f802'} d="m762.324 347.422 22.098-27.145-9.11-13.375-21.902 27.723Zm0 0" />
      <path fill={forceColor ?? '#1fffd7'} d="m611.723 563.39 58.726-15.702 7.563-11.633-59.121 16.093Zm0 0" />
      <path fill={forceColor ?? '#d7ff1f'} d="m620.832 364.676 33.145-19-7.754 14.734-32.563 17.836Zm0 0" />
      <path fill={forceColor ?? '#00d8ff'} d="m423.32 605.074 63.77-16.48-9.692-8.528-64.156 16.286Zm0 0" />
      <path fill={forceColor ?? '#56ffa0'} d="m689.059 507.559 50.59-17.45 3.292-16.867-50.78 18.031Zm0 0" />
      <path fill={forceColor ?? '#00e4f8'} d="m413.242 596.352 64.156-16.286-8.918-10.664-64.543 15.703Zm0 0" />
      <path fill={forceColor ?? '#ffde00'} d="m684.21 315.434 19.774-25.204-11.437 8.528-19.383 24.234Zm0 0" />
      <path fill={forceColor ?? '#7dff7a'} d="m504.535 452.691 53.11-11.824-.196 17.254-53.11 11.824Zm0 0" />
      <path fill={forceColor ?? '#aaff4d'} d="m563.457 408.102 44.582-14.54-4.07 16.672L559.773 424Zm0 0" />
      <path fill={forceColor ?? '#0000e8'} d="m210.3 808.445-5.23-3.297-23.843-7.558 3.878 2.71Zm0 0" />
      <path fill={forceColor ?? '#00d0ff'} d="m433.98 611.086 63.188-16.676-10.078-5.816-63.77 16.48Zm0 0" />
      <path fill={forceColor ?? '#94ff63'} d="m23.84 441.45 7.363 24.425 1.164-46.527-7.363-25.98Zm0 0" />
      <path fill={forceColor ?? '#0cf4eb'} d="m403.938 585.105 64.542-15.703-7.945-12.797-64.738 15.125Zm0 0" />
      <path fill={forceColor ?? '#00e4f8'} d="m537.68 590.535 61.25-14.93-9.5 5.043-61.25 15.122Zm0 0" />
      <path fill={forceColor ?? '#83ff73'} d="m377.383 419.93 2.906 28.496v50.988l-3.101-28.305Zm0 0" />
      <path fill={forceColor ?? '#ff9100'} d="m26.555 244.477 6.59 29.855 14.73-39.55-6.398-30.243Zm0 0" />
      <path fill={forceColor ?? '#0008ff'} d="m316.52 759.008-4.653 10.469-22.094 19.386 3.875-9.5Zm0 0" />
      <path fill={forceColor ?? '#ffe600'} d="m753.41 334.625 21.903-27.723-10.47-10.664-21.706 27.723Zm0 0" />
      <path fill={forceColor ?? '#0cf'} d="m444.64 614.379 62.997-16.672-10.469-3.297-63.188 16.676Zm0 0" />
      <path fill={forceColor ?? '#00a0ff'} d="m368.465 619.422.969 23.07-13.567 39.16-1.355-22.101Zm0 0" />
      <path fill={forceColor ?? '#0cf'} d="m59.309 621.36 3.492 11.245-10.856-41.488-4.07-13.379Zm0 0" />
      <path fill={forceColor ?? '#ffd300'} d="m696.035 310.973 20.16-26.172-12.21 5.43-19.774 25.203Zm0 0" />
      <path fill={forceColor ?? '#0064ff'} d="m94.395 707.246.968 2.324-16.281-33.734-1.941-4.266Zm0 0" />
      <path fill={forceColor ?? '#1cffdb'} d="m395.797 571.73 64.738-15.125-6.785-14.539-65.125 14.735Zm0 0" />
      <path fill={forceColor ?? '#5aff9d'} d="m444.445 509.3 62.61-13.57-2.133-17.253-62.996 13.57Zm0 0" />
      <path fill={forceColor ?? 'maroon'} d="m172.895 27.34-8.723 21.715 29.46 4.843 5.622-20.742Zm0 0" />
      <path fill={forceColor ?? '#b4ff43'} d="m741.781 419.348 38.184-22.102-4.07-18.031-37.993 22.879Zm0 0" />
      <path fill={forceColor ?? '#ffdb00'} d="m743.137 323.96 21.707-27.722-11.63-7.754-21.124 27.723Zm0 0" />
      <path fill={forceColor ?? '#e7ff0f'} d="m629.555 353.043 33.336-19.969-8.914 12.602-33.145 19Zm0 0" />
      <path fill={forceColor ?? '#ffd000'} d="m708.246 309.617 20.352-26.949-12.403 2.133-20.16 26.172Zm0 0" />
      <path fill={forceColor ?? '#00d0ff'} d="m455.496 614.96 62.606-16.866-10.465-.387-62.996 16.867Zm0 0" />
      <path fill={forceColor ?? '#30ffc7'} d="m618.89 552.148 59.122-16.093 6.394-13.375-59.699 16.48Zm0 0" />
      <path fill={forceColor ?? '#ffd000'} d="m732.09 316.207 21.125-27.723-12.016-4.652-20.933 27.527Zm0 0" />
      <path fill={forceColor ?? '#fc0'} d="m720.266 311.36 20.933-27.337-12.601-1.355-20.352 26.95Zm0 0" />
      <path fill={forceColor ?? '#6dff8a'} d="m692.16 491.273 50.781-18.03 1.551-17.837-50.976 18.614Zm0 0" />
      <path fill={forceColor ?? '#94ff63'} d="m506.473 436.215 53.3-12.215-2.128 16.867-53.11 12.02Zm0 0" />
      <path fill={forceColor ?? '#c1ff36'} d="m568.887 393.563 44.773-15.317-5.62 15.317-44.583 14.539Zm0 0" />
      <path fill={forceColor ?? '#0cf4eb'} d="m546.402 582.973 61.25-14.926-8.722 7.558-61.25 14.93Zm0 0" />
      <path fill={forceColor ?? '#2cffca'} d="m388.625 556.8 65.125-14.734-5.426-15.898-65.515 13.96Zm0 0" />
      <path fill={forceColor ?? '#ff6000'} d="m317.102 177.785 7.558 18.61 17.832 46.335-9.11-18.613Zm0 0" />
      <path fill={forceColor ?? '#ffe600'} d="m356.254 292.36 6.59 24.042 9.691 51.375-6.781-23.847Zm0 0" />
      <g clipPath="url(#q)">
        <path fill={forceColor ?? '#0000ed'} d="m235.5 809.996-6.785-3.488-23.645-1.36 5.23 3.297Zm0 0" />
      </g>
      <path fill={forceColor ?? '#56ffa0'} d="m34.695 513.18 5.813 19.582-3.293-45.367-6.012-21.52Zm0 0" />
      <path fill={forceColor ?? '#6dff8a'} d="m441.926 492.047 62.996-13.57-.777-17.254-62.797 13.183Zm0 0" />
      <path fill={forceColor ?? '#00d4ff'} d="m465.96 612.441 62.22-16.671-10.078 2.324-62.606 16.867Zm0 0" />
      <path fill={forceColor ?? '#ff1a00'} d="m56.79 140.95 3.683 29.077 22.484-28.109-3.684-29.082Zm0 0" />
      <path fill={forceColor ?? '#caff2c'} d="m737.902 402.094 37.993-22.88-6.008-16.671L732.09 386Zm0 0" />
      <path fill={forceColor ?? '#000cff'} d="m157.773 783.629-2.52-7.367-21.124-18.418 1.16 6.203Zm0 0" />
      <path fill={forceColor ?? '#00f'} d="m289.773 788.863-6.98 3.684-22.871 12.02 5.816-3.102Zm0 0" />
      <path fill={forceColor ?? '#00d0ff'} d="m361.684 623.105 61.636-18.03-10.078-8.723-62.219 17.445Zm0 0" />
      <path fill={forceColor ?? '#00dcfe'} d="m351.023 613.797 62.22-17.445-9.305-11.247-62.801 16.868Zm0 0" />
      <path fill={forceColor ?? '#0028ff'} d="m135.29 764.047-1.161-6.203-19.578-23.457-.196 4.847Zm0 0" />
      <path fill={forceColor ?? '#f8f500'} d="m639.246 343.93 33.918-21.133-10.273 10.277-33.336 19.969Zm0 0" />
      <path fill={forceColor ?? '#a40000'} d="m108.734 64.758-3.68 27.336 28.106-12.797 2.52-26.559Zm0 0" />
      <path fill={forceColor ?? '#00c8ff'} d="m372.73 629.695 61.25-18.61-10.66-6.01-61.636 18.03Zm0 0" />
      <path fill={forceColor ?? '#0064ff'} d="m355.867 681.652-2.133 17.836-17.054 32.766 1.742-16.672Zm0 0" />
      <path fill={forceColor ?? 'gold'} d="m22.871 318.34 7.754 28.887 10.078-43.04-7.558-29.855Zm0 0" />
      <path fill={forceColor ?? '#0098ff'} d="m76.95 671.57 2.132 4.266L65.512 639l-2.711-6.395Zm0 0" />
      <path fill={forceColor ?? '#43ffb4'} d="m382.809 540.129 65.515-13.961-3.879-16.867-65.707 13.379Zm0 0" />
      <path fill={forceColor ?? '#06ecf1'} d="m341.137 601.973 62.8-16.868-8.14-13.375-63.578 16.09Zm0 0" />
      <path fill={forceColor ?? '#00f'} d="m181.227 797.59-4.07-8.34-21.903-12.988 2.52 7.367Zm0 0" />
      <path fill={forceColor ?? '#43ffb4'} d="m624.707 539.16 59.504-16.48 4.848-15.121-59.895 16.867Zm0 0" />
      <path fill={forceColor ?? '#83ff73'} d="m693.516 474.02 50.976-18.614-.387-18.031-50.976 19.195Zm0 0" />
      <path fill={forceColor ?? '#840000'} d="m199.254 33.156-5.621 20.742 29.46 13.575 2.716-20.164Zm0 0" />
      <path fill={forceColor ?? '#19ffde'} d="m554.152 572.7 61.25-14.735-7.75 10.082-61.25 14.926Zm0 0" />
      <path fill={forceColor ?? '#40ffb7'} d="m380.098 499.414 2.906 27.336-5.04 48.082-2.714-26.754Zm0 0" />
      <path fill={forceColor ?? '#00c4ff'} d="m384.168 633.188 60.473-18.614-10.66-3.488-61.25 18.61Zm0 0" />
      <path fill={forceColor ?? '#d4ff23'} d="m575.668 380.766 45.164-16.09-7.172 13.57-44.773 15.317Zm0 0" />
      <path fill={forceColor ?? '#aaff4d'} d="m509.96 420.703 53.497-12.601L559.773 424l-53.3 12.215Zm0 0" />
      <path fill={forceColor ?? '#004cff'} d="m114.355 739.234.196-4.847-17.832-27.723-1.356 2.906Zm0 0" />
      <path fill={forceColor ?? '#00e0fb'} d="m475.848 607.207 61.832-16.672-9.5 5.235-62.22 16.671Zm0 0" />
      <path fill={forceColor ?? '#16ffe1'} d="m332.219 587.82 63.578-16.09-7.172-14.93-63.965 15.122Zm0 0" />
      <path fill={forceColor ?? '#deff19'} d="m732.09 386 37.797-23.457-7.563-15.121-37.601 24.039Zm0 0" />
      <path fill={forceColor ?? '#ff2900'} d="m297.719 135.715 5.426 18.805 21.515 41.875-7.558-18.61Zm0 0" />
      <path fill={forceColor ?? '#ffea00'} d="m649.906 337.531 34.305-22.097-11.047 7.363-33.918 21.133Zm0 0" />
      <path fill={forceColor ?? '#83ff73'} d="m441.348 474.406 62.797-13.183 1.164-16.868-62.993 12.989Zm0 0" />
      <path fill={forceColor ?? '#1fffd7'} d="m47.875 577.738 4.07 13.38-6.98-42.848-4.457-15.508Zm0 0" />
      <path fill={forceColor ?? '#00f'} d="m205.07 805.148-5.62-8.722-22.294-7.176 4.07 8.34Zm0 0" />
      <path fill={forceColor ?? '#00c4ff'} d="m395.602 633.766 59.894-18.805-10.855-.582-60.473 18.808Zm0 0" />
      <path fill={forceColor ?? '#56ffa0'} d="m378.738 522.68 65.707-13.38-2.52-17.253-65.706 12.601Zm0 0" />
      <g clipPath="url(#r)">
        <path fill={forceColor ?? '#00f'} d="m259.922 804.566-8.14-3.101-23.067 5.043 6.785 3.488Zm0 0" />
      </g>
      <path fill={forceColor ?? '#29ffce'} d="m324.66 571.922 63.965-15.121-5.816-16.672-64.352 14.152Zm0 0" />
      <path fill={forceColor ?? '#eeff09'} d="m724.723 371.46 37.601-24.038-8.914-12.797-37.215 24.04Zm0 0" />
      <path fill={forceColor ?? '#920000'} d="m225.613 47.309-2.52 20.164 28.493 21.71-.191-19.578Zm0 0" />
      <path fill={forceColor ?? '#0038ff'} d="m336.68 732.254-5.43 11.437-19.383 25.786 4.653-10.47Zm0 0" />
      <path fill={forceColor ?? '#ffde00'} d="m661.148 333.848 34.887-22.875-11.824 4.46-34.305 22.098Zm0 0" />
      <path fill={forceColor ?? '#9aff5d'} d="m693.129 456.57 50.976-19.195-2.324-18.027-50.785 19.773Zm0 0" />
      <path fill={forceColor ?? '#0074ff'} d="m95.363 709.57 1.356-2.906-15.313-31.601-2.324.773Zm0 0" />
      <path fill={forceColor ?? '#5aff9d'} d="m629.164 524.426 59.895-16.867 3.101-16.286-60.086 17.059Zm0 0" />
      <path fill={forceColor ?? '#00c4ff'} d="m305.086 642.879 56.598-19.774-10.66-9.308-57.376 19Zm0 0" />
      <path fill={forceColor ?? '#00d0ff'} d="m293.648 632.797 57.375-19-9.886-11.824-58.149 18.03Zm0 0" />
      <path fill={forceColor ?? '#d1ff26'} d="m25.004 393.367 7.363 25.98 5.43-44.784-7.172-27.336Zm0 0" />
      <path fill={forceColor ?? '#e4ff13'} d="m583.809 370.102 45.746-17.059-8.723 11.633-45.164 16.09Zm0 0" />
      <path fill={forceColor ?? '#df0000'} d="m275.621 99.266 2.91 19.195 24.614 36.059-5.426-18.805Zm0 0" />
      <path fill={forceColor ?? '#29ffce'} d="m560.742 560.484 61.25-14.539-6.59 12.02-61.25 14.734Zm0 0" />
      <path fill={forceColor ?? '#c4ff33'} d="m372.535 367.777 2.91 28.692 4.844 51.957-2.906-28.496Zm0 0" />
      <path fill={forceColor ?? '#00bcff'} d="m317.297 649.86 55.433-20.165-11.046-6.59-56.598 19.774Zm0 0" />
      <path fill={forceColor ?? '#09f0ee'} d="m484.762 599.258 61.64-16.285-8.722 7.562-61.832 16.672Zm0 0" />
      <path fill={forceColor ?? '#beff39'} d="m514.809 406.55 54.078-12.988-5.43 14.54-53.496 12.601Zm0 0" />
      <path fill={forceColor ?? '#b20000'} d="m251.395 69.605.19 19.579 26.946 29.277-2.91-19.195Zm0 0" />
      <path fill={forceColor ?? '#0cf'} d="m406.652 631.055 59.309-18.614-10.465 2.52-59.894 18.805Zm0 0" />
      <path fill={forceColor ?? '#00e0fb'} d="m282.988 620.004 58.149-18.031-8.918-14.153-58.727 16.867Zm0 0" />
      <path fill={forceColor ?? '#fbf100'} d="m716.195 358.664 37.215-24.039-10.273-10.664-36.828 24.43Zm0 0" />
      <path fill={forceColor ?? '#ff5200'} d="m41.477 204.54 6.398 30.241 18.8-33.926-6.202-30.828Zm0 0" />
      <path fill={forceColor ?? '#ffdb00'} d="m672.777 333.074 35.47-23.457-12.212 1.356-34.887 22.875Zm0 0" />
      <path fill={forceColor ?? '#ff9f00'} d="m342.492 242.73 6.012 24.04 14.34 49.632-6.59-24.043Zm0 0" />
      <path fill={forceColor ?? '#00d4ff'} d="M62.8 632.605 65.513 639l-10.274-39.16-3.293-8.723Zm0 0" />
      <path fill={forceColor ?? '#0028ff'} d="m155.254 776.262-.582-12.407-19.574-17.062-.97 11.05Zm0 0" />
      <path fill={forceColor ?? '#00b8ff'} d="m329.508 653.734 54.66-20.547-11.438-3.492-55.433 20.164Zm0 0" />
      <path fill={forceColor ?? '#9aff5d'} d="m442.316 457.344 62.993-12.989 2.714-16.09-63.187 12.794Zm0 0" />
      <path fill={forceColor ?? '#02e8f4'} d="m377.965 574.832.773 23.844-9.304 43.816-.97-23.07Zm0 0" />
      <path fill={forceColor ?? '#0040ff'} d="m134.129 757.844.969-11.051-18.22-21.711-2.327 9.305Zm0 0" />
      <path fill={forceColor ?? '#6dff8a'} d="m376.219 504.648 65.707-12.601-.578-17.64-66.098 12.019Zm0 0" />
      <path fill={forceColor ?? '#40ffb7'} d="m318.457 554.281 64.352-14.152-4.07-17.45L314 535.669Zm0 0" />
      <path fill={forceColor ?? '#ffe600'} d="m706.309 348.195 36.828-24.234-11.047-7.754-36.442 24.234Zm0 0" />
      <path fill={forceColor ?? 'gold'} d="m684.406 335.402 35.86-24.043-12.02-1.742-35.469 23.457Zm0 0" />
      <path fill={forceColor ?? '#00f'} d="m228.715 806.508-6.977-8.918-22.289-1.164 5.621 8.722Zm0 0" />
      <path fill={forceColor ?? '#ffdb00'} d="m695.648 340.441 36.442-24.234-11.824-4.848-35.86 23.848Zm0 0" />
      <path fill={forceColor ?? '#0ff8e7'} d="m273.297 604.688 58.922-16.868-7.559-15.898-59.504 15.512Zm0 0" />
      <path fill={forceColor ?? '#0018ff'} d="m177.156 789.25-1.937-13.375-20.547-12.02.582 12.407Zm0 0" />
      <path fill={forceColor ?? '#890000'} d="m135.68 52.738-2.52 26.754 29.848-4.265 1.164-26.172Zm0 0" />
      <path fill={forceColor ?? '#0018ff'} d="m311.867 769.477-8.14 4.46-20.934 18.61 6.98-3.684Zm0 0" />
      <path fill={forceColor ?? '#b1ff46'} d="m690.805 439.121 50.976-19.773-3.879-17.254-50.976 20.16Zm0 0" />
      <path fill={forceColor ?? '#f1fc06'} d="m593.113 361.574 46.133-17.644-9.691 9.113-45.746 17.059Zm0 0" />
      <path fill={forceColor ?? '#0060ff'} d="m114.55 734.387 2.329-9.305-16.477-25.785-3.683 7.367Zm0 0" />
      <path fill={forceColor ?? '#6dff8a'} d="m632.074 508.332 60.086-17.059 1.356-17.253-60.282 17.445Zm0 0" />
      <path fill={forceColor ?? '#00b8ff'} d="m341.719 654.316 53.883-20.55-11.434-.578-54.66 20.546Zm0 0" />
      <path fill={forceColor ?? '#94ff63'} d="m31.203 465.875 6.012 21.52.969-44.786-6.008-23.261Zm0 0" />
      <path fill={forceColor ?? '#00d8ff'} d="m417.117 625.43 58.73-18.223-9.886 5.234-59.309 18.614Zm0 0" />
      <path fill={forceColor ?? '#00b4ff'} d="m256.629 663.816 48.457-20.937-11.438-10.082-49.62 19.969Zm0 0" />
      <path fill={forceColor ?? '#3cffba'} d="m565.977 546.332 61.058-14.348-5.043 13.961-61.25 14.54Zm0 0" />
      <path fill={forceColor ?? '#16ffe1'} d="m492.902 588.594 61.25-15.895-7.75 10.274-61.64 16.285Zm0 0" />
      <path fill={forceColor ?? '#00c0ff'} d="m244.027 652.766 49.621-19.97-10.66-12.792-50.59 18.805Zm0 0" />
      <path fill={forceColor ?? '#00a8ff'} d="m78.887 675.836 2.52-.774-12.598-34.507L65.512 639Zm0 0" />
      <path fill={forceColor ?? '#d1ff26'} d="m521.398 394.145 54.27-13.38-6.781 12.798-54.078 12.988Zm0 0" />
      <path fill={forceColor ?? '#d10000'} d="m79.469 112.836 3.488 29.082 25.586-20.55-3.488-29.274Zm0 0" />
      <path fill={forceColor ?? '#00a8ff'} d="m269.809 671.379 47.488-21.52-12.211-6.98-48.457 20.937Zm0 0" />
      <path fill={forceColor ?? '#23ffd4'} d="m265.156 587.434 59.504-15.512-6.203-17.64-60.086 14.343Zm0 0" />
      <path fill={forceColor ?? '#0010ff'} d="m199.45 796.426-3.49-13.961-20.741-6.59 1.937 13.184Zm0 0" />
      <path fill={forceColor ?? '#00d4ff'} d="m232.398 638.809 50.59-18.805-9.691-15.317-51.363 17.641Zm0 0" />
      <path fill={forceColor ?? '#56ffa0'} d="m314 535.668 64.738-12.988-2.52-18.032-65.124 11.829Zm0 0" />
      <path fill={forceColor ?? '#0008ff'} d="m282.793 792.547-9.3-2.52-21.712 11.438 8.14 3.101Zm0 0" />
      <path fill={forceColor ?? '#83ff73'} d="m375.25 486.426 66.098-12.02.968-17.062-66.097 11.246Zm0 0" />
      <path fill={forceColor ?? '#b1ff46'} d="m444.836 441.059 63.187-12.793 4.262-14.93-63.187 12.41Zm0 0" />
      <path fill={forceColor ?? '#c4ff33'} d="m686.926 422.254 50.976-20.16L732.09 386l-50.59 20.355Zm0 0" />
      <path fill={forceColor ?? '#00a8ff'} d="m283.184 675.645 46.324-21.91-12.211-3.876-47.488 21.52Zm0 0" />
      <path fill={forceColor ?? '#feed00'} d="m603.191 355.95 46.715-18.419-10.66 6.399-46.133 17.644Zm0 0" />
      <path fill={forceColor ?? '#00a8ff'} d="m369.434 642.492-2.52 19-13.18 37.996 2.133-17.836Zm0 0" />
      <path fill={forceColor ?? '#00c0ff'} d="m353.543 651.41 53.11-20.355-11.051 2.71-53.883 20.551Zm0 0" />
      <path fill={forceColor ?? '#0040ff'} d="m154.672 763.855 4.07-16.285-18.023-15.703-5.621 14.926Zm0 0" />
      <path fill={forceColor ?? '#08f'} d="m96.719 706.664 3.683-7.367-14.148-29.469-4.848 5.235Zm0 0" />
      <path fill={forceColor ?? '#5aff9d'} d="m40.508 532.762 4.457 15.508-3.098-43.23-4.652-17.645Zm0 0" />
      <path fill={forceColor ?? '#0058ff'} d="m135.098 746.793 5.62-14.926-16.863-20.164-6.976 13.379Zm0 0" />
      <path fill={forceColor ?? '#ff9400'} d="m33.145 274.332 7.558 29.856 14.535-38.583-7.363-30.824Zm0 0" />
      <path fill={forceColor ?? '#06ecf1'} d="m221.934 622.328 51.558-17.64-8.336-17.254-52.336 16.09Zm0 0" />
      <path fill={forceColor ?? '#00a0ff'} d="m217.473 685.531 39.156-21.715-12.602-11.05-40.316 20.746Zm0 0" />
      <path fill={forceColor ?? '#02e8f4'} d="m426.613 617.094 58.149-17.836-8.914 7.949-58.73 18.418Zm0 0" />
      <path fill={forceColor ?? '#00b0ff'} d="m203.71 673.512 40.317-20.746-11.629-13.957-41.48 19.386Zm0 0" />
      <path fill={forceColor ?? '#83ff73'} d="m380.29 448.426 2.905 27.918-.191 50.215-2.906-27.145Zm0 0" />
      <path fill={forceColor ?? '#0034ff'} d="m175.219 775.875 2.328-17.254-18.805-11.05-4.07 16.284Zm0 0" />
      <path fill={forceColor ?? '#83ff73'} d="m633.234 491.465 60.282-17.445-.387-17.45-60.281 17.45Zm0 0" />
      <path fill={forceColor ?? '#0008ff'} d="m251.781 801.465-8.527-8.723-21.516 4.848 6.977 8.918Zm0 0" />
      <path fill={forceColor ?? '#39ffbe'} d="m258.371 568.625 60.086-14.344L314 535.668l-60.473 12.797Zm0 0" />
      <path fill={forceColor ?? '#ff6000'} d="m324.66 196.395 5.235 24.039 18.609 46.336-6.012-24.04Zm0 0" />
      <path fill={forceColor ?? '#0094ff'} d="m231.816 693.867 37.993-22.488-13.18-7.563-39.156 21.715Zm0 0" />
      <path fill={forceColor ?? '#e1ff16'} d="m528.957 383.676 54.852-13.574-8.141 10.664-54.27 13.379Zm0 0" />
      <path fill={forceColor ?? '#29ffce'} d="m499.496 575.992 61.246-15.508-6.59 12.215-61.25 16.09Zm0 0" />
      <path fill={forceColor ?? '#53ffa4'} d="m569.465 530.629 61.25-14.152-3.68 15.507-61.058 14.348Zm0 0" />
      <path fill={forceColor ?? '#0074ff'} d="m116.879 725.082 6.976-13.379-15.12-23.848-8.333 11.442Zm0 0" />
      <path fill={forceColor ?? '#00a8ff'} d="m296.363 676.227 45.356-21.91-12.211-.583-46.324 21.91Zm0 0" />
      <path fill={forceColor ?? '#d7ff1f'} d="M681.5 406.355 732.09 386l-7.367-14.54-50.203 20.552Zm0 0" />
      <path fill={forceColor ?? '#00c4ff'} d="m190.918 658.195 41.48-19.386-10.464-16.48-42.45 17.644Zm0 0" />
      <path fill={forceColor ?? '#ffe600'} d="m613.852 352.848 47.296-19-11.242 3.683-46.715 18.418Zm0 0" />
      <path fill={forceColor ?? '#26ffd1'} d="m51.945 591.117 3.293 8.723-6.59-40.52-3.683-11.05Zm0 0" />
      <path fill={forceColor ?? '#0014ff'} d="m221.738 797.59-5.039-13.961-20.738-.969 3.488 13.766Zm0 0" />
      <path fill={forceColor ?? '#6dff8a'} d="m311.094 516.477 65.125-11.829-.969-18.222-65.125 10.664Zm0 0" />
      <path fill={forceColor ?? 'maroon'} d="m164.172 49.055-1.164 26.172 30.625 4.457V53.898Zm0 0" />
      <path fill={forceColor ?? '#005cff'} d="m158.742 747.57 10.664-19.195-16.476-14.54-12.211 18.032Zm0 0" />
      <path fill={forceColor ?? '#008cff'} d="m188.594 707.438 28.879-21.907-13.762-12.02-30.234 20.743Zm0 0" />
      <path fill={forceColor ?? '#0070ff'} d="m140.719 731.867 12.21-18.031-15.507-18.223-13.567 16.09Zm0 0" />
      <path fill={forceColor ?? '#1cffdb'} d="m212.82 603.523 52.336-16.09-6.785-18.808-52.914 14.156Zm0 0" />
      <path fill={forceColor ?? '#009cff'} d="m173.477 694.254 30.234-20.742-12.793-15.317-31.594 19.192Zm0 0" />
      <path fill={forceColor ?? '#0094ff'} d="m246.547 698.52 36.637-22.875-13.375-4.266-37.993 22.488Zm0 0" />
      <path fill={forceColor ?? '#002cff'} d="m195.96 782.66.774-17.836-19.187-6.203-2.328 17.254Zm0 0" />
      <path fill={forceColor ?? '#ffe600'} d="m362.844 316.402 3.101 28.887 9.5 51.18-2.91-28.692Zm0 0" />
      <path fill={forceColor ?? '#0cf'} d="m364.785 645.398 52.332-19.773-10.465 5.43-53.109 20.355Zm0 0" />
      <path fill={forceColor ?? '#0070ff'} d="m353.734 699.488-6.203 12.797-16.281 31.406 5.43-11.437Zm0 0" />
      <path fill={forceColor ?? '#9aff5d'} d="m376.219 468.59 66.097-11.246 2.52-16.285-65.902 10.468Zm0 0" />
      <path fill={forceColor ?? '#c4ff33'} d="m449.098 425.746 63.187-12.41 5.621-13.375-62.992 12.406Zm0 0" />
      <path fill={forceColor ?? '#0074ff'} d="m169.406 728.375 19.188-21.129-15.117-13.183-20.547 19.773Zm0 0" />
      <path fill={forceColor ?? '#0080ff'} d="m204.293 716.55 27.523-22.683-14.343-8.336-28.88 21.715Zm0 0" />
      <path fill={forceColor ?? '#004cff'} d="m177.547 758.621 9.11-20.164-17.25-10.082-10.665 19.195Zm0 0" />
      <path fill={forceColor ?? '#00e0fb'} d="m65.512 639 3.297 1.555-9.5-36.645-4.07-4.07Zm0 0" />
      <path fill={forceColor ?? '#e7ff0f'} d="m674.52 392.012 50.203-20.551-8.528-12.797-50.008 20.55Zm0 0" />
      <path fill={forceColor ?? '#0084ff'} d="m152.93 713.836 20.547-19.774-13.957-16.675-22.098 18.226Zm0 0" />
      <path fill={forceColor ?? '#ffe200'} d="m624.902 352.656 47.875-19.582-11.629.774-47.296 19Zm0 0" />
      <path fill={forceColor ?? '#00e0fb'} d="m179.484 639.973 42.45-17.645-9.114-18.805-43.222 15.899Zm0 0" />
      <path fill={forceColor ?? '#00b4ff'} d="m159.324 677.387 31.594-19.192-11.434-18.222-32.757 17.445Zm0 0" />
      <path fill={forceColor ?? '#008cff'} d="m123.855 711.703 13.567-16.09-13.953-21.91-14.735 14.152Zm0 0" />
      <path fill={forceColor ?? '#00b4ff'} d="m81.406 675.063 4.848-5.235L74.43 637.84l-5.621 2.715Zm0 0" />
      <path fill={forceColor ?? '#0068ff'} d="m186.656 738.457 17.637-21.906-15.7-9.305-19.187 21.129Zm0 0" />
      <path fill={forceColor ?? '#9aff5d'} d="m632.848 474.02 60.28-17.45-2.132-17.449-60.281 17.45Zm0 0" />
      <path fill={forceColor ?? '#009cff'} d="m100.402 699.297 8.332-11.442-13.18-26.945-9.3 8.918Zm0 0" />
      <path fill={forceColor ?? '#13fce4'} d="m434.95 605.852 57.952-17.063-8.14 10.469-58.149 17.836Zm0 0" />
      <path fill={forceColor ?? '#00b0ff'} d="m309.348 673.316 44.195-21.906-11.824 2.906-45.356 21.91Zm0 0" />
      <path fill={forceColor ?? '#ffdb00'} d="m30.625 347.227 7.172 27.336 9.883-41.489-6.977-28.887Zm0 0" />
      <path fill={forceColor ?? '#53ffa4'} d="M253.527 548.465 314 535.668l-2.906-19.191-60.668 11.242Zm0 0" />
      <path fill={forceColor ?? '#eeff09'} d="m537.68 375.918 55.433-14.152-9.304 8.336-54.852 13.765Zm0 0" />
      <path fill={forceColor ?? '#f4f802'} d="m666.188 379.215 50.007-20.55-9.886-10.274-49.426 20.355Zm0 0" />
      <path fill={forceColor ?? '#00a0ff'} d="m137.422 695.613 21.902-18.226-12.597-19.969-23.258 16.285Zm0 0" />
      <path fill={forceColor ?? '#ffe200'} d="m635.95 355.367 48.456-19.965-11.629-2.328-47.875 19.582Zm0 0" />
      <path fill={forceColor ?? '#007cff'} d="m220.383 721.785 26.164-23.265-14.73-4.653-27.524 22.684Zm0 0" />
      <path fill={forceColor ?? '#0094ff'} d="m261.086 699.297 35.277-23.07-13.18-.582-36.636 22.875Zm0 0" />
      <path fill={forceColor ?? '#04f'} d="m331.25 743.691-8.914 5.817-18.61 24.43 8.141-4.461Zm0 0" />
      <path fill={forceColor ?? '#ff1e00'} d="m60.473 170.027 6.203 30.828 22.289-27.53-6.008-31.407Zm0 0" />
      <path fill={forceColor ?? '#66ff90'} d="m571.598 513.762 61.25-13.766-2.133 16.48-61.25 14.153Zm0 0" />
      <path fill={forceColor ?? '#0048ff'} d="m196.734 764.824 7.559-20.746-17.637-5.621-9.11 20.164Zm0 0" />
      <path fill={forceColor ?? '#feed00'} d="m656.883 368.746 49.426-20.355-10.66-7.95-49.04 20.356Zm0 0" />
      <path fill={forceColor ?? '#3cffba'} d="m504.922 561.262 61.055-14.93-5.235 14.152-61.246 15.508Zm0 0" />
    </>
  );
}

function DfxAssetIconCRV2({ forceColor }: BaseAssetIconProps) {
  return (
    <>
      <path fill={forceColor ?? '#ffe200'} d="m646.61 360.797 49.038-20.356-11.242-5.039-48.457 19.965Zm0 0" />
      <path fill={forceColor ?? '#36ffc1'} d="m205.457 582.781 52.914-14.156-4.844-20.16-53.496 12.601Zm0 0" />
      <path fill={forceColor ?? '#0064ff'} d="m204.293 744.078 16.09-22.293-16.09-5.234-17.637 21.906Zm0 0" />
      <path fill={forceColor ?? '#00d0ff'} d="m146.727 657.418 32.757-17.445-9.886-20.551-33.727 15.316Zm0 0" />
      <path fill={forceColor ?? '#ff2900'} d="m303.145 154.52 4.46 24.234 22.29 41.68-5.235-24.04Zm0 0" />
      <path fill={forceColor ?? '#87ff70'} d="m310.125 497.09 65.125-10.664.969-17.836-65.125 9.691Zm0 0" />
      <path fill={forceColor ?? '#0030ff'} d="m216.7 783.629-.97-17.836-18.996-.969-.773 17.64Zm0 0" />
      <path fill={forceColor ?? '#13fce4'} d="m169.598 619.422 43.222-15.899-7.363-20.742-44 13.957Zm0 0" />
      <path fill={forceColor ?? '#43ffb4'} d="m383.004 526.559.582 25.203-4.848 46.914-.773-23.844Zm0 0" />
      <path fill={forceColor ?? '#00acff'} d="m108.734 687.855 14.735-14.152-12.02-24.812-15.894 12.02Zm0 0" />
      <path fill={forceColor ?? '#002cff'} d="m303.727 773.938-10.465-1.36-19.77 17.45 9.301 2.519Zm0 0" />
      <path fill={forceColor ?? '#a80000'} d="m105.055 92.094 3.488 29.273 28.105-12.601-3.488-29.274Zm0 0" />
      <path fill={forceColor ?? '#00dcfe'} d="m375.055 636.29 51.558-19.196-9.496 8.531-52.332 19.773Zm0 0" />
      <path fill={forceColor ?? 'maroon'} d="M193.633 53.898v25.786l30.43 12.992-.97-25.203Zm0 0" />
      <path fill={forceColor ?? '#0020ff'} d="m243.254 792.934-6.59-13.762-19.965 4.457 5.04 13.96Zm0 0" />
      <path fill={forceColor ?? '#d7ff1f'} d="m454.914 412.367 62.992-12.406 7.172-11.246-63.187 12.02Zm0 0" />
      <path fill={forceColor ?? '#00c0ff'} d="m123.469 673.703 23.258-16.285-10.856-22.68-24.422 14.153Zm0 0" />
      <path fill={forceColor ?? '#0020ff'} d="m273.492 790.027-9.887-7.949-20.351 10.664 8.527 8.723Zm0 0" />
      <path
        fill={forceColor ?? '#b1ff46'}
        d="m378.934 451.527 65.902-10.66 4.262-15.12-65.903 10.077ZM630.715 456.57l60.09-17.449-3.88-16.867-60.085 17.45Zm0 0"
      />
      <path fill={forceColor ?? '#ceff29'} d="m32.367 419.348 5.817 23.261 5.425-43.039-5.812-25.007Zm0 0" />
      <path fill={forceColor ?? '#007cff'} d="m236.273 722.559 24.813-23.262-14.54-.777-26.163 23.265Zm0 0" />
      <path fill={forceColor ?? '#fbf100'} d="m547.176 370.492 56.015-14.543-10.078 5.625-55.433 14.344Zm0 0" />
      <path fill={forceColor ?? '#00bcff'} d="m321.367 666.727 43.418-21.329-11.242 6.012-44.195 21.906Zm0 0" />
      <path fill={forceColor ?? '#00c4ff'} d="m86.254 669.828 9.3-8.918-10.85-29.664-10.274 6.594Zm0 0" />
      <path fill={forceColor ?? '#009cff'} d="m275.234 696 34.114-22.684-12.985 2.91-35.277 23.07Zm0 0" />
      <path fill={forceColor ?? '#6dff8a'} d="m250.426 527.719 60.668-11.242-.969-19.387-60.863 9.887Zm0 0" />
      <path fill={forceColor ?? '#004cff'} d="m215.73 765.793 6.008-20.742-17.445-.973-7.559 20.746Zm0 0" />
      <path fill={forceColor ?? '#23ffd4'} d="m442.121 592.277 57.375-16.285-6.594 12.797-57.953 17.063Zm0 0" />
      <path fill={forceColor ?? '#0064ff'} d="m221.738 745.05 14.535-22.491-15.89-.774-16.09 22.293Zm0 0" />
      <path fill={forceColor ?? '#09f0ee'} d="m135.871 634.738 33.727-15.316-8.141-22.684-34.695 13.184Zm0 0" />
      <path fill={forceColor ?? '#df0000'} d="m278.531 118.46 3.489 24.622 25.585 35.672-4.46-24.234Zm0 0" />
      <path fill={forceColor ?? '#7dff7a'} d="m571.793 496.313 61.441-13.57-.386 17.253-61.25 13.766Zm0 0" />
      <path fill={forceColor ?? '#02e8f4'} d="m68.809 640.555 5.62-2.715-8.722-34.121-6.398.191Zm0 0" />
      <path fill={forceColor ?? '#94ff63'} d="m37.215 487.395 4.652 17.449.969-42.457-4.461-19.778Zm0 0" />
      <path fill={forceColor ?? '#920000'} d="m223.094 67.473.969 25.203L253.913 114l-2.328-24.816Zm0 0" />
      <path
        fill={forceColor ?? '#50ffa7'}
        d="m508.605 544.781 60.86-14.152-3.488 15.703-61.055 14.93ZM200.031 561.066l53.496-12.601-3.101-20.746-53.887 10.664Zm0 0"
      />
      <path fill={forceColor ?? '#30ffc7'} d="m161.457 596.738 44-13.957-5.426-21.715-44.777 11.825Zm0 0" />
      <path fill={forceColor ?? '#c4ff33'} d="m626.84 439.703 60.086-17.45-5.426-15.898-59.895 17.45Zm0 0" />
      <path fill={forceColor ?? '#2cffca'} d="m55.238 599.84 4.07 4.07-6.199-37.996-4.46-6.594Zm0 0" />
      <path fill={forceColor ?? '#00d4ff'} d="m95.555 660.91 15.894-12.02-9.883-27.144-16.863 9.5Zm0 0" />
      <path fill={forceColor ?? '#5aff9d'} d="m44.965 548.27 3.683 11.05-2.906-40.906-3.875-13.375Zm0 0" />
      <path fill={forceColor ?? '#b20000'} d="M251.586 89.184 253.914 114l28.106 29.082-3.489-24.621Zm0 0" />
      <path fill={forceColor ?? '#00e4f8'} d="m111.45 648.89 24.421-14.152-9.11-24.816-25.195 11.824Zm0 0" />
      <path fill={forceColor ?? '#ffea00'} d="m557.254 367.969 56.598-15.121-10.66 3.101-56.016 14.543Zm0 0" />
      <path fill={forceColor ?? '#9dff5a'} d="m311.094 478.281 65.125-9.691 2.715-17.063-65.125 8.727Zm0 0" />
      <path fill={forceColor ?? '#e7ff0f'} d="m461.89 400.734 63.188-12.02 8.14-9.304-62.991 12.02Zm0 0" />
      <path fill={forceColor ?? '#09f0ee'} d="m383.973 624.27 50.976-18.418-8.336 11.242-51.558 19.195Zm0 0" />
      <path fill={forceColor ?? '#06ecf1'} d="m378.738 598.676-2.71 20.36-9.114 42.456 2.52-19Zm0 0" />
      <path fill={forceColor ?? '#003cff'} d="m236.664 779.172-2.52-17.45-18.414 4.071.97 17.836Zm0 0" />
      <path fill={forceColor ?? '#08f'} d="M251.781 719.07 275.234 696l-14.148 3.297-24.813 23.262Zm0 0" />
      <path fill={forceColor ?? '#c4ff33'} d="m375.445 396.469 2.907 28.695 4.843 51.18-2.906-27.918Zm0 0" />
      <path fill={forceColor ?? '#ff9f00'} d="m348.504 266.77 3.098 29.082 14.343 49.437-3.101-28.887Zm0 0" />
      <path fill={forceColor ?? '#c7ff30'} d="m383.195 435.824 65.903-10.078 5.816-13.379-65.902 9.305Zm0 0" />
      <path fill={forceColor ?? '#ff5900'} d="m47.875 234.781 7.363 30.824 18.414-33.152-6.976-31.598Zm0 0" />
      <path fill={forceColor ?? '#00d0ff'} d="m332.414 656.84 42.64-20.55-10.269 9.108-43.418 21.329Zm0 0" />
      <path fill={forceColor ?? '#d7ff1f'} d="m621.605 423.805 59.895-17.45-6.98-14.343-59.504 17.254Zm0 0" />
      <path fill={forceColor ?? '#00acff'} d="m288.414 689.02 32.953-22.293-12.02 6.59L275.235 696Zm0 0" />
      <path fill={forceColor ?? '#ffe600'} d="m567.723 368.164 57.18-15.508-11.051.192-56.403 15.12Zm0 0" />
      <path fill={forceColor ?? '#0070ff'} d="m238.602 741.172 13.18-22.102-15.509 3.489-14.535 22.492Zm0 0" />
      <path fill={forceColor ?? '#0054ff'} d="m234.145 761.723 4.457-20.551-16.864 3.879-6.008 20.742Zm0 0" />
      <path fill={forceColor ?? '#87ff70'} d="m249.262 506.977 60.863-9.887.969-18.809-61.055 8.145Zm0 0" />
      <path fill={forceColor ?? '#94ff63'} d="m570.434 478.672 61.445-13.379 1.355 17.45-61.441 13.57Zm0 0" />
      <path fill={forceColor ?? '#26ffd1'} d="m126.762 609.922 34.695-13.184-6.203-23.847-35.082 10.859Zm0 0" />
      <path fill={forceColor ?? '#39ffbe'} d="m447.547 576.77 57.375-15.508-5.426 14.73-57.375 16.285Zm0 0" />
      <path fill={forceColor ?? '#0038ff'} d="m263.605 782.078-8.14-12.797-18.8 9.89 6.589 13.571Zm0 0" />
      <path fill={forceColor ?? '#0cf4eb'} d="m74.43 637.84 10.273-6.594-8.14-31.406-10.856 3.879Zm0 0" />
      <path fill={forceColor ?? '#66ff90'} d="m510.543 527.332 61.055-13.57-1.938 16.867-61.055 14.348Zm0 0" />
      <path fill={forceColor ?? '#00b0ff'} d="m366.914 661.492-6.59 14.153-12.793 36.64 6.203-12.797Zm0 0" />
      <path fill={forceColor ?? '#e4ff13'} d="m615.016 409.266 59.504-17.254-8.332-12.797-59.118 17.062Zm0 0" />
      <path fill={forceColor ?? '#6aff8d'} d="m196.54 538.383 53.886-10.664-1.164-20.742-54.078 8.722Zm0 0" />
      <path fill={forceColor ?? '#ffe600'} d="m578.188 371.266 57.761-15.899-11.047-2.71-57.18 15.507Zm0 0" />
      <path fill={forceColor ?? '#49ffad'} d="m155.254 572.89 44.777-11.824-3.492-22.683-45.16 9.695Zm0 0" />
      <path fill={forceColor ?? '#f4f802'} d="m470.227 391.43 62.992-12.02 9.113-6.594-62.996 11.829Zm0 0" />
      <path fill={forceColor ?? '#8d0000'} d="m133.16 79.492 3.488 29.274 29.657-4.07-3.297-29.47Zm0 0" />
      <path fill={forceColor ?? '#0040ff'} d="m293.262 772.578-11.242-6.785-18.415 16.285 9.887 8.145Zm0 0" />
      <path fill={forceColor ?? '#1fffd7'} d="m101.566 621.746 25.196-11.824-6.59-26.172-25.973 9.11Zm0 0" />
      <path fill={forceColor ?? '#16ffe1'} d="m84.703 631.246 16.863-9.5L94.2 592.86l-17.636 6.98Zm0 0" />
      <path fill={forceColor ?? '#f1fc06'} d="m607.07 396.277 59.117-17.062-9.304-10.469-58.73 16.867Zm0 0" />
      <path fill={forceColor ?? '#b4ff43'} d="m313.809 460.254 65.125-8.727 4.261-15.703-64.93 7.563Zm0 0" />
      <path fill={forceColor ?? '#ffe600'} d="m588.46 377.082 58.15-16.285-10.66-5.43-57.763 15.899Zm0 0" />
      <path fill={forceColor ?? '#007cff'} d="m347.531 712.285-9.691 7.172-15.504 30.05 8.914-5.816Zm0 0" />
      <path fill={forceColor ?? '#feed00'} d="m598.152 385.613 58.73-16.867-10.273-7.95-58.148 16.286Zm0 0" />
      <path fill={forceColor ?? '#1cffdb'} d="m391.531 609.727 50.59-17.45-7.172 13.575-50.976 18.418Zm0 0" />
      <path fill={forceColor ?? '#0054ff'} d="M322.336 749.508h-11.629l-17.445 23.07 10.465 1.36Zm0 0" />
      <path fill={forceColor ?? '#d60000'} d="m82.957 141.918 6.008 31.406 25.39-20.355-5.812-31.602Zm0 0" />
      <path fill={forceColor ?? '#0098ff'} d="m266.32 711.121 22.094-22.293-13.18 7.172-23.453 23.07Zm0 0" />
      <path fill={forceColor ?? '#d7ff1f'} d="m389.012 421.672 65.902-9.305 6.977-11.633-65.512 8.918Zm0 0" />
      <path fill={forceColor ?? '#ff9c00'} d="m40.703 304.188 6.977 28.886 13.957-37.418-6.399-30.05Zm0 0" />
      <path fill={forceColor ?? '#30ffc7'} d="m59.309 603.91 6.398-.191-5.816-35.285-6.782-2.52Zm0 0" />
      <path fill={forceColor ?? '#aaff4d'} d="m567.336 461.223 61.637-12.989 2.906 17.059-61.445 13.379Zm0 0" />
      <path fill={forceColor ?? '#0050ff'} d="m255.465 769.281-3.88-16.863-17.44 9.305 2.52 17.449Zm0 0" />
      <path fill={forceColor ?? '#00e4f8'} d="m342.3 643.848 41.673-19.578-8.918 12.02-42.64 20.55Zm0 0" />
      <path fill={forceColor ?? '#00c0ff'} d="m300.625 678.164 31.79-21.324-11.048 9.887-32.953 22.101Zm0 0" />
      <path fill={forceColor ?? '#feed00'} d="m479.531 384.645 62.801-11.829 9.883-3.875-62.8 11.825Zm0 0" />
      <path fill={forceColor ?? '#a0ff56'} d="m250.04 486.426 61.054-8.145 2.715-18.027-60.864 6.785Zm0 0" />
      <path fill={forceColor ?? '#50ffa7'} d="m451.426 559.32 57.18-14.343-3.684 16.285-57.375 15.508Zm0 0" />
      <path fill={forceColor ?? '#0080ff'} d="m254.496 732.836 11.824-21.715-14.539 7.95-13.18 22.1Zm0 0" />
      <path fill={forceColor ?? '#46ffb1'} d="m120.172 583.75 35.082-10.86-3.875-24.812-35.664 8.527Zm0 0" />
      <path fill={forceColor ?? '#83ff73'} d="m383.195 476.344.582 26.172-.191 49.246-.582-25.203Zm0 0" />
      <path fill={forceColor ?? '#7dff7a'} d="m510.734 509.3 61.059-12.988-.195 17.45-61.055 13.57Zm0 0" />
      <path fill={forceColor ?? '#0068ff'} d="m251.586 752.418 2.91-19.777-15.894 8.53-4.457 20.552Zm0 0" />
      <path fill={forceColor ?? '#5dff9a'} d="m48.648 559.32 4.461 6.594-2.714-38.195-4.653-9.305Zm0 0" />
      <path fill={forceColor ?? '#ff6000'} d="m329.895 220.434 3.101 29.277 18.606 46.14-3.098-29.081Zm0 0" />
      <path fill={forceColor ?? '#ffe200'} d="m37.797 374.563 5.812 25.007 9.5-39.937-5.43-26.559Zm0 0" />
      <path fill={forceColor ?? '#87ff70'} d="m195.184 515.7 54.078-8.723.777-20.551-54.078 6.98Zm0 0" />
      <path fill={forceColor ?? '#6aff8d'} d="m151.379 548.078 45.16-9.695-1.355-22.684-45.356 7.563Zm0 0" />
      <path fill={forceColor ?? '#beff39'} d="m562.684 444.55 61.828-12.796 4.46 16.48-61.636 12.989Zm0 0" />
      <path fill={forceColor ?? '#36ffc1'} d="m65.707 603.719 10.856-3.88-5.235-32.57-11.437 1.165Zm0 0" />
      <path fill={forceColor ?? '#caff2c'} d="m318.266 443.387 64.93-7.563 5.816-14.152-64.739 6.785Zm0 0" />
      <path fill={forceColor ?? '#e7ff0f'} d="m396.379 409.652 65.512-8.918 8.336-9.304-65.32 8.53Zm0 0" />
      <path fill={forceColor ?? '#90ff66'} d="m41.867 504.844 3.875 13.57.969-40.133-3.875-15.894Zm0 0" />
      <path fill={forceColor ?? '#caff2c'} d="m38.375 442.61 4.46 19.777 5.04-40.907-4.266-21.91Zm0 0" />
      <path fill={forceColor ?? '#40ffb7'} d="m94.2 592.86 25.972-9.11-4.457-27.145-26.363 6.594Zm0 0" />
      <path fill={forceColor ?? '#ffe600'} d="m489.414 380.766 62.8-11.825 10.274-1.164-62.605 11.825Zm0 0" />
      <path fill={forceColor ?? '#0054ff'} d="m282.02 765.793-9.5-11.824-17.055 15.312 8.14 12.797Zm0 0" />
      <path fill={forceColor ?? '#33ffc4'} d="m397.348 592.86 50.199-16.09-5.426 15.507-50.59 17.45Zm0 0" />
      <path fill={forceColor ?? '#3cffba'} d="m76.563 599.84 17.636-6.98-4.847-29.66-18.024 4.265Zm0 0" />
      <path fill={forceColor ?? '#00acff'} d="m279.5 699.297 20.934-21.133-12.02 10.664-22.094 22.293Zm0 0" />
      <path fill={forceColor ?? 'maroon'} d="m163.008 75.227 3.297 29.468 30.625 4.457-3.493-29.468Zm0 0" />
      <path fill={forceColor ?? '#ffea00'} d="m365.945 345.29 2.91 29.077 9.497 50.797-2.907-28.695Zm0 0" />
      <path fill={forceColor ?? '#d1ff26'} d="m556.672 428.848 61.832-12.602 6.008 15.508-61.828 12.797Zm0 0" />
      <path fill={forceColor ?? '#94ff63'} d="m509.188 490.883 61.246-12.211 1.359 17.64-61.059 12.989Zm0 0" />
      <path fill={forceColor ?? '#16ffe1'} d="m350.441 627.953 41.09-18.226-7.558 14.543-41.672 19.578Zm0 0" />
      <path fill={forceColor ?? '#00d8ff'} d="m311.094 663.816 31.207-19.968-9.887 12.992-31.98 21.324Zm0 0" />
      <path fill={forceColor ?? '#66ff90'} d="m453.363 540.902 57.18-13.57-1.938 17.645-57.18 14.539Zm0 0" />
      <path fill={forceColor ?? '#ffe200'} d="m499.883 379.602 62.605-11.825 10.469 1.551-62.61 11.824Zm0 0" />
      <path fill={forceColor ?? '#b7ff40'} d="m252.945 467.04 60.864-6.786 4.457-16.867-60.668 5.62Zm0 0" />
      <path fill={forceColor ?? '#43ffb4'} d="m383.586 551.762-2.91 21.71-4.649 45.563 2.711-20.36Zm0 0" />
      <path fill={forceColor ?? '#ff2500'} d="m66.676 200.855 6.976 31.598 21.903-26.945-6.59-32.184Zm0 0" />
      <path fill={forceColor ?? '#66ff90'} d="m115.715 556.605 35.664-8.527-1.55-24.816-35.86 6.008Zm0 0" />
      <path fill={forceColor ?? '#0098ff'} d="m269.031 719.848 10.469-20.551-13.18 11.824-11.824 21.52Zm0 0" />
      <path fill={forceColor ?? '#0068ff'} d="m310.707 749.508-12.406-5.43-16.281 21.715 11.242 6.785Zm0 0" />
      <path fill={forceColor ?? '#e1ff16'} d="m549.113 414.887 62.028-12.407 7.363 13.766-61.832 12.602Zm0 0" />
      <path fill={forceColor ?? '#f8f500'} d="m404.906 399.96 65.32-8.53 9.305-6.785-65.129 8.335Zm0 0" />
      <path fill={forceColor ?? '#006cff'} d="m272.52 753.969-5.04-15.703-15.894 14.152 3.879 16.863Zm0 0" />
      <path fill={forceColor ?? '#ff2900'} d="m307.605 178.754 3.102 29.469 22.29 41.488-3.102-29.277Zm0 0" />
      <path fill={forceColor ?? '#60ff97'} d="m53.11 565.914 6.78 2.52-2.519-35.48-6.976-5.235Zm0 0" />
      <path fill={forceColor ?? '#ffe600'} d="m510.348 381.348 62.609-12.02 10.465 4.652-62.606 11.829Zm0 0" />
      <path fill={forceColor ?? '#deff19'} d="m324.273 428.457 64.739-6.785 7.367-12.02-64.352 6.012Zm0 0" />
      <path fill={forceColor ?? '#a4ff53'} d="m195.96 493.406 54.08-6.98 2.905-19.387-53.886 5.04Zm0 0" />
      <path fill={forceColor ?? '#0080ff'} d="m267.48 738.457 1.551-18.61-14.535 12.989-2.91 19.582Zm0 0" />
      <path fill={forceColor ?? '#87ff70'} d="m149.828 523.262 45.356-7.563.777-22.293-45.36 5.426Zm0 0" />
      <path fill={forceColor ?? '#eeff09'} d="m540.586 402.867 62.023-12.215 8.532 11.828-62.028 12.407Zm0 0" />
      <path fill={forceColor ?? '#ffea00'} d="m520.816 385.809 62.606-12.024 9.887 7.176-62.22 12.02Zm0 0" />
      <path fill={forceColor ?? '#ad0000'} d="m108.543 121.367 5.812 31.602 27.915-12.215-5.622-31.988Zm0 0" />
      <path fill={forceColor ?? '#fbf100'} d="m531.09 392.98 62.219-12.02 9.3 9.692-62.023 12.215Zm0 0" />
      <path fill={forceColor ?? '#0cf4eb'} d="m376.027 619.035-6.98 15.895-8.723 40.715 6.59-14.153Zm0 0" />
      <path fill={forceColor ?? '#aaff4d'} d="m505.89 472.66 61.446-11.437 3.098 17.449-61.246 12.21Zm0 0" />
      <path fill={forceColor ?? '#4dffaa'} d="m401.418 574.25 50.008-14.93-3.88 17.45-50.198 16.09Zm0 0" />
      <path fill={forceColor ?? '#08f'} d="m337.84 719.457-12.598 1.55-14.535 28.5h11.629Zm0 0" />
      <path fill={forceColor ?? 'maroon'} d="m193.633 79.684 3.297 29.468 30.625 13.184-3.493-29.66Zm0 0" />
      <path fill={forceColor ?? '#66ff90'} d="m89.352 563.2 26.363-6.595-1.746-27.335-26.555 3.878Zm0 0" />
      <path fill={forceColor ?? '#00b8ff'} d="m360.324 675.645-10.465 8.918-12.02 34.894 9.692-7.172Zm0 0" />
      <path fill={forceColor ?? '#00c8ff'} d="m291.129 683.594 19.965-19.778-10.66 14.348-20.934 21.133Zm0 0" />
      <path fill={forceColor ?? '#7dff7a'} d="m453.559 521.516 57.175-12.215-.191 18.031-57.18 13.57Zm0 0" />
      <path fill={forceColor ?? '#60ff97'} d="m59.89 568.434 11.438-1.164L69 534.7l-11.629-1.747Zm0 0" />
      <path fill={forceColor ?? '#ffea00'} d="m414.402 392.98 64.934-8.335 10.078-3.88-64.738 8.145Zm0 0" />
      <path fill={forceColor ?? '#df0000'} d="m282.02 143.082 3.101 29.273 25.586 35.868-3.102-29.47Zm0 0" />
      <path fill={forceColor ?? '#63ff94'} d="m71.328 567.27 18.024-4.07-1.938-30.052L69 534.7Zm0 0" />
      <path fill={forceColor ?? '#90ff66'} d="m45.742 518.414 4.653 9.305.773-37.61-4.457-11.828Zm0 0" />
      <path fill={forceColor ?? '#2cffca'} d="m356.645 609.535 40.703-16.676-5.817 16.868-41.09 18.226Zm0 0" />
      <path fill={forceColor ?? '#d1ff26'} d="m257.598 449.008 60.668-5.621 6.007-14.93-60.086 4.461Zm0 0" />
      <path fill={forceColor ?? '#ff6000'} d="m55.238 265.605 6.399 30.051 18.023-32.183-6.008-31.02Zm0 0" />
      <path fill={forceColor ?? '#0cf4eb'} d="m320.008 646.367 30.433-18.414-8.14 15.895-31.207 19.968Zm0 0" />
      <path fill={forceColor ?? '#920000'} d="m224.063 92.676 3.492 29.66 29.652 21.133L253.914 114Zm0 0" />
      <path fill={forceColor ?? '#eeff09'} d="m332.027 415.664 64.352-6.012 8.527-9.691-63.965 5.426Zm0 0" />
      <path fill={forceColor ?? '#c1ff36'} d="m501.043 455.21 61.64-10.66 4.653 16.673-61.445 11.437Zm0 0" />
      <path fill={forceColor ?? '#007cff'} d="m298.3 744.078-10.66-10.273-15.12 20.164 9.5 11.824Zm0 0" />
      <path fill={forceColor ?? '#b20000'} d="m253.914 114 3.293 29.469 27.914 28.886-3.101-29.273Zm0 0" />
      <path fill={forceColor ?? '#c1ff36'} d="m378.352 425.164.773 27.336 4.652 50.016-.582-26.172Zm0 0" />
      <path fill={forceColor ?? '#8aff6d'} d="m113.969 529.27 35.86-6.008.773-24.43-35.856 3.492Zm0 0" />
      <path fill={forceColor ?? '#ffe200'} d="m424.676 388.91 64.738-8.144 10.469-1.164-64.352 8.144Zm0 0" />
      <path fill={forceColor ?? '#beff39'} d="m199.059 472.078 53.886-5.039 4.653-18.031-53.496 3.492Zm0 0" />
      <path fill={forceColor ?? '#00b4ff'} d="m281.824 702.59 9.305-18.996-11.629 15.703-10.469 20.55Zm0 0" />
      <path fill={forceColor ?? '#ffa300'} d="m351.602 295.852 3.101 29.855 14.152 48.66-2.91-29.273Zm0 0" />
      <path fill={forceColor ?? '#c7ff30'} d="m42.836 462.387 3.875 15.894 4.848-38.578-3.684-18.223Zm0 0" />
      <path fill={forceColor ?? '#a7ff50'} d="m150.602 498.832 45.359-5.426 3.098-21.328-45.16 3.297Zm0 0" />
      <path fill={forceColor ?? '#ffa300'} d="m47.68 333.074 5.43 26.559 13.566-35.863-5.04-28.114Zm0 0" />
      <path fill={forceColor ?? '#63ff94'} d="m403.55 554.281 49.813-13.379-1.937 18.614-50.008 14.734Zm0 0" />
      <path fill={forceColor ?? '#97ff60'} d="m451.813 502.129 57.375-11.246 1.546 18.418-57.175 12.215Zm0 0" />
      <path fill={forceColor ?? '#ffea00'} d="m43.61 399.57 4.265 21.91 9.11-38-3.876-23.847Zm0 0" />
      <path fill={forceColor ?? '#d4ff23'} d="m494.648 439.121 62.024-10.273 6.012 15.703-61.641 10.66Zm0 0" />
      <path fill={forceColor ?? '#0090ff'} d="m287.64 733.805-6.398-14.153-13.762 18.614 5.04 15.703Zm0 0" />
      <path fill={forceColor ?? '#00a0ff'} d="m281.242 719.652.39-17.062-12.6 17.258-1.552 18.609Zm0 0" />
      <path fill={forceColor ?? '#ffde00'} d="m435.531 387.746 64.352-8.144 10.465 1.746-63.961 8.144Zm0 0" />
      <path fill={forceColor ?? '#8dff6a'} d="m50.395 527.719 6.976 5.234.969-34.894-7.172-7.95Zm0 0" />
      <path fill={forceColor ?? '#e4ff13'} d="m264.188 432.723 60.085-4.266 7.754-12.793-59.699 3.293Zm0 0" />
      <path fill={forceColor ?? '#feed00'} d="m340.941 405.387 63.965-5.426 9.496-6.98-63.379 5.039Zm0 0" />
      <path fill={forceColor ?? '#8aff6d'} d="m87.414 533.148 26.555-3.878.777-26.946-26.555 1.356Zm0 0" />
      <path fill={forceColor ?? '#02e8f4'} d="m300.82 664.594 19.188-18.227-8.914 17.45-19.965 19.777Zm0 0" />
      <path fill={forceColor ?? '#0098ff'} d="m325.242 721.008-13.18-3.488-13.761 26.558 12.406 5.43Zm0 0" />
      <path fill={forceColor ?? '#46ffb1'} d="m361.102 589.176 40.316-14.926-4.07 18.61-40.703 16.675Zm0 0" />
      <path fill={forceColor ?? '#e4ff13'} d="m486.703 424.582 62.41-9.695 7.559 13.96-62.024 10.274Zm0 0" />
      <path fill={forceColor ?? '#920000'} d="m136.648 108.766 5.622 31.988 29.265-4.07-5.23-31.989Zm0 0" />
      <path fill={forceColor ?? '#df0000'} d="m88.965 173.324 6.59 32.184 24.812-19.778-6.012-32.761Zm0 0" />
      <path fill={forceColor ?? '#ffde00'} d="m446.387 389.492 63.96-8.144 10.66 4.46-63.573 8.337Zm0 0" />
      <path fill={forceColor ?? '#26ffd1'} d="m326.988 626.207 29.657-16.672-6.204 18.418-30.433 18.414Zm0 0" />
      <path fill={forceColor ?? '#83ff73'} d="m383.777 502.516-2.906 23.265-.195 47.692 2.91-21.711Zm0 0" />
      <path fill={forceColor ?? '#f1fc06'} d="m477.785 411.98 62.8-9.113 8.528 12.02-62.41 9.695Zm0 0" />
      <path fill={forceColor ?? '#ffe600'} d="m457.434 394.145 63.574-8.336 10.082 7.367-63.192 8.527Zm0 0" />
      <path fill={forceColor ?? '#8dff6a'} d="M57.371 532.953 69 534.7l.969-32.183-11.63-4.457Zm0 0" />
      <path fill={forceColor ?? '#8dff6a'} d="m69 534.7 18.414-1.552.777-29.468-18.222-1.164Zm0 0" />
      <path fill={forceColor ?? '#adff49'} d="m448.324 482.742 57.567-10.082 3.296 18.223-57.375 11.246Zm0 0" />
      <path fill={forceColor ?? '#feed00'} d="m467.898 401.703 63.192-8.723 9.496 9.887-62.8 9.113Zm0 0" />
      <path fill={forceColor ?? '#d7ff1f'} d="m204.102 452.5 53.496-3.492 6.59-16.09-53.11 1.937Zm0 0" />
      <path fill={forceColor ?? '#7dff7a'} d="m403.55 533.344 50.009-11.828-.196 19.386-49.812 13.38Zm0 0" />
      <path fill={forceColor ?? '#aaff4d'} d="m114.746 502.324 35.856-3.492 3.296-23.457-35.664 1.355Zm0 0" />
      <path fill={forceColor ?? '#00c4ff'} d="m349.86 684.563-13.18 3.683-11.438 32.762 12.598-1.551Zm0 0" />
      <path fill={forceColor ?? '#ffe200'} d="m351.023 398.02 63.38-5.04 10.273-4.07-62.801 4.652Zm0 0" />
      <path fill={forceColor ?? '#c4ff33'} d="m153.898 475.375 45.16-3.297 5.044-19.578-44.778 1.355Zm0 0" />
      <path fill={forceColor ?? '#00d8ff'} d="m292.293 681.652 8.527-17.058-9.691 19-9.496 18.996Zm0 0" />
      <path fill={forceColor ?? '#46ffb1'} d="m380.676 573.473-7.172 17.644-4.457 43.813 6.98-15.895Zm0 0" />
      <path fill={forceColor ?? '#c1ff36'} d="m46.71 478.281 4.458 11.828 4.652-36.058-4.261-14.348Zm0 0" />
      <path fill={forceColor ?? '#ff6400'} d="m332.996 249.71 3.488 30.438 18.22 45.559-3.102-29.855Zm0 0" />
      <path fill={forceColor ?? '#f8f500'} d="m272.328 418.957 59.7-3.293 8.913-10.277-59.117 2.52Zm0 0" />
      <path fill={forceColor ?? '#00a8ff'} d="m312.063 717.52-11.825-8.336-12.597 24.62 10.66 10.274Zm0 0" />
      <path fill={forceColor ?? '#0ff8e7'} d="M369.047 634.93 358 645.79l-8.14 38.773 10.464-8.918Zm0 0" />
      <path fill={forceColor ?? '#c4ff33'} d="m443.09 464.324 57.953-9.113 4.848 17.45-57.567 10.081Zm0 0" />
      <path fill={forceColor ?? '#63ff94'} d="m363.234 567.465 40.317-13.184-2.133 19.969-40.316 14.926Zm0 0" />
      <path fill={forceColor ?? '#ffea00'} d="m368.855 374.367.97 28.5 9.3 49.438-.773-27.14Zm0 0" />
      <path fill={forceColor ?? '#ff3000'} d="m73.652 232.453 6.008 31.02 21.324-25.977-5.43-31.988Zm0 0" />
      <path fill={forceColor ?? '#00c8ff'} d="m292.875 696.969-.582-15.317-10.469 20.938-.582 17.062Zm0 0" />
      <path fill={forceColor ?? '#ffdb00'} d="m361.875 393.563 62.8-4.653 10.856-1.164-62.219 4.652Zm0 0" />
      <path fill={forceColor ?? '#00b8ff'} d="m300.238 709.184-7.363-12.215-11.633 22.683 6.399 14.153Zm0 0" />
      <path fill={forceColor ?? '#1cffdb'} d="m308.379 642.492 18.414-16.285-6.785 20.16-19.188 18.227Zm0 0" />
      <path fill={forceColor ?? '#adff49'} d="m88.191 503.68 26.555-1.356 3.488-25.594-26.359-1.16Zm0 0" />
      <path fill={forceColor ?? '#840000'} d="m166.305 104.695 5.23 31.989 30.238 4.457-4.843-31.989Zm0 0" />
      <path fill={forceColor ?? '#97ff60'} d="m401.61 512.406 50.202-10.277 1.747 19.387-50.008 11.828Zm0 0" />
      <path fill={forceColor ?? '#43ffb4'} d="m331.64 603.91 29.266-14.734-4.261 20.36-29.852 16.671Zm0 0" />
      <path fill={forceColor ?? '#fbf100'} d="m47.875 421.48 3.684 18.223 8.527-35.867-3.102-20.356Zm0 0" />
      <path fill={forceColor ?? '#d7ff1f'} d="m436.113 447.07 58.535-7.949 6.395 16.09-57.953 9.113Zm0 0" />
      <path fill={forceColor ?? '#eeff09'} d="m211.078 434.855 53.11-2.132 8.14-13.766-52.527.777Zm0 0" />
      <path fill={forceColor ?? '#beff39'} d="m51.168 490.11 7.172 7.949 4.07-33.348-6.59-10.66Zm0 0" />
      <path fill={forceColor ?? '#ffe600'} d="m281.824 407.906 59.117-2.52 10.082-7.366-58.343 1.94Zm0 0" />
      <path fill={forceColor ?? 'gold'} d="m373.313 392.398 62.218-4.652 10.856 1.746-61.446 4.653Zm0 0" />
      <path fill={forceColor ?? '#ff6c00'} d="m61.637 295.656 5.039 28.114 17.25-30.829-4.266-29.468Zm0 0" />
      <path fill={forceColor ?? '#caff2c'} d="m118.234 476.73 35.664-1.355 5.426-21.52-35.277-.968Zm0 0" />
      <path fill={forceColor ?? '#b4ff43'} d="m69.969 502.516 18.222 1.164 3.684-28.11-18.027-3.879Zm0 0" />
      <path fill={forceColor ?? '#ffae00'} d="m53.11 359.633 3.874 23.847 12.985-34.12-3.293-25.59Zm0 0" />
      <path fill={forceColor ?? '#deff19'} d="m159.324 453.855 44.778-1.355 6.976-17.645-44.191-.386Zm0 0" />
      <path fill={forceColor ?? '#ff2d00'} d="m310.707 208.223 3.68 30.824 22.097 41.101-3.488-30.437Zm0 0" />
      <path fill={forceColor ?? '#ebff0c'} d="m427.777 431.559 58.926-6.977 7.945 14.54-58.535 7.948Zm0 0" />
      <path fill={forceColor ?? '#0cf'} d="m336.68 688.246-14.153-1.55-10.464 30.824 13.18 3.488Zm0 0" />
      <path fill={forceColor ?? '#b00'} d="m114.355 152.969 6.012 32.761 27.328-11.824-5.425-33.152Zm0 0" />
      <path fill={forceColor ?? '#b7ff40'} d="m58.34 498.059 11.629 4.457 3.879-30.825-11.438-6.98Zm0 0" />
      <path fill={forceColor ?? 'gold'} d="m384.941 394.145 61.446-4.653 11.047 4.653-60.864 5.039Zm0 0" />
      <path fill={forceColor ?? '#7dff7a'} d="m363.234 544.586 40.317-11.242v20.937l-40.317 13.184Zm0 0" />
      <path fill={forceColor ?? '#b1ff46'} d="m397.734 491.465 50.59-8.723 3.488 19.387-50.203 10.277Zm0 0" />
      <path fill={forceColor ?? '#16ffe1'} d="m300.625 657.613 7.754-15.12-7.559 22.1-8.527 17.06Zm0 0" />
      <path fill={forceColor ?? '#f8f500'} d="m418.281 418.184 59.504-6.204 8.918 12.602-58.926 6.977Zm0 0" />
      <path fill={forceColor ?? '#ffdb00'} d="m396.57 399.184 60.864-5.04 10.464 7.56-60.277 5.624Zm0 0" />
      <path fill={forceColor ?? '#890000'} d="m196.93 109.152 4.843 32.184 30.239 12.797-4.457-31.797Zm0 0" />
      <path fill={forceColor ?? '#ffe600'} d="m407.621 407.328 60.277-5.625 9.887 10.277-59.504 6.204Zm0 0" />
      <path fill={forceColor ?? '#c1ff36'} d="m379.125 452.5-2.906 24.813 4.652 48.468 2.906-23.265Zm0 0" />
      <path fill={forceColor ?? 'gold'} d="m292.68 399.96 58.343-1.94 10.852-4.457-57.566 1.55Zm0 0" />
      <path fill={forceColor ?? '#ffea00'} d="m219.8 419.734 52.528-.777 9.496-11.05-51.558-.192Zm0 0" />
      <path fill={forceColor ?? '#60ff97'} d="m333.965 580.066 29.27-12.601-2.329 21.71-29.265 14.735Zm0 0" />
      <path fill={forceColor ?? '#3cffba'} d="m313.418 618.063 18.223-14.153-4.848 22.297-18.414 16.285Zm0 0" />
      <path fill={forceColor ?? '#e40000'} d="m285.121 172.355 4.07 31.407 25.196 35.285-3.68-30.824Zm0 0" />
      <path fill={forceColor ?? '#00d8ff'} d="m322.527 686.695-12.402-6.203-9.887 28.692 11.825 8.336Zm0 0" />
      <path fill={forceColor ?? '#16ffe1'} d="m358.195 645.79-13.765 5.815-7.75 36.641 13.18-3.683Zm0 0" />
      <path fill={forceColor ?? '#0cf4eb'} d="m301.79 670.602-1.165-12.989-8.332 24.04.582 15.316Zm0 0" />
      <path fill={forceColor ?? '#d1ff26'} d="m91.875 475.57 26.36 1.16 5.812-23.843-25.777-3.297Zm0 0" />
      <path fill={forceColor ?? '#9b0000'} d="m227.555 122.336 4.457 31.797 29.46 21.129-4.265-31.793Zm0 0" />
      <path fill={forceColor ?? '#f4f802'} d="m51.559 439.703 4.261 14.348 7.95-33.348-3.684-16.867Zm0 0" />
      <path fill={forceColor ?? '#c7ff30'} d="m391.918 471.496 51.172-7.172 5.234 18.418-50.59 8.723Zm0 0" />
      <path fill={forceColor ?? '#ffa700'} d="m354.703 325.707 1.36 29.273 13.761 47.887-.969-28.5Zm0 0" />
      <path fill={forceColor ?? '#b00'} d="m257.207 143.469 4.266 31.793 27.718 28.5-4.07-31.407Zm0 0" />
      <path fill={forceColor ?? '#02e8f4'} d="m310.125 680.492-8.336-9.89-8.914 26.367 7.363 12.215Zm0 0" />
      <path fill={forceColor ?? '#80ff77'} d="m380.871 525.781-7.367 19.582v45.754l7.172-17.644Zm0 0" />
      <path fill={forceColor ?? '#f8f500'} d="m166.887 434.469 44.191.386 8.723-15.12-43.418-1.747Zm0 0" />
      <path fill={forceColor ?? '#9aff5d'} d="m361.102 521.71 40.507-9.304 1.942 20.938-40.317 11.242Zm0 0" />
      <path fill={forceColor ?? '#49ffad'} d="m373.504 591.117-11.238 12.988-4.07 41.684 10.85-10.86Zm0 0" />
      <path fill={forceColor ?? '#ffd000'} d="m304.309 395.113 57.566-1.55 11.438-1.165-56.793 1.356Zm0 0" />
      <path fill={forceColor ?? '#e7ff0f'} d="m124.047 452.887 35.277.968 7.563-19.386-34.504-2.91Zm0 0" />
      <path fill={forceColor ?? '#f10800'} d="m95.555 205.508 5.43 31.988 24.226-19-4.844-32.766Zm0 0" />
      <path fill={forceColor ?? '#dbff1c'} d="m73.848 471.691 18.027 3.88 6.395-26.176-17.446-6.204Zm0 0" />
      <path fill={forceColor ?? '#deff19'} d="m384.555 452.887 51.558-5.817 6.977 17.254-51.172 7.172Zm0 0" />
      <path fill={forceColor ?? 'gold'} d="m230.266 407.715 51.558.191 10.856-7.945-50.785-.973Zm0 0" />
      <path fill={forceColor ?? '#ebff0c'} d="m55.82 454.05 6.59 10.66 7.559-31.019-6.2-12.988Zm0 0" />
      <path fill={forceColor ?? '#9f0000'} d="m142.27 140.754 5.425 32.957 28.883-3.684-5.043-33.343Zm0 0" />
      <path fill={forceColor ?? '#36ffc1'} d="m306.246 630.664 7.172-12.601-5.04 24.43-7.753 15.12Zm0 0" />
      <path fill={forceColor ?? '#ffb900'} d="m56.984 383.48 3.102 20.356 12.21-31.988-2.327-22.489Zm0 0" />
      <path fill={forceColor ?? '#fc0'} d="m316.52 393.754 56.793-1.356 11.628 1.747-55.824 1.742Zm0 0" />
      <path fill={forceColor ?? '#80ff77'} d="m333.965 555.055 29.27-10.47v22.88l-29.27 12.601Zm0 0" />
      <path fill={forceColor ?? '#e1ff16'} d="m62.41 464.71 11.438 6.981 6.976-28.5-10.855-9.5Zm0 0" />
      <path fill={forceColor ?? '#f1fc06'} d="m375.445 436.215 52.332-4.656 8.336 15.511-51.558 5.817Zm0 0" />
      <path fill={forceColor ?? '#5dff9a'} d="m316.133 591.7 17.832-11.634-2.324 23.844-18.223 14.153Zm0 0" />
      <path fill={forceColor ?? '#ff3b00'} d="m79.66 263.473 4.266 29.468 20.547-24.812-3.489-30.633Zm0 0" />
      <path fill={forceColor ?? '#1cffdb'} d="m344.43 651.605-14.73.774-7.173 34.316 14.153 1.551Zm0 0" />
      <path fill={forceColor ?? '#b7ff40'} d="m356.836 498.832 40.898-7.367 3.875 20.941-40.507 9.305Zm0 0" />
      <path fill={forceColor ?? '#fc0'} d="m329.117 395.887 55.824-1.742 11.63 5.039-55.048 2.132Zm0 0" />
      <path fill={forceColor ?? '#ff7a00'} d="m66.676 323.77 3.293 25.59 16.476-29.274-2.52-27.145Zm0 0" />
      <path fill={forceColor ?? '#ffea00'} d="m365.172 421.672 53.11-3.488 9.495 13.375-52.332 4.656Zm0 0" />
      <path fill={forceColor ?? '#ffdb00'} d="m176.383 417.988 43.418 1.746 10.465-12.02-42.45-3.1Zm0 0" />
      <path fill={forceColor ?? '#ffd000'} d="m341.523 401.316 55.047-2.132 11.051 8.144-53.887 2.711Zm0 0" />
      <path fill={forceColor ?? '#f4f802'} d="m98.27 449.59 25.777 3.297 8.336-21.328-25.196-5.426Zm0 0" />
      <path fill={forceColor ?? '#ffdb00'} d="m353.734 410.04 53.887-2.712 10.66 10.856-53.11 3.488Zm0 0" />
      <path fill={forceColor ?? '#ffc800'} d="m241.895 398.988 50.785.973 11.629-4.848-49.813-1.36Zm0 0" />
      <path fill={forceColor ?? '#ff6c00'} d="m336.484 280.148 1.551 30.438 18.027 44.394-1.359-29.273Zm0 0" />
      <path fill={forceColor ?? '#fbf100'} d="m369.824 402.867-2.52 26.367 8.915 48.079 2.906-24.813Zm0 0" />
      <path fill={forceColor ?? '#30ffc7'} d="m307.992 641.328-1.746-10.664-5.621 26.95 1.164 12.988Zm0 0" />
      <path fill={forceColor ?? '#ffe600'} d="m132.383 431.559 34.504 2.91 9.496-16.48-33.531-4.458Zm0 0" />
      <path fill={forceColor ?? '#23ffd4'} d="m329.7 652.379-12.985-3.684-6.59 31.797 12.402 6.203Zm0 0" />
      <path fill={forceColor ?? '#29ffce'} d="m316.715 648.695-8.723-7.367-6.203 29.274 8.336 9.89Zm0 0" />
      <path fill={forceColor ?? '#d1ff26'} d="m350.441 477.121 41.477-5.625 5.816 19.969-40.898 7.367Zm0 0" />
      <path fill={forceColor ?? '#9dff5a'} d="m331.445 529.852 29.657-8.141 2.132 22.875-29.27 10.469Zm0 0" />
      <path fill={forceColor ?? '#ffc400'} d="m60.086 403.836 3.684 16.867 11.433-30.05-2.906-18.805Zm0 0" />
      <path fill={forceColor ?? '#4dffaa'} d="m362.266 604.105-13.957 8.141-3.88 39.36L358 645.788Zm0 0" />
      <path fill={forceColor ?? '#920000'} d="m171.535 136.684 5.043 33.343 29.461 4.461-4.266-33.347Zm0 0" />
      <path fill={forceColor ?? '#ffc100'} d="m254.496 393.754 49.813 1.36 12.21-1.36-48.648-1.55Zm0 0" />
      <path fill={forceColor ?? '#feed00'} d="m80.824 443.191 17.446 6.399 8.918-23.457-16.672-8.531Zm0 0" />
      <path fill={forceColor ?? '#5aff9d'} d="m308.96 601.973 7.173-10.274-2.715 26.364-7.172 12.601Zm0 0" />
      <path fill={forceColor ?? '#c80000'} d="m120.367 185.73 4.844 32.766 26.363-11.633-3.879-32.957Zm0 0" />
      <path fill={forceColor ?? '#beff39'} d="m376.219 477.313-6.977 21.328 4.262 46.722 7.367-19.582Zm0 0" />
      <path fill={forceColor ?? '#80ff77'} d="m315.938 564.363 18.027-9.308v25.011L316.133 591.7Zm0 0" />
      <path fill={forceColor ?? '#ffc800'} d="m187.816 404.613 42.45 3.102 11.629-8.727-41.477-3.875Zm0 0" />
      <path fill={forceColor ?? '#80ff77'} d="m373.504 545.363-11.047 15.121-.191 43.621 11.238-12.988Zm0 0" />
      <path fill={forceColor ?? '#e7ff0f'} d="m342.105 456.762 42.45-3.875 7.558 18.61-41.672 5.624Zm0 0" />
      <path fill={forceColor ?? '#ffd300'} d="m63.77 420.703 6.199 12.988 10.664-27.722-5.43-15.317Zm0 0" />
      <path fill={forceColor ?? '#ff3400'} d="m314.387 239.047 1.941 31.406 21.707 40.133-1.55-30.438Zm0 0" />
      <path fill={forceColor ?? '#ffde00'} d="m69.969 433.691 10.855 9.5 9.692-25.59-9.883-11.632Zm0 0" />
      <path fill={forceColor ?? '#ffb900'} d="m267.871 392.203 48.649 1.55 12.597 2.134-47.484-1.551Zm0 0" />
      <path fill={forceColor ?? 'gold'} d="m107.188 426.133 25.195 5.426 10.469-18.028-24.23-7.367Zm0 0" />
      <path fill={forceColor ?? '#fc0'} d="m142.852 413.531 33.53 4.457 11.434-13.375-32.754-5.816Zm0 0" />
      <path fill={forceColor ?? '#ff8600'} d="m69.969 349.36 2.328 22.488 15.508-27.528-1.36-24.234Zm0 0" />
      <path fill={forceColor ?? '#baff3c'} d="m326.598 504.844 30.238-6.012 4.266 22.879-29.657 8.14Zm0 0" />
      <path fill={forceColor ?? '#960000'} d="m201.773 141.336 4.266 33.152 29.656 12.793-3.683-33.148Zm0 0" />
      <path fill={forceColor ?? '#fbf100'} d="m332.219 438.54 43.226-2.325 9.11 16.672-42.45 3.875Zm0 0" />
      <path fill={forceColor ?? '#56ffa0'} d="m311.094 609.727-2.133-7.754-2.715 28.691 1.746 10.664Zm0 0" />
      <path fill={forceColor ?? '#4dffaa'} d="m348.309 612.246-14.926 3.297-3.684 36.836 14.73-.774Zm0 0" />
      <path fill={forceColor ?? '#ff1300'} d="m100.984 237.496 3.489 30.633 23.257-18.227-2.52-31.406Zm0 0" />
      <path fill={forceColor ?? '#ffbd00'} d="m281.633 394.336 47.484 1.55 12.406 5.43-46.324-.968Zm0 0" />
      <path fill={forceColor ?? '#ffae00'} d="m356.063 354.98-2.329 27.918 13.57 46.336 2.52-26.367Zm0 0" />
      <path fill={forceColor ?? '#f10800'} d="m289.191 203.762 2.52 31.988 24.617 34.703-1.941-31.406Zm0 0" />
      <path fill={forceColor ?? '#ffb900'} d="m200.418 394.918 41.477 4.07 12.601-5.234-40.125-4.457Zm0 0" />
      <path fill={forceColor ?? '#ffdb00'} d="m320.785 422.64 44.387-.968 10.273 14.543-43.226 2.324Zm0 0" />
      <path fill={forceColor ?? '#ff4a00'} d="m83.926 292.941 2.52 27.145 19.577-23.461-1.55-28.496Zm0 0" />
      <path fill={forceColor ?? '#ffc100'} d="m295.2 400.348 46.323.968 12.211 8.723-45.355-.191Zm0 0" />
      <path fill={forceColor ?? '#fc0'} d="m308.379 409.848 45.355.191 11.438 11.633-44.387.969Zm0 0" />
      <path fill={forceColor ?? '#a40000'} d="m232.012 154.133 3.683 33.148 28.88 20.551-3.102-32.57Zm0 0" />
      <path fill={forceColor ?? '#a0ff56'} d="m313.227 536.637 18.218-6.785 2.52 25.203-18.027 9.308Zm0 0" />
      <path fill={forceColor ?? '#c40000'} d="m261.473 175.262 3.101 32.57 27.137 27.918-2.52-31.988Zm0 0" />
      <path fill={forceColor ?? '#53ffa4'} d="m320.008 614.574-8.914-4.847-3.102 31.601 8.723 7.367Zm0 0" />
      <path fill={forceColor ?? '#80ff77'} d="m308.766 571.922 7.171-7.559.196 27.336-7.172 10.274Zm0 0" />
      <path fill={forceColor ?? '#50ffa7'} d="m333.383 615.543-13.375-.969-3.293 34.121 12.984 3.684Zm0 0" />
      <path fill={forceColor ?? '#d7ff1f'} d="m319.621 480.996 30.82-3.875 6.395 21.711-30.238 6.012Zm0 0" />
      <path fill={forceColor ?? '#ffc800'} d="m90.516 417.602 16.671 8.53 11.434-19.968-15.504-10.277Zm0 0" />
      <path fill={forceColor ?? '#ad0000'} d="m147.695 173.906 3.88 32.957 27.91-3.488-3.102-33.348Zm0 0" />
      <path fill={forceColor ?? '#ff9800'} d="m72.297 371.848 2.906 18.804 14.54-25.785-1.938-20.547Zm0 0" />
      <path fill={forceColor ?? '#ffb600'} d="m155.254 398.797 32.562 5.816 12.602-9.5-31.207-6.98Zm0 0" />
      <path fill={forceColor ?? '#80ff77'} d="m362.457 560.484-14.148 10.664v41.098l13.957-8.14Zm0 0" />
      <path fill={forceColor ?? '#ffae00'} d="m214.371 389.297 40.125 4.457 13.375-1.55-38.766-4.653Zm0 0" />
      <path fill={forceColor ?? '#ffb900'} d="m118.621 406.164 24.23 7.367 12.212-14.734-22.872-8.727Zm0 0" />
      <path fill={forceColor ?? '#f8f500'} d="M367.305 429.234 360.52 452.5l8.722 46.14 6.977-21.327Zm0 0" />
      <path fill={forceColor ?? '#ffb600'} d="m80.633 405.969 9.883 11.633 12.601-21.715-9.113-13.762Zm0 0" />
      <path fill={forceColor ?? '#ffa700'} d="m75.203 390.652 5.43 15.317 13.37-23.844-4.26-17.258Zm0 0" />
      <path fill={forceColor ?? '#baff3c'} d="m369.242 498.64-11.047 17.641 4.262 44.203 11.047-15.12Zm0 0" />
      <path fill={forceColor ?? '#f1fc06'} d="m310.512 458.508 31.593-1.746 8.336 20.36-30.82 3.874Zm0 0" />
      <path fill={forceColor ?? '#c1ff36'} d="m307.992 509.11 18.606-4.266 4.847 25.008-18.218 6.785Zm0 0" />
      <path fill={forceColor ?? '#80ff77'} d="m310.898 576.965-2.132-5.043.195 30.05 2.133 7.755Zm0 0" />
      <path fill={forceColor ?? '#ff7300'} d="m338.035 310.586-1.746 29.078 17.445 43.234 2.329-27.722Zm0 0" />
      <path fill={forceColor ?? '#ffa700'} d="m229.105 387.55 38.766 4.653 13.762 2.133-37.606-4.266Zm0 0" />
      <path fill={forceColor ?? '#ff5d00'} d="m86.445 320.086 1.36 24.234 18.605-22.297-.387-25.398Zm0 0" />
      <path fill={forceColor ?? '#a4ff53'} d="m305.86 541.293 7.367-4.656 2.71 27.726-7.171 7.559Zm0 0" />
      <path fill={forceColor ?? '#da0000'} d="m125.21 218.496 2.52 31.406 25.391-11.05-1.547-31.989Zm0 0" />
      <path fill={forceColor ?? '#ffe200'} d="M299.656 438.54h32.563l9.886 18.222-31.593 1.746Zm0 0" />
      <path fill={forceColor ?? '#ffa300'} d="m169.21 388.133 31.208 6.98 13.953-5.816-30.043-7.367Zm0 0" />
      <path fill={forceColor ?? '#80ff77'} d="m348.309 571.148-14.926 6.008v38.387l14.926-3.297Zm0 0" />
      <path fill={forceColor ?? '#a40000'} d="m176.383 170.027 3.101 33.153 28.88 4.46-2.325-33.152Zm0 0" />
      <path fill={forceColor ?? '#ffab00'} d="m244.027 390.07 37.606 4.266 13.566 6.012-36.246-3.684Zm0 0" />
      <path fill={forceColor ?? '#ffa700'} d="m102.922 395.695 15.7 10.47 13.57-16.095-14.344-11.824Zm0 0" />
      <path fill={forceColor ?? '#80ff77'} d="m320.008 578.902-9.11-1.937.196 32.762 8.914 4.847Zm0 0" />
      <path fill={forceColor ?? '#ff2500'} d="m104.473 268.129 1.55 28.496 22.094-17.445-.387-29.278Zm0 0" />
      <path fill={forceColor ?? '#fc0'} d="m287.059 421.09 33.726 1.55 11.434 15.9h-32.563Zm0 0" />
      <path fill={forceColor ?? '#ffae00'} d="m258.953 396.664 36.246 3.684 13.18 9.5-34.887-2.715Zm0 0" />
      <path fill={forceColor ?? '#80ff77'} d="m333.383 577.156-13.375 1.746v35.672l13.375.969Zm0 0" />
      <path fill={forceColor ?? '#ff9f00'} d="m132.191 390.07 23.063 8.727 13.957-10.664-21.711-9.692Zm0 0" />
      <path fill={forceColor ?? '#ffbd00'} d="m273.492 407.133 34.887 2.715 12.406 12.793-33.726-1.551Zm0 0" />
      <path fill={forceColor ?? '#e1ff16'} d="m300.238 482.742 19.383-1.746 6.977 23.848-18.606 4.265Zm0 0" />
      <path fill={forceColor ?? '#ff3f00'} d="m316.328 270.453-.973 30.438 20.934 38.773 1.746-29.078Zm0 0" />
      <path fill={forceColor ?? '#ff6f00'} d="m87.805 344.32 1.937 20.547 17.25-20.547-.582-22.297Zm0 0" />
      <path fill={forceColor ?? '#ffb600'} d="m353.734 382.898-6.203 25.204L360.52 452.5l6.785-23.266Zm0 0" />
      <path fill={forceColor ?? '#ff9800'} d="m184.328 381.93 30.043 7.367 14.54-1.746-28.493-7.559Zm0 0" />
      <path fill={forceColor ?? '#ff9400'} d="m94.004 382.125 8.918 13.57 14.926-17.449-7.754-15.316Zm0 0" />
      <path fill={forceColor ?? '#b7ff40'} d="M358.195 516.281 344.43 529.27l3.879 41.878 14.148-10.664Zm0 0" />
      <path fill={forceColor ?? '#a40000'} d="m206.04 174.488 2.323 33.153 28.688 12.406-1.356-32.766Zm0 0" />
      <path fill={forceColor ?? '#a7ff50'} d="m307.605 543.617-1.746-2.324 2.907 30.629 2.132 5.043Zm0 0" />
      <path fill={forceColor ?? '#c7ff30'} d="m300.043 511.242 7.95-2.133 5.234 27.528-7.368 4.656Zm0 0" />
      <path fill={forceColor ?? '#ff8200'} d="m89.742 364.867 4.262 17.258 16.09-19.195-3.102-18.61Zm0 0" />
      <path fill={forceColor ?? '#f1fc06'} d="m360.52 452.5-10.66 19.773 8.335 43.817 11.047-17.45Zm0 0" />
      <path fill={forceColor ?? '#fbf100'} d="m290.16 458.121 20.352.387 9.11 22.488-19.384 1.746Zm0 0" />
      <path fill={forceColor ?? '#ff1300'} d="m291.71 235.75-.386 31.602 24.031 33.539.973-30.438Zm0 0" />
      <path fill={forceColor ?? '#c40000'} d="m151.574 206.863 1.547 31.989 26.945-3.293-.582-32.38Zm0 0" />
      <path fill={forceColor ?? '#b60000'} d="m235.695 187.281 1.356 32.766 27.91 20.164-.387-32.379Zm0 0" />
      <path fill={forceColor ?? '#ff9400'} d="m200.418 379.992 28.492 7.559 15.117 2.52-27.136-7.368Zm0 0" />
      <path
        fill={forceColor ?? '#ff8d00'}
        d="m147.5 378.441 21.71 9.692 15.118-6.203-20.156-10.47ZM117.848 378.246l14.343 11.824 15.309-11.629-12.984-12.992Zm0 0"
      />
      <path fill={forceColor ?? '#d10000'} d="m264.574 207.832.387 32.379 26.363 27.14.387-31.601Zm0 0" />
      <path fill={forceColor ?? '#ff3800'} d="m106.023 296.625.387 25.398 20.934-16.285.773-26.558Zm0 0" />
      <path fill={forceColor ?? '#adff49'} d="m316.52 542.648-8.915.97 3.293 33.347 9.11 1.937Zm0 0" />
      <path fill={forceColor ?? '#b4ff43'} d="m344.43 529.27-14.73 8.726 3.683 39.16 14.926-6.008Zm0 0" />
      <path fill={forceColor ?? '#ffd300'} d="m278.14 436.02 21.516 2.52 10.856 19.968-20.352-.387Zm0 0" />
      <path fill={forceColor ?? '#f10800'} d="m127.73 249.902.387 29.278 24.23-10.278.774-30.05Zm0 0" />
      <path fill={forceColor ?? '#ff9400'} d="m216.89 382.703 27.137 7.367 14.926 6.594-25.586-6.785Zm0 0" />
      <path fill={forceColor ?? '#b1ff46'} d="m329.7 538.188-13.18 4.46 3.488 36.254 13.375-1.746Zm0 0" />
      <path fill={forceColor ?? '#ebff0c'} d="m291.516 482.16 8.722.582 7.754 26.367-7.949 2.133Zm0 0" />
      <path fill={forceColor ?? '#ff7e00'} d="m336.29 339.664-5.427 26.95 16.668 41.488 6.203-25.204Zm0 0" />
      <path fill={forceColor ?? '#ffb900'} d="m264.379 417.02 22.68 4.07 12.597 17.45-21.515-2.52Zm0 0" />
      <path fill={forceColor ?? '#ff9c00'} d="m233.367 389.879 25.586 6.785 14.54 10.469-24.231-5.621Zm0 0" />
      <path fill={forceColor ?? '#ceff29'} d="m301.207 510.66-1.164.582 5.816 30.051 1.746 2.324Zm0 0" />
      <path fill={forceColor ?? '#ffa700'} d="m249.262 401.512 24.23 5.62 13.567 13.958-22.68-4.07Zm0 0" />
      <path fill={forceColor ?? '#f70'} d="m110.094 362.93 7.754 15.316 16.668-12.797-6.203-16.476Zm0 0" />
      <path fill={forceColor ?? '#ff8200'} d="m164.172 371.46 20.156 10.47 16.09-1.938-18.61-10.664Zm0 0" />
      <path fill={forceColor ?? '#ff4a00'} d="m106.41 322.023.582 22.297 19.578-15.125.774-23.457Zm0 0" />
      <path fill={forceColor ?? '#b60000'} d="m179.484 203.18.582 32.379 27.715 4.261.582-32.18Zm0 0" />
      <path fill={forceColor ?? '#ebff0c'} d="m349.86 472.273-13.376 15.704 7.946 41.293 13.765-12.989Zm0 0" />
      <path fill={forceColor ?? '#ff6000'} d="m106.992 344.32 3.102 18.61 18.219-13.957-1.743-19.778Zm0 0" />
      <path fill={forceColor ?? '#f70'} d="M134.516 365.45 147.5 378.44l16.672-6.98-11.438-13.766Zm0 0" />
      <path fill={forceColor ?? '#ffc100'} d="m347.531 408.102-10.078 21.906 12.406 42.265 10.66-19.773Zm0 0" />
      <path fill={forceColor ?? '#ffe200'} d="m280.469 455.21 9.691 2.911 10.078 24.621-8.722-.582Zm0 0" />
      <path fill={forceColor ?? '#d7ff1f'} d="m309.543 506.781-8.336 3.88 6.398 32.956 8.915-.969Zm0 0" />
      <path fill={forceColor ?? '#ff4a00'} d="m315.355 300.89-4.843 28.5 20.351 37.223 5.426-26.949Zm0 0" />
      <path fill={forceColor ?? '#ff7a00'} d="m181.809 369.328 18.609 10.664 16.473 2.711-17.055-10.273Zm0 0" />
      <path fill={forceColor ?? '#ff1a00'} d="m128.117 279.18-.773 26.558 22.68-9.695 2.324-27.14Zm0 0" />
      <path fill={forceColor ?? '#da0000'} d="m153.121 238.852-.773 30.05 25.586-3.297 2.132-30.046Zm0 0" />
      <path fill={forceColor ?? '#f4f802'} d="m291.902 478.863-.386 3.297 8.527 29.082 1.164-.582Zm0 0" />
      <path fill={forceColor ?? '#e4ff13'} d="m336.484 487.977-14.343 11.437 7.367 38.774 14.922-8.918Zm0 0" />
      <path fill={forceColor ?? '#b00'} d="m208.363 207.64-.582 32.18 27.524 11.828 1.746-31.601Zm0 0" />
      <path fill={forceColor ?? '#ffc100'} d="m267.094 430.98 11.047 5.04 12.02 22.101-9.692-2.91Zm0 0" />
      <path fill={forceColor ?? '#deff19'} d="m322.14 499.414-12.597 7.367 6.977 35.867 12.988-4.46Zm0 0" />
      <path fill={forceColor ?? '#ff6000'} d="m128.313 348.973 6.203 16.476 18.218-7.754-4.652-17.058Zm0 0" />
      <path fill={forceColor ?? '#ff7e00'} d="m199.836 372.43 17.055 10.273 16.476 7.176-15.504-9.695Zm0 0" />
      <path fill={forceColor ?? '#ff6c00'} d="m152.734 357.695 11.438 13.766 17.637-2.133-9.883-13.765Zm0 0" />
      <path fill={forceColor ?? '#ff1e00'} d="m291.324 267.352-3.879 29.855 23.067 32.184 4.843-28.5Zm0 0" />
      <path fill={forceColor ?? '#ffa700'} d="m251.977 409.848 12.402 7.172 13.762 19-11.047-5.04Zm0 0" />
      <path fill={forceColor ?? '#c80000'} d="m237.05 220.047-1.745 31.601 26.945 19.387 2.71-30.824Zm0 0" />
      <path fill={forceColor ?? '#ff8600'} d="m217.863 380.184 15.504 9.695 15.895 11.633-13.762-8.727Zm0 0" />
      <path fill={forceColor ?? '#ff3000'} d="m127.344 305.738-.774 23.457 21.32-9.11 2.133-24.042Zm0 0" />
      <path fill={forceColor ?? '#ff8900'} d="m330.863 366.613-9.304 24.04 15.894 39.355 10.078-21.906Zm0 0" />
      <path fill={forceColor ?? '#ff9400'} d="m235.5 392.785 13.762 8.727 15.117 15.508-12.402-7.172Zm0 0" />
      <path fill={forceColor ?? '#e40000'} d="m264.96 240.21-2.71 30.825 25.195 26.172 3.88-29.855Zm0 0" />
      <path fill={forceColor ?? '#ffc800'} d="m337.453 430.008-12.793 18.031 11.824 39.938 13.375-15.704Zm0 0" />
      <path fill={forceColor ?? '#ff4a00'} d="m126.57 329.195 1.743 19.778 19.769-8.336-.191-20.551Zm0 0" />
      <path fill={forceColor ?? '#ffd300'} d="m279.887 449.395.582 5.816 11.047 26.95.386-3.298Zm0 0" />
      <path fill={forceColor ?? '#feed00'} d="m299.27 472.469-7.368 6.394 9.305 31.797 8.336-3.879Zm0 0" />
      <path fill={forceColor ?? '#cd0000'} d="m180.066 235.559-2.132 30.046 26.359 4.266 3.488-30.05Zm0 0" />
      <path fill={forceColor ?? '#ff6400'} d="m171.926 355.563 9.883 13.765 18.027 3.102-8.14-13.766Zm0 0" />
      <path fill={forceColor ?? '#f10800'} d="m152.348 268.902-2.325 27.141 24.227-2.906 3.684-27.532Zm0 0" />
      <path fill={forceColor ?? '#ffd300'} d="m324.66 448.04-13.375 14.151 10.856 37.223 14.343-11.437Zm0 0" />
      <path fill={forceColor ?? '#ff5200'} d="m148.082 340.637 4.652 17.058 19.192-2.132-2.91-17.45Zm0 0" />
      <path fill={forceColor ?? '#ffe200'} d="M311.285 462.191 299.27 472.47l10.273 34.508 12.598-7.563Zm0 0" />
      <path fill={forceColor ?? '#ffb200'} d="m265.348 422.836 1.746 8.144 13.375 24.23-.582-5.815Zm0 0" />
      <path fill={forceColor ?? '#ff5900'} d="m310.512 329.39-8.336 25.59 19.383 35.672 9.304-24.039Zm0 0" />
      <path fill={forceColor ?? '#ff6400'} d="m191.695 358.664 8.14 13.766 18.028 7.754-6.398-12.793Zm0 0" />
      <path fill={forceColor ?? '#f20'} d="m150.023 296.043-2.132 24.043 22.675-2.715 3.684-24.234Zm0 0" />
      <path fill={forceColor ?? '#ffc400'} d="m286.281 440.285-6.394 9.11 12.015 29.468 7.368-6.394Zm0 0" />
      <path fill={forceColor ?? '#ff3800'} d="m147.89 320.086.192 20.55 20.934-2.523 1.55-20.742Zm0 0" />
      <path fill={forceColor ?? '#ff9400'} d="m321.559 390.652-12.016 20.36 15.117 37.027 12.793-18.031Zm0 0" />
      <path fill={forceColor ?? '#d10000'} d="m207.781 239.82-3.488 30.051 26.363 11.246 4.649-29.469Zm0 0" />
      <path fill={forceColor ?? '#ff9400'} d="m248.875 399.766 3.102 10.082 15.117 21.132-1.746-8.144Zm0 0" />
      <path fill={forceColor ?? '#ff6c00'} d="m211.465 367.39 6.398 12.794 17.637 12.601-4.844-11.633Zm0 0" />
      <path fill={forceColor ?? '#ff7e00'} d="m230.656 381.152 4.844 11.633 16.477 17.063-3.102-10.082Zm0 0" />
      <path fill={forceColor ?? '#ff3000'} d="m287.445 297.207-7.172 27.145 21.903 30.628 8.336-25.59Zm0 0" />
      <path fill={forceColor ?? '#ff4a00'} d="m169.016 338.113 2.91 17.45 19.77 3.101-1.165-17.059Zm0 0" />
      <path fill={forceColor ?? '#e80000'} d="m177.934 265.605-3.684 27.532 24.809 3.879 5.234-27.145Zm0 0" />
      <path fill={forceColor ?? '#df0000'} d="m235.305 251.648-4.649 29.66 25.582 18.227 6.012-28.5Zm0 0" />
      <path fill={forceColor ?? '#ffb200'} d="m297.137 427.488-10.856 12.797 13.184 32.184 11.82-10.278Zm0 0" />
      <path fill={forceColor ?? '#fa0f00'} d="m262.25 271.035-6.012 28.5 24.035 24.817 7.172-27.336Zm0 0" />
      <path fill={forceColor ?? '#ffa300'} d="m309.734 411.012-12.597 16.476 14.148 34.703 13.57-14.152Zm0 0" />
      <path fill={forceColor ?? '#ff9f00'} d="m270.39 411.203-5.042 11.633 14.539 26.559 6.394-9.11Zm0 0" />
      <path fill={forceColor ?? '#ff6800'} d="m302.176 354.98-10.66 22.489 18.027 33.543 12.016-20.36Zm0 0" />
      <path fill={forceColor ?? '#ff3000'} d="m170.566 317.371-1.55 20.742 21.515 3.492 3.297-20.55Zm0 0" />
      <path fill={forceColor ?? '#ff4a00'} d="m190.531 341.605 1.164 17.06 19.77 8.726.582-16.286Zm0 0" />
      <path fill={forceColor ?? '#ff1a00'} d="m174.25 293.137-3.684 24.234 23.262 3.684 5.23-24.04Zm0 0" />
      <path fill={forceColor ?? '#ff7e00'} d="m252.559 386.387-3.684 13.379 16.473 23.07 5.234-11.633Zm0 0" />
      <path fill={forceColor ?? '#ed0400'} d="m204.293 269.871-5.234 27.145 24.812 10.855 6.785-26.754Zm0 0" />
      <path fill={forceColor ?? '#f50'} d="m212.047 351.105-.582 16.286 19.191 13.761 2.13-15.12Zm0 0" />
      <path fill={forceColor ?? '#ff8d00'} d="m280.082 396.277-9.691 14.926 15.89 29.082 10.856-12.797Zm0 0" />
      <path fill={forceColor ?? '#ff6800'} d="m232.785 366.031-2.129 15.121 18.219 18.614 3.684-13.38Zm0 0" />
      <path fill={forceColor ?? '#ff7a00'} d="m291.516 377.469-11.434 18.808 17.055 31.211 12.597-16.476Zm0 0" />
      <path fill={forceColor ?? '#ff4300'} d="m280.273 324.352-9.496 24.23 20.739 28.887 10.66-22.489Zm0 0" />
      <path fill={forceColor ?? '#ff3400'} d="m193.828 321.055-3.297 20.55 21.516 9.5 4.844-19.968Zm0 0" />
      <path fill={forceColor ?? '#fa0f00'} d="m230.656 281.117-6.785 26.754 24.227 17.254 8.14-25.59Zm0 0" />
      <path fill={forceColor ?? '#ff1a00'} d="m199.059 297.016-5.23 24.039 23.062 10.082 6.98-23.266Zm0 0" />
      <path fill={forceColor ?? '#f20'} d="m256.238 299.535-8.14 25.59 22.68 23.457 9.495-24.23Zm0 0" />
      <path fill={forceColor ?? '#ff6800'} d="m260.7 369.328-8.141 17.059 17.832 24.816 9.691-14.926Zm0 0" />
      <path fill={forceColor ?? '#f50'} d="M270.777 348.582 260.7 369.328l19.383 26.95 11.434-18.81Zm0 0" />
      <path fill={forceColor ?? '#ff3b00'} d="m216.89 331.137-4.843 19.968 20.738 14.926 6.59-18.61Zm0 0" />
      <path fill={forceColor ?? '#ff4e00'} d="m239.375 347.422-6.59 18.61 19.774 20.355 8.14-17.059Zm0 0" />
      <path fill={forceColor ?? '#ff2500'} d="m223.871 307.871-6.98 23.266 22.484 16.285 8.723-22.297Zm0 0" />
      <path fill={forceColor ?? '#ff3800'} d="m247.906 325.125-8.531 22.297 21.324 21.906 10.078-20.746Zm0 0" />
    </>
  );
}

function DfxAssetIconAXS({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 1000 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M500 0c276.1 0 500 223.9 500 500s-223.9 500-500 500S0 776.1 0 500 223.9 0 500 0z"
        style={{
          fillRule: 'evenodd',
          clipRule: 'evenodd',
          fill: forceColor ?? '#0055d5',
        }}
      />
      <path
        d="M272 330.8s-53.8-43-57.5 63.2c-3.7 82.3-3.6 242.1 34.5 317.6 16.1 28.4 37.6 19.7 77.6-8.6 34.8-25.7 160.7-141.7 214-192.6S702 313.5 724.5 412.7c8.9 41.7 19.9 77.1 11.5 169.6-2.6 28.5-14.8 50.1-70.4 11.5-42-27-81.9-56-81.9-56s-7.7-13.8-25.9 8.6c-14.3 17.9-21.5 22.3 1.4 35.9 23 13.6 139.3 93.8 183.9 106.3 36.8 10.7 57.8 10.5 58.9-61.8-.2-57.4-3.5-221.7-24.4-291.7-15.8-43.6-39-63.4-89.1-14.4S480.4 522.9 394 592.3c-57.3 43-81.8 81.8-103.4 10.1-15.2-54.3-34.9-223.3 27.3-191.1 38.9 18.6 58.3 18.5 43.1 30.2-15.2 11.6-58.9 51.7-58.9 51.7s-13.5 10.9-7.2 34.5c6.3 16.5 6.3 24.7 40.2-7.2s58.9-56 58.9-56 5.4-8.5 21.5 7.2 18.7 20.1 18.7 20.1 4.3 11.7 21.5-8.6c17.3-20.3 28.4-32.7-4.3-51.7C418.8 412.3 272 330.8 272 330.8z"
        style={{
          fillRule: 'evenodd',
          clipRule: 'evenodd',
          fill: '#fff',
        }}
      />
    </svg>
  );
}

function DfxAssetIconGRT({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx={48} cy={48} r={48} fill={forceColor ?? '#6747ed'} />
      <path
        d="M135.3 106.2c-7.1 0-12.8-5.7-12.8-12.8 0-7.1 5.7-12.8 12.8-12.8 7.1 0 12.8 5.7 12.8 12.8 0 7.1-5.7 12.8-12.8 12.8m0-32c10.6 0 19.2 8.6 19.2 19.2s-8.6 19.2-19.2 19.2-19.2-8.6-19.2-19.2 8.6-19.2 19.2-19.2zm18.3 39.4c1.3 1.3 1.3 3.3 0 4.5l-12.8 12.8c-1.3 1.3-3.3 1.3-4.5 0-1.3-1.3-1.3-3.3 0-4.5l12.8-12.8c1.2-1.3 3.3-1.3 4.5 0zm7.4-36.2c0 1.8-1.4 3.2-3.2 3.2-1.8 0-3.2-1.4-3.2-3.2s1.4-3.2 3.2-3.2c1.7 0 3.2 1.4 3.2 3.2z"
        style={{
          fillRule: 'evenodd',
          clipRule: 'evenodd',
          fill: '#fff',
        }}
        transform="translate(-88 -52)"
      />
    </svg>
  );
}

function DfxAssetIconAAVE({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 800 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <path id="aave_a" d="M0 0h800v800H0z" />
      </defs>
      <clipPath id="aave_b">
        <use xlinkHref="#aave_a" style={{ overflow: 'visible' }} />
      </clipPath>
      <g style={{ clipPath: 'url(#aave_b)' }}>
        <linearGradient
          id="aave_c"
          x1={-597.355}
          x2={-598.099}
          y1={900.686}
          y2={900.06}
          gradientTransform="matrix(776 0 0 -776 464237 699089)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} style={{ stopColor: '#b6509e' }} />
          <stop offset={1} style={{ stopColor: '#2ebac6' }} />
        </linearGradient>
        <circle cx={400} cy={400} r={388} fill={forceColor ?? 'url(#aave_c)'} />
        <path
          d="M569.8 554.6 438.6 237.4c-7.4-16.4-18.4-24.4-32.9-24.4h-11.6c-14.5 0-25.5 8-32.9 24.4l-57.1 138.2h-43.2c-12.9.1-23.4 10.5-23.5 23.5v.3c.1 12.9 10.6 23.4 23.5 23.5h23.2l-54.5 131.7c-1 2.9-1.6 5.9-1.6 9 0 7.4 2.3 13.2 6.4 17.7s10 6.7 17.4 6.7c4.9-.1 9.6-1.6 13.5-4.5 4.2-2.9 7.1-7.1 9.4-11.9l60-148.8h41.6c12.9-.1 23.4-10.5 23.5-23.5v-.6c-.1-12.9-10.6-23.4-23.5-23.5h-22.2l45.8-114.1 124.8 310.4c2.3 4.8 5.2 9 9.4 11.9 3.9 2.9 8.7 4.4 13.5 4.5 7.4 0 13.2-2.2 17.4-6.7 4.2-4.5 6.4-10.3 6.4-17.7.1-3-.4-6.1-1.6-8.9z"
          fill="#fff"
        />
      </g>
    </svg>
  );
}

function DfxAssetIconMANA({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="mana_a" x1="85.355%" x2="14.645%" y1="14.645%" y2="85.355%">
          <stop offset="0%" stopColor="#FF2D55" />
          <stop offset="100%" stopColor="#FFBC5B" />
        </linearGradient>
        <linearGradient id="mana_b" x1="49.966%" x2="49.966%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#A524B3" />
          <stop offset="100%" stopColor="#FF2D55" />
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <circle cx={200} cy={200} r={200} fill={forceColor ?? 'url(#mana_a)'} />
        <path fill={forceColor != null ? '#fff' : 'url(#mana_b)'} d="M125.7 0v150h125z" transform="translate(16 130)" />
        <path fill="#FFF" d="M16.7 280h125V130z" />
        <path fill={forceColor ?? '#FC9965'} d="M40 320c11.4 15.1 24.9 28.6 40 40h240c15.1-11.4 28.6-24.9 40-40H40z" />
        <path fill={forceColor ?? '#FF2D55'} d="M80 360c33.4 25.1 75 40 120 40s86.6-14.9 120-40H80z" />
        <path fill={forceColor != null ? '#fff' : 'url(#mana_b)'} d="M252.3 0v110H344z" transform="translate(16 210)" />
        <path fill={forceColor ?? '#FFBC5B'} d="M268.3 280H16.7c6.2 14.3 14.1 27.7 23.3 40h228.4v-40h-.1z" />
        <path fill="#FFF" d="M176.7 320h91.6V210z" />
        <circle cx={268.3} cy={130} r={50} fill={forceColor != null ? '#fff' : '#FFC95B'} />
        <circle cx={141.7} cy={75} r={25} fill={forceColor != null ? '#fff' : '#FFC95B'} />
      </g>
    </svg>
  );
}

function DfxAssetIconSAND({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <linearGradient
        id="sand_a"
        x1={25.214}
        x2={25.837}
        y1={1024.822}
        y2={1024.119}
        gradientTransform="matrix(50 0 0 -50 -1250 51250)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0} style={{ stopColor: '#00adef' }} />
        <stop offset={1} style={{ stopColor: '#0084ff' }} />
      </linearGradient>
      <circle cx={25} cy={25} r={25} fill={forceColor ?? 'url(#sand_a)'} />
      <path
        d="m16.6 11.8-2.7 2.7v10.7l2.7 2.7h10.7v5.4H22v-2.7h-8.1V36l2.7 2.7h16.1l2.7-2.7V25.2l-2.7-2.7H22v-5.4h5.4v2.7h8.1v-5.4l-2.7-2.7H16.6z"
        fill={'#fff'}
      />
    </svg>
  );
}

function DfxAssetIconAPE({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 185.6 185.6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <radialGradient
          id="ape_a"
          cx={-109.707}
          cy={-1.113}
          r={1}
          gradientTransform="rotate(90 -5780.492 5757.271) scale(104.235)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.167} style={{ stopColor: '#073183' }} />
          <stop offset={1} style={{ stopColor: '#0054f9' }} />
        </radialGradient>
        <path
          d="M185.6 92.8C185.6 41.5 144 0 92.8 0 41.5 0 0 41.5 0 92.8c0 51.2 41.5 92.8 92.8 92.8 51.2 0 92.8-41.6 92.8-92.8z"
          fill={forceColor ?? 'url(#ape_a)'}
        />
      </g>
      <g id="Layer_1_00000019678216197568292700000009484231850298271916_">
        <path
          d="M155.9 63.8c-.4 2.3-.8 3.4-1.4 4.6-.6 1.4-1.2 2.9-1.8 6.1-.2 1.2-.4 2.2-.5 3v.1c-.2 1.3-.3 2.2-.8 3.7-.4 1.3-1.1 3.4-2.8 5.6-1.4 1.8-3.7 4.9-6.8 5.3-.3 0-.8 0-1.1-.1-8.8-4.5-16.3-7.8-18.9-8.5-3-.9-2.6-7.5-2.3-13.3.2-2.6.3-5.1.2-7.2-.4-7.4-1.7-15.4-8.1-19.3-3.8-2.3-8.8-3-13.5-3 .9-.4 1.8-1 2.9-1.6 2.8-1.6 6.2-3.6 9.7-4 1.1-.1 2.2-.2 3.3-.4 6.9-.8 12.9-1.5 19.2.7 2.9 1 8.7 4.2 10.2 7.3 1.1 2.1 2.9 3.8 6.4 7.1 1.9 1.7 3.1 2.7 4 3.5 1.3 1 1.5 1.3 1.9 2 1.2 2.4.8 4.9.2 8.4zM124 94.1c.4.1.6.6.3 1-.9 1.4-2 3.4-3.3 5.7-.6 1.1-1.2 2.2-1.7 3-1.7 2.9-1.8 5.4-1.9 7.3-.1 2.1-.2 3-1.5 3.8-1 .7-2.1.9-9.3 2-1.3.2-1.8.4-2.3.7-.1.1-.3.1-.4.2-.4.2-.8-.2-.8-.6.1-1 .1-2.3.1-4v-.3c0-1.4 0-2.6-.1-3.5-.1-1.8-.1-2.6.4-3.4.6-1 1.1-1.3 1.8-1.8 1.1-.7 2.6-1.6 4.7-4.6 1.2-1.6 1.4-2.5 1.6-3.2.1-.3.1-.4 1-1.1s3.8-2.9 7.5-2.3c1.2.2 2.5.6 3.9 1.1zM95.3 127.3c-.2.2-.3.3-.6.3-.8 0-1.3-.2-1.6-.6-.7-.9-.6-2.7-.5-3.8l3.1-.8c.2 1.7.3 4-.4 4.9zM95.5 116.3c-.1.4-.1.9-.1 1.5v2.3c-1 .3-1.8.3-2.8.3v-2.6c0-.6 0-1.5.1-1.8.3 0 .6-.1.9-.2.6-.1 1.5-.3 2-.2 0 .2 0 .5-.1.7zM89.9 126.4c-.1 1.6-.6 3.5-2.1 3.8-.7.1-1-.1-1.2-.3-1-.9-1.1-3.7-1-5.7.7 0 1.5-.1 2.5-.3.6-.1 1.2-.3 1.7-.4.1.8.2 1.8.1 2.9zM89.2 120.8l-3.3 1.2c.2-1.3.4-3.1.5-4.3.1-.8.3-1.1.4-1.2 0 0 .1-.1.2-.1h.2l2.1-.1c-.1 1-.1 3.2-.1 4.5zM83.8 119.8c-.2.5-.4 1.9-.5 2.9l-4.1-.1c.2-1.3.6-2.6.9-3.6.4-1 .7-1.8 1.1-2s1.3-.3 1.9.2c.9.6 1.1 1.5.7 2.6zM82.3 132.5c-.3.4-.7.7-1.1.7-.5.1-.8-.1-1.1-.3-1.3-1.2-1.2-5.1-1.1-7 1.7-.4 3.6-.7 4.5-.8 0 1.5.1 5.6-1.2 7.4zM76.9 122.4c-.2.5-.4 1-.5 1.5-.5.2-2 0-3.5-.3l1-6.5c1.7-.5 3.7-.6 4.1-.1.7.7-.6 4-1.1 5.4zM75 133.4c-.8 1-2 1.5-3.7 1.4-1.2 0-1.6-.5-1.8-.8-.9-1.5 0-5 .9-7.2l5.6.3c.1.4.1.9.1 1.4.1 1.7-.1 3.7-1.1 4.9z"
          fill="#fff"
        />
        <path
          d="M121.4 86.1c-5.1-1.4-4.6-8.8-4.2-16 .1-2.5.3-4.9.2-6.9-.4-6.7-1.5-14-6.9-17.3-5.8-3.5-15.3-2.7-21.1-2-2.1.6-4.1 1.1-5.7 1-3.4-.2-6.1-1.6-8.5-2.9-1.8-1-3.4-1.9-5-1.9H70c-4.5.3-6.6 1.4-8.5 3.1-.5.4-1.1 1.6-3 7.1-1 2.8-1.1 4.3-1.3 5.7-.2 1.3-.3 2.7-1 4.8-.5 1.4-.9 2.6-1.2 3.8-.9 3.1-1.7 5.6-3.9 8.6-.3.3-.6.9-1 1.4-.5.8-1.1 1.8-2 2.9-.6.8-1.9 3.8-1.8 4.7.1 1.5.6 2.4 1.1 3.4s1.2 2.2 1.3 3.9v.3c.2 2.6-.2 3.9-5.1 8.3-3.1 2.8-5.4 5.5-6.9 7.5-.1.2 0 .4.3.4h1c1.2.1 2.4.6 3.2 1.5.1.2.4.2.6.1.8-.3 1.7-.3 2.5-.2 1 .1 2.1.4 2.8 1.1.2.2.5.3.8.2.8-.2 1.7-.2 2.5.1.6.2 1.2.6 1.6 1.1.3.3.8.4 1.2.2.2-.1.5-.3.8-.4 1.1-.4 2.3-.2 3.3.2.5.2 1 .3 1.5.7.8.6 1.4 1.4 1.7 2.3.2.5.9.7 1.3.3.8-.6 1.4-.7 2-.5.3.1.5.3.7.6.3.4.8.8 1.2.6 1.7-.5 3.7-.2 5.2.6.5.3 1.1.7 1.4 1.3v-.3c0-.1.1-.2.2-.3l.3-.1c.8-.3 5-1.5 6.6.2.1.1.2.1.3 0 .2-.2.4-.4.5-.4 1.1-.6 2.9-.7 4.1.4.2.2.6.1.8-.1.1-.2.2-.3.4-.4.4-.4 1-.5 1.6-.5l2.3-.1c.6 0 2.4-.2 2.9-.3h.1c.2 0 .5-.1.8-.2 1.1-.2 2.4-.5 3.4 0s.9 1.6.8 2.6c0 .4-.1.8-.1 1.2v.6c0 .9 0 1.7-.1 2.3l.1.5v.1c.1.4.6.7.9.4.8-.5 1.6-1.1 1.9-1.5v-.1c0-.1.1-.3.2-.7.1-.9.3-2.6.3-6.1v-.4c0-1.3 0-2.4-.1-3.3-.1-1.9-.2-3.4.8-4.9.9-1.5 1.8-2 2.7-2.6 1-.6 2.1-1.3 4-3.9.9-1.3 1-1.8 1.1-2.2.2-1 .5-1.6 2-2.6 1.2-.9 4.7-3.6 9.5-2.8 1.6.3 4.1 1.1 6.7 2.1.1 0 .2.1.3.1h.1c2.3.9 4.4 1.9 5.9 2.7.3.2.7.1 1-.2.5-.6 1-.9 1.5-1.3.2-.1.4-.2.5-.3.1 0 .1-.1.1-.1.4-.3.4-1.1-.1-1.3-6.7-3.3-13.1-5.3-15.2-5.9zm-48.2 1.5C71.6 94.4 61 102 56.2 102H55.9c-.1 0-.2 0-.3-.1h-.2c-.9-.3-2.1-.9-3-1.8-.6-.6-1.1-1.4-1.3-2.1 0-.1-.1-.3-.1-.4-.3-1.2-.6-2.6.4-5 .1-.3.3-.6.4-.9 0-.1.1-.2.1-.3.1-.3.2-.5.3-.7.1-.4.3-.7.4-.9 0-.1.1-.2.1-.3.3-.8.3-1.1.4-1.4 0-.2.1-.6.2-1 .3-1.3.5-2.4.6-3.3.2-1.7.5-3.2 1.4-4.6.2-.2.3-.4.5-.6l.2-.2.2-.2c.2-.2.5-.3.7-.4.1 0 .2-.1.3-.1.2-.1.4-.1.6-.2.9-.2 1.9-.2 3.1-.1 1.3.1 2.5.3 3.5.6.9.2 1.7.5 2.3.8.1 0 .1.1.2.1.1.1.2.1.4.2s.3.1.5.2l.6.3.2.1c.7.3 1.4.7 1.9 1.1.3.2.5.4.7.6.1.1.2.1.2.2l.2.2c2.1 1.8 2 4.3 1.6 5.8zm5-25.9-.2 1.2c-.5 2.8-1.6 6.6-5.6 7.6-3.9.9-4.8 1.1-7.5 1.3h-.2c-2 0-5.9-1.3-6.6-4.4-.4-2 .5-3.5 1.9-5.9.2-.4.5-.8.8-1.3 2-3.3 2.7-5.7 3.3-7.6.6-1.9 1.1-3.4 2.4-4.7.3-.3.6-.6 1-.8.2-.2.5-.3.8-.5.4-.2.8-.3 1.2-.5.9-.3 1.9-.4 2.8-.4 1.9 0 3.8.5 5.1 1.6.6.5 1.5 1.4 2 4.3.2 1.5-.2 4.2-1.2 10.1zm28.7 8c-1.4 2.4-2.1 3.7-3.3 4.7-2.4 2-5.1 2.4-7.4 2.4-1.6 0-3-.3-3.9-.4-2.4-.4-6.7-1.2-8.2-4.7-.3-.7-.3-1.1-.3-1.7 0-.5 0-1.5-.3-3.6v-.1c-.1-1-.2-2.1 0-3.5v-.2c.8-4.2 1.1-4.8 1.2-5.2.4-.8 1.4-1.2 2.3-.7.8.4 1.1 1.4.8 2.2-.1.2-.3 1.1-1 4.4v.2c-.2.9-.1 1.6 0 2.5v.1c.3 2.4.3 3.4.3 4v.4c.3.7.9 1.1 1.6 1.5.5.2 1-.2.9-.7-.7-3.7-.7-8 .7-10.7.5-.9 1.3-2.3 2.1-3.7.1-.1.2-.3.2-.4.1-.1.1-.2.2-.3.4-.6.7-1.1 1-1.6 0-.1.1-.1.1-.2l.1-.1c.1-.1.1-.2.2-.3 0 0 0-.1.1-.1l.1-.1c0-.1.1-.1.1-.2.3-.4.6-.8.8-1.2.4-.5-.1-1.1-.6-.9-1.4.6-2.3 1.3-2.5 1.4-.7.6-1.8.5-2.4-.3-.6-.7-.5-1.8.3-2.4.9-.7 5.5-4 11-2.5 4 1.1 6 4.2 6.8 5.3.6.9 2.6 3.7 2.5 7.7 0 2.9-1.2 5.1-3.5 9z"
          fill="#fff"
        />
        <path
          d="M71.1 49.2c-.3.7-.6 1.5-1 2.4-.8 2.1-1.8 4.5-2.3 5.4-.8 1.5-1.4 2.5-1.9 3.2-.6.9-1 1.6-1.4 2.6-.6 1.7-.7 3.6-.3 5.7-1.1-.1-2.8-.8-3-1.8-.1-.7.3-1.4 1.5-3.5.2-.4.5-.9.8-1.3 2.1-3.6 3-6.3 3.6-8.3.7-2.1 1-3 2.1-3.8.7-.3 1.3-.5 1.9-.6zM69 124.8c-1.2 2.4-2.6 4.6-3.5 5.7-.8-2-2.1-6.7-1.7-10.4v-.3c.1-1.2.4-2.2 1-3.1.4-.6 1.4-.9 2.5-.9.8 0 1.7.2 2.5.6.4.2 1 .7 1 2 .2 1.8-.7 4.2-1.8 6.4z"
          fill="#fff"
        />
        <path
          d="M133 98.1c.1.1.1.2.1.3-.3.7-.8 1.2-1.3 1.8-.6.7-1.3 1.5-1.9 2.8-.9 1.8-1.2 3.4-1.3 7.6-.2 4.9 0 7.6.2 9.6.1 1.9.2 3.1-.1 5-.7 3.8-2.3 6.3-4.4 9.5-2.6 4-5.2 8.1-9.6 9.4-.4.1-.4.1-1.6.1-1 0-2.7 0-5.8.1-5.8.2-8.7.3-11.1.8-2.6.5-3.9 1.1-5.3 1.6-1.2.5-2.3.9-4.4 1.4-1.3.3-3.2.5-9.7.6-6.8 0-10.9 0-16.2-.6-7.4-.8-11.1-1.3-13.6-2.6-5.8-3.1-8.3-8.7-12.3-17.9 0-.1.1-.2.2-.2l.6.3c.2.1.4.1.5.1.4.1.8.1 1.2 0 .1 0 .1 0 .2-.1.1 0 .2 0 .2.1.3.7.7 1.3 1.4 1.7s1.5.4 2.2.4c.8 0 1.6-.1 2.4-.2.4 0 .8.2 1 .5.7 1.8 1.6 3 3 3.2h.3c.3 0 .8-.1 1.4-.5.5-.4 1.3-.1 1.7.4.3.5.7.8 1.1 1.1 1.4 1.4 4.8 2.1 7.6 2.1 1.5 0 2.9-.2 3.7-.6 1.2-.6 1.2-1.4 1.1-1.8-.1-.6-.2-1.3-.3-1.9 0-.1.1-.1.1 0 .2.4.4.8.9.9h.2c.8 0 2 .3 2.2 1 .1.4.3.7.5 1.1.5.7 1.4 1.6 3.3 1.7h.1c2.2 0 3.9-.7 5-2.1.1-.1.1-.2.2-.3.4-.6 1.6-.6 2.1-.1.6.5 1.3.8 2.1.8h.4c1-.1 1.8-.6 2.5-1.5.4-.6.7-1.3.9-2.1.1-.2.4-.3.6-.1.4.4 1.1.8 2.1.8.2 0 .5 0 .8-.1 1.9-.4 2.9-2 3.3-3.7 0-.1.1-.1.1 0 .5.6 1.4 1.3 2.9 1.3h.2c.8 0 1.5-.4 2-1 .6-.8.8-2 .9-3.1 0-.3.2-.6.6-.8 1.6-.7 3.6-2.2 4.2-3.2 0 0 0-.1.1-.1.1-.3.4-.5.6-.5 1.3-.2 1.8-.5 2.3-.7.4-.2.7-.3 1.7-.5 7.3-1.1 8.7-1.4 10.3-2.4 2.4-1.6 2.5-3.8 2.6-5.9.1-1.8.2-3.8 1.6-6.2.5-.9 1.1-1.9 1.7-3.1 1.1-2 2.6-4.8 3.7-6.3.2-.3.6-.4.9-.2 2.5.9 4.7 1.9 5.1 2.3z"
          fill="#fff"
        />
        <path
          d="M62 119.9c-.3 2.5-.5 5.9-.1 10.3.1 1.2.3 2.5.5 3.8-.3.2-1.4.5-3.2.4-2.6-.1-5.2-.7-6-1.6l-.1-.1c-.6-.5-1.1-.9-1.1-1.8 0-.3.1-.6.4-1.1.2-.2.4-.5.6-.9.4-.6 1-1.3 1.6-2.3 1.7-2.8 2.3-3.7 3.1-4.8.1-.1.1-.2.2-.3.5-.6 1-1.4 1.9-2.7.6-.9 1.1-1.7 1.6-2.3.7-1 1.2-1.5 1.5-1.8 0 .4-.1 1-.2 1.6-.4 1.2-.6 2.3-.7 3.6zM60.7 80.5c0 .1 0 .1 0 0-.4.5-.8 1.1-1.3 2.1-1.3 2.8-1.3 4.4-1.3 5.7 0 .7 0 1.2-.2 1.8-.1.4-.3.9-.6 1.4-.7 1.7-1.7 3.9-1.3 6.9-.6-.3-1.5-1-1.7-1.3 0-.2-.1-.3-.1-.5-.2-.9-.3-1.5.2-2.9 1.6-3.6 1.8-4.5 1.9-5.5 0-.2.1-.4.1-.7.3-1.4.5-2.6.6-3.6.2-1.5.4-2.5.9-3.2.2-.3.7-.4 1.4-.4.3 0 .6 0 1 .1h.1l.3.1zM58.7 116.2c-.1-.9-.2-1.7-.6-2.6 0 0-.1-.2-.1-.3-.1-.1-.1-.2-.2-.3l-.1-.1c-.1-.1-.1-.1-.2-.1l-.1-.1c-.1 0-.1-.1-.2-.1h-.1c-.5-.2-1-.4-1.6-.5H55c-.1 0-.2.1-.4.1-.1 0-.1.1-.2.1l-.1.1-.2.2-.1.1v.1l-.6.9c-.5.7-1 1.5-1.5 2.2s-.9 1.3-1.4 2c-.3.4-.5.7-.8 1.1 0 .1-.1.1-.1.2.3.1.6.1.9.2.7.1 1.4.2 2 .3 1.4.2 2.9.3 4.3.2h.2c.3-.5.8-1.1 1.3-1.9.3-.4.6-.8.8-1.2-.3-.1-.4-.4-.4-.6zM53.6 122.1c-.1 1.1-1.3 3.9-3.2 6.6-1.6 2.2-2.6 2.8-2.8 2.8-.8-.1-1.5-2-2.1-3.9-.2-.8-.5-1.5-.6-2.2-.4-1.4-.5-3.4-.4-4.6 1.6.9 4.4 1.1 8.4 1.1.2.1.5.1.7.2zM50.8 113.1c-.7 1.1-1.4 2.1-2.1 3.1-.4.5-.7 1-1.1 1.5-.2.3-.5.6-.7.9-.6-.1-1.1-.3-1.7-.4-.5-.1-.9-.3-1.4-.5-.1 0-.2-.1-.3-.1-.1-.1-.2-.3-.3-.4.2-.3.3-.7.5-1 .3-.6.6-1.2 1-1.8.6-1 1.3-2.1 2.4-2.8.1 0 .1-.1.2-.1.4-.2.8-.4 1.3-.5H49.4c.1 0 .2.1.4.1 0 0 .1 0 .1.1.1.1.2.1.3.2-.2-.1.2.3.2.2.2.6.3.9.4 1.5zM45.4 110.2c-1.3 1-2.2 2.4-2.9 3.9l-1.2 2.4c0 .1-.1.2-.1.2-.4-.1-.8-.2-1.1-.3-.4-.1-.8-.3-1.2-.4-.2-.1-.3-.2-.5-.3.4-.7.8-1.4 1.3-2.1.6-.9 1.3-1.9 2-2.7.3-.3.6-.7.9-.9.4-.2.8-.2 1.3-.1.5 0 1 0 1.4.2-.1 0 0 .1.1.1zM43.4 127.2l-.2.2h-.1c-.3 0-.6.1-.9.1-.6 0-1.2.1-1.8 0-.3 0-.6-.1-.8-.3-.2-.3-.3-.9-.4-1.3-.4-2.2-.4-4.4-.2-6.6 1.1.4 2.3.7 3.5.9-.3 2 .2 4.9.4 5.7.3.4.4.9.5 1.3zM39.8 109.5c-1 1.2-1.9 2.5-2.7 3.9-.3.5-.7 1.1-1 1.7-.4-.1-.8-.3-1.1-.5s-.6-.4-.8-.6c-.1-.1-.3-.2-.4-.3 0 0-.1 0-.1-.1.1-.3.3-.5.3-.7.2-.5.4-.9.7-1.3.5-.8 1-1.6 1.6-2.4.2-.3.4-.6.8-.7.3-.1.7 0 1 0 .6.1 1.2.5 1.7 1zM32.1 114.8c0-.1.1-.1 0 0 .4.4.7.7 1.1 1 .2.1.3.3.5.4v.1c-.4 1.7-.7 3.5-.7 5.3 0 .1-.1.1-.1 0-.5-2.1-1.1-5.5-.8-6.8zM37 118.5c-.2 1.5-.3 3-.2 4.5 0 .8.1 1.6.2 2.5H36.2l-.4-.2c-.2-.1-.4-.4-.6-.7-.4-.7-.5-1.5-.5-2.3-.1-1.5.1-3.1.4-4.6.2.1.5.2.8.3.4.2.7.4 1.1.5z"
          fill="#fff"
        />
      </g>
      <defs>
        <path
          id="SVGID_00000128454529727717975320000012486895950618847389_"
          d="M185.6 92.8C185.6 41.5 144 0 92.8 0 41.5 0 0 41.5 0 92.8c0 51.2 41.5 92.8 92.8 92.8 51.2 0 92.8-41.6 92.8-92.8z"
        />
      </defs>
      <clipPath id="SVGID_00000112632825680152813190000016325904004000894366_">
        <use xlinkHref="#SVGID_00000128454529727717975320000012486895950618847389_" style={{ overflow: 'visible' }} />
      </clipPath>
      <g style={{ clipPath: 'url(#SVGID_00000112632825680152813190000016325904004000894366_)' }}>
        <g id="Layer_2_00000107572151008996527030000016290061794924690866_" style={{ opacity: 0.8 }}>
          <linearGradient
            id="SVGID_00000174576723511659957990000012099251455123196824_"
            x1={-12.996}
            x2={199.632}
            y1={635.135}
            y2={858.3}
            gradientTransform="translate(0 -656)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0.206} style={{ stopColor: '#89d0ff' }} />
            <stop offset={0.398} style={{ stopColor: '#ebbf9a' }} />
            <stop offset={0.602} style={{ stopColor: '#eb8280' }} />
            <stop offset={0.841} style={{ stopColor: '#a281ff' }} />
          </linearGradient>
          <path
            d="M76.4 196.5c-6.8 0-13.2-.4-18.6-.8l-1.5-.1-1.5-.2c-.7-.1-1.5-.2-2.4-.3-5.2-.6-14.9-1.6-25.6-6.6l-1.7-.8-1.5-.9C3 175.2-4.6 157.9-8.8 148.6c-.3-.6-.6-1.3-.9-2-2.1-4.3-3.4-8.1-4.5-11.7l-.2-.8-.2-.8c-3-10.6-3.7-19.7-2.4-28.8 1.4-9.1 4.7-17.3 10.6-26l3-4.9c.6-1 1-2.1 1.3-3.2C.2 59 5.4 50.9 8 47c.7-4.7 1.9-9.3 3.5-13.8l.2-.7.3-.7c0-.1.1-.3.2-.6C13.4 27.7 16.1 19.6 23 11l2.6-3 2.7-2.4c6.8-6.2 15-10.8 23.8-13.4 4.9-1.5 10-2.4 15.2-2.7h1.2c.9 0 1.8-.1 2.6-.1 3.2 0 6.4.3 9.6.8 2 .3 4 .1 5.9-.7 5.5-2.3 11.2-3.8 17.1-4.6.5-.1.9-.1 1.3-.2.9-.1 2.4-.3 4.2-.5 3.1-.3 7.9-.7 13-.7 10.1 0 18.8 1.3 26.6 4l.7.2.6.2c17.2 6.5 25.9 15.6 32.2 23.5l.3.4.9.8c5.7 4.4 10.5 9.9 14.3 16l1.2 1.9 1 2c8.4 17.1 5.7 33 4.7 38.9l-.1.3c-.7 4.4-1.9 8.7-3.4 12.9-.6 4-1.5 8-2.8 11.8-2.2 6.8-5.5 13.3-9.7 19.1-2.4 3.4-5.2 6.7-8.2 9.6-1.1 1-1.8 2.4-2 3.9-.1.9-.3 1.8-.4 2.7-2.5 13.2-8.2 22.4-10.6 26.1l-7.1 10.2c-8.6 10.7-18.8 17.7-31.1 21.5l-3 .9-3.2.6c-3.7.7-7.4 1-11.2 1H108.8c-1.4 0-2.8.3-4.2.7-8.2 2.6-17.2 3.8-28.2 3.8z"
            style={{
              opacity: 0.8,
              fill: 'none',
              stroke: 'url(#SVGID_00000174576723511659957990000012099251455123196824_)',
              strokeWidth: 1.0554,
              strokeMiterlimit: 10,
            }}
          />
          <linearGradient
            id="SVGID_00000078007290311443526780000002645036182949499018_"
            x1={-4.751}
            x2={191.268}
            y1={644.737}
            y2={851.313}
            gradientTransform="translate(0 -656)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0.206} style={{ stopColor: '#89d0ff' }} />
            <stop offset={0.398} style={{ stopColor: '#ebbf9a' }} />
            <stop offset={0.602} style={{ stopColor: '#eb80da' }} />
            <stop offset={0.841} style={{ stopColor: '#a281ff' }} />
          </linearGradient>
          <path
            d="M76.4 189.4c-6.5 0-12.8-.4-18-.8l-1.2-.1-1.2-.2c-.8-.1-1.7-.2-2.6-.3-5.1-.5-13.5-1.5-22.9-5.9l-1.4-.7-1.3-.7c-18.3-10.1-25-25.2-29-34.2-.3-.6-.6-1.4-1-2.1-1.9-3.8-3.1-7.4-4.1-10.6l-.2-.7-.2-.6C-9.3 123-10 115-8.8 107.1-7.6 99.3-4.6 92 .6 84.4l3.9-6.3c.7-1.1 1.2-2.4 1.4-3.7 1.9-10.8 7-18.4 9.3-21.9l.3-.4.1-.2c0-.1.1-.2.1-.3.1-.5.3-.9.4-1.3.6-4.4 1.7-8.8 3.2-13l.2-.6.2-.6c.1-.2.1-.4.3-1 1.1-3.3 3.4-10.2 9.4-17.6l2.2-2.6 2.2-2c5.9-5.4 13-9.4 20.6-11.6C58.8 0 63.2-.8 67.8-1h1c.8 0 1.5-.1 2.2-.1 3.3 0 6.5-.9 9.7-.3 2.5.5 5 .2 7.3-.8 4.3-1.9 10.1-2.6 16.7-3.5.5-.1.9-.1 1.2-.2.9-.1 2.3-.3 3.9-.4 2.9-.3 7.4-.6 12.3-.6 9.2 0 17 1.2 23.9 3.5l.6.2.5.2c15.2 5.8 22.7 13.4 28.6 20.9.3.4.7.8.8 1l.1.1 1.1 1 .1.2c5.1 3.9 9.4 8.7 12.7 14.1l1 1.6.8 1.7c7.2 14.7 5 28.2 4 33.9l-.1.3c-.7 4.2-1.8 8.2-3.3 12.2-.5 3.8-1.4 7.6-2.6 11.2-2 6-4.9 11.7-8.6 16.9-2.5 3.6-5.5 6.9-8.7 9.8-1.5 1.4-2.5 3.2-2.7 5.3-.2 1.5-.4 2.9-.6 4.4-2.2 11.7-7.2 19.7-9.6 23.3l-5.8 8.4c-7.7 9.9-16.8 16.3-27.8 19.7l-2.5.8-2.7.5c-3.2.6-6.5.9-9.7.8h-4.5c-1.5.1-3 .3-4.5.8-7.3 2.4-15.8 3.5-26.2 3.5z"
            style={{
              opacity: 0.8,
              fill: 'none',
              stroke: 'url(#SVGID_00000078007290311443526780000002645036182949499018_)',
              strokeWidth: 1.0554,
              strokeMiterlimit: 10,
            }}
          />
          <linearGradient
            id="SVGID_00000018943696915612414720000001476804467929569966_"
            x1={3.576}
            x2={182.984}
            y1={653.04}
            y2={843.021}
            gradientTransform="translate(0 -656)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0.206} style={{ stopColor: '#89d0ff' }} />
            <stop offset={0.398} style={{ stopColor: '#ebbf9a' }} />
            <stop offset={0.602} style={{ stopColor: '#eb8280' }} />
            <stop offset={0.841} style={{ stopColor: '#a281ff' }} />
          </linearGradient>
          <path
            d="M76.4 181.1c-6.2 0-12.3-.4-17.4-.8l-1-.1-1-.1c-.9-.1-1.9-.2-2.9-.3-4.8-.5-12.1-1.3-20.3-5.2l-1.1-.5-1-.6c-15.7-8.8-21.5-21.8-25.3-30.4-.3-.7-.7-1.6-1-2.3-1.7-3.4-2.8-6.6-3.7-9.6l-.2-.5-.1-.5C-.9 122-1.5 115-.5 108.4c1-6.7 3.7-13 8.3-19.7l.6-.8.6-.8c.4-.5.7-1 1.1-1.4l2.3-4.3c.8-1.4 1.3-2.9 1.5-4.5 1.5-9.6 6.1-16.5 8.2-19.7.1-.2.3-.4.4-.5l.5-.7c.2-.4.4-.9.6-1.5s.5-1.5.7-2.3c.5-4.1 1.5-8.1 2.9-12l.2-.5.2-.5c.1-.4.3-.7.5-1.4 1-3.1 2.9-8.8 8-15l1.7-2.1 1.8-1.6c5-4.6 11-7.9 17.5-9.9 3.8-1.1 7.6-1.8 11.6-2h2.7c3.4 0 6.7.4 10 1.3 2.8.7 5.8.4 8.4-.9 4.2-2 9.8-4.2 16.3-5 .4-.1.8-.1 1.1-.2.8-.1 2.1-.3 3.7-.4 2.7-.3 7-.6 11.5-.6 8.2 0 15.1 1 21.2 3.1l.4.2.4.2c14 5.3 20.2 12.2 25 18.3 1.1 1.3 1.2 1.5 1.9 2.2l.9.8.3.4c2.3 1.8 7 5.5 11.1 12.2l.8 1.3.7 1.3c6.1 12.3 4.2 23.5 3.3 28.9l-.1.3c-.6 3.9-1.7 7.8-3.3 11.5v.3c-.4 3.5-1.2 7-2.3 10.3-1.7 5.3-4.2 10.2-7.5 14.7-2.7 3.9-6 7.4-9.7 10.4-.9.7-1.6 1.6-2.1 2.6s-.8 2.1-.9 3.2c-.1 2.2-.4 4.4-.8 6.6-1.9 10.1-6.3 17.1-8.5 20.6l-4.5 6.6c-6.7 9-14.7 14.8-24.4 17.8l-2 .6-2.2.4c-2.7.5-5.5.7-8.3.7H108.1l-2.3.1c-1.6.1-3.2.3-4.7.9-6.9 2.2-14.8 3.2-24.7 3.2z"
            style={{
              opacity: 0.8,
              fill: 'none',
              stroke: 'url(#SVGID_00000018943696915612414720000001476804467929569966_)',
              strokeWidth: 0.9894,
              strokeMiterlimit: 10,
            }}
          />
          <linearGradient
            id="SVGID_00000024689210688303160630000017284372851326692799_"
            x1={11.893}
            x2={174.651}
            y1={661.371}
            y2={834.707}
            gradientTransform="translate(0 -656)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0.206} style={{ stopColor: '#89d0ff' }} />
            <stop offset={0.398} style={{ stopColor: '#ebbf9a' }} />
            <stop offset={0.602} style={{ stopColor: '#eb80e7' }} />
            <stop offset={0.841} style={{ stopColor: '#a281ff' }} />
          </linearGradient>
          <path
            d="M76.4 172.8c-5.9 0-11.8-.4-16.7-.8l-.7-.1-.7-.1c-1-.1-2.1-.3-3.1-.4-4.5-.5-10.7-1.2-17.7-4.4l-.8-.4-.8-.4c-13.3-7.5-18.2-18.5-21.8-26.5-.4-.8-.8-1.7-1.1-2.5-1.5-3.1-2.5-6-3.3-8.5l-.1-.4-.3-.3c-3.9-13.8-2.4-23.5 5.2-34.6l.4-.6.4-.6c.5-.6 1-1.3 1.5-1.9.7-.9 1.4-1.9 2.2-2.8.5-.6.9-1.3 1.2-2l.9-2.2c.4-1 .6-2 .7-3 .8-8.9 5.1-15.3 7.2-18.5.2-.2.4-.6.5-.7l.5-.8.2-.2c.3-.5.8-1.7 1.2-2.9.2-.8.6-2.1 1-3.2v-.1c.4-3.7 1.3-7.4 2.6-10.9l.1-.3.1-.3c.2-.6.4-1.1.6-1.8.9-2.7 2.4-7.3 6.5-12.4l1.3-1.6 1.3-1.2c9.7-8.8 20.5-9.5 24.1-9.8h2.1c4.3 0 8.5.9 12.5 2.6.7.3 1.5.4 2.2.4.8 0 1.5-.2 2.2-.6 3.7-2.1 10.4-6 19-7 .4-.1.8-.1 1.1-.1.8-.1 2-.2 3.4-.4 2.6-.2 6.5-.5 10.7-.5 7.3 0 13.3.9 18.4 2.6l.3.1.3.1c12 4.5 17.1 10.2 21.4 15.6 1.1 1.5 1.7 2.1 2.9 3.3l.7.6.5.6.4.3c2 1.6 5.8 4.5 9.2 10l.6 1 .5 1c4.9 10 3.3 19 2.5 23.8v.3c-.6 3.5-1.6 7-3 10.3l-.1.3c0 .1 0 .1-.1.3-.1.3-.1.6-.1.9l-.1.4c-.3 3-1 5.9-2 8.7-1.5 4.5-3.6 8.7-6.4 12.5-2.7 3.9-5.8 7.1-9.2 9.6-1.5 1.1-2.7 2.5-3.6 4.2-.9 1.7-1.3 3.5-1.3 5.4 0 2.3-.3 4.7-.7 7-1.6 8.6-5.2 14.4-7.5 17.9l-3.3 4.9c-5.8 8.1-12.7 13.3-21 15.9l-.4.1c-.7.2-1.4.4-2.1.5l-.5.1c-2.3.4-4.6.6-6.9.6H107.7c-1.1 0-2.5.1-3.7.1-1.7.1-3.3.4-4.9 1-6 1.8-13.3 2.8-22.7 2.8z"
            style={{
              opacity: 0.8,
              fill: 'none',
              stroke: 'url(#SVGID_00000024689210688303160630000017284372851326692799_)',
              strokeWidth: 0.9235,
              strokeMiterlimit: 10,
            }}
          />
          <linearGradient
            id="SVGID_00000085930422432826479730000016146188682793707422_"
            x1={20.16}
            x2={166.302}
            y1={669.718}
            y2={826.396}
            gradientTransform="translate(0 -656)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0.206} style={{ stopColor: '#89d0ff' }} />
            <stop offset={0.398} style={{ stopColor: '#ebbf9a' }} />
            <stop offset={0.602} style={{ stopColor: '#eb80d3' }} />
            <stop offset={0.841} style={{ stopColor: '#a281ff' }} />
          </linearGradient>
          <path
            d="M76.4 164.5c-5.7 0-11.3-.4-16.1-.8h-.5l-.5-.1c-1.1-.2-2.3-.3-3.4-.4-4.2-.5-9.4-1-15-3.7l-.6-.3-.5-.3c-10.9-6.1-15-15.3-18.2-22.7-.4-.9-.8-1.8-1.2-2.8-1.3-2.6-2.2-5.2-2.9-7.4l-.1-.3-.1-.3c-3.2-11.4-2.1-18.6 4.1-27.6l.3-.4.3-.4c.5-.7 1-1.3 1.5-2 1.6-2.1 3.2-4.2 5.5-6.7.5-.5.8-1.3.9-2L30 84l-.1-.9v-.9c.2-7.4 3.9-12.9 5.9-15.9.2-.3.5-.7.6-.9l.3-.5.3-.4c.4-.6 1.3-2.7 2.1-4.6.3-.8.7-2.4 1.2-3.7.1-.4.1-.5.2-1.4.3-3.1 1.1-6.2 2.1-9.1l.1-.2.1-.2c.3-.8.5-1.4.8-2.2.8-2.4 2-5.9 5.1-9.8l.9-1.1.9-.8c6.8-6.1 14.1-7.3 19.1-7.6h1.5c4.2 0 9.3 2 12 3.3.6.3 1.3.5 2 .5s1.4-.1 2.1-.3c1.7-.6 3.3-1.3 4.8-2.1 3.4-2 9-5.2 16-6 .4-.1.7-.1 1-.1.7-.1 1.8-.2 3.2-.4 2.4-.2 6-.5 9.9-.5 6.3 0 11.5.7 15.7 2.2l.2.1.2.1c10 3.8 14 8.1 17.8 13 1.2 1.6 2.1 2.7 3.9 4.3l.4.4.4.4c.4.4.8.7 1.2 1 1.7 1.3 4.6 3.6 7.1 7.8l.4.6.3.7c3.7 7.5 2.5 14.6 1.8 18.8v.3c-.5 2.9-1.3 5.7-2.5 8.4-.3.7-.5 1.4-.7 2.2-.1.5-.2 1-.2 1.4l-.1.4c-.3 2.4-.8 4.8-1.6 7.1-1.2 3.7-3 7.2-5.2 10.3-3.4 4.8-7.3 8.2-12 10.4-1.1.5-2.1 1.3-2.8 2.4-.7 1-1.1 2.3-1.2 3.5v1.2c.2 3.6.5 7.7-.3 12-1.3 7-4.3 11.7-6.5 15.2 0 0-10.2 14.2-19.5 17.1l-1 .3-1.1.2c-1.8.3-3.6.5-5.5.5H109.4c-.4 0-1 0-1.9.1h-.4c-3.6.1-6.9.2-7.9.4-.5.1-1 .2-1.5.4-4.9 2.1-11.8 3.1-21.3 3.1z"
            style={{
              opacity: 0.8,
              fill: 'none',
              stroke: 'url(#SVGID_00000085930422432826479730000016146188682793707422_)',
              strokeWidth: 0.8575,
              strokeMiterlimit: 10,
            }}
          />
          <linearGradient
            id="SVGID_00000038379881502420268080000011052478818508933564_"
            x1={28.535}
            x2={158.045}
            y1={677.965}
            y2={818.048}
            gradientTransform="translate(0 -656)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0.206} style={{ stopColor: '#89d0ff' }} />
            <stop offset={0.398} style={{ stopColor: '#ebbf9a' }} />
            <stop offset={0.602} style={{ stopColor: '#a280eb' }} />
            <stop offset={0.841} style={{ stopColor: '#a281ff' }} />
          </linearGradient>
          <path
            d="M76.4 156.3c-5.4 0-10.8-.4-15.4-.7h-.4c-1.3-.2-2.5-.3-3.6-.4-3.9-.4-8-.9-12.4-2.9l-.3-.1-.3-.1c-8.5-4.8-11.7-11.9-14.7-18.8-.4-1-.9-2-1.4-3-1-2-1.8-4.2-2.4-6.3v-.2c-2.6-9.1-1.9-13.7 2.9-20.7l.1-.2.1-.2c.6-.7 1.1-1.4 1.6-2 2.3-3 4.3-5.6 8.8-9.8.3-.3.6-.7.7-1.2.1-.4.1-.9-.1-1.3l-.8-2.3c-.2-.7-.3-1.5-.3-2.2v-1.1c.2-5 2.8-8.9 4.5-11.5.3-.4.5-.8.7-1.1l.2-.3.2-.3c.9-1.2 2.4-4.7 3.2-6.8.2-.7.7-2.4 1.2-3.7.3-1 .5-2 .6-3 .3-2.5.8-5 1.7-7.3v-.2c.4-1 .7-1.8.9-2.6.7-2.1 1.5-4.5 3.7-7.2l.4-.5.4-.4c4.8-4.4 10.1-5.2 14.1-5.5H71.2c4 0 7 1.6 9 2.7l.5.2h.1c.6.3 1 .6 1.5.8 1.2.6 2.7.8 4 .4 2.8-.7 7.1-2.4 9.9-4h.1c3-1.8 7.6-4.4 13-5 .3-.1.7-.1 1-.1.6-.1 1.7-.2 2.9-.3 2.2-.2 5.6-.5 9.1-.5 5.4 0 9.7.6 13 1.7h.2c8 3 11 6.2 14.2 10.4 1.3 1.7 2.6 3.3 5 5.4l.2.2.2.2c.6.6 1.3 1.2 2.1 1.8 1.4 1.1 3.4 2.6 5.1 5.5l.2.3.2.3c2.5 5.2 1.7 10.1 1.1 13.8v.3c-.4 2.3-1 4.5-2 6.7-.5 1.2-.9 2.5-1.1 3.8-.1.8-.2 1.4-.3 1.9l-.1.4c-.2 1.9-.6 3.7-1.2 5.5-.9 2.9-2.3 5.6-4.1 8.1-3 4.4-6.4 7.1-10.9 8.5-2.2.7-4 2.1-5.2 4l-.4.5-.4.5c-1.1 1.3-.8 6.3-.6 9.3.2 3.3.4 6.7-.2 9.9-1 5.5-3.4 9.2-5.5 12.4 0 0-7.8 11.3-14.9 13.4l-.5.2-.5.1c-1.3.2-2.7.4-4.1.4h-2c-.5 0-1.2 0-2.4.1h-.2c-4.7.2-7.6.3-9.2.6-1.1.2-2.1.5-3.1.9-4.3 1.7-10.1 2.6-18.5 2.6z"
            style={{
              opacity: 0.8,
              fill: 'none',
              stroke: 'url(#SVGID_00000038379881502420268080000011052478818508933564_)',
              strokeWidth: 0.8575,
              strokeMiterlimit: 10,
            }}
          />
        </g>
      </g>
    </svg>
  );
}

function DfxAssetIconLINK({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 37.8 43.6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="m18.9 0-4 2.3L4 8.6l-4 2.3v21.8L4 35l11 6.3 4 2.3 4-2.3L33.8 35l4-2.3V10.9l-4-2.3-10.9-6.3ZM8 28.1V15.5l10.9-6.3 10.9 6.3v12.6l-10.9 6.3Z"
          fill={forceColor ?? '#2a5ada'}
        />
      </g>
    </svg>
  );
}

function DfxAssetIconUNI({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 168.3 193.8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M66 44.1c-2.1-.3-2.2-.4-1.2-.5 1.9-.3 6.3.1 9.4.8 7.2 1.7 13.7 6.1 20.6 13.8l1.8 2.1 2.6-.4c11.1-1.8 22.5-.4 32 4 2.6 1.2 6.7 3.6 7.2 4.2.2.2.5 1.5.7 2.8.7 4.7.4 8.2-1.1 10.9-.8 1.5-.8 1.9-.3 3.2.4 1 1.6 1.7 2.7 1.7 2.4 0 4.9-3.8 6.1-9.1l.5-2.1.9 1c5.1 5.7 9.1 13.6 9.7 19.2l.2 1.5-.9-1.3c-1.5-2.3-2.9-3.8-4.8-5.1-3.4-2.3-7-3-16.5-3.5-8.6-.5-13.5-1.2-18.3-2.8-8.2-2.7-12.4-6.2-22.1-19.1-4.3-5.7-7-8.8-9.7-11.4-5.9-5.7-11.8-8.7-19.5-9.9z"
        fill={forceColor ?? '#ff007a'}
      />
      <path
        d="M140.5 56.8c.2-3.8.7-6.3 1.8-8.6.4-.9.8-1.7.9-1.7.1 0-.1.7-.4 1.5-.8 2.2-.9 5.3-.4 8.8.7 4.5 1 5.1 5.8 10 2.2 2.3 4.8 5.2 5.8 6.4l1.7 2.2-1.7-1.6c-2.1-2-6.9-5.8-8-6.3-.7-.4-.8-.4-1.3.1-.4.4-.5 1-.5 3.9-.1 4.5-.7 7.3-2.2 10.2-.8 1.5-.9 1.2-.2-.5.5-1.3.6-1.9.6-6.2 0-8.7-1-10.8-7.1-14.3-1.5-.9-4.1-2.2-5.6-2.9-1.6-.7-2.8-1.3-2.7-1.3.2-.2 6.1 1.5 8.4 2.5 3.5 1.4 4.1 1.5 4.5 1.4.3-.3.5-1.1.6-3.6zM70.1 71.7c-4.2-5.8-6.9-14.8-6.3-21.5l.2-2.1 1 .2c1.8.3 4.9 1.5 6.4 2.4 4 2.4 5.8 5.7 7.5 13.9.5 2.4 1.2 5.2 1.5 6.1.5 1.5 2.4 5 4 7.2 1.1 1.6.4 2.4-2.1 2.2-3.8-.4-8.9-3.9-12.2-8.4zM135.4 115.2c-19.8-8-26.8-14.9-26.8-26.6 0-1.7.1-3.1.1-3.1.1 0 .8.6 1.7 1.3 4 3.2 8.5 4.6 21 6.4 7.3 1.1 11.5 1.9 15.3 3.2 12.1 4 19.6 12.2 21.4 23.3.5 3.2.2 9.3-.6 12.5-.7 2.5-2.7 7.1-3.2 7.2-.1 0-.3-.5-.3-1.3-.2-4.2-2.3-8.2-5.8-11.3-4.2-3.6-9.6-6.3-22.8-11.6zM121.4 118.5c-.2-1.5-.7-3.4-1-4.2l-.5-1.5.9 1.1c1.3 1.5 2.3 3.3 3.2 5.8.7 1.9.7 2.5.7 5.6 0 3-.1 3.7-.7 5.4-1 2.7-2.2 4.6-4.2 6.7-3.6 3.7-8.3 5.7-15 6.6-1.2.1-4.6.4-7.6.6-7.5.4-12.5 1.2-17 2.8-.6.2-1.2.4-1.3.3-.2-.2 2.9-2 5.4-3.2 3.5-1.7 7.1-2.6 15-4 3.9-.6 7.9-1.4 8.9-1.8 9.9-3.1 14.8-10.8 13.2-20.2z"
        fill={forceColor ?? '#ff007a'}
      />
      <path
        d="M130.5 134.6c-2.6-5.7-3.2-11.1-1.8-16.2.2-.5.4-1 .6-1 .2 0 .8.3 1.4.7 1.2.8 3.7 2.2 10.1 5.7 8.1 4.4 12.7 7.8 15.9 11.7 2.8 3.4 4.5 7.3 5.3 12.1.5 2.7.2 9.2-.5 11.9-2.2 8.5-7.2 15.3-14.5 19.2-1.1.6-2 1-2.1 1-.1 0 .3-1 .9-2.2 2.4-5.1 2.7-10 .9-15.5-1.1-3.4-3.4-7.5-8-14.4-5.5-8-6.8-10.1-8.2-13zM56 165.2c7.4-6.2 16.5-10.6 24.9-12 3.6-.6 9.6-.4 12.9.5 5.3 1.4 10.1 4.4 12.6 8.1 2.4 3.6 3.5 6.7 4.6 13.6.4 2.7.9 5.5 1 6.1.8 3.6 2.4 6.4 4.4 7.9 3.1 2.3 8.5 2.4 13.8.4.9-.3 1.7-.6 1.7-.5.2.2-2.5 2-4.3 2.9-2.5 1.3-4.5 1.7-7.2 1.7-4.8 0-8.9-2.5-12.2-7.5-.7-1-2.1-3.9-3.3-6.6-3.5-8.1-5.3-10.5-9.4-13.2-3.6-2.3-8.2-2.8-11.7-1.1-4.6 2.2-5.8 8.1-2.6 11.7 1.3 1.5 3.7 2.7 5.7 3 3.7.5 6.9-2.4 6.9-6.1 0-2.4-.9-3.8-3.3-4.9-3.2-1.4-6.7.2-6.6 3.3 0 1.3.6 2.1 1.9 2.7.8.4.8.4.2.3-2.9-.6-3.6-4.2-1.3-6.5 2.8-2.8 8.7-1.6 10.7 2.3.8 1.6.9 4.8.2 6.8-1.7 4.4-6.5 6.7-11.4 5.4-3.3-.9-4.7-1.8-8.7-5.9-7-7.2-9.7-8.6-19.7-10.1l-1.9-.3 2.1-2z"
        fill={forceColor ?? '#ff007a'}
      />
      <path
        d="M3.4 4.3c23.3 28.3 59.2 72.3 61 74.7 1.5 2 .9 3.9-1.6 5.3-1.4.8-4.3 1.6-5.7 1.6-1.6 0-3.5-.8-4.8-2.1-.9-.9-4.8-6.6-13.6-20.3C32 53 26.3 44.3 26.2 44.2c-.4-.2-.4-.2 11.8 21.6C45.7 79.5 48.2 84.4 48.2 85c0 1.3-.4 2-2 3.8-2.7 3-3.9 6.4-4.8 13.5-1 7.9-3.7 13.5-11.4 23-4.5 5.6-5.2 6.6-6.3 8.9-1.4 2.8-1.8 4.4-2 8-.2 3.8.2 6.2 1.3 9.8 1 3.2 2.1 5.3 4.8 9.4 2.3 3.6 3.7 6.3 3.7 7.3 0 .8.2.8 3.8 0 8.6-2 15.7-5.4 19.6-9.6 2.4-2.6 3-4 3-7.6 0-2.3-.1-2.8-.7-4.2-1-2.2-2.9-4-7-6.8-5.4-3.7-7.7-6.7-8.3-10.7-.5-3.4.1-5.7 3.1-12 3.1-6.5 3.9-9.2 4.4-15.8.3-4.2.8-5.9 2-7.2 1.3-1.4 2.4-1.9 5.5-2.3 5.1-.7 8.4-2 11-4.5 2.3-2.1 3.3-4.2 3.4-7.3l.1-2.3-1.3-1.4C65.4 71.6.3 0 0 0c-.1 0 1.5 1.9 3.4 4.3zm30.7 142.2c1.1-1.9.5-4.3-1.3-5.5-1.7-1.1-4.3-.6-4.3.9 0 .4.2.8.8 1 .9.5 1 1 .3 2.1s-.7 2.1.2 2.8c1.4 1.1 3.3.5 4.3-1.3zM74.6 93.9c-2.4.7-4.7 3.3-5.4 5.9-.4 1.6-.2 4.5.5 5.4 1.1 1.4 2.1 1.8 4.9 1.8 5.5 0 10.2-2.4 10.7-5.3.5-2.4-1.6-5.7-4.5-7.2-1.5-.8-4.6-1.1-6.2-.6zm6.4 5c.8-1.2.5-2.5-1-3.4-2.7-1.7-6.8-.3-6.8 2.3 0 1.3 2.1 2.7 4.1 2.7 1.3 0 3.1-.8 3.7-1.6z"
        fill={forceColor ?? '#ff007a'}
      />
    </svg>
  );
}

function DfxAssetIconQNT({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 451.3 488.6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m102.3 29 124.1 145.4 83.3-49S209.2-9 182.4.5C157.2 10.1 102.3 29 102.3 29zM312.8 125.4s18.9-33.2 28.3-77.5c0 0 94.3 37.9 58.1 132.8l-86.4-55.3z"
        fill={forceColor ?? '#000'}
      />
      <path
        d="m399.2 180.8 7.9 99.6 36.1-4.7s9.4-3.2 7.9-20.5c-1.6-19-4.7-58.5-4.7-58.5s1.6-9.5-20.4-12.6c-26.8-4.9-26.8-3.3-26.8-3.3zM407 280.4l-72.3 58.5 33 64.8s7.9 25.3 31.4-3.2c22-28.5 31.4-33.2 29.8-50.6-1.4-17.4-6.2-58.5-21.9-69.5zM333.2 338.8l-99-44.3L147.8 470s-6.3 12.6 15.7 14.2c22 3.2 58.1 11.1 77-7.9 18.9-17.3 92.7-137.5 92.7-137.5zM234.2 293l-9.4-117-213.7 14.3s-12.6 1.6-11 25.3C1.7 247.2 4.8 282 4.8 282s-1.6 14.2 26.7 15.8c28.3 1.5 199.6 1.5 202.7-4.8z"
        fill={forceColor ?? '#000'}
      />
    </svg>
  );
}

function DfxAssetIconXCHF({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 300 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={forceColor ?? '#ce0e2d'}
        fillRule="evenodd"
        d="m80.168 147.035-6.86-16.808-36.277 89.125h21.992L148.027.422 249.25 249.293H121.71l-21.241-52.258 12.031-29.664 21.148 51.98h79.32l-64.94-159.746-77.165 189.688H.848l72.46-178.246L92.2 117.516zm0 0"
      />
    </svg>
  );
}

function DfxAssetIconFOX({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 55.7 61"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m51.2 4.2-2.7 16.2-9.6-11.3 12.3-4.9zm-2.7 23.1 2.4 8.9-18.4 5.1 16-14zm-40-4.4L18.4 10h17.1l10.9 12.9H8.5zM45.2 26 27.4 41.6 9.2 26h36zM15.1 9.1 6.3 20.6 3.6 4.2l11.5 4.9zm7 32.2L3.5 36.2 6 27.5l16.1 13.8zm3.4 4.2L22 49.3c-3-2.8-6.2-5.3-9.7-7.5l13.2 3.7zm17-3.7c-3.5 2.2-6.7 4.7-9.7 7.5l-3.6-3.9 13.3-3.6zM55.2-.9 35.9 6.8h-18L-.5-.9l4.2 25.3-4 13.7 10.5 6.3c5 3 9.4 6.7 13.2 11l4.1 4.7 4.3-4.9c3.7-4.2 8-7.8 12.7-10.8L54.7 38 51 24.4 55.2-.9z"
        style={{
          fillRule: 'evenodd',
          clipRule: 'evenodd',
          fill: forceColor ?? '#131d27',
        }}
        transform="translate(.491 .938)"
      />
    </svg>
  );
}

function DfxAssetIconBGB({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={forceColor ?? '#00effe'}
        d="M25.5-.5h12c13.614 3.614 22.28 12.28 26 26v12c-3.693 13.693-12.36 22.36-26 26h-12c-13.667-3.667-22.333-12.333-26-26v-12c3.667-13.667 12.333-22.333 26-26Z"
      />
      <path
        fill={forceColor ? '#ffffff' : '#000202'}
        d="M25.5 9.5a60.937 60.937 0 0 1 11 .5 328.222 328.222 0 0 0-15 15.5 178.565 178.565 0 0 0 11 11.5 30.499 30.499 0 0 1-11 0 178.565 178.565 0 0 1-11-11.5 2064.67 2064.67 0 0 1 15-16Z"
      />
      <path
        fill={forceColor ? '#ffffff' : '#000202'}
        d="M30.5 26.5c3.476-1.143 7.142-1.31 11-.5a93.004 93.004 0 0 1 11 12 169.04 169.04 0 0 1-15 16c-4 .667-8 .667-12 0a264.885 264.885 0 0 0 16-16 70.6 70.6 0 0 0-11-11.5Z"
      />
    </svg>
  );
}

function DfxAssetIconXMR({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 3756.09 3756.49"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{'monero'}</title>
      <path
        d="M4128 2249.81c0 1037.19-840.74 1878.05-1878 1878.05S372 3287 372 2249.81 1212.76 371.75 2250 371.75s1878 840.79 1878 1878.06Z"
        style={{ fill: '#fff' }}
        transform="translate(-371.96 -371.75)"
      />
      <path
        d="M2250 371.75c-1036.89 0-1879.12 842.06-1877.8 1878 .26 207.26 33.31 406.63 95.34 593.12h561.88V1263L2250 2483.57 3470.52 1263v1579.9h562c62.12-186.48 95-385.85 95.37-593.12C4129.66 1212.76 3287 372 2250 372Z"
        data-name={149931032}
        style={{ fill: forceColor ?? '#f26822' }}
        transform="translate(-371.96 -371.75)"
      />
      <path
        d="m1969.3 2764.17-532.67-532.7v994.14h-407.25l-384.29.07c329.63 540.8 925.35 902.56 1604.91 902.56s1275.31-361.84 1605-902.64h-791.75v-994.13l-532.7 532.7-280.61 280.61-280.62-280.61Z"
        data-name={149931160}
        style={{ fill: forceColor ?? '#4d4d4d' }}
        transform="translate(-371.96 -371.75)"
      />
    </svg>
  );
}

export function DfxAssetIconZCHF({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_216_23463)">
        <g clip-path="url(#clip1_216_23463)">
          <path d="M80 124H76V128H80V124Z" fill={forceColor ?? '#707280'} />
          <path d="M76 124H72V128H76V124Z" fill={forceColor ?? '#717381'} />
          <path d="M72 124H68V128H72V124Z" fill={forceColor ?? '#727482'} />
          <path d="M68 124H64V128H68V124Z" fill={forceColor ?? '#737483'} />
          <path d="M64 124H60V128H64V124Z" fill={forceColor ?? '#747584'} />
          <path d="M60 124H56V128H60V124Z" fill={forceColor ?? '#757685'} />
          <path d="M56 124H52V128H56V124Z" fill={forceColor ?? '#767786'} />
          <path d="M52 124H48V128H52V124Z" fill={forceColor ?? '#777987'} />
          <path d="M92 120H88V124H92V120Z" fill={forceColor ?? '#707280'} />
          <path d="M88 120H84V124H88V120Z" fill={forceColor ?? '#717381'} />
          <path d="M84 120H80V124H84V120Z" fill={forceColor ?? '#727382'} />
          <path d="M80 120H76V124H80V120Z" fill={forceColor ?? '#424756'} />
          <path d="M76 120H72V124H76V120Z" fill={forceColor ?? '#424756'} />
          <path d="M72 120H68V124H72V120Z" fill={forceColor ?? '#424756'} />
          <path d="M68 120H64V124H68V120Z" fill={forceColor ?? '#424756'} />
          <path d="M64 120H60V124H64V120Z" fill={forceColor ?? '#424756'} />
          <path d="M60 120H56V124H60V120Z" fill={forceColor ?? '#424756'} />
          <path d="M56 120H52V124H56V120Z" fill={forceColor ?? '#424756'} />
          <path d="M52 120H48V124H52V120Z" fill={forceColor ?? '#424756'} />
          <path d="M48 120H44V124H48V120Z" fill={forceColor ?? '#7B7D8B'} />
          <path d="M44 120H40V124H44V120Z" fill={forceColor ?? '#7C7E8C'} />
          <path d="M40 120H36V124H40V120Z" fill={forceColor ?? '#7D7F8D'} />
          <path d="M100 116H96V120H100V116Z" fill={forceColor ?? '#717281'} />
          <path d="M96 116H92V120H96V116Z" fill={forceColor ?? '#727381'} />
          <path d="M92 116H88V120H92V116Z" fill={forceColor ?? '#444957'} />
          <path d="M88 116H84V120H88V116Z" fill={forceColor ?? '#444957'} />
          <path d="M84 116H80V120H84V116Z" fill={forceColor ?? '#444957'} />
          <path d="M80 116H76V120H80V116Z" fill={forceColor ?? '#444957'} />
          <path d="M76 116H72V120H76V116Z" fill={forceColor ?? '#444957'} />
          <path d="M72 116H68V120H72V116Z" fill={forceColor ?? '#444957'} />
          <path d="M68 116H64V120H68V116Z" fill={forceColor ?? '#444957'} />
          <path d="M64 116H60V120H64V116Z" fill={forceColor ?? '#444957'} />
          <path d="M60 116H56V120H60V116Z" fill={forceColor ?? '#444957'} />
          <path d="M56 116H52V120H56V116Z" fill={forceColor ?? '#444957'} />
          <path d="M52 116H48V120H52V116Z" fill={forceColor ?? '#444957'} />
          <path d="M48 116H44V120H48V116Z" fill={forceColor ?? '#444957'} />
          <path d="M44 116H40V120H44V116Z" fill={forceColor ?? '#444957'} />
          <path d="M40 116H36V120H40V116Z" fill={forceColor ?? '#444957'} />
          <path d="M36 116H32V120H36V116Z" fill={forceColor ?? '#818392'} />
          <path d="M32 116H28V120H32V116Z" fill={forceColor ?? '#828493'} />
          <path d="M104 112H100V116H104V112Z" fill={forceColor ?? '#737482'} />
          <path d="M100 112H96V116H100V112Z" fill={forceColor ?? '#454B59'} />
          <path d="M96 112H92V116H96V112Z" fill={forceColor ?? '#454B59'} />
          <path d="M92 112H88V116H92V112Z" fill={forceColor ?? '#454B59'} />
          <path d="M88 112H84V116H88V112Z" fill={forceColor ?? '#454B59'} />
          <path d="M84 112H80V116H84V112Z" fill={forceColor ?? '#454B59'} />
          <path d="M80 112H76V116H80V112Z" fill={forceColor ?? '#454B59'} />
          <path d="M76 112H72V116H76V112Z" fill={forceColor ?? '#454B59'} />
          <path d="M72 112H68V116H72V112Z" fill={forceColor ?? '#454B59'} />
          <path d="M68 112H64V116H68V112Z" fill={forceColor ?? '#454B59'} />
          <path d="M64 112H60V116H64V112Z" fill={forceColor ?? '#454B59'} />
          <path d="M60 112H56V116H60V112Z" fill={forceColor ?? '#454B59'} />
          <path d="M56 112H52V116H56V112Z" fill={forceColor ?? '#454B59'} />
          <path d="M52 112H48V116H52V112Z" fill={forceColor ?? '#454B59'} />
          <path d="M48 112H44V116H48V112Z" fill={forceColor ?? '#454B59'} />
          <path d="M44 112H40V116H44V112Z" fill={forceColor ?? '#454B59'} />
          <path d="M40 112H36V116H40V112Z" fill={forceColor ?? '#454B59'} />
          <path d="M36 112H32V116H36V112Z" fill={forceColor ?? '#454B59'} />
          <path d="M32 112H28V116H32V112Z" fill={forceColor ?? '#454B59'} />
          <path d="M28 112H24V116H28V112Z" fill={forceColor ?? '#878998'} />
          <path d="M108 108H104V112H108V108Z" fill={forceColor ?? '#757684'} />
          <path d="M104 108H100V112H104V108Z" fill={forceColor ?? '#474C5B'} />
          <path d="M100 108H96V112H100V108Z" fill={forceColor ?? '#474C5B'} />
          <path d="M96 108H92V112H96V108Z" fill={forceColor ?? '#474C5B'} />
          <path d="M92 108H88V112H92V108Z" fill={forceColor ?? '#474C5B'} />
          <path d="M88 108H84V112H88V108Z" fill={forceColor ?? '#474C5B'} />
          <path d="M84 108H80V112H84V108Z" fill={forceColor ?? '#474C5B'} />
          <path d="M80 108H76V112H80V108Z" fill={forceColor ?? '#474C5B'} />
          <path d="M76 108H72V112H76V108Z" fill={forceColor ?? '#474C5B'} />
          <path d="M72 108H68V112H72V108Z" fill={forceColor ?? '#474C5B'} />
          <path d="M68 108H64V112H68V108Z" fill={forceColor ?? '#474C5B'} />
          <path d="M64 108H60V112H64V108Z" fill={forceColor ?? '#474C5B'} />
          <path d="M60 108H56V112H60V108Z" fill={forceColor ?? '#474C5B'} />
          <path d="M56 108H52V112H56V108Z" fill={forceColor ?? '#474C5B'} />
          <path d="M52 108H48V112H52V108Z" fill={forceColor ?? '#474C5B'} />
          <path d="M48 108H44V112H48V108Z" fill={forceColor ?? '#474C5B'} />
          <path d="M44 108H40V112H44V108Z" fill={forceColor ?? '#474C5B'} />
          <path d="M40 108H36V112H40V108Z" fill={forceColor ?? '#474C5B'} />
          <path d="M36 108H32V112H36V108Z" fill={forceColor ?? '#474C5B'} />
          <path d="M32 108H28V112H32V108Z" fill={forceColor ?? '#474C5B'} />
          <path d="M28 108H24V112H28V108Z" fill={forceColor ?? '#474C5B'} />
          <path d="M24 108H20V112H24V108Z" fill={forceColor ?? '#8B8D9C'} />
          <path d="M112 104H108V108H112V104Z" fill={forceColor ?? '#777886'} />
          <path d="M108 104H104V108H108V104Z" fill={forceColor ?? '#484D5D'} />
          <path d="M104 104H100V108H104V104Z" fill={forceColor ?? '#484D5D'} />
          <path d="M100 104H96V108H100V104Z" fill={forceColor ?? '#484D5D'} />
          <path d="M96 104H92V108H96V104Z" fill={forceColor ?? '#484D5D'} />
          <path d="M92 104H88V108H92V104Z" fill={forceColor ?? '#484D5D'} />
          <path d="M88 104H84V108H88V104Z" fill={forceColor ?? '#484D5D'} />
          <path d="M84 104H80V108H84V104Z" fill={forceColor ?? '#484D5D'} />
          <path d="M80 104H76V108H80V104Z" fill={forceColor ?? '#484D5D'} />
          <path d="M76 104H72V108H76V104Z" fill={forceColor ?? '#484D5D'} />
          <path d="M72 104H68V108H72V104Z" fill={forceColor ?? '#484D5D'} />
          <path d="M68 104H64V108H68V104Z" fill={forceColor ?? '#484D5D'} />
          <path d="M64 104H60V108H64V104Z" fill={forceColor ?? '#484D5D'} />
          <path d="M60 104H56V108H60V104Z" fill={forceColor ?? '#484D5D'} />
          <path d="M56 104H52V108H56V104Z" fill={forceColor ?? '#484D5D'} />
          <path d="M52 104H48V108H52V104Z" fill={forceColor ?? '#484D5D'} />
          <path d="M48 104H44V108H48V104Z" fill={forceColor ?? '#484D5D'} />
          <path d="M44 104H40V108H44V104Z" fill={forceColor ?? '#484D5D'} />
          <path d="M40 104H36V108H40V104Z" fill={forceColor ?? '#484D5D'} />
          <path d="M36 104H32V108H36V104Z" fill={forceColor ?? '#484D5D'} />
          <path d="M32 104H28V108H32V104Z" fill={forceColor ?? '#484D5D'} />
          <path d="M28 104H24V108H28V104Z" fill={forceColor ?? '#484D5D'} />
          <path d="M24 104H20V108H24V104Z" fill={forceColor ?? '#484D5D'} />
          <path d="M20 104H16V108H20V104Z" fill={forceColor ?? '#8F92A0'} />
          <path d="M116 100H112V104H116V100Z" fill={forceColor ?? '#787A88'} />
          <path d="M112 100H108V104H112V100Z" fill={forceColor ?? '#4A4F5F'} />
          <path d="M108 100H104V104H108V100Z" fill={forceColor ?? '#4A4F5F'} />
          <path d="M104 100H100V104H104V100Z" fill={forceColor ?? '#4A4F5F'} />
          <path d="M100 100H96V104H100V100Z" fill={forceColor ?? '#4A4F5F'} />
          <path d="M96 100H92V104H96V100Z" fill={forceColor ?? '#4A4F5F'} />
          <path d="M92 100H88V104H92V100Z" fill={forceColor ?? '#4A4F5F'} />
          <path d="M88 100H84V104H88V100Z" fill={forceColor ?? '#4A4F5F'} />
          <path d="M84 100H80V104H84V100Z" fill={forceColor ?? '#4A4F5F'} />
          <path d="M80 100H76V104H80V100Z" fill={forceColor ?? '#4A4F5F'} />
          <path d="M76 100H72V104H76V100Z" fill={forceColor ?? '#4A4F5F'} />
          <path d="M72 100H68V104H72V100Z" fill={forceColor ?? '#4A4F5F'} />
          <path d="M68 100H64V104H68V100Z" fill={forceColor ?? '#4A4F5F'} />
          <path d="M64 100H60V104H64V100Z" fill={forceColor ?? '#4A4F5F'} />
          <path d="M60 100H56V104H60V100Z" fill={forceColor ?? '#4A4F5F'} />
          <path d="M56 100H52V104H56V100Z" fill={forceColor ?? '#4A4F5F'} />
          <path d="M52 100H48V104H52V100Z" fill={forceColor ?? '#4A4F5F'} />
          <path d="M48 100H44V104H48V100Z" fill={forceColor ?? '#4A4F5F'} />
          <path d="M44 100H40V104H44V100Z" fill={forceColor ?? '#4A4F5F'} />
          <path d="M40 100H36V104H40V100Z" fill={forceColor ?? '#4A4F5F'} />
          <path d="M36 100H32V104H36V100Z" fill={forceColor ?? '#4A4F5F'} />
          <path d="M32 100H28V104H32V100Z" fill={forceColor ?? '#4A4F5F'} />
          <path d="M28 100H24V104H28V100Z" fill={forceColor ?? '#4A4F5F'} />
          <path d="M24 100H20V104H24V100Z" fill={forceColor ?? '#4A4F5F'} />
          <path d="M20 100H16V104H20V100Z" fill={forceColor ?? '#4A4F5F'} />
          <path d="M16 100H12V104H16V100Z" fill={forceColor ?? '#9396A5'} />
          <path d="M120 96H116V100H120V96Z" fill={forceColor ?? '#7A7C8A'} />
          <path d="M116 96H112V100H116V96Z" fill={forceColor ?? '#4C5161'} />
          <path d="M112 96H108V100H112V96Z" fill={forceColor ?? '#4C5161'} />
          <path d="M108 96H104V100H108V96Z" fill={forceColor ?? '#4C5161'} />
          <path d="M104 96H100V100H104V96Z" fill={forceColor ?? '#4C5161'} />
          <path d="M100 96H96V100H100V96Z" fill={forceColor ?? '#4C5161'} />
          <path d="M96 96H92V100H96V96Z" fill={forceColor ?? '#4C5161'} />
          <path d="M92 96H88V100H92V96Z" fill={forceColor ?? '#4C5161'} />
          <path d="M88 96H84V100H88V96Z" fill={forceColor ?? '#4C5161'} />
          <path d="M84 96H80V100H84V96Z" fill={forceColor ?? '#4C5161'} />
          <path d="M80 96H76V100H80V96Z" fill={forceColor ?? '#4C5161'} />
          <path d="M76 96H72V100H76V96Z" fill={forceColor ?? '#4C5161'} />
          <path d="M72 96H68V100H72V96Z" fill={forceColor ?? '#4C5161'} />
          <path d="M68 96H64V100H68V96Z" fill={forceColor ?? '#4C5161'} />
          <path d="M64 96H60V100H64V96Z" fill={forceColor ?? '#4C5161'} />
          <path d="M60 96H56V100H60V96Z" fill={forceColor ?? '#4C5161'} />
          <path d="M56 96H52V100H56V96Z" fill={forceColor ?? '#4C5161'} />
          <path d="M52 96H48V100H52V96Z" fill={forceColor ?? '#4C5161'} />
          <path d="M48 96H44V100H48V96Z" fill={forceColor ?? '#4C5161'} />
          <path d="M44 96H40V100H44V96Z" fill={forceColor ?? '#4C5161'} />
          <path d="M40 96H36V100H40V96Z" fill={forceColor ?? '#4C5161'} />
          <path d="M36 96H32V100H36V96Z" fill={forceColor ?? '#4C5161'} />
          <path d="M32 96H28V100H32V96Z" fill={forceColor ?? '#4C5161'} />
          <path d="M28 96H24V100H28V96Z" fill={forceColor ?? '#4C5161'} />
          <path d="M24 96H20V100H24V96Z" fill={forceColor ?? '#4C5161'} />
          <path d="M20 96H16V100H20V96Z" fill={forceColor ?? '#4C5161'} />
          <path d="M16 96H12V100H16V96Z" fill={forceColor ?? '#464B59'} />
          <path d="M12 96H8V100H12V96Z" fill={forceColor ?? '#979AA9'} />
          <path d="M120 92H116V96H120V92Z" fill={forceColor ?? '#7E7F8E'} />
          <path d="M116 92H112V96H116V92Z" fill={forceColor ?? '#4E5363'} />
          <path d="M112 92H108V96H112V92Z" fill={forceColor ?? '#4E5363'} />
          <path d="M108 92H104V96H108V92Z" fill={forceColor ?? '#4E5363'} />
          <path d="M104 92H100V96H104V92Z" fill={forceColor ?? '#4E5363'} />
          <path d="M100 92H96V96H100V92Z" fill={forceColor ?? '#4E5363'} />
          <path d="M96 92H92V96H96V92Z" fill={forceColor ?? '#4E5363'} />
          <path d="M92 92H88V96H92V92Z" fill={forceColor ?? '#4E5363'} />
          <path d="M88 92H84V96H88V92Z" fill={forceColor ?? '#4E5363'} />
          <path d="M84 92H80V96H84V92Z" fill={forceColor ?? '#C1C2C8'} />
          <path d="M80 92H76V96H80V92Z" fill={forceColor ?? '#4E5363'} />
          <path d="M76 92H72V96H76V92Z" fill={forceColor ?? '#4E5363'} />
          <path d="M72 92H68V96H72V92Z" fill={forceColor ?? '#4E5363'} />
          <path d="M68 92H64V96H68V92Z" fill={forceColor ?? '#4E5363'} />
          <path d="M64 92H60V96H64V92Z" fill={forceColor ?? '#DADBDE'} />
          <path d="M60 92H56V96H60V92Z" fill={forceColor ?? '#4E5363'} />
          <path d="M56 92H52V96H56V92Z" fill={forceColor ?? '#4E5363'} />
          <path d="M52 92H48V96H52V92Z" fill={forceColor ?? '#4E5363'} />
          <path d="M48 92H44V96H48V92Z" fill={forceColor ?? '#4E5363'} />
          <path d="M44 92H40V96H44V92Z" fill={forceColor ?? '#4E5363'} />
          <path d="M40 92H36V96H40V92Z" fill={forceColor ?? '#4E5363'} />
          <path d="M36 92H32V96H36V92Z" fill={forceColor ?? '#4E5363'} />
          <path d="M32 92H28V96H32V92Z" fill={forceColor ?? '#4E5363'} />
          <path d="M28 92H24V96H28V92Z" fill={forceColor ?? '#4E5363'} />
          <path d="M24 92H20V96H24V92Z" fill={forceColor ?? '#4E5363'} />
          <path d="M20 92H16V96H20V92Z" fill={forceColor ?? '#4E5363'} />
          <path d="M16 92H12V96H16V92Z" fill={forceColor ?? '#4E5363'} />
          <path d="M12 92H8V96H12V92Z" fill={forceColor ?? '#9B9EAD'} />
          <path d="M124 88H120V92H124V88Z" fill={forceColor ?? '#808290'} />
          <path d="M120 88H116V92H120V88Z" fill={forceColor ?? '#505665'} />
          <path d="M116 88H112V92H116V88Z" fill={forceColor ?? '#505665'} />
          <path d="M112 88H108V92H112V88Z" fill={forceColor ?? '#505665'} />
          <path d="M108 88H104V92H108V88Z" fill={forceColor ?? '#505665'} />
          <path d="M104 88H100V92H104V88Z" fill={forceColor ?? '#505665'} />
          <path d="M100 88H96V92H100V88Z" fill={forceColor ?? '#505665'} />
          <path d="M96 88H92V92H96V88Z" fill={forceColor ?? '#505665'} />
          <path d="M92 88H88V92H92V88Z" fill={forceColor ?? '#505665'} />
          <path d="M88 88H84V92H88V88Z" fill={forceColor ?? '#505665'} />
          <path d="M84 88H80V92H84V88Z" fill={forceColor ?? '#505665'} />
          <path d="M80 88H76V92H80V88Z" fill={forceColor ?? '#595E69'} />
          <path d="M76 88H72V92H76V88Z" fill={forceColor ?? '#505665'} />
          <path d="M72 88H68V92H72V88Z" fill={forceColor ?? '#626775'} />
          <path d="M68 88H64V92H68V88Z" fill={forceColor ?? '#E9EAEC'} />
          <path d="M64 88H60V92H64V88Z" fill={forceColor ?? '#505665'} />
          <path d="M60 88H56V92H60V88Z" fill={forceColor ?? '#505665'} />
          <path d="M56 88H52V92H56V88Z" fill={forceColor ?? '#505665'} />
          <path d="M52 88H48V92H52V88Z" fill={forceColor ?? '#505665'} />
          <path d="M48 88H44V92H48V88Z" fill={forceColor ?? '#505665'} />
          <path d="M44 88H40V92H44V88Z" fill={forceColor ?? '#505665'} />
          <path d="M40 88H36V92H40V88Z" fill={forceColor ?? '#505665'} />
          <path d="M36 88H32V92H36V88Z" fill={forceColor ?? '#505665'} />
          <path d="M32 88H28V92H32V88Z" fill={forceColor ?? '#505665'} />
          <path d="M28 88H24V92H28V88Z" fill={forceColor ?? '#505665'} />
          <path d="M24 88H20V92H24V88Z" fill={forceColor ?? '#505665'} />
          <path d="M20 88H16V92H20V88Z" fill={forceColor ?? '#505665'} />
          <path d="M16 88H12V92H16V88Z" fill={forceColor ?? '#505665'} />
          <path d="M12 88H8V92H12V88Z" fill={forceColor ?? '#4A4F5D'} />
          <path d="M8 88H4V92H8V88Z" fill={forceColor ?? '#9FA2B1'} />
          <path d="M124 84H120V88H124V84Z" fill={forceColor ?? '#838593'} />
          <path d="M120 84H116V88H120V84Z" fill={forceColor ?? '#535868'} />
          <path d="M116 84H112V88H116V84Z" fill={forceColor ?? '#535868'} />
          <path d="M112 84H108V88H112V84Z" fill={forceColor ?? '#535868'} />
          <path d="M108 84H104V88H108V84Z" fill={forceColor ?? '#535868'} />
          <path d="M104 84H100V88H104V84Z" fill={forceColor ?? '#535868'} />
          <path d="M100 84H96V88H100V84Z" fill={forceColor ?? '#686C7A'} />
          <path d="M96 84H92V88H96V84Z" fill={forceColor ?? '#535868'} />
          <path d="M92 84H88V88H92V84Z" fill={forceColor ?? '#535868'} />
          <path d="M88 84H84V88H88V84Z" fill={forceColor ?? '#686C7A'} />
          <path d="M84 84H80V88H84V84Z" fill={forceColor ?? '#535868'} />
          <path d="M80 84H76V88H80V84Z" fill={forceColor ?? '#535868'} />
          <path d="M76 84H72V88H76V84Z" fill={forceColor ?? '#747885'} />
          <path d="M72 84H68V88H72V84Z" fill={forceColor ?? '#E5E6E8'} />
          <path d="M68 84H64V88H68V84Z" fill={forceColor ?? '#535868'} />
          <path d="M64 84H60V88H64V84Z" fill={forceColor ?? '#535868'} />
          <path d="M60 84H56V88H60V84Z" fill={forceColor ?? '#535868'} />
          <path d="M56 84H52V88H56V84Z" fill={forceColor ?? '#535868'} />
          <path d="M52 84H48V88H52V84Z" fill={forceColor ?? '#535868'} />
          <path d="M48 84H44V88H48V84Z" fill={forceColor ?? '#535868'} />
          <path d="M44 84H40V88H44V84Z" fill={forceColor ?? '#535868'} />
          <path d="M40 84H36V88H40V84Z" fill={forceColor ?? '#535868'} />
          <path d="M36 84H32V88H36V84Z" fill={forceColor ?? '#535868'} />
          <path d="M32 84H28V88H32V84Z" fill={forceColor ?? '#535868'} />
          <path d="M28 84H24V88H28V84Z" fill={forceColor ?? '#535868'} />
          <path d="M24 84H20V88H24V84Z" fill={forceColor ?? '#535868'} />
          <path d="M20 84H16V88H20V84Z" fill={forceColor ?? '#535868'} />
          <path d="M16 84H12V88H16V84Z" fill={forceColor ?? '#535868'} />
          <path d="M12 84H8V88H12V84Z" fill={forceColor ?? '#4C5160'} />
          <path d="M8 84H4V88H8V84Z" fill={forceColor ?? '#A2A6B5'} />
          <path d="M124 80H120V84H124V80Z" fill={forceColor ?? '#868897'} />
          <path d="M120 80H116V84H120V80Z" fill={forceColor ?? '#565B6B'} />
          <path d="M116 80H112V84H116V80Z" fill={forceColor ?? '#565B6B'} />
          <path d="M112 80H108V84H112V80Z" fill={forceColor ?? '#C5C7CD'} />
          <path d="M108 80H104V84H108V80Z" fill={forceColor ?? '#676C7A'} />
          <path d="M104 80H100V84H104V80Z" fill={forceColor ?? '#565B6B'} />
          <path d="M100 80H96V84H100V80Z" fill={forceColor ?? '#565B6B'} />
          <path d="M96 80H92V84H96V80Z" fill={forceColor ?? '#D9DADD'} />
          <path d="M92 80H88V84H92V80Z" fill={forceColor ?? '#565B6B'} />
          <path d="M88 80H84V84H88V80Z" fill={forceColor ?? '#565B6B'} />
          <path d="M84 80H80V84H84V80Z" fill={forceColor ?? '#676C7A'} />
          <path d="M80 80H76V84H80V80Z" fill={forceColor ?? '#767B87'} />
          <path d="M76 80H72V84H76V80Z" fill={forceColor ?? '#E6E7E9'} />
          <path d="M72 80H68V84H72V80Z" fill={forceColor ?? '#565B6B'} />
          <path d="M68 80H64V84H68V80Z" fill={forceColor ?? '#565B6B'} />
          <path d="M64 80H60V84H64V80Z" fill={forceColor ?? '#565B6B'} />
          <path d="M60 80H56V84H60V80Z" fill={forceColor ?? '#565B6B'} />
          <path d="M56 80H52V84H56V80Z" fill={forceColor ?? '#565B6B'} />
          <path d="M52 80H48V84H52V80Z" fill={forceColor ?? '#565B6B'} />
          <path d="M48 80H44V84H48V80Z" fill={forceColor ?? '#565B6B'} />
          <path d="M44 80H40V84H44V80Z" fill={forceColor ?? '#565B6B'} />
          <path d="M40 80H36V84H40V80Z" fill={forceColor ?? '#565B6B'} />
          <path d="M36 80H32V84H36V80Z" fill={forceColor ?? '#565B6B'} />
          <path d="M32 80H28V84H32V80Z" fill={forceColor ?? '#565B6B'} />
          <path d="M28 80H24V84H28V80Z" fill={forceColor ?? '#565B6B'} />
          <path d="M24 80H20V84H24V80Z" fill={forceColor ?? '#565B6B'} />
          <path d="M20 80H16V84H20V80Z" fill={forceColor ?? '#565B6B'} />
          <path d="M16 80H12V84H16V80Z" fill={forceColor ?? '#565B6B'} />
          <path d="M12 80H8V84H12V80Z" fill={forceColor ?? '#565B6B'} />
          <path d="M8 80H4V84H8V80Z" fill={forceColor ?? '#A6A9B8'} />
          <path d="M128 76H124V80H128V76Z" fill={forceColor ?? '#888A99'} />
          <path d="M124 76H120V80H124V76Z" fill={forceColor ?? '#595F6F'} />
          <path d="M120 76H116V80H120V76Z" fill={forceColor ?? '#595F6F'} />
          <path d="M116 76H112V80H116V76Z" fill={forceColor ?? '#595F6F'} />
          <path d="M112 76H108V80H112V76Z" fill={forceColor ?? '#595F6F'} />
          <path d="M108 76H104V80H108V76Z" fill={forceColor ?? '#F4F4F5'} />
          <path d="M104 76H100V80H104V76Z" fill="white" />
          <path d="M100 76H96V80H100V76Z" fill={forceColor ?? '#6A6F7E'} />
          <path d="M96 76H92V80H96V76Z" fill={forceColor ?? '#595F6F'} />
          <path d="M92 76H88V80H92V76Z" fill={forceColor ?? '#595F6F'} />
          <path d="M88 76H84V80H88V76Z" fill="white" />
          <path d="M84 76H80V80H84V76Z" fill={forceColor ?? '#878B97'} />
          <path d="M80 76H76V80H80V76Z" fill={forceColor ?? '#E6E7EA'} />
          <path d="M76 76H72V80H76V76Z" fill="white" />
          <path d="M72 76H68V80H72V76Z" fill={forceColor ?? '#595F6F'} />
          <path d="M68 76H64V80H68V76Z" fill={forceColor ?? '#595F6F'} />
          <path d="M64 76H60V80H64V76Z" fill={forceColor ?? '#595F6F'} />
          <path d="M60 76H56V80H60V76Z" fill={forceColor ?? '#595F6F'} />
          <path d="M56 76H52V80H56V76Z" fill="white" />
          <path d="M52 76H48V80H52V76Z" fill={forceColor ?? '#6A6F7E'} />
          <path d="M48 76H44V80H48V76Z" fill={forceColor ?? '#595F6F'} />
          <path d="M44 76H40V80H44V76Z" fill={forceColor ?? '#595F6F'} />
          <path d="M40 76H36V80H40V76Z" fill={forceColor ?? '#595F6F'} />
          <path d="M36 76H32V80H36V76Z" fill={forceColor ?? '#595F6F'} />
          <path d="M32 76H28V80H32V76Z" fill={forceColor ?? '#595F6F'} />
          <path d="M28 76H24V80H28V76Z" fill={forceColor ?? '#595F6F'} />
          <path d="M24 76H20V80H24V76Z" fill={forceColor ?? '#595F6F'} />
          <path d="M20 76H16V80H20V76Z" fill={forceColor ?? '#595F6F'} />
          <path d="M16 76H12V80H16V76Z" fill={forceColor ?? '#6A6F7E'} />
          <path d="M12 76H8V80H12V76Z" fill={forceColor ?? '#7F8490'} />
          <path d="M8 76H4V80H8V76Z" fill={forceColor ?? '#525866'} />
          <path d="M4 76H0V80H4V76Z" fill={forceColor ?? '#AAAEBD'} />
          <path d="M128 72H124V76H128V72Z" fill={forceColor ?? '#8B8E9C'} />
          <path d="M124 72H120V76H124V72Z" fill={forceColor ?? '#5D6373'} />
          <path d="M120 72H116V76H120V72Z" fill={forceColor ?? '#5D6373'} />
          <path d="M116 72H112V76H116V72Z" fill={forceColor ?? '#717684'} />
          <path d="M112 72H108V76H112V72Z" fill={forceColor ?? '#5D6373'} />
          <path d="M108 72H104V76H108V72Z" fill={forceColor ?? '#5D6373'} />
          <path d="M104 72H100V76H104V72Z" fill={forceColor ?? '#F2F3F4'} />
          <path d="M100 72H96V76H100V72Z" fill="white" />
          <path d="M96 72H92V76H96V72Z" fill={forceColor ?? '#F2F3F4'} />
          <path d="M92 72H88V76H92V72Z" fill={forceColor ?? '#6E7381'} />
          <path d="M88 72H84V76H88V72Z" fill={forceColor ?? '#898E99'} />
          <path d="M84 72H80V76H84V72Z" fill={forceColor ?? '#DCDDE1'} />
          <path d="M80 72H76V76H80V72Z" fill="white" />
          <path d="M76 72H72V76H76V72Z" fill={forceColor ?? '#5D6373'} />
          <path d="M72 72H68V76H72V72Z" fill={forceColor ?? '#5D6373'} />
          <path d="M68 72H64V76H68V72Z" fill={forceColor ?? '#5D6373'} />
          <path d="M64 72H60V76H64V72Z" fill={forceColor ?? '#5D6373'} />
          <path d="M60 72H56V76H60V72Z" fill={forceColor ?? '#5D6373'} />
          <path d="M56 72H52V76H56V72Z" fill={forceColor ?? '#5D6373'} />
          <path d="M52 72H48V76H52V72Z" fill="white" />
          <path d="M48 72H44V76H48V72Z" fill={forceColor ?? '#E3E4E7'} />
          <path d="M44 72H40V76H44V72Z" fill={forceColor ?? '#6E7381'} />
          <path d="M40 72H36V76H40V72Z" fill={forceColor ?? '#5D6373'} />
          <path d="M36 72H32V76H36V72Z" fill={forceColor ?? '#5D6373'} />
          <path d="M32 72H28V76H32V72Z" fill={forceColor ?? '#5D6373'} />
          <path d="M28 72H24V76H28V72Z" fill={forceColor ?? '#5D6373'} />
          <path d="M24 72H20V76H24V72Z" fill={forceColor ?? '#6E7381'} />
          <path d="M20 72H16V76H20V72Z" fill={forceColor ?? '#C5C7CC'} />
          <path d="M16 72H12V76H16V72Z" fill={forceColor ?? '#A2A5AE'} />
          <path d="M12 72H8V76H12V72Z" fill={forceColor ?? '#5D6373'} />
          <path d="M8 72H4V76H8V72Z" fill={forceColor ?? '#565B6A'} />
          <path d="M4 72H0V76H4V72Z" fill={forceColor ?? '#ADB1C0'} />
          <path d="M128 68H124V72H128V68Z" fill={forceColor ?? '#8E919F'} />
          <path d="M124 68H120V72H124V68Z" fill={forceColor ?? '#7E8290'} />
          <path d="M120 68H116V72H120V68Z" fill="white" />
          <path d="M116 68H112V72H116V68Z" fill={forceColor ?? '#717685'} />
          <path d="M112 68H108V72H112V68Z" fill="white" />
          <path d="M108 68H104V72H108V68Z" fill={forceColor ?? '#717685'} />
          <path d="M104 68H100V72H104V68Z" fill={forceColor ?? '#8C919C'} />
          <path d="M100 68H96V72H100V68Z" fill="white" />
          <path d="M96 68H92V72H96V68Z" fill={forceColor ?? '#8C919C'} />
          <path d="M92 68H88V72H92V68Z" fill="white" />
          <path d="M88 68H84V72H88V68Z" fill="white" />
          <path d="M84 68H80V72H84V68Z" fill="white" />
          <path d="M80 68H76V72H80V68Z" fill={forceColor ?? '#616777'} />
          <path d="M76 68H72V72H76V68Z" fill={forceColor ?? '#616777'} />
          <path d="M72 68H68V72H72V68Z" fill={forceColor ?? '#616777'} />
          <path d="M68 68H64V72H68V68Z" fill={forceColor ?? '#616777'} />
          <path d="M64 68H60V72H64V68Z" fill={forceColor ?? '#616777'} />
          <path d="M60 68H56V72H60V68Z" fill={forceColor ?? '#616777'} />
          <path d="M56 68H52V72H56V68Z" fill={forceColor ?? '#616777'} />
          <path d="M52 68H48V72H52V68Z" fill={forceColor ?? '#616777'} />
          <path d="M48 68H44V72H48V68Z" fill="white" />
          <path d="M44 68H40V72H44V68Z" fill="white" />
          <path d="M40 68H36V72H40V68Z" fill={forceColor ?? '#E4E5E8'} />
          <path d="M36 68H32V72H36V68Z" fill={forceColor ?? '#717685'} />
          <path d="M32 68H28V72H32V68Z" fill={forceColor ?? '#616777'} />
          <path d="M28 68H24V72H28V68Z" fill={forceColor ?? '#717685'} />
          <path d="M24 68H20V72H24V68Z" fill={forceColor ?? '#C8CAD0'} />
          <path d="M20 68H16V72H20V68Z" fill={forceColor ?? '#616777'} />
          <path d="M16 68H12V72H16V68Z" fill={forceColor ?? '#616777'} />
          <path d="M12 68H8V72H12V68Z" fill={forceColor ?? '#616777'} />
          <path d="M8 68H4V72H8V68Z" fill={forceColor ?? '#595F6E'} />
          <path d="M4 68H0V72H4V68Z" fill={forceColor ?? '#B0B4C3'} />
          <path d="M128 64H124V68H128V64Z" fill={forceColor ?? '#9194A3'} />
          <path d="M124 64H120V68H124V64Z" fill={forceColor ?? '#656B7B'} />
          <path d="M120 64H116V68H120V64Z" fill={forceColor ?? '#7F8491'} />
          <path d="M116 64H112V68H116V64Z" fill={forceColor ?? '#C5C7CD'} />
          <path d="M112 64H108V68H112V64Z" fill={forceColor ?? '#E2E3E6'} />
          <path d="M108 64H104V68H108V64Z" fill={forceColor ?? '#F4F4F5'} />
          <path d="M104 64H100V68H104V64Z" fill="white" />
          <path d="M100 64H96V68H100V64Z" fill="white" />
          <path d="M96 64H92V68H96V64Z" fill="white" />
          <path d="M92 64H88V68H92V64Z" fill="white" />
          <path d="M88 64H84V68H88V64Z" fill={forceColor ?? '#EBECEE'} />
          <path d="M84 64H80V68H84V64Z" fill={forceColor ?? '#757A88'} />
          <path d="M80 64H76V68H80V64Z" fill={forceColor ?? '#656B7B'} />
          <path d="M76 64H72V68H76V64Z" fill={forceColor ?? '#656B7B'} />
          <path d="M72 64H68V68H72V64Z" fill={forceColor ?? '#656B7B'} />
          <path d="M68 64H64V68H68V64Z" fill={forceColor ?? '#656B7B'} />
          <path d="M64 64H60V68H64V64Z" fill={forceColor ?? '#656B7B'} />
          <path d="M60 64H56V68H60V64Z" fill={forceColor ?? '#656B7B'} />
          <path d="M56 64H52V68H56V64Z" fill={forceColor ?? '#656B7B'} />
          <path d="M52 64H48V68H52V64Z" fill={forceColor ?? '#B7BAC1'} />
          <path d="M48 64H44V68H48V64Z" fill={forceColor ?? '#656B7B'} />
          <path d="M44 64H40V68H44V64Z" fill="white" />
          <path d="M40 64H36V68H40V64Z" fill="white" />
          <path d="M36 64H32V68H36V64Z" fill={forceColor ?? '#EFEFF1'} />
          <path d="M32 64H28V68H32V64Z" fill={forceColor ?? '#D5D7DB'} />
          <path d="M28 64H24V68H28V64Z" fill={forceColor ?? '#E4E5E8'} />
          <path d="M24 64H20V68H24V64Z" fill={forceColor ?? '#656B7B'} />
          <path d="M20 64H16V68H20V64Z" fill={forceColor ?? '#656B7B'} />
          <path d="M16 64H12V68H16V64Z" fill={forceColor ?? '#656B7B'} />
          <path d="M12 64H8V68H12V64Z" fill={forceColor ?? '#656B7B'} />
          <path d="M8 64H4V68H8V64Z" fill={forceColor ?? '#5D6371'} />
          <path d="M4 64H0V68H4V64Z" fill={forceColor ?? '#B2B6C6'} />
          <path d="M128 60H124V64H128V60Z" fill={forceColor ?? '#9497A6'} />
          <path d="M124 60H120V64H124V60Z" fill={forceColor ?? '#696F7F'} />
          <path d="M120 60H116V64H120V60Z" fill={forceColor ?? '#696F7F'} />
          <path d="M116 60H112V64H116V60Z" fill={forceColor ?? '#696F7F'} />
          <path d="M112 60H108V64H112V60Z" fill={forceColor ?? '#7B818F'} />
          <path d="M108 60H104V64H108V60Z" fill={forceColor ?? '#CBCDD2'} />
          <path d="M104 60H100V64H104V60Z" fill={forceColor ?? '#E7E8EA'} />
          <path d="M100 60H96V64H100V60Z" fill={forceColor ?? '#F7F8F8'} />
          <path d="M96 60H92V64H96V60Z" fill="white" />
          <path d="M92 60H88V64H92V60Z" fill="white" />
          <path d="M88 60H84V64H88V60Z" fill="white" />
          <path d="M84 60H80V64H84V60Z" fill={forceColor ?? '#F9F9FA'} />
          <path d="M80 60H76V64H80V60Z" fill={forceColor ?? '#696F7F'} />
          <path d="M76 60H72V64H76V60Z" fill={forceColor ?? '#696F7F'} />
          <path d="M72 60H68V64H72V60Z" fill={forceColor ?? '#696F7F'} />
          <path d="M68 60H64V64H68V60Z" fill={forceColor ?? '#696F7F'} />
          <path d="M64 60H60V64H64V60Z" fill={forceColor ?? '#696F7F'} />
          <path d="M60 60H56V64H60V60Z" fill={forceColor ?? '#696F7F'} />
          <path d="M56 60H52V64H56V60Z" fill={forceColor ?? '#696F7F'} />
          <path d="M52 60H48V64H52V60Z" fill="white" />
          <path d="M48 60H44V64H48V60Z" fill={forceColor ?? '#696F7F'} />
          <path d="M44 60H40V64H44V60Z" fill={forceColor ?? '#696F7F'} />
          <path d="M40 60H36V64H40V60Z" fill="white" />
          <path d="M36 60H32V64H36V60Z" fill="white" />
          <path d="M32 60H28V64H32V60Z" fill={forceColor ?? '#FEFEFE'} />
          <path d="M28 60H24V64H28V60Z" fill={forceColor ?? '#696F7F'} />
          <path d="M24 60H20V64H24V60Z" fill={forceColor ?? '#696F7F'} />
          <path d="M20 60H16V64H20V60Z" fill={forceColor ?? '#696F7F'} />
          <path d="M16 60H12V64H16V60Z" fill={forceColor ?? '#696F7F'} />
          <path d="M12 60H8V64H12V60Z" fill={forceColor ?? '#696F7F'} />
          <path d="M8 60H4V64H8V60Z" fill={forceColor ?? '#616675'} />
          <path d="M4 60H0V64H4V60Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M128 56H124V60H128V56Z" fill={forceColor ?? '#989AA9'} />
          <path d="M124 56H120V60H124V56Z" fill={forceColor ?? '#6D7384'} />
          <path d="M120 56H116V60H120V56Z" fill={forceColor ?? '#6D7384'} />
          <path d="M116 56H112V60H116V56Z" fill={forceColor ?? '#6D7384'} />
          <path d="M112 56H108V60H112V56Z" fill={forceColor ?? '#6D7384'} />
          <path d="M108 56H104V60H108V56Z" fill={forceColor ?? '#6D7384'} />
          <path d="M104 56H100V60H104V56Z" fill={forceColor ?? '#6D7384'} />
          <path d="M100 56H96V60H100V56Z" fill={forceColor ?? '#E2E4E7'} />
          <path d="M96 56H92V60H96V56Z" fill={forceColor ?? '#F1F1F3'} />
          <path d="M92 56H88V60H92V56Z" fill="white" />
          <path d="M88 56H84V60H88V56Z" fill="white" />
          <path d="M84 56H80V60H84V56Z" fill="white" />
          <path d="M80 56H76V60H80V56Z" fill={forceColor ?? '#7A808F'} />
          <path d="M76 56H72V60H76V56Z" fill={forceColor ?? '#6D7384'} />
          <path d="M72 56H68V60H72V56Z" fill={forceColor ?? '#6D7384'} />
          <path d="M68 56H64V60H68V56Z" fill={forceColor ?? '#6D7384'} />
          <path d="M64 56H60V60H64V56Z" fill={forceColor ?? '#6D7384'} />
          <path d="M60 56H56V60H60V56Z" fill={forceColor ?? '#6D7384'} />
          <path d="M56 56H52V60H56V56Z" fill={forceColor ?? '#CDCFD5'} />
          <path d="M52 56H48V60H52V56Z" fill={forceColor ?? '#6D7384'} />
          <path d="M48 56H44V60H48V56Z" fill={forceColor ?? '#6D7384'} />
          <path d="M44 56H40V60H44V56Z" fill={forceColor ?? '#6D7384'} />
          <path d="M40 56H36V60H40V56Z" fill={forceColor ?? '#6D7384'} />
          <path d="M36 56H32V60H36V56Z" fill="white" />
          <path d="M32 56H28V60H32V56Z" fill={forceColor ?? '#6D7384'} />
          <path d="M28 56H24V60H28V56Z" fill={forceColor ?? '#6D7384'} />
          <path d="M24 56H20V60H24V56Z" fill={forceColor ?? '#6D7384'} />
          <path d="M20 56H16V60H20V56Z" fill={forceColor ?? '#6D7384'} />
          <path d="M16 56H12V60H16V56Z" fill={forceColor ?? '#6D7384'} />
          <path d="M12 56H8V60H12V56Z" fill={forceColor ?? '#6D7384'} />
          <path d="M8 56H4V60H8V56Z" fill={forceColor ?? '#646A7A'} />
          <path d="M4 56H0V60H4V56Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M128 52H124V56H128V52Z" fill={forceColor ?? '#9B9EAD'} />
          <path d="M124 52H120V56H124V52Z" fill={forceColor ?? '#717788'} />
          <path d="M120 52H116V56H120V52Z" fill={forceColor ?? '#717788'} />
          <path d="M116 52H112V56H116V52Z" fill={forceColor ?? '#717788'} />
          <path d="M112 52H108V56H112V52Z" fill={forceColor ?? '#717788'} />
          <path d="M108 52H104V56H108V52Z" fill={forceColor ?? '#717788'} />
          <path d="M104 52H100V56H104V52Z" fill={forceColor ?? '#717788'} />
          <path d="M100 52H96V56H100V52Z" fill={forceColor ?? '#717788'} />
          <path d="M96 52H92V56H96V52Z" fill={forceColor ?? '#717788'} />
          <path d="M92 52H88V56H92V52Z" fill={forceColor ?? '#F6F6F8'} />
          <path d="M88 52H84V56H88V52Z" fill="white" />
          <path d="M84 52H80V56H84V52Z" fill="white" />
          <path d="M80 52H76V56H80V52Z" fill="white" />
          <path d="M76 52H72V56H76V52Z" fill={forceColor ?? '#717788'} />
          <path d="M72 52H68V56H72V52Z" fill={forceColor ?? '#717788'} />
          <path d="M68 52H64V56H68V52Z" fill={forceColor ?? '#717788'} />
          <path d="M64 52H60V56H64V52Z" fill={forceColor ?? '#717788'} />
          <path d="M60 52H56V56H60V52Z" fill={forceColor ?? '#717788'} />
          <path d="M56 52H52V56H56V52Z" fill="white" />
          <path d="M52 52H48V56H52V52Z" fill={forceColor ?? '#717788'} />
          <path d="M48 52H44V56H48V52Z" fill={forceColor ?? '#717788'} />
          <path d="M44 52H40V56H44V52Z" fill={forceColor ?? '#717788'} />
          <path d="M40 52H36V56H40V52Z" fill={forceColor ?? '#717788'} />
          <path d="M36 52H32V56H36V52Z" fill={forceColor ?? '#717788'} />
          <path d="M32 52H28V56H32V52Z" fill={forceColor ?? '#717788'} />
          <path d="M28 52H24V56H28V52Z" fill={forceColor ?? '#717788'} />
          <path d="M24 52H20V56H24V52Z" fill={forceColor ?? '#717788'} />
          <path d="M20 52H16V56H20V52Z" fill={forceColor ?? '#717788'} />
          <path d="M16 52H12V56H16V52Z" fill={forceColor ?? '#717788'} />
          <path d="M12 52H8V56H12V52Z" fill={forceColor ?? '#717788'} />
          <path d="M8 52H4V56H8V52Z" fill={forceColor ?? '#686E7D'} />
          <path d="M4 52H0V56H4V52Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M128 48H124V52H128V48Z" fill={forceColor ?? '#9EA1B0'} />
          <path d="M124 48H120V52H124V48Z" fill={forceColor ?? '#747B8C'} />
          <path d="M120 48H116V52H120V48Z" fill={forceColor ?? '#747B8C'} />
          <path d="M116 48H112V52H116V48Z" fill={forceColor ?? '#747B8C'} />
          <path d="M112 48H108V52H112V48Z" fill={forceColor ?? '#747B8C'} />
          <path d="M108 48H104V52H108V48Z" fill={forceColor ?? '#747B8C'} />
          <path d="M104 48H100V52H104V48Z" fill={forceColor ?? '#747B8C'} />
          <path d="M100 48H96V52H100V48Z" fill={forceColor ?? '#747B8C'} />
          <path d="M96 48H92V52H96V48Z" fill={forceColor ?? '#747B8C'} />
          <path d="M92 48H88V52H92V48Z" fill={forceColor ?? '#747B8C'} />
          <path d="M88 48H84V52H88V48Z" fill={forceColor ?? '#FEFEFF'} />
          <path d="M84 48H80V52H84V48Z" fill="white" />
          <path d="M80 48H76V52H80V48Z" fill="white" />
          <path d="M76 48H72V52H76V48Z" fill={forceColor ?? '#898F9E'} />
          <path d="M72 48H68V52H72V48Z" fill={forceColor ?? '#747B8C'} />
          <path d="M68 48H64V52H68V48Z" fill={forceColor ?? '#747B8C'} />
          <path d="M64 48H60V52H64V48Z" fill={forceColor ?? '#747B8C'} />
          <path d="M60 48H56V52H60V48Z" fill={forceColor ?? '#D0D2D8'} />
          <path d="M56 48H52V52H56V48Z" fill={forceColor ?? '#747B8C'} />
          <path d="M52 48H48V52H52V48Z" fill={forceColor ?? '#747B8C'} />
          <path d="M48 48H44V52H48V48Z" fill={forceColor ?? '#747B8C'} />
          <path d="M44 48H40V52H44V48Z" fill={forceColor ?? '#747B8C'} />
          <path d="M40 48H36V52H40V48Z" fill={forceColor ?? '#747B8C'} />
          <path d="M36 48H32V52H36V48Z" fill={forceColor ?? '#747B8C'} />
          <path d="M32 48H28V52H32V48Z" fill={forceColor ?? '#747B8C'} />
          <path d="M28 48H24V52H28V48Z" fill={forceColor ?? '#747B8C'} />
          <path d="M24 48H20V52H24V48Z" fill={forceColor ?? '#747B8C'} />
          <path d="M20 48H16V52H20V48Z" fill={forceColor ?? '#747B8C'} />
          <path d="M16 48H12V52H16V48Z" fill={forceColor ?? '#747B8C'} />
          <path d="M12 48H8V52H12V48Z" fill={forceColor ?? '#6B7181'} />
          <path d="M8 48H4V52H8V48Z" fill={forceColor ?? '#6B7181'} />
          <path d="M4 48H0V52H4V48Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M124 44H120V48H124V44Z" fill={forceColor ?? '#A3A6B5'} />
          <path d="M120 44H116V48H120V44Z" fill={forceColor ?? '#787E8F'} />
          <path d="M116 44H112V48H116V44Z" fill={forceColor ?? '#787E8F'} />
          <path d="M112 44H108V48H112V44Z" fill={forceColor ?? '#787E8F'} />
          <path d="M108 44H104V48H108V44Z" fill={forceColor ?? '#787E8F'} />
          <path d="M104 44H100V48H104V44Z" fill={forceColor ?? '#787E8F'} />
          <path d="M100 44H96V48H100V44Z" fill={forceColor ?? '#787E8F'} />
          <path d="M96 44H92V48H96V44Z" fill={forceColor ?? '#787E8F'} />
          <path d="M92 44H88V48H92V44Z" fill={forceColor ?? '#787E8F'} />
          <path d="M88 44H84V48H88V44Z" fill={forceColor ?? '#F0F1F3'} />
          <path d="M84 44H80V48H84V44Z" fill="white" />
          <path d="M80 44H76V48H80V44Z" fill="white" />
          <path d="M76 44H72V48H76V44Z" fill="white" />
          <path d="M72 44H68V48H72V44Z" fill={forceColor ?? '#787E8F'} />
          <path d="M68 44H64V48H68V44Z" fill={forceColor ?? '#787E8F'} />
          <path d="M64 44H60V48H64V44Z" fill={forceColor ?? '#787E8F'} />
          <path d="M60 44H56V48H60V44Z" fill="white" />
          <path d="M56 44H52V48H56V44Z" fill={forceColor ?? '#787E8F'} />
          <path d="M52 44H48V48H52V44Z" fill={forceColor ?? '#787E8F'} />
          <path d="M48 44H44V48H48V44Z" fill={forceColor ?? '#787E8F'} />
          <path d="M44 44H40V48H44V44Z" fill={forceColor ?? '#787E8F'} />
          <path d="M40 44H36V48H40V44Z" fill={forceColor ?? '#787E8F'} />
          <path d="M36 44H32V48H36V44Z" fill={forceColor ?? '#787E8F'} />
          <path d="M32 44H28V48H32V44Z" fill={forceColor ?? '#787E8F'} />
          <path d="M28 44H24V48H28V44Z" fill={forceColor ?? '#787E8F'} />
          <path d="M24 44H20V48H24V44Z" fill={forceColor ?? '#787E8F'} />
          <path d="M20 44H16V48H20V44Z" fill={forceColor ?? '#787E8F'} />
          <path d="M16 44H12V48H16V44Z" fill={forceColor ?? '#787E8F'} />
          <path d="M12 44H8V48H12V44Z" fill={forceColor ?? '#6F7484'} />
          <path d="M8 44H4V48H8V44Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M124 40H120V44H124V40Z" fill={forceColor ?? '#A6A9B8'} />
          <path d="M120 40H116V44H120V40Z" fill={forceColor ?? '#7A8092'} />
          <path d="M116 40H112V44H116V40Z" fill={forceColor ?? '#7A8092'} />
          <path d="M112 40H108V44H112V40Z" fill={forceColor ?? '#7A8092'} />
          <path d="M108 40H104V44H108V40Z" fill={forceColor ?? '#7A8092'} />
          <path d="M104 40H100V44H104V40Z" fill={forceColor ?? '#7A8092'} />
          <path d="M100 40H96V44H100V40Z" fill={forceColor ?? '#7A8092'} />
          <path d="M96 40H92V44H96V40Z" fill={forceColor ?? '#7A8092'} />
          <path d="M92 40H88V44H92V40Z" fill={forceColor ?? '#7A8092'} />
          <path d="M88 40H84V44H88V40Z" fill={forceColor ?? '#7A8092'} />
          <path d="M84 40H80V44H84V40Z" fill={forceColor ?? '#EDEEF0'} />
          <path d="M80 40H76V44H80V40Z" fill={forceColor ?? '#FEFFFF'} />
          <path d="M76 40H72V44H76V40Z" fill="white" />
          <path d="M72 40H68V44H72V40Z" fill={forceColor ?? '#9196A5'} />
          <path d="M68 40H64V44H68V40Z" fill={forceColor ?? '#7A8092'} />
          <path d="M64 40H60V44H64V40Z" fill={forceColor ?? '#D2D4DA'} />
          <path d="M60 40H56V44H60V40Z" fill={forceColor ?? '#7A8092'} />
          <path d="M56 40H52V44H56V40Z" fill={forceColor ?? '#7A8092'} />
          <path d="M52 40H48V44H52V40Z" fill={forceColor ?? '#7A8092'} />
          <path d="M48 40H44V44H48V40Z" fill={forceColor ?? '#7A8092'} />
          <path d="M44 40H40V44H44V40Z" fill={forceColor ?? '#7A8092'} />
          <path d="M40 40H36V44H40V40Z" fill={forceColor ?? '#7A8092'} />
          <path d="M36 40H32V44H36V40Z" fill={forceColor ?? '#7A8092'} />
          <path d="M32 40H28V44H32V40Z" fill={forceColor ?? '#7A8092'} />
          <path d="M28 40H24V44H28V40Z" fill={forceColor ?? '#7A8092'} />
          <path d="M24 40H20V44H24V40Z" fill={forceColor ?? '#7A8092'} />
          <path d="M20 40H16V44H20V40Z" fill={forceColor ?? '#7A8092'} />
          <path d="M16 40H12V44H16V40Z" fill={forceColor ?? '#7A8092'} />
          <path d="M12 40H8V44H12V40Z" fill={forceColor ?? '#707687'} />
          <path d="M8 40H4V44H8V40Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M124 36H120V40H124V36Z" fill={forceColor ?? '#A9ADBC'} />
          <path d="M120 36H116V40H120V36Z" fill={forceColor ?? '#7C8294'} />
          <path d="M116 36H112V40H116V36Z" fill={forceColor ?? '#7C8294'} />
          <path d="M112 36H108V40H112V36Z" fill={forceColor ?? '#7C8294'} />
          <path d="M108 36H104V40H108V36Z" fill={forceColor ?? '#7C8294'} />
          <path d="M104 36H100V40H104V36Z" fill={forceColor ?? '#7C8294'} />
          <path d="M100 36H96V40H100V36Z" fill={forceColor ?? '#7C8294'} />
          <path d="M96 36H92V40H96V36Z" fill={forceColor ?? '#7C8294'} />
          <path d="M92 36H88V40H92V36Z" fill={forceColor ?? '#7C8294'} />
          <path d="M88 36H84V40H88V36Z" fill={forceColor ?? '#7C8294'} />
          <path d="M84 36H80V40H84V36Z" fill={forceColor ?? '#7C8294'} />
          <path d="M80 36H76V40H80V36Z" fill={forceColor ?? '#EFF0F2'} />
          <path d="M76 36H72V40H76V36Z" fill="white" />
          <path d="M72 36H68V40H72V36Z" fill="white" />
          <path d="M68 36H64V40H68V36Z" fill={forceColor ?? '#7C8294'} />
          <path d="M64 36H60V40H64V36Z" fill="white" />
          <path d="M60 36H56V40H60V36Z" fill={forceColor ?? '#7C8294'} />
          <path d="M56 36H52V40H56V36Z" fill={forceColor ?? '#7C8294'} />
          <path d="M52 36H48V40H52V36Z" fill={forceColor ?? '#7C8294'} />
          <path d="M48 36H44V40H48V36Z" fill={forceColor ?? '#7C8294'} />
          <path d="M44 36H40V40H44V36Z" fill={forceColor ?? '#7C8294'} />
          <path d="M40 36H36V40H40V36Z" fill={forceColor ?? '#7C8294'} />
          <path d="M36 36H32V40H36V36Z" fill={forceColor ?? '#7C8294'} />
          <path d="M32 36H28V40H32V36Z" fill={forceColor ?? '#7C8294'} />
          <path d="M28 36H24V40H28V36Z" fill={forceColor ?? '#7C8294'} />
          <path d="M24 36H20V40H24V36Z" fill={forceColor ?? '#7C8294'} />
          <path d="M20 36H16V40H20V36Z" fill={forceColor ?? '#7C8294'} />
          <path d="M16 36H12V40H16V36Z" fill={forceColor ?? '#727888'} />
          <path d="M12 36H8V40H12V36Z" fill={forceColor ?? '#727888'} />
          <path d="M8 36H4V40H8V36Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M120 32H116V36H120V32Z" fill={forceColor ?? '#ADB1C0'} />
          <path d="M116 32H112V36H116V32Z" fill={forceColor ?? '#7C8394'} />
          <path d="M112 32H108V36H112V32Z" fill={forceColor ?? '#7C8394'} />
          <path d="M108 32H104V36H108V32Z" fill={forceColor ?? '#7C8394'} />
          <path d="M104 32H100V36H104V32Z" fill={forceColor ?? '#7C8394'} />
          <path d="M100 32H96V36H100V32Z" fill={forceColor ?? '#7C8394'} />
          <path d="M96 32H92V36H96V32Z" fill={forceColor ?? '#7C8394'} />
          <path d="M92 32H88V36H92V32Z" fill={forceColor ?? '#7C8394'} />
          <path d="M88 32H84V36H88V32Z" fill={forceColor ?? '#7C8394'} />
          <path d="M84 32H80V36H84V32Z" fill={forceColor ?? '#7C8394'} />
          <path d="M80 32H76V36H80V32Z" fill={forceColor ?? '#7C8394'} />
          <path d="M76 32H72V36H76V32Z" fill={forceColor ?? '#E8E9EC'} />
          <path d="M72 32H68V36H72V32Z" fill="white" />
          <path d="M68 32H64V36H68V32Z" fill="white" />
          <path d="M64 32H60V36H64V32Z" fill={forceColor ?? '#7C8394'} />
          <path d="M60 32H56V36H60V32Z" fill={forceColor ?? '#7C8394'} />
          <path d="M56 32H52V36H56V32Z" fill={forceColor ?? '#7C8394'} />
          <path d="M52 32H48V36H52V32Z" fill={forceColor ?? '#7C8394'} />
          <path d="M48 32H44V36H48V32Z" fill={forceColor ?? '#7C8394'} />
          <path d="M44 32H40V36H44V32Z" fill={forceColor ?? '#7C8394'} />
          <path d="M40 32H36V36H40V32Z" fill={forceColor ?? '#7C8394'} />
          <path d="M36 32H32V36H36V32Z" fill={forceColor ?? '#7C8394'} />
          <path d="M32 32H28V36H32V32Z" fill={forceColor ?? '#7C8394'} />
          <path d="M28 32H24V36H28V32Z" fill={forceColor ?? '#7C8394'} />
          <path d="M24 32H20V36H24V32Z" fill={forceColor ?? '#7C8394'} />
          <path d="M20 32H16V36H20V32Z" fill={forceColor ?? '#7C8394'} />
          <path d="M16 32H12V36H16V32Z" fill={forceColor ?? '#727988'} />
          <path d="M12 32H8V36H12V32Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M120 28H116V32H120V28Z" fill={forceColor ?? '#B0B4C3'} />
          <path d="M116 28H112V32H116V28Z" fill={forceColor ?? '#7C8394'} />
          <path d="M112 28H108V32H112V28Z" fill={forceColor ?? '#7C8394'} />
          <path d="M108 28H104V32H108V28Z" fill={forceColor ?? '#7C8394'} />
          <path d="M104 28H100V32H104V28Z" fill={forceColor ?? '#7C8394'} />
          <path d="M100 28H96V32H100V28Z" fill={forceColor ?? '#7C8394'} />
          <path d="M96 28H92V32H96V28Z" fill={forceColor ?? '#7C8394'} />
          <path d="M92 28H88V32H92V28Z" fill={forceColor ?? '#7C8394'} />
          <path d="M88 28H84V32H88V28Z" fill={forceColor ?? '#7C8394'} />
          <path d="M84 28H80V32H84V28Z" fill={forceColor ?? '#7C8394'} />
          <path d="M80 28H76V32H80V28Z" fill={forceColor ?? '#7C8394'} />
          <path d="M76 28H72V32H76V28Z" fill={forceColor ?? '#7C8394'} />
          <path d="M72 28H68V32H72V28Z" fill={forceColor ?? '#EAECEE'} />
          <path d="M68 28H64V32H68V28Z" fill="white" />
          <path d="M64 28H60V32H64V28Z" fill={forceColor ?? '#7C8394'} />
          <path d="M60 28H56V32H60V28Z" fill={forceColor ?? '#7C8394'} />
          <path d="M56 28H52V32H56V28Z" fill={forceColor ?? '#7C8394'} />
          <path d="M52 28H48V32H52V28Z" fill={forceColor ?? '#7C8394'} />
          <path d="M48 28H44V32H48V28Z" fill={forceColor ?? '#7C8394'} />
          <path d="M44 28H40V32H44V28Z" fill={forceColor ?? '#7C8394'} />
          <path d="M40 28H36V32H40V28Z" fill={forceColor ?? '#7C8394'} />
          <path d="M36 28H32V32H36V28Z" fill={forceColor ?? '#7C8394'} />
          <path d="M32 28H28V32H32V28Z" fill={forceColor ?? '#7C8394'} />
          <path d="M28 28H24V32H28V28Z" fill={forceColor ?? '#7C8394'} />
          <path d="M24 28H20V32H24V28Z" fill={forceColor ?? '#7C8394'} />
          <path d="M20 28H16V32H20V28Z" fill={forceColor ?? '#727988'} />
          <path d="M16 28H12V32H16V28Z" fill={forceColor ?? '#727988'} />
          <path d="M12 28H8V32H12V28Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M116 24H112V28H116V24Z" fill={forceColor ?? '#B3B7C6'} />
          <path d="M112 24H108V28H112V24Z" fill={forceColor ?? '#7B8192'} />
          <path d="M108 24H104V28H108V24Z" fill={forceColor ?? '#7B8192'} />
          <path d="M104 24H100V28H104V24Z" fill={forceColor ?? '#7B8192'} />
          <path d="M100 24H96V28H100V24Z" fill={forceColor ?? '#7B8192'} />
          <path d="M96 24H92V28H96V24Z" fill={forceColor ?? '#7B8192'} />
          <path d="M92 24H88V28H92V24Z" fill={forceColor ?? '#7B8192'} />
          <path d="M88 24H84V28H88V24Z" fill={forceColor ?? '#7B8192'} />
          <path d="M84 24H80V28H84V24Z" fill={forceColor ?? '#7B8192'} />
          <path d="M80 24H76V28H80V24Z" fill={forceColor ?? '#7B8192'} />
          <path d="M76 24H72V28H76V24Z" fill={forceColor ?? '#7B8192'} />
          <path d="M72 24H68V28H72V24Z" fill={forceColor ?? '#7B8192'} />
          <path d="M68 24H64V28H68V24Z" fill={forceColor ?? '#7B8192'} />
          <path d="M64 24H60V28H64V24Z" fill={forceColor ?? '#7B8192'} />
          <path d="M60 24H56V28H60V24Z" fill={forceColor ?? '#7B8192'} />
          <path d="M56 24H52V28H56V24Z" fill={forceColor ?? '#7B8192'} />
          <path d="M52 24H48V28H52V24Z" fill={forceColor ?? '#7B8192'} />
          <path d="M48 24H44V28H48V24Z" fill={forceColor ?? '#7B8192'} />
          <path d="M44 24H40V28H44V24Z" fill={forceColor ?? '#7B8192'} />
          <path d="M40 24H36V28H40V24Z" fill={forceColor ?? '#7B8192'} />
          <path d="M36 24H32V28H36V24Z" fill={forceColor ?? '#7B8192'} />
          <path d="M32 24H28V28H32V24Z" fill={forceColor ?? '#7B8192'} />
          <path d="M28 24H24V28H28V24Z" fill={forceColor ?? '#7B8192'} />
          <path d="M24 24H20V28H24V24Z" fill={forceColor ?? '#717787'} />
          <path d="M20 24H16V28H20V24Z" fill={forceColor ?? '#717787'} />
          <path d="M16 24H12V28H16V24Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M112 20H108V24H112V20Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M108 20H104V24H108V20Z" fill={forceColor ?? '#797F8F'} />
          <path d="M104 20H100V24H104V20Z" fill={forceColor ?? '#797F8F'} />
          <path d="M100 20H96V24H100V20Z" fill={forceColor ?? '#797F8F'} />
          <path d="M96 20H92V24H96V20Z" fill={forceColor ?? '#797F8F'} />
          <path d="M92 20H88V24H92V20Z" fill={forceColor ?? '#797F8F'} />
          <path d="M88 20H84V24H88V20Z" fill={forceColor ?? '#797F8F'} />
          <path d="M84 20H80V24H84V20Z" fill={forceColor ?? '#797F8F'} />
          <path d="M80 20H76V24H80V20Z" fill={forceColor ?? '#797F8F'} />
          <path d="M76 20H72V24H76V20Z" fill={forceColor ?? '#797F8F'} />
          <path d="M72 20H68V24H72V20Z" fill={forceColor ?? '#797F8F'} />
          <path d="M68 20H64V24H68V20Z" fill={forceColor ?? '#797F8F'} />
          <path d="M64 20H60V24H64V20Z" fill={forceColor ?? '#797F8F'} />
          <path d="M60 20H56V24H60V20Z" fill={forceColor ?? '#797F8F'} />
          <path d="M56 20H52V24H56V20Z" fill={forceColor ?? '#797F8F'} />
          <path d="M52 20H48V24H52V20Z" fill={forceColor ?? '#797F8F'} />
          <path d="M48 20H44V24H48V20Z" fill={forceColor ?? '#797F8F'} />
          <path d="M44 20H40V24H44V20Z" fill={forceColor ?? '#797F8F'} />
          <path d="M40 20H36V24H40V20Z" fill={forceColor ?? '#797F8F'} />
          <path d="M36 20H32V24H36V20Z" fill={forceColor ?? '#797F8F'} />
          <path d="M32 20H28V24H32V20Z" fill={forceColor ?? '#797F8F'} />
          <path d="M28 20H24V24H28V20Z" fill={forceColor ?? '#707584'} />
          <path d="M24 20H20V24H24V20Z" fill={forceColor ?? '#707584'} />
          <path d="M20 20H16V24H20V20Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M108 16H104V20H108V16Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M104 16H100V20H104V16Z" fill={forceColor ?? '#767C8D'} />
          <path d="M100 16H96V20H100V16Z" fill={forceColor ?? '#767C8D'} />
          <path d="M96 16H92V20H96V16Z" fill={forceColor ?? '#767C8D'} />
          <path d="M92 16H88V20H92V16Z" fill={forceColor ?? '#767C8D'} />
          <path d="M88 16H84V20H88V16Z" fill={forceColor ?? '#767C8D'} />
          <path d="M84 16H80V20H84V16Z" fill={forceColor ?? '#767C8D'} />
          <path d="M80 16H76V20H80V16Z" fill={forceColor ?? '#767C8D'} />
          <path d="M76 16H72V20H76V16Z" fill={forceColor ?? '#767C8D'} />
          <path d="M72 16H68V20H72V16Z" fill={forceColor ?? '#767C8D'} />
          <path d="M68 16H64V20H68V16Z" fill={forceColor ?? '#767C8D'} />
          <path d="M64 16H60V20H64V16Z" fill={forceColor ?? '#767C8D'} />
          <path d="M60 16H56V20H60V16Z" fill={forceColor ?? '#767C8D'} />
          <path d="M56 16H52V20H56V16Z" fill={forceColor ?? '#767C8D'} />
          <path d="M52 16H48V20H52V16Z" fill={forceColor ?? '#767C8D'} />
          <path d="M48 16H44V20H48V16Z" fill={forceColor ?? '#767C8D'} />
          <path d="M44 16H40V20H44V16Z" fill={forceColor ?? '#767C8D'} />
          <path d="M40 16H36V20H40V16Z" fill={forceColor ?? '#767C8D'} />
          <path d="M36 16H32V20H36V16Z" fill={forceColor ?? '#767C8D'} />
          <path d="M32 16H28V20H32V16Z" fill={forceColor ?? '#6D7282'} />
          <path d="M28 16H24V20H28V16Z" fill={forceColor ?? '#6D7282'} />
          <path d="M24 16H20V20H24V16Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M104 12H100V16H104V12Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M100 12H96V16H100V12Z" fill={forceColor ?? '#6B707F'} />
          <path d="M96 12H92V16H96V12Z" fill={forceColor ?? '#74798A'} />
          <path d="M92 12H88V16H92V12Z" fill={forceColor ?? '#74798A'} />
          <path d="M88 12H84V16H88V12Z" fill={forceColor ?? '#74798A'} />
          <path d="M84 12H80V16H84V12Z" fill={forceColor ?? '#74798A'} />
          <path d="M80 12H76V16H80V12Z" fill={forceColor ?? '#74798A'} />
          <path d="M76 12H72V16H76V12Z" fill={forceColor ?? '#74798A'} />
          <path d="M72 12H68V16H72V12Z" fill={forceColor ?? '#74798A'} />
          <path d="M68 12H64V16H68V12Z" fill={forceColor ?? '#74798A'} />
          <path d="M64 12H60V16H64V12Z" fill={forceColor ?? '#74798A'} />
          <path d="M60 12H56V16H60V12Z" fill={forceColor ?? '#74798A'} />
          <path d="M56 12H52V16H56V12Z" fill={forceColor ?? '#74798A'} />
          <path d="M52 12H48V16H52V12Z" fill={forceColor ?? '#74798A'} />
          <path d="M48 12H44V16H48V12Z" fill={forceColor ?? '#74798A'} />
          <path d="M44 12H40V16H44V12Z" fill={forceColor ?? '#74798A'} />
          <path d="M40 12H36V16H40V12Z" fill={forceColor ?? '#6B707F'} />
          <path d="M36 12H32V16H36V12Z" fill={forceColor ?? '#6B707F'} />
          <path d="M32 12H28V16H32V12Z" fill={forceColor ?? '#6B707F'} />
          <path d="M28 12H24V16H28V12Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M100 8H96V12H100V8Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M96 8H92V12H96V8Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M92 8H88V12H92V8Z" fill={forceColor ?? '#686E7C'} />
          <path d="M88 8H84V12H88V8Z" fill={forceColor ?? '#686E7C'} />
          <path d="M84 8H80V12H84V8Z" fill={forceColor ?? '#717787'} />
          <path d="M80 8H76V12H80V8Z" fill={forceColor ?? '#717787'} />
          <path d="M76 8H72V12H76V8Z" fill={forceColor ?? '#717787'} />
          <path d="M72 8H68V12H72V8Z" fill={forceColor ?? '#717787'} />
          <path d="M68 8H64V12H68V8Z" fill={forceColor ?? '#717787'} />
          <path d="M64 8H60V12H64V8Z" fill={forceColor ?? '#717787'} />
          <path d="M60 8H56V12H60V8Z" fill={forceColor ?? '#717787'} />
          <path d="M56 8H52V12H56V8Z" fill={forceColor ?? '#717787'} />
          <path d="M52 8H48V12H52V8Z" fill={forceColor ?? '#686E7C'} />
          <path d="M48 8H44V12H48V8Z" fill={forceColor ?? '#686E7C'} />
          <path d="M44 8H40V12H44V8Z" fill={forceColor ?? '#686E7C'} />
          <path d="M40 8H36V12H40V8Z" fill={forceColor ?? '#686E7C'} />
          <path d="M36 8H32V12H36V8Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M32 8H28V12H32V8Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M92 4H88V8H92V4Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M88 4H84V8H88V4Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M84 4H80V8H84V4Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M80 4H76V8H80V4Z" fill={forceColor ?? '#666C7B'} />
          <path d="M76 4H72V8H76V4Z" fill={forceColor ?? '#666C7B'} />
          <path d="M72 4H68V8H72V4Z" fill={forceColor ?? '#666C7B'} />
          <path d="M68 4H64V8H68V4Z" fill={forceColor ?? '#666C7B'} />
          <path d="M64 4H60V8H64V4Z" fill={forceColor ?? '#666C7B'} />
          <path d="M60 4H56V8H60V4Z" fill={forceColor ?? '#666C7B'} />
          <path d="M56 4H52V8H56V4Z" fill={forceColor ?? '#666C7B'} />
          <path d="M52 4H48V8H52V4Z" fill={forceColor ?? '#666C7B'} />
          <path d="M48 4H44V8H48V4Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M44 4H40V8H44V4Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M40 4H36V8H40V4Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M80 0H76V4H80V0Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M76 0H72V4H76V0Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M72 0H68V4H72V0Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M68 0H64V4H68V0Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M64 0H60V4H64V0Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M60 0H56V4H60V0Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M56 0H52V4H56V0Z" fill={forceColor ?? '#B3B8C7'} />
          <path d="M52 0H48V4H52V0Z" fill={forceColor ?? '#B3B8C7'} />
          <g opacity="0.4">
            <path d="M84 124H80V128H84V124Z" fill={forceColor ?? '#808290'} />
            <path d="M48 124H44V128H48V124Z" fill={forceColor ?? '#808290'} />
            <path d="M96 120H92V124H96V120Z" fill={forceColor ?? '#808290'} />
            <path d="M36 120H32V124H36V120Z" fill={forceColor ?? '#808290'} />
            <path d="M104 116H100V120H104V116Z" fill={forceColor ?? '#808290'} />
            <path d="M28 116H24V120H28V116Z" fill={forceColor ?? '#808290'} />
            <path d="M108 112H104V116H108V112Z" fill={forceColor ?? '#808290'} />
            <path d="M24 112H20V116H24V112Z" fill={forceColor ?? '#808290'} />
            <path d="M112 108H108V112H112V108Z" fill={forceColor ?? '#808290'} />
            <path d="M20 108H16V112H20V108Z" fill={forceColor ?? '#808290'} />
            <path d="M116 104H112V108H116V104Z" fill={forceColor ?? '#808290'} />
            <path d="M16 104H12V108H16V104Z" fill={forceColor ?? '#808290'} />
            <path d="M120 100H116V104H120V100Z" fill={forceColor ?? '#808290'} />
            <path d="M12 100H8V104H12V100Z" fill={forceColor ?? '#808290'} />
            <path d="M124 92H120V96H124V92Z" fill={forceColor ?? '#808290'} />
            <path d="M8 92H4V96H8V92Z" fill={forceColor ?? '#808290'} />
            <path d="M128 80H124V84H128V80Z" fill={forceColor ?? '#808290'} />
            <path d="M4 80H0V84H4V80Z" fill={forceColor ?? '#808290'} />
          </g>
          <g opacity="0.36">
            <path d="M128 44H124V48H128V44Z" fill={forceColor ?? '#B3B8C7'} />
            <path d="M124 32H120V36H124V32Z" fill={forceColor ?? '#B3B8C7'} />
            <path d="M4 44H0V48H4V44Z" fill={forceColor ?? '#B3B8C7'} />
            <path d="M8 32H4V36H8V32Z" fill={forceColor ?? '#B3B8C7'} />
            <path d="M120 24H116V28H120V24Z" fill={forceColor ?? '#B3B8C7'} />
            <path d="M12 24H8V28H12V24Z" fill={forceColor ?? '#B3B8C7'} />
            <path d="M116 20H112V24H116V20Z" fill={forceColor ?? '#B3B8C7'} />
            <path d="M16 20H12V24H16V20Z" fill={forceColor ?? '#B3B8C7'} />
            <path d="M112 16H108V20H112V16Z" fill={forceColor ?? '#B3B8C7'} />
            <path d="M20 16H16V20H20V16Z" fill={forceColor ?? '#B3B8C7'} />
            <path d="M108 12H104V16H108V12Z" fill={forceColor ?? '#B3B8C7'} />
            <path d="M24 12H20V16H24V12Z" fill={forceColor ?? '#B3B8C7'} />
            <path d="M104 8H100V12H104V8Z" fill={forceColor ?? '#B3B8C7'} />
            <path d="M28 8H24V12H28V8Z" fill={forceColor ?? '#B3B8C7'} />
            <path d="M96 4H92V8H96V4Z" fill={forceColor ?? '#B3B8C7'} />
            <path d="M36 4H32V8H36V4Z" fill={forceColor ?? '#B3B8C7'} />
            <path d="M84 0H80V4H84V0Z" fill={forceColor ?? '#B3B8C7'} />
            <path d="M48 0H44V4H48V0Z" fill={forceColor ?? '#B3B8C7'} />
          </g>
        </g>
      </g>
      <defs>
        <clipPath id="clip0_216_23463">
          <rect width="128" height="128" fill="white" />
        </clipPath>
        <clipPath id="clip1_216_23463">
          <rect width="128" height="128" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function DfxAssetIconFPS({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 310 310"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill={forceColor ? '#ffffff' : '#2668FC'} d="M31 41h248v229H31z" />
      <path
        fill={forceColor ?? '#000'}
        d="M46 26h218v15H46zM31 56v199H16V56zM294 56v199h-15V56zM31 41h15v15H31zM31 255h15v15H31zM82 178h16v16H82zM98 162h16v16H98zM114 146h16v16h-16zM130 130h16v16h-16zM146 114h16v16h-16zM162 130h16v16h-16zM178 114h16v16h-16zM194 98h16v16h-16zM210 82h16v16h-16z"
      />
      <path
        fill={forceColor ?? '#F46184'}
        d="M82 162h16v16H82zM98 146h16v16H98zM114 130h16v16h-16zM130 114h16v16h-16zM146 98h16v16h-16zM162 114h16v16h-16zM178 98h16v16h-16zM194 82h16v16h-16zM210 66h16v16h-16z"
      />
      <path
        fill={forceColor ?? '#000'}
        d="M82 146h16v16H82zM98 130h16v16H98zM114 114h16v16h-16zM130 98h16v16h-16zM146 82h16v16h-16zM162 98h16v16h-16zM178 82h16v16h-16zM194 66h16v16h-16zM226 66h16v16h-16zM210 50h16v16h-16zM264 41h15v15h-15zM264 255h15v15h-15zM46 270h218v15H46z"
      />
      <path
        fill={forceColor ?? '#fff'}
        d="M47 202h11v45H47zM58 202h22v11H58zM58 219h12v9H58zM80 219h19v9H80zM108 219h13v9h-13zM132 219h13v9h-13zM131 238h13v9h-13zM142 228h12v10h-12zM166 228h8v10h-8zM183 228h10v9h-10zM216 228h10v19h-10zM235 228h10v19h-10zM254 228h10v19h-10zM202 228h12v9h-12zM174 219h9v9h-9zM193 219h14v9h-14zM216 219h48v9h-48zM193 237h14v10h-14zM174 237h9v10h-9zM108 238h13v9h-13zM80 238h19v9H80zM80 228h8v10h-8zM154 202h12v45h-12zM99 228h9v10h-9zM120 228h11v10h-11z"
      />
    </svg>
  );
}

function DfxAssetIconYLD({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#yld-a)">
        <g clipPath="url(#yld-b)">
          <path
            fill={forceColor ?? '#104499'}
            d="M32 16c0 8.838-7.163 16-16 16S0 24.836 0 16 7.163 0 16 0s16 7.164 16 16"
          />
          <path
            fill="#fff"
            fillRule="evenodd"
            d="m20.716 10.531-6.74 5.99a4.6 4.6 0 0 1-2.717.875 4.642 4.642 0 0 1 0-9.284c2.31 0 3.486 1.307 4.064 2.386l-1.85 1.52c-.467-1.088-1.135-1.584-2.214-1.584a2.322 2.322 0 0 0 0 4.644c.541 0 1.176-.305 1.57-.617l6.144-5.518c1.88-1.483 3.626-1.247 4.695-.843l-2.255 1.86c-.222.17-.452.355-.697.571M11.192 21.47l6.74-5.99a4.6 4.6 0 0 1 2.716-.875 4.642 4.642 0 0 1 0 9.284c-2.311 0-3.487-1.307-4.064-2.385l1.85-1.521c.466 1.088 1.135 1.584 2.214 1.584a2.322 2.322 0 0 0 0-4.644c-.542 0-1.176.305-1.57.617l-6.142 5.518c-1.881 1.483-3.626 1.247-4.695.843l2.255-1.86c.222-.17.452-.355.696-.571"
            clipRule="evenodd"
          />
        </g>
      </g>
      <defs>
        <clipPath id="yld-a">
          <path fill="#fff" d="M0 0h137v32H0z" />
        </clipPath>
        <clipPath id="yld-b">
          <path fill="#fff" d="M0 0h32v32H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

function DfxAssetIconISLM({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#islm-a)">
        <path
          fill={forceColor ?? '#04D484'}
          fillRule="evenodd"
          d="M127.999 0c35.346 0 67.348 14.328 90.511 37.49 22.888 22.889 37.147 54.407 37.482 89.251v.073l.004.475.004.705-.008 1.179v.078c-.335 34.843-14.594 66.358-37.482 89.247-23.163 23.162-55.162 37.489-90.511 37.489-35.344 0-67.345-14.327-90.508-37.489C14.328 195.335 0 163.333 0 127.989c0-35.343 14.328-67.34 37.49-90.503C60.655 14.324 92.656 0 128 0Zm73.569 73.563c4.852 0 9.56.64 14.042 1.828-13.201-12.81-31.201-20.698-51.049-20.698-20.244 0-38.571 8.203-51.831 21.467-13.265 13.264-21.468 31.591-21.468 51.834 0 20.243 8.203 38.569 21.468 51.829 13.265 13.265 31.591 21.468 51.831 21.468 19.848 0 37.852-7.889 51.049-20.699a54.517 54.517 0 0 1-14.039 1.829c-15.028 0-28.638-6.093-38.485-15.943-9.85-9.85-15.942-23.46-15.942-38.489 0-15.027 6.092-28.638 15.942-38.488 9.843-9.842 23.449-15.939 38.482-15.939Zm25.659 28.771c-6.568-6.564-15.64-10.627-25.663-10.627s-19.095 4.063-25.663 10.627c-6.568 6.568-10.628 15.641-10.628 25.664 0 10.023 4.063 19.095 10.628 25.663 6.568 6.564 15.64 10.626 25.663 10.626s19.095-4.062 25.663-10.626c6.564-6.568 10.628-15.64 10.628-25.663l-.005-.467c-.12-9.843-4.16-18.733-10.623-25.197Zm-62.67-65.782c11.399 0 22.309 2.086 32.376 5.9-18.85-15.206-42.83-24.311-68.934-24.311-30.334 0-57.802 12.298-77.683 32.175-19.877 19.876-32.175 47.343-32.175 77.678 0 30.338 12.295 57.801 32.175 77.682 19.881 19.877 47.345 32.175 77.683 32.175 26.108 0 50.084-9.105 68.934-24.315-10.067 3.814-20.977 5.9-32.376 5.9-25.25 0-48.115-10.237-64.657-26.783-16.546-16.547-26.783-39.407-26.783-64.655 0-25.249 10.237-48.113 26.782-64.66 16.543-16.55 39.408-26.786 64.658-26.786Z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="islm-a">
          <path fill="#fff" d="M0 0h256v256H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

function DfxAssetIconMKX({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 1125 1125"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={forceColor ?? '#000000'}
        fillRule="evenodd"
        d="M579 304.04c-11.898 2.752-16.042 4.538-25.512 10.994-18.328 12.494-29.699 46.19-21.149 62.666.914 1.761 1.661 4.081 1.661 5.158s1.064 4.136 2.365 6.8c1.301 2.663 2.867 5.967 3.48 7.342 2.491 5.593 11.011 19.214 12.405 19.833 1.538.684.674 3.136-1.5 4.258-23.032 11.887-44.493 34.187-48.992 50.909C485.5 532.433 547.66 579.678 614 557.309c6.287-2.12 27.354-13.155 29-15.191.484-.598 9.877-8.401 13.078-10.864 1.342-1.032 4.333 1.489 20 16.859 23.472 23.027 19.703 21.943 32.346 9.3 12.956-12.956 13.299-10.341-3.537-26.972-27.989-27.648-26.43-25.517-22.499-30.758 3.823-5.095 14.612-24.367 14.612-26.101 0-.87.45-1.582 1-1.582s1-.569 1-1.265c0-.695.868-2.884 1.929-4.864 4.23-7.892 1.276-16.839-5.573-16.876-.471-.002-2.219-1.24-3.884-2.75-3.282-2.975-10.183-8.402-12.266-9.645-1.858-1.109-6.206 2.056-6.206 4.519 0 1.14-.607 3.267-1.348 4.727-.742 1.46-2.141 4.454-3.11 6.654-.969 2.2-2.14 4.675-2.601 5.5-.462.825-2.377 4.425-4.257 8-8.614 16.383-6.359 16.681-26.074-3.456-36.485-37.268-35.315-35.312-24.473-40.947 4.05-2.105 8.038-4.405 8.863-5.112.825-.708 4.031-2.802 7.125-4.654 12.328-7.38 29.875-25.116 29.875-30.196 0-.834.396-1.762.88-2.061 6.709-4.146 6.006-35.219-1.066-47.074-.984-1.65-2.199-3.9-2.701-5-1.034-2.268-12.507-12.921-16.188-15.031-5.445-3.121-12.093-5.911-18.79-7.886-5.832-1.721-33.431-2.094-40.135-.543m-402.965 1.894c-1.591 2.972-1.429 252.272.165 253.866 1.879 1.879 39.159 1.678 40.734-.22.89-1.073 1.103-23.714.872-92.681-.168-50.194-.161-90.505.017-89.58.178.925.675 1.681 1.104 1.681.741 0 13.105 24.528 28.985 57.5 3.974 8.25 7.645 15.675 8.159 16.5.514.825 1.385 2.549 1.937 3.831 1.728 4.013 26.982 55.421 32.878 66.927.491.958 1.73 3.542 2.753 5.742 6.325 13.595 30.646 8.025 39.278-8.996 3.346-6.598 6.083-12.56 6.083-13.25 0-.69.45-1.254 1-1.254s1-.648 1-1.44c0-1.224 7.353-16.957 10.077-21.56.488-.825 1.844-3.525 3.013-6 1.864-3.944 15.482-31.668 40.649-82.75 8.754-17.769 9.257-18.121 9.274-6.5.104 69.409 1.421 170.99 2.23 172 1.395 1.741 37.82 1.787 39.557.05 1.594-1.594 1.756-250.894.165-253.866-1.333-2.49-49.792-3.053-51.826-.602-.608.733-2.641 4.446-4.518 8.25-1.876 3.805-11.82 24.018-22.098 44.918-10.277 20.9-19.832 40.25-21.233 43-3.713 7.288-6.568 13.035-21.237 42.75-7.262 14.712-13.508 26.742-13.879 26.731-.529-.014-26.108-50.954-51.963-103.481a3074.1 3074.1 0 0 0-5.444-11 792.153 792.153 0 0 1-5.108-10.5c-1.439-3.025-3.499-7.075-4.578-9-1.079-1.925-4.917-9.532-8.528-16.905-3.611-7.373-7.068-14.011-7.682-14.75-2.043-2.462-50.497-1.911-51.836.589m579.076-.568c-1.793 2.161-1.728 253.627.066 254.765 2.692 1.706 42.54 1.049 43.216-.713.334-.87.621-15.607.639-32.75l.032-31.168 7.218-7.718c3.97-4.245 9.018-9.823 11.218-12.396 13.568-15.866 24.464-25.995 25.291-23.512.213.639.934 1.716 1.602 2.394.667.678 5.909 7.532 11.648 15.232 5.739 7.7 11.002 14.595 11.697 15.321.694.727 1.269 1.627 1.278 2 .009.374 1.359 2.202 3 4.065 1.641 1.862 2.991 3.662 3 4 .009.337 1.246 2.031 2.75 3.762 1.504 1.731 3.409 4.145 4.234 5.363 1.273 1.88 4.911 6.806 7.746 10.489.423.55 1.523 2.174 2.443 3.61.92 1.435 2.281 3.235 3.023 4 1.85 1.905 9.944 12.72 12.254 16.374 1.037 1.64 2.932 4.111 4.21 5.489 1.278 1.379 2.324 2.78 2.324 3.114 0 .334.946 1.688 2.102 3.01 1.156 1.322 3.482 4.316 5.169 6.653l3.068 4.25h25.208c31.34 0 30.849.577 15.745-18.5-.436-.55-1.917-2.684-3.292-4.743-1.375-2.059-2.837-3.746-3.25-3.75-.413-.004-.75-.456-.75-1.004 0-.549-3.081-5.161-6.846-10.25s-7.362-10.23-7.993-11.425c-.631-1.195-1.714-2.77-2.406-3.5-.692-.73-2.382-3.012-3.756-5.071-1.375-2.059-2.836-3.746-3.249-3.75-.413-.004-.75-.439-.75-.967 0-.527-2.812-4.731-6.25-9.341-3.437-4.61-8.725-11.899-11.75-16.196-7.393-10.504-17.172-23.886-17.906-24.503-.326-.275-1.044-1.238-1.594-2.14-3.617-5.932-10.053-14.86-10.712-14.86-.433 0-.788-.476-.788-1.059 0-.981-5.632-8.784-7.191-9.964-1.411-1.067-3.715-6.419-2.987-6.939 1.044-.744 12.345-13.05 20.178-21.972 6.369-7.254 10.934-12.313 24-26.599 7.194-7.866 18.677-20.605 24.635-27.33 2.126-2.4 5.89-6.514 8.365-9.142 7.848-8.335 17.471-19.173 18.304-20.617 1.765-3.059-.604-3.378-25.046-3.378h-24.624l-5.567 5.793c-3.062 3.186-7.354 7.799-9.538 10.25-2.184 2.451-7.359 8.063-11.5 12.47-4.141 4.408-11.804 12.694-17.029 18.413-5.225 5.72-11.469 12.464-13.876 14.987-2.407 2.523-7.807 8.381-12 13.017-4.193 4.637-8.974 9.851-10.624 11.587-3.558 3.745-20.25 21.915-26.557 28.91C805.915 427.221 800.23 433 799.589 433c-.324 0-.589-28.155-.589-62.566 0-41.216-.353-63.226-1.035-64.5-1.344-2.511-40.807-3.035-42.854-.568m-178.725 1.623c-10.36 2.576-26.614 11.658-29.601 16.54-.394.643-2.419 3.242-4.5 5.776-10.546 12.836-13.258 36.63-6.12 53.695l2.298 5.5c4.299 10.297 8.771 18.213 14.494 25.658 4.079 5.307 3.085 6.906-8.646 13.908-5.879 3.509-11.841 7.458-13.25 8.777-1.409 1.318-4.113 3.58-6.009 5.027-3.857 2.942-10.052 8.924-10.052 9.705 0 .28-.878 1.451-1.95 2.602-1.073 1.151-2.66 3.495-3.528 5.208a233.259 233.259 0 0 1-2.394 4.615c-2.505 4.599-3.071 6.509-4.618 15.573-2.427 14.22-.788 26.128 5.495 39.927 1.252 2.75 3.338 6.432 4.636 8.183 1.297 1.751 2.359 3.417 2.359 3.703 0 .876 9.417 9.993 13.575 13.141 19.808 15.002 48.516 20.127 74.925 13.377 2.2-.562 5.125-1.255 6.5-1.539 1.375-.283 3.4-.907 4.5-1.386 10.062-4.377 12.065-5.316 12.5-5.858.275-.343 2.638-1.667 5.25-2.942 2.612-1.276 4.75-2.738 4.75-3.249 0-.512.48-.93 1.067-.93 1.067 0 7.549-4.438 9.433-6.458 1.927-2.067 9.296-7.542 10.144-7.537.471.003 9.406 8.328 19.856 18.499 22.378 21.783 18.449 20.55 29.476 9.246 11.221-11.501 12.382-8.14-10.555-30.548-20.389-19.919-21.178-21.062-17.07-24.727.632-.564 1.86-2.364 2.729-4 .869-1.636 4.132-7.378 7.25-12.76 3.119-5.382 5.67-10.39 5.67-11.128 0-.738.675-1.902 1.5-2.587.825-.685 1.503-1.752 1.506-2.372.004-.621.609-2.283 1.346-3.695 3.267-6.261 3.005-7.355-2.702-11.285-2.921-2.012-6.365-4.781-7.655-6.153-1.289-1.372-2.763-2.495-3.275-2.495s-2.268-1.125-3.902-2.5c-4.722-3.973-3.955-4.838-11.972 13.5-3.94 9.012-10.243 20.695-11.869 22-.342.275-.889 1.225-1.215 2.111-2.147 5.838-3.827 4.412-45.828-38.893-13.565-13.987-13.637-14.299-4.319-18.721 7.757-3.682 21.262-12.236 27.044-17.13 2.838-2.402 5.508-4.367 5.934-4.367.801 0 10.407-9.643 10.407-10.447 0-.249 1.35-2.453 3-4.898s3-5.077 3-5.85c0-.773.504-1.909 1.12-2.525 3.086-3.086 4.453-24.538 2.095-32.884-4.747-16.803-22.969-33.332-39.475-35.808-2.581-.387-4.955-1.128-5.276-1.646-1.059-1.713-30.2-.912-38.078 1.047m-161.812-.215c-20.94.32-19.024-.657-25.637 13.069-5.339 11.082-13.5 27.557-14.94 30.157-.456.825-7.417 15-15.467 31.5s-15.143 30.9-15.762 32c-1.026 1.823-4.338 8.522-13.1 26.5-1.742 3.575-3.505 6.65-3.918 6.833-.413.184-.75.827-.75 1.43 0 1.331-10.34 22.475-12.286 25.122-1.843 2.509-37.714-64.163-37.714-70.098 0-.573-.675-1.602-1.5-2.287-.825-.685-1.5-2.052-1.5-3.039 0-.987-.337-1.944-.75-2.128-.676-.3-6.633-11.983-16.742-32.833-3.681-7.592-4.701-9.589-6.51-12.75-.551-.962-2.832-5.575-5.07-10.25-2.238-4.675-6.833-14.012-10.212-20.75L226.574 307H177v252h38v-92.309c0-110.631-.858-104.692 11.445-79.191 3.185 6.6 12.545 25.725 20.802 42.5s19.494 39.725 24.971 51c5.477 11.275 10.355 21.175 10.839 22 .485.825 1.819 3.525 2.965 6s4.197 8.877 6.781 14.227l4.697 9.727 12.168.023c14.908.028 14.672.118 17.939-6.824 2.52-5.355 13.947-28.609 53.27-108.396C390.295 398.648 398 382.56 398 382.007c0-.554.45-1.007 1-1.007s1-.875 1-1.944c0-3.137 4.717-7.925 5.967-6.056.652.975 1.008 33.775 1.018 93.75L407 559h38V433.469c0-99.554-.259-125.611-1.25-125.916-2.596-.798-11.827-1.044-29.176-.779m343.381.438c-1.938.717-1.96 2.31-1.709 126.007L756.5 558.5h40l.5-32.073c.416-26.66.753-32.338 2-33.642.825-.863 4.425-4.876 8-8.917 3.575-4.041 8.824-9.827 11.664-12.858 2.84-3.03 8.678-9.447 12.973-14.26 8.774-9.832 10.122-10.314 13.993-5 5.334 7.321 13.889 18.72 15.178 20.224.72.839 4.234 5.576 7.809 10.526s7.037 9.675 7.692 10.5c.655.826 1.948 2.675 2.872 4.11.925 1.435 2.289 3.235 3.031 4 2.947 3.034 10.788 13.802 10.788 14.814 0 .592.337 1.079.75 1.083.413.004 1.874 1.691 3.249 3.75 1.374 2.059 3.001 4.277 3.616 4.931.615.653 6.462 8.415 12.994 17.25L925.486 559h24.257c13.341 0 24.257-.232 24.257-.516 0-.283-1.913-3.167-4.25-6.407-2.337-3.241-4.925-6.88-5.75-8.086-.825-1.207-2.888-4.061-4.584-6.343-16.856-22.671-19.84-26.806-24.916-34.522-.55-.836-2.033-2.669-3.296-4.073-1.263-1.404-3.257-4.128-4.432-6.053-1.175-1.925-3.855-5.587-5.954-8.139-2.1-2.551-3.818-5.031-3.818-5.51 0-.479-1.013-1.992-2.25-3.361-1.237-1.37-3.473-4.29-4.968-6.49s-4.969-7.15-7.72-11c-2.75-3.85-5.577-7.838-6.281-8.863-.705-1.025-3.419-4.717-6.031-8.206-2.612-3.488-4.75-6.812-4.75-7.387 0-.574-.377-1.044-.837-1.044-.46 0-3.048-3.262-5.75-7.25s-5.25-7.4-5.663-7.583c-3.456-1.537.717-8.618 11.994-20.353 11.942-12.427 15.813-16.63 19.745-21.437 2.195-2.682 6.695-7.761 10-11.286l8.511-9.072c1.375-1.464 4.3-4.827 6.5-7.474 2.2-2.646 5.515-6.438 7.366-8.428 7.22-7.76 21.113-22.837 24.982-27.109 5.614-6.202 5.232-6.319-20.044-6.169l-22.303.133-6.5 6.934a1124.18 1124.18 0 0 0-13.501 14.728c-3.85 4.287-8.35 9.198-10 10.913-1.65 1.716-7.275 7.756-12.5 13.423s-11.616 12.556-14.202 15.308c-2.586 2.752-7.761 8.399-11.5 12.549-3.739 4.149-8.742 9.543-11.117 11.988-2.376 2.444-7.763 8.323-11.971 13.064-4.208 4.742-10.425 11.546-13.816 15.121-11.077 11.679-13.275 14.143-13.675 15.33-3.098 9.199-3.719-1.642-3.719-64.917 0-62.736-.02-63.353-2.04-64.435-2.256-1.207-33.646-1.008-37.005.234M584.5 330.817c-25.81 11.001-28.265 35.509-6.9 68.906 4.005 6.262 5.316 6.964 9.668 5.178 3.552-1.458 12.037-6.962 12.565-8.151.184-.413.902-.75 1.597-.75 1.113 0 2.481-.936 7.278-4.981.664-.561 1.564-1.028 2-1.039 1.141-.028 11.571-10.023 12.982-12.441 8.592-14.721 6.834-35.045-3.655-42.252-9.027-6.202-26.356-8.383-35.535-4.47m8.5-.134c-29.521 4.845-35.46 30.762-14.956 65.274 5.647 9.505 9.027 8.732 30.411-6.957 26.407-19.373 25.117-49.936-2.414-57.217-6.524-1.726-8.312-1.877-13.041-1.1m-23.5 111.018c-1.65.882-4.392 2.661-6.094 3.952S559.977 448 559.569 448c-.407 0-2.165 1.289-3.905 2.865-1.74 1.576-5.307 4.788-7.925 7.138-5.227 4.69-11.739 14.575-11.739 17.819 0 1.133-.45 2.338-1 2.678-.55.34-1 4.047-1 8.238 0 33.738 35.436 54.677 68.784 40.644 1.806-.76 3.831-1.386 4.5-1.391 2.136-.017 13.608-7.191 21.574-13.491 7.17-5.672 6.946-7.392-2.108-16.174-3.987-3.868-13.55-13.694-21.25-21.836-7.7-8.142-18.275-19.212-23.5-24.599l-9.5-9.795-3 1.605m-7 7.073c-21.772 14.657-31.93 36.63-24.147 52.231.906 1.816 1.647 3.702 1.647 4.192 0 3.059 9.971 13.54 16.982 17.851 15.743 9.68 43.167 7.188 61.047-5.548 15.943-11.357 15.952-11.368 11.221-15.67-4.168-3.791-35.491-36.084-46.205-47.636-11.004-11.865-10.98-11.859-20.545-5.42M353.75 620.08c-3.056 1.78-2.554 18.664.591 19.86 3.536 1.344 414.15 1.403 416.66.06 2.969-1.589 3.024-18.381.065-19.965-2.675-1.431-414.857-1.387-417.316.045m3.75 2.652c-3.434.858-5.087 10.209-2.521 14.268 1.048 1.658 413.989 2.365 415.642.712 1.238-1.237.454-14.045-.913-14.914-1.304-.829-408.894-.894-412.208-.066m-244.149 60.73c-29.486 5.865-38.418 38.095-14.636 52.811 5.834 3.61 19.324 8.08 34.285 11.361 1.375.302 3.918 1.182 5.651 1.957 1.733.775 3.552 1.409 4.042 1.409 1.715 0 7.919 6.649 9.289 9.956 8.633 20.842-33.087 30.138-58.589 13.056-4.677-3.133-6.458-2.72-8.937 2.072-1.695 3.279.904 8.916 4.112 8.916.788 0 1.432.408 1.432.907 0 1.841 14.894 7.035 24.596 8.577 22.355 3.554 42.394-3.964 48.494-18.193 3.439-8.025 2.028-27.291-1.999-27.291-.472 0-1.076-.833-1.342-1.851-.496-1.898-10.273-8.095-14.749-9.35a787.86 787.86 0 0 1-8-2.328c-5.262-1.558-12.349-3.493-20.104-5.488-9.909-2.55-16.588-8.081-17.015-14.09-.649-9.153.5-11.891 7.327-17.444 7.596-6.179 28.105-5.571 42.476 1.259 7.713 3.666 11.896.724 9.957-7.003-1.815-7.229-29.062-12.67-46.29-9.243m619.816.032c-6.419 1.274-7.463 1.664-17.034 6.368-26.669 13.107-37.583 58.942-19.141 80.384.593.69 2.075 2.644 3.293 4.342 4.698 6.551 14.461 13.215 25.215 17.211 11.491 4.27 33.463 4.09 43.151-.354 1.733-.795 3.667-1.445 4.298-1.445 1.483 0 11.167-6.202 12.822-8.212.958-1.163 1.204-6.68 1-22.415L786.5 738.5h-11l-.273 17.615c-.332 21.463-.521 21.74-17.227 25.189-9.918 2.048-27.38.716-30.415-2.319-.542-.542-1.74-.985-2.663-.985-1.988 0-15.708-12.444-17.013-15.43-.497-1.138-1.295-2.745-1.773-3.57-23.1-39.871 30.961-83.464 68.845-55.514 7.296 5.383 16.382-3.249 9.307-8.842-13.365-10.568-32.745-14.794-51.121-11.15M990 683.418c-25.019 4.596-37.799 33.133-21.483 47.969 7.292 6.632 11.338 8.307 36.483 15.107 3.575.967 7.918 2.376 9.651 3.132 1.733.756 3.593 1.374 4.132 1.374 3.873 0 9.217 8.345 9.201 14.368-.028 10.935-6.475 15.458-25.773 18.084-7.683 1.046-30.862-6.001-33.511-10.188-1.348-2.131-5.346-1.454-7.085 1.201-9.686 14.783 38.35 27.285 62.978 16.391 5.602-2.478 15.407-12.202 15.407-15.28 0-.829.769-3.121 1.709-5.091 6.789-14.238-6.921-29.074-33.709-36.476a342.875 342.875 0 0 1-8.928-2.626c-2.436-.761-5.048-1.383-5.805-1.383-3.083 0-10.999-4.469-14.517-8.195-13.908-14.734 11.807-34.277 34.795-26.444 2.646.901 5.64 1.639 6.653 1.639s3.624 1.125 5.802 2.5c4.637 2.927 7.837 3.206 8.622.75.308-.962 1.028-2.732 1.602-3.933 4.187-8.768-24.75-16.844-46.224-12.899m-816.418 1.143c-1.921 1.921-2.085 7.777-.259 9.292.819.68 7.967 1.203 18.75 1.373l17.427.274.524 49c.288 26.95.625 49.112.75 49.25.635.702 10.933.088 12.226-.729 1.302-.824 1.46-6.455 1.195-42.735-.167-22.982-.01-44.814.349-48.514l.655-6.728 18.15-.272 18.151-.272v-11l-43.168-.261c-38.259-.23-43.348-.08-44.75 1.322m106.08-.08c-1.881 1.881-2.361 105.972-.499 108.215 1.29 1.555 9.167 1.733 11.903.269 1.788-.957 1.934-2.24 1.934-17V760l12.75-.047c7.012-.026 14.784-.229 17.27-.451 5.695-.509 5.222-.888 13.744 10.998 3.944 5.5 7.537 10.45 7.985 11 .448.55 1.783 2.575 2.966 4.5 4.216 6.856 5.889 8 11.702 8 9.561 0 8.635-3.146-6.599-22.435-1.275-1.615-3.98-5.44-6.011-8.5l-3.693-5.565 2.45-2c1.348-1.1 4.654-3.557 7.347-5.46 21.188-14.973 16.782-50.606-7.684-62.143-10.248-4.832-61.48-7.501-65.565-3.416m145.116-.231c-.882.688-2.959 4.175-4.616 7.75a2544.409 2544.409 0 0 1-7.086 15.113c-2.242 4.737-4.076 8.911-4.076 9.276 0 .364-1.982 4.813-4.404 9.886-2.422 5.074-5.297 11.25-6.388 13.725-2.221 5.035-5.583 12.397-11.42 25-2.165 4.675-4.534 9.85-5.266 11.5-.731 1.65-2.689 5.756-4.352 9.124-3.609 7.311-3.053 8.376 4.375 8.376 4.905 0 8.455-1.895 8.455-4.513 0-.855.597-2.193 7.475-16.737l3.665-7.75H459.659l3.081 6.25c5.15 10.447 8.26 17.39 8.26 18.442 0 2.42 3.815 4.308 8.706 4.308 6.096 0 7.809-1.494 5.781-5.039-.775-1.354-1.699-3.136-2.055-3.961-.355-.825-1.224-2.85-1.929-4.5-3.233-7.557-6.708-15.132-7.57-16.5-.52-.825-1.217-2.175-1.548-3-.331-.825-1.509-3.525-2.618-6-1.11-2.475-3.12-6.975-4.467-10-4.641-10.42-5.136-11.523-8.305-18.5-1.75-3.85-4.759-10.375-6.688-14.5-6.996-14.964-9.129-19.576-10.951-23.68-1.024-2.306-2.753-4.429-3.856-4.736-3.497-.973-9.062-.627-10.722.666m62.422-.05c-1.614 1.614-1.528 8.283.124 9.654.823.683 8.097 1.202 19.25 1.372l17.926.274.5 49 .5 49h12l.26-47.909c.309-56.997-2.181-50.591 19.662-50.591 12.027 0 17.538-.36 18.378-1.2 1.995-1.995 1.5-8.569-.734-9.765-2.929-1.567-86.29-1.411-87.866.165m106.414.363c-.798 2.079-.805 105.777-.007 107.855.835 2.176 76.444 2.43 78.243.263 1.487-1.793.839-8.632-.924-9.748-.784-.496-14.926-.916-31.426-.933-36.482-.037-32.608 2.312-32.274-19.574l.274-17.926 26.5-.258c29.588-.288 29-.139 29-7.326 0-5.014.577-4.916-28.975-4.916-22.614 0-25.886-.196-26.418-1.582-1.19-3.1-.672-32.953.593-34.218.878-.878 9.007-1.204 30.25-1.215 15.978-.009 29.656-.4 30.397-.869 1.774-1.124 2.06-8.067.4-9.726-2.168-2.168-74.798-2.002-75.633.173m225.627-.733c-.991.629-1.204 12.348-1 55.234l.259 54.436 5.393.307c7.657.436 7.217 3.812 7.133-54.641-.086-60.529-.505-62.497-11.785-55.336m46.794 1.104c-1.719 3.213-1.402 106.517.332 107.956.979.812 12.12 1.06 39.25.872l37.883-.262.298-4.588c.457-7.024 1.265-6.851-33.383-7.147L879.5 781.5l-.272-18.75-.272-18.75h26.822c29.166 0 29.222-.011 29.222-5.618 0-6.734 1.58-6.382-28.607-6.382H879v-37h30.465c33.909 0 32.535.291 32.535-6.899 0-5.545-73.062-8.591-75.965-3.167m-753.535.68c-2.221.543-5.263 1.774-10.476 4.241C97.891 691.811 91 698.413 91 700.417c0 .779-.552 1.6-1.226 1.825-.857.286-1.234 3.402-1.249 10.333-.027 11.82.77 13.495 10.183 21.409.664.559 1.621 1.016 2.127 1.016.506 0 1.441.628 2.078 1.395.636.767 2.604 1.61 4.372 1.874 1.768.264 4.565.965 6.215 1.557 1.65.592 5.7 1.795 9 2.673 12.611 3.355 14.173 3.874 20.27 6.74 14.908 7.007 14.884 32.761-.03 32.761-.737 0-1.902.563-2.59 1.25-2.108 2.108-23.899 2.302-30.864.275-7.394-2.152-18.33-7.477-19.014-9.258-.715-1.864-4.272 1.913-4.272 4.536 0 2 2.919 5.197 4.745 5.197.599 0 1.238.337 1.422.75.474 1.066 6.343 3.646 13.25 5.823 7.902 2.491 32.418 2.513 37.083.034 1.65-.877 3.561-1.597 4.248-1.601 13.008-.064 22.247-28.489 12.591-38.738-.638-.678-1.313-1.588-1.5-2.023-.87-2.028-10.8-7.396-17.215-9.306-3.918-1.167-8.939-2.756-11.157-3.531-2.219-.774-4.748-1.408-5.62-1.408-9.095 0-22.155-7.893-26.087-15.765-3.609-7.228 4.1-23.075 11.29-23.207.853-.015 2.113-.59 2.8-1.278 3.174-3.173 27.929-1.413 35.65 2.533l7 3.579 2.214-2.444c3.545-3.915 2.502-5.011-9.214-9.686-4.917-1.962-29.542-3.452-35-2.118m63.25.46c-7.734 4.532-.932 6.926 19.675 6.926 19.749 0 17.575-6.28 17.575 50.757v48.358l4.25-.308 4.25-.307.26-48.75c.142-26.812.367-48.837.5-48.944.132-.107 8.79-.444 19.24-.75l19-.556v-7l-41.5-.226c-26.958-.146-42.113.134-43.25.8m106.028-.545c-.397.412-.731 24.536-.742 53.61l-.02 52.861H290v-16.393c0-19.522-2.512-17.452 21.449-17.674 18.237-.169 21.551.328 21.551 3.232 0 .506.467 1.463 1.037 2.127 2.866 3.339 19.963 27.261 19.963 27.932 0 .427 2.25.776 5 .776 5.559 0 5.749-.203 3.25-3.477a121.224 121.224 0 0 1-3.25-4.5c-.825-1.214-3.413-4.859-5.75-8.1-2.337-3.24-4.25-6.349-4.25-6.907 0-.559-.413-1.016-.918-1.016-.506 0-1.944-1.687-3.198-3.75-1.253-2.062-2.676-4.024-3.161-4.359-2.211-1.523-.239-6.271 2.945-7.09 16.784-4.319 25.787-38.523 13.582-51.604-.687-.737-1.25-1.662-1.25-2.055 0-2.021-12.063-9.335-20-12.128-3.94-1.386-54.019-2.733-55.222-1.485m144.094.721c-.83.688-2.331 3.275-3.335 5.75-1.003 2.475-3.509 8.1-5.569 12.5-2.059 4.4-5.179 11.15-6.933 15-1.754 3.85-4.47 9.7-6.035 13a848.99 848.99 0 0 0-5.992 13c-1.73 3.85-3.565 7.781-4.077 8.736-.512.955-.931 2.363-.931 3.128 0 .765-.675 1.951-1.5 2.636s-1.5 2.26-1.5 3.5c0 1.24-.675 2.815-1.5 3.5s-1.5 1.608-1.5 2.053c0 .444-1.35 3.724-3 7.289-1.65 3.565-3 6.971-3 7.57 0 .598-.45 1.088-1 1.088s-1 .873-1 1.941-.45 2.219-1 2.559c-.55.34-1 1.066-1 1.614 0 1.607 9.182.595 10.105-1.114.445-.825 2.848-6 5.338-11.5 2.491-5.5 5.115-11.125 5.831-12.5l1.302-2.5 30.367-.265c31.912-.278 34.057-.005 34.057 4.339 0 1.066 7.328 17.675 9.896 22.426.517.957 2.646 1.608 5.883 1.8l5.072.299-2.894-5.799c-1.592-3.19-4.058-8.5-5.479-11.8-4.092-9.504-5.633-12.891-6.594-14.5a27.397 27.397 0 0 1-1.514-3c-.34-.825-1.851-4.2-3.358-7.5-1.507-3.3-3.54-7.8-4.517-10-.978-2.2-3.774-8.275-6.214-13.5-7.77-16.64-9.521-20.453-10.33-22.5-3.073-7.771-8.182-17.375-9.516-17.886-2.644-1.015-6.955-.695-8.563.636m63.522.166c-2.202 5.737-1.286 6.063 17.89 6.357l17.783.273 1.036 2.725c.667 1.754.982 18.736.884 47.726-.084 24.752-.115 45.791-.07 46.753.066 1.395.995 1.75 4.583 1.75h4.5v-47.809c0-57.634-2.546-51.088 20-51.427l17.5-.264v-7l-41.777-.261c-35.585-.222-41.859-.048-42.329 1.177m106.856-.764c-.978.402-1.25 12.039-1.25 53.431V792h75v-6.724l-6.563-.672c-3.61-.37-17.764-.618-31.454-.551-30.349.148-26.983 2.777-26.983-21.077C605 738.5 601.587 741 634.998 741h26.129l-.314-3.25-.313-3.25-27.5-.54c-15.125-.298-27.622-.635-27.771-.75-.149-.116-.149-9.098 0-19.96l.271-19.75 30.75-.264 30.75-.265v-7.878l-34.75.022c-19.112.012-35.312.253-36 .537M728 687.395c-9.557 3.396-11.733 4.364-12.462 5.543-.361.584-1.298 1.062-2.084 1.062-1.685 0-13.454 11.16-13.454 12.758 0 .605-.562 1.701-1.25 2.436-1.291 1.38-3.193 5.186-6.279 12.563-2.487 5.944-2.572 28.214-.126 32.943.91 1.761 1.655 3.875 1.655 4.7 0 3.43 13.121 21.6 15.597 21.6.393 0 2.107 1.013 3.809 2.25 3.618 2.631 8.161 4.835 15.03 7.292 6.778 2.424 31.547 2.47 36.064.067 1.65-.878 3.796-1.599 4.77-1.603.973-.003 3.552-1.131 5.73-2.506 2.178-1.375 4.335-2.5 4.793-2.5.458 0 2.052-1.273 3.543-2.828l2.709-2.829-.272-18.921-.273-18.922-4.75-.305-4.75-.305v17.597c0 19.507.018 19.45-7 22.718-37.224 17.335-77.029-12.653-68.64-51.712 6.814-31.724 44.544-46.205 73.433-28.185 6.072 3.788 6.361 3.863 8.25 2.154 3.071-2.78 1.721-6.687-3.043-8.81-.825-.368-3.075-1.62-5-2.781-10.621-6.409-32.99-8.099-46-3.476m92.846-1.707c-1.514.386-1.641 4.857-1.5 53.117l.154 52.695 4.759.305 4.759.305-.259-53.279-.259-53.28-3-.143c-1.65-.078-3.744.048-4.654.28m47.904.001c-1.639.429-1.75 3.819-1.75 53.384V792h75v-3.386c0-4.548-1.886-4.787-35.859-4.533-32.771.244-29.141 2.852-29.141-20.94 0-24.708-3.321-22.141 28.641-22.141 27.549 0 28.056-.086 26.938-4.541l-.609-2.427-27.235-.266-27.235-.266-.5-15.5c-.275-8.525-.275-17.525 0-20l.5-4.5 31-.5 31-.5.304-3.119c.38-3.912-58.505-6.971-71.054-3.692m120.75-.048c-12.431 3.287-19.428 8.271-23.581 16.797-2.096 4.302-2.753 17.929-.919 19.062.55.34 1.002 1.379 1.005 2.309.005 1.488 3.452 5.556 7.995 9.434 2.761 2.357 10.979 5.39 25 9.227 25.965 7.105 35.994 15.469 31.19 26.012-.654 1.437-1.19 3.461-1.19 4.498 0 14.326-42.594 16.148-60.895 2.605l-3.395-2.513-1.743 3.214c-1.666 3.072-1.662 3.29.077 4.939 2.743 2.601 12.084 7.427 15.997 8.265 1.902.408 4.051 1.218 4.774 1.802 1.891 1.526 31.871 1.422 33.409-.116.647-.647 1.88-1.176 2.741-1.176 4.46 0 17.035-9.908 17.035-13.421 0-.869.387-1.579.86-1.579s1.121-2.526 1.44-5.613c1.98-19.185-5.018-26.094-34.3-33.865-27.783-7.373-33.676-12.42-31.336-26.839 1.948-12.005 35.049-23.372 43.486-14.933.688.688 2.185 1.25 3.327 1.25 1.143 0 2.966.605 4.05 1.344 4.785 3.259 8.416 3.732 9.056 1.181 1.036-4.128.047-5.624-5.083-7.689-2.75-1.107-5.9-2.505-7-3.108-2.066-1.131-28.444-2.028-32-1.087M291.2 694.2c-1.774 1.774-1.697 51.738.083 54.173 1.434 1.961 33.201 1.91 42.841-.069 27.69-5.683 27.482-45.771-.278-53.691-7.125-2.033-40.701-2.358-42.646-.413m2.467 1.467c-1.005 1.005-.771 49.621.247 51.228 1.5 2.369 35.994.972 42.753-1.733 20.333-8.136 21.505-37.811 1.833-46.424-7.457-3.265-42.256-5.649-44.833-3.071m134.431 4.196c-1.154 1.62-2.098 3.213-2.098 3.539 0 .326-1.374 3.631-3.053 7.345A3346.036 3346.036 0 0 0 418.331 721c-.86 1.925-2.186 4.694-2.947 6.154-.761 1.46-1.384 3.373-1.384 4.25 0 .878-.441 1.596-.981 1.596-.539 0-1.277 1.237-1.638 2.75s-.984 3.2-1.384 3.75c-10.491 14.42-7.77 16.572 20.571 16.268l24.932-.268.316-2.744c.18-1.562-.974-5.437-2.679-9-1.647-3.441-3.282-7.269-3.633-8.506s-1.058-2.25-1.571-2.25c-.513 0-.933-1.07-.933-2.378 0-1.307-.675-2.937-1.5-3.622s-1.5-1.874-1.5-2.643c0-.77-1.405-4.427-3.123-8.128-9.574-20.627-9.664-20.742-12.779-16.366m.132 4.407c-1.158 2.326-3.69 7.94-5.627 12.473-1.937 4.534-5.051 11.509-6.921 15.5-1.869 3.992-4.159 9.057-5.089 11.257-.929 2.2-2.118 4.781-2.641 5.736-2 3.649-1.314 3.764 22.548 3.764 14.376 0 23.5-.373 23.5-.962 0-.529-2.025-5.295-4.5-10.592-2.475-5.297-4.5-9.998-4.5-10.446 0-.449-1.182-3.219-2.626-6.158-1.444-2.938-3.31-6.917-4.146-8.842-.837-1.925-1.908-4.175-2.381-5-.473-.825-1.039-1.95-1.257-2.5-3.436-8.637-3.985-9.003-6.36-4.23"
      />
      <path
        fill={forceColor ? '#ffffff' : '#fbc840'}
        fillRule="evenodd"
        d="M357.5 622.732c-3.434.858-5.087 10.209-2.521 14.268 1.048 1.658 413.989 2.365 415.642.712 1.238-1.237.454-14.045-.913-14.914-1.304-.829-408.894-.894-412.208-.066"
      />
      <path
        fill="#ffffff"
        fillRule="evenodd"
        d="M577 306.96c-39.143 10.277-54.361 43.718-37.787 83.04 3.251 7.715 4.09 9.254 10.018 18.393 7.343 11.319 7.355 12.521.161 16.784-3.084 1.827-6.796 4.106-8.25 5.062-1.453.956-3.297 2.053-4.099 2.436-1.529.732-3.971 2.686-10.093 8.075-2.031 1.788-3.96 3.25-4.288 3.25-.605 0-7.662 6.802-7.662 7.385 0 .175-2.025 3.402-4.5 7.17s-4.5 7.622-4.5 8.565c0 .942-.376 1.863-.835 2.047-1.667.665-3.958 21.041-3.074 27.333 1.716 12.217 2.053 14.043 2.95 16 .505 1.1 1.364 3.125 1.91 4.5.546 1.375 2.349 4.75 4.008 7.5 1.658 2.75 3.328 5.651 3.71 6.446 2.377 4.944 22.235 19.916 30.831 23.246 24.316 9.419 55.156 8.216 76.919-3 1.605-.827 5.38-2.746 8.388-4.263 3.009-1.518 5.745-3.159 6.082-3.647.336-.488 2.186-1.859 4.111-3.046 1.925-1.187 4.85-3.351 6.5-4.809 10.421-9.208 9.448-9.252 19.736.898 4.641 4.579 10.087 9.582 12.101 11.119 2.015 1.536 3.663 3.17 3.663 3.63 0 .915 11.187 11.891 13.358 13.106 1.339.75 19.642-16.907 19.642-18.947 0-.507-8.382-9.074-18.628-19.037-22.63-22.008-22.003-21.206-19.096-24.417 1.223-1.352 3.102-4.218 4.174-6.368 1.073-2.151 2.487-4.586 3.143-5.411.656-.825 3.378-5.775 6.05-11 2.671-5.225 5.194-9.65 5.607-9.833.413-.184.75-1.11.75-2.059 0-.949.661-2.599 1.468-3.667 2.654-3.509 1.93-7.774-1.682-9.908-2.892-1.709-6.786-4.824-10.354-8.283-.709-.687-1.576-1.25-1.927-1.25s-2.164-1.164-4.029-2.586c-4.137-3.155-4.816-2.793-7.321 3.9C668.546 460.306 656.269 482 653.394 482c-1.509 0-30.357-28.405-47.132-46.409-8.396-9.011-8.397-9.888-.017-14.052 2.89-1.435 6.605-3.463 8.255-4.506 1.65-1.043 4.764-2.86 6.921-4.038 2.156-1.177 6.592-4.246 9.857-6.818 3.266-2.572 6.623-5.127 7.461-5.677 17.787-11.668 27.603-44.42 18.582-62a268.61 268.61 0 0 1-2.704-5.514C652.906 329.401 643.931 319 642.55 319c-.419 0-2.402-1.259-4.406-2.797-5.499-4.222-13.94-8.199-17.486-8.238-1.737-.02-4.283-.679-5.658-1.465-3.713-2.122-29.346-1.812-38 .46m361.888.039-19.612.501-6.138 6.275c-3.376 3.452-6.138 6.472-6.138 6.712 0 .24-1.913 2.432-4.25 4.872-2.337 2.44-7.4 7.911-11.25 12.157-3.85 4.247-9.7 10.562-13 14.033-3.3 3.471-7.8 8.32-10 10.776-7.593 8.474-21.019 22.993-27 29.199-3.3 3.424-8.475 9.076-11.5 12.561-5.43 6.254-11.125 12.421-22.137 23.97-3.1 3.251-5.898 6.594-6.218 7.428-.652 1.7-3.206 2.036-4.129.543-.331-.535-.573-29.509-.538-64.385.057-57.279-.092-63.471-1.539-64.026-38.968-14.953-39.441-13.444-39.424 125.717.018 143.753-2.999 125.777 21.058 125.44l19.427-.272.5-32.026c.374-23.963.822-32.397 1.778-33.5a802.42 802.42 0 0 1 5.5-6.182c2.322-2.589 6.922-7.848 10.222-11.687 3.3-3.839 6.563-7.008 7.25-7.042.688-.035 1.25-.643 1.25-1.351s2.138-3.582 4.75-6.385c2.612-2.804 6.174-6.724 7.915-8.712 4.303-4.915 14.223-.731 14.351 6.053.008.458 1.801 2.857 3.984 5.332 2.183 2.475 3.976 4.805 3.984 5.179.009.373.691 1.353 1.516 2.178 2.721 2.721 16.5 21.635 16.5 22.649 0 .547.337.997.75 1.001.413.004 1.875 1.688 3.25 3.742 1.375 2.054 3.486 4.864 4.69 6.243 1.205 1.379 4.892 6.333 8.194 11.008 3.303 4.675 6.419 8.979 6.927 9.565.507.586 5.047 6.595 10.087 13.353 5.041 6.759 9.836 12.959 10.657 13.78.82.82 2.168 2.799 2.994 4.397l1.502 2.905h24.475c13.461 0 24.474-.244 24.474-.542 0-.298-.472-1.086-1.049-1.75-.577-.664-3.273-4.358-5.991-8.208-2.717-3.85-5.294-7.45-5.726-8-3.629-4.625-10.167-13.56-11.707-16-1.042-1.65-2.374-3.513-2.96-4.139-.587-.627-1.822-2.202-2.744-3.5-.922-1.299-3.298-4.611-5.279-7.361-1.98-2.75-3.866-5.788-4.189-6.75-.324-.962-.931-1.75-1.35-1.75-.419 0-2.504-2.587-4.633-5.75-2.13-3.163-4.109-5.975-4.398-6.25-1.45-1.379-6.974-8.876-6.974-9.465 0-.373-.562-1.266-1.25-1.984-.687-.718-1.925-2.314-2.75-3.547s-2.717-3.875-4.204-5.873c-1.487-1.997-6.873-9.481-11.967-16.631-5.095-7.15-9.631-13.45-10.079-14-3.818-4.68-14.615-20.426-15.121-22.052-.826-2.655 6.302-11.467 22.063-27.274 3.469-3.48 6.308-6.502 6.308-6.716 0-.214 1.237-1.711 2.75-3.327 1.513-1.616 4.55-5.077 6.75-7.691 2.2-2.615 6.25-7.084 9-9.931 2.75-2.848 6.8-7.388 9-10.088 2.2-2.7 7.664-8.737 12.141-13.415 4.478-4.678 9.878-10.472 12-12.874 2.123-2.403 6.211-6.891 9.086-9.973 7.364-7.894 7.331-7.904-21.839-7.16M177 432.983V559h38v-92.878c0-99.93-.062-98.754 4.827-92.142 1.195 1.617 2.173 3.269 2.173 3.673 0 .404 5.344 11.56 11.875 24.791A19742.015 19742.015 0 0 1 255.301 446a47103.268 47103.268 0 0 0 26.15 53.25L298.05 533l12.225-.032c12.525-.032 15.725-.888 15.725-4.206 0-.834.675-2.077 1.5-2.762s1.5-1.746 1.5-2.358c0-1.013 15.9-34.106 18.086-37.642.51-.825 1.181-2.175 1.493-3 .311-.825.986-2.175 1.5-3 .513-.825 1.189-2.175 1.5-3 .312-.825.986-2.284 1.497-3.242 1.667-3.119 6.492-12.918 15.393-31.258 4.804-9.9 9.141-18.675 9.636-19.5.495-.825 1.356-2.562 1.914-3.86 3.025-7.035 21.55-43.968 22.992-45.837 3.926-5.092 3.989-3.62 3.989 92.897V559h38V308.038l-2.25-.551c-1.238-.304-12.308-.425-24.601-.269l-22.351.282-2.392 4c-1.316 2.2-2.681 4.675-3.034 5.5-1.296 3.033-14.478 30.548-15.33 32-.964 1.642-16.511 32.862-23.903 48-2.551 5.225-4.976 9.65-5.389 9.833-.413.184-.75.742-.75 1.241 0 1.712-4.375 10.926-5.187 10.926-.447 0-.813.845-.813 1.878 0 1.032-.675 2.437-1.5 3.122s-1.488 1.752-1.473 2.372c.035 1.458-9.29 20.023-10.277 20.461-.413.184-.75 1.014-.75 1.846 0 1.34-1.528 4.773-4.148 9.321-.476.825-1.087 2.063-1.358 2.75a481.68 481.68 0 0 1-.998 2.5c-1.395 3.459-6.265 11.173-7.263 11.506-.626.208-2.682-2.689-4.569-6.438-1.887-3.75-4.828-9.518-6.535-12.818-1.707-3.3-3.109-6.562-3.116-7.25-.007-.687-.463-1.25-1.013-1.25-.55 0-1-.569-1-1.263 0-1.015-5.876-13.136-12.722-26.247-.572-1.094-2.01-4.015-3.197-6.49-1.186-2.475-2.554-5.175-3.039-6-2.673-4.538-21.064-42.683-21.054-43.667.007-.641-.349-1.316-.789-1.5-.441-.183-2.391-3.483-4.334-7.333-1.943-3.85-3.996-7.9-4.563-9C239.114 333.486 235 324.692 235 323.481c0-.815-.401-1.481-.892-1.481-.49 0-1.183-1.164-1.54-2.586s-1.102-3.109-1.656-3.75c-.554-.64-1.826-2.739-2.827-4.664l-1.821-3.5-24.632-.267-24.632-.268v126.018m404.387-100.727c-22.25 11.806-24.344 32.895-6.283 63.286 7.876 13.253 7.934 13.264 21.396 4.008 2.2-1.513 5.013-3.144 6.25-3.625 1.237-.482 2.25-1.337 2.25-1.9 0-.564.498-1.025 1.106-1.025 3.63 0 16.035-12.224 19.832-19.542 3.594-6.929 4.57-24.082 1.594-28.017-.808-1.067-1.483-2.693-1.5-3.613-.198-10.377-30.773-16.932-44.645-9.572M565.621 444c-3.14 2.2-6.027 4.001-6.415 4.003-2.517.01-18.965 17.244-21.102 22.111a908.018 908.018 0 0 1-3.31 7.461c-2.059 4.524.49 27.353 3.153 28.241.579.193 1.053 1.036 1.053 1.873 0 1.603 5.388 9.001 7.981 10.958.835.631 2.6 2.094 3.921 3.25 8.957 7.837 33.004 12.676 42.752 8.603 1.975-.825 4.634-1.5 5.909-1.5 1.275 0 2.576-.415 2.889-.923.314-.508 1.996-1.236 3.737-1.618 2.888-.635 12.616-5.934 13.811-7.524.275-.366 1.4-.956 2.5-1.311 2.907-.937 11.076-8.896 11.741-11.436.45-1.723-.789-3.466-5.993-8.43-3.609-3.442-7.503-7.366-8.654-8.721-1.152-1.354-6.369-6.792-11.594-12.085-5.225-5.292-11.257-11.609-13.404-14.037-7.145-8.081-21.704-22.915-22.49-22.915-.426 0-3.344 1.8-6.485 4M113 685.596c-13.531 4.964-17.199 7.415-21.537 14.394C83.156 713.354 93.496 738 107.41 738c1.387 0 4 .634 5.806 1.409 4.969 2.131 13.723 4.591 16.34 4.591 1.279 0 2.604.45 2.944 1 .34.55 1.379 1.003 2.309 1.006.93.004 2.846.609 4.258 1.346 1.411.736 3.685 1.62 5.053 1.963 13.921 3.494 13.406 25.743-.759 32.772-5.694 2.827-32.958 3.719-35.512 1.163-.687-.687-2.454-1.25-3.927-1.25-1.472 0-3.237-.675-3.922-1.5s-1.76-1.5-2.39-1.5c-.63 0-2.773-1.106-4.762-2.457-3.456-2.349-3.687-2.379-5.232-.671-3.746 4.139.802 8.077 16.384 14.191 5.455 2.14 35.332 2.518 38.237.484 1.214-.851 3.038-1.547 4.052-1.547 9.086 0 23.649-27.212 16.822-31.432-.489-.302-1.198-1.791-1.576-3.309-1.347-5.418-12.119-13.34-20.2-14.856-1.846-.346-3.604-1.029-3.905-1.516-.301-.488-1.534-.885-2.739-.882-1.205.003-4.216-.657-6.691-1.466-2.475-.809-7.425-2.329-11-3.376-20.871-6.118-27.414-22.333-13.531-33.533 6.608-5.331 9.688-6.13 23.63-6.13 12.809 0 13.096.061 22.664 4.842 4.896 2.447 7.737 1.565 7.737-2.403 0-2.387-3.923-4.882-12.5-7.947-3.567-1.275-29.273-2.396-32-1.396m62.75.508c-7.868 4.475-.177 7.045 20.458 6.838 18.853-.19 16.792-6.411 16.792 50.68V792h4c2.2 0 4.102-.112 4.226-.25.125-.138.462-22.3.75-49.25l.524-49 18.651-.272c19.821-.288 20.83-.563 19.338-5.264-.945-2.975-79.737-4.705-84.739-1.86m106.573.007c-.854 1.028-1.108 15.159-.963 53.394l.197 51.995 4.221.307 4.222.308v-16.498c0-19.615-2.58-17.434 20.945-17.705l19.353-.222 2.824 3.405c1.553 1.873 2.836 3.817 2.851 4.321.015.504.716 1.629 1.557 2.5.842.871 4.105 5.202 7.25 9.624 10.526 14.795 10.355 14.632 14.988 14.276l4.114-.316-3.852-5.718c-2.119-3.146-7.177-10.346-11.242-16-4.064-5.655-7.725-10.835-8.135-11.511-1.194-1.969 1.082-5.054 4.24-5.747 22.705-4.987 24.054-55.48 1.632-61.107-1.389-.349-2.525-1.015-2.525-1.48 0-.466-1.687-1.15-3.75-1.522-2.062-.372-4.307-1.117-4.987-1.657-2.155-1.71-51.557-2.314-52.94-.647m144.649-.464c-.841.228-2.584 2.763-3.873 5.634a882.364 882.364 0 0 1-5.221 11.342c-1.583 3.367-2.878 6.63-2.878 7.25 0 .62-.45 1.127-1 1.127s-1 .494-1 1.099c0 1.19-1.507 4.79-6.239 14.901-7.528 16.087-8.761 18.89-8.761 19.912 0 .598-.45 1.088-1 1.088s-1 .718-1 1.596c0 .877-.607 2.79-1.348 4.25-.742 1.46-2.141 4.454-3.11 6.654-.969 2.2-2.165 4.675-2.658 5.5-.493.825-1.167 2.175-1.497 3-1.564 3.903-3.885 9.099-6.925 15.5l-3.325 7 4.006.311c4.498.349 6.378-.766 7.268-4.312.334-1.331 2.403-6.289 4.598-11.019 2.195-4.729 3.991-8.99 3.991-9.468 0-3.728 2.373-4.012 33.5-4.012 31.572 0 33.5.248 33.5 4.307 0 .64 1.097 3.421 2.439 6.179 1.341 2.758 3.801 8.052 5.467 11.764l3.029 6.75h5.188c4.962 0 5.115-.079 3.532-1.829-.91-1.006-1.655-2.237-1.655-2.735 0-.499-1.171-3.389-2.601-6.422-1.431-3.033-3.28-7.089-4.11-9.014-.83-1.925-1.912-4.175-2.405-5-.493-.825-1.162-2.175-1.487-3-.804-2.043-2.524-5.824-7.733-17a2257.455 2257.455 0 0 1-12.384-27l-4.29-9.5c-3.891-8.613-4.99-11.345-4.99-12.401 0-.605-.337-1.101-.75-1.103-.413-.002-1.6-2.139-2.638-4.75-2.696-6.773-5.383-8.297-11.64-6.599m65.22.092c-3.049.365-3.284.646-3 3.579l.308 3.182 17.956.274c22.063.336 19.511-6.326 19.529 50.976L527 792h9v-47.809c0-57.634-2.546-51.088 20-51.427l17.5-.264.304-3.128c.379-3.893-57.831-6.485-81.612-3.633m105.049.025-2.259.377.259 52.68.259 52.679 37.25.262 37.25.262v-6.944l-31.918-.29c-37.751-.343-33.51 2.312-33.907-21.225-.423-25.112-3.804-22.565 29.96-22.565h26.992l-.314-3.25-.313-3.25-27.5-.5-27.5-.5-.593-19c-.326-10.45-.393-19.556-.148-20.236.336-.936 7.867-1.299 31.092-1.5l30.649-.264.303-3.114c.387-3.973-51.348-6.667-69.562-3.622m136.259-.063c-5.548 1.3-11.475 3.619-16.5 6.457-.825.466-2.48 1.272-3.677 1.792-4.956 2.151-13.177 12.115-17.82 21.596l-4.636 9.468v13.567c0 10.632.339 14.084 1.566 15.958.862 1.315 1.567 3.158 1.567 4.095 0 5.541 11.265 20.039 18.667 24.026 1.833.987 3.333 2.142 3.333 2.567 0 .425.8.773 1.777.773.978 0 2.666.61 3.75 1.356 6.847 4.706 37.31 6.973 42.726 3.179 1.206-.844 3.185-1.535 4.398-1.535 2.875 0 14.113-6.71 15.96-9.529 1.143-1.744 1.38-5.936 1.162-20.581l-.273-18.39-4.75-.305-4.75-.305v17.9c0 21.236.514 20.4-15.783 25.712-6.221 2.028-25.279 1.836-27.391-.276-.674-.674-2.039-1.226-3.033-1.226-31.358 0-40.773-67.628-11.293-81.11 1.1-.503 3.529-1.837 5.397-2.964 13.717-8.275 35.908-7.305 49.886 2.182l5.649 3.834 2.246-2.109c9.038-8.491-27.944-20.875-48.178-16.132m87.499.132c-.649.217-.999 18.887-.999 53.25V792h9.018l-.259-53.154-.259-53.154-3.251-.096c-1.788-.053-3.7.054-4.25.237m49.501.156-3 .531V791.5l37.25.262 37.25.262v-6.944l-31.918-.29c-17.555-.16-32.222-.595-32.593-.967-.871-.872-.897-40.353-.028-41.76.438-.708 9.659-1.063 27.629-1.063 24.049 0 27.041-.177 27.601-1.636 1.75-4.562.204-4.848-27.766-5.131-31.334-.317-27.805 2.267-28.042-20.537-.24-23.002-3.98-20.568 32.13-20.909l30.487-.287v-2.928c0-4.23-50.512-6.852-69-3.583m120-.379c-1.1.276-3.125.89-4.5 1.365-1.375.474-3.708 1.125-5.185 1.446-3.552.773-13.483 10.344-14.349 13.829-.375 1.513-1.084 2.75-1.574 2.75-.491 0-.892 3.6-.892 8 0 4.667.417 8 1 8 .55 0 1 .945 1 2.1 0 2.005 8.575 11.852 10.349 11.884.467.009 2.267.617 4 1.351 5.063 2.146 9.895 3.801 13.651 4.677 3.516.82 8.077 2.048 15.5 4.176 24.951 7.152 29.104 25.614 8.5 37.789-9.184 5.427-35.944 1.707-49.27-6.849-2.074-1.331-3.898-2.242-4.053-2.024-3.341 4.689-3.536 5.572-1.599 7.23 2.829 2.423 12.951 7.665 14.813 7.672.885.004 2.94.7 4.567 1.549 4.293 2.239 31.76 2.254 36.044.02 1.649-.859 3.631-1.565 4.404-1.569 2.616-.011 13.094-8.726 13.094-10.891 0-.535.701-1.673 1.558-2.531 2.066-2.065 2.281-19.703.27-22.054-9.026-10.552-12.838-12.617-33.328-18.054-25.845-6.858-30.885-10.516-30.901-22.425-.009-6.35 2.966-14.051 5.428-14.051.457 0 1.425-.589 2.152-1.309 5.245-5.199 24.652-7.612 34.723-4.318 2.735.895 5.645 1.627 6.464 1.627.82 0 2.09.599 2.822 1.331 2.1 2.1 6.982 3.006 7.952 1.477 1.441-2.273.947-5.843-.89-6.43a49.427 49.427 0 0 1-3.75-1.424c-9.153-3.956-10.442-4.21-23-4.522-7.15-.178-13.9-.098-15 .178m-699.25 8.052c-2.626 1.06-1.705 53.906.973 55.781 2.628 1.841 26.2 2.161 33.777.459 2.475-.556 6.3-1.354 8.5-1.772 7.473-1.422 18.5-10.776 18.5-15.692 0-1.276.45-2.598 1-2.938 2.857-1.766.495-18.551-3.343-23.759-7.695-10.442-44.778-17.982-59.407-12.079m136.365 5.803c-.888 1.355-1.615 2.745-1.615 3.088 0 .343-1.35 3.54-3 7.105-1.65 3.565-3 6.943-3 7.507 0 .565-.64 2.221-1.422 3.681-.781 1.46-1.679 3.329-1.993 4.154-.315.825-.976 2.175-1.469 3-.493.825-1.588 3.075-2.434 5a969.607 969.607 0 0 1-3.807 8.5c-2.933 6.465-4.841 11.672-4.86 13.267-.012.997 5.472 1.21 25.735 1l25.75-.267.313-2.716c.172-1.494-.451-4.419-1.386-6.5A2799.7 2799.7 0 0 0 449.77 736c-1.626-3.575-3.552-7.85-4.279-9.5-13.037-29.577-14.631-31.987-17.876-27.035"
      />
      <path
        fill={forceColor ?? '#000000'}
        fillRule="evenodd"
        d="M521.819 1.003C41.816 37.878-174.922 620.316 164.932 960.061 424.599 1219.644 854.798 1166.38 1045.792 851c44.159-72.919 78.196-182.919 78.207-252.75.001-2.888.451-5.25 1.001-5.25.646 0 1-11.186 1-31.559 0-17.357-.383-31.322-.852-31.033-.468.29-1.146-4.322-1.506-10.249C1106.235 233.558 860.132 2.974 569 .494c-20.075-.171-41.306.058-47.181.509M579 304.04c-11.898 2.752-16.042 4.538-25.512 10.994-18.328 12.494-29.699 46.19-21.149 62.666.914 1.761 1.661 4.081 1.661 5.158s1.064 4.136 2.365 6.8c1.301 2.663 2.867 5.967 3.48 7.342 2.491 5.593 11.011 19.214 12.405 19.833 1.538.684.674 3.136-1.5 4.258-23.032 11.887-44.493 34.187-48.992 50.909C485.5 532.433 547.66 579.678 614 557.309c6.287-2.12 27.354-13.155 29-15.191.484-.598 9.877-8.401 13.078-10.864 1.342-1.032 4.333 1.489 20 16.859 23.472 23.027 19.703 21.943 32.346 9.3 12.956-12.956 13.299-10.341-3.537-26.972-27.989-27.648-26.43-25.517-22.499-30.758 3.823-5.095 14.612-24.367 14.612-26.101 0-.87.45-1.582 1-1.582s1-.569 1-1.265c0-.695.868-2.884 1.929-4.864 4.23-7.892 1.276-16.839-5.573-16.876-.471-.002-2.219-1.24-3.884-2.75-3.282-2.975-10.183-8.402-12.266-9.645-1.858-1.109-6.206 2.056-6.206 4.519 0 1.14-.607 3.267-1.348 4.727-.742 1.46-2.141 4.454-3.11 6.654-.969 2.2-2.14 4.675-2.601 5.5-.462.825-2.377 4.425-4.257 8-8.614 16.383-6.359 16.681-26.074-3.456-36.485-37.268-35.315-35.312-24.473-40.947 4.05-2.105 8.038-4.405 8.863-5.112.825-.708 4.031-2.802 7.125-4.654 12.328-7.38 29.875-25.116 29.875-30.196 0-.834.396-1.762.88-2.061 6.709-4.146 6.006-35.219-1.066-47.074-.984-1.65-2.199-3.9-2.701-5-1.034-2.268-12.507-12.921-16.188-15.031-5.445-3.121-12.093-5.911-18.79-7.886-5.832-1.721-33.431-2.094-40.135-.543m-402.965 1.894c-1.591 2.972-1.429 252.272.165 253.866 1.879 1.879 39.159 1.678 40.734-.22.89-1.073 1.103-23.714.872-92.681-.168-50.194-.161-90.505.017-89.58.178.925.675 1.681 1.104 1.681.741 0 13.105 24.528 28.985 57.5 3.974 8.25 7.645 15.675 8.159 16.5.514.825 1.385 2.549 1.937 3.831 1.728 4.013 26.982 55.421 32.878 66.927.491.958 1.73 3.542 2.753 5.742 6.325 13.595 30.646 8.025 39.278-8.996 3.346-6.598 6.083-12.56 6.083-13.25 0-.69.45-1.254 1-1.254s1-.648 1-1.44c0-1.224 7.353-16.957 10.077-21.56.488-.825 1.844-3.525 3.013-6 1.864-3.944 15.482-31.668 40.649-82.75 8.754-17.769 9.257-18.121 9.274-6.5.104 69.409 1.421 170.99 2.23 172 1.395 1.741 37.82 1.787 39.557.05 1.594-1.594 1.756-250.894.165-253.866-1.333-2.49-49.792-3.053-51.826-.602-.608.733-2.641 4.446-4.518 8.25-1.876 3.805-11.82 24.018-22.098 44.918-10.277 20.9-19.832 40.25-21.233 43-3.713 7.288-6.568 13.035-21.237 42.75-7.262 14.712-13.508 26.742-13.879 26.731-.529-.014-26.108-50.954-51.963-103.481a3074.1 3074.1 0 0 0-5.444-11 792.153 792.153 0 0 1-5.108-10.5c-1.439-3.025-3.499-7.075-4.578-9-1.079-1.925-4.917-9.532-8.528-16.905-3.611-7.373-7.068-14.011-7.682-14.75-2.043-2.462-50.497-1.911-51.836.589m579.076-.568c-1.793 2.161-1.728 253.627.066 254.765 2.692 1.706 42.54 1.049 43.216-.713.334-.87.621-15.607.639-32.75l.032-31.168 7.218-7.718c3.97-4.245 9.018-9.823 11.218-12.396 13.568-15.866 24.464-25.995 25.291-23.512.213.639.934 1.716 1.602 2.394.667.678 5.909 7.532 11.648 15.232 5.739 7.7 11.002 14.595 11.697 15.321.694.727 1.269 1.627 1.278 2 .009.374 1.359 2.202 3 4.065 1.641 1.862 2.991 3.662 3 4 .009.337 1.246 2.031 2.75 3.762 1.504 1.731 3.409 4.145 4.234 5.363 1.273 1.88 4.911 6.806 7.746 10.489.423.55 1.523 2.174 2.443 3.61.92 1.435 2.281 3.235 3.023 4 1.85 1.905 9.944 12.72 12.254 16.374 1.037 1.64 2.932 4.111 4.21 5.489 1.278 1.379 2.324 2.78 2.324 3.114 0 .334.946 1.688 2.102 3.01 1.156 1.322 3.482 4.316 5.169 6.653l3.068 4.25h25.208c31.34 0 30.849.577 15.745-18.5-.436-.55-1.917-2.684-3.292-4.743-1.375-2.059-2.837-3.746-3.25-3.75-.413-.004-.75-.456-.75-1.004 0-.549-3.081-5.161-6.846-10.25s-7.362-10.23-7.993-11.425c-.631-1.195-1.714-2.77-2.406-3.5-.692-.73-2.382-3.012-3.756-5.071-1.375-2.059-2.836-3.746-3.249-3.75-.413-.004-.75-.439-.75-.967 0-.527-2.812-4.731-6.25-9.341-3.437-4.61-8.725-11.899-11.75-16.196-7.393-10.504-17.172-23.886-17.906-24.503-.326-.275-1.044-1.238-1.594-2.14-3.617-5.932-10.053-14.86-10.712-14.86-.433 0-.788-.476-.788-1.059 0-.981-5.632-8.784-7.191-9.964-1.411-1.067-3.715-6.419-2.987-6.939 1.044-.744 12.345-13.05 20.178-21.972 6.369-7.254 10.934-12.313 24-26.599 7.194-7.866 18.677-20.605 24.635-27.33 2.126-2.4 5.89-6.514 8.365-9.142 7.848-8.335 17.471-19.173 18.304-20.617 1.765-3.059-.604-3.378-25.046-3.378h-24.624l-5.567 5.793c-3.062 3.186-7.354 7.799-9.538 10.25-2.184 2.451-7.359 8.063-11.5 12.47-4.141 4.408-11.804 12.694-17.029 18.413-5.225 5.72-11.469 12.464-13.876 14.987-2.407 2.523-7.807 8.381-12 13.017-4.193 4.637-8.974 9.851-10.624 11.587-3.558 3.745-20.25 21.915-26.557 28.91C805.915 427.221 800.23 433 799.589 433c-.324 0-.589-28.155-.589-62.566 0-41.216-.353-63.226-1.035-64.5-1.344-2.511-40.807-3.035-42.854-.568M593 330.683c-29.521 4.845-35.46 30.762-14.956 65.274 5.647 9.505 9.027 8.732 30.411-6.957 26.407-19.373 25.117-49.936-2.414-57.217-6.524-1.726-8.312-1.877-13.041-1.1m-30.5 118.091c-21.772 14.657-31.93 36.63-24.147 52.231.906 1.816 1.647 3.702 1.647 4.192 0 3.059 9.971 13.54 16.982 17.851 15.743 9.68 43.167 7.188 61.047-5.548 15.943-11.357 15.952-11.368 11.221-15.67-4.168-3.791-35.491-36.084-46.205-47.636-11.004-11.865-10.98-11.859-20.545-5.42M353.75 620.08c-3.056 1.78-2.554 18.664.591 19.86 3.536 1.344 414.15 1.403 416.66.06 2.969-1.589 3.024-18.381.065-19.965-2.675-1.431-414.857-1.387-417.316.045m-240.399 63.382c-29.486 5.865-38.418 38.095-14.636 52.811 5.834 3.61 19.324 8.08 34.285 11.361 1.375.302 3.918 1.182 5.651 1.957 1.733.775 3.552 1.409 4.042 1.409 1.715 0 7.919 6.649 9.289 9.956 8.633 20.842-33.087 30.138-58.589 13.056-4.677-3.133-6.458-2.72-8.937 2.072-1.695 3.279.904 8.916 4.112 8.916.788 0 1.432.408 1.432.907 0 1.841 14.894 7.035 24.596 8.577 22.355 3.554 42.394-3.964 48.494-18.193 3.439-8.025 2.028-27.291-1.999-27.291-.472 0-1.076-.833-1.342-1.851-.496-1.898-10.273-8.095-14.749-9.35a787.86 787.86 0 0 1-8-2.328c-5.262-1.558-12.349-3.493-20.104-5.488-9.909-2.55-16.588-8.081-17.015-14.09-.649-9.153.5-11.891 7.327-17.444 7.596-6.179 28.105-5.571 42.476 1.259 7.713 3.666 11.896.724 9.957-7.003-1.815-7.229-29.062-12.67-46.29-9.243m619.816.032c-6.419 1.274-7.463 1.664-17.034 6.368-26.669 13.107-37.583 58.942-19.141 80.384.593.69 2.075 2.644 3.293 4.342 4.698 6.551 14.461 13.215 25.215 17.211 11.491 4.27 33.463 4.09 43.151-.354 1.733-.795 3.667-1.445 4.298-1.445 1.483 0 11.167-6.202 12.822-8.212.958-1.163 1.204-6.68 1-22.415L786.5 738.5h-11l-.273 17.615c-.332 21.463-.521 21.74-17.227 25.189-9.918 2.048-27.38.716-30.415-2.319-.542-.542-1.74-.985-2.663-.985-1.988 0-15.708-12.444-17.013-15.43-.497-1.138-1.295-2.745-1.773-3.57-23.1-39.871 30.961-83.464 68.845-55.514 7.296 5.383 16.382-3.249 9.307-8.842-13.365-10.568-32.745-14.794-51.121-11.15M990 683.418c-25.019 4.596-37.799 33.133-21.483 47.969 7.292 6.632 11.338 8.307 36.483 15.107 3.575.967 7.918 2.376 9.651 3.132 1.733.756 3.593 1.374 4.132 1.374 3.873 0 9.217 8.345 9.201 14.368-.028 10.935-6.475 15.458-25.773 18.084-7.683 1.046-30.862-6.001-33.511-10.188-1.348-2.131-5.346-1.454-7.085 1.201-9.686 14.783 38.35 27.285 62.978 16.391 5.602-2.478 15.407-12.202 15.407-15.28 0-.829.769-3.121 1.709-5.091 6.789-14.238-6.921-29.074-33.709-36.476a342.875 342.875 0 0 1-8.928-2.626c-2.436-.761-5.048-1.383-5.805-1.383-3.083 0-10.999-4.469-14.517-8.195-13.908-14.734 11.807-34.277 34.795-26.444 2.646.901 5.64 1.639 6.653 1.639s3.624 1.125 5.802 2.5c4.637 2.927 7.837 3.206 8.622.75.308-.962 1.028-2.732 1.602-3.933 4.187-8.768-24.75-16.844-46.224-12.899m-816.418 1.143c-1.921 1.921-2.085 7.777-.259 9.292.819.68 7.967 1.203 18.75 1.373l17.427.274.524 49c.288 26.95.625 49.112.75 49.25.635.702 10.933.088 12.226-.729 1.302-.824 1.46-6.455 1.195-42.735-.167-22.982-.01-44.814.349-48.514l.655-6.728 18.15-.272 18.151-.272v-11l-43.168-.261c-38.259-.23-43.348-.08-44.75 1.322m106.08-.08c-1.881 1.881-2.361 105.972-.499 108.215 1.29 1.555 9.167 1.733 11.903.269 1.788-.957 1.934-2.24 1.934-17V760l12.75-.047c7.012-.026 14.784-.229 17.27-.451 5.695-.509 5.222-.888 13.744 10.998 3.944 5.5 7.537 10.45 7.985 11 .448.55 1.783 2.575 2.966 4.5 4.216 6.856 5.889 8 11.702 8 9.561 0 8.635-3.146-6.599-22.435-1.275-1.615-3.98-5.44-6.011-8.5l-3.693-5.565 2.45-2c1.348-1.1 4.654-3.557 7.347-5.46 21.188-14.973 16.782-50.606-7.684-62.143-10.248-4.832-61.48-7.501-65.565-3.416m145.116-.231c-.882.688-2.959 4.175-4.616 7.75a2544.409 2544.409 0 0 1-7.086 15.113c-2.242 4.737-4.076 8.911-4.076 9.276 0 .364-1.982 4.813-4.404 9.886-2.422 5.074-5.297 11.25-6.388 13.725-2.221 5.035-5.583 12.397-11.42 25-2.165 4.675-4.534 9.85-5.266 11.5-.731 1.65-2.689 5.756-4.352 9.124-3.609 7.311-3.053 8.376 4.375 8.376 4.905 0 8.455-1.895 8.455-4.513 0-.855.597-2.193 7.475-16.737l3.665-7.75H459.659l3.081 6.25c5.15 10.447 8.26 17.39 8.26 18.442 0 2.42 3.815 4.308 8.706 4.308 6.096 0 7.809-1.494 5.781-5.039-.775-1.354-1.699-3.136-2.055-3.961-.355-.825-1.224-2.85-1.929-4.5-3.233-7.557-6.708-15.132-7.57-16.5-.52-.825-1.217-2.175-1.548-3-.331-.825-1.509-3.525-2.618-6-1.11-2.475-3.12-6.975-4.467-10-4.641-10.42-5.136-11.523-8.305-18.5-1.75-3.85-4.759-10.375-6.688-14.5-6.996-14.964-9.129-19.576-10.951-23.68-1.024-2.306-2.753-4.429-3.856-4.736-3.497-.973-9.062-.627-10.722.666m62.422-.05c-1.614 1.614-1.528 8.283.124 9.654.823.683 8.097 1.202 19.25 1.372l17.926.274.5 49 .5 49h12l.26-47.909c.309-56.997-2.181-50.591 19.662-50.591 12.027 0 17.538-.36 18.378-1.2 1.995-1.995 1.5-8.569-.734-9.765-2.929-1.567-86.29-1.411-87.866.165m106.414.363c-.798 2.079-.805 105.777-.007 107.855.835 2.176 76.444 2.43 78.243.263 1.487-1.793.839-8.632-.924-9.748-.784-.496-14.926-.916-31.426-.933-36.482-.037-32.608 2.312-32.274-19.574l.274-17.926 26.5-.258c29.588-.288 29-.139 29-7.326 0-5.014.577-4.916-28.975-4.916-22.614 0-25.886-.196-26.418-1.582-1.19-3.1-.672-32.953.593-34.218.878-.878 9.007-1.204 30.25-1.215 15.978-.009 29.656-.4 30.397-.869 1.774-1.124 2.06-8.067.4-9.726-2.168-2.168-74.798-2.002-75.633.173m225.627-.733c-.991.629-1.204 12.348-1 55.234l.259 54.436 5.393.307c7.657.436 7.217 3.812 7.133-54.641-.086-60.529-.505-62.497-11.785-55.336m46.794 1.104c-1.719 3.213-1.402 106.517.332 107.956.979.812 12.12 1.06 39.25.872l37.883-.262.298-4.588c.457-7.024 1.265-6.851-33.383-7.147L879.5 781.5l-.272-18.75-.272-18.75h26.822c29.166 0 29.222-.011 29.222-5.618 0-6.734 1.58-6.382-28.607-6.382H879v-37h30.465c33.909 0 32.535.291 32.535-6.899 0-5.545-73.062-8.591-75.965-3.167m-572.368 10.733c-1.005 1.005-.771 49.621.247 51.228 1.5 2.369 35.994.972 42.753-1.733 20.333-8.136 21.505-37.811 1.833-46.424-7.457-3.265-42.256-5.649-44.833-3.071m134.563 8.603c-1.158 2.326-3.69 7.94-5.627 12.473-1.937 4.534-5.051 11.509-6.921 15.5-1.869 3.992-4.159 9.057-5.089 11.257-.929 2.2-2.118 4.781-2.641 5.736-2 3.649-1.314 3.764 22.548 3.764 14.376 0 23.5-.373 23.5-.962 0-.529-2.025-5.295-4.5-10.592-2.475-5.297-4.5-9.998-4.5-10.446 0-.449-1.182-3.219-2.626-6.158-1.444-2.938-3.31-6.917-4.146-8.842-.837-1.925-1.908-4.175-2.381-5-.473-.825-1.039-1.95-1.257-2.5-3.436-8.637-3.985-9.003-6.36-4.23"
      />
    </svg>
  );
}

function DfxAssetIconTGT({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 396 396"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx={198} cy={197.891} r={197.633} fill="url(#tgt-a)" />
      <circle cx={198} cy={197.891} r={183.652} stroke="#fff" strokeWidth={2} />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="m208.43 193.721-55.659-51.691 155.078-59.638L208.43 193.72Zm55.661 51.756L88.151 313.39l120.281-119.67 55.659 51.757Z"
        clipRule="evenodd"
      />
      <defs>
        <linearGradient id="tgt-a" x1={198} x2={-197.266} y1={-197.374} y2={197.891} gradientUnits="userSpaceOnUse">
          <stop stopColor={forceColor ?? '#3F9'} />
          <stop offset={1} stopColor={forceColor ?? '#0CF'} />
        </linearGradient>
      </defs>
    </svg>
  );
}

function DfxAssetIconEURS({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 2500 2500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <linearGradient
        id="eurs-a"
        x1={807.865}
        x2={1255.864}
        y1={1219.284}
        y2={1716.284}
        gradientTransform="matrix(3.7369 0 0 -3.7369 -2605.549 6734.046)"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset={0}
          style={{
            stopColor: '#15bcff',
          }}
        />
        <stop
          offset={0.361}
          style={{
            stopColor: '#219bf6',
          }}
        />
        <stop
          offset={0.502}
          style={{
            stopColor: '#2d79ed',
          }}
        />
        <stop
          offset={0.722}
          style={{
            stopColor: '#725ded',
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#b741ee',
          }}
        />
      </linearGradient>
      <path
        d="M1251.9 2500C560.5 2500 0 1939.5 0 1248.1S560.5-3.7 1251.9-3.7c93.4 0 183.1 11.2 269.1 29.9-183.1 63.5-343.8 160.7-478.3 287.7s-243 280.3-306.5 455.9H467.1l-130.8 299h325.1c-3.7 41.1-7.5 82.2-7.5 123.3 0 67.3 7.5 134.5 18.7 198.1H429.7l-112.1 299H766c67.3 142 160.7 269.1 276.5 377.4 183.1 171.9 418.5 295.2 683.9 340.1-145.7 59.7-306.4 93.3-474.5 93.3zm646.5-2324.4C2264.6 384.9 2500 833.3 2500 1251.9c0 366.2-164.4 710-437.2 952.9-310.2 63.5-594.2-85.9-818.4-310.2-44.8-44.8-82.2-119.6-119.6-179.4-3.7-7.5-11.2-14.9-14.9-22.4h728.7l108.4-287.7H979.1c-11.2-48.6-18.7-100.9-22.4-153.2 0-18.7-3.7-37.4-3.7-56.1v-7.4c0-44.8 3.7-89.7 7.5-130.8h1121.1l115.8-284h-1136c48.6-93.4 108.4-213 183.1-287.7 179.4-179.4 399.9-321.4 650.2-310.2h3.7z"
        style={{
          fillRule: 'evenodd',
          clipRule: 'evenodd',
          fill: forceColor ?? 'url(#eurs-a)',
        }}
      />
    </svg>
  );
}

function DfxAssetIconEURt({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 1000 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={forceColor ?? '#000'}
        d="M543.792 420.282v-44.911h129.854v-64.78H327.71v64.78h129.858v44.911c-91.202 4.799-159.623 24.515-160.133 48.143v49.255c.507 23.628 68.931 43.34 160.133 48.139V676.04h86.225V565.819c91.198-4.799 159.623-24.511 160.129-48.139l.004-49.255c-.51-23.628-68.935-43.344-160.133-48.143Zm155.472 72.769c-19.909 22.26-101.26 38.928-198.587 38.928S322 515.31 302.09 493.051c16.883-18.877 77.948-33.729 155.476-37.813v47.027c13.895.728 28.317 1.116 43.11 1.116s29.219-.388 43.114-1.116v-47.027c77.524 4.083 138.59 18.936 155.472 37.813ZM500 0C223.858 0 0 223.858 0 500s223.858 500 500 500 500-223.858 500-500S776.142 0 500 0Zm21.121 851.707c-11.842 11.703-30.893 11.703-42.735 0L113.32 490.91c-10.05-9.935-11.933-25.488-4.542-37.536l141.961-231.359a30.408 30.408 0 0 1 25.911-14.501h455.853a30.402 30.402 0 0 1 26.351 15.241l132.809 230.872c6.884 11.972 4.839 27.086-4.985 36.796L521.121 851.706Z"
      />
    </svg>
  );
}

function DfxAssetIconEDLC({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 425.198 425.198"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient
          id="edlc-a"
          cx={0}
          cy={0}
          r={608.933}
          gradientTransform="matrix(0 -1 1.11019 0 43.592 381.75)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} stopColor="#dd7cf3" />
          <stop offset={1} stopColor="#0064be" />
        </radialGradient>
      </defs>
      <g fill="none">
        <path
          fill={forceColor ?? 'url(#edlc-a)'}
          stroke="none"
          d="M63.241 62.916C49.99 76.076 43.322 93.473 43.412 110.87v68.072c-.09 17.397 6.587 34.794 19.847 47.954 13.178 13.251 30.593 19.919 48.008 19.829l270.519-.361c.09-17.397-6.587-34.794-19.847-47.954-13.178-13.246-30.593-19.558-48.008-19.468l-169.007-.216c-32.908.216-33.923-25.09-33.837-33.838.077-8.531.113-33.968 33.837-33.837h169.079c17.397.09 34.794-6.398 47.954-19.649 13.251-13.16 19.919-30.557 19.829-47.954H111.195c-17.397-.09-34.794 6.222-47.954 19.468Zm0 299.186c13.16 13.25 30.557 19.738 47.954 19.648l270.591-.181c.09-17.397-6.578-34.793-19.829-47.954-13.16-13.246-30.557-19.558-47.954-19.468H43.412c-.09 17.397 6.578 34.794 19.829 47.955Z"
          transform="matrix(1 0 0 -1 0 425.198)"
        />
      </g>
    </svg>
  );
}

function DfxAssetIconDEURO({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 96 97"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#deuro_a)">
        <path fill="url(#deuro_b)" d="M48 96.6c26.51 0 48-21.49 48-48S74.51.6 48 .6 0 22.09 0 48.6s21.49 48 48 48Z" />
        <path fill="url(#deuro_c)" d="M48 96.6c26.51 0 48-21.49 48-48S74.51.6 48 .6 0 22.09 0 48.6s21.49 48 48 48Z" />
        <path
          fill="url(#deuro_d)"
          d="M48 3.6c24.81 0 45 20.19 45 45s-20.19 45-45 45-45-20.19-45-45 20.19-45 45-45Zm0-3C21.48.6 0 22.08 0 48.6s21.48 48 48 48 48-21.48 48-48S74.52.6 48 .6Z"
        />
        <path
          fill={forceColor ?? '#272B38'}
          fillOpacity={0.45}
          d="M60 78.6v-6H36v6h24ZM66 66.6h-6v6h6v-6ZM36 66.6h-6v6h6v-6ZM72 60.6h-6v6h6v-6ZM72 36.6h-6v6h6v-6ZM24 42.6h-6v6h6v6h-6v6h6v6h6v-6h24v-6H30v-6h30v-6H30v-6h-6v6ZM66 30.6h-6v6h6v-6Z"
        />
        <path fill={forceColor ?? '#272B38'} fillOpacity={0.45} d="M36 30.6h-6v6h6v-6ZM36 24.6v6h24v-6H36Z" />
        <path fill="url(#deuro_e)" d="M60 75.6v-6H36v6h24Z" />
        <path fill="url(#deuro_f)" d="M66 63.6h-6v6h6v-6Z" />
        <path fill="url(#deuro_g)" d="M36 63.6h-6v6h6v-6Z" />
        <path fill="url(#deuro_h)" d="M72 57.6h-6v6h6v-6Z" />
        <path fill="url(#deuro_i)" d="M72 33.6h-6v6h6v-6Z" />
        <path fill="url(#deuro_j)" d="M24 39.6h-6v6h6v6h-6v6h6v6h6v-6h24v-6H30v-6h30v-6H30v-6h-6v6Z" />
        <path fill="url(#deuro_k)" d="M66 27.6h-6v6h6v-6Z" />
        <path fill="url(#deuro_l)" d="M36 27.6h-6v6h6v-6Z" />
        <path fill="url(#deuro_m)" d="M36 21.6v6h24v-6H36Z" />
      </g>
      <defs>
        <linearGradient id="deuro_b" x1={48} x2={48} y1={96.6} y2={0.6} gradientUnits="userSpaceOnUse">
          <stop stopColor={forceColor ?? '#424756'} />
          <stop offset={0.31} stopColor={forceColor ?? '#505565'} />
          <stop offset={0.42} stopColor={forceColor ?? '#5F6475'} />
          <stop offset={0.61} stopColor={forceColor ?? '#747A8B'} />
          <stop offset={0.73} stopColor={forceColor ?? '#7C8394'} />
          <stop offset={0.88} stopColor={forceColor ?? '#757C8C'} />
          <stop offset={1} stopColor={forceColor ?? '#6E7484'} />
        </linearGradient>
        <linearGradient id="deuro_d" x1={48} x2={48} y1={96.6} y2={0.6} gradientUnits="userSpaceOnUse">
          <stop stopColor={forceColor ?? '#6D6E7C'} />
          <stop offset={0.17} stopColor={forceColor ?? '#7A7C8A'} />
          <stop offset={0.51} stopColor={forceColor ?? '#9EA2B1'} />
          <stop offset={0.67} stopColor={forceColor ?? '#B3B8C7'} />
        </linearGradient>
        <linearGradient id="deuro_e" x1={45} x2={45} y1={24.6} y2={72.1} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.54} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.84} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="deuro_f" x1={45} x2={45} y1={24.6} y2={72.1} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.54} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.84} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="deuro_g" x1={45} x2={45} y1={24.6} y2={72.1} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.54} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.84} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="deuro_h" x1={45} x2={45} y1={24.6} y2={72.1} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.54} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.84} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="deuro_i" x1={45} x2={45} y1={24.6} y2={72.1} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.54} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.84} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="deuro_j" x1={45} x2={45} y1={24.6} y2={72.1} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.54} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.84} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="deuro_k" x1={45} x2={45} y1={24.6} y2={72.1} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.54} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.84} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="deuro_l" x1={45} x2={45} y1={24.6} y2={72.1} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.54} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.84} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="deuro_m" x1={45} x2={45} y1={24.6} y2={72.1} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.54} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.84} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <radialGradient
          id="deuro_c"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(0 48 -48 0 48 48.6)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.802} stopColor={forceColor ?? '#272B38'} stopOpacity={0} />
          <stop offset={0.848} stopColor={forceColor ?? '#272B38'} stopOpacity={0.042} />
          <stop offset={0.883} stopColor={forceColor ?? '#272B38'} stopOpacity={0.095} />
          <stop offset={0.914} stopColor={forceColor ?? '#272B38'} stopOpacity={0.15} />
          <stop offset={0.957} stopColor={forceColor ?? '#272B38'} stopOpacity={0.34} />
        </radialGradient>
        <clipPath id="deuro_a">
          <path fill="#fff" d="M0 .6h96v96H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

function DfxAssetIconDEPS({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 96 97"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#deps_a)">
        <path fill="url(#deps_b)" d="M48 96.6c26.51 0 48-21.49 48-48S74.51.6 48 .6 0 22.09 0 48.6s21.49 48 48 48Z" />
        <path fill="url(#deps_c)" d="M48 96.6c26.51 0 48-21.49 48-48S74.51.6 48 .6 0 22.09 0 48.6s21.49 48 48 48Z" />
        <path
          fill="url(#deps_d)"
          d="M48 3.6c24.81 0 45 20.19 45 45s-20.19 45-45 45-45-20.19-45-45 20.19-45 45-45Zm0-3C21.48.6 0 22.08 0 48.6s21.48 48 48 48 48-21.48 48-48S74.52.6 48 .6Z"
        />
        <path
          fill={forceColor ?? '#272B38'}
          fillOpacity={0.45}
          d="M28.1 75v3.6h39.6V75H28.1ZM28.1 60.6h-3.6V75h3.6V60.6ZM67.7 75h3.6V60.6h-3.6V75ZM49.7 49.8v-3.6h3.6v-3.6h-3.6v-7.2h-3.6v10.8H35.3v3.6h10.8v14.4h-3.6v3.6h-3.6v3.6h18v-3.6h-3.6v-3.6h-3.6V53.4h14.4v-3.6H49.7ZM67.7 46.2h-3.6v3.6h3.6v-3.6ZM35.3 42.6h-3.6v3.6h3.6v-3.6Z"
        />
        <path
          fill={forceColor ?? '#272B38'}
          fillOpacity={0.45}
          d="M56.9 39h-3.6v3.6h3.6V39ZM31.7 39h-3.6v3.6h3.6V39ZM56.9 35.4V39h10.8v7.2h3.6V35.4H56.9ZM46.1 31.8h-3.6v3.6h3.6v-3.6ZM28.1 28.2h10.8v-3.6H24.5V39h3.6V28.2Z"
        />
        <path fill={forceColor ?? '#272B38'} fillOpacity={0.45} d="M42.5 28.2h-3.6v3.6h3.6v-3.6Z" />
        <path fill="url(#deps_e)" d="M28.1 72v3.6h39.6V72H28.1Z" />
        <path fill="url(#deps_f)" d="M28.1 57.6h-3.6V72h3.6V57.6Z" />
        <path fill="url(#deps_g)" d="M67.7 72h3.6V57.6h-3.6V72Z" />
        <path
          fill="url(#deps_h)"
          d="M49.7 46.8v-3.6h3.6v-3.6h-3.6v-7.2h-3.6v10.8H35.3v3.6h10.8v14.4h-3.6v3.6h-3.6v3.6h18v-3.6h-3.6v-3.6h-3.6V50.4h14.4v-3.6H49.7Z"
        />
        <path fill="url(#deps_i)" d="M67.7 43.2h-3.6v3.6h3.6v-3.6Z" />
        <path fill="url(#deps_j)" d="M35.3 39.6h-3.6v3.6h3.6v-3.6Z" />
        <path fill="url(#deps_k)" d="M56.9 36h-3.6v3.6h3.6V36Z" />
        <path fill="url(#deps_l)" d="M31.7 36h-3.6v3.6h3.6V36Z" />
        <path fill="url(#deps_m)" d="M56.9 32.4V36h10.8v7.2h3.6V32.4H56.9Z" />
        <path fill="url(#deps_n)" d="M46.1 28.8h-3.6v3.6h3.6v-3.6Z" />
        <path fill="url(#deps_o)" d="M28.1 25.2h10.8v-3.6H24.5V36h3.6V25.2Z" />
        <path fill="url(#deps_p)" d="M42.5 25.2h-3.6v3.6h3.6v-3.6Z" />
      </g>
      <defs>
        <linearGradient id="deps_b" x1={48} x2={48} y1={96.6} y2={0.6} gradientUnits="userSpaceOnUse">
          <stop stopColor={forceColor ?? '#424756'} />
          <stop offset={0.31} stopColor={forceColor ?? '#505565'} />
          <stop offset={0.42} stopColor={forceColor ?? '#5F6475'} />
          <stop offset={0.61} stopColor={forceColor ?? '#747A8B'} />
          <stop offset={0.73} stopColor={forceColor ?? '#7C8394'} />
          <stop offset={0.88} stopColor={forceColor ?? '#757C8C'} />
          <stop offset={1} stopColor={forceColor ?? '#6E7484'} />
        </linearGradient>
        <linearGradient id="deps_d" x1={48} x2={48} y1={96.6} y2={0.6} gradientUnits="userSpaceOnUse">
          <stop stopColor={forceColor ?? '#6D6E7C'} />
          <stop offset={0.17} stopColor={forceColor ?? '#7A7C8A'} />
          <stop offset={0.51} stopColor={forceColor ?? '#9EA2B1'} />
          <stop offset={0.67} stopColor={forceColor ?? '#B3B8C7'} />
        </linearGradient>
        <linearGradient id="deps_e" x1={47.9} x2={47.9} y1={30.24} y2={75.6} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.675} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.865} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="deps_f" x1={47.9} x2={47.9} y1={30.24} y2={75.6} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.675} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.865} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="deps_g" x1={47.9} x2={47.9} y1={30.24} y2={75.6} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.675} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.865} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="deps_h" x1={47.9} x2={47.9} y1={30.24} y2={75.6} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.675} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.865} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="deps_i" x1={47.9} x2={47.9} y1={30.24} y2={75.6} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.675} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.865} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="deps_j" x1={47.9} x2={47.9} y1={30.24} y2={75.6} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.675} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.865} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="deps_k" x1={47.9} x2={47.9} y1={30.24} y2={75.6} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.675} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.865} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="deps_l" x1={47.9} x2={47.9} y1={30.24} y2={75.6} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.675} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.865} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="deps_m" x1={47.9} x2={47.9} y1={30.24} y2={75.6} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.675} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.865} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="deps_n" x1={47.9} x2={47.9} y1={30.24} y2={75.6} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.675} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.865} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="deps_o" x1={47.9} x2={47.9} y1={30.24} y2={75.6} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.675} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.865} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="deps_p" x1={47.9} x2={47.9} y1={30.24} y2={75.6} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.675} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.865} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <radialGradient
          id="deps_c"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(0 48 -48 0 48 48.6)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.802} stopColor={forceColor ?? '#272B38'} stopOpacity={0} />
          <stop offset={0.848} stopColor={forceColor ?? '#272B38'} stopOpacity={0.042} />
          <stop offset={0.883} stopColor={forceColor ?? '#272B38'} stopOpacity={0.095} />
          <stop offset={0.914} stopColor={forceColor ?? '#272B38'} stopOpacity={0.15} />
          <stop offset={0.957} stopColor={forceColor ?? '#272B38'} stopOpacity={0.34} />
        </radialGradient>
        <clipPath id="deps_a">
          <path fill="#fff" d="M0 .6h96v96H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

function DfxAssetIconNDEPS({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 96 97"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#ndeps_a)">
        <path fill="url(#ndeps_b)" d="M48 96.6c26.51 0 48-21.49 48-48S74.51.6 48 .6 0 22.09 0 48.6s21.49 48 48 48Z" />
        <path fill="url(#ndeps_c)" d="M48 96.6c26.51 0 48-21.49 48-48S74.51.6 48 .6 0 22.09 0 48.6s21.49 48 48 48Z" />
        <path
          fill="url(#ndeps_d)"
          d="M48 3.6c24.81 0 45 20.19 45 45s-20.19 45-45 45-45-20.19-45-45 20.19-45 45-45Zm0-3C21.48.6 0 22.08 0 48.6s21.48 48 48 48 48-21.48 48-48S74.52.6 48 .6Z"
        />
        <path
          fill={forceColor ?? '#272B38'}
          fillOpacity={0.45}
          d="M49.923 55.523v-3.846h3.846v-3.846h-3.846v-7.692h-3.846v11.538H30.693v3.846h15.384v15.384H42.23v3.847h-3.846V78.6h19.23v-3.846h-3.846v-3.847h-3.846V59.37h15.384v-3.846H49.923ZM69.153 51.677h-3.846v3.846h3.846v-3.846ZM73 47.83h-3.847v3.846H73V47.83ZM30.692 47.83h-3.846v3.846l3.846.001V47.83Z"
        />
        <path
          fill={forceColor ?? '#272B38'}
          fillOpacity={0.45}
          d="M57.615 43.984H53.77v3.847l3.846-.001v-3.846ZM26.846 43.984H23v3.846h3.846v-3.846ZM61.461 40.139h-3.846v3.845h3.846V40.14ZM61.461 36.292v3.847L73 40.138v7.692h3.847V36.292H61.46ZM46.077 36.292H42.23v3.846h3.846v-3.846ZM23 32.446h15.385V28.6h-19.23v15.384H23V32.446Z"
        />
        <path fill={forceColor ?? '#272B38'} fillOpacity={0.45} d="M42.23 32.447h-3.845v3.846h3.846v-3.846Z" />
        <path
          fill="url(#ndeps_e)"
          d="M49.923 52.523v-3.846h3.846v-3.846h-3.846v-7.692h-3.846v11.538H30.693v3.846h15.384v15.384H42.23v3.847h-3.846V75.6h19.23v-3.846h-3.846v-3.847h-3.846V56.37h15.384v-3.846H49.923Z"
        />
        <path fill="url(#ndeps_f)" d="M69.153 48.677h-3.846v3.846h3.846v-3.846Z" />
        <path fill="url(#ndeps_g)" d="M73 44.83h-3.847v3.846H73V44.83Z" />
        <path fill="url(#ndeps_h)" d="M30.692 44.83h-3.846v3.846l3.846.001V44.83Z" />
        <path fill="url(#ndeps_i)" d="M57.615 40.984H53.77v3.847l3.846-.001v-3.846Z" />
        <path fill="url(#ndeps_j)" d="M26.846 40.984H23v3.846h3.846v-3.846Z" />
        <path fill="url(#ndeps_k)" d="M61.461 37.139h-3.846v3.845h3.846V37.14Z" />
        <path fill="url(#ndeps_l)" d="M61.461 33.292v3.847L73 37.138v7.692h3.847V33.292H61.46Z" />
        <path fill="url(#ndeps_m)" d="M46.077 33.292H42.23v3.846h3.846v-3.846Z" />
        <path fill="url(#ndeps_n)" d="M23 29.446h15.385V25.6h-19.23v15.384H23V29.446Z" />
        <path fill="url(#ndeps_o)" d="M42.23 29.447h-3.845v3.846h3.846v-3.846Z" />
      </g>
      <defs>
        <linearGradient id="ndeps_b" x1={48} x2={48} y1={96.6} y2={0.6} gradientUnits="userSpaceOnUse">
          <stop stopColor={forceColor ?? '#424756'} />
          <stop offset={0.31} stopColor={forceColor ?? '#505565'} />
          <stop offset={0.42} stopColor={forceColor ?? '#5F6475'} />
          <stop offset={0.61} stopColor={forceColor ?? '#747A8B'} />
          <stop offset={0.73} stopColor={forceColor ?? '#7C8394'} />
          <stop offset={0.88} stopColor={forceColor ?? '#757C8C'} />
          <stop offset={1} stopColor={forceColor ?? '#6E7484'} />
        </linearGradient>
        <linearGradient id="ndeps_d" x1={48} x2={48} y1={96.6} y2={0.6} gradientUnits="userSpaceOnUse">
          <stop stopColor={forceColor ?? '#6D6E7C'} />
          <stop offset={0.17} stopColor={forceColor ?? '#7A7C8A'} />
          <stop offset={0.51} stopColor={forceColor ?? '#9EA2B1'} />
          <stop offset={0.67} stopColor={forceColor ?? '#B3B8C7'} />
        </linearGradient>
        <linearGradient id="ndeps_e" x1={48} x2={48} y1={27.363} y2={78.09} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.655} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.85} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="ndeps_f" x1={48} x2={48} y1={27.363} y2={78.09} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.655} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.85} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="ndeps_g" x1={48} x2={48} y1={27.363} y2={78.09} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.655} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.85} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="ndeps_h" x1={48} x2={48} y1={27.363} y2={78.09} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.655} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.85} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="ndeps_i" x1={48} x2={48} y1={27.363} y2={78.09} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.655} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.85} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="ndeps_j" x1={48} x2={48} y1={27.363} y2={78.09} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.655} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.85} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="ndeps_k" x1={48} x2={48} y1={27.363} y2={78.09} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.655} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.85} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="ndeps_l" x1={48} x2={48} y1={27.363} y2={78.09} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.655} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.85} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="ndeps_m" x1={48} x2={48} y1={27.363} y2={78.09} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.655} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.85} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="ndeps_n" x1={48} x2={48} y1={27.363} y2={78.09} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.655} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.85} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <linearGradient id="ndeps_o" x1={48} x2={48} y1={27.363} y2={78.09} gradientUnits="userSpaceOnUse">
          <stop offset={0.4} stopColor="#fff" />
          <stop offset={0.655} stopColor={forceColor ? '#fff' : '#EAEAEC'} />
          <stop offset={0.85} stopColor={forceColor ? '#fff' : '#C4C6CB'} />
          <stop offset={0.99} stopColor={forceColor ? '#fff' : '#B6B8BF'} />
        </linearGradient>
        <radialGradient
          id="ndeps_c"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(0 48 -48 0 48 48.6)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.802} stopColor={forceColor ?? '#272B38'} stopOpacity={0} />
          <stop offset={0.848} stopColor={forceColor ?? '#272B38'} stopOpacity={0.042} />
          <stop offset={0.883} stopColor={forceColor ?? '#272B38'} stopOpacity={0.095} />
          <stop offset={0.914} stopColor={forceColor ?? '#272B38'} stopOpacity={0.15} />
          <stop offset={0.957} stopColor={forceColor ?? '#272B38'} stopOpacity={0.34} />
        </radialGradient>
        <clipPath id="ndeps_a">
          <path fill="#fff" d="M0 .6h96v96H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

function DfxAssetIconSOL({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 397.7 311.7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <linearGradient
        id="sol_a"
        x1={360.879}
        x2={141.213}
        y1={351.455}
        y2={-69.294}
        gradientTransform="matrix(1 0 0 -1 0 314)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0} style={{ stopColor: '#00ffa3' }} />
        <stop offset={1} style={{ stopColor: '#dc1fff' }} />
      </linearGradient>
      <path
        d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"
        style={{ fill: forceColor ?? 'url(#sol_a)' }}
      />

      <linearGradient
        id="sol_b"
        x1={264.829}
        x2={45.163}
        y1={401.601}
        y2={-19.148}
        gradientTransform="matrix(1 0 0 -1 0 314)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0} style={{ stopColor: '#00ffa3' }} />
        <stop offset={1} style={{ stopColor: '#dc1fff' }} />
      </linearGradient>
      <path
        d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"
        style={{ fill: forceColor ?? 'url(#sol_b)' }}
      />

      <linearGradient
        id="sol_c"
        x1={312.548}
        x2={92.882}
        y1={376.688}
        y2={-44.061}
        gradientTransform="matrix(1 0 0 -1 0 314)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0} style={{ stopColor: '#00ffa3' }} />
        <stop offset={1} style={{ stopColor: '#dc1fff' }} />
      </linearGradient>
      <path
        d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"
        style={{ fill: forceColor ?? 'url(#sol_c)' }}
      />
    </svg>
  );
}

function DfxAssetIconXDAI({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="60 60 260 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={forceColor ?? '#09E23A'}
        d="M129 87c6.96 5.588 13.2 12.088 19.454 18.44 1.486 1.508 2.976 3.012 4.467 4.514a5312.89 5312.89 0 0 1 12.673 12.812c2.599 2.636 5.205 5.265 7.816 7.89.987.995 1.972 1.993 2.954 2.994a765.055 765.055 0 0 0 4.118 4.157l2.358 2.387c2.735 2.381 2.735 2.381 6.16 2.806 1.98-1.524 3.548-2.967 5.252-4.764l1.55-1.571a492.835 492.835 0 0 0 3.316-3.407 679.63 679.63 0 0 1 5.277-5.397c4.39-4.459 8.755-8.943 13.12-13.427 3.68-3.78 7.37-7.548 11.074-11.303a812.575 812.575 0 0 0 5.147-5.306c6.81-6.968 13.27-12.869 23.205-14.454 11.194.205 18.12 2.163 26.336 9.84 5.859 6.084 7.78 12.298 8.098 20.602-.218 10.254-4.28 17.062-11.375 24.187l-2.056 2.07c-3.116 3.116-6.276 6.187-9.431 9.263-3.51 3.43-7.004 6.876-10.498 10.322a1327.982 1327.982 0 0 1-5.552 5.429 1286.434 1286.434 0 0 0-8.01 7.877l-2.522 2.428c-3.41 3.408-5.644 5.725-7.147 10.363.383 5.756 3.775 9.05 7.776 12.94l2.792 2.733 1.486 1.441a928.078 928.078 0 0 1 4.63 4.535c4.376 4.309 8.759 8.61 13.164 12.888 2.7 2.625 5.386 5.265 8.063 7.915 1.014.997 2.033 1.99 3.058 2.976 7.583 7.3 13.974 14.945 15.938 25.554-.453 10.597-2.817 18.943-10.878 26.391-8.385 6.722-16.164 7.86-26.813 6.875-11.394-1.8-20.263-14.125-27.953-21.89l-4.144-4.161c-2.386-2.398-4.77-4.798-7.153-7.199-3.773-3.8-7.55-7.596-11.328-11.39l-2.595-2.62c-4.124-4.141-8.25-8.105-12.827-11.74-3.826 1.574-6.195 3.984-9.069 6.921l-1.49 1.514a1173.042 1173.042 0 0 0-3.188 3.254 1247.79 1247.79 0 0 1-5.076 5.159c-4.82 4.878-9.63 9.765-14.426 14.668a1855.292 1855.292 0 0 1-8.845 8.974 559.1 559.1 0 0 0-3.34 3.412c-7.16 7.372-13.93 13.888-24.402 15.797-9.996-.033-17.73-1.904-25.355-8.633-5.71-6.115-8.602-12.831-8.934-21.23l.125-3.461.063-3.414c2.028-12.374 14.384-21.905 22.874-30.211 1.347-1.335 2.693-2.671 4.038-4.008 11.342-11.236 11.342-11.236 17.432-16.375 8.286-6.965 8.286-6.965 11.936-16.7-.424-4.53-1.536-5.7-4.762-8.833l-1.424-1.412c-1.55-1.531-3.125-3.036-4.7-4.543a1416.156 1416.156 0 0 1-3.26-3.208 1355.17 1355.17 0 0 0-8.62-8.4 2598.844 2598.844 0 0 1-13.746-13.428 862.646 862.646 0 0 0-4.794-4.645c-8.83-8.58-14.793-16.178-15.537-28.886.173-8.14 3.295-14.647 8.621-20.738C102.075 83.138 116.486 80.258 129 87Z"
      />
      <path
        fill={forceColor ?? '#0CB40A'}
        d="M212 169c4.782 4 9.328 8.164 13.758 12.55l1.925 1.894c2.079 2.05 4.154 4.103 6.227 6.158l2.165 2.144a9316.21 9316.21 0 0 1 11.322 11.246 2535.04 2535.04 0 0 0 9.337 9.234c3.788 3.728 7.562 7.471 11.325 11.225a816.7 816.7 0 0 0 4.298 4.24c17.053 16.722 17.053 16.722 19.334 29.043-.453 10.597-2.817 18.943-10.878 26.391-8.385 6.722-16.164 7.86-26.813 6.875-11.394-1.8-20.263-14.125-27.953-21.89l-4.144-4.161c-2.386-2.398-4.77-4.798-7.153-7.199-3.773-3.8-7.55-7.596-11.328-11.39l-2.595-2.62c-4.124-4.141-8.25-8.105-12.827-11.74 1.51-3.584 3.596-5.777 6.395-8.45l2.646-2.571c1.832-1.763 3.668-3.52 5.508-5.274 8.194-7.989 14.32-16.249 14.826-28.018-.085-5.677-1.8-9.724-4.375-14.687l-1-3Z"
      />
      <path
        fill={forceColor ? '#fff' : '#04795A'}
        d="M272.938 85.563c7.843 4.188 13.993 10.265 17.312 18.562 1.787 9.233 1.521 17.602-3.25 25.875-2.139 2.884-4.469 5.458-7 8l-2.056 2.07c-3.116 3.116-6.276 6.187-9.431 9.263-3.51 3.43-7.004 6.876-10.498 10.322a1327.982 1327.982 0 0 1-5.552 5.429 1286.434 1286.434 0 0 0-8.01 7.877l-2.522 2.428c-4.507 4.504-6.859 7.151-6.931 13.611l-1 2-47-47 1.366-1.144c5.648-4.828 10.871-10.026 16.064-15.333 2.068-2.111 4.147-4.212 6.225-6.315a3094.65 3094.65 0 0 0 11.522-11.708c2.683-2.742 5.378-5.471 8.081-8.193a474.742 474.742 0 0 0 3.04-3.103c11.014-11.337 23.417-19.097 39.64-12.641Z"
      />
      <path
        fill={forceColor ?? '#09E13A'}
        d="M277 88c7.177 5.312 12.26 11.01 14 20 .951 10.188-.712 18.256-7.188 26.313-5.185 5.52-11.65 9.177-19.222 9.925-9.045.253-16.786-1.665-23.965-7.363-5.593-5.318-9.206-12.686-9.828-20.39-.153-8.925 1.616-15.389 7.203-22.485 10.448-10.63 25.656-14.922 39-6Z"
      />
    </svg>
  );
}

function DfxAssetIconTRX({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M61.55 19.28c-3-2.77-7.15-7-10.53-10l-.2-.14a3.82 3.82 0 0 0-1.11-.62C41.56 7 3.63-.09 2.89 0a1.4 1.4 0 0 0-.58.22l-.19.15a2.23 2.23 0 0 0-.52.84l-.05.13v.82C5.82 14.05 22.68 53 26 62.14c.2.62.58 1.8 1.29 1.86h.16c.38 0 2-2.14 2-2.14S58.41 26.74 61.34 23a9.46 9.46 0 0 0 1-1.48 2.41 2.41 0 0 0-.79-2.24Zm-24.67 4.09 12.36-10.25 7.25 6.68Zm-4.8-.67L10.8 5.26l34.43 6.35ZM34 27.27l21.78-3.51-24.9 30ZM7.91 7 30.3 26l-3.24 27.78Z"
        style={{ fill: forceColor ?? '#ff060a' }}
      />
    </svg>
  );
}

function DfxAssetIconZANO({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#url_a)">
        <rect width={512} height={512} fill={forceColor ?? '#0C0C3A'} rx={115} />
        <path
          fill={forceColor ? '#ffffff' : 'url(#url_b)'}
          fillRule="evenodd"
          d="M286.571 80h40.587c13.901 0 25.598 0 35.172.79 10.015.827 19.555 2.624 28.616 7.29 13.803 7.108 25.026 18.45 32.059 32.4 4.617 9.158 6.395 18.799 7.213 28.92.783 9.676.782 21.497.782 35.547v38.905c0 14.05.001 25.871-.782 35.547-.818 10.122-2.596 19.763-7.213 28.921-7.033 13.949-18.256 25.291-32.059 32.399-9.061 4.666-18.601 6.463-28.616 7.29-9.574.791-21.271.791-35.173.79H205.955c-8.513 0-16.196-5.162-19.49-13.096-3.294-7.934-1.557-17.09 4.407-23.23l100.089-103.038 30.166 29.929-64.802 66.712h69.986c14.972 0 24.929-.017 32.577-.648 7.4-.611 10.758-1.69 12.867-2.776a31.252 31.252 0 0 0 13.583-13.728c1.075-2.132 2.142-5.524 2.747-13.004.625-7.729.641-17.792.641-32.923v-37.195c0-15.131-.016-25.194-.641-32.923-.605-7.479-1.672-10.872-2.747-13.004a31.257 31.257 0 0 0-13.583-13.728c-2.109-1.086-5.467-2.165-12.867-2.776-7.648-.631-17.605-.648-32.577-.648h-38.886c-15.136 0-25.21.017-32.942.658-7.487.622-10.872 1.719-12.988 2.818a31.26 31.26 0 0 0-13.602 13.916c-1.062 2.152-2.106 5.586-2.63 13.16-.54 7.821-.434 18.001-.25 33.297l.212 17.567-42.27.521-.222-18.429c-.172-14.207-.317-26.153.359-35.933.707-10.224 2.393-19.976 6.972-29.253 6.97-14.121 18.216-25.626 32.102-32.84 9.123-4.742 18.751-6.565 28.858-7.403 9.668-.803 21.489-.802 35.547-.802Z"
          clipRule="evenodd"
        />
        <path
          fill={forceColor ? '#ffffff' : 'url(#url_c)'}
          fillRule="evenodd"
          d="M286.571 80h40.587c13.901 0 25.598 0 35.172.79 10.015.827 19.555 2.624 28.616 7.29 13.803 7.108 25.026 18.45 32.059 32.4 4.617 9.158 6.395 18.799 7.213 28.92.783 9.676.782 21.497.782 35.547v38.905c0 14.05.001 25.871-.782 35.547-.818 10.122-2.596 19.763-7.213 28.921-7.033 13.949-18.256 25.291-32.059 32.399-9.061 4.666-18.601 6.463-28.616 7.29-9.574.791-21.271.791-35.173.79H205.955c-8.513 0-16.196-5.162-19.49-13.096-3.294-7.934-1.557-17.09 4.407-23.23l100.089-103.038 30.166 29.929-64.802 66.712h69.986c14.972 0 24.929-.017 32.577-.648 7.4-.611 10.758-1.69 12.867-2.776a31.252 31.252 0 0 0 13.583-13.728c1.075-2.132 2.142-5.524 2.747-13.004.625-7.729.641-17.792.641-32.923v-37.195c0-15.131-.016-25.194-.641-32.923-.605-7.479-1.672-10.872-2.747-13.004a31.257 31.257 0 0 0-13.583-13.728c-2.109-1.086-5.467-2.165-12.867-2.776-7.648-.631-17.605-.648-32.577-.648h-38.886c-15.136 0-25.21.017-32.942.658-7.487.622-10.872 1.719-12.988 2.818a31.26 31.26 0 0 0-13.602 13.916c-1.062 2.152-2.106 5.586-2.63 13.16-.54 7.821-.434 18.001-.25 33.297l.212 17.567-42.27.521-.222-18.429c-.172-14.207-.317-26.153.359-35.933.707-10.224 2.393-19.976 6.972-29.253 6.97-14.121 18.216-25.626 32.102-32.84 9.123-4.742 18.751-6.565 28.858-7.403 9.668-.803 21.489-.802 35.547-.802Z"
          clipRule="evenodd"
        />
        <path
          fill={forceColor ? '#ffffff' : 'url(#url_d)'}
          fillRule="evenodd"
          d="M286.571 80h40.587c13.901 0 25.598 0 35.172.79 10.015.827 19.555 2.624 28.616 7.29 13.803 7.108 25.026 18.45 32.059 32.4 4.617 9.158 6.395 18.799 7.213 28.92.783 9.676.782 21.497.782 35.547v38.905c0 14.05.001 25.871-.782 35.547-.818 10.122-2.596 19.763-7.213 28.921-7.033 13.949-18.256 25.291-32.059 32.399-9.061 4.666-18.601 6.463-28.616 7.29-9.574.791-21.271.791-35.173.79H205.955c-8.513 0-16.196-5.162-19.49-13.096-3.294-7.934-1.557-17.09 4.407-23.23l100.089-103.038 30.166 29.929-64.802 66.712h69.986c14.972 0 24.929-.017 32.577-.648 7.4-.611 10.758-1.69 12.867-2.776a31.252 31.252 0 0 0 13.583-13.728c1.075-2.132 2.142-5.524 2.747-13.004.625-7.729.641-17.792.641-32.923v-37.195c0-15.131-.016-25.194-.641-32.923-.605-7.479-1.672-10.872-2.747-13.004a31.257 31.257 0 0 0-13.583-13.728c-2.109-1.086-5.467-2.165-12.867-2.776-7.648-.631-17.605-.648-32.577-.648h-38.886c-15.136 0-25.21.017-32.942.658-7.487.622-10.872 1.719-12.988 2.818a31.26 31.26 0 0 0-13.602 13.916c-1.062 2.152-2.106 5.586-2.63 13.16-.54 7.821-.434 18.001-.25 33.297l.212 17.567-42.27.521-.222-18.429c-.172-14.207-.317-26.153.359-35.933.707-10.224 2.393-19.976 6.972-29.253 6.97-14.121 18.216-25.626 32.102-32.84 9.123-4.742 18.751-6.565 28.858-7.403 9.668-.803 21.489-.802 35.547-.802Z"
          clipRule="evenodd"
        />
        <path
          fill={forceColor ? '#ffffff' : 'url(#url_e)'}
          fillRule="evenodd"
          d="M286.571 80h40.587c13.901 0 25.598 0 35.172.79 10.015.827 19.555 2.624 28.616 7.29 13.803 7.108 25.026 18.45 32.059 32.4 4.617 9.158 6.395 18.799 7.213 28.92.783 9.676.782 21.497.782 35.547v38.905c0 14.05.001 25.871-.782 35.547-.818 10.122-2.596 19.763-7.213 28.921-7.033 13.949-18.256 25.291-32.059 32.399-9.061 4.666-18.601 6.463-28.616 7.29-9.574.791-21.271.791-35.173.79H205.955c-8.513 0-16.196-5.162-19.49-13.096-3.294-7.934-1.557-17.09 4.407-23.23l100.089-103.038 30.166 29.929-64.802 66.712h69.986c14.972 0 24.929-.017 32.577-.648 7.4-.611 10.758-1.69 12.867-2.776a31.252 31.252 0 0 0 13.583-13.728c1.075-2.132 2.142-5.524 2.747-13.004.625-7.729.641-17.792.641-32.923v-37.195c0-15.131-.016-25.194-.641-32.923-.605-7.479-1.672-10.872-2.747-13.004a31.257 31.257 0 0 0-13.583-13.728c-2.109-1.086-5.467-2.165-12.867-2.776-7.648-.631-17.605-.648-32.577-.648h-38.886c-15.136 0-25.21.017-32.942.658-7.487.622-10.872 1.719-12.988 2.818a31.26 31.26 0 0 0-13.602 13.916c-1.062 2.152-2.106 5.586-2.63 13.16-.54 7.821-.434 18.001-.25 33.297l.212 17.567-42.27.521-.222-18.429c-.172-14.207-.317-26.153.359-35.933.707-10.224 2.393-19.976 6.972-29.253 6.97-14.121 18.216-25.626 32.102-32.84 9.123-4.742 18.751-6.565 28.858-7.403 9.668-.803 21.489-.802 35.547-.802Z"
          clipRule="evenodd"
        />
        <path
          fill={forceColor ? '#ffffff' : 'url(#url_f)'}
          fillRule="evenodd"
          d="M153.112 388.466c7.648.632 17.605.648 32.577.648h39.539c13.651 0 22.731-.014 29.724-.541 6.778-.512 9.886-1.417 11.833-2.32 6.763-3.135 12.189-8.619 15.292-15.454.893-1.968 1.789-5.109 2.295-11.959.522-7.068.536-16.244.536-30.041h42.273l.001.78c0 12.812 0 23.593-.654 32.442-.683 9.245-2.164 18.081-6.028 26.591-7.322 16.132-20.127 29.073-36.089 36.473-8.421 3.904-17.163 5.402-26.312 6.092-8.755.661-19.422.661-32.1.66h-41.157c-13.902.001-25.598.001-35.172-.79-10.015-.827-19.555-2.624-28.616-7.29-13.803-7.108-25.026-18.449-32.059-32.399-4.617-9.158-6.395-18.799-7.213-28.921-.783-9.676-.782-21.497-.782-35.547v-38.905c0-14.05 0-25.87.782-35.547.818-10.121 2.596-19.762 7.213-28.92 7.033-13.95 18.256-25.292 32.059-32.399 9.061-4.667 18.601-6.464 28.616-7.291 9.574-.79 21.271-.79 35.173-.79h121.202c11.673 0 21.136 9.564 21.136 21.362 0 11.797-9.463 21.361-21.136 21.361H185.689c-14.972 0-24.929.017-32.577.648-7.4.611-10.758 1.69-12.867 2.776a31.261 31.261 0 0 0-13.584 13.729c-1.074 2.131-2.142 5.524-2.746 13.003-.625 7.729-.641 17.793-.641 32.924v37.194c0 15.131.016 25.194.641 32.923.604 7.48 1.672 10.873 2.746 13.004a31.254 31.254 0 0 0 13.584 13.728c2.109 1.086 5.467 2.165 12.867 2.776Z"
          clipRule="evenodd"
        />
        <path
          fill={forceColor ? '#ffffff' : 'url(#url_g)'}
          fillRule="evenodd"
          d="M153.112 388.466c7.648.632 17.605.648 32.577.648h39.539c13.651 0 22.731-.014 29.724-.541 6.778-.512 9.886-1.417 11.833-2.32 6.763-3.135 12.189-8.619 15.292-15.454.893-1.968 1.789-5.109 2.295-11.959.522-7.068.536-16.244.536-30.041h42.273l.001.78c0 12.812 0 23.593-.654 32.442-.683 9.245-2.164 18.081-6.028 26.591-7.322 16.132-20.127 29.073-36.089 36.473-8.421 3.904-17.163 5.402-26.312 6.092-8.755.661-19.422.661-32.1.66h-41.157c-13.902.001-25.598.001-35.172-.79-10.015-.827-19.555-2.624-28.616-7.29-13.803-7.108-25.026-18.449-32.059-32.399-4.617-9.158-6.395-18.799-7.213-28.921-.783-9.676-.782-21.497-.782-35.547v-38.905c0-14.05 0-25.87.782-35.547.818-10.121 2.596-19.762 7.213-28.92 7.033-13.95 18.256-25.292 32.059-32.399 9.061-4.667 18.601-6.464 28.616-7.291 9.574-.79 21.271-.79 35.173-.79h121.202c11.673 0 21.136 9.564 21.136 21.362 0 11.797-9.463 21.361-21.136 21.361H185.689c-14.972 0-24.929.017-32.577.648-7.4.611-10.758 1.69-12.867 2.776a31.261 31.261 0 0 0-13.584 13.729c-1.074 2.131-2.142 5.524-2.746 13.003-.625 7.729-.641 17.793-.641 32.924v37.194c0 15.131.016 25.194.641 32.923.604 7.48 1.672 10.873 2.746 13.004a31.254 31.254 0 0 0 13.584 13.728c2.109 1.086 5.467 2.165 12.867 2.776Z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <radialGradient
          id="url_c"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="rotate(-15.573 657.807 -579.272) scale(159.744 159.494)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#18CFD7" />
          <stop offset={1} stopColor="#18CFD7" stopOpacity={0} />
        </radialGradient>
        <radialGradient
          id="url_d"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(-52.97493 27.7488 -27.7055 -52.89228 272.994 225.963)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4990FE" />
          <stop offset={0.354} stopColor="#4990FE" />
          <stop offset={1} stopColor="#4990FE" stopOpacity={0} />
        </radialGradient>
        <radialGradient
          id="url_e"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="rotate(-45.939 461.706 -82.4) scale(108.824 108.654)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4990FE" />
          <stop offset={0.406} stopColor="#4990FE" />
          <stop offset={1} stopColor="#4990FE" stopOpacity={0} />
        </radialGradient>
        <radialGradient
          id="url_g"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(-68.10983 83.24656 -82.3712 -67.39365 328.491 326.867)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.337} stopColor="#2950FF" />
          <stop offset={0.792} stopColor="#2950FF" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="url_b" x1={247.767} x2={250.596} y1={326.867} y2={79.683} gradientUnits="userSpaceOnUse">
          <stop offset={0.431} stopColor="#498FFD" />
          <stop offset={1} stopColor="#16D1D6" />
        </linearGradient>
        <linearGradient id="url_f" x1={328.491} x2={329.401} y1={432.817} y2={180.559} gradientUnits="userSpaceOnUse">
          <stop stopColor="#2950FF" />
          <stop offset={0.822} stopColor="#498FFD" />
        </linearGradient>
        <clipPath id="url_a">
          <path fill="#fff" d="M0 0h512v512H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

function DfxAssetIconFUSD({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 400 402.01"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fillRule="evenodd">
        <path
          fill={forceColor ?? '#24b2dc'}
          d="M173.632.286c-.062.944-1.821 1.418-6.583 1.773-3.113.232-5.146.575-5.749.97-.513.336-2.431.781-4.263.989-1.832.208-4.014.664-4.85 1.013-.835.349-2.524.797-3.754.995-1.23.198-2.948.723-3.819 1.167-.871.444-2.04.809-2.599.811-.558.002-1.915.446-3.015.987-1.1.541-2.54.99-3.2.998-.66.008-1.797.378-2.526.822-.729.445-2.245 1.006-3.369 1.247-1.124.241-2.597.776-3.274 1.189-.677.412-1.511.751-1.853.752-.343 0-1.233.451-1.978 1.001-.745.55-1.81 1-2.367 1-.817 0-8.353 3.347-10.833 4.811-.33.195-2.31 1.205-4.4 2.243-2.09 1.039-4.679 2.577-5.752 3.417-1.074.841-2.154 1.534-2.4 1.54-.42.01-4.46 2.537-10.964 6.858-1.547 1.028-3.504 2.488-4.348 3.245-.845.758-2.166 1.697-2.936 2.088-1.271.645-5.593 4.288-9.195 7.749-.773.743-2.395 2.071-3.605 2.951-2.885 2.099-12.189 11.257-13.497 13.286-.564.874-1.693 2.314-2.51 3.2-4.904 5.319-7.334 8.177-8 9.412-.416.77-1.77 2.57-3.01 4-1.239 1.43-2.401 2.974-2.582 3.431-.181.457-1.245 2.042-2.365 3.521-1.12 1.48-2.036 2.895-2.036 3.144 0 .25-.785 1.455-1.744 2.679-.959 1.224-1.88 2.675-2.046 3.225-.166.55-.616 1.36-1.001 1.8-.384.44-.893 1.383-1.131 2.096-.238.712-.972 1.972-1.631 2.8-1.36 1.709-5.798 10.245-6.221 11.967-.154.625-.741 2.127-1.305 3.337-.564 1.21-1.477 3.19-2.028 4.4-.552 1.21-1.323 2.84-1.715 3.622-.392.783-.837 2.133-.99 3-.152.868-.616 2.172-1.031 2.898-.415.727-.866 2.077-1.002 3-.136.924-.577 2.257-.978 2.963-.402.706-.914 2.277-1.138 3.491-.225 1.214-.673 2.617-.995 3.117-.323.5-.762 2.187-.975 3.75-.213 1.562-.667 3.381-1.008 4.041-.342.661-.801 2.623-1.02 4.36-.22 1.737-.687 3.968-1.038 4.958-.483 1.364-1.277 8.012-1.394 11.684-.005.157-.403.652-.884 1.1-.665.619-.728.816-.262.816 1.554 0 2.012-1.37 2.232-6.677.168-4.038.383-5.462 1.018-6.723.526-1.045.891-2.801 1.051-5.063.183-2.587.435-3.673.999-4.296.539-.596.836-1.752 1.037-4.041.19-2.158.507-3.455.971-3.968.378-.418.824-1.764.991-2.99.166-1.226.616-2.576 1-3 .383-.424.833-1.774 1-3 .166-1.226.608-2.567.982-2.98.374-.413.846-1.772 1.049-3.02.203-1.247.738-2.736 1.188-3.309.451-.572.819-1.439.819-1.925s.35-1.201.777-1.587c.428-.387.897-1.27 1.043-1.962.147-.693.634-1.864 1.083-2.603.449-.739.967-2.147 1.15-3.128.183-.982.684-2.23 1.113-2.775.428-.545.895-1.52 1.037-2.167.142-.647.44-1.289.661-1.425.221-.137.751-1.064 1.178-2.059.427-.995 1.492-2.709 2.367-3.808.875-1.099 1.591-2.307 1.591-2.684 0-.377.45-1.209 1-1.848.549-.639.999-1.454 1-1.811 0-.357.9-1.775 2-3.151s2-2.74 2-3.03c0-.291.869-1.573 1.932-2.85 1.062-1.276 2.048-2.77 2.19-3.32.143-.55 1.081-1.9 2.085-3 2.386-2.614 3.479-4.056 4.054-5.347.257-.579 1.324-1.953 2.369-3.053 6.404-6.738 7.37-7.847 7.37-8.456 0-.974 9.728-10.681 12.8-12.773 1.43-.974 4.76-3.834 7.4-6.357 2.64-2.522 5.25-4.687 5.8-4.811.55-.123 1.889-1.042 2.976-2.041 1.088-.998 2.348-2.007 2.8-2.242 1.65-.853 4.624-2.862 4.624-3.123 0-.148.495-.491 1.1-.762.605-.271 2.283-1.29 3.729-2.264 1.446-.974 2.825-1.771 3.064-1.771.238 0 1.395-.779 2.57-1.732 1.175-.952 2.73-1.936 3.456-2.186.725-.249 1.784-.82 2.354-1.268.569-.448 1.336-.814 1.703-.814.368 0 1.279-.45 2.024-1 .745-.55 1.645-1 2-1s1.255-.45 2-1c.745-.55 1.656-1 2.024-1 .367 0 1.139-.37 1.714-.823.576-.452 1.962-.967 3.081-1.144 1.119-.177 2.517-.677 3.108-1.112.59-.434 1.599-.92 2.241-1.08.643-.16 1.612-.639 2.154-1.066.575-.452 1.607-.775 2.476-.775.905 0 2.035-.369 2.876-.94.761-.517 2.245-1.037 3.297-1.156 1.052-.118 2.39-.568 2.973-.999.596-.441 1.981-.873 3.162-.986 1.235-.119 2.436-.504 2.91-.934.493-.446 1.81-.852 3.377-1.04 1.413-.17 3.253-.654 4.088-1.075.941-.475 2.699-.839 4.621-.958 2.271-.141 3.324-.392 3.928-.939.679-.614 1.748-.792 6.032-1.005 5.405-.268 7.212-.931 6.617-2.426-.145-.364-.226-.382-.247-.056M226 .538c0 1.483 1.472 1.969 6.766 2.231 4.258.212 5.326.39 6.004 1.004.602.545 1.664.801 3.923.946 2.189.14 3.403.424 4.136.966.684.506 2.075.866 4.081 1.058 2.001.191 3.306.529 3.812.986.422.383 1.738.81 2.923.949 1.185.139 2.631.603 3.213 1.032.582.428 1.919.876 2.971.994 1.052.119 2.536.639 3.297 1.156.841.571 1.971.94 2.876.94.869 0 1.901.323 2.476.775.542.427 1.499.904 2.127 1.062.628.158 1.764.709 2.524 1.225.829.562 1.97.938 2.849.938.936 0 1.957.362 2.822 1 .745.55 1.645 1 2 1s1.255.45 2 1c.745.55 1.645 1 2 1s1.255.45 2 1c.745.55 1.656 1 2.024 1 .367 0 1.134.366 1.703.814.57.448 1.629 1.019 2.354 1.268.726.25 2.281 1.234 3.456 2.186 1.175.953 2.452 1.732 2.838 1.732.385 0 1.028.362 1.428.803.4.442 1.391 1.003 2.203 1.246.837.251 2.583 1.474 4.035 2.828 1.407 1.312 3.279 2.71 4.159 3.105.88.395 2.425 1.45 3.434 2.344 1.008.894 2.294 1.741 2.857 1.882.563.142 3.697 2.842 6.966 6 3.303 3.192 6.396 5.849 6.963 5.982 1.276.298 11.361 10.411 11.835 11.869.19.582 2.392 3.177 4.894 5.767 2.501 2.59 4.814 5.346 5.139 6.123.325.778 1.677 2.593 3.005 4.033 1.327 1.44 2.666 3.214 2.976 3.943.309.729 1.366 2.311 2.347 3.516.981 1.204 1.784 2.424 1.784 2.709 0 .285.9 1.64 2 3.011 1.1 1.371 2 2.769 2 3.108 0 .338.45 1.15 1 1.804.55.654 1 1.518 1 1.921s.779 1.694 1.732 2.869c.952 1.175 1.936 2.73 2.186 3.456.249.725.82 1.784 1.268 2.354.448.569.814 1.336.814 1.703 0 .368.45 1.279 1 2.024.55.745 1 1.656 1 2.024 0 .367.37 1.139.823 1.714.452.576.967 1.962 1.144 3.081.177 1.119.707 2.555 1.177 3.191.471.637.856 1.49.856 1.896 0 .406.45 1.349 1 2.094.624.845 1.001 1.891 1.001 2.778.001.782.393 2.052.87 2.822.478.77 1.004 2.361 1.169 3.536.165 1.174.615 2.482.998 2.906.384.424.834 1.774 1 3 .167 1.226.626 2.586 1.02 3.022.498.55.802 1.774.993 3.992.193 2.25.492 3.439 1.008 4.009.525.58.8 1.71.966 3.962.169 2.308.436 3.377.997 3.997.64.708.803 1.689.993 5.993.235 5.317.731 6.783 2.291 6.783.404 0 .319-.214-.277-.7-.748-.609-.912-1.343-1.259-5.647-.244-3.03-.646-5.427-1.038-6.185-.352-.68-.798-2.648-.991-4.374-.193-1.725-.634-3.57-.981-4.099-.347-.53-.79-2.227-.984-3.771-.194-1.545-.718-3.525-1.164-4.401-.447-.875-.818-2.093-.825-2.707-.006-.614-.455-2.016-.996-3.116-.541-1.1-.985-2.451-.987-3.003-.002-.552-.454-1.849-1.004-2.882-.55-1.033-1-2.31-1-2.837 0-.527-.42-1.751-.933-2.718-.514-.968-1.068-2.3-1.232-2.96-.163-.66-.57-1.502-.902-1.871-.333-.37-.772-1.414-.976-2.322-.52-2.316-6.893-15.162-8.564-17.265-.762-.958-1.39-2.012-1.396-2.342-.007-.33-.548-1.392-1.204-2.36-.656-.968-1.193-1.93-1.193-2.138 0-.207-.79-1.416-1.756-2.686-.966-1.271-1.877-2.691-2.025-3.157-.148-.466-1.028-1.795-1.955-2.953-.928-1.158-1.886-2.556-2.13-3.106-.244-.55-1.633-2.389-3.088-4.086-1.456-1.698-2.646-3.238-2.646-3.422 0-.61-1.944-2.987-5.9-7.216-2.145-2.293-4.2-4.733-4.567-5.423-.786-1.478-11.182-11.853-11.876-11.853-.262 0-2.167-1.592-4.234-3.537-5.523-5.2-8.662-7.876-10.092-8.605-.698-.356-1.868-1.208-2.6-1.895s-1.963-1.544-2.735-1.906c-.772-.361-2.733-1.737-4.358-3.057-2.834-2.303-4.077-3.081-8.038-5.036-.99-.489-2.452-1.412-3.248-2.051-1.227-.986-6.006-3.607-10.552-5.789-.66-.316-1.56-.777-2-1.023-.44-.247-1.34-.692-2-.991a57.1 57.1 0 0 1-2.661-1.316c-.804-.425-2.313-.964-3.355-1.198-1.041-.233-2.343-.778-2.893-1.21-.549-.432-1.253-.786-1.563-.786-.311 0-1.41-.45-2.443-1-1.033-.55-2.331-1-2.885-1-.554 0-1.852-.45-2.885-1-1.033-.55-2.383-1-3-1s-1.967-.45-3-1-2.389-1-3.012-1c-.624 0-1.847-.367-2.718-.816-.872-.449-2.921-.988-4.553-1.199-1.633-.21-3.395-.662-3.916-1.003-.521-.341-2.373-.783-4.116-.982-1.743-.199-3.581-.628-4.085-.953-.503-.325-2.265-.7-3.915-.833-6.35-.513-7.263-.677-8.033-1.447-.529-.529-.767-.6-.767-.229m-39.393 11.499c-3.517.174-8.074.603-10.128.953-2.054.35-5.117.808-6.807 1.018-3.462.43-10.434 1.911-17.872 3.796-6.097 1.545-16.904 5.144-22.2 7.394-.99.42-3.15 1.332-4.8 2.026C82.979 44.82 45.211 82.745 27.233 125.2c-.699 1.65-1.619 3.81-2.045 4.8-.848 1.969-1.145 2.788-3.488 9.6-1.818 5.285-3.564 10.944-3.826 12.4-.099.55-.546 2.44-.994 4.2-1.465 5.757-2.484 10.74-2.906 14.2-.228 1.87-.679 4.93-1.003 6.8-1.357 7.839-1.698 32.73-.587 42.8.621 5.621 2.05 14.992 2.806 18.4.415 1.87.923 4.21 1.129 5.2.932 4.486 3.377 13.192 4.887 17.4.394 1.1.99 2.81 1.322 3.8 13.966 41.567 45.331 78.656 86.388 102.156 2.907 1.664 12.501 6.383 15.884 7.813l4.8 2.033c3.003 1.276 6.8 2.673 10.8 3.973l5.8 1.886c31.352 10.196 75.202 10.176 107.8-.051 6.905-2.166 12.448-4.129 16.4-5.808.99-.42 3.15-1.332 4.8-2.026 40.655-17.105 76.682-52.496 95.869-94.176 3.091-6.714 4.067-9.149 6.898-17.2 9.291-26.429 12.909-61.987 8.87-87.2-.423-2.64-.889-5.79-1.036-7-.148-1.21-.53-3.242-.849-4.515-.32-1.273-.824-3.613-1.119-5.2-1.169-6.271-4.806-18.545-7.641-25.788-.538-1.376-1.449-3.716-2.023-5.2-15.582-40.284-50.571-77.531-91.969-97.906-7.285-3.586-8.768-4.241-14.6-6.45-6.773-2.565-13.967-4.933-18-5.923l-5.4-1.329c-4.761-1.174-10.587-2.422-12.4-2.657-.88-.114-3.973-.576-6.873-1.027-9.095-1.415-24.088-1.872-38.32-1.168M337.658 91.5c1.045 2.62-.57 14.078-3.087 21.9-6.257 19.449-23.431 36.392-44.371 43.773-5.311 1.872-10.779 3.627-11.301 3.627-.304 0-2.476.439-4.826.976-4.551 1.04-12.575 2.501-21.073 3.836-6.716 1.055-21.888 2.227-35.8 2.763-20.442.789-29.391 2.195-40.8 6.409-1.87.69-4.316 1.587-5.435 1.992-1.12.405-2.38.925-2.8 1.155-.421.231-2.295 1.172-4.165 2.092-14.375 7.072-27.17 17.304-37.983 30.377-5.881 7.11-7.015 6.574-3.171-1.497 12.272-25.762 31.604-44.923 54.854-54.369a2328.83 2328.83 0 0 0 4.8-1.957c9.972-4.079 28.143-8.84 44.3-11.606 1.87-.32 5.38-.941 7.8-1.38 4.701-.852 9.395-1.663 15.2-2.628 1.98-.329 5.04-.942 6.8-1.362 1.76-.42 4.46-1.041 6-1.38 6.39-1.405 17.414-4.873 21.6-6.795 21.554-9.897 38.896-21.802 49.2-33.773 3.045-3.539 3.595-3.817 4.258-2.153m-162.682 2.357c5.424 1.616 6.146 3.074 3.193 6.45-2.086 2.385-2.517 2.475-5.983 1.25-11.462-4.049-24.767 10.218-32.306 34.643-.923 2.99-1.652 5.319-3.906 12.479-1.326 4.212-1.692 4.041 9.033 4.194 11.712.166 11.867.387 4.878 6.963-4.326 4.069-4.597 4.164-11.843 4.164-5.882 0-5.997.017-6.758.985-.88 1.118-2.368 5.111-4.479 12.015-.403 1.32-1.021 3.21-1.373 4.2-.764 2.15-3.662 11.08-6.817 21-1.259 3.96-2.616 8.19-3.015 9.4-.4 1.21-1.276 4-1.947 6.2-3.437 11.267-4.904 15.53-6.477 18.826-.427.895-.776 1.739-.776 1.877 0 .138-.996 2.346-2.214 4.908-9.183 19.322-25.861 34.717-41.186 38.017-6.633 1.429-11 1.586-11 .397 0-.585 1.518-2.006 2.525-2.363 7.632-2.701 17.673-12.923 22.654-23.062.919-1.87 1.839-3.712 2.045-4.093.206-.381.752-1.641 1.214-2.8l2.032-5.107c1.702-4.284 5.093-13.778 5.928-16.6.391-1.32.895-2.85 1.119-3.4.225-.55.977-2.89 1.673-5.2 1.199-3.982 1.819-6.048 4.197-14 .559-1.87 1.016-3.614 1.015-3.875-.001-.262.426-1.882.95-3.6a262.407 262.407 0 0 0 2.018-7.125c1.023-3.837 3.847-12.952 6.278-20.264 2.135-6.42 2.242-6.336-8.103-6.336-11.384 0-11.681-.338-5.668-6.459 4.627-4.709 4.698-4.736 12.553-4.739 7.101-.002 6.798.221 8.943-6.602.83-2.64 1.825-5.7 2.211-6.8.387-1.1 1.306-3.89 2.043-6.2 8.841-27.704 35.359-45.896 57.349-39.343m146.548 61.045c.544 4.578-11.512 20.187-22.324 28.902-2.902 2.34-10.368 7.396-10.92 7.396-.196 0-.834.325-1.418.723-1.334.908-8.8 4.345-11.462 5.276-8.458 2.959-15.16 4.887-19.6 5.641-11.842 2.009-12.581 2.072-24.2 2.065-6.27-.003-13.65-.212-16.4-.464-9.084-.831-20.941-2.014-24.8-2.475-8.323-.994-23.227 1.028-34.2 4.64-9.375 3.086-18.014 7.85-29.294 16.153-8.805 6.481-.138-5.826 10.607-15.062 16.367-14.069 33.745-21.836 55.687-24.89 2.97-.413 6.57-.939 8-1.168 1.43-.229 5.93-.606 10-.839 4.07-.232 10.01-.682 13.2-1 3.19-.318 8.165-.75 11.056-.959 5.214-.377 14.657-1.514 22.344-2.691 2.2-.337 5.62-.858 7.6-1.158 16.124-2.443 34.943-9.107 47.928-16.971l5.8-3.514c1.758-1.067 2.231-.989 2.396.395m-74.066 63.526c8.009 1.526 12.88 4.173 12.3 6.684-.281 1.216-1.598 4.439-3.59 8.788-1.57 3.427-1.816 3.493-5.168 1.379-10.995-6.934-26.306-4.9-28.242 3.752-1.263 5.643.645 7.445 11.842 11.179 9.272 3.093 12.772 4.826 15.473 7.663 6.869 7.216 4.389 22.357-5.134 31.341-9.708 9.158-29.622 11.041-44.001 4.161-5.909-2.827-6.048-3.229-3.305-9.512 3.483-7.977 3.277-7.84 7.716-5.117 14.876 9.122 33.127 5.827 32.163-5.807-.319-3.837-2.705-5.644-11.037-8.355-17.302-5.632-21.519-10.537-19.708-22.926 2.505-17.126 20.079-27.159 40.691-23.23m-93.066 1.558c.315.587.175 1.927-.551 5.3-2.056 9.551-2.362 11.027-3.05 14.714-.391 2.09-1.013 5.24-1.383 7-4.408 20.969-4.746 22.938-4.446 25.937.73 7.309 4.6 10.463 12.838 10.463 12.633 0 17.865-6.576 21.214-26.662.317-1.905.742-3.895.943-4.424.201-.529.573-2.391.827-4.138.254-1.747.643-3.754.865-4.46.221-.705.743-3.135 1.159-5.4 2.323-12.632 3.526-17.732 4.36-18.487.611-.553 1.664-.633 7.075-.539l6.357.11.123 1.92c.067 1.055-.146 2.855-.473 4-.328 1.144-.793 3.25-1.035 4.68-.241 1.43-.792 4.22-1.224 6.2-.433 1.98-1.076 5.04-1.43 6.8a2363.568 2363.568 0 0 0-3.132 15.8c-4.998 25.952-15.396 37.259-35.429 38.529-23.171 1.469-32.582-11.407-26.406-36.129.412-1.65.869-3.9 1.017-5 .147-1.1.597-3.35 1-5 .402-1.65.852-3.9.999-5 .146-1.1.526-3.042.843-4.316.318-1.274.931-4.154 1.364-6.4a866.18 866.18 0 0 1 1.395-7.084c.335-1.65.816-4.066 1.068-5.369.732-3.78.842-3.831 8.306-3.831 5.938 0 6.415.055 6.806.786m157.608.505c16.709 4.976 23.226 20.828 16.818 40.909a99.133 99.133 0 0 0-1.231 4.19c-1.943 7.463-9.421 17.978-15.871 22.316-9.908 6.664-16.669 8.067-38.956 8.085-15.294.012-15.157.057-14.185-4.693.304-1.484 1.033-5.128 1.622-8.098.588-2.97 1.501-7.47 2.029-10 1.573-7.538 2.227-10.794 2.975-14.8.39-2.09.983-5.06 1.317-6.6.335-1.54 1.089-5.23 1.676-8.2.587-2.97 1.496-7.38 2.02-9.8.524-2.42 1.077-5.3 1.228-6.4.363-2.64 1.599-6.927 2.209-7.661.97-1.17 34.076-.521 38.349.752M.725 226.816c.481.448.879.943.884 1.1.139 4.164.869 9.874 1.391 10.884.362.701.836 3.012 1.052 5.137.216 2.125.654 4.263.973 4.753.319.489.772 2.289 1.006 4 .235 1.71.69 3.519 1.013 4.019.323.5.77 1.903.995 3.117.224 1.214.736 2.785 1.138 3.491.401.706.842 2.039.978 2.963.136.923.587 2.273 1.002 3 .415.726.879 2.03 1.031 2.898.153.867.612 2.217 1.022 3 1.741 3.328 2.79 5.644 2.79 6.161 0 .304.382 1.038.848 1.631.466.593 1.014 1.817 1.217 2.721.518 2.306 2.879 7.075 4.533 9.155.767.965 1.396 2.034 1.398 2.376.002.343.445 1.22.983 1.95.539.729 1.092 1.842 1.231 2.473.138.63.42 1.25.626 1.378.207.127.756.984 1.221 1.904.465.92 1.632 2.726 2.594 4.013.962 1.286 1.751 2.546 1.753 2.8.002.253.902 1.617 2 3.032 1.098 1.415 1.996 2.743 1.996 2.951 0 .209 1.261 1.876 2.802 3.706 1.54 1.83 2.964 3.742 3.162 4.249.199.507 2.621 3.399 5.383 6.427 2.762 3.028 5.554 6.268 6.205 7.2 1.372 1.965 7.217 7.744 9.211 9.108.75.512 3.89 3.239 6.977 6.059 3.088 2.821 5.837 5.128 6.11 5.128.273 0 1.994 1.277 3.823 2.838 1.83 1.56 3.777 3.038 4.327 3.283.55.245 1.837 1.13 2.86 1.966 1.023.836 2.521 1.796 3.328 2.134.808.337 1.771 1.151 2.141 1.808.498.886 1.196 1.348 2.706 1.792 1.12.329 2.64 1.044 3.378 1.589.738.544 1.576.99 1.861.99.286 0 1.3.596 2.255 1.325 2.284 1.744 15.19 8.14 17.4 8.624.95.209 2.03.642 2.4.964.369.322 1.316.793 2.104 1.045.788.253 2.131.816 2.984 1.251.854.435 1.955.791 2.446.791.492 0 1.741.45 2.775 1 1.035.55 2.349 1.006 2.922 1.013.572.006 1.94.455 3.04.996 1.1.541 2.54.986 3.2.989.66.003 1.78.359 2.489.791.725.442 2.613.95 4.314 1.161 1.663.207 3.475.671 4.026 1.032.551.361 2.427.819 4.168 1.018 1.742.198 3.694.633 4.338.966.681.353 3.238.772 6.118 1.004 4.304.347 5.038.511 5.647 1.259.486.596.7.681.7.277 0-1.529-1.43-2.011-6.766-2.275-4.194-.208-5.331-.395-5.979-.981-.558-.506-1.768-.808-3.999-.999-2.233-.192-3.441-.494-4-1-.56-.507-1.767-.809-4-1-2.273-.196-3.438-.491-4.023-1.022-.492-.444-1.673-.827-2.927-.948-1.181-.113-2.566-.545-3.162-.986-.583-.431-1.921-.881-2.973-.999-1.052-.119-2.536-.639-3.297-1.156-.831-.564-1.972-.94-2.852-.94-.936 0-1.957-.362-2.822-1-.745-.55-1.688-1-2.094-1-.406 0-1.259-.385-1.896-.856-.636-.47-2.072-1-3.191-1.177-1.119-.177-2.505-.692-3.081-1.144-.575-.453-1.347-.823-1.714-.823-.368 0-1.279-.45-2.024-1-.745-.55-1.656-1-2.024-1-.367 0-1.134-.366-1.703-.814-.57-.448-1.629-1.019-2.354-1.268-.726-.25-2.281-1.234-3.456-2.186-1.175-.953-2.466-1.732-2.869-1.732s-1.267-.45-1.921-1c-.654-.55-1.433-1.001-1.731-1.002-1.817-.008-3.491-.877-3.89-2.021-.291-.833-.887-1.396-1.936-1.828-.834-.342-2.34-1.311-3.347-2.152-1.008-.841-2.448-1.789-3.2-2.106-.753-.318-2.629-1.745-4.169-3.171-1.54-1.426-3.268-2.708-3.84-2.849-.572-.141-3.243-2.374-5.936-4.964-2.694-2.589-5.916-5.394-7.161-6.234-3.086-2.083-7.345-6.334-9.491-9.473-.977-1.43-3.855-4.76-6.396-7.4-2.54-2.64-4.714-5.25-4.83-5.8-.117-.55-1.464-2.35-2.995-4-1.532-1.65-2.897-3.45-3.036-4-.138-.55-1.121-2.044-2.183-3.32-1.063-1.277-1.932-2.559-1.932-2.85 0-.29-.9-1.654-2-3.03s-2-2.83-2-3.23c0-.401-.45-1.214-1-1.808-.55-.593-1-1.378-1-1.743 0-.365-.45-1.274-1-2.019-.55-.745-1-1.664-1-2.041s-.779-1.647-1.732-2.822c-.952-1.175-1.945-2.755-2.205-3.511-.26-.756-.748-1.678-1.085-2.05-.337-.372-.709-1.374-.828-2.226-.272-1.949-.941-3.75-1.393-3.75-.19 0-.547-.799-.793-1.775-.245-.977-.788-2.085-1.205-2.462-.418-.378-.759-1.085-.759-1.571s-.368-1.353-.819-1.925c-.45-.573-.985-2.062-1.188-3.309-.203-1.248-.675-2.607-1.049-3.02-.374-.413-.816-1.754-.982-2.98-.167-1.226-.617-2.576-1-3-.384-.424-.834-1.774-1-3-.167-1.226-.608-2.567-.981-2.979-.443-.489-.793-1.882-1.007-4.008-.224-2.221-.558-3.512-1.05-4.055-.553-.611-.782-1.762-.977-4.911-.198-3.204-.434-4.366-1.065-5.259-.678-.958-.841-1.952-.99-6.052-.185-5.09-.667-6.494-2.229-6.494-.466 0-.403.197.262.816m397.458 2.002c-.61.674-.781 1.728-.968 5.965-.186 4.211-.36 5.294-.958 5.955-.514.566-.814 1.761-1.006 4.006-.192 2.233-.494 3.441-1 4-.507.56-.809 1.767-1 4-.191 2.218-.495 3.442-.993 3.992-.394.436-.853 1.754-1.018 2.928-.165 1.175-.691 2.766-1.169 3.536-.477.77-.869 2.051-.87 2.846 0 .859-.34 1.877-.837 2.508-.461.587-.965 2.018-1.125 3.196-.165 1.22-.664 2.61-1.164 3.246-.481.611-.875 1.44-.875 1.84 0 .401-.45 1.392-1 2.202-.55.811-1 1.774-1 2.14 0 .367-.45 1.277-1 2.022-.632.856-1 1.887-1 2.8 0 .913-.368 1.944-1 2.8-.55.745-1 1.656-1 2.024 0 .367-.366 1.134-.814 1.703-.448.57-1.019 1.629-1.268 2.354-.25.726-1.234 2.281-2.186 3.456-.953 1.175-1.732 2.466-1.732 2.869s-.45 1.267-1 1.921c-.55.654-1 1.461-1 1.794 0 .333-.795 1.581-1.766 2.773-.971 1.193-2.027 2.784-2.347 3.537-.32.753-1.297 2.179-2.171 3.169-.875.99-1.701 2.25-1.837 2.8-.135.55-1.407 2.271-2.825 3.824-1.419 1.553-2.838 3.443-3.155 4.201-.317.758-2.628 3.511-5.137 6.118-2.509 2.607-4.717 5.216-4.907 5.798-.474 1.458-10.559 11.571-11.835 11.869-.567.133-3.66 2.79-6.963 5.982-3.269 3.158-6.402 5.858-6.964 5.999-.561.141-1.937 1.036-3.057 1.99-1.12.953-2.666 2.008-3.436 2.345-.77.336-2.196 1.345-3.168 2.243-.972.897-2.068 1.631-2.434 1.631-.367 0-1.788.9-3.159 2-1.371 1.1-2.734 2-3.029 2-.295 0-1.498.779-2.673 1.732-1.175.952-2.73 1.936-3.456 2.186-.725.249-1.784.82-2.354 1.268-.569.448-1.336.814-1.703.814-.368 0-1.279.45-2.024 1-.745.55-1.645 1-2 1s-1.255.45-2 1c-.745.55-1.656 1-2.024 1-.367 0-1.139.37-1.714.823-.576.452-1.962.967-3.081 1.144-1.119.177-2.517.677-3.108 1.112-.59.434-1.599.92-2.241 1.08-.643.16-1.612.639-2.154 1.066-.575.452-1.607.775-2.476.775-.905 0-2.035.369-2.876.94-.761.517-2.245 1.037-3.297 1.156-1.052.118-2.39.568-2.973.999-.596.441-1.981.873-3.162.986-1.248.12-2.435.504-2.922.944-.559.506-1.765.832-3.796 1.026-1.812.173-3.486.592-4.276 1.069-.848.512-2.313.853-4.21.98-2.065.138-3.148.409-3.728.934-.668.605-1.758.786-5.996.997-5.336.264-6.766.746-6.766 2.275 0 .411.207.333.7-.261.601-.724 1.403-.903 5.662-1.266 2.804-.239 5.465-.683 6.118-1.02.636-.329 2.581-.761 4.323-.959 1.741-.199 3.592-.641 4.113-.982.521-.341 2.283-.793 3.916-1.003 1.632-.211 3.681-.75 4.553-1.199.871-.449 2.041-.818 2.6-.82.558-.002 1.915-.446 3.015-.987 1.1-.541 2.54-.99 3.2-.998.66-.008 1.797-.378 2.526-.822.729-.445 2.245-1.006 3.369-1.247 1.124-.241 2.597-.776 3.274-1.189.677-.412 1.522-.751 1.877-.752.355 0 1.106-.363 1.668-.805.561-.441 1.621-.91 2.354-1.04 1.108-.197 9.071-3.75 11.132-4.967.33-.195 2.31-1.205 4.4-2.243 2.09-1.039 4.679-2.577 5.752-3.417 1.074-.841 2.189-1.529 2.479-1.529.29 0 1.695-.884 3.123-1.965 1.428-1.081 3.012-2.094 3.521-2.25.509-.157 1.825-1.047 2.925-1.978 1.1-.931 2.431-1.829 2.958-1.995.527-.167 1.697-.978 2.6-1.804.903-.825 2.272-1.822 3.042-2.215 1.402-.716 5.432-4.158 10.544-9.008 1.499-1.422 3.295-2.887 3.991-3.257 1.545-.821 11.169-10.509 11.923-12.001.298-.591 1.713-2.301 3.144-3.8 3.798-3.98 6.798-7.525 6.798-8.032 0-.244 1.347-2.03 2.994-3.969 1.647-1.939 2.997-3.728 3-3.975.003-.247.898-1.565 1.988-2.929 1.09-1.363 2.1-2.85 2.244-3.304.144-.453 1.052-1.863 2.018-3.134.966-1.27 1.756-2.481 1.756-2.691 0-.21.432-1.018.96-1.796s1.089-1.838 1.246-2.356c.157-.517.946-1.841 1.754-2.941 1.705-2.323 6.44-11.706 6.44-12.764 0-.395.428-1.555.952-2.577a138.117 138.117 0 0 0 2.055-4.259c.606-1.32 1.423-3.04 1.815-3.822.392-.783.842-2.133 1-3 .158-.868.712-2.387 1.232-3.375s.946-2.255.946-2.815.357-1.719.793-2.574c.436-.855.969-2.509 1.184-3.675.216-1.166.67-2.545 1.01-3.064.34-.518.781-2.24.98-3.825.199-1.585.646-3.315.993-3.845.347-.529.788-2.374.981-4.099.193-1.726.629-3.675.968-4.331.361-.698.793-3.264 1.041-6.184.367-4.326.538-5.084 1.281-5.691.596-.487.68-.7.275-.7-.32 0-.915.368-1.323.818m-111.893 3.883c-.834.921-2.259 6.868-4.674 19.499-.378 1.98-.985 4.95-1.347 6.6-.363 1.65-.941 4.44-1.285 6.2-1.345 6.889-1.847 9.331-2.609 12.71-1.249 5.533-1.021 5.688 7.947 5.398 17.94-.581 26.777-8.942 29.753-28.152 2.011-12.985-1.882-20.058-12.213-22.19-5.098-1.052-14.643-1.092-15.572-.065"
        />
        <path
          fill="#f6fafb"
          d="M174 .538c0 1.483-1.472 1.969-6.766 2.231-4.258.212-5.326.39-6.004 1.004-.604.547-1.657.798-3.928.939-1.922.119-3.68.483-4.621.958-.835.421-2.675.905-4.088 1.075-1.567.188-2.884.594-3.377 1.04-.474.43-1.675.815-2.91.934-1.181.113-2.566.545-3.162.986-.583.431-1.921.881-2.973.999-1.052.119-2.536.639-3.297 1.156-.841.571-1.971.94-2.876.94-.869 0-1.901.323-2.476.775-.542.427-1.511.906-2.154 1.066-.642.16-1.651.646-2.241 1.08-.591.435-1.989.935-3.108 1.112-1.119.177-2.505.692-3.081 1.144-.575.453-1.347.823-1.714.823-.368 0-1.279.45-2.024 1-.745.55-1.645 1-2 1s-1.255.45-2 1c-.745.55-1.656 1-2.024 1-.367 0-1.134.366-1.703.814-.57.448-1.629 1.019-2.354 1.268-.726.25-2.281 1.234-3.456 2.186-1.175.953-2.332 1.732-2.57 1.732-.239 0-1.618.797-3.064 1.771-1.446.974-3.124 1.993-3.729 2.264-.605.271-1.1.614-1.1.762 0 .261-2.974 2.27-4.624 3.123-.452.235-1.712 1.244-2.8 2.242-1.087.999-2.426 1.918-2.976 2.041-.55.124-3.16 2.289-5.8 4.811-2.64 2.523-5.97 5.383-7.4 6.357-3.072 2.092-12.8 11.799-12.8 12.773 0 .609-.966 1.718-7.37 8.456-1.045 1.1-2.112 2.474-2.369 3.053-.575 1.291-1.668 2.733-4.054 5.347-1.004 1.1-1.942 2.45-2.085 3-.142.55-1.128 2.044-2.19 3.32-1.063 1.277-1.932 2.559-1.932 2.85 0 .29-.9 1.654-2 3.03s-2 2.794-2 3.151c-.001.357-.451 1.172-1 1.811-.55.639-1 1.471-1 1.848s-.716 1.585-1.591 2.684c-.875 1.099-1.94 2.813-2.367 3.808-.427.995-.957 1.922-1.178 2.059-.221.136-.519.778-.661 1.425-.142.647-.609 1.622-1.037 2.167-.429.545-.93 1.793-1.113 2.775-.183.981-.701 2.389-1.15 3.128-.449.739-.936 1.91-1.083 2.603-.146.692-.615 1.575-1.043 1.962-.427.386-.777 1.101-.777 1.587s-.368 1.353-.819 1.925c-.45.573-.985 2.062-1.188 3.309-.203 1.248-.675 2.607-1.049 3.02-.374.413-.816 1.754-.982 2.98-.167 1.226-.617 2.576-1 3-.384.424-.834 1.774-1 3-.167 1.226-.613 2.572-.991 2.99-.464.513-.781 1.81-.971 3.968-.201 2.289-.498 3.445-1.037 4.041-.564.623-.816 1.709-.999 4.296-.16 2.262-.525 4.018-1.051 5.063-.635 1.261-.85 2.685-1.018 6.723C2.478 174.562 2.013 176 .538 176 .093 176 0 180.325 0 201s.093 25 .538 25c1.484 0 1.972 1.47 2.154 6.494.149 4.1.312 5.094.99 6.052.631.893.867 2.055 1.065 5.259.195 3.149.424 4.3.977 4.911.492.543.826 1.834 1.05 4.055.214 2.126.564 3.519 1.007 4.008.373.412.814 1.753.981 2.979.166 1.226.616 2.576 1 3 .383.424.833 1.774 1 3 .166 1.226.608 2.567.982 2.98.374.413.846 1.772 1.049 3.02.203 1.247.738 2.736 1.188 3.309.451.572.819 1.439.819 1.925s.341 1.193.759 1.571c.417.377.96 1.485 1.205 2.462.246.976.603 1.775.793 1.775.452 0 1.121 1.801 1.393 3.75.119.852.491 1.854.828 2.226.337.372.825 1.294 1.085 2.05.26.756 1.253 2.336 2.205 3.511.953 1.175 1.732 2.445 1.732 2.822 0 .377.45 1.296 1 2.041.55.745 1 1.654 1 2.019 0 .365.45 1.15 1 1.743.55.594 1 1.407 1 1.808 0 .4.9 1.854 2 3.23s2 2.74 2 3.03c0 .291.869 1.573 1.932 2.85 1.062 1.276 2.045 2.77 2.183 3.32.139.55 1.504 2.35 3.036 4 1.531 1.65 2.878 3.45 2.995 4 .116.55 2.29 3.16 4.83 5.8 2.541 2.64 5.419 5.97 6.396 7.4 2.146 3.139 6.405 7.39 9.491 9.473 1.245.84 4.467 3.645 7.161 6.234 2.693 2.59 5.364 4.823 5.936 4.964.572.141 2.3 1.423 3.84 2.849 1.54 1.426 3.416 2.853 4.169 3.171.752.317 2.192 1.265 3.2 2.106 1.007.841 2.513 1.81 3.347 2.152 1.049.432 1.645.995 1.936 1.828.399 1.144 2.073 2.013 3.89 2.021.298.001 1.077.452 1.731 1.002.654.55 1.518 1 1.921 1s1.694.779 2.869 1.732c1.175.952 2.73 1.936 3.456 2.186.725.249 1.784.82 2.354 1.268.569.448 1.336.814 1.703.814.368 0 1.279.45 2.024 1 .745.55 1.656 1 2.024 1 .367 0 1.139.37 1.714.823.576.452 1.962.967 3.081 1.144 1.119.177 2.555.707 3.191 1.177.637.471 1.49.856 1.896.856.406 0 1.349.45 2.094 1 .865.638 1.886 1 2.822 1 .88 0 2.021.376 2.852.94.761.517 2.245 1.037 3.297 1.156 1.052.118 2.39.568 2.973.999.596.441 1.981.873 3.162.986 1.254.121 2.435.504 2.927.948.585.531 1.75.826 4.023 1.022 2.233.191 3.44.493 4 1 .559.506 1.767.808 4 1 2.231.191 3.441.493 3.999.999.648.586 1.785.773 5.979.981 5.294.262 6.766.748 6.766 2.231 0 .445 4.487.538 26 .538 21.513 0 26-.093 26-.538 0-1.483 1.472-1.969 6.766-2.231 4.238-.211 5.328-.392 5.996-.997.58-.525 1.663-.796 3.728-.934 1.897-.127 3.362-.468 4.21-.98.79-.477 2.464-.896 4.276-1.069 2.031-.194 3.237-.52 3.796-1.026.487-.44 1.674-.824 2.922-.944 1.181-.113 2.566-.545 3.162-.986.583-.431 1.921-.881 2.973-.999 1.052-.119 2.536-.639 3.297-1.156.841-.571 1.971-.94 2.876-.94.869 0 1.901-.323 2.476-.775.542-.427 1.511-.906 2.154-1.066.642-.16 1.651-.646 2.241-1.08.591-.435 1.989-.935 3.108-1.112 1.119-.177 2.505-.692 3.081-1.144.575-.453 1.347-.823 1.714-.823.368 0 1.279-.45 2.024-1 .745-.55 1.645-1 2-1s1.255-.45 2-1c.745-.55 1.656-1 2.024-1 .367 0 1.134-.366 1.703-.814.57-.448 1.629-1.019 2.354-1.268.726-.25 2.281-1.234 3.456-2.186 1.175-.953 2.378-1.732 2.673-1.732.295 0 1.658-.9 3.029-2s2.792-2 3.159-2c.366 0 1.462-.734 2.434-1.631.972-.898 2.398-1.907 3.168-2.243.77-.337 2.316-1.392 3.436-2.345 1.12-.954 2.496-1.849 3.057-1.99.562-.141 3.695-2.841 6.964-5.999 3.303-3.192 6.396-5.849 6.963-5.982 1.276-.298 11.361-10.411 11.835-11.869.19-.582 2.398-3.191 4.907-5.798s4.82-5.36 5.137-6.118c.317-.758 1.736-2.648 3.155-4.201 1.418-1.553 2.69-3.274 2.825-3.824.136-.55.962-1.81 1.837-2.8.874-.99 1.851-2.416 2.171-3.169.32-.753 1.376-2.344 2.347-3.537.971-1.192 1.766-2.44 1.766-2.773 0-.333.45-1.14 1-1.794.55-.654 1-1.518 1-1.921s.779-1.694 1.732-2.869c.952-1.175 1.936-2.73 2.186-3.456.249-.725.82-1.784 1.268-2.354.448-.569.814-1.336.814-1.703 0-.368.45-1.279 1-2.024.632-.856 1-1.887 1-2.8 0-.913.368-1.944 1-2.8.55-.745 1-1.655 1-2.022 0-.366.45-1.329 1-2.14.55-.81 1-1.801 1-2.202 0-.4.394-1.229.875-1.84.5-.636.999-2.026 1.164-3.246.16-1.178.664-2.609 1.125-3.196.497-.631.837-1.649.837-2.508.001-.795.393-2.076.87-2.846.478-.77 1.004-2.361 1.169-3.536.165-1.174.624-2.492 1.018-2.928.498-.55.802-1.774.993-3.992.191-2.233.493-3.44 1-4 .506-.559.808-1.767 1-4 .192-2.245.492-3.44 1.006-4.006.598-.661.772-1.744.958-5.955.233-5.276.733-6.783 2.247-6.783.445 0 .538-4.649.538-27s-.093-27-.538-27c-1.514 0-2.014-1.507-2.247-6.783-.19-4.304-.353-5.285-.993-5.993-.561-.62-.828-1.689-.997-3.997-.166-2.252-.441-3.382-.966-3.962-.516-.57-.815-1.759-1.008-4.009-.191-2.218-.495-3.442-.993-3.992-.394-.436-.853-1.796-1.02-3.022-.166-1.226-.616-2.576-1-3-.383-.424-.833-1.732-.998-2.906-.165-1.175-.691-2.766-1.169-3.536-.477-.77-.869-2.04-.87-2.822 0-.887-.377-1.933-1.001-2.778-.55-.745-1-1.688-1-2.094 0-.406-.385-1.259-.856-1.896-.47-.636-1-2.072-1.177-3.191-.177-1.119-.692-2.505-1.144-3.081-.453-.575-.823-1.347-.823-1.714 0-.368-.45-1.279-1-2.024-.55-.745-1-1.656-1-2.024 0-.367-.366-1.134-.814-1.703-.448-.57-1.019-1.629-1.268-2.354-.25-.726-1.234-2.281-2.186-3.456-.953-1.175-1.732-2.466-1.732-2.869s-.45-1.267-1-1.921c-.55-.654-1-1.466-1-1.804 0-.339-.9-1.737-2-3.108s-2-2.726-2-3.011c0-.285-.803-1.505-1.784-2.709-.981-1.205-2.038-2.787-2.347-3.516-.31-.729-1.649-2.503-2.976-3.943-1.328-1.44-2.68-3.255-3.005-4.033-.325-.777-2.638-3.533-5.139-6.123-2.502-2.59-4.704-5.185-4.894-5.767-.474-1.458-10.559-11.571-11.835-11.869-.567-.133-3.66-2.79-6.963-5.982-3.269-3.158-6.403-5.858-6.966-6-.563-.141-1.849-.988-2.857-1.882-1.009-.894-2.554-1.949-3.434-2.344-.88-.395-2.752-1.793-4.159-3.105-1.452-1.354-3.198-2.577-4.035-2.828-.812-.243-1.803-.804-2.203-1.246-.4-.441-1.043-.803-1.428-.803-.386 0-1.663-.779-2.838-1.732-1.175-.952-2.73-1.936-3.456-2.186-.725-.249-1.784-.82-2.354-1.268-.569-.448-1.336-.814-1.703-.814-.368 0-1.279-.45-2.024-1-.745-.55-1.645-1-2-1s-1.255-.45-2-1c-.745-.55-1.645-1-2-1s-1.255-.45-2-1c-.865-.638-1.886-1-2.822-1-.879 0-2.02-.376-2.849-.938-.76-.516-1.896-1.067-2.524-1.225-.628-.158-1.585-.635-2.127-1.062-.575-.452-1.607-.775-2.476-.775-.905 0-2.035-.369-2.876-.94-.761-.517-2.245-1.037-3.297-1.156-1.052-.118-2.389-.566-2.971-.994-.582-.429-2.028-.893-3.213-1.032s-2.501-.566-2.923-.949c-.506-.457-1.811-.795-3.812-.986-2.006-.192-3.397-.552-4.081-1.058-.733-.542-1.947-.826-4.136-.966-2.259-.145-3.321-.401-3.923-.946-.678-.614-1.746-.792-6.004-1.004C227.472 2.507 226 2.021 226 .538 226 .093 221.513 0 200 0c-21.513 0-26 .093-26 .538m37.727 11.461c4.36.212 10.3.754 13.2 1.206 2.9.451 5.993.913 6.873 1.027 1.813.235 7.639 1.483 12.4 2.657l5.4 1.329c5.032 1.236 13.423 4.095 22.8 7.77 42.814 16.778 85.072 59.344 101.769 102.509.574 1.484 1.485 3.824 2.023 5.2 2.835 7.243 6.472 19.517 7.641 25.788.295 1.587.799 3.927 1.119 5.2.319 1.273.701 3.305.849 4.515.147 1.21.613 4.36 1.036 7 1.894 11.824 1.87 37.347-.047 50.105-2.549 16.968-5.004 26.66-10.813 42.695-16.33 45.07-56.364 87.09-100.777 105.776-1.65.694-3.81 1.606-4.8 2.026-3.952 1.679-9.495 3.642-16.4 5.808-26.232 8.23-60.492 10.07-88.2 4.738-7.81-1.503-15.364-3.309-19.6-4.687l-5.8-1.886c-4-1.3-7.797-2.697-10.8-3.973l-4.8-2.033C78.658 355.261 38.366 311.936 22.528 264.8c-.332-.99-.928-2.7-1.322-3.8-1.51-4.208-3.955-12.914-4.887-17.4-.206-.99-.714-3.33-1.129-5.2-.756-3.408-2.185-12.779-2.806-18.4-1.111-10.07-.77-34.961.587-42.8.324-1.87.775-4.93 1.003-6.8.422-3.46 1.441-8.443 2.906-14.2.448-1.76.895-3.65.994-4.2.262-1.456 2.008-7.115 3.826-12.4 2.343-6.812 2.64-7.631 3.488-9.6.426-.99 1.346-3.15 2.045-4.8C45.211 82.745 82.979 44.82 124.8 27.224c1.65-.694 3.81-1.606 4.8-2.026 5.296-2.25 16.103-5.849 22.2-7.394 7.438-1.885 14.41-3.366 17.872-3.796 1.69-.21 4.753-.668 6.807-1.018 7.016-1.196 22.221-1.623 35.248-.991M333.4 93.653c-10.304 11.971-27.646 23.876-49.2 33.773-4.186 1.922-15.21 5.39-21.6 6.795-1.54.339-4.24.96-6 1.38-1.76.42-4.82 1.033-6.8 1.362-5.805.965-10.499 1.776-15.2 2.628-2.42.439-5.93 1.06-7.8 1.38-16.157 2.766-34.328 7.527-44.3 11.606a2328.83 2328.83 0 0 1-4.8 1.957c-23.25 9.446-42.582 28.607-54.854 54.369-3.844 8.071-2.71 8.607 3.171 1.497 10.813-13.073 23.608-23.305 37.983-30.377 1.87-.92 3.744-1.861 4.165-2.092.42-.23 1.68-.75 2.8-1.155 1.119-.405 3.565-1.302 5.435-1.992 11.409-4.214 20.358-5.62 40.8-6.409 13.912-.536 29.084-1.708 35.8-2.763 8.498-1.335 16.522-2.796 21.073-3.836 2.35-.537 4.522-.976 4.826-.976.522 0 5.99-1.755 11.301-3.627 26.774-9.438 45.4-32.654 47.474-59.173.675-8.626-.001-9.313-4.274-4.347m-171-.807c-19.227 1.477-37.672 18.102-44.773 40.354-.737 2.31-1.656 5.1-2.043 6.2-.386 1.1-1.381 4.16-2.211 6.8-2.145 6.823-1.842 6.6-8.943 6.602-7.855.003-7.926.03-12.553 4.739-6.013 6.121-5.716 6.459 5.668 6.459 10.345 0 10.238-.084 8.103 6.336-2.431 7.312-5.255 16.427-6.278 20.264-.587 2.2-1.495 5.406-2.018 7.125-.524 1.718-.951 3.338-.95 3.6.001.261-.456 2.005-1.015 3.875a6366.202 6366.202 0 0 1-4.197 14c-.696 2.31-1.448 4.65-1.673 5.2-.224.55-.728 2.08-1.119 3.4-.835 2.822-4.226 12.316-5.928 16.6l-2.032 5.107c-.462 1.159-1.008 2.419-1.214 2.8-.206.381-1.126 2.223-2.045 4.093-4.981 10.139-15.022 20.361-22.654 23.062-1.007.357-2.525 1.778-2.525 2.363 0 1.189 4.367 1.032 11-.397 15.325-3.3 32.003-18.695 41.186-38.017 1.218-2.562 2.214-4.77 2.214-4.908 0-.138.349-.982.776-1.877 1.573-3.296 3.04-7.559 6.477-18.826.671-2.2 1.547-4.99 1.947-6.2.399-1.21 1.756-5.44 3.015-9.4 3.155-9.92 6.053-18.85 6.817-21 .352-.99.97-2.88 1.373-4.2 2.111-6.904 3.599-10.897 4.479-12.015.761-.968.876-.985 6.758-.985 7.246 0 7.517-.095 11.843-4.164 6.989-6.576 6.834-6.797-4.878-6.963-10.725-.153-10.359.018-9.033-4.194 2.254-7.16 2.983-9.489 3.906-12.479 7.539-24.425 20.844-38.692 32.306-34.643 1.313.464 2.784.843 3.269.843 1.091 0 4.545-3.817 4.545-5.023 0-3.033-8.526-5.228-17.6-4.531m156.728 61.661-5.8 3.514c-12.985 7.864-31.804 14.528-47.928 16.971-1.98.3-5.4.821-7.6 1.158-7.687 1.177-17.13 2.314-22.344 2.691a495.87 495.87 0 0 0-11.056.959c-3.19.318-9.13.768-13.2 1-4.07.233-8.57.61-10 .839-1.43.229-5.03.755-8 1.168-21.942 3.054-39.32 10.821-55.687 24.89-10.745 9.236-19.412 21.543-10.607 15.062 11.28-8.303 19.919-13.067 29.294-16.153 10.973-3.612 25.877-5.634 34.2-4.64 3.859.461 15.716 1.644 24.8 2.475 2.75.252 10.13.461 16.4.464 11.619.007 12.358-.056 24.2-2.065 4.44-.754 11.142-2.682 19.6-5.641 2.662-.931 10.128-4.368 11.462-5.276.584-.398 1.222-.723 1.418-.723 1.472 0 11.998-7.991 16.921-12.846 8.021-7.909 11.39-12.199 14.477-18.433 2.666-5.385 2.477-7.25-.55-5.414M229.8 218.584c-14.947 3.165-24.453 15.146-23.256 29.309.69 8.165 5.111 11.867 19.931 16.691 8.332 2.711 10.718 4.518 11.037 8.355.964 11.634-17.287 14.929-32.163 5.807-4.439-2.723-4.233-2.86-7.716 5.117-2.743 6.283-2.604 6.685 3.305 9.512 14.379 6.88 34.293 4.997 44.001-4.161 9.523-8.984 12.003-24.125 5.134-31.341-2.701-2.837-6.201-4.57-15.473-7.663-11.197-3.734-13.105-5.536-11.842-11.179 1.936-8.652 17.247-10.686 28.242-3.752 3.352 2.114 3.598 2.048 5.168-1.379 3.988-8.706 4.186-9.507 2.737-11.062-3.959-4.247-18.856-6.424-29.105-4.254m-89.331 1.347c-.401.401-.937 1.796-1.189 3.1a727.047 727.047 0 0 1-1.068 5.369 866.18 866.18 0 0 0-1.395 7.084c-.433 2.246-1.046 5.126-1.364 6.4-.317 1.274-.697 3.216-.843 4.316-.147 1.1-.597 3.35-.999 5-.403 1.65-.853 3.9-1 5-.148 1.1-.605 3.35-1.017 5-6.176 24.722 3.235 37.598 26.406 36.129 20.033-1.27 30.431-12.577 35.429-38.529.636-3.298 1.811-9.23 3.132-15.8.354-1.76.997-4.82 1.43-6.8.432-1.98.983-4.77 1.224-6.2.242-1.43.707-3.536 1.035-4.68.327-1.145.54-2.945.473-4l-.123-1.92-6.357-.11c-5.411-.094-6.464-.014-7.075.539-.834.755-2.037 5.855-4.36 18.487-.416 2.265-.938 4.695-1.159 5.4-.222.706-.611 2.713-.865 4.46-.254 1.747-.626 3.609-.827 4.138-.201.529-.626 2.519-.943 4.424-3.349 20.086-8.581 26.662-21.214 26.662-8.238 0-12.108-3.154-12.838-10.463-.3-2.999.038-4.968 4.446-25.937.37-1.76.992-4.91 1.383-7 .688-3.687.994-5.163 3.05-14.714 1.374-6.382 1.678-6.086-6.255-6.086-5.651 0-6.47.084-7.117.731m133.182-.192c-.61.734-1.846 5.021-2.209 7.661-.151 1.1-.704 3.98-1.228 6.4-.524 2.42-1.433 6.83-2.02 9.8-.587 2.97-1.341 6.66-1.676 8.2-.334 1.54-.927 4.51-1.317 6.6-.748 4.006-1.402 7.262-2.975 14.8-.528 2.53-1.441 7.03-2.029 10-.589 2.97-1.318 6.614-1.622 8.098-.972 4.75-1.109 4.705 14.185 4.693 22.287-.018 29.048-1.421 38.956-8.085 6.45-4.338 13.928-14.853 15.871-22.316.256-.985.81-2.87 1.231-4.19 6.408-20.081-.109-35.933-16.818-40.909-4.273-1.273-37.379-1.922-38.349-.752m28.211 13.027c10.331 2.132 14.224 9.205 12.213 22.19-2.976 19.21-11.813 27.571-29.753 28.152-8.968.29-9.196.135-7.947-5.398.762-3.379 1.264-5.821 2.609-12.71.344-1.76.922-4.55 1.285-6.2.362-1.65.969-4.62 1.347-6.6 2.415-12.631 3.84-18.578 4.674-19.499.929-1.027 10.474-.987 15.572.065"
        />
      </g>
    </svg>
  );
}

function DfxAssetIconEUR({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 1000 1000"
      fill={forceColor ?? '#00309B'}
    >
      <path d="M5 500.002v.395-.395c.099-89.506 22.55-172.682 67.253-249.726 44.209-74.473 103.55-133.814 178.023-178.023C327.419 27.45 410.694 5 500.002 5c89.308 0 172.583 22.45 249.726 67.253C824.2 116.462 883.54 175.803 927.75 250.276c44.803 77.143 67.253 160.418 67.253 249.726 0 89.308-22.45 172.583-67.253 249.726C883.541 824.2 824.2 883.54 749.728 927.75c-77.143 44.803-160.418 67.253-249.726 67.253-89.308 0-172.583-22.45-249.726-67.253-74.473-44.209-133.814-103.55-178.023-178.022C27.55 672.684 5.099 589.508 5 500.002zm210.66 80.604h57.363c7.912 0 7.912 2.967 9.89 8.901 7.912 33.627 19.78 65.275 35.605 96.924 37.582 72.198 101.868 112.747 183.956 125.605 52.418 9.89 112.748 1.978 167.144-17.803 2.967-1.978 6.923-6.923 6.923-9.89V707.2c-75.165 49.45-148.352 53.407-225.496 10.88-48.461-26.704-81.099-81.1-85.055-137.474h249.232c.989-18.791 5.934-36.593 9.89-54.395H356.1v-55.385h281.87c1.977-19.78 5.933-37.583 10.878-57.363H363.023c3.956-47.473 50.44-128.572 120.66-150.33 67.253-22.748 132.528-16.814 192.858 27.692 4.945-19.78 16.813-72.198 16.813-75.165-58.352-36.594-140.44-42.528-202.748-26.703-114.726 27.692-184.946 98.901-209.671 213.627 0 2.967-2.967 6.923-2.967 10.879H235.44c-3.956 0-5.934 1.978-7.912 6.923-3.956 14.835-5.934 28.681-10.879 43.517 0 1.978-.989 4.945-.989 6.923h57.363v52.417h-34.616c-6.923 0-7.912 2.968-10.879 10.88-3.956 14.835-5.934 27.692-10.879 42.527 0 2.967-.989 2.967-.989 3.956z"></path>
    </svg>
  );
}

function DfxAssetIconUSD({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 1000 1000"
      fill={forceColor ?? '#269B56'}
    >
      <path d="M500.496 5C223.572 5 5 229.506 5 500.002c0 276.43 224.506 495.001 495.002 495.001 276.43 0 495.001-224.506 495.001-495.001C995.003 226.539 773.464 5 500.496 5zM297.183 628.253l77.708-14.416c16.418 75.066 56.67 112.154 119.671 112.154 59.34 0 102.858-46.483 102.858-105.824 0-66.264-58.352-95.935-120.66-124.616-69.231-31.648-140.44-66.264-140.44-159.231 0-72.198 49.45-129.561 135.495-152.308V114.78h69.23v69.23c59.935 7.913 98.408 38.177 128.968 97.814l-73.88 42.132c-21.757-40.055-53.9-62.802-90.692-62.802-46.483 0-82.088 32.637-82.088 75.165 0 44.505 32.638 63.297 90.99 90.99 30.659 14.834 57.362 29.67 81.099 42.527 59.34 31.648 87.033 81.099 87.033 150.33 0 87.033-60.33 167.143-141.43 181.979v75.165h-69.23v-69.23C362.726 785.43 320 743.3 297.155 628.277zm296.28-302.812c0-.297.297-.396.693-.396z"></path>
    </svg>
  );
}

function DfxAssetIconCHF({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 1000 1000"
      fill={forceColor ?? '#D52B1E'}
    >
      <path d="M500.5,5C223.572,5,5,229.506,5,500c0,276.43,224.506,495,495,495,276.43,0,495-224.506,495-495C995,226.539,773.464,5,500.5,5Zm-362.7,625.717a42.773,42.773,0,0,0,21.476,21.192,72,72,0,0,0,30.517,6.783,85.17,85.17,0,0,0,27.127-4.522,45.207,45.207,0,0,0,30.518-41.82h69.513a113.451,113.451,0,0,1-9.608,45.776A94.884,94.884,0,0,1,278.8,695.143a108.578,108.578,0,0,1-42.1,20.628,197.636,197.636,0,0,1-46.907,5.651,204.484,204.484,0,0,1-40.125-3.956,113.55,113.55,0,0,1-37.017-14.411,102.156,102.156,0,0,1-29.387-26.844A99.357,99.357,0,0,1,66.3,640.042a166.872,166.872,0,0,1-4.8-39.56V417.94A165.754,165.754,0,0,1,66.3,378.1a99.67,99.67,0,0,1,16.954-35.887,102.4,102.4,0,0,1,29.387-26.844,113.976,113.976,0,0,1,37.017-14.411A204.56,204.56,0,0,1,189.787,297a197.636,197.636,0,0,1,46.907,5.651,108.83,108.83,0,0,1,42.1,20.628A94.949,94.949,0,0,1,307.337,360.3a113.456,113.456,0,0,1,9.608,45.777H247.432a42.56,42.56,0,0,0-8.477-25.715,43.966,43.966,0,0,0-22.041-16.106,85.42,85.42,0,0,0-27.127-4.521,74.739,74.739,0,0,0-30.517,6.5,41.386,41.386,0,0,0-21.476,21.193,72.073,72.073,0,0,0-6.781,30.517V600.482A70.17,70.17,0,0,0,137.794,630.717ZM626.868,716.9H557.356V536.055H446.589V716.9H377.076V301.521h69.513V472.759H557.356V301.521h69.512Zm255.26-251.489v62.731H758.361V716.9H688.284V301.521H919.426v62.731H758.361v101.16Z"></path>
    </svg>
  );
}

function DfxAssetIconGBP({ forceColor }: BaseAssetIconProps) {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 1000 1000"
      fill={forceColor ?? '#012479'}
    >
      <path d="M500.496 5C223.572 5 5 229.506 5 500.002c0 276.43 224.506 495.001 495.002 495.001 276.43 0 495.001-224.506 495.001-495.001C995.003 226.539 773.464 5 500.496 5zM275.001 803.135v-73.188h60.33V511.375h-54.396c-6.923 0-5.934.99-5.934-3.956v-56.374c0-4.945-2.967-3.956 4.945-3.956h57.363c0-20.769-.99-37.582-1.978-53.406 0-7.913-.99-14.836-.99-22.748 0-35.604.99-59.34 10.88-96.923 16.813-63.297 58.352-102.858 129.56-122.638 61.32-16.813 138.463-.989 210.66 46.484 3.957 2.967 3.957 2.967-.988 8.9-4.945 5.935-20.77 29.671-43.517 52.419-2.967 2.967.99 3.956-6.923 0-33.626-19.78-68.242-34.616-107.802-33.627-102.858 2.967-98.902 57.363-98.902 217.583l4.945 3.956h161.21v58.352c0 5.934 0 5.934-4.946 5.934h-159.23c-1.979 76.154-1.979 145.385-1.979 216.594 78.132 0 157.253 0 236.375-1.978V628.08c0-6.923-.99-3.956 1.978-3.956h77.143v179.012z"></path>
    </svg>
  );
}

function DfxAssetIconPlaceholder() {
  const sizeContext = useContext(SizeContext);
  return (
    <svg
      width={SIZE_MAPS[sizeContext]}
      height={SIZE_MAPS[sizeContext]}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_422_24)">
        <circle cx="16" cy="16" r="16" fill="#B8C4D8" />
        <path
          d="M19.6935 23.0748C23.7288 23.0748 27 19.8036 27 15.7684C27 11.7331 23.7288 8.46188 19.6935 8.46188C15.6583 8.46188 12.3871 11.7331 12.3871 15.7684C12.3871 19.8036 15.6583 23.0748 19.6935 23.0748Z"
          fill="url(#paint0_linear_422_24)"
        />
        <path
          d="M13.0383 24.0767C17.4778 24.0767 21.0767 20.4778 21.0767 16.0383C21.0767 11.5989 17.4778 8 13.0383 8C8.59889 8 5 11.5989 5 16.0383C5 20.4778 8.59889 24.0767 13.0383 24.0767Z"
          fill="url(#paint1_linear_422_24)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_422_24"
          x1="25.8226"
          y1="12.5767"
          x2="12.8376"
          y2="19.2706"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.104167" stopColor="white" />
          <stop offset="0.520833" stopColor="#C7D0E0" />
          <stop offset="1" stopColor="#B8C4D8" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_422_24"
          x1="17.941"
          y1="10.1956"
          x2="7.60596"
          y2="22.5088"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="0.375" stopColor="#F3F5F8" />
          <stop offset="0.682292" stopColor="#E3E8F0" />
          <stop offset="1" stopColor="#C7D1E0" />
        </linearGradient>
        <clipPath id="clip0_422_24">
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
