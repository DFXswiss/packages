/** Minimal host surface the JSON helpers need (a browser, or a fake in tests). */
export interface WebAuthnJsonHost {
  PublicKeyCredential?: unknown;
  atob?: (data: string) => string;
  btoa?: (data: string) => string;
}

/** PRF client inputs as sent to `create()`/`get()` (not in every lib.dom). */
export type PrfClientInputs = AuthenticationExtensionsClientInputs & {
  prf?: { eval?: { first?: Uint8Array } };
};

/** PRF results as returned by `getClientExtensionResults()`. */
export interface PrfClientResults {
  prf?: { results?: { first?: BufferSource } };
}

function host(): WebAuthnJsonHost {
  return globalThis as unknown as WebAuthnJsonHost;
}

/** Decodes base64url (no padding required) with `atob` semantics. */
export function base64UrlToBytes(value: string): Uint8Array {
  const api = host();
  const atob = typeof api.atob === 'function' ? api.atob.bind(api) : undefined;
  if (!atob) throw new TypeError('base64url decoding needs atob');
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  const binary = atob(`${padded}${pad}`);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Encodes bytes as base64url without padding. */
export function bytesToBase64Url(bytes: Uint8Array): string {
  const api = host();
  const btoa = typeof api.btoa === 'function' ? api.btoa.bind(api) : undefined;
  if (!btoa) throw new TypeError('base64url encoding needs btoa');
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/u, '');
}

/** A credential or assertion serialized for the DFX API, PRF results stripped. */
export type WebAuthnJson = Record<string, unknown>;

function withoutPrfResults(json: WebAuthnJson): WebAuthnJson {
  const ext = json['clientExtensionResults'];
  if (ext === null || typeof ext !== 'object' || Array.isArray(ext)) return json;
  const next = { ...(ext as WebAuthnJson) };
  delete next['prf'];
  return { ...json, clientExtensionResults: next };
}

/**
 * Serializes a `PublicKeyCredential` for the API: WebAuthn Level 3 `toJSON()` when present, otherwise by
 * hand. Never carries `clientExtensionResults.prf` (the PRF bytes never leave the tab), but adds
 * `authenticatorAttachment` and attestation `transports`.
 */
export function credentialToJSON(credential: PublicKeyCredential): WebAuthnJson {
  const native = credential as PublicKeyCredential & {
    toJSON?: () => WebAuthnJson;
    authenticatorAttachment?: AuthenticatorAttachment | null;
  };
  let json: WebAuthnJson;
  if (typeof native.toJSON === 'function') {
    json = native.toJSON();
  } else {
    const response = credential.response as AuthenticatorResponse & {
      clientDataJSON: ArrayBuffer;
      attestationObject?: ArrayBuffer;
      authenticatorData?: ArrayBuffer;
      signature?: ArrayBuffer;
      userHandle?: ArrayBuffer | null;
      getTransports?: () => AuthenticatorTransport[];
    };
    const base: WebAuthnJson = {
      id: credential.id,
      rawId: bytesToBase64Url(new Uint8Array(credential.rawId)),
      type: credential.type,
      clientExtensionResults: credential.getClientExtensionResults(),
      authenticatorAttachment: native.authenticatorAttachment ?? null,
    };
    if (response.attestationObject !== undefined) {
      base['response'] = {
        clientDataJSON: bytesToBase64Url(new Uint8Array(response.clientDataJSON)),
        attestationObject: bytesToBase64Url(new Uint8Array(response.attestationObject)),
        transports: typeof response.getTransports === 'function' ? response.getTransports() : [],
      };
    } else {
      base['response'] = {
        clientDataJSON: bytesToBase64Url(new Uint8Array(response.clientDataJSON)),
        authenticatorData: bytesToBase64Url(new Uint8Array(response.authenticatorData ?? new ArrayBuffer(0))),
        signature: bytesToBase64Url(new Uint8Array(response.signature ?? new ArrayBuffer(0))),
        userHandle:
          response.userHandle === null || response.userHandle === undefined
            ? null
            : bytesToBase64Url(new Uint8Array(response.userHandle)),
      };
    }
    json = base;
  }
  json['authenticatorAttachment'] = native.authenticatorAttachment ?? null;
  return withoutPrfResults(json);
}
