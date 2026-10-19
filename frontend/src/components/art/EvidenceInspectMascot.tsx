'use client';

import React from 'react';

interface EvidenceInspectMascotProps {
  size?: number;
  className?: string;
}

export const EvidenceInspectMascot: React.FC<EvidenceInspectMascotProps> = ({
  size = 72,
  className = '',
}) => {
  const height = (size * 88) / 76;

  return (
    <svg
      className={`evidence-inspect-mascot inline-block transition-transform duration-300 ${className}`}
      width={size}
      height={height}
      viewBox="-6 -10 94 98"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Chop mascot examining financial evidence document"
    >
      <defs>
        {/* Glow & Scan Gradients */}
        <linearGradient id="scanBeamGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3D6BEA" stopOpacity="0" />
          <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#3D6BEA" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="docPaperGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F1F5F9" />
        </linearGradient>

        <filter id="scanGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <style>{`
          @keyframes mascotInspectFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-3px) rotate(-1deg); }
          }
          @keyframes docScanSweep {
            0% { transform: translateY(0px); opacity: 0.3; }
            50% { transform: translateY(32px); opacity: 1; }
            100% { transform: translateY(0px); opacity: 0.3; }
          }
          @keyframes checkmarkPulse {
            0%, 100% { transform: scale(1) translateY(0); opacity: 0.9; }
            50% { transform: scale(1.15) translateY(-2px); opacity: 1; }
          }
          @keyframes sparkleFloat {
            0%, 100% { transform: scale(0.7) rotate(0deg); opacity: 0.4; }
            50% { transform: scale(1.2) rotate(45deg); opacity: 1; }
          }
          @keyframes eyeScanMove {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(2.5px) translateY(1.5px); }
          }
          .inspect-body {
            animation: mascotInspectFloat 2.8s ease-in-out infinite;
          }
          .scan-beam {
            animation: docScanSweep 2.4s ease-in-out infinite;
          }
          .inspect-seal {
            transform-origin: 66px 22px;
            animation: checkmarkPulse 2s ease-in-out infinite;
          }
          .inspect-sparkle {
            transform-origin: 74px 8px;
            animation: sparkleFloat 1.8s ease-in-out infinite;
          }
          .inspect-eyes {
            animation: eyeScanMove 2.4s ease-in-out infinite;
          }
        `}</style>
      </defs>

      {/* Ground Shadow */}
      <rect x="8" y="76" width="50" height="4" rx="2" fill="#000000" opacity="0.14" />

      {/* Main Mascot Group */}
      <g className="inspect-body">
        {/* Steam / Top Sparkle */}
        <g className="inspect-sparkle">
          <path
            d="M74 6 L75 3 L77 4 L75 6 L76 9 L74 7 L71 8 L73 6 L71 3 L73 2 Z"
            fill="#F5A524"
          />
        </g>

        {/* Mascot Head Knob */}
        <rect x="20" y="2" width="16" height="14" rx="5" fill="#F5A524" />

        {/* Main Body */}
        <rect x="2" y="12" width="50" height="56" rx="16" fill="#FFFFFF" stroke="rgba(15,23,42,0.08)" strokeWidth="1" />

        {/* Screen Face */}
        <rect x="8" y="21" width="38" height="34" rx="10" fill="#DCE8FD" />

        {/* Rosy Cheeks */}
        <circle cx="13" cy="46" r="3.2" fill="#F5A524" opacity="0.6" />
        <circle cx="41" cy="46" r="3.2" fill="#F5A524" opacity="0.6" />

        {/* Scanning Focused Eyes */}
        <g className="inspect-eyes">
          <circle cx="19" cy="36" r="3.6" fill="#14213D" />
          <circle cx="18" cy="35" r="1.1" fill="#FFFFFF" />
          <circle cx="34" cy="36" r="3.6" fill="#14213D" />
          <circle cx="33" cy="35" r="1.1" fill="#FFFFFF" />
          {/* Eyebrows focused down on paper */}
          <path d="M15 31 L23 33" stroke="#14213D" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M38 31 L30 33" stroke="#14213D" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* Focused Smile */}
        <path
          d="M20 45 Q26 50 33 45"
          stroke="#14213D"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Left Holding Arm */}
        <path
          d="M6 46 Q-1 50 14 56"
          stroke="#FFFFFF"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />

        {/* ═════════ EXAMINED DOCUMENT / CERTIFICATE ═════════ */}
        <g transform="translate(42, 18) rotate(6)">
          {/* Paper Shadow */}
          <rect x="1" y="2" width="34" height="46" rx="4" fill="#000000" opacity="0.12" />

          {/* Paper Sheet */}
          <rect
            x="0"
            y="0"
            width="34"
            height="46"
            rx="4"
            fill="url(#docPaperGrad)"
            stroke="#CBD5E1"
            strokeWidth="1.2"
          />

          {/* Folded Top-Right Corner */}
          <path d="M26 0 L34 8 H28 Q26 8 26 6 Z" fill="#94A3B8" opacity="0.6" />

          {/* Evidence Document Header Bar */}
          <rect x="4" y="5" width="18" height="3" rx="1" fill="#1C3EAA" />

          {/* Verified Check Badge on Doc */}
          <circle cx="26" cy="18" r="5" fill="#0E6E43" />
          <path
            d="M23.5 18 L25.2 20 L28.5 16.5"
            stroke="#FFFFFF"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Simulated Financial Rows / Text Lines */}
          <rect x="4" y="12" width="18" height="2" rx="0.8" fill="#64748B" opacity="0.8" />
          <rect x="4" y="16" width="14" height="2" rx="0.8" fill="#94A3B8" opacity="0.7" />
          <rect x="4" y="20" width="16" height="2" rx="0.8" fill="#94A3B8" opacity="0.7" />

          <line x1="4" y1="25" x2="30" y2="25" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="1.5 1.5" />

          <rect x="4" y="28" width="22" height="2.2" rx="0.8" fill="#1C3EAA" opacity="0.9" />
          <rect x="4" y="32" width="16" height="2" rx="0.8" fill="#94A3B8" opacity="0.6" />
          <rect x="4" y="36" width="20" height="2" rx="0.8" fill="#94A3B8" opacity="0.6" />

          {/* Blue Laser / Scan Light Beam */}
          <g className="scan-beam">
            <rect
              x="-2"
              y="4"
              width="38"
              height="4"
              fill="url(#scanBeamGrad)"
              filter="url(#scanGlow)"
            />
            <line x1="0" y1="6" x2="34" y2="6" stroke="#60A5FA" strokeWidth="1.5" />
          </g>
        </g>

        {/* Right Arm holding Document Edge */}
        <path
          d="M44 45 Q52 48 48 56"
          stroke="#FFFFFF"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />

        {/* Floating Verified Seal Shield */}
        <g className="inspect-seal">
          <circle cx="68" cy="20" r="10" fill="#0E6E43" stroke="#FFFFFF" strokeWidth="1.8" />
          <path
            d="M64 20 L67 23 L73 17"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  );
};
