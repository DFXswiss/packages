import type { WalletEnv } from '../config/environment';
import { RP_IDS } from '../config/environment';

/** What the app needs to know before it may show the passkey tile. */
export interface PlatformReport {
  available: boolean;
  reason?: 'no-webauthn' | 'no-prf' | 'in-app-browser' | 'embedded' | 'wrong-origin' | 'os-too-old';
  /** Whether the client advertises the PRF extension: `false` hides the tile (§6.3). */
  prf: 'yes' | 'no' | 'unknown';
  /** Installed OS version when it could be read, for diagnostics. */
  os?: string;
}

/** Host surface the platform checks inspect (browser or fake). */
export interface PlatformHost {
  navigator: {
    userAgent: string;
    credentials?: { create?: unknown; get?: unknown };
    userAgentData?: { getHighEntropyValues?: (hints: string[]) => Promise<Record<string, string>> };
  };
  location: { hostname: string; href: string; origin: string; pathname: string };
  open?: (url: string, target?: string, features?: string) => unknown;
  /** `window.top` / `window.self` when inspectable; both absent means "assume top-level". */
  top?: unknown;
  self?: unknown;
  PublicKeyCredential?: {
    getClientCapabilities?: () => Promise<Record<string, boolean>>;
    isConditionalMediationAvailable?: () => Promise<boolean>;
  };
  TelegramWebviewProxy?: unknown;
  TelegramWebview?: unknown;
  Telegram?: { WebApp?: { openLink?: (url: string) => unknown } };
}

/** Case-insensitive UA tokens of embedded in-app browsers that cannot run WebAuthn. */
const IN_APP_UA =
  /Telegram|Instagram|FBAN|FBAV|FB_IAB|FBIOS|FB4A|Messenger|Orca-Android|WhatsApp|BytedanceWebview|musical_ly|TikTok|TwitterAndroid|\bTwitter\b|LinkedInApp|Snapchat|Pinterest|Reddit|MicroMessenger|\bLine\/|KAKAOTALK|Weibo|NAVER|baiduboxapp|\bGSA\b|Barcelona/i;

const IOS_UA = /iPhone|iPad|iPod/i;
const ANDROID_UA = /\bAndroid (\d+)(?:\.(\d+))?(?:\.(\d+))?/;

function host(win?: PlatformHost): PlatformHost | undefined {
  if (win !== undefined) return win;
  return typeof globalThis.window === 'undefined' ? undefined : (globalThis.window as unknown as PlatformHost);
}

function isTelegramHost(h: PlatformHost): boolean {
  return (
    h.TelegramWebviewProxy !== undefined ||
    h.TelegramWebview !== undefined ||
    h.Telegram?.WebApp !== undefined ||
    /Telegram/i.test(h.navigator.userAgent)
  );
}

/** True inside an embedded in-app browser (Telegram, Instagram, …). */
export function isInAppBrowser(win?: PlatformHost): boolean {
  const h = host(win);
  if (!h) return false;
  return isTelegramHost(h) || IN_APP_UA.test(h.navigator.userAgent);
}

/** Installed iOS version from the UA, or null on other platforms / missing token. */
export function iosInstalledVersion(userAgent: string): string | null {
  if (!IOS_UA.test(userAgent)) return null;
  const match = /\bOS (\d+)[_.](\d+)(?:[_.](\d+))?/.exec(userAgent);
  if (!match) return null;
  return match[3] === undefined ? `${match[1]}.${match[2]}` : `${match[1]}.${match[2]}.${match[3]}`;
}

function parseAndroid(ua: string): { major: number; installed: string } | null {
  const match = ANDROID_UA.exec(ua);
  if (!match) return null;
  return {
    major: Number(match[1]),
    installed:
      match[2] === undefined
        ? match[1]
        : match[3] === undefined
          ? `${match[1]}.${match[2]}`
          : `${match[1]}.${match[2]}.${match[3]}`,
  };
}

/** Installed Android version, preferring `userAgentData` (Chrome freezes the UA at Android 10). */
export async function androidInstalledVersion(win?: PlatformHost): Promise<string | null> {
  const h = host(win);
  if (!h) return null;
  const read = h.navigator.userAgentData?.getHighEntropyValues;
  if (typeof read === 'function') {
    try {
      const values = await read.call(h.navigator.userAgentData, ['platformVersion']);
      const platformVersion = typeof values['platformVersion'] === 'string' ? values['platformVersion'] : null;
      if (platformVersion !== null) return platformVersion.split('.')[0] || platformVersion;
    } catch {
      // fall through to the UA token
    }
  }
  return parseAndroid(h.navigator.userAgent)?.installed ?? null;
}

/**
 * Checks whether the wallet's passkey ceremonies can run here at all: real top-level page on the
 * environment's RP host, WebAuthn present, OS new enough, not inside an in-app browser. The PRF soft gate
 * only hides the tile (`available: false`, `prf: 'no'`); PRF absence in an old browser is `unknown`.
 */
export async function checkPasskeyPlatform(env: WalletEnv, win?: PlatformHost): Promise<PlatformReport> {
  const h = host(win);
  const webauthn =
    !!h &&
    typeof h.PublicKeyCredential === 'function' &&
    typeof h.navigator.credentials?.create === 'function' &&
    typeof h.navigator.credentials?.get === 'function';
  if (!h || !webauthn) return { available: false, reason: 'no-webauthn', prf: 'unknown' };
  if (isInAppBrowser(h)) return { available: false, reason: 'in-app-browser', prf: 'unknown' };
  if (h.location.hostname !== RP_IDS[env]) return { available: false, reason: 'wrong-origin', prf: 'unknown' };

  const topKnown = h.top !== undefined || h.self !== undefined || typeof globalThis.window !== 'undefined';
  try {
    const top =
      h.top ??
      (typeof globalThis.window !== 'undefined' ? (globalThis.window as unknown as { top?: unknown }).top : undefined);
    const self =
      h.self ??
      (typeof globalThis.window !== 'undefined'
        ? (globalThis.window as unknown as { self?: unknown }).self
        : undefined);
    if (topKnown && top !== self) return { available: false, reason: 'embedded', prf: 'unknown' };
  } catch {
    return { available: false, reason: 'embedded', prf: 'unknown' };
  }

  const ua = h.navigator.userAgent;
  const ios = iosInstalledVersion(ua);
  if (ios !== null && Number(ios.split('.')[0]) < 18)
    return { available: false, reason: 'os-too-old', prf: 'unknown', os: ios };
  const android = await androidInstalledVersion(h);
  if (android !== null && !IOS_UA.test(ua) && Number(android.split('.')[0]) < 9) {
    return { available: false, reason: 'os-too-old', prf: 'unknown', os: android };
  }

  const Credential = h.PublicKeyCredential;
  try {
    const capabilities = await Credential?.getClientCapabilities?.();
    const prf = capabilities?.['extension:prf'];
    if (prf === false) return { available: false, reason: 'no-prf', prf: 'no', os: ios ?? android ?? undefined };
    return { available: true, prf: prf === true ? 'yes' : 'unknown', os: ios ?? android ?? undefined };
  } catch {
    return { available: true, prf: 'unknown', os: ios ?? android ?? undefined };
  }
}

/** Best-effort handoff of the login URL to the system browser when stuck in an in-app browser. */
export function openInSystemBrowser(url: string, win?: PlatformHost): void {
  const h = host(win);
  if (!h) return;
  const ua = h.navigator.userAgent;
  if (/Android/i.test(ua)) {
    const hostAndPath = url.replace(/^https:\/\//u, '');
    h.location.href = `intent://${hostAndPath}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url)};end`;
    return;
  }
  const openLink = h.Telegram?.WebApp?.openLink;
  if (typeof openLink === 'function') {
    openLink(url);
    return;
  }
  if (IOS_UA.test(ua) && isTelegramHost(h) && url.startsWith('https://')) {
    h.location.href = `x-safari-${url}`;
    return;
  }
  h.open?.(url, '_blank', 'noopener,noreferrer');
}
