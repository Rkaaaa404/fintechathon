# Mobile Readiness & Architectural Seams

AegisPath Web-First is intentionally constructed so that mobile clients (via Capacitor wrapper or React Native) can connect **without rewriting any business logic**.

## 1. Architectural Seams

### A. Bearer Authentication & TokenStore
- The API uses `POST /v1/auth/demo-login` yielding Bearer access & refresh tokens.
- In `apps/web`, authentication is stored via a TypeScript `TokenStore` interface:
  ```typescript
  export interface TokenStore {
    getAccessToken(): Promise<string | null>;
    setTokens(access: string, refresh: string): Promise<void>;
    clear(): Promise<void>;
  }
  ```
- Web uses an in-memory or localStorage store.
- Mobile will substitute this with Capacitor Secure Storage or iOS Keychain / Android Keystore.

### B. Authenticator Interface (Biometrics / Passkey)
- Signing step-up approvals goes through an `Authenticator` interface.
- Current implementation: `SimulatedPasskey` providing deterministic hardware-like signing dialog.
- Mobile can substitute this with `@capacitor/biometrics` or WebAuthn without changing API payload.

### C. Server-Sent Events (SSE) & Polling Fallback
- `GET /v1/events` streams real-time plan step transitions.
- Polling fallback on `GET /v1/plans/{id}` guarantees connectivity across unstable mobile networks.

### D. Deep Linking
- Deep linking scheme: `aegispath://approve/{planId}` maps directly to the web route `/approve/:planId`.

## 2. What Is NOT Built Yet (Future Mobile Roadmap)
- Native push notification APNS/FCM dispatch (stub `POST /v1/devices` is provided in API).
- Native biometric enclave hardware attestation.
