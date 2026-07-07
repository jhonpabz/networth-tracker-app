import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { formatCurrency, formatUsd } from '../../utils/formatCurrency';

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
  const [fxInput, setFxInput] = useState(fxRate.toString());

  useEffect(() => {
    setFxInput(fxRate.toString());
  }, [fxRate]);

  const handleFxChange = (value: string) => {
    const sanitized = value.replace(/[^\d.]/g, '');
    const parts = sanitized.split('.');
    const normalized =
      parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : sanitized;
    setFxInput(normalized);

    const parsed = parseFloat(normalized);
    if (!isNaN(parsed) && parsed > 0) {
      onFxRateChange(parsed);
    }
  };

  return (
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

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>USD/PHP</span>
          <input
            type="text"
            inputMode="decimal"
            value={fxInput}
            onChange={(e) => handleFxChange(e.target.value)}
            className="w-20 px-2 py-0.5 text-sm font-medium text-white bg-white/10 border border-gray-600/50 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            aria-label="USD to PHP exchange rate"
          />
        </div>

        <div className="mt-3 text-sm text-gray-400">Updated just now</div>
      </div>
    </div>
  );
};

export default GoTradeHeroCard;
