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
    { r: 104, n: 26, name: 'outer', active: outerActive, dir: 'cw', speed: '24s' },
    { r: 76, n: 20, name: 'middle', active: middleActive, dir: 'ccw', speed: '18s' },
    { r: 48, n: 14, name: 'inner', active: innerActive, dir: 'cw', speed: '12s' },
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
    // Midpoint for animated laser projectile
    const mx = (sx + ex) / 2;
    const my = (sy + ey) / 2;
    attackers.push({ sx, sy, ex, ey, mx, my, angle, id: i });
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
          <stop offset="70%" stopColor="#1C3EAA" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0A1440" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="laserBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF4550" stopOpacity="0.2" />
          <stop offset="70%" stopColor="#FF6B6F" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFA4A7" stopOpacity="1" />
        </linearGradient>

        <radialGradient id="shieldDeflectGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6FD3FF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#3D6BEA" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0A1440" stopOpacity="0" />
        </radialGradient>

        <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <style>{`
          @keyframes radarSweep {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes orbitCW {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes orbitCCW {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          @keyframes laserStream {
            0% { stroke-dashoffset: 24; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes projectilePulse {
            0% { transform: scale(0.8); opacity: 0.4; }
            50% { transform: scale(1.3); opacity: 1; }
            100% { transform: scale(0.8); opacity: 0.4; }
          }
          @keyframes sparkRadiate {
            0% { transform: scale(0.6); opacity: 0.9; }
            50% { transform: scale(1.4); opacity: 1; }
            100% { transform: scale(0.6); opacity: 0.9; }
          }
          @keyframes shieldBarrierPulse {
            0% { stroke-opacity: 0.4; transform: scale(0.99); }
            50% { stroke-opacity: 0.9; transform: scale(1.01); }
            100% { stroke-opacity: 0.4; transform: scale(0.99); }
          }
          @keyframes coreAuraPulse {
            0% { r: 28px; stroke-opacity: 0.7; }
            50% { r: 32px; stroke-opacity: 1; }
            100% { r: 28px; stroke-opacity: 0.7; }
          }
          @keyframes warningFlash {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.85; }
          }
          .radar-sweep {
            transform-origin: ${cx}px ${cy}px;
            animation: radarSweep 4.5s linear infinite;
          }
          .orbit-cw {
            transform-origin: ${cx}px ${cy}px;
            animation: orbitCW 24s linear infinite;
          }
          .orbit-ccw {
            transform-origin: ${cx}px ${cy}px;
            animation: orbitCCW 18s linear infinite;
          }
          .attack-laser-line {
            animation: laserStream 0.8s linear infinite;
          }
          .attack-projectile {
            animation: projectilePulse 1.2s ease-in-out infinite;
          }
          .spark-burst {
            animation: sparkRadiate 0.7s ease-in-out infinite alternate;
          }
          .shield-pulse-ring {
            transform-origin: ${cx}px ${cy}px;
            animation: shieldBarrierPulse 2.4s ease-in-out infinite;
          }
          .core-aura {
            animation: coreAuraPulse 2s ease-in-out infinite;
          }
          .replay-active-warning {
            animation: warningFlash 0.5s ease-in-out infinite;
          }
        `}</style>
      </defs>

      {/* Atmospheric Radar Glow Background */}
      {/* Atmospheric Radar Glow Background */}
      <circle cx={cx} cy={cy} r="108" fill="url(#mapGlow)" />

      {/* Sweeping Radar Scanner Beam clamped strictly within outer ring */}
      <g className="radar-sweep" opacity="0.6">
        <line
          x1={cx}
          y1={cy}
          x2={cx + 104}
          y2={cy}
          stroke="#6FD3FF"
          strokeWidth="1.5"
          strokeLinecap="round"
          filter="url(#laserGlow)"
        />
        {/* Subtle radar gradient wedge */}
        <path
          d={`M ${cx} ${cy} L ${cx + 104} ${cy} A 104 104 0 0 0 ${cx + 100} ${cy - 28} Z`}
          fill="#6FD3FF"
          fillOpacity="0.08"
        />
      </g>

      {/* Concentric Defense Orbit Rings & Rotating Micro Nodes */}
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
              opacity={ring.active ? 0.9 : 0.2}
            />
          );
        }

        const orbitClass = rIdx % 2 === 0 ? 'orbit-cw' : 'orbit-ccw';

        return (
          <g key={ring.name}>
            {/* Active barrier shield ring with pulse */}
            <circle
              cx={cx}
              cy={cy}
              r={ring.r}
              stroke={ring.active ? '#3D6BEA' : '#475569'}
              strokeWidth={ring.active ? '1.8' : '1'}
              strokeOpacity={ring.active ? 0.85 : 0.25}
              strokeDasharray={ring.active ? (rIdx === 0 ? 'none' : '6 4') : '4 4'}
              fill="none"
              className={ring.active ? 'shield-pulse-ring' : ''}
            />
            {/* Ambient aura ring when active */}
            {ring.active && (
              <circle
                cx={cx}
                cy={cy}
                r={ring.r + 2}
                stroke="#6FD3FF"
                strokeWidth="0.8"
                strokeOpacity="0.3"
                strokeDasharray="2 8"
                fill="none"
              />
            )}
            {/* Rotating telemetry nodes */}
            <g className={orbitClass}>{dots}</g>
          </g>
        );
      })}

      {/* Active Attack Streams, Projectiles & Collision Sparks */}
      {attackers.map((att) => {
        const angleDeg = (att.angle * 180) / Math.PI;

        return (
          <g key={att.id}>
            {/* Outer attacker launch origin node */}
            <circle
              cx={att.sx.toFixed(1)}
              cy={att.sy.toFixed(1)}
              r="4"
              fill="#FF4550"
              filter="url(#laserGlow)"
            />

            {/* Glowing animated attack laser line streaming inward */}
            <line
              x1={att.sx.toFixed(1)}
              y1={att.sy.toFixed(1)}
              x2={att.ex.toFixed(1)}
              y2={att.ey.toFixed(1)}
              stroke="url(#laserBeamGrad)"
              strokeWidth="2.2"
              strokeDasharray="6 4"
              strokeLinecap="round"
              className="attack-laser-line"
              style={{
                animationDuration: isReplaying ? '0.4s' : '0.8s',
                animationDelay: `${att.id * 0.12}s`,
              }}
            />

            {/* Mid-flight glowing laser particle bullet traveling along the beam */}
            <circle
              cx={att.mx.toFixed(1)}
              cy={att.my.toFixed(1)}
              r="3.2"
              fill="#FFF0F0"
              filter="url(#laserGlow)"
              className="attack-projectile"
              style={{ animationDelay: `${att.id * 0.2}s` }}
            />

            {/* Deflection Shield Spark Burst at barrier impact point */}
            <g transform={`translate(${att.ex.toFixed(1)}, ${att.ey.toFixed(1)})`}>
              {/* Forcefield impact ripple */}
              <circle
                cx="0"
                cy="0"
                r="10"
                stroke="#6FD3FF"
                strokeWidth="1.5"
                strokeOpacity="0.75"
                fill="none"
                className="spark-burst"
                style={{ animationDelay: `${att.id * 0.15}s` }}
              />
              <circle
                cx="0"
                cy="0"
                r="6.5"
                fill="#0A1440"
                stroke="#FF4550"
                strokeWidth="1.2"
              />

              {/* 4 Kinetic Deflection Sparks shooting out */}
              <g className="spark-burst" style={{ animationDelay: `${att.id * 0.12}s` }}>
                <line x1="-5" y1="-5" x2="-8" y2="-8" stroke="#FFA4A7" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="5" y1="-5" x2="8" y2="-8" stroke="#6FD3FF" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="-5" y1="5" x2="-8" y2="8" stroke="#6FD3FF" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="5" y1="5" x2="8" y2="8" stroke="#FFA4A7" strokeWidth="1.5" strokeLinecap="round" />
              </g>

              {/* Blocked Red "X" Marker */}
              <path
                d="M-3.5 -3.5 L3.5 3.5 M3.5 -3.5 L-3.5 3.5"
                stroke="#FF4550"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </g>
          </g>
        );
      })}

      {/* Central Defensive Vault Core: ($0 Funds Lost) */}
      <circle
        cx={cx}
        cy={cy}
        r="34"
        stroke="#6FD3FF"
        strokeWidth="1.2"
        strokeDasharray="4 4"
        fill="none"
        strokeOpacity="0.5"
        className="orbit-cw"
      />
      <circle
        cx={cx}
        cy={cy}
        r="28"
        fill="#0A1440"
        stroke={fundsLost > 0 ? '#E5484D' : '#3D6BEA'}
        strokeWidth="2"
        filter="url(#laserGlow)"
        className="core-aura"
      />
      <text
        x={cx}
        y={cy + 6}
        textAnchor="middle"
        fontFamily="'IBM Plex Sans', sans-serif"
        fontWeight="600"
        fontSize="24"
        fill={fundsLost > 0 ? '#FF6B6F' : '#FFFFFF'}
        letterSpacing="-0.5px"
      >
        ${fundsLost}
      </text>
      <text
        x={cx}
        y={cy + 20}
        textAnchor="middle"
        fontFamily="'IBM Plex Sans', sans-serif"
        fontWeight="500"
        fontSize="9"
        fill={fundsLost > 0 ? '#FFA4A7' : '#9DB8FF'}
        letterSpacing="0.5px"
      >
        {fundsLost > 0 ? 'FUNDS COMPROMISED' : 'FUNDS PROTECTED'}
      </text>
    </svg>
  );
};
