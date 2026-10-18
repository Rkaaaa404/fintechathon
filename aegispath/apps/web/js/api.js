// AegisPath API Connector (apps/web/js/api.js)
// Connects to FastAPI Core (8000) & Bank (8100) with automatic local fallback

export const API_BASE = 'http://127.0.0.1:8000';
export const BANK_BASE = 'http://127.0.0.1:8100';

class ApiService {
  constructor() {
    this.isBackendOnline = null;
    this.lastHealthCheck = 0;
  }

  async checkHealth() {
    const now = Date.now();
    if (this.isBackendOnline !== null && now - this.lastHealthCheck < 10000) {
      return this.isBackendOnline;
    }
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${API_BASE}/v1/health`, { signal: controller.signal });
      clearTimeout(id);
      this.isBackendOnline = res.ok;
    } catch (e) {
      this.isBackendOnline = false;
    }
    this.lastHealthCheck = now;
    return this.isBackendOnline;
  }

  async fetchWithFallback(url, options = {}, fallbackFn = null) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(options.headers || {})
        }
      });
      clearTimeout(id);
      if (res.ok) {
        return await res.json();
      }
      const errData = await res.json().catch(() => ({}));
      console.warn(`[API] Server responded with error ${res.status}:`, errData);
      if (fallbackFn) return fallbackFn(errData);
      throw new Error(errData.detail || errData.title || `HTTP ${res.status}`);
    } catch (err) {
      console.warn(`[API] Request failed (${url}), falling back:`, err.message);
      if (fallbackFn) return fallbackFn();
      throw err;
    }
  }

  // 1. Agent Chat Message
  async sendMessage(text, locale = 'en') {
    return this.fetchWithFallback(
      `${API_BASE}/v1/agent/messages`,
      {
        method: 'POST',
        body: JSON.stringify({ text, locale })
      },
      () => {
        // Deterministic client fallback if backend is offline
        const lower = text.toLowerCase();
        if (lower.includes('ignore') || lower.includes('full balance') || lower.includes('account x')) {
          return {
            response: {
              type: 'blocked_slip',
              quoted_instruction: text,
              amount_lost_usd: 0.0,
              stamp: 'BLOCKED',
              verdicts: [
                { ring: 'outer', name: 'Privacy filter', status: 'flagged', text: 'Privacy filter flagged an instruction inside the memo' },
                { ring: 'middle', name: 'Spending rules', status: 'refused', text: 'Spending rules would refuse: recipient not on list' },
                { ring: 'inner', name: 'Bank limit', status: 'refused', text: 'Bank limit would refuse: unverified scoped token' }
              ]
            }
          };
        } else if (lower.includes('tuition') || lower.includes('¥18,000') || lower.includes('bursar') || lower.includes('学费')) {
          return {
            response: {
              type: 'approval_sheet',
              plan_id: 'plan-tuition-demo',
              intent_hash: 'INTENT-SHA256-32058574F1A184E7',
              send_amount_usd: 2534.30,
              receives_cny: 18000.0,
              rate: 7.20,
              fee_with_buffer_usd: 34.30,
              eta: 'Arrives in 1 business day',
              status: 'WAITING_APPROVAL'
            }
          };
        } else {
          return {
            response: {
              type: 'slip',
              status: 'COMPLETED',
              amount_usd: 200.0,
              payee_name: 'Mom',
              stamp: 'SENT',
              checks: { privacy_filter: 'pass', spending_rules: 'pass', bank_limit: 'pass' }
            }
          };
        }
      }
    );
  }

  // 2. Tuition Quote
  async getTuitionQuote(amountCny = 18000.0, mode = 'cheapest') {
    return this.fetchWithFallback(
      `${API_BASE}/v1/tuition/quote`,
      {
        method: 'POST',
        body: JSON.stringify({ amount_cny: amountCny, mode })
      },
      () => {
        const rates = { cheapest: { fee: 0.42, buf: 12.50 }, fastest: { fee: 18.00, buf: 0 }, balanced: { fee: 6.50, buf: 6.00 } };
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
          eta_desc: mode === 'fastest' ? 'Arrives in 15 minutes' : (mode === 'balanced' ? 'Arrives in 1-2 hours' : 'Arrives in 1 business day'),
          estimate_note: 'Estimate with a buffer, not a guarantee (含缓冲的估算,非保证)'
        };
      }
    );
  }

  // 3. Plan Approval with Passkey
  async approvePlan(planId, intentHash, passkeySignature = 'SIG_PASSKEY_VALID_01') {
    return this.fetchWithFallback(
      `${API_BASE}/v1/plans/${planId}/approve`,
      {
        method: 'POST',
        body: JSON.stringify({ intent_hash: intentHash, passkey_signature: passkeySignature })
      },
      () => ({
        status: 'COMPLETED',
        plan_id: planId,
        tx_id: 'tx_sim_' + Date.now().toString(36),
        amount_usd: 2534.30,
        payee_name: 'Campus bursar',
        intent_hash: intentHash,
        stamp: 'SENT'
      })
    );
  }

  // 4. Policy & Allowance
  async getPolicy() {
    return this.fetchWithFallback(
      `${API_BASE}/v1/policy`,
      { method: 'GET' },
      () => ({
        daily_cap_usd: 1000.0,
        used_today_usd: 200.0,
        remaining_today_usd: 800.0,
        is_paused: false
      })
    );
  }

  // 5. Agent Pause / Resume
  async pauseAgent() {
    return this.fetchWithFallback(
      `${API_BASE}/v1/agent/pause`,
      { method: 'POST' },
      () => ({ is_paused: true })
    );
  }

  async resumeAgent(passkeySignature = 'SIG_PASSKEY_VALID_01') {
    return this.fetchWithFallback(
      `${API_BASE}/v1/agent/resume`,
      {
        method: 'POST',
        body: JSON.stringify({ passkey_signature: passkeySignature })
      },
      () => ({ is_paused: false })
    );
  }

  // 6. Evidence Pack
  async getEvidence() {
    return this.fetchWithFallback(
      `${API_BASE}/v1/evidence`,
      { method: 'GET' },
      () => ({
        avg_monthly_balance_usd: 1820.0,
        income_months_ratio: '6/6',
        statement_months: 6,
        sources: [
          { name: 'Bank statements 6 months', name_zh: '6个月银行流水', provenance: 'Uploaded by you', provenance_zh: '本人上传', tier: 'Tier 1' },
          { name: 'Family transfers', name_zh: '家庭经常性汇款', provenance: 'Bank API (simulated)', provenance_zh: '银行接口（模拟）', tier: 'Tier 2' },
          { name: 'Scholarship letter', name_zh: '奖学金证明函', provenance: 'Signed by university', provenance_zh: '大学官方签署', tier: 'Tier 3' }
        ],
        shares: [
          { id: 'share_landlord_a', recipient: 'Landlord A', recipient_zh: '房东 A', expires_in_days: 14, shared_fields: 'Balance & regular deposits', revoked: false }
        ]
      })
    );
  }

  async revokeEvidence(shareId) {
    return this.fetchWithFallback(
      `${API_BASE}/v1/evidence/share/${shareId}`,
      { method: 'DELETE' },
      () => ({ id: shareId, revoked: true })
    );
  }

  // 7. Runway Planner
  async getPlanner(scenario = 'on_time') {
    return this.fetchWithFallback(
      `${API_BASE}/v1/planner?scenario=${scenario}`,
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
            { month: 'Mar', balance_usd: isDelayed ? 1700.0 : 2300.0 }
          ],
          warning: isDelayed ? {
            title: 'Below the safe minimum in January',
            title_zh: '1月将低于安全线',
            detail: 'Tuition deduction happens before delayed scholarship arrives. Projected shortfall: $250.',
            detail_zh: '学费扣款先于延迟奖学金到账，预计资金缺口：$250。'
          } : null
        };
      }
    );
  }

  // 8. Attack Replay (Three-Ring Defense)
  async replayAttack(caseId = 'invoice_hidden_instruction_01', disabledLayers = []) {
    return this.fetchWithFallback(
      `${API_BASE}/v1/attacks/replay`,
      {
        method: 'POST',
        body: JSON.stringify({ case_id: caseId, disabled_layers: disabledLayers })
      },
      () => {
        const disabled = new Set(disabledLayers || []);
        if (!disabled.has('privacy')) {
          return {
            case_id: caseId,
            stopped_by: 'outer',
            funds_lost_usd: 0.0,
            verdicts: [
              { ring: 'outer', name: 'Privacy filter', status: 'flagged', text: 'Privacy filter flagged an instruction inside the invoice/memo' },
              { ring: 'middle', name: 'Spending rules', status: 'inactive', text: 'Spending rules would refuse: recipient is not on your list' },
              { ring: 'inner', name: 'Bank limit', status: 'inactive', text: 'Bank-side limit would refuse: unverified scoped token' }
            ]
          };
        } else if (!disabled.has('rules')) {
          return {
            case_id: caseId,
            stopped_by: 'middle',
            funds_lost_usd: 0.0,
            verdicts: [
              { ring: 'outer', name: 'Privacy filter', status: 'bypassed', text: 'Layer disabled: prompt injection bypassed Outer Ring' },
              { ring: 'middle', name: 'Spending rules', status: 'refused', text: 'Middle Ring policy engine dropped transfer: recipient not allowed' },
              { ring: 'inner', name: 'Bank limit', status: 'inactive', text: 'Bank-side limit would refuse: missing scoped token' }
            ]
          };
        } else if (!disabled.has('bank')) {
          return {
            case_id: caseId,
            stopped_by: 'inner',
            funds_lost_usd: 0.0,
            verdicts: [
              { ring: 'outer', name: 'Privacy filter', status: 'bypassed', text: 'Layer disabled: prompt injection bypassed Outer Ring' },
              { ring: 'middle', name: 'Spending rules', status: 'bypassed', text: 'Layer disabled: bypassed spending rules policy plane' },
              { ring: 'inner', name: 'Bank limit', status: 'refused', text: 'Inner Ring bank daemon rejected transfer: invalid/missing HMAC token' }
            ]
          };
        } else {
          return {
            case_id: caseId,
            stopped_by: 'none',
            funds_lost_usd: 2450.0,
            verdicts: [
              { ring: 'outer', name: 'Privacy filter', status: 'bypassed', text: 'Layer disabled' },
              { ring: 'middle', name: 'Spending rules', status: 'bypassed', text: 'Layer disabled' },
              { ring: 'inner', name: 'Bank limit', status: 'bypassed', text: 'Layer disabled: catastrophic failure without defense rings' }
            ]
          };
        }
      }
    );
  }

  // 9. Bank Balance
  async getBankBalance() {
    return this.fetchWithFallback(
      `${BANK_BASE}/v1/bank/balance?account_id=acc_student_ayu`,
      { method: 'GET' },
      () => ({ balance_usd: 12450.0, owner_name: 'Ayu', network: 'Testnet' })
    );
  }
}

export const api = new ApiService();
