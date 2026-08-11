import React from 'react';
import { MonthlySummary } from '../../types/Spending';
import { formatCurrency } from '../../utils/formatCurrency';

interface MonthlySummaryCardsProps {
  summary: MonthlySummary;
}

const MonthlySummaryCards: React.FC<MonthlySummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <div className="px-3 py-3 text-center border border-gray-200 shadow-sm rounded-2xl bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-zinc-500 sm:text-xs">
          Balance
        </p>
        <p className="mt-1 text-sm font-semibold truncate tabular-nums text-emerald-600 dark:text-emerald-400 sm:text-base">
          {formatCurrency(summary.income)}
        </p>
      </div>
      <div className="px-3 py-3 text-center border border-gray-200 shadow-sm rounded-2xl bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-zinc-500 sm:text-xs">
          Expense
        </p>
        <p className="mt-1 text-sm font-semibold truncate tabular-nums text-rose-600 dark:text-rose-400 sm:text-base">
          {formatCurrency(summary.expense)}
        </p>
      </div>
      <div className="px-3 py-3 text-center border border-gray-200 shadow-sm rounded-2xl bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-zinc-500 sm:text-xs">
          Change
        </p>
        <p
          className={`mt-1 truncate text-sm font-semibold tabular-nums sm:text-base ${
            summary.balance >= 0
              ? 'text-gray-900 dark:text-zinc-100'
              : 'text-rose-600 dark:text-rose-400'
          }`}
        >
          {formatCurrency(summary.balance)}
        </p>
      </div>
    </div>
  );
};

export default MonthlySummaryCards;
