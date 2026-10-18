'use client';

import React from 'react';
import { ChopExpression } from '@/types';

interface ChopMascotProps {
  expression?: ChopExpression;
  size?: number;
  showShield?: boolean;
  bodyColor?: string;
  faceColor?: string;
  className?: string;
}

export const ChopMascot: React.FC<ChopMascotProps> = ({
  expression = 'idle',
  size = 64,
  showShield = false,
  bodyColor = '#FFFFFF',
  faceColor = '#DCE8FD',
  className = '',
}) => {
  const height = (size * 80) / 76;

  return (
    <svg
      className={`chop-mascot inline-block transition-transform duration-300 ${className}`}
      width={size}
      height={height}
      viewBox="-6 0 76 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Chop mascot (${expression})`}
    >
      {/* Arm (Wave) */}
      {expression === 'wave' && (
        <path
          d="M54 44 Q68 38 64 22"
          stroke={bodyColor}
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
      )}

      {/* Knob */}
      <rect x="22" y="2" width="16" height="14" rx="5" fill="#F5A524" />

      {/* Body */}
      <rect x="4" y="12" width="52" height="56" rx="16" fill={bodyColor} />

      {/* Face */}
      <rect x="11" y="21" width="38" height="34" rx="10" fill={faceColor} />

      {/* Cheeks */}
      <circle cx="16" cy="46" r="3" fill="#F5A524" opacity="0.45" />
      <circle cx="44" cy="46" r="3" fill="#F5A524" opacity="0.45" />

      {/* Face Features depending on expression */}
      {expression === 'wave' && (
        <g>
          <circle cx="22" cy="36" r="3.6" fill="#14213D" />
          <circle cx="38" cy="36" r="3.6" fill="#14213D" />
          <path
            d="M21 44 Q30 53 39 44"
            stroke="#14213D"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )}

      {expression === 'guard' && (
        <g>
          <circle cx="22" cy="36" r="3.4" fill="#14213D" />
          <circle cx="38" cy="36" r="3.4" fill="#14213D" />
          <path
            d="M14 29 L26 32 M46 29 L34 32"
            stroke="#14213D"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M24 46 H36"
            stroke="#14213D"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </g>
      )}

      {expression === 'block' && (
        <g>
          <path
            d="M17 33 L27 38 M43 33 L33 38"
            stroke="#14213D"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M24 47 H36"
            stroke="#14213D"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </g>
      )}

      {expression === 'paused' && (
        <g>
          <path
            d="M18 36 Q22 40 26 36 M34 36 Q38 40 42 36"
            stroke="#14213D"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )}

      {(expression === 'idle' || !['wave', 'guard', 'block', 'paused'].includes(expression)) && (
        <g>
          <circle cx="22" cy="36" r="3.6" fill="#14213D" />
          <circle cx="38" cy="36" r="3.6" fill="#14213D" />
          <path
            d="M21 44 Q30 53 39 44"
            stroke="#14213D"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )}

      {/* Base shadow */}
      <rect x="8" y="72" width="44" height="4" rx="2" fill="#000000" opacity="0.18" />

      {/* Guard shield outline if enabled */}
      {showShield && expression === 'guard' && (
        <path
          d="M10 14 Q30 8 50 14 Q52 46 30 64 Q8 46 10 14 Z"
          fill="none"
          stroke="#3D6BEA"
          strokeDasharray="3 3"
          strokeWidth="2"
        />
      )}

      {/* Badges */}
      {expression === 'block' && (
        <g>
          <circle cx="56" cy="12" r="9" fill="#E5484D" />
          <path
            d="M52 8 L60 16 M60 8 L52 16"
            stroke="#ffffff"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </g>
      )}

      {expression === 'paused' && (
        <g>
          <circle cx="56" cy="12" r="9" fill="#5B6B8C" />
          <path
            d="M53 8.5 V15.5 M59 8.5 V15.5"
            stroke="#ffffff"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </g>
      )}
    </svg>
  );
};
