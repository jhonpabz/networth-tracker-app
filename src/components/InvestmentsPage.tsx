import React, { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { InvestmentViewMode } from '../types/Investment';
import { useInvestments } from '../hooks/useInvestments';
import { generatePerformanceHistory } from '../utils/investmentCalculations';
import ViewSwitcher from './ViewSwitcher';
import PortfolioHeroCard from './investments/PortfolioHeroCard';
import PerformanceChart from './investments/PerformanceChart';
import AllocationChart from './investments/AllocationChart';
import HoldingsList from './investments/HoldingsList';
import AddInvestmentModal from './investments/AddInvestmentModal';

const INVESTMENT_VIEW_KEY = 'investment-view-mode';

const InvestmentsPage: React.FC = () => {
  const { state, metrics, addTransaction } = useInvestments();
  const [viewMode, setViewMode] = useState<InvestmentViewMode>(() => {
    const saved = localStorage.getItem(INVESTMENT_VIEW_KEY);
    return saved === 'performance' || saved === 'allocation' ? saved : 'performance';
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(INVESTMENT_VIEW_KEY, viewMode);
  }, [viewMode]);

  const performanceData = useMemo(
    () => generatePerformanceHistory(state.transactions, '1Y', state.priceOverrides),
    [state.transactions, state.priceOverrides]
  );

  return (
    <>
      <div className="mb-2">
        <PortfolioHeroCard
          totalValue={metrics.totalValue}
          pnl24h={metrics.pnl24h}
          pnl24hPercent={metrics.pnl24hPercent}
        />
      </div>

      <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
        <div />
        <div className="flex items-center self-start gap-3 md:self-center">
          <ViewSwitcher
            options={[
              { value: 'performance' as const, label: 'Performance Chart' },
              { value: 'allocation' as const, label: 'Allocation %' },
            ]}
            value={viewMode}
            onChange={setViewMode}
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="items-center hidden gap-2 px-6 py-3 font-medium text-white transition-all duration-200 bg-blue-600 shadow-lg md:inline-flex hover:bg-blue-700 rounded-xl hover:shadow-xl hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Log Transaction
          </button>
        </div>
      </div>

      <div className="mb-8">
        {viewMode === 'performance' ? (
          <PerformanceChart data={performanceData} />
        ) : (
          <AllocationChart holdings={metrics.holdings} />
        )}
      </div>

      <div className="mb-4">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Holdings</h2>
        <HoldingsList holdings={metrics.holdings} />
      </div>

      <AddInvestmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addTransaction}
      />

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed z-40 flex items-center justify-center text-white transition-all duration-200 bg-blue-600 rounded-full shadow-lg md:hidden bottom-6 right-6 w-14 h-14 hover:bg-blue-700 hover:shadow-xl hover:scale-105"
        aria-label="Log Transaction"
      >
        <Plus className="w-6 h-6" />
      </button>
    </>
  );
};

export default InvestmentsPage;
