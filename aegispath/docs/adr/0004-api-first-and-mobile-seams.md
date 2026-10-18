# ADR 0004: API-First Contracts & Mobile Architectural Seams

## Status
Accepted

## Context
A future mobile client will be deployed. We must avoid duplicating or rewriting business rules in client applications.

## Decision
All financial and security decision-making resides exclusively within `services/api`. The API is contract-first with an OpenAPI 3.1 specification committed to `packages/contracts`. We expose typed interfaces for `TokenStore` and `Authenticator` to permit native mobile secure storage and biometric hardware integration seamlessly.

## Consequences
- Web, PWA, and future native apps behave identically and share the exact same safety assurances.
