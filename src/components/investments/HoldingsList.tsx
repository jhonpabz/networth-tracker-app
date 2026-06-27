import React from 'react';
import { Bitcoin, TrendingUp, TrendingDown } from 'lucide-react';
import { HoldingWithMetrics } from '../../types/Investment';
import { formatCurrency, formatPercent, formatPnL } from '../../utils/formatCurrency';

interface HoldingsListProps {
  holdings: HoldingWithMetrics[];
}

const HoldingsList: React.FC<HoldingsListProps> = ({ holdings }) => {
  if (holdings.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
          <Bitcoin className="w-8 h-8 text-white" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          No holdings yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Tap + to log your first buy or sell transaction
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50">
      <div className="hidden md:grid md:grid-cols-[1fr_1.5fr_1fr_1.2fr_1.2fr] gap-4 px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400 border-b border-gray-200 dark:border-gray-700/50">
        <span>Ticker</span>
        <span>Name</span>
        <span className="text-right">Allocation</span>
        <span className="text-right">Value</span>
        <span className="text-right">24h P&L</span>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700/50">
        {holdings.map((holding) => {
          const isPositive = holding.pnl24h >= 0;
          return (
            <div
              key={holding.ticker}
              className="grid grid-cols-2 gap-3 px-4 py-4 md:grid-cols-[1fr_1.5fr_1fr_1.2fr_1.2fr] md:gap-4 md:px-6 md:items-center hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
            >
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{holding.ticker}</p>
                <p className="text-xs text-gray-500 capitalize md:hidden dark:text-gray-400">
                  {holding.assetType}
                </p>
              </div>
              <div className="hidden md:block">
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{holding.name}</p>
                <p className="text-xs text-gray-500 capitalize dark:text-gray-400">
                  {holding.assetType}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white md:text-right">
                  {formatPercent(holding.allocationPercent)}
                </p>
                <p className="text-xs text-gray-500 md:hidden dark:text-gray-400">Allocation</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(holding.currentValue)}
                </p>
                <p className="text-xs text-gray-500 md:hidden dark:text-gray-400">Value</p>
              </div>
              <div className="col-span-2 md:col-span-1 text-right">
                <div className="flex items-center justify-end gap-1">
                  {isPositive ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      isPositive ? 'text-emerald-500' : 'text-red-500'
                    }`}
                  >
                    {formatPnL(holding.pnl24h)}
                  </span>
                </div>
                <p
                  className={`text-xs ${
                    isPositive ? 'text-emerald-500/80' : 'text-red-500/80'
                  }`}
                >
                  {formatPercent(holding.pnl24hPercent)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HoldingsList;
