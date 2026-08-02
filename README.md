# Inova Medika frontend

React frontend for the Mini Clinic Information System. The current milestone
provides the application shell, responsive dashboard foundation, HTTP boundary,
server-state provider, and non-sensitive UI store. Dashboard values intentionally
remain empty until the backend endpoint is integrated; the UI does not calculate
or invent operational metrics.

## Requirements

- Node.js 22.12 or newer
- pnpm 11.18 or newer
- Backend API at `http://localhost:3000/api/v1` by default

## Setup

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

The development server runs at `http://localhost:5173`.

Environment variables are parsed with Zod during startup:

| Variable              | Default   | Purpose                       |
| --------------------- | --------- | ----------------------------- |
| `VITE_API_BASE_URL`   | `/api/v1` | Backend API base URL          |
| `VITE_API_TIMEOUT_MS` | `10000`   | Axios timeout in milliseconds |

Only public browser configuration may use the `VITE_` prefix. Never put tokens,
credentials, patient identifiers, or clinical content in frontend environment
files.

## Security checks

- Keep local values in `.env.local`; the file is ignored by Git.
- Treat every `VITE_` value as public because it is included in the browser bundle.
- Scan the full local history with `gitleaks git --redact .` before publishing
  security-sensitive changes.
- GitHub Actions scans every push and pull request for leaked secrets and runs the
  complete quality suite.
- Dependabot checks pnpm dependencies and GitHub Actions each week.

## Commands

```bash
pnpm dev                 # Start Vite
pnpm format              # Format source and configuration
pnpm format:check        # Verify formatting
pnpm lint                # Run Oxlint with zero warnings
pnpm typecheck           # Run TypeScript project checks
pnpm test                # Run Vitest once
pnpm test:watch          # Run Vitest in watch mode
pnpm build               # Type-check and build production assets
pnpm quality:duplication # Detect source duplication
pnpm check               # Run every quality gate
```

## Architecture

```text
src/
├── app/                    # Providers, environment, query client, router
├── features/               # Domain-owned pages and components
├── lib/http/               # Axios transport and normalized API errors
├── shared/components/      # Cross-feature application shell
├── shared/stores/          # Non-sensitive Zustand UI state only
└── test/                   # Shared test setup
```

State ownership is intentionally strict:

- TanStack Query owns all server state and its cache.
- Axios transports requests and only retries an unauthorized protected request
  once after a single-flight session refresh. It has no cache or general retry
  layer.
- Zustand only owns sidebar and idle-warning visibility and is not persisted.
- URL parameters will own filters, pagination, dates, and selected resource IDs.
- Access tokens stay in the in-memory auth module; refresh credentials belong in
  an `HttpOnly` cookie managed by the backend.

## Authentication lifecycle

- Login, refresh, and logout use `/login`, `/refresh`, and `/logout` under the
  configured API base URL.
- The access token and CSRF token stay in the in-memory credential module. They
  are excluded from TanStack Query data and browser storage.
- The rotating refresh credential is only handled by the backend through an
  `HttpOnly`, `SameSite=Strict` cookie.
- Reloading the page restores the session through the browser-wide CSRF cookie
  and the refresh endpoint. Concurrent unauthorized requests share one refresh
  operation and each request is retried at most once.
- Protected routes return to login when the session is no longer valid. Menus are
  filtered by role, while the backend remains authoritative for authorization.
- A warning appears after 13 minutes without user activity. The local session
  ends after 15 minutes unless the user extends it; the backend remains
  authoritative for idle and absolute expiry.

## Typed API requests

Feature API modules pass TanStack Query's `AbortSignal` and a Zod schema to the
shared request function:

```ts
import { z } from 'zod'
import { requestApi } from '@/lib/http/http-client'

const healthSchema = z.object({ status: z.string() })

export function getHealth(signal: AbortSignal) {
  return requestApi({
    url: '/health/ready',
    schema: healthSchema,
    signal,
  })
}
```

Server errors are reduced to the safe `{ message, code, status, requestId,
details }` contract. Raw Axios responses, stack traces, access tokens, and patient
data must not be written to operational logs.

## UI foundation

- Kumo 2.9 uses granular imports and Tailwind CSS 4 source scanning.
- React Router 8.3 provides the patched browser routing APIs directly.
- Content copy remains 14px; larger sizes are reserved for headings.
- Headings use sentence case and semibold weight.
- Icon-only controls have accessible names.
- Status always includes text and is never communicated by color alone.
- The responsive sidebar and idle warning are backed by one non-persistent UI
  store.

This repository is self-contained and has no package, source file, or build-time
dependency on the backend repository. Integration happens exclusively through the
HTTP API configured by `VITE_API_BASE_URL`. Hiding data in the frontend never
replaces backend field- and record-level authorization.
