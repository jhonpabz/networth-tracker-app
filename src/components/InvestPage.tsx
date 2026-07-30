import React, { useState } from 'react';
import { InvestSubTab } from '../types/Investment';
import ViewSwitcher from './ViewSwitcher';
import InvestmentsPage from './InvestmentsPage';
import GoTradePage from './GoTradePage';

const INVEST_SUBTAB_KEY = 'invest-subtab';

const InvestPage: React.FC = () => {
  const [subTab, setSubTab] = useState<InvestSubTab>(() => {
    const saved = localStorage.getItem(INVEST_SUBTAB_KEY);
    return saved === 'dragonfi' || saved === 'gotrade' ? saved : 'dragonfi';
  });

  const handleSubTabChange = (tab: InvestSubTab) => {
    setSubTab(tab);
    localStorage.setItem(INVEST_SUBTAB_KEY, tab);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
          Invest
        </h1>
        <ViewSwitcher
          options={[
            { value: 'dragonfi' as const, label: 'Dragonfi' },
            { value: 'gotrade' as const, label: 'GoTrade' },
          ]}
          value={subTab}
          onChange={handleSubTabChange}
        />
      </div>

      {subTab === 'dragonfi' ? <InvestmentsPage /> : <GoTradePage />}
    </div>
  );
};

export default InvestPage;
