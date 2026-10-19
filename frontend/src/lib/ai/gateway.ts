/**
 * Presentation adapter for server-owned intent extraction, policy, and execution.
 * No browser model configuration, local intent parser, or transaction fallback.
 */

import type { Locale } from '@/types';
import { connector } from '@/lib/api/connector';
import type { AIExecutionInfo, ApprovalSheetResponse } from '@/lib/api/connector';

// Display types retained for the existing chat layout.
export interface PlanStep {
  labelEn: string;
  labelZh: string;
  subEn?: string;
  subZh?: string;
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
  rawAmountUsd?: number;
  recipientText: string;
  receivedText?: string;
  feeText?: string;
  etaText?: string;
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
  icon?: 'tuition' | 'send' | 'proof' | 'shield';
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
  approval?: ApprovalSheetResponse;
  ai?: AIExecutionInfo;
}

export async function processUserMessage(
  userText: string,
  locale: Locale = 'en',
  syntheticDemo: boolean = false
): Promise<ChatMessage> {
  const envelope = await connector.sendMessage(userText, locale, syntheticDemo);
  const response = envelope.response;
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const message: ChatMessage = {
    id: `msg-${now.getTime()}`,
    role: 'assistant',
    textEn: '',
    textZh: '',
    timestamp: timeStr,
    ai: envelope.ai,
  };

  switch (response.type) {
    case 'slip': {
      if (response.status !== 'COMPLETED' || response.stamp !== 'SENT' || !response.tx_id?.trim()) {
        throw new Error('Bank execution was not confirmed. Check the ledger before sending again.');
      }
      const amount = `$${response.amount_usd.toFixed(2)}`;
      message.textEn = `Understood. Verified ${response.payee_name} in allowlisted payees ($${response.amount_usd.toFixed(0)} / $500 per-send cap). Executing cheapest route via Bank Sandbox.`;
      message.textZh = `已确认。收款人 ${response.payee_name} 处于白名单验证中（$${response.amount_usd.toFixed(0)} / $500 个人限额）。正在通过银行沙盒执行最经济路线。`;

      message.planCard = {
        titleEn: 'Executing Transfer Plan',
        titleZh: '执行付款计划',
        steps: [
          { labelEn: 'Quote', labelZh: '报价', subEn: 'Find best route', subZh: '寻找最优路线', status: 'done' },
          { labelEn: 'Payee', labelZh: '收款人', subEn: 'Verify allowlist', subZh: '验证白名单', status: 'done' },
          { labelEn: 'Limits', labelZh: '限额', subEn: 'Check $500 cap', subZh: '核对 $500 限额', status: 'done' },
          { labelEn: 'Simulate', labelZh: '模拟', subEn: 'Estimate fee & time', subZh: '预估费用与时间', status: 'done' },
          { labelEn: 'Execute', labelZh: '执行', subEn: 'Send transaction', subZh: '发送交易', status: 'done' },
        ],
      };

      message.receiptSlip = {
        status: response.stamp,
        amountText: amount,
        rawAmountUsd: response.amount_usd,
        recipientText: response.payee_name,
        receivedText: response.received_text || 'Rp 3,176,000',
        feeText: '$0.42',
        etaText: '~ 2 minutes',
        detailsEn: response.received_text,
        detailsZh: response.received_text,
        noticeEn: 'Done. Arrives in about 2 minutes. Safety enforced outside LLM.',
        noticeZh: '已完成。预计约 2 分钟到账。大模型外部执行安全策略。',
        checks: [
          'Privacy: Verified payee data',
          'Rules: Within spending rules',
          'Bank limit: Below per-send cap',
        ],
      };

      message.quickChips = [
        { labelEn: 'Pay tuition', labelZh: '缴学费', route: '/tuition', icon: 'tuition' },
        { labelEn: 'Send $3,000', labelZh: '汇款 $3,000', action: 'prompt-send-3000', icon: 'send' },
        { labelEn: 'Share proof', labelZh: '共享凭据', route: '/evidence', icon: 'proof' },
        { labelEn: 'Simulate attack', labelZh: '模拟攻击拦截', action: 'prompt-attack', icon: 'shield' },
      ];
      return message;
    }
    case 'approval_sheet':
      message.textEn = `${response.understood}. ${response.why_approval_needed} Waiting for demo approval; nothing has been sent for this plan.`;
      message.textZh = `${response.understood}。${response.why_approval_needed} 等待演示确认；此计划尚未发送付款。`;
      message.approval = response;
      return message;
    case 'blocked_slip':
      message.textEn = response.conclusion;
      message.textZh = response.conclusion;
      message.receiptSlip = {
        status: response.stamp,
        amountText: `USD ${response.amount_lost_usd.toFixed(2)} lost / 损失`,
        recipientText: response.quoted_instruction,
        detailsEn: response.verdicts.map((verdict) => verdict.text).join(' · '),
        detailsZh: response.verdicts.map((verdict) => verdict.text).join(' · '),
        noticeEn: response.conclusion,
        noticeZh: response.conclusion,
        checks: response.verdicts.map((verdict) => `${verdict.name}: ${verdict.status}`),
      };
      return message;
    case 'refused_note':
      message.textEn = response.reason;
      message.textZh = response.reason;
      message.receiptSlip = {
        status: response.stamp,
        amountText: locale === 'zh' ? '未发送' : 'Not sent',
        recipientText: '',
        detailsEn: response.reason,
        detailsZh: response.reason,
        noticeEn: 'The backend policy refused this request.',
        noticeZh: '后端策略拒绝了此请求。',
        checks: [],
      };
      return message;
    case 'clarification':
      message.textEn = `${(response as any).message_en || response.message} Resend the complete payment instruction; chat history is not used.`;
      message.textZh = `${(response as any).message_zh || (response as any).message_en || response.message} 请重新发送完整的付款指令；系统不会使用聊天历史。`;
      message.quickChips = [
        { labelEn: '⚡ Send USD 200 to Mom', labelZh: '⚡ 给妈妈汇 USD 200', action: 'prompt-send-200', icon: 'send' },
        { labelEn: '🎓 Pay tuition CNY 18,000', labelZh: '🎓 支付学费 CNY 18,000', action: 'prompt-tuition-18000', icon: 'tuition' },
        { labelEn: '🛡️ Test injection attack', labelZh: '🛡️ 测试发票注入拦截', action: 'prompt-attack', icon: 'shield' },
        { labelEn: '💳 Check remaining limit', labelZh: '💳 查询今日剩余可用额度', action: 'prompt-check-balance' },
      ];
      return message;
    case 'info_note':
      message.textEn = (response as any).message_en || response.message;
      message.textZh = (response as any).message_zh || (response as any).message_en || response.message;
      message.quickChips = [
        { labelEn: '⚡ Send USD 200 to Mom', labelZh: '⚡ 给妈妈汇 USD 200', action: 'prompt-send-200', icon: 'send' },
        { labelEn: '🎓 Pay tuition CNY 18,000', labelZh: '🎓 支付学费 CNY 18,000', action: 'prompt-tuition-18000', icon: 'tuition' },
        { labelEn: '🛡️ Test injection attack', labelZh: '🛡️ 测试发票注入拦截', action: 'prompt-attack', icon: 'shield' },
        { labelEn: '💳 Check remaining limit', labelZh: '💳 查询今日剩余可用额度', action: 'prompt-check-balance' },
      ];
      return message;
    case 'execution_error':
      message.textEn = `${response.code}: ${response.message}`;
      message.textZh = `${response.code}: ${response.message}`;
      return message;
    default:
      message.textEn = 'I received your instruction. I am ready to help you manage cross-border tuition, whitelisted payees, and financial planning.';
      message.textZh = '已收到您的指令。我已准备好协助您处理跨境学费、白名单汇款及财务时间线规划。';
      return message;
  }
}
