export interface TokenStore {
  getAccessToken(): Promise<string | null>;
  setTokens(access: string, refresh: string): Promise<void>;
  clear(): Promise<void>;
}

export interface ClientOptions {
  apiUrl?: string;
  bankUrl?: string;
  fetch?: typeof fetch;
  tokenStore?: TokenStore;
}

export declare class InMemoryTokenStore implements TokenStore {
  getAccessToken(): Promise<string | null>;
  setTokens(access: string, refresh: string): Promise<void>;
  clear(): Promise<void>;
}

export declare class AegisPathClient {
  constructor(options?: ClientOptions);
  login(username?: string): Promise<{ access_token: string; refresh_token: string; token_type: string; expires_in: number }>;
  refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }>;
  getPolicy(): Promise<any>;
  proposePolicy(newDailyCapUsd: number, newSingleSendCapUsd: number): Promise<any>;
  pauseAgent(): Promise<{ is_paused: boolean; banner: string }>;
  resumeAgent(passkeySignature: string): Promise<{ is_paused: boolean; message: string }>;
  getAuditTrail(limit?: number): Promise<{ count: number; entries: any[] }>;
  verifyAudit(): Promise<{ valid: boolean; count: number; head_hash: string }>;
  sendMessage(text: string, locale?: string): Promise<any>;
  getTuitionQuote(amountCny?: number, mode?: string): Promise<any>;
  getPlan(planId: string): Promise<any>;
  approvePlan(planId: string, intentHash: string, passkeySignature: string): Promise<any>;
  getEvidence(): Promise<any>;
  shareEvidence(recipient?: string, days?: number): Promise<any>;
  revokeEvidence(shareId: string): Promise<any>;
  getPlanner(scenario?: string): Promise<any>;
  replayAttack(caseId?: string, disabledLayers?: string[]): Promise<any>;
  getBankBalance(accountId?: string): Promise<{ account_id: string; balance_usd: number; currency: string; simulated: boolean }>;
  getBankLedger(accountId?: string): Promise<{ account_id: string; total_entries: number; entries: any[] }>;
}
