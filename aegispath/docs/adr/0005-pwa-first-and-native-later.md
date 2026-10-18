# ADR 0005: PWA-First Delivery & Native Shell Pathway

## Status
Accepted

## Context
Competition evaluation requires instant access via web browsers while providing a realistic mobile presentation and offline caching.

## Decision
We build `apps/web` as an installable Progressive Web App (PWA) with dual-mode responsive layout: desktop web console and 390x844 mobile phone viewport. A Capacitor shell can directly package this app for Android/iOS distribution without UI rewriting.

## Consequences
- Immediate evaluation on standard web browsers without native toolchain installation.
- Fast path to mobile store distribution via Capacitor or React Native.
