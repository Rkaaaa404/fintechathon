# ADR 0001: Monorepo Architecture

## Status
Accepted

## Context
AegisPath requires tight coupling between backend data models, OpenAPI contracts, TypeScript API clients, i18n dictionaries, and design tokens across web and future mobile applications.

## Decision
We adopt a monorepo structure with workspace support (`apps/*`, `services/*`, `packages/*`). Shared types and contracts are derived directly from the API service and committed to prevent drift.

## Consequences
- Single commit history tracks contract updates, backend changes, and frontend views.
- Zero copy-pasting of JSON schema or token definitions.
