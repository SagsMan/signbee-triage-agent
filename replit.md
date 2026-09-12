# SignBee Agent Mobile

An Expo Go mobile client that guides people through interpreter booking, triage, matching, messaging, and payment status.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/signbee-agent-mobile run dev` — run the Expo Go mobile preview
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env for the shared API: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Mobile: Expo Router, React Native, AsyncStorage, Inter font

## Where things live

- `artifacts/signbee-agent-mobile/app/index.tsx` — mobile onboarding, request, matching, conversation, payment, and completion flow
- `artifacts/signbee-agent-mobile/constants/colors.ts` — SignBee palette and semantic theme tokens
- `artifacts/signbee-agent-mobile/app.json` — static Expo configuration
- `artifacts/api-server` — shared Express API boundary for future Python triage service integration

## Architecture decisions

- The first mobile build is frontend-first and uses AsyncStorage for onboarding persistence.
- The request flow is intentionally a single native stack so each step can be tested from Expo Go without requiring the backend to be colocated.
- The UI uses the SignBee README reference assets and lime/lilac/navy visual language.

## Product

Users can onboard, start an in-person or virtual interpreter request, describe the situation, choose a setting, view triage progress, review a matched interpreter, message them, view payment details, and complete the request.

## User preferences

- The user wants the interface based on the 12 SignBee screens in the existing GitHub README/reference gallery.
- The user wants React Native / Expo Go for the app view and already has a Python backend in the source repository.

## Gotchas

- Use the managed Expo workflow rather than starting Expo directly so Replit injects the preview environment.
- The current mobile artifact uses local state and AsyncStorage; the Python triage service still needs an explicit reachable endpoint before wiring production requests.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
