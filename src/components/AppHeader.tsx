import React from 'react';
import { GlobalTab } from '../types/Investment';
import { useScrollHeader } from '../hooks/useScrollHeader';
import GlobalNav from './GlobalNav';

interface AppHeaderProps {
  activeTab: GlobalTab;
  onTabChange: (tab: GlobalTab) => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ activeTab, onTabChange }) => {
  const isVisible = useScrollHeader();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="bg-gradient-to-br from-gray-50/95 via-white/95 to-gray-100/95 backdrop-blur-md dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95">
        <div className="container px-4 mx-auto max-w-7xl">
          <GlobalNav activeTab={activeTab} onTabChange={onTabChange} />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
