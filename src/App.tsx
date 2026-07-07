import React, { useState } from 'react';
import { Account } from './types/Account';
import { GlobalTab } from './types/Investment';
import { useThemeProvider, ThemeContext } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import { usePin } from './hooks/usePin';
import GlobalNav from './components/GlobalNav';
import NetWorthPage from './components/NetWorthPage';
import InvestmentsPage from './components/InvestmentsPage';
import GoTradePage from './components/GoTradePage';
import ThemeToggle from './components/ThemeToggle';
import PinSetup from './components/PinSetup';
import PinEntry from './components/PinEntry';

const GLOBAL_TAB_KEY = 'global-tab';

const App: React.FC = () => {
  const { hasPin, isAuthenticated, isLoading, securityQuestion, setPin, verifyPin, verifySecurityAnswer, resetPin } = usePin();
  const [accounts, setAccounts] = useLocalStorage<Account[]>('accounts', []);
  const [activeTab, setActiveTab] = useState<GlobalTab>(() => {
    const saved = localStorage.getItem(GLOBAL_TAB_KEY);
    return saved === 'networth' || saved === 'investments' || saved === 'gotrade'
      ? saved
      : 'networth';
  });

  const themeProvider = useThemeProvider();

  const handleTabChange = (tab: GlobalTab) => {
    setActiveTab(tab);
    localStorage.setItem(GLOBAL_TAB_KEY, tab);
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
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
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
        />
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={themeProvider}>
      <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <ThemeToggle />

        <div className="container px-4 py-8 mx-auto max-w-7xl">
          <GlobalNav activeTab={activeTab} onTabChange={handleTabChange} />

          {activeTab === 'networth' ? (
            <NetWorthPage
              accounts={accounts}
              onAddAccount={handleAddAccount}
              onUpdateAccount={handleUpdateAccount}
              onDeleteAccount={handleDeleteAccount}
            />
          ) : activeTab === 'investments' ? (
            <InvestmentsPage />
          ) : (
            <GoTradePage />
          )}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
