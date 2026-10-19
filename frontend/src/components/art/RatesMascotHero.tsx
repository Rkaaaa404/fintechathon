'use client';

import React from 'react';

interface RatesMascotHeroProps {
  rates?: {
    CNY?: number;
    IDR?: number;
    EUR?: number;
  };
  className?: string;
}

export const RatesMascotHero: React.FC<RatesMascotHeroProps> = ({
  rates = {},
  className = '',
}) => {
  const cnyRate = rates.CNY ? rates.CNY.toFixed(4) : '7.2045';
  const idrRate = rates.IDR ? Math.round(rates.IDR).toLocaleString() : '15,880';
  const eurRate = rates.EUR ? rates.EUR.toFixed(4) : '0.8899';

  return (
    <div className={`relative w-full max-w-[280px] sm:max-w-[340px] h-[120px] sm:h-[135px] ${className}`}>
      <svg
        viewBox="0 0 340 135"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
        role="img"
        aria-label="Mascot Chop Juggling Multi-Currencies: Dollar, Rupiah, Yuan, Euro"
      >
        <defs>
          <style>{`
            @keyframes mascotFloatBounce {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              25% { transform: translateY(-4px) rotate(1.5deg); }
              75% { transform: translateY(-2px) rotate(-1.5deg); }
            }
            @keyframes orbitCoinUSD {
              0%, 100% { transform: translate(52px, 22px) scale(0.96); }
              50% { transform: translate(66px, 14px) scale(1.06); }
            }
            @keyframes orbitCoinIDR {
              0%, 100% { transform: translate(242px, 20px) scale(1.06); }
              50% { transform: translate(256px, 32px) scale(0.94); }
            }
            @keyframes orbitCoinCNY {
              0%, 100% { transform: translate(46px, 78px) scale(0.94); }
              50% { transform: translate(62px, 90px) scale(1.06); }
            }
            @keyframes orbitCoinEUR {
              0%, 100% { transform: translate(248px, 80px) scale(1.05); }
              50% { transform: translate(234px, 94px) scale(0.95); }
            }
            @keyframes orbitPathDash {
              0% { stroke-dashoffset: 200; }
              100% { stroke-dashoffset: 0; }
            }
            @keyframes starTwinkleGlow {
              0%, 100% { opacity: 0.3; transform: scale(0.8); }
              50% { opacity: 1; transform: scale(1.2); }
            }
            .chop-center {
              animation: mascotFloatBounce 3.6s ease-in-out infinite;
              transform-origin: 160px 65px;
            }
            .orbit-usd {
              animation: orbitCoinUSD 4s ease-in-out infinite;
            }
            .orbit-idr {
              animation: orbitCoinIDR 4.6s ease-in-out infinite;
            }
            .orbit-cny {
              animation: orbitCoinCNY 4.2s ease-in-out infinite;
            }
            .orbit-eur {
              animation: orbitCoinEUR 4.8s ease-in-out infinite;
            }
            .orbit-track {
              stroke-dasharray: 6 4;
              animation: orbitPathDash 20s linear infinite;
            }
            .twinkle-star {
              animation: starTwinkleGlow 2.5s ease-in-out infinite;
            }
          `}</style>

          {/* Golden Coin Gradient (USD) */}
          <linearGradient id="usdCoinGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="45%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Emerald Coin Gradient (IDR) */}
          <linearGradient id="idrCoinGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Crimson / Amber Coin Gradient (CNY) */}
          <linearGradient id="cnyCoinGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FCA5A5" />
            <stop offset="45%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>

          {/* Cobalt Blue Coin Gradient (EUR) */}
          <linearGradient id="eurCoinGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          <radialGradient id="centerHeroGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Center Glow */}
        <circle cx="160" cy="65" r="70" fill="url(#centerHeroGlow)" />

        {/* Orbit Elliptical Paths */}
        <ellipse
          className="orbit-track"
          cx="160"
          cy="65"
          rx="115"
          ry="44"
          stroke="#93C5FD"
          strokeWidth="1.2"
          strokeOpacity="0.5"
          fill="none"
        />

        {/* ── 1. USD COIN ($) ── */}
        <g className="orbit-usd">
          <circle cx="0" cy="0" r="17" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" filter="drop-shadow(0 2px 5px rgba(245,158,11,0.3))" />
          <circle cx="0" cy="0" r="14" fill="url(#usdCoinGrad)" />
          <text x="0" y="5.5" fill="#FFFFFF" fontSize="15" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            $
          </text>
          {/* Label Chip */}
          <rect x="-24" y="20" width="48" height="13" rx="3.5" fill="#1E293B" fillOpacity="0.9" />
          <text x="0" y="29.5" fill="#FDE047" fontSize="7.5" fontWeight="bold" textAnchor="middle">
            USD Base
          </text>
        </g>

        {/* ── 2. IDR COIN (Rp) ── */}
        <g className="orbit-idr">
          <circle cx="0" cy="0" r="17" fill="#FFFFFF" stroke="#10B981" strokeWidth="2" filter="drop-shadow(0 2px 5px rgba(16,185,129,0.3))" />
          <circle cx="0" cy="0" r="14" fill="url(#idrCoinGrad)" />
          <text x="0" y="4.5" fill="#FFFFFF" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            Rp
          </text>
          {/* Label Chip */}
          <rect x="-28" y="20" width="56" height="13" rx="3.5" fill="#064E3B" fillOpacity="0.9" />
          <text x="0" y="29.5" fill="#6EE7B7" fontSize="7.5" fontWeight="bold" textAnchor="middle">
            Rp {idrRate}
          </text>
        </g>

        {/* ── 3. CNY COIN (¥) ── */}
        <g className="orbit-cny">
          <circle cx="0" cy="0" r="16" fill="#FFFFFF" stroke="#EF4444" strokeWidth="2" filter="drop-shadow(0 2px 5px rgba(239,68,68,0.3))" />
          <circle cx="0" cy="0" r="13" fill="url(#cnyCoinGrad)" />
          <text x="0" y="5" fill="#FFFFFF" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            ¥
          </text>
          {/* Label Chip */}
          <rect x="-24" y="19" width="48" height="13" rx="3.5" fill="#450A0A" fillOpacity="0.9" />
          <text x="0" y="28.5" fill="#FCA5A5" fontSize="7.5" fontWeight="bold" textAnchor="middle">
            ¥ {cnyRate}
          </text>
        </g>

        {/* ── 4. EUR COIN (€) ── */}
        <g className="orbit-eur">
          <circle cx="0" cy="0" r="16" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2" filter="drop-shadow(0 2px 5px rgba(59,130,246,0.3))" />
          <circle cx="0" cy="0" r="13" fill="url(#eurCoinGrad)" />
          <text x="0" y="5" fill="#FFFFFF" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            €
          </text>
          {/* Label Chip */}
          <rect x="-24" y="19" width="48" height="13" rx="3.5" fill="#0F172A" fillOpacity="0.9" />
          <text x="0" y="28.5" fill="#93C5FD" fontSize="7.5" fontWeight="bold" textAnchor="middle">
            € {eurRate}
          </text>
        </g>

        {/* ── CENTER MASCOT CHOP JUGGLING ── */}
        <g className="chop-center" transform="translate(138, 42)">
          {/* Teapot Handle */}
          <path d="M 4 16 C -5 16, -5 32, 4 32" stroke="#1E40AF" strokeWidth="2.6" fill="none" strokeLinecap="round" />

          {/* Body */}
          <rect x="4" y="6" width="40" height="40" rx="13" fill="#FFFFFF" stroke="#1E40AF" strokeWidth="2" />

          {/* Gold Lid Knob */}
          <rect x="19" y="1" width="10" height="6" rx="2.5" fill="#F59E0B" />

          {/* Screen Face */}
          <rect x="9.5" y="13" width="29" height="25" rx="7" fill="#DBEAFE" />

          {/* Rosy Cheeks */}
          <circle cx="14" cy="28" r="2.2" fill="#F59E0B" opacity="0.85" />
          <circle cx="34" cy="28" r="2.2" fill="#F59E0B" opacity="0.85" />

          {/* Star Eyes (Happy Juggling FX) */}
          <text x="17" y="24" fill="#0F172A" fontSize="9" fontWeight="900" textAnchor="middle">★</text>
          <text x="31" y="24" fill="#0F172A" fontSize="9" fontWeight="900" textAnchor="middle">★</text>

          {/* Happy Mouth */}
          <path d="M 20 28 Q 24 33 28 28 Z" fill="#E11D48" />

          {/* Left Arm Raised towards coins */}
          <path d="M 4 19 Q -6 11 -4 2" stroke="#1E40AF" strokeWidth="2.6" strokeLinecap="round" fill="none" />

          {/* Right Arm Raised towards coins */}
          <path d="M 44 19 Q 54 11 52 2" stroke="#1E40AF" strokeWidth="2.6" strokeLinecap="round" fill="none" />

          {/* Little Feet */}
          <circle cx="16" cy="48" r="3.5" fill="#1E40AF" />
          <circle cx="32" cy="48" r="3.5" fill="#1E40AF" />
        </g>

        {/* Twinkling Magical Sparkles */}
        <g className="twinkle-star" transform="translate(115, 25)">
          <polygon points="0,-4 1,-1 4,0 1,1 0,4 -1,1 -4,0 -1,-1" fill="#FDE047" />
        </g>
        <g className="twinkle-star" transform="translate(205, 28)" style={{ animationDelay: '0.8s' }}>
          <polygon points="0,-5 1.2,-1.2 5,0 1.2,1.2 0,5 -1.2,1.2 -5,0 -1.2,-1.2" fill="#6EE7B7" />
        </g>
        <g className="twinkle-star" transform="translate(160, 15)" style={{ animationDelay: '1.4s' }}>
          <polygon points="0,-3.5 0.8,-0.8 3.5,0 0.8,0.8 0,3.5 -0.8,0.8 -3.5,0 -0.8,-0.8" fill="#93C5FD" />
        </g>
      </svg>
    </div>
  );
};
