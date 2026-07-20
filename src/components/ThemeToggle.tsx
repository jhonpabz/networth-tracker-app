import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="fixed top-14 right-4 z-50 rounded-full border border-white/20 bg-white/10 p-3 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/20 active:scale-95 dark:border-gray-700/20 dark:bg-gray-800/10 dark:hover:bg-gray-800/20"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
};

export default ThemeToggle;
