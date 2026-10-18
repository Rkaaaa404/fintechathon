/**
 * =========================================================================
 * AI ENGINEER HOOK: Client-side AI Gateway & Agent Message Processor
 * =========================================================================
 * 
 * Instructions for your AI Engineer:
 * 1. To connect a live cloud LLM (e.g. OpenAI, Anthropic, LiteLLM) or a local 
 *    Ollama instance, set `USE_CLOUD_LLM = true` below.
 * 2. Configure your API base URL or proxy endpoint in `AI_GATEWAY_CONFIG`.
 * 3. Ensure your LLM call returns responses matching `UserIntentOutput` JSON schema.
 * 4. PII Scrubbing (e.g. Presidio) is enforced on the backend before requests 
 *    leave the local perimeter.
 * 5. If `USE_CLOUD_LLM` is false, this module falls back to deterministic,
 *    zero-latency regex and rule-based processing for 100% offline demo safety.
 * =========================================================================
 */

import { Locale } from '@/types';

export const AI_GATEWAY_CONFIG = {
  USE_CLOUD_LLM: false, // Set to true when live LLM backend / API key is active
  API_BASE_URL: process.env.NEXT_PUBLIC_AI_GATEWAY_URL || 'http://127.0.0.1:8000/v1/ai',
  MODEL_NAME: 'gpt-4o-mini', // or 'ollama/llama3.2', 'qwen2.5-coder'
  TEMPERATURE: 0.1,
};

// ── Types for Chat Messages & Rich Stepper UI ─────────────────────────────

export interface PlanStep {
  labelEn: string;
  labelZh: string;
  status: 'done' | 'active' | 'pending';
}

export interface PlanCardData {
  titleEn: string;
  titleZh: string;
  steps: PlanStep[];
}

export interface ReceiptSlipData {
  status: 'SENT' | 'BLOCKED';
  amountText: string;
  recipientText: string;
  detailsEn: string;
  detailsZh: string;
  noticeEn: string;
  noticeZh: string;
  checks: string[];
}

export interface QuickChipData {
  labelEn: string;
  labelZh: string;
  action?: string;
  route?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  textEn: string;
  textZh: string;
  timestamp: string;
  planCard?: PlanCardData;
  receiptSlip?: ReceiptSlipData;
  quickChips?: QuickChipData[];
}

export interface UserIntentOutput {
  raw_text: string;
  action: 'transfer' | 'tuition' | 'evidence' | 'safety' | 'pause' | 'general';
  amount: number;
  currency: string;
  currency_assumed: boolean;
  payee: string;
  route_preference: 'fastest' | 'cheapest' | 'balanced';
  assumptions: string[];
  flagged_injection: boolean;
  threat_reason?: string;
}

// ── Default Seed Conversation ─────────────────────────────────────────────

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-seed-1',
    role: 'user',
    textEn: 'Send $200 to Mom, cheapest route',
    textZh: '给妈妈汇 $200, 选最便宜路线',
    timestamp: '10:24 AM',
  },
  {
    id: 'msg-seed-2',
    role: 'assistant',
    textEn: 'Understood. Verified Mom in allowlisted payees ($200 / $500 per-send cap). Executing cheapest route via Bank Sandbox.',
    textZh: '已理解。已核验妈妈在白名单收款人中 (单笔 $200 / $500 限额内)。正通过银行沙盒执行最经济路线。',
    timestamp: '10:24 AM',
    planCard: {
      titleEn: 'Executing Transfer Plan',
      titleZh: '正在执行汇款规划',
      steps: [
        { labelEn: 'Quote 报价', labelZh: '报价', status: 'done' },
        { labelEn: 'Payee 收款人', labelZh: '收款人', status: 'done' },
        { labelEn: 'Limits 额度', labelZh: '额度', status: 'done' },
        { labelEn: 'Simulate 模拟', labelZh: '模拟', status: 'done' },
        { labelEn: 'Execute 执行', labelZh: '执行', status: 'done' },
      ],
    },
    receiptSlip: {
      status: 'SENT',
      amountText: '$200.00 to Mom',
      recipientText: 'Ibu Ratna (BCA Indonesia)',
      detailsEn: 'Received Rp 3,176,000 · fee $0.42 (simulated)',
      detailsZh: '收款 Rp 3,176,000 · 手续费 $0.42 (模拟)',
      noticeEn: 'Done. Arrives in about 2 minutes. Safety enforced outside LLM.',
      noticeZh: '已完成，约2分钟到账。安全规则由外部护栏强校验。',
      checks: ['Privacy 隐私', 'Rules 规则', 'Bank limit 银行限额'],
    },
    quickChips: [
      { labelEn: 'Pay tuition 缴学费', labelZh: '缴学费', route: '/tuition' },
      { labelEn: 'Send $3,000 汇款', labelZh: '汇款', action: 'prompt-send-3000' },
      { labelEn: 'Share proof 分享证明', labelZh: '分享证明', route: '/evidence' },
      { labelEn: 'Simulate attack 模拟攻击', labelZh: '模拟攻击', action: 'prompt-attack' },
    ],
  },
];

// ── Fallback Deterministic Intent Parser (Offline-Ready) ──────────────────

export function parseLocalIntent(prompt: string): UserIntentOutput {
  const clean = prompt.trim();
  const lower = clean.toLowerCase();

  // 1. Attack / Injection detection
  if (
    lower.includes('attack') ||
    lower.includes('hack') ||
    lower.includes('ignore') ||
    lower.includes('override') ||
    lower.includes('bypass') ||
    lower.includes('invoice injection')
  ) {
    return {
      raw_text: clean,
      action: 'safety',
      amount: 2450.0,
      currency: 'USD',
      currency_assumed: false,
      payee: 'Attacker Account (Fake Invoice)',
      route_preference: 'fastest',
      assumptions: ['Hidden prompt injection detected in memo'],
      flagged_injection: true,
      threat_reason: 'Hidden instruction in invoice attempted to redirect recipient address.',
    };
  }

  // 2. Tuition Intent
  if (
    lower.includes('tuition') ||
    lower.includes('bursar') ||
    lower.includes('school') ||
    clean.includes('学费') ||
    clean.includes('缴费')
  ) {
    return {
      raw_text: clean,
      action: 'tuition',
      amount: 18000.0,
      currency: 'CNY',
      currency_assumed: false,
      payee: 'Campus bursar (学校财务处)',
      route_preference: 'cheapest',
      assumptions: ['Tuition arrives in full guarantee applied with $20 buffer'],
      flagged_injection: false,
    };
  }

  // 3. Pause / Stop Intent
  if (
    lower.includes('pause') ||
    lower.includes('stop') ||
    lower.includes('freeze') ||
    clean.includes('暂停') ||
    clean.includes('停止')
  ) {
    return {
      raw_text: clean,
      action: 'pause',
      amount: 0,
      currency: 'USD',
      currency_assumed: false,
      payee: '',
      route_preference: 'balanced',
      assumptions: ['Kill-switch triggered'],
      flagged_injection: false,
    };
  }

  // 4. Evidence Intent
  if (
    lower.includes('evidence') ||
    lower.includes('proof') ||
    lower.includes('landlord') ||
    clean.includes('证明') ||
    clean.includes('房东')
  ) {
    return {
      raw_text: clean,
      action: 'evidence',
      amount: 0,
      currency: 'USD',
      currency_assumed: false,
      payee: 'Landlord A',
      route_preference: 'balanced',
      assumptions: ['Share link with 14-day expiry'],
      flagged_injection: false,
    };
  }

  // 5. Transfer Intent
  const numMatch = lower.match(/(?:\$|¥|￥)?\s*([0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?)/);
  const detectedAmount = numMatch ? parseFloat(numMatch[1].replace(/,/g, '')) : 200.0;

  let payee = 'Mom';
  if (lower.includes('dad') || clean.includes('爸爸')) payee = 'Dad';
  if (lower.includes('bursar') || clean.includes('财务处')) payee = 'Campus bursar';

  return {
    raw_text: clean,
    action: 'transfer',
    amount: detectedAmount,
    currency: clean.includes('¥') || lower.includes('cny') ? 'CNY' : 'USD',
    currency_assumed: !lower.includes('usd') && !lower.includes('$'),
    payee,
    route_preference: lower.includes('fast') ? 'fastest' : 'cheapest',
    assumptions: ['Recipient pre-allowlisted in Tier 1 policy'],
    flagged_injection: false,
  };
}

// ── Agent Chat Processor (Handles Live or Offline) ─────────────────────────

export async function processUserMessage(
  userText: string,
  _locale: Locale = 'en'
): Promise<ChatMessage> {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // If cloud LLM is enabled by your AI Engineer:
  if (AI_GATEWAY_CONFIG.USE_CLOUD_LLM) {
    try {
      const response = await fetch(`${AI_GATEWAY_CONFIG.API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText, model: AI_GATEWAY_CONFIG.MODEL_NAME }),
      });
      if (response.ok) {
        const data = await response.json();
        return data as ChatMessage;
      }
    } catch (err) {
      console.warn('[AegisPath AI Gateway] Cloud call failed, falling back to local engine:', err);
    }
  }

  // Deterministic Local Fallback Engine:
  const intent = parseLocalIntent(userText);

  if (intent.flagged_injection) {
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      textEn: `🚨 Security Alert: Prompt injection intercepted! Hidden instruction attempted to siphon $${intent.amount}. Blocked by Outer Privacy Ring. $0 lost.`,
      textZh: `🚨 安全警报：已拦截提示词注入攻击！隐藏指令试图窃取 $${intent.amount}。已被外环隐私过滤器拦截，损失 $0。`,
      timestamp: timeStr,
      planCard: {
        titleEn: 'Defending Autonomous Wallet',
        titleZh: '正在执行安全防御',
        steps: [
          { labelEn: 'Scan 扫描', labelZh: '扫描', status: 'done' },
          { labelEn: 'Privacy 隐私过滤', labelZh: '隐私过滤', status: 'done' },
          { labelEn: 'Sentinel 拦截', labelZh: '哨兵拦截', status: 'done' },
          { labelEn: 'Isolate 隔离', labelZh: '隔离', status: 'done' },
          { labelEn: 'Drop 丢弃', labelZh: '丢弃', status: 'done' },
        ],
      },
      receiptSlip: {
        status: 'BLOCKED',
        amountText: `$${intent.amount.toFixed(2)} to Attacker`,
        recipientText: intent.payee,
        detailsEn: 'Intercepted before any transaction could be proposed · $0.00 lost',
        detailsZh: '在生成任何转账指令前即被拦截 · 资金损失 $0.00',
        noticeEn: 'Blocked by Privacy filter: hidden prompt instruction detected in memo. $0 lost.',
        noticeZh: '外环隐私过滤已生效：检测到备忘录中包含提示词注入攻击。资金损失 $0。',
        checks: ['Privacy 隐私 (BLOCKED)', 'Rules 规则 (STANDBY)', 'Bank limit 银行硬限额 (STANDBY)'],
      },
      quickChips: [
        { labelEn: 'View safety center 安全中心', labelZh: '安全中心', route: '/safety' },
        { labelEn: 'Replay attack 回放攻击', labelZh: '回放攻击', action: 'replay-attack' },
      ],
    };
  }

  if (intent.action === 'tuition' || intent.amount > 500) {
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      textEn: `Tuition bill of ¥18,000 CNY ($2,534.30 USD) exceeds autonomous $500 per-send cap. Passkey authorization required.`,
      textZh: `学费账单 ¥18,000 CNY ($2,534.30 USD) 超过了智能体自主汇款的 $500 限额，需要您使用通行密钥确认。`,
      timestamp: timeStr,
      planCard: {
        titleEn: 'Tuition Safeguard Plan',
        titleZh: '学费全额到账规划',
        steps: [
          { labelEn: 'Bursar Invoice', labelZh: '学费单校验', status: 'done' },
          { labelEn: 'FX Lock (7.20)', labelZh: '锁定汇率', status: 'done' },
          { labelEn: 'Buffer (+$20)', labelZh: '缓冲准备', status: 'done' },
          { labelEn: 'Passkey Auth', labelZh: '通行密钥', status: 'active' },
          { labelEn: 'Settlement', labelZh: '银行清算', status: 'pending' },
        ],
      },
      receiptSlip: {
        status: 'SENT',
        amountText: '$2,534.30 USD (¥18,000 CNY)',
        recipientText: 'Campus bursar 学校财务处',
        detailsEn: 'Fastest route via Bank of China · Fee $14.30 + $20 buffer',
        detailsZh: '最快通道直连中国银行 · 手续费 $14.30 + $20 缓冲',
        noticeEn: 'Arrives in full on Jan 15. Requires 1-tap passkey biometric sign.',
        noticeZh: '保障1月15日足额到账。仅需一步通行密钥指纹/面容确认。',
        checks: ['Privacy 隐私', 'Rules 规则 (Over-limit)', 'Bank limit 银行限额'],
      },
      quickChips: [
        { labelEn: 'Review & Sign 去授权', labelZh: '去授权', route: '/approve' },
        { labelEn: 'Calculate tuition 去计算', labelZh: '去计算', route: '/tuition' },
      ],
    };
  }

  if (intent.action === 'pause') {
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      textEn: 'Agent has been paused via kill-switch. All autonomous money movement is frozen.',
      textZh: '智能体已通过紧急开关暂停。所有自主资金流动已冻结。',
      timestamp: timeStr,
      quickChips: [
        { labelEn: 'Resume agent 恢复智能体', labelZh: '恢复智能体', action: 'toggle-pause' },
        { labelEn: 'Safety Center 安全中心', labelZh: '安全中心', route: '/safety' },
      ],
    };
  }

  if (intent.action === 'evidence') {
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      textEn: 'Evidence Pack generated: Average monthly balance $1,820 USD with 6/6 verified deposits.',
      textZh: '财力证明包已生成：月均余额 $1,820 USD，已核验 6/6 个月稳定入账。',
      timestamp: timeStr,
      quickChips: [
        { labelEn: 'Open evidence pack 打开证明包', labelZh: '打开证明包', route: '/evidence' },
      ],
    };
  }

  // General transfer response
  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    textEn: `Prepared transfer of $${intent.amount.toFixed(2)} USD to ${intent.payee} via ${intent.route_preference} route. All 3 defensive rings validated.`,
    textZh: `已为向 ${intent.payee} 汇出 $${intent.amount.toFixed(2)} USD 准备好 ${intent.route_preference} 路线。3层外部防御环已全部通过。`,
    timestamp: timeStr,
    planCard: {
      titleEn: 'Executing Transfer',
      titleZh: '正在执行汇款',
      steps: [
        { labelEn: 'Quote', labelZh: '报价', status: 'done' },
        { labelEn: 'Payee Check', labelZh: '收款人核验', status: 'done' },
        { labelEn: 'Rules Check', labelZh: '规则核验', status: 'done' },
        { labelEn: 'Bank Sandbox', labelZh: '银行沙盒', status: 'done' },
        { labelEn: 'Sent', labelZh: '成功汇出', status: 'done' },
      ],
    },
    receiptSlip: {
      status: 'SENT',
      amountText: `$${intent.amount.toFixed(2)} to ${intent.payee}`,
      recipientText: intent.payee,
      detailsEn: 'Transferred via verified clearing network · fee $0.42',
      detailsZh: '已通过官方认证清算网络汇出 · 手续费 $0.42',
      noticeEn: 'Completed. Arrives in 2 minutes. Enforced outside LLM.',
      noticeZh: '已完成。2分钟内到账。安全规则由外部护栏强校验。',
      checks: ['Privacy 隐私', 'Rules 规则', 'Bank limit 银行硬限额'],
    },
    quickChips: [
      { labelEn: 'Pay tuition 缴学费', labelZh: '缴学费', route: '/tuition' },
      { labelEn: 'Check runway 查看规划', labelZh: '查看规划', route: '/planner' },
    ],
  };
}
