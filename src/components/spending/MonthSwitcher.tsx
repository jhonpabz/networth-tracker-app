import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMonthLabel } from '../../utils/spendingCalculations';

interface MonthSwitcherProps {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
}

const MonthSwitcher: React.FC<MonthSwitcherProps> = ({ year, month, onChange }) => {
  const goPrev = () => {
    if (month === 0) onChange(year - 1, 11);
    else onChange(year, month - 1);
  };

  const goNext = () => {
    if (month === 11) onChange(year + 1, 0);
    else onChange(year, month + 1);
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      <button
        type="button"
        onClick={goPrev}
        aria-label="Previous month"
        className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-200/80 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <h2 className="min-w-[8rem] text-center text-base font-semibold tracking-wide text-gray-900 dark:text-zinc-100">
        {getMonthLabel(year, month)}
      </h2>
      <button
        type="button"
        onClick={goNext}
        aria-label="Next month"
        className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-200/80 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default MonthSwitcher;
