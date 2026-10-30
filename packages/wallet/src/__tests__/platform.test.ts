import type { PlatformHost } from '../passkey/platform';
import {
  androidInstalledVersion,
  checkPasskeyPlatform,
  iosInstalledVersion,
  isInAppBrowser,
  openInSystemBrowser,
} from '../passkey/platform';

const MAC_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15';
const IPHONE_17_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15';
const IPHONE_18_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15';
const ANDROID_8_UA = 'Mozilla/5.0 (Linux; Android 8.1.0; Pixel) Chrome/120';

function host(
  overrides: { navigator?: Record<string, unknown>; location?: Record<string, unknown> } & Record<string, unknown> = {},
): PlatformHost {
  const { navigator: nav = {}, location: loc = {}, ...rest } = overrides;
  return {
    navigator: { userAgent: MAC_UA, credentials: { create: () => null, get: () => null }, ...nav },
    location: {
      hostname: 'app.dfx.swiss',
      href: 'https://app.dfx.swiss/',
      origin: 'https://app.dfx.swiss',
      pathname: '/',
      ...loc,
    },
    PublicKeyCredential: function PublicKeyCredential() {
      return;
    },
    ...rest,
  } as unknown as PlatformHost;
}

function capabilities(caps: Record<string, boolean> | undefined): PlatformHost {
  const constructor = function PublicKeyCredential() {
    return;
  } as unknown as {
    getClientCapabilities?: () => Promise<Record<string, boolean>>;
  };
  if (caps) constructor.getClientCapabilities = async () => caps;
  return host({ PublicKeyCredential: constructor });
}

describe('isInAppBrowser', () => {
  it('detects the known in-app UA tokens (21gifts table)', () => {
    for (const token of [
      'TelegramBot (like TwitterBot)',
      'Instagram 219.0',
      'FBAN/iOS',
      'TikTok 33.0',
      'Snapchat',
      'Line/13.0',
    ]) {
      expect(isInAppBrowser(host({ navigator: { userAgent: token } }))).toBe(true);
    }
  });

  it('detects Telegram bridges before the UA', () => {
    const withBridge = host({ TelegramWebviewProxy: {} });
    expect(isInAppBrowser(withBridge)).toBe(true);
  });

  it('accepts a normal browser and no window', () => {
    expect(isInAppBrowser(host())).toBe(false);
    expect(isInAppBrowser(undefined)).toBe(false);
  });
});

describe('checkPasskeyPlatform', () => {
  it('requires WebAuthn', async () => {
    const report = await checkPasskeyPlatform('prd', host({ PublicKeyCredential: undefined }));
    expect(report).toMatchObject({ available: false, reason: 'no-webauthn' });
  });

  it('refuses in-app browsers, wrong origins and embedded pages', async () => {
    expect(await checkPasskeyPlatform('prd', host({ navigator: { userAgent: 'TelegramBot' } }))).toMatchObject({
      reason: 'in-app-browser',
    });
    expect(await checkPasskeyPlatform('prd', host({ location: { hostname: 'dev.app.dfx.swiss' } }))).toMatchObject({
      reason: 'wrong-origin',
    });
    expect(await checkPasskeyPlatform('dev', host({ location: { hostname: 'dev.app.dfx.swiss' } }))).toMatchObject({
      available: true,
    });
    expect(await checkPasskeyPlatform('prd', host({ top: {}, self: {} }))).toMatchObject({ reason: 'embedded' });
  });

  it('blocks iOS below 18 and Android below 9, passes current systems', async () => {
    expect(
      await checkPasskeyPlatform('prd', capabilities({ 'extension:prf': true }) as unknown as PlatformHost),
    ).toMatchObject({
      available: true,
      prf: 'yes',
    });
    const ios = host({ navigator: { userAgent: IPHONE_17_UA, credentials: { create: () => null, get: () => null } } });
    expect(await checkPasskeyPlatform('prd', ios)).toMatchObject({ reason: 'os-too-old', os: '17.5' });
    const ios18 = host({
      navigator: { userAgent: IPHONE_18_UA, credentials: { create: () => null, get: () => null } },
    });
    expect(await checkPasskeyPlatform('prd', ios18)).toMatchObject({ available: true, os: '18.1' });
    const android8 = host({
      navigator: { userAgent: ANDROID_8_UA, credentials: { create: () => null, get: () => null } },
    });
    expect(await checkPasskeyPlatform('prd', android8)).toMatchObject({ reason: 'os-too-old', os: '8.1.0' });
  });

  it('soft-gates PRF: false hides the tile, absent stays unknown', async () => {
    expect(await checkPasskeyPlatform('prd', capabilities({ 'extension:prf': false }))).toMatchObject({
      available: false,
      reason: 'no-prf',
      prf: 'no',
    });
    expect(await checkPasskeyPlatform('prd', capabilities(undefined))).toMatchObject({
      available: true,
      prf: 'unknown',
    });
  });
});

describe('OS version readers', () => {
  it('parses iOS versions', () => {
    expect(iosInstalledVersion(IPHONE_18_UA)).toBe('18.1');
    expect(iosInstalledVersion(IPHONE_17_UA)).toBe('17.5');
    expect(iosInstalledVersion(MAC_UA)).toBeNull();
  });

  it('prefers high-entropy Android data over the frozen UA', async () => {
    const uaHost = host({ navigator: { userAgent: ANDROID_8_UA } });
    expect(await androidInstalledVersion(uaHost)).toBe('8.1.0');

    const frozen = host({
      navigator: {
        userAgent: 'Mozilla/5.0 (Linux; Android 10; K) Chrome/120',
        userAgentData: { getHighEntropyValues: async () => ({ platformVersion: '15.0.0' }) },
      },
    });
    expect(await androidInstalledVersion(frozen)).toBe('15');
  });
});

describe('openInSystemBrowser', () => {
  it('uses a Chrome intent on Android', () => {
    const h = host({
      navigator: { userAgent: 'Android 14' },
      location: { hostname: 'x', href: '', origin: '', pathname: '' },
    }) as PlatformHost & { location: { href: string } };
    openInSystemBrowser('https://app.dfx.swiss/login', h);
    expect(h.location.href).toContain('intent://app.dfx.swiss/login');
  });

  it('uses the Telegram bridge, x-safari on iOS Telegram, and a new tab otherwise', () => {
    const telegram = host({ navigator: { userAgent: 'Telegram' }, Telegram: { WebApp: { openLink: jest.fn() } } });
    openInSystemBrowser('https://app.dfx.swiss/', telegram);
    expect(telegram.Telegram?.WebApp?.openLink).toHaveBeenCalledWith('https://app.dfx.swiss/');

    const iosTelegram = host({
      navigator: { userAgent: 'iPhone Telegram' },
      TelegramWebviewProxy: {},
    }) as PlatformHost & { location: { href: string } };
    openInSystemBrowser('https://app.dfx.swiss/', iosTelegram);
    expect(iosTelegram.location.href).toBe('x-safari-https://app.dfx.swiss/');

    const normal = host({ open: jest.fn() });
    openInSystemBrowser('https://app.dfx.swiss/', normal);
    expect(normal.open).toHaveBeenCalledWith('https://app.dfx.swiss/', '_blank', 'noopener,noreferrer');
  });
});
