'use client';

import React from 'react';

interface HeaderArtProps {
  screenType: 'home' | 'tuition' | 'approval' | 'evidence' | 'planner' | 'safety' | 'chat';
}

export const HeaderArt: React.FC<HeaderArtProps> = ({ screenType }) => {
  return (
    <svg
      className="header-art-background"
      width="100%"
      height="100%"
      viewBox="0 0 390 220"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="presentation"
    >
      {/* Background clouds (opacity 0.14) */}
      <ellipse cx="60" cy="40" rx="34" ry="16" fill="#ffffff" opacity="0.14" />
      <ellipse cx="80" cy="46" rx="28" ry="14" fill="#ffffff" opacity="0.14" />
      <ellipse cx="320" cy="36" rx="42" ry="18" fill="#ffffff" opacity="0.14" />
      <ellipse cx="300" cy="42" rx="30" ry="14" fill="#ffffff" opacity="0.14" />

      {/* Four-point sparkles (opacity 0.75) */}
      <g transform="translate(14, 82) scale(0.75)">
        <path d="M0 -7 Q0 0 7 0 Q0 0 0 7 Q0 0 -7 0 Q0 0 0 -7 Z" fill="#ffffff" opacity="0.75" />
      </g>
      <g transform="translate(365, 142) scale(1)">
        <path d="M0 -7 Q0 0 7 0 Q0 0 0 7 Q0 0 -7 0 Q0 0 0 -7 Z" fill="#ffffff" opacity="0.75" />
      </g>
      <g transform="translate(345, 60) scale(0.7)">
        <path d="M0 -7 Q0 0 7 0 Q0 0 0 7 Q0 0 -7 0 Q0 0 0 -7 Z" fill="#ffffff" opacity="0.75" />
      </g>

      {/* Plus marks (opacity 0.5) */}
      <path d="M300 70 H308 M304 66 V74" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
      <path d="M110 120 H116 M113 117 V123" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
      <path d="M260 178 H266 M263 175 V181" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />

      {/* Small dots (opacity 0.6) */}
      <circle cx="102" cy="180" r="1.5" fill="#ffffff" opacity="0.6" />
      <circle cx="120" cy="208" r="1.8" fill="#ffffff" opacity="0.6" />
      <circle cx="196" cy="214" r="2.0" fill="#ffffff" opacity="0.6" />
      <circle cx="340" cy="116" r="1.5" fill="#ffffff" opacity="0.6" />

      {/* Dotted arc (opacity 0.35) */}
      <path d="M80 220 Q240 120 380 180" stroke="#ffffff" strokeWidth="1.8" strokeDasharray="3 4" opacity="0.35" fill="none" />

      {/* Two amber coins */}
      <g transform="translate(242, 188)">
        <circle cx="0" cy="0" r="8" fill="#F5A524" stroke="#14213D" strokeWidth="1.6" />
      </g>
      <g transform="translate(258, 202)">
        <circle cx="0" cy="0" r="6" fill="#F5A524" stroke="#14213D" strokeWidth="1.6" />
      </g>

      {/* Page-Specific Doodles */}
      {screenType === 'home' && (
        <g transform="translate(270, 72) scale(0.9)" opacity="0.85">
          <path d="M4 78 H114" stroke="#9DB8FF" strokeWidth="2" />
          <path d="M14 56 Q30 40 52 46" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 3" fill="none" />
          <path d="M62 10 L106 24 L84 44 L78 34 Z" fill="#ffffff" stroke="#14213D" strokeWidth="2" />
          <path d="M62 10 L84 44" stroke="#14213D" strokeWidth="1.5" />
          <circle cx="28" cy="26" r="9" fill="#F4F7FE" stroke="#14213D" strokeWidth="2" />
          <path d="M28 35 V62" stroke="#14213D" strokeWidth="2.5" />
          <path d="M28 42 L48 30" stroke="#14213D" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M28 44 L16 54" stroke="#14213D" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M28 62 L20 78" stroke="#14213D" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M28 62 L38 78" stroke="#14213D" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}

      {screenType === 'tuition' && (
        <g transform="translate(290, 48) scale(0.85)" opacity="0.8">
          <rect x="0" y="8" width="45" height="34" rx="6" fill="#ffffff" stroke="#14213D" strokeWidth="2" />
          <path d="M0 18 H45" stroke="#14213D" strokeWidth="1.5" />
          <rect x="8" y="3" width="5" height="8" rx="2" fill="#F5A524" />
          <rect x="32" y="3" width="5" height="8" rx="2" fill="#F5A524" />
          <circle cx="14" cy="27" r="3" fill="#3D6BEA" />
          <circle cx="23" cy="27" r="3" fill="#3D6BEA" />
          <circle cx="32" cy="27" r="3" fill="#1E9E6A" />
        </g>
      )}

      {screenType === 'approval' && (
        <g transform="translate(325, 32)" opacity="0.4">
          <circle cx="16" cy="16" r="14" stroke="#ffffff" strokeWidth="1.8" strokeDasharray="3 3" fill="none" />
          <path d="M14 20 L18 24 L26 15" stroke="#6FD3FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      )}
    </svg>
  );
};
