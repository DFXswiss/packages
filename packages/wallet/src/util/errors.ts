/**
 * Base class of every error the wallet throws. `code` is a stable machine-readable identifier that callers
 * may branch on; `message` is for logs and diagnostics and never contains secrets.
 */
export class WalletError extends Error {
  readonly code: string;

  constructor(code: string, message?: string, options?: { cause?: unknown }) {
    super(message ?? code, options);
    this.name = new.target.name;
    this.code = code;
  }
}

export function isWalletError(error: unknown, code?: string): error is WalletError {
  return error instanceof WalletError && (code === undefined || error.code === code);
}
