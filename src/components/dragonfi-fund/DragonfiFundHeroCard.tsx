import React from 'react';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

interface DragonfiFundHeroCardProps {
  totalPhp: number;
  transactionCount: number;
}

const DragonfiFundHeroCard: React.FC<DragonfiFundHeroCardProps> = ({
  totalPhp,
  transactionCount,
}) => {
  return (
    <div className="relative p-8 overflow-hidden text-white border shadow-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl border-gray-700/50">
      <div className="absolute inset-0 opacity-50 bg-gradient-to-r from-emerald-500/10 to-blue-500/10" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-medium text-gray-300">
            Dragonfi Fund Port
          </h1>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-gray-400">
              {transactionCount} {transactionCount === 1 ? 'deposit' : 'deposits'}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <span className="text-4xl font-bold text-emerald-400">{formatCurrency(totalPhp)}</span>
        </div>

        <div className="text-sm text-gray-400">Total PHP deposited</div>
      </div>
    </div>
  );
};

export default DragonfiFundHeroCard;
