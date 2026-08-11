import React from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Pencil,
  Trash2,
} from 'lucide-react';
import { BusinessEntry } from '../../types/Business';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  formatDayHeader,
  formatTransactionTime,
  toDateKey,
} from '../../utils/businessCalculations';

export type BusinessHistoryView = 'month' | 'all';

interface BusinessTransactionFeedProps {
  view: BusinessHistoryView;
  onViewChange: (view: BusinessHistoryView) => void;
  monthLabel: string;
  entries: BusinessEntry[];
  income: number;
  credit: number;
  onEdit: (entry: BusinessEntry) => void;
  onDelete: (id: string) => void;
}

const BusinessTransactionFeed: React.FC<BusinessTransactionFeedProps> = ({
  view,
  onViewChange,
  monthLabel,
  entries,
  income,
  credit,
  onEdit,
  onDelete,
}) => {
  const headerLabel = view === 'all' ? 'All Time' : monthLabel;
  const emptyMessage =
    view === 'all' ? 'No entries yet' : 'No entries this month';

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-gray-800 dark:text-zinc-200">
            {headerLabel}
          </h3>
          <div className="flex shrink-0 rounded-full border border-gray-200 bg-gray-50 p-0.5 dark:border-white/10 dark:bg-white/5">
            <button
              type="button"
              onClick={() => onViewChange('month')}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                view === 'month'
                  ? 'bg-amber-400 text-zinc-900'
                  : 'text-gray-500 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300'
              }`}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => onViewChange('all')}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                view === 'all'
                  ? 'bg-amber-400 text-zinc-900'
                  : 'text-gray-500 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300'
              }`}
            >
              All
            </button>
          </div>
        </div>
        <p className="text-xs tabular-nums text-gray-400 dark:text-zinc-500">
          <span className="text-emerald-600 dark:text-emerald-400">
            IN {formatCurrency(income)}
          </span>
          <span className="mx-1.5 text-gray-300 dark:text-zinc-600">·</span>
          <span className="text-rose-600 dark:text-rose-400">
            OUT {formatCurrency(credit)}
          </span>
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 px-4 py-10 text-center dark:border-white/10">
          <p className="text-sm text-gray-500 dark:text-zinc-500">{emptyMessage}</p>
          <p className="mt-1 text-xs text-gray-400 dark:text-zinc-600">Tap + to add one</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => {
            const isIncome = entry.type === 'income';
            const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;
            return (
              <li
                key={entry.id}
                className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white/80 px-3 py-3 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isIncome
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-zinc-100">
                        {isIncome ? 'Income' : 'Credit'}
                      </p>
                    </div>
                    <p
                      className={`shrink-0 text-sm font-semibold tabular-nums ${
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isIncome ? '+' : '−'}
                      {formatCurrency(entry.amount)}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400 dark:text-zinc-600">
                      {view === 'all'
                        ? `${formatDayHeader(toDateKey(entry.date))} · ${formatTransactionTime(entry.date)}`
                        : formatDayHeader(toDateKey(entry.date))}
                    </span>
                    <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                      <button
                        type="button"
                        onClick={() => onEdit(entry)}
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-amber-600 dark:text-zinc-600 dark:hover:bg-white/10 dark:hover:text-amber-400"
                        aria-label="Edit entry"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Delete this entry?')) {
                            onDelete(entry.id);
                          }
                        }}
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-rose-500 dark:text-zinc-600 dark:hover:bg-white/10 dark:hover:text-rose-400"
                        aria-label="Delete entry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default BusinessTransactionFeed;
