# AegisPath — Prompt Antigravity untuk Prototipe yang Berfungsi

Dokumen ini berisi prompt siap tempel untuk membangun prototipe sesuai tujuh layar desain: Home, Agent chat, Pay tuition, Approval, Evidence, Planner, dan Safety. Prompt dibuat dalam bahasa Inggris karena agen pengodean bekerja paling stabil dengan itu, sedangkan teks antarmuka dalam bahasa Inggris dan Mandarin.

## 0. Cara Memakai

1. Ambil tangkapan layar ketujuh layar dari kanvas desain (lebar 390 piksel, tinggi 844). Lampirkan semuanya ke Antigravity. Agen tidak dapat membuka tautan kanvas Anda, sehingga gambar adalah acuan visual utamanya.
2. Tempel **Bagian 1 (Prompt Induk)** dan **Bagian 2 (Aset)** dalam satu pesan pertama.
3. Minta agen menulis rencana dulu dan menunggu persetujuan Anda sebelum membangun. Prompt sudah memuat instruksi itu.
4. Setelah rencana disetujui, jalankan fase pada **Bagian 4** satu per satu. Jangan meminta semuanya sekaligus; hasilnya lebih stabil bila dibangun bertahap.
5. Setiap akhir fase, minta agen mengambil tangkapan layar dan membandingkannya dengan gambar acuan, lalu membandingkan sendiri dengan daftar penerimaan.

Kejujuran soal cakupan: prompt ini membangun **irisan vertikal** (tiga alur emas yang benar-benar berjalan dan terhubung ke backend), bukan seluruh produk. Layar Payees, Rates, dan More belum dirancang dan sengaja tidak dimasukkan.

---

## 1. Prompt Induk (Tempel Seluruhnya)

````
ROLE
You are a senior full-stack engineer and UI engineer. Build a working prototype of
"AegisPath", matching the attached reference screenshots (7 phone screens, 390x844).
First write a short plan (stack, folders, phases, risks) and WAIT for my approval.
Then build phase by phase. Do not add features that are not described here.

PRODUCT
AegisPath is an AI agent that sends money and pays tuition across borders for
international students. The core idea: safety is enforced OUTSIDE the language model.
Even if the model is fooled, three independent layers stop the damage:
  Outer ring  = Privacy filter (detects hidden instructions and sensitive data)
  Middle ring = Spending rules (policy plane: tiers, payee allow-list, intent hash)
  Inner ring  = Bank-side limit (a SEPARATE service that validates a scoped token)
The user is an ordinary student (persona "Ayu"), not a treasury team.

HARD RULES (claims and content)
- All data is simulated. Show "Testnet 测试网" and label money values as simulated where
  the reference shows it.
- No sponsor or third-party logos or names. No claims of integrations that do not exist
  (no smart contract, no HSM, no "on-chain" in the UI). The "bank" is a simulated service.
- UI languages: English and Chinese (Simplified) ONLY. Header toggle "EN | 中文". Most labels
  are bilingual as in the references (English first, Chinese smaller or inline). When the
  toggle is set to 中文, show Chinese-first labels. All strings live in i18n files.
- Never write numbers by hand in components. All figures come from the mock data module
  or the backend. Do not hard-code "0 funds lost": it must be computed from the ledger.
- Estimates are labelled "estimate, not a guarantee". Evidence is labelled "summary, not
  a credit score". No fake metrics, no fake latency, no fake "synced" indicators.

STACK
Frontend: React + Vite + TypeScript, React Router, CSS variables (no heavy UI kit),
  vite-plugin-pwa (installable, offline shell), a tiny state store.
Backend: Python 3.12 + FastAPI, SQLite. TWO SEPARATE PROCESSES with different secrets:
  api  (port 8000): agent, parser, planner, policy plane, audit
  bank (port 8100): simulated bank + limit enforcement + ledger
Everything runs with one command: docker compose up (and a plain "make dev").
Fonts and icons are self-hosted from npm (Fontsource: IBM Plex Sans, IBM Plex Sans
Condensed, IBM Plex Mono, Noto Sans SC). No CDN, no Google Fonts, no remote images, no
runtime network requests other than to the two local services. Libraries must be
open-source licensed. Pin dependency versions.

DESIGN TOKENS (one palette)
--blue #3D6BEA (primary)   --blue-deep #1F3FA8   --sky #E6EEFF   --mist #F4F7FE
--night #0A1440 (attack card)   --ink #14213D   --slate #5B6B8C   --line #E6ECF8
--blue-soft #9DB8FF   --cyan #6FD3FF   --blue-dot #5B8CFF
Status only: --green #1E9E6A (tint #E3F6EE), --amber #F5A524 (tint #FFF4DC, text #B7791F),
--red #E5484D (tint #FDE8E9, text #C9343A).
Radius: cards 18, tiles 15, pills 999, sheets 26 (top), buttons 27 (primary CTA).
Shadow (cards): 0 2px 12px rgba(20,33,61,.08). Header: flat blue with 30px bottom radius.
Type: IBM Plex Sans UI; Plex Sans Condensed 600 for large amounts (tabular numerals);
Plex Mono only for hashes; Noto Sans SC for Chinese. Sizes 10/11/12/13/14/15/17/23/36/54.
Chinese secondary labels use 10-11px in --slate. Contrast AA. Touch targets >= 44px.
No decorative gradients except one soft radial glow behind the attack map.
Motion: only in response to an action or system event (stamp lands in 250ms, DAG chips
light up in order 120ms apart, ring/packet animation in the attack replay). Respect
prefers-reduced-motion.

MASCOT AND DOODLES (original art, see Appendix A for exact SVG)
Mascot "Chop": a seal-shaped character (rounded square body, knob on top, white or sky
face plate, amber knob and cheeks). Variants by color: on blue backgrounds the body is white
with a sky face plate; on light backgrounds the body is blue with a white face plate; a
small soft variant uses body #9DB8FF. Expressions: idle, wave (raised arm), guard (stern
brows, flat mouth, optional dashed shield outline), block (X eyes, red badge with X).
Chop expression must reflect system state: idle = ready, wave = greeting, guard = waiting
for approval, block = an attack was blocked, paused = eyes closed with a pause badge.
Header art on every screen: faint clouds, four-point sparkles, plus marks, small dots, a
dotted arc, two amber coins with a dark outline, plus ONE page-specific doodle (see screens).
Banner doodle on Home: a student with a backpack holding a paper plane, a coin, dotted trail.

SCREENS (match the attached screenshots in layout, hierarchy, spacing and color)

1 HOME  (route /)
 - Blue header (214px): top row "AegisPath" + small pill "Testnet 测试网" + EN|中文 toggle +
   bell with amber badge. Greeting "Good morning, Ayu 早上好". Label "Daily allowance 今日额度".
   Big amount (54px condensed) = allowance remaining, "of $1,000 总额", a 5-segment bar.
   Large waving Chop on the right, a small guard Chop, a tiny idle Chop, speech bubble "Hi! 你好".
 - White overlapping strip: mini Chop + "Chop is on guard 守护中" + green tag "3 layers 3层".
 - "Services 服务" with a blue accent bar. 4x2 grid of tiles (icon in sky tile, English label
   and Chinese label under it): Send 转账, Tuition 学费, Evidence 证明, Safety 安全,
   Payees 收款人, Rates 汇率, Planner 规划, More 更多. Send/Tuition/Evidence/Safety/Planner
   link to their screens. Payees, Rates, More show a "Coming soon 即将推出" toast.
 - Sky banner card "Tuition arrives in full 学费足额到账" with button "Calculate 计算" and the
   student doodle at the right.
 - Two stat cards: solid blue "Protection 防护 3/3 layers active 层已启用" (faint shield icon),
   sky "Evidence 证明包 3/3 ready to share 可分享". "3/3" must be computed from real layer
   health and evidence items.
 - Recent activity card (2 rows): "Sent to Mom 汇给妈妈 -$200.00" (green check) and
   "Attack blocked 已拦截攻击" with red tag "$0 lost". Rows come from the audit log.
 - Bottom nav: Home 首页, Pay 支付, raised round blue center button (chat), Evidence 证明,
   Safety 安全. The center button opens /chat.

2 AGENT CHAT (route /chat)
 - Blue header (128px) with a waving Chop, title "Ask Chop 询问智能体", "Agent online 在线".
   Doodle: speech bubble.
 - Conversation: user bubble right (blue, white text, bilingual). Agent bubble with small Chop
   avatar showing a live PLAN as chips: Quote 报价, Payee 收款人, Limits 额度, Simulate 模拟,
   Execute 执行. Done = green tint with check; current = sky tint with dot; failed = red tint.
 - Result "slip": white card, dashed blue border, rotated stamp "SENT 已汇出" (or "BLOCKED 已拦截"
   in red) at the top right, lines: Sent/amount/payee, Received amount, fee, three checks
   (Privacy 隐私, Rules 规则, Bank limit 银行限额).
 - Suggestion pills: Pay tuition 缴学费, Send $3,000 汇款, Share proof 分享证明.
 - Composer pill with mic icon (visual only) and round send button. Free text goes to the API.

3 PAY TUITION (route /tuition)
 - Header (176px): "Pay tuition 缴纳学费", label "Tuition due 应缴学费", big "¥18,000",
   line "Campus bursar 学校财务处, due Jan 15 1月15日截止". Guard Chop, small Chop, cap doodle.
 - White card: segmented control Fastest 最快 / Cheapest 最便宜 (selected) / Balanced 均衡.
   Rows: Base amount, Rate (simulated) 汇率, Transfer fee, Bank-charge buffer 银行费用缓冲.
   Total "You send 实付" large blue. Yellow note "Estimate with a buffer, not a guarantee."
   Numbers come from POST /tuition/quote (see backend).
 - Payee card: "Campus bursar 学校财务处", "New payee 新收款人, needs approval 需确认",
   green tag "Official channel 官方渠道".
 - Primary CTA "Review payment 查看并确认" -> creates a plan and opens the Approval sheet.

4 APPROVAL (route /approve/:planId; shown as a sheet over a blue header)
 - Header (226px): guard Chop, "I need your approval 需要您确认", reason line. A 4-step stepper:
   Requested 已提出, Understood 已理解, Approve 待确认 (current), Sent 已汇出.
 - Sheet: two cards side by side "You asked 您的请求" and "I understood 我的理解". Big blue
   amount "You send 支付金额". Yellow box "Changed from your request 与请求不同: currency
   assumed USD 币种默认美元 Edit 修改" (shown only if the parser assumed something).
   Rows: Receives, Rate (simulated), Fee + bank buffer, Arrives. Lock line "Locked: approved
   equals sent 已锁定:所见即所签" with the intent hash in mono.
 - Sticky bottom bar: "Cancel 取消" and the pill CTA "Approve with passkey 通行密钥确认".
   Passkey is SIMULATED in this prototype: a confirm dialog that signs the intent hash with a
   demo key. Label it clearly as simulated.
 - If the transaction parameters differ from the approved intent hash, execution must fail.

5 EVIDENCE (route /evidence)
 - Header (150px) "Evidence pack 财力证明包", subtitle, waving Chop, document doodle.
 - Two stat cards: Avg monthly balance 月均余额 ($1,820), Income months 有收入月数 (6 / 6).
 - Card "Sources 来源 by provenance 按来源可信度": three rows with a tier tag:
   Bank statements 6 months (Uploaded by you, Tier 1), Family transfers (Bank API, simulated,
   Tier 2), Scholarship letter (Signed by university, Tier 3).
 - Card "Shared with Landlord A": expiry, shared fields, buttons "Revoke 撤销" (red outline) and
   "New link 新链接". Revoke really invalidates the share token.
 - Footer note: "An evidence summary, not a credit score. Acceptance by others is not
   guaranteed." Compute metrics deterministically from seeded statement data.

6 PLANNER (route /planner)
 - Header (150px) "Runway planner 资金规划", subtitle, guard Chop, calendar doodle.
 - Chart card: chips On time 按时 / Delayed +30 days 延迟30天 (selectable, changes the chart).
   Line chart Oct-Mar: funds over time, tuition-due vertical marker, scholarship arrival,
   dashed amber "Safe minimum 安全线", red dashed delayed path dipping below the line.
 - Warning card "Below the safe minimum in January 1月将低于安全线" with explanation and a
   3-option list (move date, request advance, top up). Footer: "Deterministic simulation from
   your schedule, not a prediction." The chart is computed in code from the schedule. No ML.

7 SAFETY (route /safety)
 - Header (150px) "Safety Center 安全中心", big "3/3 protection layers active 防护层已启用",
   blocking Chop (red X badge) and a small guard Chop, radar-ring doodle.
 - Night card (rounded 22): "1 attack blocked 已拦截1次攻击", "Hidden instruction in an invoice
   发票中的隐藏指令". RADIAL ATTACK MAP (Appendix A): three concentric dotted rings
   (outer = privacy filter, middle = spending rules, inner = bank-side limit), a dashed
   outer tick ring, red attack packets coming from outside, each stopping at a ring with an X,
   a large light "0" in the center with "Funds lost 资金损失" (computed from the ledger).
   Under the map three rows: Outer 外环 Privacy filter 隐私过滤 (flagged 已标记), Middle 中环
   Spending rules 支出规则 (would refuse 将拒绝), Inner 内环 Bank-side limit 银行侧限额.
 - "Replay attack 重放攻击" button and three ring toggles. Turning a ring OFF and replaying must
   show the packet passing that ring and being stopped by the next one. The outcome comes
   from the real backend (see ATTACK REPLAY), not from an animation script.
 - Allowance card: "$200 / $1,000", bar, payee avatars Mom 妈妈, Bursar 财务处, Dad 爸爸.
 - Red-tint pill button "Pause agent 暂停智能体" always visible; pausing blocks all agent
   actions at the API and shows Chop in the paused state. Resume needs the simulated passkey.

BACKEND CONTRACT
api service (8000)
 POST /agent/messages  {text, locale} -> {intent, plan_id, plan[], status, assumed[]}
   Parser: deterministic rules for English and Chinese (amounts, currencies, payees by alias,
   verbs: send/pay/汇款/转账/缴费). Optional LLM adapter behind an env flag; the app must
   work fully offline with rules only. Parser output is validated against a JSON schema.
 GET  /plans/{id}; POST /plans/{id}/approve {signature}; POST /plans/{id}/cancel
 POST /tuition/quote {amount, currency, mode} -> {send_amount, rate, fee, buffer, eta}
 GET  /policy; PUT /policy creates a PROPOSAL (time-locked, needs approval); no instant change
 POST /agent/pause; POST /agent/resume
 GET  /audit (hash-chained entries) ; GET /audit/verify -> {valid, entries, head_hash}
 POST /attacks/replay {case_id, disabled_layers[]} -> per-layer verdicts + funds_lost
 GET  /evidence; POST /evidence/share; DELETE /evidence/share/{id}
 GET  /planner?scenario=on_time|delayed
bank service (8100, separate secret, separate database)
 POST /bank/transfer requires a scoped token signed by the api with: per_tx_cap, daily_cap,
   payee_allowlist, expiry, nonce. The bank re-checks caps and allow-list itself, enforces
   idempotency keys, and keeps the ledger. The api never writes the ledger directly.
Policy plane: tiers T0 read-only; T1 auto-send up to the per-send cap to allow-listed payees;
 T2 new payee or above cap needs approval; T3 policy change needs time-lock. Intent binding:
 hash(intent) must equal hash(transaction parameters) at execution or the call is refused.
 Simulation runs before execution and its result must match the intent within tolerance.
Privacy filter: detect instruction-like text inside untrusted documents (invoices, memos),
 sensitive patterns (IDs, account numbers), and unicode tricks (zero-width, homoglyphs).
 Fail closed. Every outbound model call (if the LLM adapter is on) is recorded in an egress
 ledger with a hash and the detector verdicts. Documents are treated as DATA, never as orders.
Sentinel: flags money-mule recruitment patterns in messages ("earn commission, receive and
 forward money"), payee swaps in invoices, and structuring. Wording is "needs verification",
 never an accusation.
Golden flows to make REAL
 A) Send $200 to Mom: parse -> plan -> policy T1 -> simulate -> bank transfer -> verify -> slip.
 B) Pay tuition: quote -> new payee T2 -> approval sheet -> approve (intent hash match) -> bank.
 C) Invoice attack: invoice text with a hidden instruction asking to send the full balance to
    another account. All three layers must be able to stop it independently. Replay with
    each layer disabled in turn and record results.
Attack suite script (python -m eval.attacks): at least 12 families, 10 variants each (direct
 and indirect injection, payee swap after approval, unit/currency confusion, permission
 escalation, privacy exfiltration, replay/duplicate, social engineering, structuring, tool
 misuse, mule recruitment, multilingual EN/中文). Print an ablation table: attack success rate
 per family for (model-only), (+privacy filter), (+spending rules), (+bank limit), and write
 eval/reports/latest.json. Also run benign twins and report the false-positive rate. Report
 observed counts honestly with Wilson 95% intervals; do not write results in advance.

FRONTEND IMPLEMENTATION NOTES
- The agent's reply to the UI is TYPED JSON components, never HTML: text, plan_chips,
  slip, blocked_slip, approval_sheet, evidence_card, runway. The UI renders only an
  allow-list; unknown types are rejected and logged. No innerHTML with untrusted data.
- Approval is rendered from a server-signed payload, not from model text.
- CSP strict: no inline scripts, no external origins, frame-ancestors none.
- Service worker caches static assets only. Offline mode: shows the shell, allows balance
  view and Pause (queued), clearly labelled.
- Provide i18n files en.json and zh.json for every string; no hard-coded text in components.
- Keep components small and reusable: Header, ChopMascot, DoodleArt, Tile, Card, Slip, Stamp,
  PlanChips, ApprovalSheet, RadialAttackMap, Chart, BottomNav.

TESTS
- Backend: pytest for parser (EN/ZH), policy tiers, intent-hash mismatch refusal, bank token
  validation, idempotency, audit chain verification, attack suite smoke test.
- Frontend: Playwright script that opens every route at 390x844 and 1440x900, saves
  screenshots to /docs/screens, and runs an accessibility check. Add a "dev=1" query flag
  that shows a state switcher (default, waiting for approval, sent, blocked, paused, model
  offline, empty). Hide it otherwise.

PROCESS
1) Write the plan and wait for my approval.
2) Phase 1: static UI matching the screenshots with the mock data module.
3) Phase 2: backend services and tests. 4) Phase 3: wire the three golden flows.
5) Phase 4: attack suite, ablation report, radial map driven by real results.
6) Phase 5: offline mode, polish, README with run instructions and limitations.
After each phase: take screenshots, compare with the references, list differences, fix once,
and report what is real vs simulated. Do not claim anything that is not implemented.

ACCEPTANCE
[ ] All 7 screens match the screenshots in layout, hierarchy, spacing and palette.
[ ] EN and 中文 render with correct fonts; toggle changes labels everywhere; no overflow.
[ ] Flows A, B, C work end to end through the two separate services.
[ ] Changing the transaction after approval is refused (intent hash mismatch).
[ ] Disabling any single ring still leaves another ring that stops the attack.
[ ] "Funds lost" and "3/3" are computed, not typed.
[ ] No external network requests at runtime; works offline in rules-only mode.
[ ] No sponsor branding; every simulated value is labelled; no unbuilt claims anywhere.
[ ] docker compose up works on a clean machine; pytest and Playwright pass.
````

---

## 2. Aset (Tempel setelah Prompt Induk)

Aset di bawah memastikan maskot, doodle, dan peta serangan sesuai gambar. Maskot, doodle, dan seni header dibuat orisinal.

````
APPENDIX A: ART ASSETS (use exactly; parametrize colors)

A1. Mascot "Chop"  (viewBox "-6 0 76 80"; params: BODY, FACE, expression)
  - knob:   <rect x="22" y="2" width="16" height="14" rx="5" fill="#F5A524"/>
  - body:   <rect x="4" y="12" width="52" height="56" rx="16" fill="{BODY}"/>
  - face:   <rect x="11" y="21" width="38" height="34" rx="10" fill="{FACE}"/>
  - cheeks: <circle cx="16" cy="46" r="3" fill="#F5A524" opacity=".45"/> and cx="44"
  - base:   <rect x="8" y="72" width="44" height="4" rx="2" fill="#000" opacity=".18"/>
  - idle eyes: circles at (22,36) and (38,36) r=3.6 fill #14213D; smile path
      "M21 44 Q30 53 39 44" stroke #14213D width 2.2 round, no fill
  - wave: add BEFORE the body an arm path "M54 44 Q68 38 64 22" stroke {BODY} width 8 round
  - guard: eyes + brows "M14 29 L26 32 M46 29 L34 32" stroke #14213D 2.4; mouth "M24 46 H36"
  - block: eyes replaced by "M17 33 L27 38 M43 33 L33 38" stroke #14213D 2.6; mouth "M24 47 H36";
      add AFTER the body a badge: circle (56,12) r=9 fill #E5484D + X "M52 8 L60 16 M60 8 L52 16"
      stroke #fff 2.4
  - paused: closed-eye arcs "M18 36 Q22 40 26 36" and "M34 36 Q38 40 42 36", pause badge
      (grey circle with two white bars) at (56,12)
  - guard variant may add a dashed shield outline around the body, stroke #3D6BEA
  Colors: on blue header BODY #FFFFFF FACE #DCE8FD; on light bg BODY #3D6BEA FACE #FFFFFF;
  soft variant BODY #9DB8FF FACE #FFFFFF.

A2. Student doodle for the Home banner (118x84 viewBox)
  ground line "M4 78 H114" #9DB8FF; dotted trail "M14 56 Q30 40 52 46" #3D6BEA dashed;
  paper plane "M62 10 L106 24 L84 44 L78 34 Z" fill #fff stroke #14213D 2 plus fold line;
  coin circle (104,58) r=8 fill #F5A524 stroke #14213D; backpack rect (26,44,12x22) #1F3FA8;
  hoodie rect (34,40,22x28) #3D6BEA; legs two rects #14213D; head circle (45,30) r=9 #F7CDA6;
  hair path "M36 28 Q38 18 47 19 Q55 20 54 29 Q48 23 36 28 Z" #14213D; raised arm
  "M54 46 Q66 40 70 30" stroke #3D6BEA width 7 round.

A3. Header art (390x220, behind text, low opacity)
  clouds: white ellipses at opacity .14; four-point sparkles (path "M0 -7 Q0 0 7 0 Q0 0 0 7
  Q0 0 -7 0 Q0 0 0 -7 Z") in white at opacity .75; plus marks; small dots; dotted arc
  "M148 196 Q250 130 336 176" white .35 dashed; two amber coins (r=8 and r=6, stroke #14213D 1.6).
  Page-specific doodle near x=200..260,y=50..110: Home = paper plane; Tuition = graduation cap;
  Evidence = tilted document with a dashed stamp circle; Planner = calendar; Chat = speech
  bubble with three dots; Approval = shield with a check; Safety = radar rings.

A4. Radial attack map (viewBox 340x290, center 170,145)  JavaScript logic
  seeded random (fixed seed so the picture is stable).
  rings = [ {r:104, n:26}, {r:76, n:20}, {r:48, n:14} ]  // outer, middle, inner
  draw a dotted tick circle r=122 (stroke #9DB8FF, opacity .35, dasharray "1 5")
  for each ring: circle stroke #3D6BEA opacity .55; place n dots at angle 2*PI*i/n + k*0.45,
    dot radius 2..4.4, color from [#5B8CFF, #9DB8FF, #FFFFFF, #6FD3FF, #3D6BEA]
  radial glow behind: circle r=130 filled with a radial gradient #2B45C8 (opacity .55) to #0A1440 (0)
  attackers: 6 packets at angles -2.7 + i*0.95, start at radius 140 (red #FF6B6F dot r=4.5),
    dashed red line to the ring where the backend says the attack stopped, with a red "X" there.
  center: text "0" (size 48, weight 300, white) and label "Funds lost 资金损失" (size 10.5, #AFC4FF).
  Replay: packets animate along their line; the stopping ring comes from POST /attacks/replay.

APPENDIX B: SEED DATA (mock module; every screen reads from it or from the API)
  owner Ayu; allowance daily 1000, used 200; per-send cap 500; balance 2450
  fx USD_IDR 15880, USD_CNY 7.20; payees Mom (mother), Campus bursar (tuition), Dad (father)
  tuition due CNY 18000 -> send USD 2534.30 = base 2500.00 + fee 14.30 + buffer 20.00
  activity: sent 200 to Mom (received IDR 3,176,000, fee 0.42); blocked invoice attack, lost 0
  evidence: avg monthly balance 1820, income months 6/6, three sources with tiers 1, 2, 3
  planner: tuition due Jan 15, scholarship on time vs +30 days, safe minimum line
````

---

## 3. Catatan agar Hasilnya Akurat

- **Gambar adalah sumber kebenaran visual.** Bila agen menyimpang, tempelkan kembali tangkapan layar layar yang bersangkutan dan minta ia mengukur selisihnya (jarak, ukuran font, warna).
- **Jangan biarkan agen "menyelesaikan" dengan data karangan.** Setiap kali ia menulis angka langsung di komponen, minta dipindahkan ke modul data atau backend. Aturan ini ada di prompt, tetapi perlu ditegakkan saat peninjauan.
- **Peninjauan klaim.** Cari kata `smart contract`, `on-chain`, `HSM`, `WeBank`, `synced`, `guarantee` di seluruh basis kode sebelum menunjukkan apa pun kepada orang lain.
- **Ukuran pekerjaan.** Fase 1 dan 2 dapat dikerjakan paralel jika Anda memakai dua sesi agen. Fase 3 dan 4 bergantung pada keduanya.

## 4. Prompt Fase (Kirim Satu per Satu Setelah Rencana Disetujui)

**Fase 1 — UI statis.**
```
Phase 1 only. Build the 7 screens with the mock data module, routing, i18n (EN and ZH),
mascot, doodles, header art and bottom nav. No backend yet. Match the screenshots. Then
screenshot all routes at 390x844 and compare with the references; list differences and
fix them once. Do not start Phase 2.
```

**Fase 2 — Backend.**
```
Phase 2 only. Build the two separate services (api on 8000, bank on 8100) with different
secrets and databases, the scoped-token flow, parser (EN/ZH rules), policy tiers, intent
hash binding, simulation, audit chain, and pytest coverage. The api must never write the
bank ledger. Show me the test output and a curl walkthrough of golden flow A.
```

**Fase 3 — Penyambungan.**
```
Phase 3 only. Wire the UI to the API for golden flows A and B (send to Mom, pay tuition with
approval). Replace mock numbers with API data. The approval sheet is rendered from the
server-signed payload. Prove that changing the amount after approval is refused. Add the
dev=1 state switcher. Re-screenshot all routes.
```

**Fase 4 — Serangan dan ablasi.**
```
Phase 4 only. Implement the privacy filter, sentinel and the attack suite (12 families x 10
variants plus benign twins). Add POST /attacks/replay with per-layer toggles. Drive the
Safety screen radial map from real replay results. Output eval/reports/latest.json and a
printed ablation table with Wilson 95% intervals. Report observed numbers as they are.
```

**Fase 5 — Offline dan poles.**
```
Phase 5 only. Add offline mode (rules-only parser, cached shell, queued pause), reduced
motion, accessibility fixes, README with run instructions and honest limitations, and a
docker compose that works on a clean machine. Run the claim sweep: search the code and UI for
"smart contract", "on-chain", "HSM", "WeBank", "synced", "guarantee" and remove or justify.
```

---

## 5. Daftar Periksa untuk Anda Setelah Fase Selesai

- Tangkapan layar tujuh layar pada 390 dan 1440 lebar tersimpan di `/docs/screens`.
- `docker compose up` berjalan di mesin lain tanpa langkah tambahan.
- Alur A, B, dan C dapat diulang dari awal tanpa mengubah kode.
- Tabel ablasi pada laporan sama dengan yang tampil di aplikasi.
- Tidak ada permintaan jaringan eksternal saat aplikasi berjalan (periksa panel jaringan peramban).
- Setiap angka di layar dapat ditelusuri ke modul data atau respons API.
