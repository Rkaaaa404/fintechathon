'use client';

import React from 'react';
import { SEED_DATA } from '@/lib/mockData';

interface PlannerChartProps {
  scenarioKey?: 'on_time' | 'delayed' | 'optimized';
}

export const PlannerChart: React.FC<PlannerChartProps> = ({
  scenarioKey = 'on_time',
}) => {
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

  // Clean, spacious coordinates for SVG bars
  const width = 520;
  const height = 210;
  const padLeft = 45;
  const padRight = 25;
  const padTop = 25;
  const padBottom = 28;

  const chartW = width - padLeft - padRight; // 450px
  const chartH = height - padTop - padBottom; // 157px
  const chartBottom = padTop + chartH;

  const colW = chartW / bars.length; // 75px per column
  const getCenterX = (i: number) => padLeft + (i + 0.5) * colW;

  // Max scale is 5.0 ($5k)
  const pxPerUnit = chartH / 5.0;
  const getY = (val: number) => chartBottom - val * pxPerUnit;

  // Safe minimum line at 1.0 ($1,000)
  const safeY = getY(1.0);

  // Palette matched with app tokens
  const colCommitted = isDelayed ? "#E5484D" : (isOptimized ? "#3D6BEA" : "#F5A524");
  const colReserve = isOptimized ? "#10B981" : "#3D6BEA";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="AegisPath Runway Stacked Bar Chart"
      style={{
        display: 'block',
        width: '100%',
        fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
      }}
    >
      {/* Gridlines & Y-Axis Labels */}
      {[4.0, 3.0, 2.0, 1.0].map((val) => (
        <g key={val}>
          <line
            x1={padLeft}
            y1={getY(val)}
            x2={width - padRight}
            y2={getY(val)}
            stroke="#EEF2F9"
            strokeWidth="1"
          />
          <text
            x={padLeft - 8}
            y={getY(val) + 3.5}
            textAnchor="end"
            fontSize="9.5"
            fontWeight="600"
            fill="#5B6B8C"
          >
            ${val.toFixed(0)}k
          </text>
        </g>
      ))}

      {/* Safe Minimum Threshold ($1,000) Dashed Amber Line */}
      <line
        x1={padLeft}
        y1={safeY}
        x2={width - padRight}
        y2={safeY}
        stroke="#F5A524"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      {/* White background chip with 4px padding to prevent overlap with bars */}
      <rect
        x={width - padRight - 76}
        y={safeY - 8}
        width="76"
        height="16"
        rx="4"
        fill="#FFFFFF"
        stroke="#F5A524"
        strokeWidth="1"
      />
      <text
        x={width - padRight - 38}
        y={safeY + 3.5}
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="700"
        fill="#B7791F"
      >
        Safe Min $1.0k
      </text>

      {/* Baseline X-Axis */}
      <line
        x1={padLeft}
        y1={chartBottom}
        x2={width - padRight}
        y2={chartBottom}
        stroke="#CBD5E1"
        strokeWidth="1.5"
      />

      {/* Stacked Bars for each Month */}
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
        const isDipMonth = isDelayed && isJanDue;

        return (
          <g key={b.month}>
            {/* Visual highlight background column for Jan Due */}
            {isJanDue && (
              <rect
                x={x - 4}
                y={padTop}
                width={barW + 8}
                height={chartH + 22}
                fill="#FFFBEB"
                opacity="0.8"
                rx="6"
              />
            )}

            {/* Upper Stack: Available Buffer */}
            <rect
              x={x}
              y={reserveY}
              width={barW}
              height={reserveH}
              fill={colReserve}
              rx="3"
              opacity="0.95"
              stroke={isJanDue ? '#D97706' : 'none'}
              strokeWidth={isJanDue ? 1.5 : 0}
            />

            {/* Lower Stack: Committed Outflows / Tuition */}
            <rect
              x={x}
              y={committedY}
              width={barW}
              height={committedH}
              fill={colCommitted}
              rx="3"
              stroke={isJanDue ? '#D97706' : 'none'}
              strokeWidth={isJanDue ? 1.5 : 0}
            />

            {/* Clean subtle divider between stacks */}
            <line
              x1={x + 2}
              y1={committedY}
              x2={x + barW - 2}
              y2={committedY}
              stroke="#FFFFFF"
              strokeWidth="1.2"
              opacity="0.8"
            />

            {/* Value on top of bar */}
            <text
              x={cx}
              y={reserveY - 5}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill={isDipMonth ? '#E5484D' : '#0A1440'}
            >
              ${b.total.toFixed(1)}k
            </text>

            {/* Month Label on X-Axis */}
            <text
              x={cx}
              y={chartBottom + 16}
              textAnchor="middle"
              fontSize="10.5"
              fontWeight={i === 3 ? '700' : '600'}
              fill={
                i === 3 ? (isDelayed ? '#E5484D' : '#3D6BEA') : '#5B6B8C'
              }
            >
              {b.month}
              {i === 3 ? (isOptimized ? ' (Split)' : ' (Due)') : ''}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
