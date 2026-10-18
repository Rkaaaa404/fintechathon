'use client';

import React, { useState } from 'react';
import { ChopMascot } from '@/components/art/ChopMascot';
import { HeaderArt } from '@/components/art/HeaderArt';
import { SEED_DATA, TuitionMode } from '@/lib/mockData';
import { t, b } from '@/lib/i18n';
import { AppRoute, Locale } from '@/types';

interface TuitionScreenProps {
  locale: Locale;
  onNavigate: (route: AppRoute) => void;
  onSelectPlan: (mode: TuitionMode) => void;
}

export const TuitionScreen: React.FC<TuitionScreenProps> = ({
  locale,
  onNavigate,
  onSelectPlan,
}) => {
  const tuition = SEED_DATA.tuition;
  const [currentMode, setCurrentMode] = useState<'fastest' | 'cheapest' | 'balanced'>('cheapest');
  const modeData = tuition.modes[currentMode];

  const handleReview = () => {
    onSelectPlan(modeData);
    onNavigate('/approve');
  };

  return (
    <div className="tuition-screen pb-16">
      {/* ═══════════ BLUE HEADER (176px) ═══════════ */}
      <header className="screen-header-blue tuition-header relative overflow-hidden">
        <HeaderArt screenType="tuition" />

        <div className="header-content relative z-10">
          <div className="header-topbar flex items-center justify-between mb-2">
            <div className="brand-row flex items-center gap-1.5">
              <button
                className="nav-back-btn p-1 text-white hover:text-white/80 transition-colors"
                onClick={() => onNavigate('/')}
                aria-label="Back to home"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <h1 className="brand-title text-white font-bold text-[18px]">
                {b('tuition_header_title', 'tuition_header_sub', locale)}
              </h1>
            </div>

            <div className="mascot-header-cluster">
              <ChopMascot
                bodyColor="#FFFFFF"
                faceColor="#DCE8FD"
                expression="guard"
                size={52}
              />
            </div>
          </div>

          <div className="tuition-header-due text-[#E6EEFF] text-[12px] opacity-80 mb-0.5">
            {b('tuition_due_label', 'tuition_due_sub', locale)}
          </div>

          <div className="tuition-header-big-amount text-white text-[32px] font-bold font-mono tracking-tight mb-1">
            ¥{tuition.dueAmountCny.toLocaleString()}
          </div>

          <div className="tuition-header-subdue text-[#9DB8FF] text-[12px]">
            {b('tuition_due_bursar', 'tuition_due_bursar_sub', locale)}
          </div>
        </div>
      </header>

      {/* ═══════════ SCREEN BODY ═══════════ */}
      <main className="screen-body px-4 pt-4">
        {/* Tuition Calculation Card */}
        <div className="tuition-card bg-white rounded-[18px] p-4 border border-[#E6ECF8] shadow-sm text-left">
          {/* Segmented Control: Fastest / Cheapest / Balanced */}
          <div className="segmented-control grid grid-cols-3 gap-1.5 bg-[#F4F7FE] p-1 rounded-[14px] mb-4 border border-[#E6ECF8]">
            <button
              className={`seg-btn py-2 px-1 rounded-[10px] text-center transition-all ${
                currentMode === 'fastest'
                  ? 'bg-[#3D6BEA] text-white shadow-sm'
                  : 'text-[#14213D] hover:bg-[#E6EEFF]'
              }`}
              onClick={() => setCurrentMode('fastest')}
            >
              <div className="font-semibold text-[12px]">{t('tab_fastest', locale)}</div>
              <div className="text-[10px] opacity-80">{t('tab_fastest_sub', locale)}</div>
            </button>

            <button
              className={`seg-btn py-2 px-1 rounded-[10px] text-center transition-all ${
                currentMode === 'cheapest'
                  ? 'bg-[#3D6BEA] text-white shadow-sm'
                  : 'text-[#14213D] hover:bg-[#E6EEFF]'
              }`}
              onClick={() => setCurrentMode('cheapest')}
            >
              <div className="font-semibold text-[12px]">{t('tab_cheapest', locale)}</div>
              <div className="text-[10px] opacity-80">{t('tab_cheapest_sub', locale)}</div>
            </button>

            <button
              className={`seg-btn py-2 px-1 rounded-[10px] text-center transition-all ${
                currentMode === 'balanced'
                  ? 'bg-[#3D6BEA] text-white shadow-sm'
                  : 'text-[#14213D] hover:bg-[#E6EEFF]'
              }`}
              onClick={() => setCurrentMode('balanced')}
            >
              <div className="font-semibold text-[12px]">{t('tab_balanced', locale)}</div>
              <div className="text-[10px] opacity-80">{t('tab_balanced_sub', locale)}</div>
            </button>
          </div>

          {/* Breakdown Rows */}
          <div className="space-y-2.5 py-1 text-[13px]">
            <div className="breakdown-row flex items-center justify-between pb-2 border-b border-[#E6ECF8]">
              <span className="breakdown-label text-[#5B6B8C]">
                {b('breakdown_tuition_cost', 'breakdown_tuition_cost_sub', locale)}
              </span>
              <span className="breakdown-val font-semibold text-[#14213D] font-mono">
                ¥{tuition.dueAmountCny.toLocaleString()} (~${modeData.baseAmount.toFixed(2)})
              </span>
            </div>

            <div className="breakdown-row flex items-center justify-between pb-2 border-b border-[#E6ECF8]">
              <span className="breakdown-label text-[#5B6B8C]">
                {b('breakdown_fx_rate', 'breakdown_fx_rate_sub', locale)}
              </span>
              <span className="breakdown-val font-semibold text-[#14213D] font-mono">
                {modeData.rate.toFixed(2)} USD/CNY
              </span>
            </div>

            <div className="breakdown-row flex items-center justify-between pb-2 border-b border-[#E6ECF8]">
              <span className="breakdown-label text-[#5B6B8C]">
                {b('breakdown_route_fee', 'breakdown_route_fee_sub', locale)}
              </span>
              <span className="breakdown-val font-semibold text-[#14213D] font-mono">
                ${modeData.fee.toFixed(2)} ({modeData.etaEn})
              </span>
            </div>

            <div className="breakdown-row flex items-center justify-between pb-2 border-b border-[#E6ECF8]">
              <span className="breakdown-label text-[#5B6B8C]">
                {b('breakdown_bank_buffer', 'breakdown_bank_buffer_sub', locale)}
              </span>
              <span className="breakdown-val font-semibold text-[#1E9E6A] font-mono">
                +${modeData.buffer.toFixed(2)}
              </span>
            </div>

            <div className="breakdown-row flex items-center justify-between pt-1">
              <span className="breakdown-label font-bold text-[#14213D]">
                {b('breakdown_you_pay', 'breakdown_you_pay_sub', locale)}
              </span>
              <span className="breakdown-val text-[18px] font-bold text-[#3D6BEA] font-mono">
                ${modeData.total.toFixed(2)} USD
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            className="w-full mt-4 bg-[#3D6BEA] text-white py-3 rounded-[27px] font-bold text-[14px] shadow-sm hover:bg-[#1F3FA8] transition-all flex flex-col items-center justify-center"
            onClick={handleReview}
          >
            <span>{t('btn_review_transfer', locale)}</span>
            <span className="text-[11px] font-normal opacity-85">{t('btn_review_transfer_sub', locale)}</span>
          </button>
        </div>

        {/* Disclaimer Card */}
        <div className="mt-3 p-3 bg-[#F4F7FE] border border-[#E6ECF8] rounded-[14px] text-[11px] text-[#5B6B8C] text-center">
          {b('tuition_disclaimer', 'tuition_disclaimer_sub', locale)}
        </div>
      </main>
    </div>
  );
};
