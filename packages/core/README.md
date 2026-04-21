# @dfx.swiss/core

Framework-agnostic TypeScript SDK for the [DFX.swiss](https://dfx.swiss) API. Provides type definitions, API client, utilities, and validations.

## Installation

```bash
npm install @dfx.swiss/core
```

## Usage

```typescript
import { DfxApiClient, Blockchain } from '@dfx.swiss/core';

const client = new DfxApiClient({
  apiUrl: 'https://api.dfx.swiss/v1', // optional, this is the default
});

// Authenticate
const message = await client.auth.getSignMessage(walletAddress);
const signIn = await client.auth.authenticate({ address, signature });
client.setToken(signIn.accessToken);

// Use API
const assets = await client.asset.list({ blockchains: [Blockchain.ETHEREUM] });
const user = await client.user.get();
```

## API Client

`DfxApiClient` provides typed access to all DFX API endpoints:

| Property | Description |
|----------|-------------|
| `auth` | Authentication (wallet, email, LNURL) |
| `asset` | Asset listing and filtering |
| `bank` | Bank operations |
| `bankAccount` | Bank account management |
| `buy` | Buy transactions |
| `country` | Country data |
| `fiat` | Fiat currencies |
| `kyc` | KYC/compliance workflows |
| `language` | Language settings |
| `paymentLinks` | Payment link management |
| `paymentRoutes` | Payment routing |
| `sell` | Sell transactions |
| `settings` | App settings |
| `support` | Support messaging |
| `swap` | Swap operations |
| `transaction` | Transaction history |
| `user` | User management |

## Custom fetch

For server-side usage or testing, inject a custom `fetch` function:

```typescript
const client = new DfxApiClient({
  fetchFn: customFetch,
});
```

## Compatibility

Requires a global `fetch` implementation (Node.js 18+ or browser). The package uses DOM APIs (`File`, `FileReader`, `Blob`) for file handling — ensure your environment supports these or polyfill as needed.

## License

MIT
