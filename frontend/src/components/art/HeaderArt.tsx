'use client';

import React from 'react';

interface HeaderArtProps {
  screenType: 'home' | 'tuition' | 'approval' | 'evidence' | 'planner' | 'safety' | 'chat';
}

export const HeaderArt: React.FC<HeaderArtProps> = ({ screenType = 'home' }) => {
  return (
    <svg
      className="header-art-background pointer-events-none"
      width="100%"
      height="100%"
      viewBox="0 0 600 200"
      preserveAspectRatio="xMaxYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="presentation"
    >
      <defs>
        {/* Sky Ambient Gradient */}
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1C44C8" stopOpacity="0.45" />
          <stop offset="45%" stopColor="#2957E6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#4D7DF9" stopOpacity="0.45" />
        </linearGradient>

        {/* Luminous Glows */}
        <radialGradient id="artBlueGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6FD3FF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#6FD3FF" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="artShieldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.6" />
          <stop offset="70%" stopColor="#3D6BEA" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1C44C8" stopOpacity="0" />
        </radialGradient>

        {/* Golden Coin Gradients */}
        <linearGradient id="goldCoinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="45%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        <linearGradient id="graphLineGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6FD3FF" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#93C5FD" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
        </linearGradient>

        <linearGradient id="graphFillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6FD3FF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#6FD3FF" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#DBEAFE" stopOpacity="0.65" />
        </linearGradient>

        <style>{`
          @keyframes planeGlide {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(4px, -5px) rotate(2deg); }
          }
          @keyframes coinFloat1 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-5px) rotate(6deg); }
          }
          @keyframes coinFloat2 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-6px) rotate(-6deg); }
          }
          @keyframes coinFloat3 {
            0%, 100% { transform: translateY(0px) scale(0.95); }
            50% { transform: translateY(-4px) scale(1.05); }
          }
          @keyframes cloudDrift {
            0%, 100% { transform: translateX(0px); }
            50% { transform: translateX(8px); }
          }
          @keyframes attackSparkLaser {
            0% { transform: translate(0, 0); opacity: 1; }
            70% { transform: translate(-32px, 20px); opacity: 0.95; }
            100% { transform: translate(-42px, 26px); opacity: 0; }
          }
          @keyframes sparkDeflectBurst {
            0% { transform: scale(0.5); opacity: 0.3; }
            50% { transform: scale(1.4); opacity: 1; }
            100% { transform: scale(0.7); opacity: 0.4; }
          }
          @keyframes shieldBarrierBreathe {
            0%, 100% { stroke-opacity: 0.6; transform: scale(0.98); }
            50% { stroke-opacity: 1; transform: scale(1.03); }
          }
          @keyframes chopSafetyBrace {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            45% { transform: translate(-2.5px, 0.5px) rotate(-1.5deg); }
            70% { transform: translate(0, 0) rotate(0deg); }
          }
          @keyframes chopTuitionJoy {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-5px) rotate(2deg); }
          }
          @keyframes tasselSway {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(18deg); }
          }
          @keyframes noteGlide1 {
            0% { transform: translate(14px, -10px) rotate(14deg); opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translate(-22px, 16px) rotate(-16deg); opacity: 0; }
          }
          @keyframes noteGlide2 {
            0% { transform: translate(-10px, -14px) rotate(-10deg); opacity: 0; }
            25% { opacity: 0.9; }
            80% { opacity: 0.9; }
            100% { transform: translate(24px, 18px) rotate(22deg); opacity: 0; }
          }
          @keyframes chopClimbTraverse {
            0%   { transform: translate(394px, 122px) rotate(14deg) scale(0.70); }
            28%  { transform: translate(430px, 98px) rotate(20deg) scale(0.71); }
            58%  { transform: translate(468px, 75px) rotate(16deg) scale(0.73); }
            82%  { transform: translate(504px, 60px) rotate(10deg) scale(0.75); }
            95%, 100% { transform: translate(512px, 54px) rotate(4deg) scale(0.76); }
          }
          @keyframes chopFootStep {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2.5px); }
          }
          @keyframes graphWaveMotion {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
          }
          @keyframes graphPointPulse {
            0%, 100% { r: 3.5px; opacity: 0.7; }
            50% { r: 5px; opacity: 1; }
          }
          @keyframes starTwinkle {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 0.95; transform: scale(1.2); }
          }

          .plane-anim {
            transform-origin: 470px 65px;
            animation: planeGlide 3.6s ease-in-out infinite;
          }
          .coin-anim-1 {
            transform-origin: center;
            animation: coinFloat1 3s ease-in-out infinite;
          }
          .coin-anim-2 {
            transform-origin: center;
            animation: coinFloat2 3.8s ease-in-out infinite;
          }
          .coin-anim-3 {
            transform-origin: center;
            animation: coinFloat3 2.6s ease-in-out infinite;
          }
          .money-glider-1 {
            animation: noteGlide1 3.4s ease-in-out infinite;
          }
          .money-glider-2 {
            animation: noteGlide2 4s ease-in-out infinite 0.7s;
          }
          .cloud-drift-1 {
            animation: cloudDrift 7s ease-in-out infinite;
          }
          .cloud-drift-2 {
            animation: cloudDrift 9s ease-in-out infinite reverse;
          }
          .shield-breathe {
            transform-origin: 480px 100px;
            animation: shieldBarrierBreathe 2.4s ease-in-out infinite;
          }
          .spark-laser-1 {
            animation: attackSparkLaser 1.4s ease-in infinite;
          }
          .spark-laser-2 {
            animation: attackSparkLaser 1.8s ease-in infinite 0.6s;
          }
          .spark-burst {
            transform-origin: 482px 92px;
            animation: sparkDeflectBurst 0.9s ease-out infinite alternate;
          }
          .chop-safety-unit {
            animation: chopSafetyBrace 2.2s ease-in-out infinite;
          }
          .chop-tuition-unit {
            animation: chopTuitionJoy 2.8s ease-in-out infinite;
          }
          .tassel-sway {
            transform-origin: 494px 50px;
            animation: tasselSway 2s ease-in-out infinite;
          }
          .chop-climbing-anim {
            animation: chopClimbTraverse 7s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
          }
          .chop-feet-bobbing {
            animation: chopFootStep 0.45s ease-in-out infinite;
          }
          .graph-wave {
            animation: graphWaveMotion 4s ease-in-out infinite;
          }
          .graph-pulse-1 {
            animation: graphPointPulse 2s ease-in-out infinite;
          }
          .graph-pulse-2 {
            animation: graphPointPulse 2.4s ease-in-out infinite 0.5s;
          }
          .star-1 {
            transform-origin: center;
            animation: starTwinkle 2.5s ease-in-out infinite;
          }
          .star-2 {
            transform-origin: center;
            animation: starTwinkle 3.2s ease-in-out infinite 0.8s;
          }
        `}</style>
      </defs>

      {/* Atmospheric Ambient Sky Overlay */}
      <rect width="100%" height="100%" fill="url(#skyGrad)" />

      {/* ── Soft Fluffy Background Clouds ── */}
      <g className="cloud-drift-1" opacity="0.85">
        <path
          d="M 390 44 Q 390 36 398 36 Q 404 30 412 31 Q 420 28 428 33 Q 434 32 438 37 Q 444 39 443 45 Z"
          fill="url(#cloudGrad)"
        />
      </g>
      <g className="cloud-drift-2" opacity="0.75">
        <path
          d="M 515 30 Q 515 24 521 24 Q 525 20 531 21 Q 537 19 543 22 Q 547 21 550 25 Q 555 26 554 31 Z"
          fill="url(#cloudGrad)"
        />
      </g>
      <g className="cloud-drift-1" opacity="0.8">
        <path
          d="M 380 155 Q 380 145 390 145 Q 396 137 408 138 Q 418 135 428 141 Q 435 140 441 146 Q 448 148 447 156 Z"
          fill="url(#cloudGrad)"
        />
      </g>

      {/* ── Layered Wavy Topographic Contours (Bottom Right Corner) ── */}
      <path
        d="M 400 200 C 440 170, 490 160, 540 175 C 570 188, 588 172, 600 176 L 600 200 Z"
        fill="#FFFFFF"
        fillOpacity="0.12"
      />
      <path
        d="M 440 200 C 480 175, 525 168, 565 182 C 582 190, 592 180, 600 184 L 600 200 Z"
        fill="#6FD3FF"
        fillOpacity="0.14"
      />

      {/* ════════════════════════════════════════════════════════════════
          SCREEN-SPECIFIC DISTINCT HERO ANIMATIONS (User Requirement)
          ════════════════════════════════════════════════════════════════ */}

      {/* 1. PLANNER: Graph Runway & Chop Mascot Climbing Graph Animation */}
      {screenType === 'planner' && (
        <g className="graph-wave">
          <circle cx="510" cy="90" r="50" fill="url(#artBlueGlow)" />
          {/* Subtle Grid Lines */}
          <line x1="400" y1="140" x2="570" y2="140" stroke="#FFFFFF" strokeOpacity="0.2" strokeDasharray="3 3" />
          <line x1="400" y1="105" x2="570" y2="105" stroke="#FFFFFF" strokeOpacity="0.2" strokeDasharray="3 3" />
          <line x1="400" y1="70" x2="570" y2="70" stroke="#FFFFFF" strokeOpacity="0.2" strokeDasharray="3 3" />

          {/* Dynamic Fill Area Under Graph */}
          <path
            d="M 400 135 C 430 130, 450 110, 480 85 C 510 60, 535 75, 570 50 L 570 140 L 400 140 Z"
            fill="url(#graphFillGrad)"
          />

          {/* Main Trajectory Line */}
          <path
            d="M 400 135 C 430 130, 450 110, 480 85 C 510 60, 535 75, 570 50"
            stroke="url(#graphLineGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Dynamic Glowing Data Waypoints */}
          <circle cx="400" cy="135" r="3.5" fill="#6FD3FF" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="450" cy="110" r="3.5" fill="#93C5FD" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="480" cy="85" r="4.5" fill="#FFFFFF" stroke="#3D6BEA" strokeWidth="2" className="graph-pulse-1" />
          <circle cx="535" cy="75" r="3.5" fill="#6FD3FF" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="570" cy="50" r="5" fill="#FFFFFF" stroke="#10B981" strokeWidth="2" className="graph-pulse-2" />

          {/* Small Floating Stat Pill at Summit */}
          <g transform="translate(515, 28)">
            <rect width="54" height="20" rx="10" fill="#0A1440" fillOpacity="0.8" stroke="#6FD3FF" strokeWidth="1.2" />
            <text x="27" y="14" fill="#FFFFFF" fontSize="9.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              +180d ▲
            </text>
          </g>

          {/* ── Chop Mascot Climbing the Cashflow Graph ── */}
          <g className="chop-climbing-anim">
            <g className="chop-feet-bobbing">
              {/* Adventurer Hiking Backpack */}
              <rect x="-3" y="14" width="8" height="18" rx="3.5" fill="#D97706" stroke="#B45309" strokeWidth="1.2" />
              <line x1="-3" y1="20" x2="5" y2="20" stroke="#FDE047" strokeWidth="1" />

              {/* Teapot Handle on Back */}
              <path d="M 3 13 C -3 13, -3 27, 3 27" stroke="#1F3FA8" strokeWidth="2.2" fill="none" strokeLinecap="round" />

              {/* Main Teapot Body */}
              <rect x="3" y="6" width="36" height="34" rx="11" fill="#FFFFFF" stroke="#1F3FA8" strokeWidth="1.6" />

              {/* Gold Top Knob */}
              <rect x="16" y="1" width="10" height="6" rx="2" fill="#F5A524" />

              {/* Spout on Front */}
              <path d="M 39 18 C 44 16, 45 12, 47 10" stroke="#1F3FA8" strokeWidth="2.2" fill="none" strokeLinecap="round" />

              {/* Cute Screen Face */}
              <rect x="8" y="11" width="26" height="21" rx="6" fill="#DCE8FD" />

              {/* Rosy Cheeks */}
              <circle cx="11" cy="24" r="2" fill="#F5A524" opacity="0.8" />
              <circle cx="31" cy="24" r="2" fill="#F5A524" opacity="0.8" />

              {/* Determined Climbing Eyes Gazing Upward toward +180d Peak */}
              <circle cx="16" cy="19" r="2.5" fill="#14213D" />
              <circle cx="17.2" cy="18" r="0.9" fill="#FFFFFF" />
              <circle cx="26" cy="19" r="2.5" fill="#14213D" />
              <circle cx="27.2" cy="18" r="0.9" fill="#FFFFFF" />

              {/* Determined Smile */}
              <path d="M 18 26 Q 21 29 24 26" stroke="#14213D" strokeWidth="1.6" strokeLinecap="round" fill="none" />

              {/* Little Stepping Feet */}
              <ellipse cx="13" cy="41" rx="4" ry="2.6" fill="#1F3FA8" />
              <ellipse cx="27" cy="41" rx="4" ry="2.6" fill="#1F3FA8" />
            </g>
          </g>
        </g>
      )}

      {/* 2. SAFETY: Mascot Shield Defending Against Attack Lasers / Sparks */}
      {screenType === 'safety' && (
        <g>
          {/* Central Shield Protection Aura */}
          <circle cx="480" cy="95" r="48" fill="url(#artShieldGlow)" />

          {/* Glowing Forcefield Barrier Arc */}
          <path
            d="M 505 50 A 50 50 0 0 0 505 140"
            stroke="#6FD3FF"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            className="shield-breathe"
          />
          <path
            d="M 501 56 A 44 44 0 0 0 501 134"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeOpacity="0.85"
            fill="none"
          />

          {/* Incoming Attack Lasers striking toward Chop's Shield from top-right */}
          <g className="spark-laser-1">
            <line x1="570" y1="46" x2="510" y2="84" stroke="#FF4550" strokeWidth="3" strokeLinecap="round" />
            <circle cx="510" cy="84" r="3.2" fill="#FFA4A7" />
          </g>
          <g className="spark-laser-2">
            <line x1="585" y1="70" x2="522" y2="106" stroke="#FF6B6F" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="522" cy="106" r="2.8" fill="#FFA4A7" />
          </g>

          {/* Burst of Deflection Sparks on Barrier Impact */}
          <g className="spark-burst">
            <circle cx="510" cy="90" r="9" stroke="#6FD3FF" strokeWidth="1.8" fill="none" />
            <line x1="510" y1="90" x2="496" y2="76" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <line x1="510" y1="90" x2="500" y2="105" stroke="#6EE7B7" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="510" y1="90" x2="524" y2="78" stroke="#FFD8D8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="510" y1="90" x2="522" y2="102" stroke="#6FD3FF" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* ── Mascot Chop Heroically Bracing & Holding Aegis Shield ── */}
          <g className="chop-safety-unit">
            {/* Mascot Teapot Body */}
            <g transform="translate(434, 72)">
              {/* Teapot Handle on Left */}
              <path d="M 4 15 C -3 15, -3 29, 4 29" stroke="#1F3FA8" strokeWidth="2.2" fill="none" strokeLinecap="round" />

              {/* Main Body */}
              <rect x="4" y="6" width="38" height="38" rx="12" fill="#FFFFFF" stroke="#1F3FA8" strokeWidth="1.6" />

              {/* Gold Top Knob */}
              <rect x="18" y="1" width="10" height="6" rx="2" fill="#F5A524" />

              {/* Screen Face */}
              <rect x="9" y="12" width="28" height="24" rx="7" fill="#DCE8FD" />

              {/* Rosy Cheeks */}
              <circle cx="13" cy="27" r="2" fill="#F5A524" opacity="0.8" />
              <circle cx="33" cy="27" r="2" fill="#F5A524" opacity="0.8" />

              {/* Determined Guard Eyebrows */}
              <path d="M 12 17 L 19 20" stroke="#14213D" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M 34 17 L 27 20" stroke="#14213D" strokeWidth="2.2" strokeLinecap="round" />

              {/* Guarding Focused Eyes */}
              <circle cx="16" cy="23" r="2.6" fill="#14213D" />
              <circle cx="17" cy="22" r="0.8" fill="#FFFFFF" />
              <circle cx="30" cy="23" r="2.6" fill="#14213D" />
              <circle cx="31" cy="22" r="0.8" fill="#FFFFFF" />

              {/* Firm Guard Mouth Line */}
              <path d="M 20 30 H 26" stroke="#14213D" strokeWidth="2" strokeLinecap="round" />

              {/* Right Arm Extending Forward Holding Gleaming Shield */}
              <g transform="translate(36, 4)">
                {/* Shield Body */}
                <path
                  d="M 14 0 L 28 6 L 28 24 C 28 35, 14 44, 14 44 C 14 44, 0 35, 0 24 L 0 6 Z"
                  fill="#1C44C8"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                {/* Shield Inset */}
                <path
                  d="M 14 5 L 23 9 L 23 21 C 23 28, 14 34, 14 34 C 14 34, 5 28, 5 21 L 5 9 Z"
                  fill="#3D6BEA"
                />
                {/* Checkmark Crest on Shield */}
                <path
                  d="M 9 19 L 13 23 L 20 14"
                  stroke="#6FD3FF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </g>
            </g>
          </g>
        </g>
      )}

      {/* 3. TUITION: Mascot with Graduation Cap & Floating Money / Coins / Notes */}
      {(screenType === 'tuition' || screenType === 'approval') && (
        <g>
          <circle cx="490" cy="85" r="48" fill="url(#artBlueGlow)" />

          {/* Floating Gold Coin 1 (CNY ¥) */}
          <g className="coin-anim-1">
            <g transform="translate(540, 42) rotate(-15)">
              <ellipse cx="0" cy="0" rx="11" ry="8" fill="url(#goldCoinGrad)" stroke="#B45309" strokeWidth="1.5" />
              <ellipse cx="0" cy="0" rx="8" ry="5.6" fill="none" stroke="#FDE047" strokeWidth="1.2" strokeOpacity="0.9" />
              <text x="0" y="3.5" fontSize="8.5" fontWeight="bold" fill="#78350F" textAnchor="middle" fontFamily="sans-serif">¥</text>
            </g>
          </g>

          {/* Floating Gold Coin 2 (USD $) */}
          <g className="coin-anim-2">
            <g transform="translate(560, 88) rotate(18)">
              <ellipse cx="0" cy="0" rx="10" ry="7.2" fill="url(#goldCoinGrad)" stroke="#B45309" strokeWidth="1.5" />
              <ellipse cx="0" cy="0" rx="7.2" ry="5" fill="none" stroke="#FDE047" strokeWidth="1" strokeOpacity="0.9" />
              <text x="0" y="3" fontSize="8.5" fontWeight="bold" fill="#78350F" textAnchor="middle" fontFamily="sans-serif">$</text>
            </g>
          </g>

          {/* Floating Gold Coin 3 (Mini Sparkle Coin) */}
          <g className="coin-anim-3">
            <g transform="translate(420, 60) rotate(-8)">
              <ellipse cx="0" cy="0" rx="8.5" ry="6.2" fill="url(#goldCoinGrad)" stroke="#B45309" strokeWidth="1.2" />
              <ellipse cx="0" cy="0" rx="6" ry="4.2" fill="none" stroke="#FDE047" strokeWidth="0.8" />
            </g>
          </g>

          {/* Floating Banknotes / Currency Slips */}
          <g className="money-glider-1">
            <rect x="502" y="55" width="24" height="13" rx="2" fill="#EBF7EE" stroke="#0E6E43" strokeWidth="1.2" />
            <rect x="504" y="57" width="20" height="9" rx="1" fill="none" stroke="#0E6E43" strokeWidth="0.6" strokeDasharray="1.5 1" />
            <text x="514" y="64.5" fontSize="7.5" fontWeight="bold" fill="#0E6E43" textAnchor="middle" fontFamily="sans-serif">$</text>
          </g>
          <g className="money-glider-2">
            <rect x="440" y="95" width="22" height="12" rx="2" fill="#EBF7EE" stroke="#0E6E43" strokeWidth="1.2" />
            <text x="451" y="104" fontSize="7" fontWeight="bold" fill="#0E6E43" textAnchor="middle" fontFamily="sans-serif">¥</text>
          </g>

          {/* ── Mascot Chop in Graduation Mortarboard with Floating Money ── */}
          <g className="chop-tuition-unit">
            <g transform="translate(456, 62)">
              {/* Teapot Handle on Left */}
              <path d="M 4 18 C -3 18, -3 32, 4 32" stroke="#1F3FA8" strokeWidth="2.2" fill="none" strokeLinecap="round" />

              {/* Main Teapot Body */}
              <rect x="4" y="10" width="40" height="38" rx="12" fill="#FFFFFF" stroke="#1F3FA8" strokeWidth="1.6" />

              {/* Spout on Right */}
              <path d="M 44 22 C 49 20, 50 16, 52 14" stroke="#1F3FA8" strokeWidth="2.2" fill="none" strokeLinecap="round" />

              {/* Cute Screen Face */}
              <rect x="10" y="16" width="28" height="24" rx="7" fill="#DCE8FD" />

              {/* Rosy Cheeks */}
              <circle cx="14" cy="30" r="2.2" fill="#F5A524" opacity="0.8" />
              <circle cx="34" cy="30" r="2.2" fill="#F5A524" opacity="0.8" />

              {/* Joyful Sparkling Eyes */}
              <circle cx="17" cy="24" r="2.6" fill="#14213D" />
              <circle cx="16" cy="23" r="0.9" fill="#FFFFFF" />
              <circle cx="31" cy="24" r="2.6" fill="#14213D" />
              <circle cx="30" cy="23" r="0.9" fill="#FFFFFF" />

              {/* Cheerful Open Smile */}
              <path d="M 19 29 Q 24 35 29 29" stroke="#14213D" strokeWidth="1.8" strokeLinecap="round" fill="none" />

              {/* Academic Mortarboard Cap atop Chop */}
              <polygon points="24,0 44,6 24,12 4,6" fill="#14213D" />
              <polygon points="12,6 12,11 36,11 36,6" fill="#1F3FA8" />
              {/* Swinging Gold Tassel */}
              <g className="tassel-sway">
                <line x1="44" y1="6" x2="45" y2="18" stroke="#F59E0B" strokeWidth="1.6" />
                <circle cx="45" cy="18" r="1.8" fill="#F59E0B" />
              </g>

              {/* Hand Holding a Floating Mini Coin */}
              <g transform="translate(42, 28) rotate(-12)">
                <ellipse cx="0" cy="0" rx="5" ry="3.8" fill="url(#goldCoinGrad)" stroke="#B45309" strokeWidth="0.8" />
                <text x="0" y="1.5" fontSize="4.5" fontWeight="bold" fill="#78350F" textAnchor="middle">$</text>
              </g>
            </g>
          </g>
        </g>
      )}

      {/* 4. EVIDENCE: Cryptographic Seal & Verified Badges */}
      {screenType === 'evidence' && (
        <g>
          <circle cx="495" cy="85" r="44" fill="url(#artBlueGlow)" />

          {/* Floating Verification Shield Badge */}
          <g className="coin-anim-1" transform="translate(485, 55)">
            <path
              d="M 20 2 L 36 8 L 36 24 C 36 34 20 42 20 42 C 20 42 4 34 4 24 L 4 8 Z"
              fill="#FFFFFF"
              stroke="#1C3EAA"
              strokeWidth="2"
            />
            <path
              d="M 12 21 L 17 26 L 28 15"
              stroke="#0E6E43"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>

          {/* Verified Tier Pills */}
          <g className="coin-anim-2" transform="translate(420, 80)">
            <rect width="48" height="18" rx="9" fill="#EBF7EE" stroke="#0E6E43" strokeWidth="1.2" />
            <text x="24" y="12.5" fill="#0E6E43" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              Tier 1 ✓
            </text>
          </g>

          <g className="coin-anim-3" transform="translate(540, 100)">
            <rect width="44" height="16" rx="8" fill="#EEF4FF" stroke="#3D6BEA" strokeWidth="1" />
            <text x="22" y="11.5" fill="#1C3EAA" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              Tier 2 ✓
            </text>
          </g>

          {/* Dotted Cryptographic Ring */}
          <circle cx="505" cy="76" r="32" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.6" fill="none" />
        </g>
      )}

      {/* 5. HOME: Luminous Paper Airplane, Gliding Arc & Stars */}
      {(screenType === 'home' || screenType === 'chat') && (
        <g>
          {/* Flight Path Trajectory Arc */}
          <path
            d="M 390 98 C 420 54, 455 44, 478 60"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeDasharray="3 4"
            strokeLinecap="round"
            strokeOpacity="0.8"
            fill="none"
          />

          {/* Glow behind airplane */}
          <circle cx="480" cy="62" r="32" fill="url(#artBlueGlow)" />

          {/* Origami Paper Airplane */}
          <g className="plane-anim">
            <g transform="translate(476, 58) rotate(16)">
              <polygon
                points="0,0 26,-9 9,4"
                fill="#FFFFFF"
                stroke="#0F172A"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <polygon
                points="0,0 26,-9 15,9"
                fill="#F1F5F9"
                stroke="#0F172A"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <polygon
                points="9,4 26,-9 15,9"
                fill="#CBD5E1"
                stroke="#0F172A"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <line
                x1="0"
                y1="0"
                x2="26"
                y2="-9"
                stroke="#0F172A"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </g>
          </g>

          {/* Twinkling Stars */}
          <g className="star-1" transform="translate(415, 45)">
            <path d="M 0,-4 L 1,-1 L 4,0 L 1,1 L 0,4 L -1,1 L -4,0 L -1,-1 Z" fill="#FFFFFF" />
          </g>
          <g className="star-2" transform="translate(555, 35)">
            <path d="M 0,-5 L 1.2,-1.2 L 5,0 L 1.2,1.2 L 0,5 L -1.2,1.2 L -5,0 L -1.2,-1.2 Z" fill="#6FD3FF" />
          </g>

          {/* Golden Coins */}
          <g className="coin-anim-1">
            <g transform="translate(534, 42) rotate(-24)">
              <ellipse cx="0" cy="0" rx="8" ry="5.5" fill="url(#goldCoinGrad)" stroke="#B45309" strokeWidth="1.2" />
              <ellipse cx="0" cy="0" rx="5.8" ry="3.8" fill="none" stroke="#FDE047" strokeWidth="1" strokeOpacity="0.9" />
            </g>
          </g>

          <g className="coin-anim-2">
            <g transform="translate(552, 68) rotate(18)">
              <ellipse cx="0" cy="0" rx="7.5" ry="5" fill="url(#goldCoinGrad)" stroke="#B45309" strokeWidth="1.2" />
              <ellipse cx="0" cy="0" rx="5.2" ry="3.4" fill="none" stroke="#FDE047" strokeWidth="1" strokeOpacity="0.9" />
            </g>
          </g>
        </g>
      )}
    </svg>
  );
};
