import React, { useMemo } from 'react';
import { HoldingWithMetrics } from '../../types/Investment';
import { formatCurrency, formatPercent } from '../../utils/formatCurrency';

interface AllocationChartProps {
  holdings: HoldingWithMetrics[];
}

const CHART_COLORS = [
  '#34d399',
  '#3b82f6',
  '#a855f7',
  '#f97316',
  '#ec4899',
  '#14b8a6',
  '#6366f1',
  '#ef4444',
];

const AllocationChart: React.FC<AllocationChartProps> = ({ holdings }) => {
  const segments = useMemo(() => {
    let cumulative = 0;
    return holdings.map((holding, i) => {
      const start = cumulative;
      cumulative += holding.allocationPercent;
      return {
        ...holding,
        start,
        end: cumulative,
        color: CHART_COLORS[i % CHART_COLORS.length],
      };
    });
  }, [holdings]);

  const describeArc = (startPercent: number, endPercent: number, radius: number) => {
    const startAngle = (startPercent / 100) * 360 - 90;
    const endAngle = (endPercent / 100) * 360 - 90;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = 50 + radius * Math.cos(startRad);
    const y1 = 50 + radius * Math.sin(startRad);
    const x2 = 50 + radius * Math.cos(endRad);
    const y2 = 50 + radius * Math.sin(endRad);
    const largeArc = endPercent - startPercent > 50 ? 1 : 0;
    return `M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  if (holdings.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 h-64 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 text-gray-500 dark:text-gray-400">
        Add holdings to see allocation
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50">
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Asset Allocation</p>
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        <div className="relative w-48 h-48 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {segments.map((seg) => (
              <path
                key={seg.ticker}
                d={describeArc(seg.start, seg.end, 40)}
                fill={seg.color}
                className="transition-opacity duration-200 hover:opacity-80"
              />
            ))}
            <circle cx="50" cy="50" r="24" className="fill-white dark:fill-gray-800" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {holdings.length} assets
            </span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-3">
          {segments.map((seg) => (
            <div key={seg.ticker} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {seg.ticker}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{seg.name}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatPercent(seg.allocationPercent)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatCurrency(seg.currentValue)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllocationChart;
