# ADR 0003: Scoped HMAC Signed Tokens & Intent Hash Binding

## Status
Accepted

## Context
When an AI agent requests an execution, it must not possess blanket authority over funds. Furthermore, any post-approval modification of parameters must be impossible.

## Decision
1. **Scoped Tokens:** All transfer requests sent from the API to the bank carry an HMAC-SHA256 signature binding the maximum amount (`per_tx_cap`), daily allowance, allowed recipient, expiry timestamp, and a single-use nonce.
2. **Intent Hash Binding:** When a user reviews a Tier 2 transfer, a cryptographic hash of the intent (`intent_hash = SHA256(recipient + amount + currency + rate)`) is displayed and signed. If the parameters change prior to bank execution, the hash mismatches and execution is rejected.

## Consequences
- Prevents replay attacks, parameter tampering, and privilege escalation.
