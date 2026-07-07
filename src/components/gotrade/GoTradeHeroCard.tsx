import React, { useState } from 'react';
import { TrendingUp, Pencil } from 'lucide-react';
import { formatCurrency, formatUsd } from '../../utils/formatCurrency';
import FxRateModal from './FxRateModal';

interface GoTradeHeroCardProps {
  totalPhp: number;
  totalUsd: number;
  fxRate: number;
  transactionCount: number;
  onFxRateChange: (rate: number) => void;
}

const GoTradeHeroCard: React.FC<GoTradeHeroCardProps> = ({
  totalPhp,
  totalUsd,
  fxRate,
  transactionCount,
  onFxRateChange,
}) => {
  const [isFxModalOpen, setIsFxModalOpen] = useState(false);

  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white p-8 rounded-2xl shadow-2xl border border-gray-700/50">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 opacity-50" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-medium text-gray-300">GoTrade VOO Portfolio</h1>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-gray-400">
                {transactionCount} {transactionCount === 1 ? 'deposit' : 'deposits'}
              </span>
            </div>
          </div>

          <div className="mb-1">
            <span className="text-4xl font-bold text-emerald-400">{formatCurrency(totalPhp)}</span>
          </div>
          <div className="mb-4">
            <span className="text-xl font-medium text-gray-300">{formatUsd(totalUsd)}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsFxModalOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 bg-white/10 border border-gray-600/50 rounded-lg hover:bg-white/15 hover:border-gray-500/60 transition-colors duration-200"
          >
            <span>USD/PHP {fxRate.toFixed(2)}</span>
            <Pencil className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <div className="mt-3 text-sm text-gray-400">Updated just now</div>
        </div>
      </div>

      <FxRateModal
        isOpen={isFxModalOpen}
        fxRate={fxRate}
        onClose={() => setIsFxModalOpen(false)}
        onSave={onFxRateChange}
      />
    </>
  );
};

export default GoTradeHeroCard;
