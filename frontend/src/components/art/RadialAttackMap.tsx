'use client';

import React from 'react';

interface RadialAttackMapProps {
  fundsLost?: number;
  outerActive?: boolean;
  middleActive?: boolean;
  innerActive?: boolean;
  isReplaying?: boolean;
}

export const RadialAttackMap: React.FC<RadialAttackMapProps> = ({
  fundsLost = 0,
  outerActive = true,
  middleActive = true,
  innerActive = true,
  isReplaying = false,
}) => {
  const cx = 170;
  const cy = 145;

  const rings = [
    { r: 104, n: 26, name: 'outer', active: outerActive },
    { r: 76, n: 20, name: 'middle', active: middleActive },
    { r: 48, n: 14, name: 'inner', active: innerActive },
  ];

  const colors = ['#5B8CFF', '#9DB8FF', '#FFFFFF', '#6FD3FF', '#3D6BEA'];

  // Stop radius calculation
  let stopRadius = 104;
  if (!outerActive && middleActive) {
    stopRadius = 76;
  } else if (!outerActive && !middleActive && innerActive) {
    stopRadius = 48;
  } else if (!outerActive && !middleActive && !innerActive) {
    stopRadius = 24;
  }

  // Generate 6 attack packets
  const attackers = [];
  for (let i = 0; i < 6; i++) {
    const angle = -2.7 + i * 0.95;
    const startR = 138;
    const sx = cx + startR * Math.cos(angle);
    const sy = cy + startR * Math.sin(angle);
    const ex = cx + stopRadius * Math.cos(angle);
    const ey = cy + stopRadius * Math.sin(angle);
    attackers.push({ sx, sy, ex, ey, angle });
  }

  return (
    <svg
      className="radial-attack-map-svg"
      viewBox="0 0 340 290"
      width="100%"
      height="260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Radial attack map"
    >
      <defs>
        <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2B45C8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#0A1440" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Radial background glow */}
      <circle cx={cx} cy={cy} r="130" fill="url(#mapGlow)" />

      {/* Outer dashed tick ring r=122 */}
      <circle
        cx={cx}
        cy={cy}
        r="122"
        stroke="#9DB8FF"
        strokeWidth="1"
        strokeOpacity="0.35"
        strokeDasharray="1 5"
        fill="none"
      />

      {/* Defense rings & decorative dots */}
      {rings.map((ring, rIdx) => {
        const dots = [];
        for (let i = 0; i < ring.n; i++) {
          const angle = (2 * Math.PI * i) / ring.n + rIdx * 0.45;
          const x = cx + ring.r * Math.cos(angle);
          const y = cy + ring.r * Math.sin(angle);
          const dotR = 2.2 + (i % 3) * 0.8;
          const dotColor = colors[(i + rIdx * 2) % colors.length];
          dots.push(
            <circle
              key={i}
              cx={x.toFixed(1)}
              cy={y.toFixed(1)}
              r={dotR}
              fill={dotColor}
              opacity={ring.active ? 0.85 : 0.25}
            />
          );
        }

        return (
          <g key={ring.name}>
            <circle
              cx={cx}
              cy={cy}
              r={ring.r}
              stroke="#3D6BEA"
              strokeWidth="1.2"
              strokeOpacity={ring.active ? 0.65 : 0.2}
              strokeDasharray={ring.active ? 'none' : '4 4'}
              fill="none"
            />
            {dots}
          </g>
        );
      })}

      {/* Attack lines & blocked X markers */}
      {attackers.map((att, i) => (
        <g key={i}>
          <line
            x1={att.sx.toFixed(1)}
            y1={att.sy.toFixed(1)}
            x2={att.ex.toFixed(1)}
            y2={att.ey.toFixed(1)}
            stroke="#FF6B6F"
            strokeWidth="1.8"
            strokeDasharray="3 3"
            opacity="0.9"
            className={isReplaying ? 'replay-pulse' : ''}
          />
          <circle cx={att.sx.toFixed(1)} cy={att.sy.toFixed(1)} r="4.5" fill="#FF6B6F" />
          <g transform={`translate(${att.ex.toFixed(1)}, ${att.ey.toFixed(1)})`}>
            <circle cx="0" cy="0" r="5" fill="#0A1440" />
            <path
              d="M-3 -3 L3 3 M3 -3 L-3 3"
              stroke="#E5484D"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        </g>
      ))}

      {/* Center status: ($0 Funds Lost) */}
      <circle
        cx={cx}
        cy={cy}
        r="28"
        fill="#0A1440"
        stroke="#3D6BEA"
        strokeWidth="1.5"
        opacity="0.95"
      />
      <text
        x={cx}
        y={cy + 6}
        textAnchor="middle"
        fontFamily="'IBM Plex Sans', sans-serif"
        fontWeight="300"
        fontSize="28"
        fill={fundsLost > 0 ? '#E5484D' : '#FFFFFF'}
      >
        ${fundsLost}
      </text>
      <text
        x={cx}
        y={cy + 20}
        textAnchor="middle"
        fontFamily="'IBM Plex Sans', sans-serif"
        fontSize="8.5"
        fill="#AFC4FF"
      >
        {fundsLost > 0 ? 'Lost' : 'Funds lost'}
      </text>
    </svg>
  );
};
