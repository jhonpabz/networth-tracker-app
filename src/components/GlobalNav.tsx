import React from 'react';
import { Wallet, TrendingUp, Receipt, Briefcase, CalendarCheck } from 'lucide-react';
import { GlobalTab } from '../types/Investment';
import { NavTabConfig } from '../types/Settings';

interface GlobalNavProps {
  activeTab: GlobalTab;
  enabledTabs: NavTabConfig[];
  onTabChange: (tab: GlobalTab) => void;
}

const TAB_ICONS: Record<GlobalTab, typeof Wallet> = {
  networth: Wallet,
  invest: TrendingUp,
  spending: Receipt,
  business: Briefcase,
  planner: CalendarCheck,
};

const GlobalNav: React.FC<GlobalNavProps> = ({ activeTab, enabledTabs, onTabChange }) => {
  if (enabledTabs.length === 0) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-center px-3 pointer-events-none pb-[max(1rem,env(safe-area-inset-bottom))]"
      aria-label="Main navigation"
    >
      <div className="pointer-events-auto flex w-full max-w-lg items-stretch gap-0.5 rounded-full border border-white/10 bg-zinc-900/45 px-1 py-1.5 shadow-2xl backdrop-blur-md sm:max-w-xl sm:gap-0.5 sm:px-1.5">
        {enabledTabs.map(({ tab, label }) => {
          const Icon = TAB_ICONS[tab];
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-1 flex-col items-center justify-center rounded-full h-10 px-1 transition-all duration-200 text-zinc-400 hover:text-white hover:bg-white/5 sm:px-1.5 ${
                isActive
                  ? 'bg-white/15 text-white shadow-inner'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 ${isActive ? 'text-amber-400' : ''}`}
                strokeWidth={isActive ? 2.25 : 1.75}
              />
              <span className="max-w-full truncate text-[9px] font-medium leading-tight tracking-wide sm:text-[10px]">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default GlobalNav;
