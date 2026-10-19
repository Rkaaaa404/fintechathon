'use client';

import React from 'react';

interface ChopDetectiveMascotProps {
  size?: number;
  className?: string;
}

export const ChopDetectiveMascot: React.FC<ChopDetectiveMascotProps> = ({
  size = 72,
  className = '',
}) => {
  const height = (size * 88) / 76;

  return (
    <svg
      className={`chop-detective-mascot inline-block transition-transform duration-300 ${className}`}
      width={size}
      height={height}
      viewBox="-8 -10 96 98"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Chop mascot holding a magnifying glass investigating rules and timing"
    >
      <defs>
        {/* Glass lens reflection gradient */}
        <linearGradient id="lensGlintGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
          <stop offset="45%" stopColor="#93C5FD" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
        </linearGradient>

        {/* Golden Metallic Rim Gradient */}
        <linearGradient id="goldRimGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="40%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        <style>{`
          @keyframes detectiveFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-3.5px) rotate(1.5deg); }
          }
          @keyframes glassHover {
            0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
            50% { transform: translate(2px, -2px) rotate(-3deg); }
          }
          @keyframes lensShine {
            0%, 100% { opacity: 0.4; transform: rotate(0deg) scale(0.9); }
            50% { opacity: 0.9; transform: rotate(15deg) scale(1.1); }
          }
          @keyframes questionFloat {
            0% { transform: translateY(0px) scale(0.6); opacity: 0; }
            40% { opacity: 0.9; }
            100% { transform: translateY(-8px) scale(1); opacity: 0; }
          }
          .detective-body {
            animation: detectiveFloat 2.6s ease-in-out infinite;
          }
          .magnifying-glass-group {
            transform-origin: 48px 46px;
            animation: glassHover 2.2s ease-in-out infinite;
          }
          .lens-glint {
            transform-origin: 36px 36px;
            animation: lensShine 2s ease-in-out infinite;
          }
          .insight-sparkle {
            animation: questionFloat 2.4s ease-out infinite;
          }
        `}</style>
      </defs>

      {/* Ground Shadow */}
      <rect x="8" y="74" width="46" height="4" rx="2" fill="#000000" opacity="0.14" />

      {/* Detective Body Group */}
      <g className="detective-body">
        {/* Insight / Curiosity Floating Sparkle */}
        <g className="insight-sparkle" transform="translate(56, 4)">
          <path
            d="M8 2 L9 0 L10 2 L12 3 L10 4 L9 6 L8 4 L6 3 Z"
            fill="#F59E0B"
          />
        </g>

        {/* Mascot Top Knob */}
        <rect x="20" y="2" width="16" height="14" rx="5" fill="#F5A524" />

        {/* Main Body */}
        <rect x="2" y="12" width="50" height="56" rx="16" fill="#FFFFFF" stroke="rgba(15,23,42,0.08)" strokeWidth="1" />

        {/* Screen Face */}
        <rect x="8" y="21" width="38" height="34" rx="10" fill="#DCE8FD" />

        {/* Rosy Cheeks */}
        <circle cx="13" cy="46" r="3.2" fill="#F5A524" opacity="0.6" />
        <circle cx="41" cy="46" r="3.2" fill="#F5A524" opacity="0.6" />

        {/* Normal Left Eye */}
        <g>
          <circle cx="19" cy="36" r="3.4" fill="#14213D" />
          <circle cx="18" cy="35" r="1.1" fill="#FFFFFF" />
          <path d="M15 30 Q19 28 23 30" stroke="#14213D" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </g>

        {/* Inquisitive Smile */}
        <path
          d="M20 45 Q26 51 32 46"
          stroke="#14213D"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Left Arm Resting */}
        <path
          d="M6 46 Q0 52 10 58"
          stroke="#FFFFFF"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />

        {/* ═════════ MAGNIFYING GLASS & ENLARGED EYE ═════════ */}
        <g className="magnifying-glass-group">
          {/* Glass Handle */}
          <path
            d="M45 47 L62 66"
            stroke="url(#goldRimGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Handle Grip Detail */}
          <path
            d="M52 55 L60 64"
            stroke="#1C3EAA"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Golden Rim */}
          <circle
            cx="35"
            cy="36"
            r="16"
            fill="none"
            stroke="url(#goldRimGrad)"
            strokeWidth="3.2"
          />

          {/* Glass Lens Surface */}
          <circle
            cx="35"
            cy="36"
            r="14.4"
            fill="url(#lensGlintGrad)"
            stroke="#93C5FD"
            strokeWidth="0.8"
          />

          {/* ── Magnified Right Eye Inside Lens (Bigger, Sharp & Glowing!) ── */}
          <g>
            {/* Magnified Eye Iris */}
            <circle cx="35" cy="36" r="5.2" fill="#14213D" />
            {/* Big Specular Highlight */}
            <circle cx="33.5" cy="34" r="1.8" fill="#FFFFFF" />
            <circle cx="36.8" cy="37.5" r="0.8" fill="#FFFFFF" />
            {/* Detective Inquisitive Eyebrow */}
            <path
              d="M28 28 Q35 24 42 29"
              stroke="#14213D"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* Lens Specular Curved Glint Arc */}
          <path
            d="M24 33 A12 12 0 0 1 35 24"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="lens-glint"
          />

          {/* Right Arm Holding Handle */}
          <path
            d="M48 46 Q54 44 51 54"
            stroke="#FFFFFF"
            strokeWidth="6.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </g>
    </svg>
  );
};
