import React, { useState } from 'react';
import { InvestSubTab } from '../types/Investment';
import ViewSwitcher from './ViewSwitcher';
import InvestmentsPage from './InvestmentsPage';
import GoTradePage from './GoTradePage';
import DragonfiFundPage from './DragonfiFundPage';

const INVEST_SUBTAB_KEY = 'invest-subtab';

const InvestPage: React.FC = () => {
  const [subTab, setSubTab] = useState<InvestSubTab>(() => {
    const saved = localStorage.getItem(INVEST_SUBTAB_KEY);
    return saved === 'dragonfi' || saved === 'gotrade' || saved === 'dragonfi-fund'
      ? saved
      : 'dragonfi';
  });

  const handleSubTabChange = (tab: InvestSubTab) => {
    setSubTab(tab);
    localStorage.setItem(INVEST_SUBTAB_KEY, tab);
  };

  return (
    <div>
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
          Invest
        </h1>
        <ViewSwitcher
          options={[
            { value: 'gotrade' as const, label: 'GoTrade' },
            { value: 'dragonfi-fund' as const, label: 'Funds' },
            { value: 'dragonfi' as const, label: 'Dragonfi' },
          ]}
          value={subTab}
          onChange={handleSubTabChange}
        />
      </div>

      {subTab === 'dragonfi' && <InvestmentsPage />}
      {subTab === 'dragonfi-fund' && <DragonfiFundPage />}
      {subTab === 'gotrade' && <GoTradePage />}
    </div>
  );
};

export default InvestPage;
