import React from 'react';
import { GlobalTab } from '../types/Investment';

interface GlobalNavProps {
  activeTab: GlobalTab;
  onTabChange: (tab: GlobalTab) => void;
  className?: string;
}

const tabs: { id: GlobalTab; label: string }[] = [
  { id: 'networth', label: 'Net Worth' },
  { id: 'investments', label: 'Investments' },
  { id: 'gotrade', label: 'GoTrade VOO' },
  { id: 'planner', label: 'Planner' },
];

const GlobalNav: React.FC<GlobalNavProps> = ({ activeTab, onTabChange, className = '' }) => {
  return (
    <nav
      className={`border-b border-gray-200 dark:border-gray-700/60 ${className}`}
      aria-label="Main navigation"
    >
      <div className="flex gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`shrink-0 whitespace-nowrap border-b-2 px-2.5 py-2 text-xs font-medium tracking-wide transition-colors duration-200 -mb-px sm:px-3 sm:text-sm ${
                isActive
                  ? 'border-blue-500 text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default GlobalNav;
