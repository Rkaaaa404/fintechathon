# AegisPath Architecture Blueprint

## The Three Defense Rings

```
               [ User Prompt / Invoice ]
                          │
                          ▼
             ┌─────────────────────────┐
             │  Outer: Privacy Filter  │  (Detects hidden prompt injection)
             └────────────┬────────────┘
                          │ Clean instructions
                          ▼
             ┌─────────────────────────┐
             │ Middle: Policy Plane    │  (Checks T0-T3 limits, payee allowlist,
             │         & Intent Hash   │   cryptographically binds approved intent)
             └────────────┬────────────┘
                          │ Signed Scoped Token (HMAC)
                          ▼
             ┌─────────────────────────┐
             │  Inner: Bank Daemon     │  (Independent process & database,
             │         & Ledger        │   enforces single-send cap & records ledger)
             └─────────────────────────┘
```

## Security Tiers
- **Tier 0 (Read-Only):** Balances, rates, activity history. Auto-executed.
- **Tier 1 (Within Policy):** Transfers $\le \$500$, payee on allowlist, daily cap $\le \$1,000$. Auto-signed with scoped token.
- **Tier 2 (Step-Up Approval):** New payee or amount $>\$500$. Requires hardware passkey signature with matching intent hash.
- **Tier 3 (Policy Changes):** Daily limit modification. Proposal flow with time-delay or guardian co-signature. Live sliders are strictly forbidden.
