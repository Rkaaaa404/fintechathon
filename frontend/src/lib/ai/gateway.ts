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
  const message: ChatMessage = {
    id: `msg-${now.getTime()}`,
    role: 'assistant',
    textEn: '',
    textZh: '',
    timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    ai: envelope.ai,
  };

  switch (response.type) {
    case 'slip': {
      if (response.status !== 'COMPLETED' || response.stamp !== 'SENT' || !response.tx_id?.trim()) {
        throw new Error('Bank execution was not confirmed. Check the ledger before sending again.');
      }
      const amount = `USD ${response.amount_usd.toFixed(2)}`;
      const balance = `USD ${response.remaining_balance_usd.toFixed(2)}`;
      message.textEn = `Bank sandbox confirmed ${amount} to ${response.payee_name}.`;
      message.textZh = `银行沙盒已确认向 ${response.payee_name} 汇出 ${amount}。`;
      message.receiptSlip = {
        status: response.stamp,
        amountText: amount,
        recipientText: response.payee_name,
        detailsEn: `${response.received_text} · Transaction: ${response.tx_id}`,
        detailsZh: `${response.received_text} · 交易编号：${response.tx_id}`,
        noticeEn: `${response.note} Remaining balance: ${balance}.`,
        noticeZh: `${response.note} 剩余余额：${balance}。`,
        checks: [
          `Privacy filter 隐私过滤: ${response.checks.privacy_filter}`,
          `Spending rules 支出规则: ${response.checks.spending_rules}`,
          `Bank token 银行令牌: ${response.checks.bank_token}`,
        ],
      };
      message.quickChips = [
        { labelEn: 'Pay tuition', labelZh: '缴学费', route: '/tuition' },
        { labelEn: 'Send $600', labelZh: '汇款 $600', action: 'prompt-send-3000' },
        { labelEn: 'Try injection prompt', labelZh: '尝试注入指令', action: 'prompt-attack' },
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
      message.textEn = `${response.message} Resend the complete payment instruction; chat history is not used.`;
      message.textZh = `${response.message} 请重新发送完整的付款指令；系统不会使用聊天历史。`;
      return message;
    case 'info_note':
      message.textEn = response.message;
      message.textZh = response.message;
      return message;
    case 'execution_error':
      message.textEn = `${response.code}: ${response.message}`;
      message.textZh = `${response.code}: ${response.message}`;
      return message;
    default:
      throw new Error('Unexpected agent response from server.');
  }
}
