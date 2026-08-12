import { useCallback, useMemo } from 'react';
import { GlobalTab } from '../types/Investment';
import {
  AppSettings,
  DEFAULT_APP_SETTINGS,
  DEFAULT_NAV_VISIBILITY,
  NAV_TAB_CONFIG,
  NavVisibility,
} from '../types/Settings';
import { useLocalStorage } from './useLocalStorage';

const SETTINGS_KEY = 'app-settings';

function normalizeNavVisibility(value: Partial<NavVisibility> | undefined): NavVisibility {
  return {
    netWorth: value?.netWorth ?? DEFAULT_NAV_VISIBILITY.netWorth,
    invest: value?.invest ?? DEFAULT_NAV_VISIBILITY.invest,
    spending: value?.spending ?? DEFAULT_NAV_VISIBILITY.spending,
    business: value?.business ?? DEFAULT_NAV_VISIBILITY.business,
    planner: value?.planner ?? DEFAULT_NAV_VISIBILITY.planner,
  };
}

function countEnabledTabs(visibility: NavVisibility): number {
  return Object.values(visibility).filter(Boolean).length;
}

export function useNavSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(SETTINGS_KEY, DEFAULT_APP_SETTINGS);

  const navVisibility = useMemo(
    () => normalizeNavVisibility(settings.navVisibility),
    [settings.navVisibility]
  );

  const enabledTabs = useMemo(
    () => NAV_TAB_CONFIG.filter(({ visibilityKey }) => navVisibility[visibilityKey]),
    [navVisibility]
  );

  const setNavVisibility = useCallback(
    (key: keyof NavVisibility, enabled: boolean) => {
      setSettings((prev) => {
        const current = normalizeNavVisibility(prev.navVisibility);
        const next = { ...current, [key]: enabled };

        if (!enabled && countEnabledTabs(next) < 1) {
          return prev;
        }

        return { ...prev, navVisibility: next };
      });
    },
    [setSettings]
  );

  const setBiometricsEnabled = useCallback(
    (enabled: boolean) => {
      setSettings((prev) => ({ ...prev, biometricsEnabled: enabled }));
    },
    [setSettings]
  );

  const resolveActiveTab = useCallback(
    (activeTab: GlobalTab): GlobalTab => {
      const isEnabled = enabledTabs.some(({ tab }) => tab === activeTab);
      if (isEnabled) return activeTab;
      return enabledTabs[0]?.tab ?? 'networth';
    },
    [enabledTabs]
  );

  const canDisableTab = useCallback(
    (key: keyof NavVisibility) => {
      if (!navVisibility[key]) return true;
      return countEnabledTabs(navVisibility) > 1;
    },
    [navVisibility]
  );

  return {
    navVisibility,
    enabledTabs,
    biometricsEnabled: settings.biometricsEnabled ?? false,
    setNavVisibility,
    setBiometricsEnabled,
    resolveActiveTab,
    canDisableTab,
  };
}
