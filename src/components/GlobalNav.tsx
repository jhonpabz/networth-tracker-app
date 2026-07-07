import React from 'react';
import { GlobalTab } from '../types/Investment';

interface GlobalNavProps {
  activeTab: GlobalTab;
  onTabChange: (tab: GlobalTab) => void;
}

const tabs: { id: GlobalTab; label: string }[] = [
  { id: 'networth', label: 'Net Worth' },
  { id: 'investments', label: 'Investments' },
  { id: 'gotrade', label: 'GoTrade VOO' },
];

const GlobalNav: React.FC<GlobalNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="flex items-center gap-8 mb-6 border-b border-gray-200 dark:border-gray-700/60">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative pb-3 text-sm font-medium tracking-wide transition-colors duration-200 ${
              isActive
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default GlobalNav;
