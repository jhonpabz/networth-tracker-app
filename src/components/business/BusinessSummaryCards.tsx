import React from 'react';
import { BusinessSummary } from '../../types/Business';
import { formatCurrency } from '../../utils/formatCurrency';

interface BusinessSummaryCardsProps {
  summary: BusinessSummary;
}

const BusinessSummaryCards: React.FC<BusinessSummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <div className="rounded-2xl border border-gray-200 bg-white/80 px-3 py-3 text-center shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-zinc-500 sm:text-xs">
          Income
        </p>
        <p className="mt-1 truncate text-sm font-semibold tabular-nums text-emerald-600 dark:text-emerald-400 sm:text-base">
          {formatCurrency(summary.income)}
        </p>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white/80 px-3 py-3 text-center shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-zinc-500 sm:text-xs">
          Credit
        </p>
        <p className="mt-1 truncate text-sm font-semibold tabular-nums text-rose-600 dark:text-rose-400 sm:text-base">
          {formatCurrency(summary.credit)}
        </p>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white/80 px-3 py-3 text-center shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-zinc-500 sm:text-xs">
          Balance
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

export default BusinessSummaryCards;
