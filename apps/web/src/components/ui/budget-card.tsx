'use client';

import type React from 'react';
import { useMemo, useRef, useState } from 'react';

const weekData = [
  { day: 'Sun', value: 450 },
  { day: 'Mon', value: 520 },
  { day: 'Tue', value: 680 },
  { day: 'Wed', value: 750 },
  { day: 'Thu', value: 620 },
  { day: 'Fri', value: 780 },
  { day: 'Sat', value: 920 },
];

export function BudgetCard() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(3);
  const chartRef = useRef<SVGSVGElement>(null);

  const maxValue = Math.max(...weekData.map((d) => d.value));
  const minValue = Math.min(...weekData.map((d) => d.value));
  const chartHeight = 118;
  const chartWidth = 400;
  const padding = { top: 26, bottom: 26, left: 8, right: 8 };

  const getY = (value: number) => {
    const range = maxValue - minValue;
    const normalized = (value - minValue) / range;
    return chartHeight - padding.bottom - normalized * (chartHeight - padding.top - padding.bottom);
  };

  const getX = (index: number) => {
    return padding.left + (index / (weekData.length - 1)) * (chartWidth - padding.left - padding.right);
  };

  const generatePath = () => {
    const points = weekData.map((d, i) => ({ x: getX(i), y: getY(d.value) }));

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const tension = 0.35;
      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp1y = p1.y + (p2.y - p0.y) * tension;
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      const cp2y = p2.y - (p3.y - p1.y) * tension;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return path;
  };

  const generateAreaPath = () => {
    const linePath = generatePath();
    const lastPoint = weekData.length - 1;
    return `${linePath} L ${getX(lastPoint)} ${chartHeight - padding.bottom} L ${getX(0)} ${chartHeight - padding.bottom} Z`;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const relativeX = (x / rect.width) * chartWidth;

    let closestIndex = 0;
    let closestDist = Number.POSITIVE_INFINITY;
    weekData.forEach((_, i) => {
      const dist = Math.abs(getX(i) - relativeX);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    });
    setHoveredIndex(closestIndex);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(3);
  };

  const scatteredDots = useMemo(
    () =>
      Array.from({ length: 35 }, (_, i) => ({
        x: 40 + (i % 7) * 42 + (Math.random() - 0.5) * 30,
        y: padding.top + 15 + Math.floor(i / 7) * 15 + (Math.random() - 0.5) * 10,
        opacity: 0.4 + Math.random() * 0.4,
        size: 1.2 + Math.random() * 1.8,
      })),
    [],
  );

  return (
    <div className="relative w-full rounded-[1.25rem] bg-linear-to-b from-muted/50 to-muted/60 p-1.5 shadow-[0_16px_32px_-12px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.4)_inset] sm:rounded-[1.5rem] sm:p-2 dark:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.05)_inset]">
      <div
        className="pointer-events-none absolute inset-px rounded-[1.15rem] bg-linear-to-b from-background/60 to-transparent sm:rounded-[1.4rem] dark:from-background/30"
        style={{ height: '50%' }}
      />

      <div className="relative overflow-hidden rounded-[1rem] bg-card p-4 pb-3 shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)] sm:rounded-[1.25rem] sm:p-5 sm:pb-4 dark:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.05)]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium tracking-wide text-muted-foreground sm:text-sm">Revenue</p>
            <h2 className="mt-1 text-3xl font-semibold leading-none tracking-tight text-card-foreground sm:text-4xl">
              $30,739
            </h2>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-3 py-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2),0_1px_3px_rgba(255,255,255,0.05)]">
              <span className="text-xs font-semibold text-foreground sm:text-sm">+ $317</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-foreground" aria-hidden="true">
                <path
                  d="M2 11L6 7L9 10L14 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 4H14V8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="relative -mr-1 -mt-1 hidden h-[72px] w-[84px] shrink-0 sm:block">
            <MoneyIllustration />
          </div>
        </div>

        <div className="relative mt-1">
          <svg
            ref={chartRef}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'default' }}
            aria-label="Weekly revenue chart"
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5B52E5" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#5B52E5" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#5B52E5" stopOpacity="0.02" />
              </linearGradient>
              <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {weekData.map((_, i) => (
              <line
                key={i}
                x1={getX(i)}
                y1={padding.top}
                x2={getX(i)}
                y2={chartHeight - padding.bottom}
                className="stroke-border transition-opacity duration-200"
                strokeWidth="1"
                strokeDasharray="3 5"
                opacity={hoveredIndex === i ? 0.8 : 0.5}
              />
            ))}

            {scatteredDots.map((dot, i) => (
              <circle key={i} cx={dot.x} cy={dot.y} r={dot.size} className="fill-card" opacity={dot.opacity} />
            ))}

            <path d={generateAreaPath()} fill="url(#areaGradient)" className="transition-all duration-300" />

            <path
              d={generatePath()}
              fill="none"
              stroke="#4F46E5"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {hoveredIndex !== null ? (
              <g className="transition-all duration-150 ease-out">
                <circle
                  cx={getX(hoveredIndex)}
                  cy={getY(weekData[hoveredIndex].value)}
                  r="12"
                  className="fill-card"
                  opacity="0.5"
                />
                <circle
                  cx={getX(hoveredIndex)}
                  cy={getY(weekData[hoveredIndex].value)}
                  r="8"
                  className="fill-card"
                  stroke="#4F46E5"
                  strokeWidth="3"
                  filter="url(#dotGlow)"
                />
              </g>
            ) : null}

            {weekData.map((d, i) => (
              <text
                key={i}
                x={getX(i)}
                y={chartHeight - 8}
                textAnchor="middle"
                className="fill-muted-foreground text-[12px] font-medium"
              >
                {d.day}
              </text>
            ))}
          </svg>

          {hoveredIndex !== null ? (
            <div
              className="pointer-events-none absolute transition-all duration-150 ease-out"
              style={{
                left: `${(getX(hoveredIndex) / chartWidth) * 100}%`,
                top: `${(getY(weekData[hoveredIndex].value) / chartHeight) * 100}%`,
                transform: 'translate(-50%, -140%)',
              }}
            >
              <div className="relative rounded-xl bg-foreground/90 px-4 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.2)] backdrop-blur-sm dark:bg-background/90">
                <span className="text-sm font-semibold text-background dark:text-foreground">
                  ${weekData[hoveredIndex].value}
                </span>
                <div className="absolute -bottom-2 left-1/2 size-0 -translate-x-1/2 border-t-8 border-r-8 border-l-8 border-t-foreground/90 border-r-transparent border-l-transparent dark:border-t-background/90" />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MoneyIllustration() {
  return (
    <svg viewBox="0 0 130 110" className="size-full drop-shadow-lg" aria-hidden="true">
      <defs>
        <linearGradient id="bill1" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="oklch(from var(--card) l c h)" />
          <stop offset="40%" stopColor="oklch(from var(--muted) l c h / 0.8)" />
          <stop offset="100%" stopColor="oklch(from var(--muted) l c h / 0.6)" />
        </linearGradient>
        <linearGradient id="bill2" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="oklch(from var(--card) l c h)" />
          <stop offset="50%" stopColor="oklch(from var(--card) l c h / 0.95)" />
          <stop offset="100%" stopColor="oklch(from var(--muted) l c h / 0.7)" />
        </linearGradient>
        <linearGradient id="bill3" x1="0" y1="0" x2="0.1" y2="1">
          <stop offset="0%" stopColor="oklch(from var(--card) l c h)" />
          <stop offset="100%" stopColor="oklch(from var(--muted) l c h / 0.85)" />
        </linearGradient>
        <linearGradient id="holeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(from var(--border) l c h / 0.8)" />
          <stop offset="100%" stopColor="oklch(from var(--border) l c h / 0.6)" />
        </linearGradient>
        <filter id="billShadow1" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000" floodOpacity="0.05" />
        </filter>
        <filter id="billShadow2" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.1" />
        </filter>
        <filter id="billShadow3" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.08" />
        </filter>
      </defs>

      <g transform="translate(8, 12) rotate(-20, 40, 25)" filter="url(#billShadow1)">
        <rect x="0" y="0" width="80" height="48" rx="6" fill="url(#bill1)" />
        <circle cx="62" cy="14" r="7" fill="url(#holeGrad)" />
        <circle cx="62" cy="34" r="5" fill="url(#holeGrad)" />
      </g>

      <g transform="translate(22, 28) rotate(-10, 40, 25)" filter="url(#billShadow2)">
        <rect x="0" y="0" width="80" height="48" rx="6" fill="url(#bill2)" />
        <circle cx="62" cy="14" r="7" fill="url(#holeGrad)" />
        <circle cx="62" cy="34" r="5" fill="url(#holeGrad)" />
      </g>

      <g transform="translate(38, 44) rotate(-2, 40, 25)" filter="url(#billShadow3)">
        <rect x="0" y="0" width="80" height="48" rx="6" fill="url(#bill3)" />
        <circle cx="62" cy="14" r="7" fill="url(#holeGrad)" />
        <circle cx="62" cy="34" r="5" fill="url(#holeGrad)" />
      </g>
    </svg>
  );
}
