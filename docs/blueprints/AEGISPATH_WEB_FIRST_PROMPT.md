# AegisPath — Prompt Antigravity: Web Dulu, Repo Rapi, Siap Disambungkan ke Mobile

Dokumen ini berisi prompt untuk membangun **versi web** AegisPath lebih dulu, dengan repositori yang rapi dan seam (titik sambung) yang disiapkan agar aplikasi mobile kelak dapat terhubung tanpa menulis ulang logika. Prompt dibuat dalam bahasa Inggris agar agen pengodean bekerja stabil.

## 0. Catatan Sebelum Memakai

**Tentang "100% berfungsi".** Prompt tidak dapat menjamin hasil. Yang dapat dilakukan adalah memaksa agen bekerja dengan gerbang yang dapat diperiksa mesin: `make verify` (lint, tipe, tes unit, tes kontrak), `make smoke` (tiga alur emas dari awal sampai akhir), tes Playwright, dan `docker compose up --build` di mesin bersih. Anda menganggap sebuah fase selesai hanya bila semua perintah itu hijau, bukan bila agen mengatakannya selesai.

**Hubungan dengan prompt sebelumnya.** Prompt ini adalah versi yang menekankan struktur repo, kualitas rekayasa, dan kesiapan mobile. Detail seni (maskot Chop, doodle, header, peta radial serangan) dan spesifikasi layar yang rinci tetap berada di `AEGISPATH_ANTIGRAVITY_PROTOTYPE_PROMPT.md`. Lampirkan: (1) ketujuh tangkapan layar desain, dan (2) **Bagian 2 (Aset)** dari dokumen prompt sebelumnya. Prompt di bawah merujuk keduanya dan menggantikan pilihan stack dan alur kerjanya.

**Urutan kerja.** Tempel Prompt Induk (Bagian 1) lebih dulu dan minta agen menulis rencana serta menunggu persetujuan. Setelah itu kirim prompt fase pada Bagian 2 satu per satu. Mobile dikerjakan setelah web lulus semua gerbang (Bagian 3).

**Catatan lingkungan.** Mesin pengembangan mungkin Windows. Prompt mewajibkan Python 3.12 yang dipin, dependensi tanpa kompilasi native, skrip yang berjalan lintas sistem operasi, dan layanan yang membaca port dari variabel lingkungan `PORT`. Itu menghindari masalah umum seperti roda paket Python yang belum tersedia untuk versi terbaru dan kebutuhan kompiler C.

---

## 1. Prompt Induk (Tempel Seluruhnya)

````
ROLE
You are a senior full-stack engineer and repo maintainer. Build the WEB version of
"AegisPath" (an AI agent that pays tuition and sends money across borders for
international students, with safety enforced outside the language model). Match the
attached reference screenshots (7 phone screens). Write a short plan first and WAIT for my
approval. Then build phase by phase. After every phase, run the verification commands and
paste the real output. A phase is done only when everything is green.

PRIMARY GOALS
1. It must actually work end to end, deterministically, on a clean machine.
2. The repository must be neat, conventional and easy to hand to another developer.
3. A mobile app will connect later WITHOUT rewriting business logic. Build the seams now.

NON-NEGOTIABLE RULES (claims and content)
- All data is simulated. Show "Testnet 测试网". Label simulated values.
- No sponsor logos or names. No claims of integrations that do not exist: no smart contract,
  no HSM, no "on-chain" in the product. The "bank" is a simulated, separate service.
- UI languages: English and Chinese (Simplified) only, via shared i18n files.
- No number is hard-coded in components. Figures come from the API or the seed data. Values
  like "$0 lost" and "3/3 layers" are computed.
- Never fake a result. If something fails, fail loudly with a clear error. No silent fallbacks
  that hide failures, no TODO or placeholder implementations, no sleeps as synchronization.

STACK (pin exact versions; commit lockfiles)
Web: React 18 + Vite + TypeScript (strict), React Router, TanStack Query (server state),
  small store for UI state, CSS variables + CSS modules, vite-plugin-pwa.
API and bank: Python 3.12 (pin it: .python-version), FastAPI, Pydantic v2, SQLite, Alembic.
  Prefer pure-Python or prebuilt-wheel dependencies. Do not add packages that need a compiler.
  Use stdlib hmac/hashlib for signed tokens and hash chains unless a library is clearly needed.
Tooling: pnpm workspaces, uv (or pip-tools) for Python, ruff + ruff format, mypy (strict on
  services), ESLint + Prettier + jsx-a11y, Vitest + Testing Library, pytest, Playwright.
Make everything cross-platform (Windows, macOS, Linux): no bash-only scripts. Put scripts in
  Python or Node, and expose them through a Makefile AND package.json/uv scripts.
Fonts and icons are self-hosted via npm (IBM Plex Sans, Plex Sans Condensed, Plex Mono,
  Noto Sans SC). No CDN, no Google Fonts, no remote images, no runtime calls outside the
  two local services. All dependencies must be open-source licensed; add a license audit script.

REPOSITORY LAYOUT (create exactly this)
aegispath/
  apps/web/                  React PWA. No business rules here, only presentation and calls.
  services/api/              FastAPI: auth, agent, parser, planner, policy plane, audit, events
  services/bank/             FastAPI: simulated bank. SEPARATE process, secret and database.
  packages/contracts/        OpenAPI 3.1 (generated from the API, committed) + JSON Schemas
  packages/api-client/       Typed TS client generated from the OpenAPI. No DOM dependency.
  packages/i18n/             en.json, zh.json (platform neutral)
  packages/design-tokens/    tokens.json -> CSS variables (and a neutral object for mobile)
  packages/ui-art/           Mascot "Chop", doodles, header art, radial attack map (pure SVG)
  eval/                      attack suite, benchmark, reports (python -m eval.attacks)
  infra/                     Dockerfiles, nginx config (CSP headers), compose files
  docs/                      architecture.md, adr/, claims-register.md, mobile-readiness.md,
                             runbook.md, STATUS.md, screens/ (screenshots)
  scripts/                   seed, smoke, verify, license-audit (Python or Node)
  .github/workflows/ci.yml   lint, types, tests, contract drift check, e2e, docker build
  .github/pull_request_template.md
  Makefile  docker-compose.yml  .env.example  .editorconfig  .gitignore  .pre-commit-config.yaml
  README.md  CONTRIBUTING.md  SECURITY.md  CHANGELOG.md  NOTICE (third-party licenses)
Do NOT add an open-source LICENSE file yet (ownership terms are undecided). Add a short note
in the README instead.

REPO HYGIENE
- Conventional Commits, small focused commits, one phase per branch merged to main with a
  tag (v0.1.0 at the end). Never commit secrets. Provide .env.example with every variable
  documented; validate env at startup and fail with a readable message.
- Each service and package has its own README (purpose, commands, boundaries).
- ADRs in docs/adr: 0001 monorepo, 0002 separate bank service, 0003 scoped tokens,
  0004 API-first and mobile seams, 0005 PWA first and native later.
- docs/STATUS.md lists, per feature, REAL vs SIMULATED and what is not built.
- docs/claims-register.md lists allowed and forbidden claims and how each is verified.

PRODUCT AND ARCHITECTURE
Three independent safety layers: (1) privacy filter, (2) spending rules / policy plane,
(3) bank-side limit enforced by the separate bank service. The api signs a scoped token
(per_tx_cap, daily_cap, payee_allowlist, expiry, nonce). The bank validates it again, enforces
idempotency and keeps the ledger. The api never writes the ledger. Intent binding: hash of the
confirmed intent must equal the hash of the transaction parameters at execution, else refuse.
The agent replies with TYPED components (text, plan_chips, slip, blocked_slip, approval_sheet,
evidence_card, runway), never HTML. The web renders an allow-list and rejects unknown types.
Approval is rendered from a server-signed payload. Documents (invoices, memos) are DATA,
never instructions. Parser = deterministic rules for English and Chinese; an optional LLM
adapter sits behind an env flag and the whole app must work offline with rules only.

API DESIGN (mobile-ready from day one)
- Versioned base path /v1. OpenAPI 3.1 is the source of truth. The generated spec is committed
  to packages/contracts and CI fails if it drifts from the running API.
- Errors: RFC 9457 problem+json with a stable "code" field. Every response has a request ID.
  Mutating endpoints accept an Idempotency-Key header. Lists are paginated.
- Auth for clients that are not browsers: POST /v1/auth/demo-login returns a short-lived Bearer
  access token and a refresh token; POST /v1/auth/refresh. No cookie-only sessions. The web
  uses a TokenStore interface (memory implementation) so a mobile app can supply secure storage.
- Approval signing goes through an Authenticator interface. Provide SimulatedPasskey now (clearly
  labelled). WebAuthn or native biometrics plug in later without API changes.
- Progress streaming: GET /v1/events (Server-Sent Events) for plan progress, with polling
  fallback GET /v1/plans/{id}. Works for web and mobile.
- Device registration stub: POST /v1/devices (platform, push token) for future notifications.
- Deep-link scheme documented in docs/mobile-readiness.md: https route /approve/:planId and
  aegispath://approve/{planId}.
- CORS configured by env with an explicit allow-list (no wildcard in production config).
- Business logic lives ONLY in services. The web and any future mobile app are thin clients.
- packages/api-client takes an injected fetch and base URL; it must run in a browser, in Node,
  and in React Native without changes.
- packages/design-tokens and packages/i18n contain no web-only code.

ENDPOINTS (under /v1)
 auth: demo-login, refresh
 agent: POST /agent/messages {text, locale} -> {intent, plan_id, plan[], status, assumed[]}
 plans: GET /plans/{id}; POST /plans/{id}/approve {signature}; POST /plans/{id}/cancel
 tuition: POST /tuition/quote {amount, currency, mode}
 policy: GET /policy; PUT /policy creates a time-locked PROPOSAL (no instant change)
 agent control: POST /agent/pause; POST /agent/resume (needs the simulated signature)
 audit: GET /audit; GET /audit/verify -> {valid, entries, head_hash}
 attacks: POST /attacks/replay {case_id, disabled_layers[]} -> per-layer verdicts, funds_lost
 evidence: GET /evidence; POST /evidence/share; DELETE /evidence/share/{id}
 planner: GET /planner?scenario=on_time|delayed
 events: GET /events (SSE); devices: POST /devices; health: GET /health, GET /ready
 bank (8100, separate): POST /bank/transfer (scoped token + idempotency), GET /bank/balance,
 GET /bank/ledger. Bank and api use different secrets and different SQLite files.

SCREENS (web routes; match the screenshots; art per Appendix A attached)
 /  Home | /chat Agent chat | /tuition Pay tuition | /approve/:planId Approval |
 /evidence Evidence | /planner Planner | /safety Safety (radial attack map, replay with
 per-ring toggles driven by the real backend, "Pause agent" always visible).
 Palette, type, radius, motion, bilingual labels and mascot expressions follow the attached
 prompt file. Chop's expression is bound to real system state. Payees, Rates and More show a
 "Coming soon 即将推出" toast.

GOLDEN FLOWS (must be REAL, covered by tests and by `make smoke`)
 A) Send $200 to Mom: parse -> plan -> policy T1 -> simulate -> bank transfer -> verify -> slip.
 B) Pay tuition: quote -> new payee T2 -> approval sheet -> approve with matching intent hash -> bank.
    Changing any parameter after approval is refused.
 C) Invoice attack: hidden instruction asks to send the full balance elsewhere. Each of the three
    layers must be able to stop it on its own. Replay with each layer disabled in turn.
Attack suite: at least 12 families x 10 variants plus benign twins; write eval/reports/latest.json
 and print an ablation table with observed counts and Wilson 95% intervals. Never pre-write results.

ENGINEERING QUALITY
- Deterministic: inject a clock, seed random generators, fixed seed data. No flaky tests.
- Tests: pytest (parser EN/ZH, policy tiers, intent-hash refusal, token validation, idempotency,
  audit chain, attack-suite smoke), Vitest (components, i18n completeness, allow-list renderer),
  Playwright (every route at 390x844 and 1440x900, keyboard-only approval, offline mode,
  screenshots saved to docs/screens, axe accessibility check).
- Coverage reported, no arbitrary threshold, but critical modules (policy, bank, token, audit)
  must be thoroughly tested.
- Structured logs with request IDs, no payload or secrets in logs. /health and /ready work.
- Security headers via nginx in the container: strict CSP (no inline scripts, no external origins),
  frame-ancestors none, no sniff. Service worker caches static assets only.
- Accessibility AA, 44px touch targets, reduced motion, status never by color alone.

COMMANDS (all must exist and work)
 make setup | make dev | make verify | make test | make e2e | make smoke | make eval |
 make contracts (regenerate OpenAPI and client) | make docker-up | make clean
 `make verify` = format check, lint, type check, unit tests, contract drift check, license audit.
 `make smoke` starts both services on temporary ports, runs flows A, B and C through the real API,
 and exits non-zero on any deviation.

PHASES
 W0 scaffold, tooling, CI, docs skeleton (green on empty)  | W1 contracts, tokens, i18n, ui-art
 W2 bank + api core (auth, tokens, policy, audit) with tests | W3 agent, parser, planner, flows A/B, events
 W4 web app, 7 routes wired to the API | W5 attacks, eval, Safety screen driven by real replay
 W6 hardening: offline mode, a11y, docs, docker on a clean machine, release v0.1.0
Work one phase at a time. At the end of each phase: run make verify (and make smoke from W3),
screenshot affected routes, compare with the references, list differences and fix once, update
docs/STATUS.md, and wait for my go-ahead.

DEFINITION OF DONE (all must hold at the end)
[ ] make verify, make smoke, make e2e pass on a clean clone; docker compose up --build works.
[ ] Flows A, B, C are real; post-approval tampering is refused; any single ring can be off and
    another ring still stops the attack (proved by replay).
[ ] 7 screens match the screenshots; EN and 中文 complete; no hard-coded numbers.
[ ] OpenAPI committed, client generated, CI drift check green; api-client runs in Node.
[ ] docs/mobile-readiness.md explains how a mobile app connects (auth, events, deep links,
    secure storage, push) and lists what is NOT built yet.
[ ] No sponsor names, no unbuilt claims (search for: smart contract, on-chain, HSM, WeBank,
    synced, guarantee). STATUS.md is accurate.
````

---

## 2. Prompt Fase (Kirim Satu per Satu)

**W0 — Kerangka.**
```
Phase W0 only. Create the repository layout, pnpm workspace, uv/pyproject setup with Python 3.12
pinned, Makefile and package scripts that work on Windows, macOS and Linux, pre-commit, ruff,
mypy, ESLint, Prettier, CI workflow, PR template, .env.example, README skeleton and the docs
skeleton with ADRs 0001-0005. Everything must run green with no features yet. Show the output of
make verify and the tree. Stop.
```

**W1 — Paket bersama.**
```
Phase W1 only. Build packages/design-tokens (tokens.json -> CSS variables and a neutral object),
packages/i18n (en.json, zh.json with a completeness test), and packages/ui-art (Chop with all
expressions and colors, header art, student doodle, radial attack map as pure SVG components
taking props, with Vitest snapshot tests). Use the art spec in the attached Appendix A. Add a
small /dev/art gallery route in the web app. make verify must be green. Stop.
```

**W2 — Bank dan inti API.**
```
Phase W2 only. Build services/bank and services/api core: demo auth (Bearer + refresh), scoped
token signing, bank-side validation, idempotency, ledger, policy tiers T0-T3, intent hash, audit
hash chain, health endpoints, problem+json errors, request IDs, Alembic migrations, seed data.
The api must never write the bank ledger. Write thorough pytest coverage. Generate and commit
the OpenAPI and the TS client; add the drift check to CI. Stop.
```

**W3 — Agen dan alur A/B.**
```
Phase W3 only. Build the rules parser (English and Chinese), planner (typed DAG steps with
idempotency and compensation), simulation, typed component responses, the SSE events endpoint,
the tuition quote endpoint, and the simulated Authenticator. Make flows A and B real through the
API and add make smoke. Prove that changing the amount after approval is refused. Stop.
```

**W4 — Web.**
```
Phase W4 only. Build the 7 routes in apps/web using packages/api-client, packages/i18n,
packages/design-tokens and packages/ui-art, matching the screenshots. Typed-component renderer
with allow-list, TokenStore interface, offline shell, language toggle, state switcher under
?dev=1. No business rules in the web app. Add Vitest and Playwright tests, screenshots to
docs/screens, and run the a11y check. Compare with the references and fix differences once. Stop.
```

**W5 — Serangan dan evaluasi.**
```
Phase W5 only. Implement the privacy filter and sentinel, the attack suite (12 families x 10
variants plus benign twins), POST /attacks/replay with per-layer toggles, eval/reports/latest.json
and the printed ablation table with Wilson 95% intervals. Drive the Safety screen from real
replay results. Report observed numbers exactly; do not adjust tests to flatter the results. Stop.
```

**W6 — Pengerasan dan rilis.**
```
Phase W6 only. Offline mode (rules-only parser, cached shell, queued pause), reduced motion,
accessibility fixes, nginx CSP container, docker compose on a clean machine, README with run
instructions and honest limitations, docs/mobile-readiness.md, STATUS.md, claim sweep, NOTICE
and license audit. Tag v0.1.0. Show make verify, make smoke, make e2e output and the final tree.
```

---

## 3. Kesiapan Mobile: Rencana Singkat untuk Tahap Berikutnya

Setelah web lulus semua gerbang, ada dua jalur ke aplikasi mobile. Keduanya memakai API, klien yang dihasilkan, i18n, dan token desain yang sama, sehingga tidak ada logika bisnis yang ditulis ulang.

| Jalur | Cara | Kelebihan | Kekurangan |
| :-- | :-- | :-- | :-- |
| **Cangkang Capacitor** | Membungkus PWA menjadi aplikasi (Android/iOS) dan menambahkan plugin penyimpanan aman serta biometrik | Tercepat; tampilan identik dengan web | Rasa native terbatas |
| **Expo / React Native** | UI native baru yang memakai `api-client`, `i18n`, dan `design-tokens` | Terasa native | Layar harus ditulis ulang; waktu lebih lama |

Untuk jadwal lomba, jalur Capacitor lebih masuk akal bila mobile memang diperlukan. Keputusannya dicatat sebagai ADR setelah web selesai. Tiga hal yang harus ada agar penyambungan mulus, dan sudah diwajibkan pada prompt: autentikasi Bearer (bukan hanya cookie), `Authenticator` yang dapat diganti dengan biometrik, dan `TokenStore` yang dapat diganti dengan penyimpanan aman.

## 4. Daftar Periksa Anda (di Mesin Anda, Bukan Laporan Agen)

- Clone bersih, lalu jalankan `make setup`, `make verify`, `make smoke`, `make e2e`. Semuanya harus hijau.
- `docker compose up --build` berjalan dan aplikasi dapat dibuka di peramban.
- Periksa struktur folder sama dengan tata letak pada prompt dan setiap paket memiliki README.
- Cari di seluruh repo kata `smart contract`, `on-chain`, `HSM`, `WeBank`, `synced`, `guarantee`.
- Ubah satu parameter setelah persetujuan dan pastikan sistem menolak.
- Matikan satu cincin pada layar Safety, jalankan replay, dan pastikan cincin lain tetap menahan serangan.
- Buka panel jaringan peramban dan pastikan tidak ada permintaan ke luar `localhost`.
- Periksa `docs/STATUS.md`: apakah jujur tentang apa yang nyata dan apa yang simulasi.
