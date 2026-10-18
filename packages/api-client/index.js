/**
 * @aegispath/api-client
 * Isomorphic, typed HTTP client for AegisPath API & Bank services.
 * Injected fetch and baseUrl support for Web, Node, and React Native / Capacitor.
 */

class AegisPathClient {
  constructor(options = {}) {
    this.apiUrl = options.apiUrl || 'http://127.0.0.1:8000';
    this.bankUrl = options.bankUrl || 'http://127.0.0.1:8100';
    this.fetch = options.fetch || (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : null);
    this.tokenStore = options.tokenStore || new InMemoryTokenStore();

    if (!this.fetch) {
      throw new Error('No fetch implementation provided or found in environment.');
    }
  }

  async _request(baseUrl, path, options = {}) {
    const url = `${baseUrl}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers || {})
    };

    const token = await this.tokenStore.getAccessToken();
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await this.fetch(url, {
      ...options,
      headers
    });

    const isJson = (res.headers.get('content-type') || '').includes('application/json');
    const data = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      const err = new Error(data.detail || data.title || `Request failed with status ${res.status}`);
      err.status = res.status;
      err.code = data.code || 'HTTP_ERROR';
      err.data = data;
      throw err;
    }

    return data;
  }

  // ── Auth ──────────────────────────────────────────────────
  async login(username = 'Ayu') {
    const res = await this._request(this.apiUrl, '/v1/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ username })
    });
    await this.tokenStore.setTokens(res.access_token, res.refresh_token);
    return res;
  }

  async refreshToken(refreshToken) {
    const res = await this._request(this.apiUrl, '/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken })
    });
    await this.tokenStore.setTokens(res.access_token, res.refresh_token);
    return res;
  }

  // ── Policy ────────────────────────────────────────────────
  async getPolicy() {
    return this._request(this.apiUrl, '/v1/policy', { method: 'GET' });
  }

  async proposePolicy(newDailyCapUsd, newSingleSendCapUsd) {
    return this._request(this.apiUrl, '/v1/policy', {
      method: 'PUT',
      body: JSON.stringify({
        new_daily_cap_usd: newDailyCapUsd,
        new_single_send_cap_usd: newSingleSendCapUsd
      })
    });
  }

  // ── Agent Control ─────────────────────────────────────────
  async pauseAgent() {
    return this._request(this.apiUrl, '/v1/agent/pause', { method: 'POST' });
  }

  async resumeAgent(passkeySignature) {
    return this._request(this.apiUrl, '/v1/agent/resume', {
      method: 'POST',
      body: JSON.stringify({ passkey_signature: passkeySignature })
    });
  }

  // ── Audit Chain ───────────────────────────────────────────
  async getAuditTrail(limit = 50) {
    return this._request(this.apiUrl, `/v1/audit?limit=${limit}`, { method: 'GET' });
  }

  async verifyAudit() {
    return this._request(this.apiUrl, '/v1/audit/verify', { method: 'GET' });
  }

  // ── Plan Approval & Agent Messaging ─────────────────────
  async sendMessage(text, locale = 'en') {
    return this._request(this.apiUrl, '/v1/agent/messages', {
      method: 'POST',
      body: JSON.stringify({ text, locale })
    });
  }

  async getTuitionQuote(amountCny = 18000.0, mode = 'cheapest') {
    return this._request(this.apiUrl, '/v1/tuition/quote', {
      method: 'POST',
      body: JSON.stringify({ amount_cny: amountCny, mode })
    });
  }

  async getPlan(planId) {
    return this._request(this.apiUrl, `/v1/plans/${planId}`, { method: 'GET' });
  }

  async approvePlan(planId, intentHash, passkeySignature) {
    return this._request(this.apiUrl, `/v1/plans/${planId}/approve`, {
      method: 'POST',
      body: JSON.stringify({
        intent_hash: intentHash,
        passkey_signature: passkeySignature
      })
    });
  }

  // ── Evidence, Planner & Safety ───────────────────────────
  async getEvidence() {
    return this._request(this.apiUrl, '/v1/evidence', { method: 'GET' });
  }

  async shareEvidence(recipient = 'Landlord A', days = 14) {
    return this._request(this.apiUrl, '/v1/evidence/share', {
      method: 'POST',
      body: JSON.stringify({ recipient, days })
    });
  }

  async revokeEvidence(shareId) {
    return this._request(this.apiUrl, `/v1/evidence/share/${shareId}`, { method: 'DELETE' });
  }

  async getPlanner(scenario = 'on_time') {
    return this._request(this.apiUrl, `/v1/planner?scenario=${scenario}`, { method: 'GET' });
  }

  async replayAttack(caseId = 'invoice_hidden_instruction_01', disabledLayers = []) {
    return this._request(this.apiUrl, '/v1/attacks/replay', {
      method: 'POST',
      body: JSON.stringify({ case_id: caseId, disabled_layers: disabledLayers })
    });
  }

  // ── Bank Daemon Direct (Optional Read-Only) ───────────────
  async getBankBalance(accountId = 'acc_student_ayu') {
    return this._request(this.bankUrl, `/v1/bank/balance?account_id=${accountId}`, { method: 'GET' });
  }

  async getBankLedger(accountId = 'acc_student_ayu') {
    return this._request(this.bankUrl, `/v1/bank/ledger?account_id=${accountId}`, { method: 'GET' });
  }
}

class InMemoryTokenStore {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
  }
  async getAccessToken() { return this.accessToken; }
  async setTokens(access, refresh) {
    this.accessToken = access;
    this.refreshToken = refresh;
  }
  async clear() {
    this.accessToken = null;
    this.refreshToken = null;
  }
}

module.exports = {
  AegisPathClient,
  InMemoryTokenStore
};
