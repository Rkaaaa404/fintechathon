'use client';

import React from 'react';

interface PayeesMascotCounterProps {
  className?: string;
}

export const PayeesMascotCounter: React.FC<PayeesMascotCounterProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-full max-w-[280px] sm:max-w-[340px] h-[115px] sm:h-[135px] ${className}`}>
      <svg
        viewBox="0 0 340 135"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
        role="img"
        aria-label="Mascot Chop Paying at Counter Animation"
      >
        <defs>
          <style>{`
            @keyframes chopWalkApproach {
              0%, 100% { transform: translate(18px, 24px); }
              45% { transform: translate(72px, 22px); }
              55% { transform: translate(72px, 22px); }
              90% { transform: translate(18px, 24px); }
            }
            @keyframes chopFootStep {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-3px); }
            }
            @keyframes tapCardAction {
              0%, 35% { transform: rotate(0deg) translate(0, 0); }
              45%, 65% { transform: rotate(-8deg) translate(8px, -2px); }
              75%, 100% { transform: rotate(0deg) translate(0, 0); }
            }
            @keyframes posBeepWave {
              0%, 40% { opacity: 0; transform: scale(0.6); }
              48% { opacity: 1; transform: scale(1.1); }
              60% { opacity: 0; transform: scale(1.6); }
              100% { opacity: 0; }
            }
            @keyframes receiptSlide {
              0%, 45% { transform: translate(218px, 78px) scale(0.85); opacity: 0; }
              55% { opacity: 1; }
              75% { transform: translate(192px, 78px) scale(1); opacity: 1; }
              90%, 100% { transform: translate(180px, 78px) scale(0.9); opacity: 0; }
            }
            @keyframes verifiedBadgeBounce {
              0%, 45% { transform: scale(0.7) translateY(0); opacity: 0.4; }
              52% { transform: scale(1.15) translateY(-4px); opacity: 1; }
              68% { transform: scale(1) translateY(0); opacity: 1; }
              90%, 100% { transform: scale(0.8); opacity: 0.5; }
            }
            @keyframes coinSparkle {
              0%, 100% { transform: translateY(0) rotate(0); opacity: 0.7; }
              50% { transform: translateY(-5px) rotate(15deg); opacity: 1; }
            }
            .chop-walker {
              animation: chopWalkApproach 4.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
            }
            .feet-step-1 {
              animation: chopFootStep 0.4s ease-in-out infinite;
            }
            .feet-step-2 {
              animation: chopFootStep 0.4s ease-in-out infinite 0.2s;
            }
            .arm-card-tap {
              transform-origin: 34px 22px;
              animation: tapCardAction 4.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }
            .pos-wave {
              transform-origin: 215px 70px;
              animation: posBeepWave 4.8s ease-out infinite;
            }
            .sliding-receipt {
              animation: receiptSlide 4.8s cubic-bezier(0.2, 0.9, 0.3, 1) infinite;
            }
            .verified-badge {
              transform-origin: 275px 44px;
              animation: verifiedBadgeBounce 4.8s ease-in-out infinite;
            }
            .sparkle-coin {
              animation: coinSparkle 3s ease-in-out infinite;
            }
          `}</style>

          <linearGradient id="counterDeskWood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          <linearGradient id="counterBase" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          <linearGradient id="glassReflection" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* Ambient Glow */}
        <ellipse cx="230" cy="75" rx="80" ry="45" fill="#60A5FA" fillOpacity="0.18" />

        {/* ── TELLER / CASHIER COUNTER WINDOW ── */}
        <g id="teller-counter">
          {/* Glass Partition */}
          <rect x="200" y="18" width="110" height="66" rx="8" fill="url(#glassReflection)" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.7" />
          {/* Glass Speak-Through Slit */}
          <path d="M 235 84 Q 255 68 275 84" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
          {/* Vertical Partition divider */}
          <line x1="255" y1="18" x2="255" y2="84" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.4" />

          {/* Signboard on Top */}
          <rect x="208" y="10" width="94" height="15" rx="4" fill="#047857" stroke="#A7F3D0" strokeWidth="1" />
          <text x="255" y="21" fill="#FFFFFF" fontSize="7.5" fontWeight="bold" textAnchor="middle" letterSpacing="0.05em">
            PAYMENT COUNTER
          </text>

          {/* Whitelist Approved Badge on glass */}
          <g className="verified-badge" transform="translate(0, 0)">
            <circle cx="275" cy="44" r="14" fill="#ECFDF5" stroke="#059669" strokeWidth="1.8" />
            <path d="M 269 44 L 273 48 L 282 39" stroke="#059669" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <text x="275" y="54" fill="#065F46" fontSize="5.5" fontWeight="bold" textAnchor="middle">
              WHITELIST
            </text>
          </g>

          {/* Counter Desk Surface */}
          <rect x="180" y="84" width="145" height="14" rx="3" fill="url(#counterDeskWood)" stroke="#CBD5E1" strokeWidth="1.5" />
          {/* Counter Front Panel */}
          <rect x="188" y="98" width="130" height="32" rx="3" fill="url(#counterBase)" stroke="#475569" strokeWidth="1" />
          {/* Decorative Panel Inset */}
          <rect x="196" y="104" width="114" height="20" rx="2" fill="#1E293B" stroke="#334155" strokeWidth="0.8" opacity="0.6" />

          {/* POS Terminal / Card Reader on Counter */}
          <g transform="translate(202, 68)">
            <rect x="0" y="0" width="18" height="16" rx="3" fill="#1E293B" stroke="#64748B" strokeWidth="1" />
            {/* Display screen */}
            <rect x="2.5" y="2.5" width="13" height="6" rx="1" fill="#0F172A" />
            {/* Green Accepted LED */}
            <circle cx="13" cy="5.5" r="1.2" fill="#10B981" />
            {/* Keypad */}
            <circle cx="5" cy="11" r="0.8" fill="#94A3B8" />
            <circle cx="9" cy="11" r="0.8" fill="#94A3B8" />
            <circle cx="13" cy="11" r="0.8" fill="#94A3B8" />
            <circle cx="5" cy="13.5" r="0.8" fill="#94A3B8" />
            <circle cx="9" cy="13.5" r="0.8" fill="#94A3B8" />
            <circle cx="13" cy="13.5" r="0.8" fill="#94A3B8" />
          </g>

          {/* Contactless Signal Wave (animates when card taps) */}
          <g className="pos-wave">
            <circle cx="211" cy="70" r="10" stroke="#34D399" strokeWidth="2" strokeDasharray="3 3" fill="none" />
            <circle cx="211" cy="70" r="16" stroke="#10B981" strokeWidth="1.5" opacity="0.6" fill="none" />
          </g>
        </g>

        {/* Sliding Receipt Slip Paper */}
        <g className="sliding-receipt">
          <rect x="0" y="0" width="22" height="13" rx="2" fill="#FEF9C3" stroke="#F59E0B" strokeWidth="1" />
          <line x1="3" y1="4" x2="19" y2="4" stroke="#B45309" strokeWidth="1" />
          <line x1="3" y1="7" x2="15" y2="7" stroke="#B45309" strokeWidth="0.8" />
          <line x1="3" y1="10" x2="11" y2="10" stroke="#059669" strokeWidth="0.8" />
        </g>

        {/* ── MASCOT CHOP WALKING & PAYING ── */}
        <g className="chop-walker">
          {/* Teapot Handle */}
          <path d="M 6 22 C -4 22, -4 38, 6 38" stroke="#1E40AF" strokeWidth="2.6" fill="none" strokeLinecap="round" />

          {/* Teapot Body */}
          <rect x="6" y="10" width="44" height="44" rx="14" fill="#FFFFFF" stroke="#1E40AF" strokeWidth="2" />

          {/* Golden Lid Knob */}
          <rect x="22" y="4" width="12" height="7" rx="3" fill="#F59E0B" />

          {/* Screen Face */}
          <rect x="12" y="18" width="32" height="26" rx="8" fill="#DBEAFE" />

          {/* Rosy Cheeks */}
          <circle cx="17" cy="34" r="2.4" fill="#F59E0B" opacity="0.85" />
          <circle cx="39" cy="34" r="2.4" fill="#F59E0B" opacity="0.85" />

          {/* Happy Eyes */}
          <circle cx="21" cy="28" r="3" fill="#0F172A" />
          <circle cx="22.2" cy="26.8" r="1" fill="#FFFFFF" />
          <circle cx="35" cy="28" r="3" fill="#0F172A" />
          <circle cx="36.2" cy="26.8" r="1" fill="#FFFFFF" />

          {/* Happy Smile */}
          <path d="M 24 35 Q 28 39 32 35" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Left Hand at side */}
          <path d="M 6 30 Q 0 35 4 42" stroke="#1E40AF" strokeWidth="2.6" strokeLinecap="round" fill="none" />

          {/* Right Arm Extending Forward Holding Payment Card */}
          <g className="arm-card-tap">
            {/* Extended Arm */}
            <path d="M 44 26 Q 58 20 68 28" stroke="#1E40AF" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Bank Card */}
            <g transform="translate(64, 20) rotate(-12)">
              <rect x="0" y="0" width="22" height="14" rx="2.5" fill="url(#cardGrad)" stroke="#FFFFFF" strokeWidth="1" />
              {/* EMV Chip */}
              <rect x="3" y="4" width="5" height="4" rx="0.8" fill="#FDE047" stroke="#CA8A04" strokeWidth="0.5" />
              {/* Card brand line */}
              <line x1="3" y1="10" x2="16" y2="10" stroke="#93C5FD" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
            </g>
          </g>

          {/* Feet with Alternating Walking Animation */}
          <circle className="feet-step-1" cx="19" cy="57" r="4" fill="#1E40AF" />
          <circle className="feet-step-2" cx="37" cy="57" r="4" fill="#1E40AF" />
        </g>

        {/* Floating Sparkle Stars */}
        <g className="sparkle-coin" transform="translate(160, 25)">
          <polygon points="0,-4 1,-1 4,0 1,1 0,4 -1,1 -4,0 -1,-1" fill="#FDE047" />
        </g>
        <g className="sparkle-coin" transform="translate(195, 45)" style={{ animationDelay: '1s' }}>
          <polygon points="0,-5 1.5,-1.5 5,0 1.5,1.5 0,5 -1.5,1.5 -5,0 -1.5,-1.5" fill="#60A5FA" />
        </g>
      </svg>
    </div>
  );
};
