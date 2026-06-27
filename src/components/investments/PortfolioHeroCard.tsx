import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercent, formatPnL } from '../../utils/formatCurrency';

interface PortfolioHeroCardProps {
  totalValue: number;
  pnl24h: number;
  pnl24hPercent: number;
}

const PortfolioHeroCard: React.FC<PortfolioHeroCardProps> = ({
  totalValue,
  pnl24h,
  pnl24hPercent,
}) => {
  const isPositive = pnl24h >= 0;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white p-8 rounded-2xl shadow-2xl border border-gray-700/50">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 opacity-50" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-medium text-gray-300">Portfolio Value</h1>
          <div className="flex items-center space-x-2">
            {isPositive ? (
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400" />
            )}
            <span
              className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                isPositive
                  ? 'text-emerald-400 bg-emerald-400/10'
                  : 'text-red-400 bg-red-400/10'
              }`}
            >
              {formatPnL(pnl24h)} / {formatPercent(pnl24hPercent)}
            </span>
          </div>
        </div>
        <div className="mb-2">
          <span className="text-4xl font-bold text-emerald-400">
            {formatCurrency(totalValue)}
          </span>
        </div>
        <div className="text-sm text-gray-400">Updated just now</div>
      </div>
    </div>
  );
};

export default PortfolioHeroCard;
