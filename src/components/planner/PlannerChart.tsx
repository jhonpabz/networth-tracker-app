import React, { useMemo, useState } from 'react';
import { PlannerItemBreakdown } from '../../types/Planner';
import { formatCurrency } from '../../utils/formatCurrency';

interface PlannerChartProps {
  items: PlannerItemBreakdown[];
  totalMonthly: number;
}

const PlannerChart: React.FC<PlannerChartProps> = ({ items, totalMonthly }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const segments = useMemo(() => {
    let cumulative = 0;
    return items.map((item) => {
      const start = cumulative;
      cumulative += item.percent;
      return { ...item, start, end: cumulative };
    });
  }, [items]);

  const describeArc = (startPercent: number, endPercent: number, radius: number) => {
    if (endPercent - startPercent <= 0) return '';
    if (endPercent - startPercent >= 99.999) {
      return `M 50 ${50 - radius} A ${radius} ${radius} 0 1 1 49.999 ${50 - radius} Z`;
    }
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

  if (items.length === 0 || totalMonthly <= 0) {
    return (
      <div className="flex items-center justify-center p-6 h-64 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 text-gray-500 dark:text-gray-400">
        Add allocations to see the breakdown
      </div>
    );
  }

  const active = hoveredId ? items.find((i) => i.id === hoveredId) : null;

  return (
    <div className="p-6 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50">
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Monthly Allocation</p>
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        <div className="relative w-52 h-52 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {segments.map((seg) => {
              const path = describeArc(seg.start, seg.end, 40);
              if (!path) return null;
              const isDimmed = hoveredId !== null && hoveredId !== seg.id;
              return (
                <path
                  key={seg.id}
                  d={path}
                  fill={seg.color}
                  className="transition-opacity duration-200 cursor-pointer"
                  style={{ opacity: isDimmed ? 0.35 : 1 }}
                  onMouseEnter={() => setHoveredId(seg.id)}
                  onMouseLeave={() => setHoveredId(null)}
                />
              );
            })}
            <circle cx="50" cy="50" r="24" className="fill-white dark:fill-gray-800 pointer-events-none" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 text-center">
            {active ? (
              <>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-full">
                  {active.name}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {active.percent.toFixed(1)}%
                </span>
              </>
            ) : (
              <>
                <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {items.length} items
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 w-full space-y-3 max-h-64 overflow-y-auto pr-1">
          {segments.map((seg) => (
            <div
              key={seg.id}
              className="flex items-center justify-between gap-3 cursor-pointer rounded-lg px-1 py-0.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40"
              onMouseEnter={() => setHoveredId(seg.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {seg.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {seg.categoryName}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {seg.percent.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatCurrency(seg.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlannerChart;
