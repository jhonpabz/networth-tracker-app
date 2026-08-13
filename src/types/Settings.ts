import { GlobalTab } from './Investment';

export interface NavVisibility {
  netWorth: boolean;
  invest: boolean;
  spending: boolean;
  business: boolean;
  planner: boolean;
}

export const DEFAULT_NAV_VISIBILITY: NavVisibility = {
  netWorth: true,
  invest: false,
  spending: true,
  business: false,
  planner: true,
};

export interface NavTabConfig {
  visibilityKey: keyof NavVisibility;
  tab: GlobalTab;
  label: string;
}

export const NAV_TAB_CONFIG: NavTabConfig[] = [
  { visibilityKey: 'netWorth', tab: 'networth', label: 'Net Worth' },
  { visibilityKey: 'invest', tab: 'invest', label: 'Invest' },
  { visibilityKey: 'spending', tab: 'spending', label: 'Spending' },
  { visibilityKey: 'business', tab: 'business', label: 'Business' },
  { visibilityKey: 'planner', tab: 'planner', label: 'Planner' },
];

export interface AppSettings {
  navVisibility: NavVisibility;
  biometricsEnabled: boolean;
  autoTriggerBiometricsOnLaunch: boolean;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  navVisibility: DEFAULT_NAV_VISIBILITY,
  biometricsEnabled: false,
  autoTriggerBiometricsOnLaunch: true,
};
