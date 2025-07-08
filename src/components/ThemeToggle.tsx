import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-200 shadow-lg"
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