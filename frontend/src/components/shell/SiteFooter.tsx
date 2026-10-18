'use client';

import React from 'react';
import { Locale } from '@/types';

interface SiteFooterProps {
  locale: Locale;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ locale }) => {
  return (
    <footer className="site-footer" id="site-footer" role="contentinfo">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-md bg-[#3D6BEA] text-white flex items-center justify-center font-bold text-[11px]">
              A
            </div>
            <span className="font-bold text-[14px] text-[#14213D]">AegisPath</span>
            <span className="pill-testnet text-[10px]">Testnet 演示网</span>
          </div>
          <p className="text-[11.5px] text-[#5B6B8C] max-w-[340px] leading-relaxed">
            {locale === 'zh'
              ? '面向国际留学生的 AI 智能体数字钱包，在模型外层强制执行三环确定性安全与限额策略。'
              : 'Cross-border AI agent digital wallet for international students with deterministic safety enforced outside the LLM.'}
          </p>
        </div>

        <div className="site-footer-links flex items-center gap-6 text-[12px] text-[#5B6B8C]">
          <span className="flex items-center gap-1.5 text-[#1E9E6A] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E9E6A]"></span>
            {locale === 'zh' ? '三环安全已激活' : 'Three Rings Active'}
          </span>
          <span className="text-[#E6ECF8]">|</span>
          <span>{locale === 'zh' ? '隐私过滤网关 (Presidio)' : 'Privacy Gateway (Presidio)'}</span>
          <span className="text-[#E6ECF8]">|</span>
          <span>{locale === 'zh' ? '银行沙盒接口' : 'Bank Gateway (Port 8100)'}</span>
          <span className="text-[#E6ECF8]">|</span>
          <span className="text-[#9DB8FF]">© 2026 AegisPath</span>
        </div>
      </div>
    </footer>
  );
};
