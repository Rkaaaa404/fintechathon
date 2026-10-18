# ADR 0002: Separate Bank Service Daemon

## Status
Accepted

## Context
A major security flaw in typical AI agent architectures is letting the agent API directly mutate the bank ledger. If the API is compromised or tricked, funds are depleted.

## Decision
We separate the bank into an independent daemon (`services/bank`) running on port 8100 with its own SQLite database and cryptographic secrets. The API service (`services/api`, port 8000) has NO direct database access to the bank ledger and can only request transfers by presenting a valid scoped token.

## Consequences
- Compromising the API server cannot unilaterally drain user accounts beyond the bank daemon's hard limits.
- The bank daemon enforces its own independent velocity and single-send limits.
