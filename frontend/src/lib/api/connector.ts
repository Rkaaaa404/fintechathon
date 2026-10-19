/**
 * Shared HTTP connector for the API core and local bank sandbox.
 * Chat and approval always use backend results and fail explicitly.
 * Legacy informational screens may retain their existing offline fallback.
 * Defense checks are the privacy filter, spending rules, and bank scoped token;
 * demo approval is UI consent, not hardware passkey authentication.
 */

export const DEFAULT_API_BASE = 'http://127.0.0.1:8000';
export const DEFAULT_BANK_BASE = 'http://127.0.0.1:8100';

export interface HealthStatus {
  online: boolean;
  api: boolean;
  bank: boolean;
  latencyMs: number;
}

export interface BankBalanceResponse {
  account_id: string;
  owner_name: string;
  balance_usd: number;
  currency: string;
  network: string;
  simulated: boolean;
}

export interface PolicyResponse {
  daily_cap_usd: number;
  used_today_usd: number;
  remaining_today_usd: number;
  is_paused: boolean;
}

export interface TuitionQuoteResponse {
  amount_cny: number;
  base_amount_usd: number;
  rate: number;
  mode: string;
  fee_usd: number;
  buffer_usd: number;
  total_send_usd: number;
  eta_desc: string;
  estimate_note: string;
}

export interface AttackReplayResponse {
  case_id: string;
  stopped_by: 'outer' | 'middle' | 'inner' | 'none';
  funds_lost_usd: number;
  verdicts: Array<{
    ring: 'outer' | 'middle' | 'inner';
    name: string;
    status: 'flagged' | 'refused' | 'bypassed' | 'inactive';
    text: string;
  }>;
}

export interface AIExecutionInfo {
  source: 'deterministic' | 'cloud' | 'blocked';
  provider: 'none' | 'gemini' | 'groq';
  model: string | null;
}

export interface ExecutionChecks {
  privacy_filter: 'pass';
  spending_rules: 'pass';
  bank_token: 'pass';
}

export interface SlipResponse {
  type: 'slip';
  plan_chips: string[];
  status: 'COMPLETED';
  amount_usd: number;
  payee_name: string;
  received_text: string;
  tx_id: string;
  remaining_balance_usd: number;
  stamp: 'SENT';
  checks: ExecutionChecks;
  note: string;
}

export interface ApprovalSheetResponse {
  type: 'approval_sheet';
  plan_id: string;
  payee_name: string;
  you_asked: string;
  understood: string;
  send_amount_usd: number;
  receives_cny?: number;
  receives_idr?: number;
  rate: number;
  rate_pair: string;
  fee_with_buffer_usd: number;
  eta: string;
  intent_hash: string;
  why_approval_needed: string;
  changed_from_request?: string[];
  status: 'WAITING_APPROVAL';
}

export interface BlockedSlipResponse {
  type: 'blocked_slip';
  quoted_instruction: string;
  amount_lost_usd: number;
  verdicts: Array<{
    ring: 'outer' | 'middle' | 'inner';
    name: string;
    status: 'flagged' | 'refused' | 'bypassed' | 'inactive';
    text: string;
  }>;
  conclusion: string;
  stamp: 'BLOCKED';
}

export interface RefusedNoteResponse {
  type: 'refused_note';
  reason: string;
  stamp: 'BLOCKED';
}

export interface ClarificationResponse {
  type: 'clarification';
  message: string;
}

export interface InfoNoteResponse {
  type: 'info_note';
  message: string;
}

export interface ExecutionErrorResponse {
  type: 'execution_error';
  code: 'BANK_EXECUTION_FAILED';
  message: string;
}

export interface GanttRoadmapResponse {
  type: 'gantt_roadmap';
  title: string;
  summary: string;
}

export type AgentMessageResponse =
  | SlipResponse
  | ApprovalSheetResponse
  | BlockedSlipResponse
  | RefusedNoteResponse
  | ClarificationResponse
  | InfoNoteResponse
  | ExecutionErrorResponse
  | GanttRoadmapResponse;

export interface AgentMessageEnvelope {
  user_id: string;
  input: string;
  parsed: Record<string, unknown>;
  response: AgentMessageResponse;
  ai: AIExecutionInfo;
}

export interface ApprovalReceipt {
  status: 'COMPLETED';
  plan_id: string;
  tx_id: string;
  amount_usd: number;
  payee_name: string;
  remaining_balance_usd: number;
  intent_hash: string;
  stamp: 'SENT';
  checks: ExecutionChecks;
}

export class AegisPathConnector {
  private apiBase: string;
  private bankBase: string;
  private timeoutMs: number;
  private enableFallback: boolean;
  private demoToken?: string;
  private demoTokenExpires = 0;
  private demoLogin?: Promise<string>;

  private async getDemoToken(): Promise<string> {
    if (this.demoToken && Date.now() < this.demoTokenExpires) return this.demoToken;
    if (!this.demoLogin) {
      this.demoLogin = (async () => {
        const response = await fetch(`${this.apiBase}/v1/auth/demo-login`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'Ayu' }), signal: AbortSignal.timeout(this.timeoutMs),
        });
        if (!response.ok) throw new Error('Synthetic demo login is unavailable or disabled');
        const session = await response.json();
        if (typeof session.access_token !== 'string' || session.simulated !== true) throw new Error('Invalid synthetic demo session');
        this.demoToken = session.access_token;
        this.demoTokenExpires = Date.now() + Math.max(0, session.expires_in - 30) * 1000;
        return session.access_token as string;
      })().finally(() => { this.demoLogin = undefined; });
    }
    return this.demoLogin;
  }

  constructor(config: { apiBase?: string; bankBase?: string; timeoutMs?: number; enableFallback?: boolean } = {}) {
    this.apiBase =
      config.apiBase ||
      (typeof window !== 'undefined' && (window as any).AEGIS_API_URL) ||
      DEFAULT_API_BASE;
    this.bankBase =
      config.bankBase ||
      (typeof window !== 'undefined' && (window as any).AEGIS_BANK_URL) ||
      DEFAULT_BANK_BASE;
    this.timeoutMs = config.timeoutMs || 2500;
    this.enableFallback = config.enableFallback !== undefined ? config.enableFallback : true;
  }

  /**
   * Diagnostic check of backend services health and latency.
   */
  async checkHealth(): Promise<HealthStatus> {
    const start = Date.now();
    let apiOk = false;
    let bankOk = false;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${this.apiBase}/v1/health`, { signal: controller.signal });
      clearTimeout(timer);
      apiOk = res.ok;
    } catch {
      apiOk = false;
    }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${this.bankBase}/v1/health`, { signal: controller.signal });
      clearTimeout(timer);
      bankOk = res.ok;
    } catch {
      bankOk = false;
    }

    const latencyMs = Date.now() - start;

    return {
      online: apiOk && bankOk,
      api: apiOk,
      bank: bankOk,
      latencyMs,
    };
  }

  /**
   * Internal HTTP fetcher with timeout and automated fallback.
   */
  private async request<T>(
    url: string,
    options: RequestInit = {},
    fallbackFn?: () => T,
    timeoutMs: number = this.timeoutMs
  ): Promise<T> {
    const protectedApi = url.startsWith(`${this.apiBase}/v1/`) && !url.endsWith('/health') && !url.includes('/tuition/quote')
      || url.startsWith('/api/agent/') || url.startsWith('/api/plans/');
    const authorization = protectedApi ? `Bearer ${await this.getDemoToken()}` : undefined;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(authorization ? { Authorization: authorization } : {}),
          ...(options.headers || {}),
        },
      });

      if (res.ok) {
        return (await res.json()) as T;
      }

      const errData = await res.json().catch(() => null);
      const code = typeof errData?.code === 'string' && /^[A-Z][A-Z0-9_]*$/.test(errData.code)
        ? errData.code
        : null;
      const detail = typeof errData?.detail === 'string'
        ? errData.detail
        : typeof errData?.title === 'string' ? errData.title : `HTTP ${res.status}`;
      throw new Error(code ? `${code}: ${detail}` : detail);
    } catch (err) {
      if (!protectedApi && this.enableFallback && fallbackFn) {
        return fallbackFn();
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  // ----------------------------------------------------------------------------
  // 1. Bank Balance & Isolated Ledger (Bank Gateway :8100)
  // ----------------------------------------------------------------------------
  async getBankBalance(accountId: string = 'acc_student_ayu'): Promise<BankBalanceResponse> {
    return this.request<BankBalanceResponse>(
      `${this.bankBase}/v1/bank/balance?account_id=${encodeURIComponent(accountId)}`,
      { method: 'GET' },
      () => ({
        account_id: accountId,
        owner_name: 'Ayu',
        balance_usd: 12450.0,
        currency: 'USD',
        network: 'Testnet (Simulated)',
        simulated: true,
      })
    );
  }

  // ----------------------------------------------------------------------------
  // 2. Policy Plane & Circuit Breaker (API Core :8000)
  // ----------------------------------------------------------------------------
  async getPolicy(): Promise<PolicyResponse> {
    return this.request<PolicyResponse>(
      `${this.apiBase}/v1/policy`,
      { method: 'GET' },
      () => ({
        daily_cap_usd: 1000.0,
        used_today_usd: 200.0,
        remaining_today_usd: 800.0,
        is_paused: false,
      })
    );
  }

  async pauseAgent(): Promise<{ is_paused: boolean }> {
    return this.request<{ is_paused: boolean }>(
      `${this.apiBase}/v1/agent/pause`,
      { method: 'POST' },
      () => ({ is_paused: true })
    );
  }

  async resumeAgent(): Promise<{ is_paused: boolean }> {
    return this.request<{ is_paused: boolean }>(
      `${this.apiBase}/v1/agent/resume`,
      {
        method: 'POST',
        body: JSON.stringify({ demo_consent: true }),
      },
      () => ({ is_paused: false })
    );
  }

  async sendMessage(
    text: string,
    locale: string = 'en',
    syntheticDemo: boolean = false
  ): Promise<AgentMessageEnvelope> {
    // Primary route: Next.js API route or Core backend API
    const targetUrl = typeof window !== 'undefined'
      ? '/api/agent/messages'
      : `${this.apiBase}/v1/agent/messages`;

    return this.request<AgentMessageEnvelope>(targetUrl, {
      method: 'POST', body: JSON.stringify({ text, locale, synthetic_demo: syntheticDemo }),
    }, undefined, 35000);
  }

  // ----------------------------------------------------------------------------
  // 4. Tuition Calculation with Dynamic FX Buffer
  // ----------------------------------------------------------------------------
  async getTuitionQuote(amountCny: number = 18000.0, mode: string = 'cheapest'): Promise<TuitionQuoteResponse> {
    return this.request<TuitionQuoteResponse>(
      `${this.apiBase}/v1/tuition/quote`,
      {
        method: 'POST',
        body: JSON.stringify({ amount_cny: amountCny, mode }),
      },
      () => {
        const rates: Record<string, { fee: number; buf: number; eta: string }> = {
          cheapest: { fee: 0.42, buf: 12.5, eta: 'Arrives in 1 business day' },
          fastest: { fee: 18.0, buf: 0.0, eta: 'Arrives in 15 minutes' },
          balanced: { fee: 6.5, buf: 6.0, eta: 'Arrives in 1-2 hours' },
        };
        const sel = rates[mode] || rates.cheapest;
        const base = Math.round((amountCny / 7.1022) * 100) / 100;
        return {
          amount_cny: amountCny,
          base_amount_usd: base,
          rate: 7.1022,
          mode,
          fee_usd: sel.fee,
          buffer_usd: sel.buf,
          total_send_usd: Math.round((base + sel.fee + sel.buf) * 100) / 100,
          eta_desc: sel.eta,
          estimate_note: 'Estimate with dynamic safety buffer (含缓冲的估算,非保证)',
        };
      }
    );
  }

  // ----------------------------------------------------------------------------
  // 5. Plan Approval with Explicit Demo UI Consent
  // ----------------------------------------------------------------------------
  async approvePlan(planId: string, intentHash: string): Promise<ApprovalReceipt> {
    const targetUrl = typeof window !== 'undefined'
      ? `/api/plans/${encodeURIComponent(planId)}/approve`
      : `${this.apiBase}/v1/plans/${encodeURIComponent(planId)}/approve`;
    return this.request<ApprovalReceipt>(targetUrl, {
      method: 'POST', body: JSON.stringify({ intent_hash: intentHash, demo_consent: true }),
    }, undefined, 20000);
  }

  // ----------------------------------------------------------------------------
  // 6. Evidence Pack & Verifiable Share Links
  // ----------------------------------------------------------------------------
  async getEvidence(): Promise<any> {
    return this.request<any>(
      `${this.apiBase}/v1/evidence`,
      { method: 'GET' },
      () => ({
        avg_monthly_balance_usd: 1820.0,
        income_months_ratio: '6/6',
        statement_months: 6,
        sources: [
          {
            name: 'Bank statements 6 months',
            name_zh: '6个月银行流水',
            provenance: 'Uploaded by you',
            provenance_zh: '本人上传',
            tier: 'Tier 1',
          },
          {
            name: 'Family transfers',
            name_zh: '家庭经常性汇款',
            provenance: 'Bank API (simulated)',
            provenance_zh: '银行接口（模拟）',
            tier: 'Tier 2',
          },
          {
            name: 'Scholarship letter',
            name_zh: '奖学金证明函',
            provenance: 'Signed by university',
            provenance_zh: '大学官方签署',
            tier: 'Tier 3',
          },
        ],
        shares: [
          {
            id: 'share_landlord_a',
            recipient: 'Landlord A',
            recipient_zh: '房东 A',
            expires_in_days: 14,
            shared_fields: 'Balance & regular deposits',
            revoked: false,
          },
        ],
      })
    );
  }

  async revokeEvidence(shareId: string): Promise<any> {
    return this.request<any>(
      `${this.apiBase}/v1/evidence/share/${encodeURIComponent(shareId)}`,
      { method: 'DELETE' },
      () => ({ id: shareId, revoked: true })
    );
  }

  // ----------------------------------------------------------------------------
  // 7. Runway Cashflow Planner
  // ----------------------------------------------------------------------------
  async getPlanner(scenario: 'on_time' | 'delayed' = 'on_time'): Promise<any> {
    return this.request<any>(
      `${this.apiBase}/v1/planner?scenario=${scenario}`,
      { method: 'GET' },
      () => {
        const isDelayed = scenario === 'delayed';
        return {
          scenario,
          safe_minimum_usd: 1000.0,
          months: [
            { month: 'Oct', balance_usd: 2450.0 },
            { month: 'Nov', balance_usd: 2100.0 },
            { month: 'Dec', balance_usd: 1800.0 },
            { month: 'Jan', balance_usd: isDelayed ? 750.0 : 1600.0 },
            { month: 'Feb', balance_usd: isDelayed ? 1100.0 : 1950.0 },
            { month: 'Mar', balance_usd: isDelayed ? 1700.0 : 2300.0 },
          ],
          warning: isDelayed
            ? {
                title: 'Below the safe minimum in January',
                title_zh: '1月将低于安全线',
                detail:
                  'Tuition deduction happens before delayed scholarship arrives. Projected shortfall: $250.',
                detail_zh: '学费扣款先于延迟奖学金到账，预计资金缺口：$250。',
              }
            : null,
        };
      }
    );
  }

  // ----------------------------------------------------------------------------
  // 8. Attack Replay (Three Rings Defense Simulation)
  // ----------------------------------------------------------------------------
  async replayAttack(
    caseId: string = 'invoice_hidden_instruction_01',
    disabledLayers: string[] = []
  ): Promise<AttackReplayResponse> {
    return this.request<AttackReplayResponse>(
      `${this.apiBase}/v1/attacks/replay`,
      {
        method: 'POST',
        body: JSON.stringify({ case_id: caseId, disabled_layers: disabledLayers }),
      },
      () => {
        const disabled = new Set(disabledLayers || []);
        if (!disabled.has('privacy')) {
          return {
            case_id: caseId,
            stopped_by: 'outer',
            funds_lost_usd: 0.0,
            verdicts: [
              {
                ring: 'outer',
                name: 'Privacy filter',
                status: 'flagged',
                text: 'Privacy filter flagged an instruction inside the invoice/memo',
              },
              {
                ring: 'middle',
                name: 'Spending rules',
                status: 'inactive',
                text: 'Spending rules would refuse: recipient is not on your list',
              },
              {
                ring: 'inner',
                name: 'Bank limit',
                status: 'inactive',
                text: 'Bank-side limit would refuse: unverified scoped token',
              },
            ],
          };
        } else if (!disabled.has('rules')) {
          return {
            case_id: caseId,
            stopped_by: 'middle',
            funds_lost_usd: 0.0,
            verdicts: [
              {
                ring: 'outer',
                name: 'Privacy filter',
                status: 'bypassed',
                text: 'Layer disabled: prompt injection bypassed Outer Ring',
              },
              {
                ring: 'middle',
                name: 'Spending rules',
                status: 'refused',
                text: 'Middle Ring policy engine dropped transfer: recipient not allowed',
              },
              {
                ring: 'inner',
                name: 'Bank limit',
                status: 'inactive',
                text: 'Bank-side limit would refuse: missing scoped token',
              },
            ],
          };
        } else if (!disabled.has('bank')) {
          return {
            case_id: caseId,
            stopped_by: 'inner',
            funds_lost_usd: 0.0,
            verdicts: [
              {
                ring: 'outer',
                name: 'Privacy filter',
                status: 'bypassed',
                text: 'Layer disabled: prompt injection bypassed Outer Ring',
              },
              {
                ring: 'middle',
                name: 'Spending rules',
                status: 'bypassed',
                text: 'Layer disabled: bypassed spending rules policy plane',
              },
              {
                ring: 'inner',
                name: 'Bank limit',
                status: 'refused',
                text: 'Inner Ring bank daemon rejected transfer: invalid/missing HMAC token',
              },
            ],
          };
        } else {
          return {
            case_id: caseId,
            stopped_by: 'none',
            funds_lost_usd: 2450.0,
            verdicts: [
              { ring: 'outer', name: 'Privacy filter', status: 'bypassed', text: 'Layer disabled' },
              { ring: 'middle', name: 'Spending rules', status: 'bypassed', text: 'Layer disabled' },
              {
                ring: 'inner',
                name: 'Bank limit',
                status: 'bypassed',
                text: 'Layer disabled: catastrophic failure without defense rings',
              },
            ],
          };
        }
      }
    );
  }
}

export const connector = new AegisPathConnector();
