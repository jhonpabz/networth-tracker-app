import React from 'react';
import {
  Bus,
  Clapperboard,
  HeartPulse,
  ShoppingBag,
  UtensilsCrossed,
  Wallet,
  Zap,
  ArrowLeftRight,
  CircleDollarSign,
  Trash2,
} from 'lucide-react';
import { TransactionEntry } from '../../types/Spending';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  formatDayHeader,
  formatTransactionTime,
} from '../../utils/spendingCalculations';

interface TransactionFeedProps {
  dateKey: string;
  transactions: TransactionEntry[];
  dayIncome: number;
  dayExpense: number;
  onDelete: (id: string) => void;
}

const CATEGORY_ICONS: Record<string, typeof UtensilsCrossed> = {
  'Food & Drink': UtensilsCrossed,
  Utilities: Zap,
  Shopping: ShoppingBag,
  Transport: Bus,
  Salary: Wallet,
  Entertainment: Clapperboard,
  Health: HeartPulse,
  Transfer: ArrowLeftRight,
  Other: CircleDollarSign,
};

const TransactionFeed: React.FC<TransactionFeedProps> = ({
  dateKey,
  transactions,
  dayIncome,
  dayExpense,
  onDelete,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-1">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-zinc-200">
          {formatDayHeader(dateKey)}
        </h3>
        <p className="text-xs tabular-nums text-gray-400 dark:text-zinc-500">
          <span className="text-emerald-600 dark:text-emerald-400">
            IN {formatCurrency(dayIncome)}
          </span>
          <span className="mx-1.5 text-gray-300 dark:text-zinc-600">·</span>
          <span className="text-rose-600 dark:text-rose-400">
            OUT {formatCurrency(dayExpense)}
          </span>
        </p>
      </div>

      {transactions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 px-4 py-10 text-center dark:border-white/10">
          <p className="text-sm text-gray-500 dark:text-zinc-500">No transactions this day</p>
          <p className="mt-1 text-xs text-gray-400 dark:text-zinc-600">Tap + to add one</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {transactions.map((tx) => {
            const Icon = CATEGORY_ICONS[tx.category] ?? CircleDollarSign;
            const isIncome = tx.type === 'income';
            return (
              <li
                key={tx.id}
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
                        {tx.category}
                      </p>
                      {tx.note ? (
                        <p className="truncate text-xs text-gray-500 dark:text-zinc-500">
                          {tx.note}
                        </p>
                      ) : null}
                    </div>
                    <p
                      className={`shrink-0 text-sm font-semibold tabular-nums ${
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isIncome ? '+' : '−'}
                      {formatCurrency(tx.amount)}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400 dark:text-zinc-600">
                      {formatTransactionTime(tx.date)}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Delete this transaction?')) {
                          onDelete(tx.id);
                        }
                      }}
                      className="rounded-lg p-1 text-gray-400 opacity-0 transition-opacity hover:bg-gray-100 hover:text-rose-500 group-hover:opacity-100 focus:opacity-100 dark:text-zinc-600 dark:hover:bg-white/10 dark:hover:text-rose-400"
                      aria-label="Delete transaction"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
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

export default TransactionFeed;
