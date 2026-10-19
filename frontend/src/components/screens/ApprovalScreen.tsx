'use client';

import React, { useState } from 'react';
import { ChopMascot } from '@/components/art/ChopMascot';
import { HeaderArt } from '@/components/art/HeaderArt';
import { RubberStamp } from '@/components/art/RubberStamp';
import { connector, type ApprovalReceipt, type ApprovalSheetResponse } from '@/lib/api/connector';
import { b } from '@/lib/i18n';
import { AppRoute, Locale } from '@/types';

interface ApprovalScreenProps {
  locale: Locale;
  onNavigate: (route: AppRoute) => void;
  plan: ApprovalSheetResponse | null;
}

export const ApprovalScreen: React.FC<ApprovalScreenProps> = ({ locale, onNavigate, plan }) => {
  const [isApproving, setIsApproving] = useState(false);
  const [receipt, setReceipt] = useState<ApprovalReceipt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const completedReceipt = receipt?.plan_id === plan?.plan_id ? receipt : null;
  const isCompleted = completedReceipt !== null;

  const handleApprove = async () => {
    if (!plan || isApproving || isCompleted) return;
    setIsApproving(true);
    setError(null);
    try {
      const result = await connector.approvePlan(plan.plan_id, plan.intent_hash, 'DEMO_UI_CONSENT_ONLY');
      if (
        result.status !== 'COMPLETED' ||
        typeof result.tx_id !== 'string' ||
        !result.tx_id.trim() ||
        result.plan_id !== plan.plan_id ||
        result.intent_hash !== plan.intent_hash ||
        !Number.isFinite(result.remaining_balance_usd)
      ) {
        throw new Error(locale === 'zh'
          ? '银行执行未确认。再次发送前请检查账本。'
          : 'Bank execution was not confirmed. Check the ledger before sending again.');
      }
      setReceipt(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : (locale === 'zh'
        ? '审批失败。再次发送前请检查账本。'
        : 'Approval failed. Check the ledger before sending again.'));
    } finally {
      setIsApproving(false);
    }
  };

  if (!plan) {
    return (
      <div className="approval-screen-container pb-20">
        <header className="approval-blue-header screen-header-blue relative overflow-hidden">
          <HeaderArt screenType="approval" />
          <div className="header-content relative z-10 text-center">
            <ChopMascot bodyColor="#FFFFFF" faceColor="#DCE8FD" expression="guard" size={54} showShield />
            <h1 className="approval-header-title text-white font-bold text-[18px] mt-3">
              {locale === 'zh' ? '暂无待审批计划' : 'No plan to review'}
            </h1>
          </div>
        </header>
        <main className="approval-sheet-body bg-white rounded-t-[26px] -mt-4 relative z-20 p-4 text-left min-h-[240px]">
          <p className="text-[13px] text-[#5B6B8C] mb-4">
            {locale === 'zh'
              ? '请在聊天中发送完整付款指令。只有后端返回待审批计划后，才能在此审核。'
              : 'Send a complete payment instruction in chat. A backend-issued pending plan is required before you can review it here.'}
          </p>
          <button className="w-full bg-[#3D6BEA] text-white py-3 rounded-[27px] font-bold text-[13px]" onClick={() => onNavigate('/chat')}>
            {locale === 'zh' ? '返回聊天' : 'Back to chat'}
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="approval-screen-container pb-20">
      <header className="approval-blue-header screen-header-blue relative overflow-hidden">
        <HeaderArt screenType="approval" />
        <div className="header-content relative z-10 text-center">
          <div className="flex justify-center mb-1">
            <ChopMascot bodyColor="#FFFFFF" faceColor="#DCE8FD" expression={isCompleted ? 'wave' : 'guard'} size={54} showShield={!isCompleted} />
          </div>
          <h1 className="approval-header-title text-white font-bold text-[18px] mb-0.5">
            {isCompleted ? (locale === 'zh' ? '汇款已执行' : 'Payment Executed') : b('approval_title', 'approval_sub', locale)}
          </h1>
          <div className="approval-header-reason text-[#E6EEFF] text-[12px] opacity-90 mb-3 px-2">
            {isCompleted
              ? (locale === 'zh' ? '银行沙盒已确认执行。' : 'Bank sandbox execution confirmed.')
              : plan.why_approval_needed}
          </div>
          <div className="stepper-container flex items-center justify-between px-3 relative">
            <div className="stepper-progress-line absolute left-6 right-6 top-3 h-[2px] bg-[#9DB8FF]/40 -z-0">
              <div className="stepper-progress-fill h-full bg-[#3D6BEA]" style={{ width: isCompleted ? '100%' : '66%' }} />
            </div>
            <div className="step-node done flex flex-col items-center z-10">
              <div className="step-dot w-3.5 h-3.5 rounded-full bg-[#1E9E6A] border-2 border-white mb-1" />
              <span className="text-[10px] text-white font-medium">{b('step_requested', 'step_requested_sub', locale)}</span>
            </div>
            <div className="step-node done flex flex-col items-center z-10">
              <div className="step-dot w-3.5 h-3.5 rounded-full bg-[#1E9E6A] border-2 border-white mb-1" />
              <span className="text-[10px] text-white font-medium">{b('step_understood', 'step_understood_sub', locale)}</span>
            </div>
            <div className="step-node active flex flex-col items-center z-10">
              <div className={`step-dot w-3.5 h-3.5 rounded-full border-2 border-white mb-1 ${isCompleted ? 'bg-[#1E9E6A]' : 'bg-[#F5A524]'}`} />
              <span className="text-[10px] text-white font-bold bg-[#1F3FA8] px-2 py-0.5 rounded-full">{b('step_approve', 'step_approve_sub', locale)}</span>
            </div>
            <div className="step-node flex flex-col items-center z-10">
              <div className={`step-dot w-3.5 h-3.5 rounded-full border-2 border-white mb-1 ${isCompleted ? 'bg-[#1E9E6A]' : 'bg-white/50'}`} />
              <span className="text-[10px] text-white font-medium">{b('step_sent', 'step_sent_sub', locale)}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="approval-sheet-body bg-white rounded-t-[26px] -mt-4 relative z-20 p-4 shadow-[0_-8px_32px_rgba(10,20,64,0.12)] text-left min-h-[440px]">
        {completedReceipt ? (
          <div className="payment-sent-slip border-2 border-[#1E9E6A]/40 bg-gradient-to-b from-[#E3F6EE]/60 to-[#F0FBF6]/90 rounded-[20px] p-4 relative mb-4 shadow-sm animate-succeed-pop">
            {/* Celebratory Succeed Banner */}
            <div className="flex items-center gap-3 p-3 bg-white/90 border border-[#1E9E6A]/25 rounded-[14px] mb-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#1E9E6A] flex items-center justify-center text-white shrink-0 animate-succeed-glow">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-bold text-[#0E6E43] leading-tight">
                  {locale === 'zh' ? '付款审批已成功执行！' : 'Payment Approved & Executed!'}
                </div>
                <div className="text-[11px] text-[#5B6B8C] mt-0.5">
                  {locale === 'zh' ? '资金已安全划转至收款人' : 'Funds safely routed to payee'}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-start mb-3 gap-2">
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-[#1E9E6A] uppercase tracking-wider block">
                  {locale === 'zh' ? '银行沙盒执行回执' : 'Bank Sandbox Execution Receipt'}
                </span>
                <span className="text-[12.5px] font-mono font-bold text-[#14213D] break-all">{completedReceipt.tx_id}</span>
              </div>
              <RubberStamp type="SENT" textEn="SENT" textZh="已汇出" rotated />
            </div>

            {/* Transfer Amount with Succeed Animation and Compact Size */}
            <div className="bg-white/80 border border-[#1E9E6A]/20 rounded-[12px] p-2.5 my-2.5 text-center">
              <div className="text-[11px] font-semibold text-[#5B6B8C] uppercase tracking-wider mb-0.5">
                {locale === 'zh' ? '汇款金额' : 'Transfer Amount'}
              </div>
              <div className="text-[22px] font-mono font-extrabold text-[#1E9E6A] animate-succeed-pulse tracking-tight">
                ${completedReceipt.amount_usd.toFixed(2)} USD
              </div>
              <div className="text-[12px] font-medium text-[#14213D] mt-0.5">
                {completedReceipt.payee_name}
              </div>
            </div>

            <div className="space-y-1.5 text-[12px] text-[#14213D] border-t border-[#1E9E6A]/20 pt-2 mb-3">
              <div className="flex justify-between gap-2">
                <span className="text-[#5B6B8C]">{locale === 'zh' ? '银行剩余余额' : 'Remaining bank balance'}</span>
                <span className="font-bold font-mono">${completedReceipt.remaining_balance_usd.toFixed(2)} USD</span>
              </div>
              <div className="text-[#5B6B8C] break-all font-mono pt-1 text-[11px]">{completedReceipt.intent_hash}</div>
              <div className="space-y-1 pt-2 text-[11.5px]">
                <div>{locale === 'zh' ? '隐私过滤' : 'Privacy filter'}: <span className="font-semibold text-[#1E9E6A]">{completedReceipt.checks.privacy_filter}</span></div>
                <div>{locale === 'zh' ? '支出规则' : 'Spending rules'}: <span className="font-semibold text-[#1E9E6A]">{completedReceipt.checks.spending_rules}</span></div>
                <div>{locale === 'zh' ? '银行令牌' : 'Bank token'}: <span className="font-semibold text-[#1E9E6A]">{completedReceipt.checks.bank_token}</span></div>
              </div>
            </div>
            <button className="w-full bg-[#1E9E6A] text-white py-2.5 rounded-[27px] font-bold text-[13px] shadow-sm hover:bg-[#168156] transition-all" onClick={() => onNavigate('/')}>
              {locale === 'zh' ? '返回首页' : 'Return to Home'}
            </button>
          </div>
        ) : (
          <>
            <div className="comparison-cards-grid grid grid-cols-2 gap-2 mb-3">
              <div className="comp-card bg-[#F4F7FE] p-2.5 rounded-[12px] border border-[#E6ECF8]">
                <div className="comp-card-label text-[11px] font-bold text-[#5B6B8C] mb-1">{b('card_you_asked', 'card_you_asked_sub', locale)}</div>
                <div className="comp-card-val text-[12px] text-[#14213D] italic break-words">&ldquo;{plan.you_asked}&rdquo;</div>
              </div>
              <div className="comp-card bg-[#E6EEFF] p-2.5 rounded-[12px] border border-[#9DB8FF]/40">
                <div className="comp-card-label text-[11px] font-bold text-[#1F3FA8] mb-1">{b('card_i_understood', 'card_i_understood_sub', locale)}</div>
                <div className="comp-card-val text-[11.5px] text-[#14213D] font-medium leading-tight break-words">{plan.understood}</div>
              </div>
            </div>
            <div className="approval-amount-center text-center my-2.5">
              <div className="approval-amount-label text-[11px] font-bold text-[#5B6B8C] uppercase tracking-wider mb-0.5">
                {locale === 'zh' ? '转账金额（美元）' : 'Transfer amount (USD)'}
              </div>
              <div className="approval-big-dollars text-[24px] font-bold text-[#14213D] font-mono tracking-tight leading-tight my-1">
                ${plan.send_amount_usd.toFixed(2)}
              </div>
              <div className="text-[12.5px] font-semibold text-[#5B6B8C] mt-0.5">{plan.payee_name}</div>
            </div>
            <div className="space-y-2 py-1 text-[13px] border-b border-[#E6ECF8] pb-3 mb-3">
              {plan.receives_cny !== undefined && (
                <div className="breakdown-row flex justify-between gap-2">
                  <span className="text-[#5B6B8C]">{b('receives_label', 'receives_sub', locale)}</span>
                  <span className="font-semibold text-[#14213D] font-mono">¥{plan.receives_cny.toLocaleString()} CNY</span>
                </div>
              )}
              {plan.receives_idr !== undefined && (
                <div className="breakdown-row flex justify-between gap-2">
                  <span className="text-[#5B6B8C]">{b('receives_label', 'receives_sub', locale)}</span>
                  <span className="font-semibold text-[#14213D] font-mono">Rp {plan.receives_idr.toLocaleString()} IDR</span>
                </div>
              )}
              <div className="breakdown-row flex justify-between gap-2">
                <span className="text-[#5B6B8C]">{b('rate_simulated', 'rate_simulated_sub', locale)}</span>
                <span className="font-semibold text-[#14213D] font-mono">{plan.rate} {plan.rate_pair}</span>
              </div>
              <div className="breakdown-row flex justify-between gap-2">
                <span className="text-[#5B6B8C]">{b('fee_and_buffer', 'fee_and_buffer_sub', locale)}</span>
                <span className="font-semibold text-[#14213D] font-mono">${plan.fee_with_buffer_usd.toFixed(2)} USD</span>
              </div>
              <div className="breakdown-row flex justify-between gap-2">
                <span className="text-[#5B6B8C]">{b('arrives_label', 'arrives_sub', locale)}</span>
                <span className="font-semibold text-[#1E9E6A] text-right">{plan.eta}</span>
              </div>
            </div>
            <div className="intent-lock-row bg-[#F4F7FE] p-2.5 rounded-[12px] border border-[#E6ECF8] mb-4 text-[11.5px] text-[#5B6B8C]">
              <div>{b('locked_binding', 'locked_binding_sub', locale)}:</div>
              <div className="intent-hash-mono font-mono font-bold text-[#1F3FA8] break-all">{plan.intent_hash}</div>
              <div className="font-mono break-all mt-1">{plan.plan_id} · {plan.status}</div>
            </div>
            {error && <p role="alert" className="mb-3 p-3 rounded-[12px] bg-[#FFF4DC] text-[#B7791F] text-[12px] break-words">{error}</p>}
            <p className="text-[11px] text-[#5B6B8C] text-center mb-3">
              {locale === 'zh' ? '演示审批 — 非硬件 Passkey 身份认证' : 'Demo approval — not hardware passkey authentication'}
            </p>
            <div className="flex gap-2">
              <button className="w-1/3 py-3 rounded-[27px] font-semibold text-[13px] bg-[#F4F7FE] text-[#5B6B8C] border border-[#E6ECF8] disabled:opacity-50" onClick={() => onNavigate('/chat')} disabled={isApproving}>
                {locale === 'zh' ? '返回聊天' : 'Back to chat'}
              </button>
              <button className="w-2/3 bg-[#3D6BEA] text-white py-3 rounded-[27px] font-bold text-[13px] shadow-sm hover:bg-[#1F3FA8] transition-all disabled:opacity-50" onClick={handleApprove} disabled={isApproving}>
                {isApproving
                  ? (locale === 'zh' ? '正在提交审批…' : 'Submitting approval…')
                  : (locale === 'zh' ? '批准演示付款' : 'Approve demo payment')}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
