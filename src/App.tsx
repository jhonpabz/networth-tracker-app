import React, { useEffect, useState } from 'react';
import { Account } from './types/Account';
import { GlobalTab } from './types/Investment';
import { useThemeProvider, ThemeContext } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import { usePin } from './hooks/usePin';
import { useNavSettings } from './hooks/useNavSettings';
import { useWebAuthn } from './hooks/useWebAuthn';
import GlobalNav from './components/GlobalNav';
import NetWorthPage from './components/NetWorthPage';
import InvestPage from './components/InvestPage';
import PlannerPage from './components/PlannerPage';
import SpendingPage from './components/spending/SpendingPage';
import BusinessPage from './components/business/BusinessPage';
import ThemeToggle from './components/ThemeToggle';
import HeaderActions from './components/HeaderActions';
import SettingsDrawer from './components/settings/SettingsDrawer';
import InstallPrompt from './components/InstallPrompt';
import PinSetup from './components/PinSetup';
import PinEntry from './components/PinEntry';

const GLOBAL_TAB_KEY = 'global-tab';
const VALID_TABS: GlobalTab[] = ['networth', 'invest', 'spending', 'business', 'planner'];

function resolveInitialTab(): GlobalTab {
  const saved = localStorage.getItem(GLOBAL_TAB_KEY);
  if (saved && VALID_TABS.includes(saved as GlobalTab)) {
    return saved as GlobalTab;
  }
  if (saved === 'investments' || saved === 'gotrade') {
    if (saved === 'gotrade') {
      localStorage.setItem('invest-subtab', 'gotrade');
    }
    localStorage.setItem(GLOBAL_TAB_KEY, 'invest');
    return 'invest';
  }
  return 'networth';
}

const App: React.FC = () => {
  const {
    hasPin,
    isAuthenticated,
    isLoading,
    securityQuestion,
    setPin,
    verifyPin,
    verifySecurityAnswer,
    resetPin,
    changePin,
    authenticateSession,
  } = usePin();

  const {
    navVisibility,
    enabledTabs,
    biometricsEnabled,
    autoTriggerBiometricsOnLaunch,
    setNavVisibility,
    setBiometricsEnabled,
    setAutoTriggerBiometricsOnLaunch,
    resolveActiveTab,
    canDisableTab,
  } = useNavSettings();

  const { authenticate } = useWebAuthn();

  const [accounts, setAccounts] = useLocalStorage<Account[]>('accounts', []);
  const [activeTab, setActiveTab] = useState<GlobalTab>(resolveInitialTab);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  const themeProvider = useThemeProvider();

  useEffect(() => {
    const resolved = resolveActiveTab(activeTab);
    if (resolved !== activeTab) {
      setActiveTab(resolved);
      localStorage.setItem(GLOBAL_TAB_KEY, resolved);
    }
  }, [activeTab, resolveActiveTab]);

  const handleTabChange = (tab: GlobalTab) => {
    setActiveTab(tab);
    localStorage.setItem(GLOBAL_TAB_KEY, tab);
  };

  const handleBiometricAuth = async (): Promise<boolean> => {
    const success = await authenticate();
    if (success) {
      authenticateSession();
    }
    return success;
  };

  const handleAddAccount = (accountData: Omit<Account, 'id'>) => {
    const newAccount: Account = {
      ...accountData,
      iconType: accountData.iconType ?? 'lucide',
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    setAccounts([...accounts, newAccount]);
  };

  const handleUpdateAccount = (id: string, accountData: Omit<Account, 'id'>) => {
    setAccounts(
      accounts.map((account) =>
        account.id === id
          ? { ...accountData, id, iconType: accountData.iconType ?? account.iconType ?? 'lucide' }
          : account
      )
    );
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter((account) => account.id !== id));
  };

  if (isLoading) {
    return (
      <ThemeContext.Provider value={themeProvider}>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </ThemeContext.Provider>
    );
  }

  if (!hasPin) {
    return (
      <ThemeContext.Provider value={themeProvider}>
        <ThemeToggle />
        <PinSetup onPinSet={setPin} />
      </ThemeContext.Provider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeContext.Provider value={themeProvider}>
        <ThemeToggle />
        <PinEntry
          onPinEntered={verifyPin}
          onForgotPin={resetPin}
          securityQuestion={securityQuestion}
          onSecurityAnswer={verifySecurityAnswer}
          biometricsEnabled={biometricsEnabled}
          autoTriggerBiometricsOnLaunch={autoTriggerBiometricsOnLaunch}
          onBiometricAuth={handleBiometricAuth}
        />
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={themeProvider}>
      <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <HeaderActions onOpenSettings={() => setSettingsOpen(true)} />

        <div className="container px-4 pt-6 pb-28 mx-auto max-w-7xl">
          {activeTab === 'networth' ? (
            <NetWorthPage
              accounts={accounts}
              onAddAccount={handleAddAccount}
              onUpdateAccount={handleUpdateAccount}
              onDeleteAccount={handleDeleteAccount}
            />
          ) : activeTab === 'invest' ? (
            <InvestPage />
          ) : activeTab === 'spending' ? (
            <SpendingPage />
          ) : activeTab === 'business' ? (
            <BusinessPage />
          ) : (
            <PlannerPage />
          )}
        </div>

        <GlobalNav
          activeTab={activeTab}
          enabledTabs={enabledTabs}
          onTabChange={handleTabChange}
        />

        <InstallPrompt
          forceShow={showInstallPrompt}
          onDismiss={() => setShowInstallPrompt(false)}
        />

        <SettingsDrawer
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          navVisibility={navVisibility}
          biometricsEnabled={biometricsEnabled}
          autoTriggerBiometricsOnLaunch={autoTriggerBiometricsOnLaunch}
          onNavVisibilityChange={setNavVisibility}
          onBiometricsEnabledChange={setBiometricsEnabled}
          onAutoTriggerBiometricsOnLaunchChange={setAutoTriggerBiometricsOnLaunch}
          canDisableTab={canDisableTab}
          onChangePin={changePin}
          onShowInstallInstructions={() => setShowInstallPrompt(true)}
        />
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
