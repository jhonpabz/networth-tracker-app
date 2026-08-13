import React from 'react';
import { Settings } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface HeaderActionsProps {
  onOpenSettings: () => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ onOpenSettings }) => {
  return (
    <div className="fixed z-50 flex items-center gap-2 top-12 right-4">
      <button
        type="button"
        onClick={onOpenSettings}
        className="p-3 transition-all duration-200 border rounded-full shadow-lg border-white/20 bg-white/10 backdrop-blur-sm hover:scale-105 hover:bg-white/20 active:scale-95 dark:border-gray-700/20 dark:bg-gray-800/10 dark:hover:bg-gray-800/20"
        aria-label="Open settings"
      >
        <Settings className="w-5 h-5 text-gray-700 dark:text-gray-200" />
      </button>
      <ThemeToggle inline />
    </div>
  );
};

export default HeaderActions;
