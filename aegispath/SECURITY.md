# Security Policy

## Core Security Tenet
Safety in AegisPath is enforced **outside** the LLM. The AI model itself is treated as an untrusted agent planner whose outputs must be validated by deterministic software before financial execution.

## Defense Layers
- **Privacy Filter (Outer Ring):** Inspects input for injection vectors and sensitive keys.
- **Spending Rules / Policy Plane (Middle Ring):** Enforces spending limits ($500 single send, $1,000 daily send), allowed recipient addresses, and cryptographic intent hashing.
- **Bank-Side Limit (Inner Ring):** Enforces scoped token signatures and prevents balance drains independently of the API service.

## Reporting a Vulnerability
To report potential bypasses or prompt injection vulnerabilities, submit an issue with reproductive test cases targeting the evaluation suite in `eval/attacks`.
