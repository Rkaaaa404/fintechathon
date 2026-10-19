'use client';

import React from 'react';
import { ChopExpression } from '@/types';

import { EvidenceInspectMascot } from './EvidenceInspectMascot';
import { ChopDetectiveMascot } from './ChopDetectiveMascot';

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
  if (expression === 'inspect') {
    return <EvidenceInspectMascot size={size} className={className} />;
  }
  if (expression === 'detective') {
    return <ChopDetectiveMascot size={size} className={className} />;
  }

  const height = (size * 80) / 76;

  return (
    <svg
      className={`chop-mascot inline-block transition-transform duration-300 ${className}`}
      width={size}
      height={height}
      viewBox="-6 -8 76 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Chop mascot (${expression})`}
    >
      <defs>
        <style>{`
          @keyframes chopFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-3.5px) rotate(1.2deg); }
          }
          @keyframes chopArmWave {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-22deg); }
          }
          @keyframes chopBlink {
            0%, 92%, 100% { transform: scaleY(1); }
            96% { transform: scaleY(0.15); }
          }
          @keyframes chopCheekPulse {
            0%, 100% { opacity: 0.45; transform: scale(1); }
            50% { opacity: 0.75; transform: scale(1.18); }
          }
          @keyframes chopSteamPuff1 {
            0% { transform: translateY(0) scale(0.6); opacity: 0; }
            30% { opacity: 0.85; }
            100% { transform: translateY(-9px) translateX(-2px) scale(1.1); opacity: 0; }
          }
          @keyframes chopSteamPuff2 {
            0% { transform: translateY(0) scale(0.5); opacity: 0; }
            40% { opacity: 0.75; }
            100% { transform: translateY(-11px) translateX(3px) scale(1.2); opacity: 0; }
          }
          @keyframes chopShadowPulse {
            0%, 100% { transform: scaleX(1); opacity: 0.18; }
            50% { transform: scaleX(0.84); opacity: 0.10; }
          }
          @keyframes chopSparkleTwinkle {
            0%, 100% { transform: scale(0.8) rotate(0deg); opacity: 0.5; }
            50% { transform: scale(1.3) rotate(45deg); opacity: 1; }
          }
          .chop-body-floating {
            animation: chopFloat 2.6s ease-in-out infinite;
          }
          .chop-arm-waving {
            transform-origin: 54px 44px;
            animation: chopArmWave 0.7s ease-in-out infinite;
          }
          .chop-eyes-blinking {
            transform-origin: 30px 36px;
            animation: chopBlink 3.8s ease-in-out infinite;
          }
          .chop-cheek-blushing {
            transform-origin: center;
            animation: chopCheekPulse 2s ease-in-out infinite;
          }
          .chop-steam-1 {
            transform-origin: 26px 2px;
            animation: chopSteamPuff1 2.2s ease-out infinite;
          }
          .chop-steam-2 {
            transform-origin: 34px 2px;
            animation: chopSteamPuff2 2.6s ease-out 0.8s infinite;
          }
          .chop-shadow {
            transform-origin: 30px 74px;
            animation: chopShadowPulse 2.6s ease-in-out infinite;
          }
          .chop-sparkle {
            animation: chopSparkleTwinkle 1.8s ease-in-out infinite;
          }
          .chop-mascot:hover .chop-body-floating {
            animation-duration: 1.2s;
          }
        `}</style>
      </defs>

      {/* Dynamic Ground Shadow */}
      <rect x="8" y="72" width="44" height="4" rx="2" fill="#000000" className="chop-shadow" />

      {/* Floating Animated Character Group */}
      <g className="chop-body-floating">
        {/* Floating Steam / Sparkles from Lid */}
        <g className="chop-steam-1">
          <circle cx="26" cy="-1" r="2" fill="#F5A524" opacity="0.8" />
        </g>
        <g className="chop-steam-2">
          <path
            d="M34 -2 L35 -4 L37 -3 L35 -2 L36 0 L34 -1 L32 0 L33 -2 L31 -3 L33 -4 Z"
            fill="#FFFFFF"
            opacity="0.9"
            className="chop-sparkle"
          />
        </g>

        {/* Waving Arm (When in Wave mode or hovered) */}
        {expression === 'wave' && (
          <path
            d="M54 44 Q68 38 64 22"
            stroke={bodyColor}
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            className="chop-arm-waving"
          />
        )}

        {/* Teapot / AI Capsule Knob */}
        <rect x="22" y="2" width="16" height="14" rx="5" fill="#F5A524" />

        {/* Main Body */}
        <rect x="4" y="12" width="52" height="56" rx="16" fill={bodyColor} />

        {/* Screen Face */}
        <rect x="11" y="21" width="38" height="34" rx="10" fill={faceColor} />

        {/* Rosy Cheeks */}
        <circle cx="16" cy="46" r="3.2" fill="#F5A524" className="chop-cheek-blushing" />
        <circle cx="44" cy="46" r="3.2" fill="#F5A524" className="chop-cheek-blushing" style={{ animationDelay: '0.4s' }} />

        {/* Animated Face Expressions */}
        {expression === 'wave' && (
          <g>
            {/* Blinking Eyes with Kawaii Glossy Highlights */}
            <g className="chop-eyes-blinking">
              <circle cx="22" cy="36" r="3.6" fill="#14213D" />
              <circle cx="21" cy="35" r="1.1" fill="#FFFFFF" />
              <circle cx="38" cy="36" r="3.6" fill="#14213D" />
              <circle cx="37" cy="35" r="1.1" fill="#FFFFFF" />
            </g>
            {/* Joyful Open Smile */}
            <path
              d="M21 44 Q30 54 39 44"
              stroke="#14213D"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}

        {expression === 'guard' && (
          <g>
            <g className="chop-eyes-blinking">
              <circle cx="22" cy="36" r="3.4" fill="#14213D" />
              <circle cx="21" cy="35" r="1" fill="#FFFFFF" />
              <circle cx="38" cy="36" r="3.4" fill="#14213D" />
              <circle cx="37" cy="35" r="1" fill="#FFFFFF" />
            </g>
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
            <g className="chop-eyes-blinking">
              <circle cx="22" cy="36" r="3.6" fill="#14213D" />
              <circle cx="21" cy="35" r="1.1" fill="#FFFFFF" />
              <circle cx="38" cy="36" r="3.6" fill="#14213D" />
              <circle cx="37" cy="35" r="1.1" fill="#FFFFFF" />
            </g>
            <path
              d="M21 44 Q30 53 39 44"
              stroke="#14213D"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}

        {/* Guard Shield outline if enabled */}
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
      </g>
    </svg>
  );
};
