# AegisPath Claims Register

This register specifies which claims are **permitted** and which claims are **strictly forbidden** across the UI, documentation, and code.

## 1. Permitted Claims
- "The agent can send up to $500 at a time and $1,000 a day, only to people on your list." (Enforced deterministically by policy engine).
- "Safety is enforced outside the language model." (Enforced by outer, middle, and inner rings).
- "$0 funds lost." (Computed dynamically from the ledger; never hardcoded).
- "Testnet, simulated funds" / "Testnet 测试网".

## 2. Forbidden Claims (Audited via Verify Gate)
- Any claims of `smart contract`, `on-chain`, `HSM Quorum`, `Dual-Enclave`, `FISCO BCOS`.
- Any claims of external sponsor integration (e.g. `WeBank Core HSM`).
- Any fake metrics like `14ms Synced` or unsupported `10% FX Saved`.
- Any absolute guarantees of exchange rates (`estimate, not a guarantee` must be used).
