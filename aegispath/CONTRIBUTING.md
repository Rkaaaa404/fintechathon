# Contributing to AegisPath

Thank you for contributing to AegisPath.

## Code Standards
1. **Conventional Commits:** Use standard prefixes: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`.
2. **Quality Gates:** Before creating a Pull Request, you MUST run:
   ```bash
   py scripts/verify.py
   py -m pytest
   py scripts/smoke.py
   ```
   All checks must be green.
3. **No Fabricated Claims:** Do NOT introduce claims of third-party institutional sponsorships (e.g., WeBank) or unbuilt blockchain mechanisms (HSM, smart contract, on-chain).
4. **Bilingual Strings:** Any UI copy must be defined in both English and Simplified Chinese in `packages/i18n`.
