import React, { useMemo } from 'react';
import { DailyBreakdown } from '../../types/Spending';
import {
  formatCompactAmount,
  toDateKey,
} from '../../utils/spendingCalculations';

interface CalendarGridProps {
  year: number;
  month: number;
  dailyMap: Map<string, DailyBreakdown>;
  selectedDateKey: string;
  onSelectDate: (dateKey: string) => void;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CalendarGrid: React.FC<CalendarGridProps> = ({
  year,
  month,
  dailyMap,
  selectedDateKey,
  onSelectDate,
}) => {
  const cells = useMemo(() => {
    const first = new Date(year, month, 1);
    const startOffset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const total = Math.ceil((startOffset + daysInMonth) / 7) * 7;
    const result: Array<{ day: number | null; dateKey: string | null }> = [];

    for (let i = 0; i < total; i++) {
      const dayNum = i - startOffset + 1;
      if (dayNum < 1 || dayNum > daysInMonth) {
        result.push({ day: null, dateKey: null });
      } else {
        const dateKey = toDateKey(new Date(year, month, dayNum));
        result.push({ day: dayNum, dateKey });
      }
    }
    return result;
  }, [year, month]);

  const todayKey = toDateKey(new Date());

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:p-4">
      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="py-1 text-center text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-zinc-500"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, idx) => {
          if (!cell.day || !cell.dateKey) {
            return <div key={`empty-${idx}`} className="min-h-[4.25rem]" />;
          }

          const breakdown = dailyMap.get(cell.dateKey);
          const isSelected = cell.dateKey === selectedDateKey;
          const isToday = cell.dateKey === todayKey;

          return (
            <button
              key={cell.dateKey}
              type="button"
              onClick={() => onSelectDate(cell.dateKey!)}
              className={`flex min-h-[4.25rem] flex-col items-center rounded-xl px-0.5 py-1 transition-colors ${
                isSelected
                  ? 'bg-amber-400 text-zinc-900 shadow-md'
                  : isToday
                    ? 'bg-gray-100 hover:bg-gray-200/80 dark:bg-white/10 dark:hover:bg-white/15'
                    : 'hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              <span
                className={`text-xs font-semibold ${
                  isSelected ? 'text-zinc-900' : 'text-gray-700 dark:text-zinc-300'
                }`}
              >
                {cell.day}
              </span>
              <div className="mt-0.5 flex w-full flex-col items-center gap-px overflow-hidden">
                {breakdown && breakdown.income > 0 && (
                  <span
                    className={`w-full truncate text-center text-[8px] font-medium tabular-nums leading-tight sm:text-[9px] ${
                      isSelected ? 'text-emerald-800' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {formatCompactAmount(breakdown.income)}
                  </span>
                )}
                {breakdown && breakdown.expense > 0 && (
                  <span
                    className={`w-full truncate text-center text-[8px] font-medium tabular-nums leading-tight sm:text-[9px] ${
                      isSelected ? 'text-rose-800' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {formatCompactAmount(breakdown.expense)}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
