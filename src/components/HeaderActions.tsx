import React from 'react';
import { Settings } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface HeaderActionsProps {
  onOpenSettings: () => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ onOpenSettings }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <button
        type="button"
        onClick={onOpenSettings}
        className="rounded-full border border-white/20 bg-white/10 p-3 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/20 active:scale-95 dark:border-gray-700/20 dark:bg-gray-800/10 dark:hover:bg-gray-800/20"
        aria-label="Open settings"
      >
        <Settings className="h-5 w-5 text-gray-700 dark:text-gray-200" />
      </button>
      <ThemeToggle inline />
    </div>
  );
};

export default HeaderActions;
