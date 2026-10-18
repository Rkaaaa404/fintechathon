# @aegispath/web

React 18 + Vite Progressive Web App (PWA) client for AegisPath.

## Purpose
Provides the 7 phone screen interfaces and desktop web workspace for AegisPath. It is a thin presentation layer that consumes typed data from `@aegispath/api-client`.

## Boundaries
- Contains **NO business rules** or limit checking. All security logic is enforced by `services/api`.
- Adheres strictly to the design tokens and SVG art assets.
- Communicates exclusively with `services/api` on port 8000.
