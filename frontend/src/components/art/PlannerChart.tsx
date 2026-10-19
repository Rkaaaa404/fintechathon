'use client';

import React, { useState, useId } from 'react';
import { SEED_DATA } from '@/lib/mockData';

interface PlannerChartProps {
  scenarioKey?: 'on_time' | 'delayed' | 'optimized';
}

export const PlannerChart: React.FC<PlannerChartProps> = ({
  scenarioKey = 'on_time',
}) => {
  const chartId = useId();
  const schedule = SEED_DATA.plannerSchedule;
  const isDelayed = scenarioKey === 'delayed';
  const isOptimized = scenarioKey === 'optimized';
  const scenario = schedule.scenarios[scenarioKey] || schedule.scenarios.on_time;
  const bars = scenario.bars || [
    { month: "Oct", committed: 1.8, reserve: 3.0, total: 4.8, share: 38, netFlow: "+$450", runwayDays: "180d", status: "Healthy" },
    { month: "Nov", committed: 1.7, reserve: 2.7, total: 4.4, share: 39, netFlow: "-$120", runwayDays: "165d", status: "Healthy" },
    { month: "Dec", committed: 1.9, reserve: 2.3, total: 4.2, share: 45, netFlow: "-$200", runwayDays: "145d", status: "Healthy" },
    { month: "Jan", committed: 3.2, reserve: 1.1, total: 4.3, share: 74, netFlow: "-$1,234", runwayDays: "95d", status: "Tuition Due" },
    { month: "Feb", committed: 1.6, reserve: 2.1, total: 3.7, share: 43, netFlow: "+$600", runwayDays: "120d", status: "Healthy" },
    { month: "Mar", committed: 1.5, reserve: 2.6, total: 4.1, share: 37, netFlow: "+$850", runwayDays: "150d", status: "Healthy" }
  ];

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [chartMode, setChartMode] = useState<'combo' | 'motion_curve'>('combo');

  // Chart dimensions & coordinates
  const width = 640;
  const height = 250;
  const padLeft = 48;
  const padRight = 32;
  const padTop = 36;
  const padBottom = 34;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;
  const chartBottom = padTop + chartH;

  const colW = chartW / bars.length;
  const getCenterX = (i: number) => padLeft + (i + 0.5) * colW;

  // Scale: 0 to 5.0 ($5k)
  const pxPerUnit = chartH / 5.0;
  const getY = (val: number) => chartBottom - val * pxPerUnit;
  const safeY = getY(1.0); // Safe minimum $1,000 threshold

  // Colors
  const colCommitted = isDelayed ? "#EF4444" : (isOptimized ? "#3B82F6" : "#F59E0B");
  const colReserve = isOptimized ? "#10B981" : "#2563EB";
  const glowStroke = isDelayed ? "#EF4444" : (isOptimized ? "#10B981" : "#3B82F6");

  // Trajectory points along the top of each month's total reserve + committed
  const trajectoryPoints = bars.map((b, i) => {
    const cx = getCenterX(i);
    const totalH = (b.committed + b.reserve) * pxPerUnit;
    const cy = chartBottom - totalH;
    return { cx, cy, data: b, index: i };
  });

  // Smooth Bezier path string
  const pathD = trajectoryPoints.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.cx} ${pt.cy}`;
    const prev = trajectoryPoints[i - 1];
    const cpX = (prev.cx + pt.cx) / 2;
    return `${acc} C ${cpX} ${prev.cy}, ${cpX} ${pt.cy}, ${pt.cx} ${pt.cy}`;
  }, '');

  // Area under curve
  const areaD = `${pathD} L ${trajectoryPoints[trajectoryPoints.length - 1].cx} ${chartBottom} L ${trajectoryPoints[0].cx} ${chartBottom} Z`;

  // Safe runway curve (reserve only)
  const reservePoints = bars.map((b, i) => {
    const cx = getCenterX(i);
    const cy = chartBottom - b.reserve * pxPerUnit;
    return { cx, cy };
  });

  const reservePathD = reservePoints.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.cx} ${pt.cy}`;
    const prev = reservePoints[i - 1];
    const cpX = (prev.cx + pt.cx) / 2;
    return `${acc} C ${cpX} ${prev.cy}, ${cpX} ${pt.cy}, ${pt.cx} ${pt.cy}`;
  }, '');

  return (
    <div className="w-full relative select-none">
      {/* Chart Sub-header controls */}
      <div className="flex items-center justify-between px-2 mb-2 text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-semibold text-slate-700">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: colReserve }} />
            <span>Available Buffer (Reserve)</span>
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-slate-700">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: colCommitted }} />
            <span>Committed Outflow</span>
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setChartMode('combo')}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
              chartMode === 'combo' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Combo Wave
          </button>
          <button
            type="button"
            onClick={() => setChartMode('motion_curve')}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
              chartMode === 'motion_curve' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Pure Flow Motion
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Clean Modern Motion Graph - Cashflow Runway Planner"
        className="w-full overflow-visible"
        style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
      >
        <defs>
          <style>{`
            @keyframes modernPathDraw {
              0% { stroke-dashoffset: 1200; }
              100% { stroke-dashoffset: 0; }
            }
            @keyframes cometOrbit {
              0% { offset-distance: 0%; opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { offset-distance: 100%; opacity: 0; }
            }
            @keyframes laserSweep {
              0%, 100% { transform: translateX(0px); opacity: 0.15; }
              50% { transform: translateX(${chartW}px); opacity: 0.6; }
            }
            @keyframes barEntrance {
              0% { transform: scaleY(0); }
              100% { transform: scaleY(1); }
            }
            @keyframes glowPulse {
              0%, 100% { filter: drop-shadow(0 0 3px rgba(59, 130, 246, 0.5)); }
              50% { filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.95)); }
            }
            @keyframes rippleWave {
              0% { r: 5px; opacity: 1; }
              100% { r: 16px; opacity: 0; }
            }
            .motion-curve-main {
              stroke-dasharray: 1200;
              animation: modernPathDraw 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .bar-rising {
              transform-box: fill-box;
              transform-origin: bottom center;
              animation: barEntrance 0.7s cubic-bezier(0.2, 0.9, 0.3, 1) both;
            }
            .beacon-pulse {
              animation: glowPulse 2.4s ease-in-out infinite;
            }
            .scanning-laser {
              animation: laserSweep 5s ease-in-out infinite;
            }
          `}</style>

          {/* Area Gradients */}
          <linearGradient id={`flowAreaGrad-${chartId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={glowStroke} stopOpacity="0.32" />
            <stop offset="60%" stopColor={glowStroke} stopOpacity="0.08" />
            <stop offset="100%" stopColor={glowStroke} stopOpacity="0" />
          </linearGradient>

          <linearGradient id={`strokeMotionGrad-${chartId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>

          <linearGradient id={`barGloss-${chartId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Subtle Horizontal Grid lines */}
        {[4.0, 3.0, 2.0, 1.0].map((val) => {
          const y = getY(val);
          return (
            <g key={val}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="#E2E8F0"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <text
                x={padLeft - 10}
                y={y + 3.5}
                textAnchor="end"
                fontSize="10"
                fontWeight="600"
                fill="#94A3B8"
              >
                ${val.toFixed(0)}k
              </text>
            </g>
          );
        })}

        {/* Safe Runway Minimum Threshold Line ($1,000) with Amber Glow */}
        <line
          x1={padLeft}
          y1={safeY}
          x2={width - padRight}
          y2={safeY}
          stroke="#F59E0B"
          strokeWidth="1.6"
          strokeDasharray="4 3"
        />
        <rect
          x={width - padRight - 88}
          y={safeY - 9}
          width="88"
          height="18"
          rx="4"
          fill="#FEF3C7"
          stroke="#F59E0B"
          strokeWidth="1"
        />
        <text
          x={width - padRight - 44}
          y={safeY + 3.5}
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill="#B45309"
        >
          Safe Min $1.0k
        </text>

        {/* Ambient Laser Scanner Line moving across graph */}
        <line
          className="scanning-laser"
          x1={padLeft}
          y1={padTop}
          x2={padLeft}
          y2={chartBottom}
          stroke={glowStroke}
          strokeWidth="1.5"
          opacity="0.25"
        />

        {/* Area Fill beneath curve */}
        <path
          d={areaD}
          fill={`url(#flowAreaGrad-${chartId})`}
          className="transition-all duration-700"
        />

        {/* Combo Mode: Stacked Bars */}
        {chartMode === 'combo' && (
          <g>
            {bars.map((b, i) => {
              const cx = getCenterX(i);
              const barW = 38;
              const x = cx - barW / 2;

              const committedH = Math.max(b.committed * pxPerUnit, 4);
              const reserveH = Math.max(b.reserve * pxPerUnit, 4);
              const totalH = committedH + reserveH;

              const committedY = chartBottom - committedH;
              const reserveY = chartBottom - totalH;

              const isJanDue = i === 3;
              const isHovered = hoveredIdx === i;

              return (
                <g
                  key={b.month}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Subtle column glow when hovered */}
                  {isHovered && (
                    <rect
                      x={cx - colW / 2 + 2}
                      y={padTop}
                      width={colW - 4}
                      height={chartH + 20}
                      fill="#EFF6FF"
                      opacity="0.8"
                      rx="8"
                    />
                  )}

                  {/* Reserve Stack (Upper) */}
                  <rect
                    className="bar-rising"
                    x={x}
                    y={reserveY}
                    width={barW}
                    height={reserveH}
                    fill={colReserve}
                    rx="5"
                    opacity={isHovered ? 1 : 0.9}
                    style={{ animationDelay: `${i * 0.07}s` }}
                  />
                  {/* Gloss overlay */}
                  <rect
                    x={x}
                    y={reserveY}
                    width={barW / 2}
                    height={reserveH}
                    fill={`url(#barGloss-${chartId})`}
                    rx="5"
                  />

                  {/* Committed Stack (Lower) */}
                  <rect
                    className="bar-rising"
                    x={x}
                    y={committedY}
                    width={barW}
                    height={committedH}
                    fill={colCommitted}
                    rx="5"
                    opacity={isHovered ? 1 : 0.9}
                    style={{ animationDelay: `${i * 0.07}s` }}
                  />

                  {/* Divider line between stacks */}
                  <line
                    x1={x + 2}
                    y1={committedY}
                    x2={x + barW - 2}
                    y2={committedY}
                    stroke="#FFFFFF"
                    strokeWidth="1.2"
                    opacity="0.9"
                  />

                  {/* Top Value Label */}
                  <text
                    x={cx}
                    y={reserveY - 6}
                    textAnchor="middle"
                    fontSize="10.5"
                    fontWeight="700"
                    fill={isJanDue && isDelayed ? '#EF4444' : '#1E293B'}
                  >
                    ${b.total.toFixed(1)}k
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* Secondary Motion Curve for Reserve only */}
        {chartMode === 'motion_curve' && (
          <path
            d={reservePathD}
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.75"
          />
        )}

        {/* Primary Animated Spline Motion Line */}
        <path
          className="motion-curve-main beacon-pulse"
          d={pathD}
          fill="none"
          stroke={`url(#strokeMotionGrad-${chartId})`}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interactive Data Markers along curve */}
        {trajectoryPoints.map((pt, i) => {
          const isHovered = hoveredIdx === i;
          const isJanDue = i === 3;

          return (
            <g
              key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Ripple expanding circle on Jan Due or Hovered */}
              {(isHovered || isJanDue) && (
                <circle
                  cx={pt.cx}
                  cy={pt.cy}
                  r={isHovered ? "12" : "8"}
                  fill={isJanDue ? "#EF4444" : "#3B82F6"}
                  opacity="0.25"
                  className="transition-all duration-300"
                />
              )}

              {/* Core Marker Point */}
              <circle
                cx={pt.cx}
                cy={pt.cy}
                r={isHovered ? "6" : "4.5"}
                fill="#FFFFFF"
                stroke={isJanDue ? "#EF4444" : (isOptimized ? "#10B981" : "#2563EB")}
                strokeWidth={isHovered ? "3.2" : "2.4"}
                className="transition-all duration-200"
              />

              {/* Month Label */}
              <text
                x={pt.cx}
                y={chartBottom + 18}
                textAnchor="middle"
                fontSize="11"
                fontWeight={isHovered || isJanDue ? '700' : '600'}
                fill={isJanDue ? '#EF4444' : (isHovered ? '#1E40AF' : '#64748B')}
              >
                {pt.data.month}
              </text>
            </g>
          );
        })}

        {/* Vertical Crosshair Guide on Hover */}
        {hoveredIdx !== null && trajectoryPoints[hoveredIdx] && (
          <g pointerEvents="none">
            <line
              x1={trajectoryPoints[hoveredIdx].cx}
              y1={padTop}
              x2={trajectoryPoints[hoveredIdx].cx}
              y2={chartBottom}
              stroke="#3B82F6"
              strokeWidth="1.4"
              strokeDasharray="3 2"
              opacity="0.75"
            />
          </g>
        )}
      </svg>

      {/* Floating Modern Interactive Glass Tooltip */}
      {hoveredIdx !== null && bars[hoveredIdx] && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700/60 pointer-events-none z-30 transition-all duration-200 animate-fadeIn"
          style={{ minWidth: '260px' }}
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/60 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-sm text-white">
                {bars[hoveredIdx].month} {hoveredIdx === 3 ? '• Tuition Due' : ''}
              </span>
            </div>
            <span className={`text-[10.5px] px-2 py-0.5 rounded-full font-bold ${
              bars[hoveredIdx].status === 'Healthy'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {bars[hoveredIdx].status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div className="text-slate-400">
              Total Assets: <b className="text-white">${bars[hoveredIdx].total.toFixed(2)}k</b>
            </div>
            <div className="text-slate-400">
              Reserve Buffer: <b className="text-blue-300">${bars[hoveredIdx].reserve.toFixed(2)}k</b>
            </div>
            <div className="text-slate-400">
              Committed Outflow: <b className="text-amber-300">${bars[hoveredIdx].committed.toFixed(2)}k</b>
            </div>
            <div className="text-slate-400">
              Runway Days: <b className="text-emerald-300">{bars[hoveredIdx].runwayDays}</b>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
