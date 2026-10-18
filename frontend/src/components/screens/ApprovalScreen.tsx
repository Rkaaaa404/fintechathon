'use client';

import React, { useState } from 'react';
import { ChopMascot } from '@/components/art/ChopMascot';
import { HeaderArt } from '@/components/art/HeaderArt';
import { RubberStamp } from '@/components/art/RubberStamp';
import { SEED_DATA, TuitionMode } from '@/lib/mockData';
import { t, b } from '@/lib/i18n';
import { AppRoute, Locale } from '@/types';

interface ApprovalScreenProps {
  locale: Locale;
  onNavigate: (route: AppRoute) => void;
  selectedPlan?: TuitionMode | null;
  forceSuccessState?: boolean;
}

export const ApprovalScreen: React.FC<ApprovalScreenProps> = ({
  locale,
  onNavigate,
  selectedPlan,
  forceSuccessState = false,
}) => {
  const defaultPlan = SEED_DATA.currentApprovalPlan;
  const [isApproving, setIsApproving] = useState(false);
  const [isCompleted, setIsCompleted] = useState(forceSuccessState);

  const sendAmount = selectedPlan ? selectedPlan.total : defaultPlan.sendAmount;
  const feeWithBuffer = selectedPlan ? selectedPlan.fee + selectedPlan.buffer : defaultPlan.feeWithBuffer;
  const etaText = selectedPlan ? selectedPlan.etaEn : defaultPlan.etaTextEn;

  const handleApprove = () => {
    setIsApproving(true);
    setTimeout(() => {
      setIsApproving(false);
      setIsCompleted(true);
    }, 900);
  };

  return (
    <div className="approval-screen-container pb-20">
      {/* ═══════════ BLUE HEADER (226px) ═══════════ */}
      <header className="approval-blue-header screen-header-blue relative overflow-hidden">
        <HeaderArt screenType="approval" />

        <div className="header-content relative z-10 text-center">
          <div className="flex justify-center mb-1">
            <ChopMascot
              bodyColor="#FFFFFF"
              faceColor="#DCE8FD"
              expression={isCompleted ? 'wave' : 'guard'}
              size={54}
              showShield={!isCompleted}
            />
          </div>

          <h1 className="approval-header-title text-white font-bold text-[18px] mb-0.5">
            {isCompleted
              ? (locale === 'zh' ? '汇款已成功执行' : 'Payment Executed')
              : b('approval_title', 'approval_sub', locale)}
          </h1>

          <div className="approval-header-reason text-[#E6EEFF] text-[12px] opacity-90 mb-3 px-2">
            {locale === 'zh' ? defaultPlan.reasonZh : defaultPlan.reasonEn}
          </div>

          {/* 4-step Stepper */}
          <div className="stepper-container flex items-center justify-between px-3 relative">
            <div className="stepper-progress-line absolute left-6 right-6 top-3 h-[2px] bg-[#9DB8FF]/40 -z-0">
              <div
                className="stepper-progress-fill h-full bg-[#3D6BEA] transition-all duration-500"
                style={{ width: isCompleted ? '100%' : '66%' }}
              />
            </div>

            {/* Step 1: Requested */}
            <div className="step-node done flex flex-col items-center z-10">
              <div className="step-dot w-3.5 h-3.5 rounded-full bg-[#1E9E6A] border-2 border-white mb-1" />
              <span className="text-[10px] text-white font-medium">
                {b('step_requested', 'step_requested_sub', locale)}
              </span>
            </div>

            {/* Step 2: Understood */}
            <div className="step-node done flex flex-col items-center z-10">
              <div className="step-dot w-3.5 h-3.5 rounded-full bg-[#1E9E6A] border-2 border-white mb-1" />
              <span className="text-[10px] text-white font-medium">
                {b('step_understood', 'step_understood_sub', locale)}
              </span>
            </div>

            {/* Step 3: Approve */}
            <div className="step-node active flex flex-col items-center z-10">
              <div
                className={`step-dot w-3.5 h-3.5 rounded-full border-2 border-white mb-1 ${
                  isCompleted ? 'bg-[#1E9E6A]' : 'bg-[#F5A524]'
                }`}
              />
              <span className="text-[10px] text-white font-bold bg-[#1F3FA8] px-2 py-0.5 rounded-full">
                {b('step_approve', 'step_approve_sub', locale)}
              </span>
            </div>

            {/* Step 4: Sent */}
            <div className="step-node flex flex-col items-center z-10">
              <div
                className={`step-dot w-3.5 h-3.5 rounded-full border-2 border-white mb-1 ${
                  isCompleted ? 'bg-[#1E9E6A]' : 'bg-white/50'
                }`}
              />
              <span className="text-[10px] text-white font-medium">
                {b('step_sent', 'step_sent_sub', locale)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════ APPROVAL WHITE SHEET BODY ═══════════ */}
      <main className="approval-sheet-body bg-white rounded-t-[26px] -mt-4 relative z-20 p-4 shadow-[0_-8px_32px_rgba(10,20,64,0.12)] text-left min-h-[440px]">
        {/* Success Slip if Completed */}
        {isCompleted ? (
          <div className="payment-sent-slip border-2 border-[#1E9E6A]/30 bg-[#E3F6EE]/30 rounded-[18px] p-4 relative mb-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[11px] font-bold text-[#1E9E6A] uppercase tracking-wider block">
                  {locale === 'zh' ? '模拟银行执行回执' : 'Bank Execution Receipt'}
                </span>
                <span className="text-[13px] font-mono font-bold text-[#14213D]">
                  TX-SIM-928A4F10BC29
                </span>
              </div>
              <RubberStamp type="SENT" textEn="SENT" textZh="已汇出" rotated={true} />
            </div>

            <div className="space-y-1.5 text-[12px] text-[#14213D] border-t border-[#1E9E6A]/20 pt-2 mb-3">
              <div className="flex justify-between">
                <span className="text-[#5B6B8C]">{locale === 'zh' ? '汇出总额' : 'Total Debited'}:</span>
                <span className="font-bold font-mono">${sendAmount.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5B6B8C]">{locale === 'zh' ? '收款机构' : 'Payee'}:</span>
                <span className="font-semibold">{defaultPlan.payee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5B6B8C]">{locale === 'zh' ? '意图校验' : 'Intent Hash Match'}:</span>
                <span className="text-[#1E9E6A] font-mono font-bold">VERIFIED ✓</span>
              </div>
            </div>

            <button
              className="w-full bg-[#1E9E6A] text-white py-2.5 rounded-[27px] font-bold text-[13px] shadow-sm hover:bg-[#168156] transition-all"
              onClick={() => onNavigate('/')}
            >
              {locale === 'zh' ? '返回首页' : 'Return to Home'}
            </button>
          </div>
        ) : (
          <>
            {/* Dual Comparison Cards */}
            <div className="comparison-cards-grid grid grid-cols-2 gap-2 mb-3">
              {/* Left: You asked */}
              <div className="comp-card bg-[#F4F7FE] p-2.5 rounded-[12px] border border-[#E6ECF8]">
                <div className="comp-card-label text-[11px] font-bold text-[#5B6B8C] mb-1">
                  {b('card_you_asked', 'card_you_asked_sub', locale)}
                </div>
                <div className="comp-card-val text-[12px] text-[#14213D] italic">
                  &ldquo;{defaultPlan.requestedTextEn}&rdquo;
                </div>
              </div>

              {/* Right: I understood */}
              <div className="comp-card bg-[#E6EEFF] p-2.5 rounded-[12px] border border-[#9DB8FF]/40">
                <div className="comp-card-label text-[11px] font-bold text-[#1F3FA8] mb-1">
                  {b('card_i_understood', 'card_i_understood_sub', locale)}
                </div>
                <div className="comp-card-val text-[11.5px] text-[#14213D] font-medium leading-tight">
                  {locale === 'zh' ? defaultPlan.understoodTextZh : defaultPlan.understoodTextEn}
                </div>
              </div>
            </div>

            {/* Big Amount Display */}
            <div className="approval-amount-center text-center my-3">
              <div className="approval-amount-label text-[12px] text-[#5B6B8C] mb-0.5">
                {b('approval_send_label', 'approval_send_sub', locale)}
              </div>
              <div className="approval-big-dollars text-[34px] font-bold text-[#14213D] font-mono tracking-tight">
                ${sendAmount.toFixed(2)}
              </div>
            </div>

            {/* Changed Yellow Notice Box */}
            <div className="changed-notice-box bg-[#FFF4DC] border border-[#F5A524] rounded-[12px] p-2.5 flex items-center justify-between mb-3 text-[12px]">
              <div className="changed-notice-text text-[#B7791F]">
                <strong>{b('changed_label', 'changed_label_sub', locale)}:</strong> currency assumed USD (币种默认美元)
              </div>
              <span className="changed-edit-link text-[#3D6BEA] font-semibold cursor-pointer underline ml-2">
                {b('edit_action', 'edit_action_sub', locale)}
              </span>
            </div>

            {/* Rows Details */}
            <div className="space-y-2 py-1 text-[13px] border-b border-[#E6ECF8] pb-3 mb-3">
              <div className="breakdown-row flex justify-between">
                <span className="text-[#5B6B8C]">{b('receives_label', 'receives_sub', locale)}</span>
                <span className="font-semibold text-[#14213D] font-mono">¥{defaultPlan.receivesAmount.toLocaleString()} CNY</span>
              </div>
              <div className="breakdown-row flex justify-between">
                <span className="text-[#5B6B8C]">{b('rate_simulated', 'rate_simulated_sub', locale)}</span>
                <span className="font-semibold text-[#14213D] font-mono">{defaultPlan.rate.toFixed(2)} {defaultPlan.ratePair}</span>
              </div>
              <div className="breakdown-row flex justify-between">
                <span className="text-[#5B6B8C]">{b('fee_and_buffer', 'fee_and_buffer_sub', locale)}</span>
                <span className="font-semibold text-[#14213D] font-mono">${feeWithBuffer.toFixed(2)}</span>
              </div>
              <div className="breakdown-row flex justify-between">
                <span className="text-[#5B6B8C]">{b('arrives_label', 'arrives_sub', locale)}</span>
                <span className="font-semibold text-[#1E9E6A]">{etaText}</span>
              </div>
            </div>

            {/* Locked Intent Binding Row */}
            <div className="intent-lock-row bg-[#F4F7FE] p-2.5 rounded-[12px] border border-[#E6ECF8] flex items-center gap-2 mb-4 text-[11.5px] text-[#5B6B8C]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D6BEA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <div>
                <span>{b('locked_binding', 'locked_binding_sub', locale)}: </span>
                <span className="intent-hash-mono font-mono font-bold text-[#1F3FA8]">
                  {defaultPlan.intentHash} (simulated)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                className="w-1/3 py-3 rounded-[27px] font-semibold text-[13px] bg-[#F4F7FE] text-[#5B6B8C] border border-[#E6ECF8] hover:text-[#14213D] transition-all"
                onClick={() => onNavigate('/tuition')}
              >
                {b('btn_cancel', 'btn_cancel_sub', locale)}
              </button>

              <button
                className="w-2/3 bg-[#3D6BEA] text-white py-3 rounded-[27px] font-bold text-[13px] shadow-sm hover:bg-[#1F3FA8] transition-all flex flex-col items-center justify-center disabled:opacity-50"
                onClick={handleApprove}
                disabled={isApproving}
              >
                {isApproving ? (
                  <span>Verifying Passkey...</span>
                ) : (
                  <>
                    <span>{t('btn_approve_passkey', locale)}</span>
                    <span className="text-[10px] font-normal opacity-85">
                      {t('btn_approve_passkey_sub', locale)}
                    </span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
