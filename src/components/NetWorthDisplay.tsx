import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface NetWorthDisplayProps {
  totalNetWorth: number;
  accountCount: number;
}

const NetWorthDisplay: React.FC<NetWorthDisplayProps> = ({ totalNetWorth, accountCount }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const isPositive = totalNetWorth >= 0;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white p-8 rounded-2xl shadow-2xl border border-gray-700/50">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 opacity-50"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-medium text-gray-300">Total Net Worth</h1>
          <div className="flex items-center space-x-2">
            {isPositive ? (
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400" />
            )}
            <span className="text-sm text-gray-400">{accountCount} accounts</span>
          </div>
        </div>
        <div className="mb-2">
          <span className={`text-4xl font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatCurrency(totalNetWorth)}
          </span>
        </div>
        <div className="text-sm text-gray-400">
          Updated just now
        </div>
      </div>
    </div>
  );
};

export default NetWorthDisplay;