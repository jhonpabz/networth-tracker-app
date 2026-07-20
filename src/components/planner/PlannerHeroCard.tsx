import React from 'react';
import { PiggyBank, Wallet } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

interface PlannerHeroCardProps {
  totalMonthly: number;
  expenseTotal: number;
  investmentTotal: number;
  investmentRate: number;
}

const PlannerHeroCard: React.FC<PlannerHeroCardProps> = ({
  totalMonthly,
  expenseTotal,
  investmentTotal,
  investmentRate,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white p-8 rounded-2xl shadow-2xl border border-gray-700/50">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 opacity-50" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-medium text-gray-300">Total Planned Monthly</h1>
          <span className="text-sm font-medium px-2.5 py-0.5 rounded-full text-emerald-400 bg-emerald-400/10">
            {investmentRate.toFixed(1)}% Allocated to Investments
          </span>
        </div>

        <div className="mb-6">
          <span className="text-4xl font-bold text-emerald-400">
            {formatCurrency(totalMonthly)}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-gray-700/40">
            <Wallet className="w-5 h-5 mt-0.5 text-orange-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Expenses / Utilities</p>
              <p className="text-lg font-semibold text-white">{formatCurrency(expenseTotal)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-gray-700/40">
            <PiggyBank className="w-5 h-5 mt-0.5 text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Investments / Savings</p>
              <p className="text-lg font-semibold text-white">{formatCurrency(investmentTotal)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerHeroCard;
