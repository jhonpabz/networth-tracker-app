import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { GoTradeTransaction } from '../../types/GoTrade';
import { formatCurrency } from '../../utils/formatCurrency';
import DeleteDepositModal from './DeleteDepositModal';

interface GoTradeTransactionListProps {
  transactions: GoTradeTransaction[];
  onDelete?: (id: string) => void;
}

const formatDate = (dateStr: string): string => {
  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateStr));
};

const GoTradeTransactionList: React.FC<GoTradeTransactionListProps> = ({
  transactions,
  onDelete,
}) => {
  const [pendingDelete, setPendingDelete] = useState<GoTradeTransaction | null>(null);

  const handleConfirmDelete = () => {
    if (pendingDelete && onDelete) {
      onDelete(pendingDelete.id);
    }
    setPendingDelete(null);
  };

  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl">
        <p className="text-gray-500 dark:text-gray-400">No deposits yet</p>
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
          Tap + to log your first contribution
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-gray-200 dark:border-gray-700/60 rounded-2xl divide-y divide-gray-200 dark:divide-gray-700/60">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="flex items-center justify-between px-5 py-4 transition-colors duration-150 bg-white/50 dark:bg-gray-800/30 hover:bg-gray-50 dark:hover:bg-gray-800/60"
        >
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{formatDate(tx.date)}</p>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Deposit</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-emerald-500 dark:text-emerald-400">
              {formatCurrency(tx.amountPhp)}
            </span>
            {onDelete && (
              <button
                onClick={() => setPendingDelete(tx)}
                className="p-2 text-gray-400 transition-colors rounded-lg hover:text-red-500 hover:bg-red-500/10"
                aria-label="Delete transaction"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}

      <DeleteDepositModal
        isOpen={pendingDelete !== null}
        dateLabel={pendingDelete ? formatDate(pendingDelete.date) : ''}
        amountPhp={pendingDelete?.amountPhp ?? 0}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default GoTradeTransactionList;
