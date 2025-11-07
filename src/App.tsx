import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Account } from './types/Account';
import { useThemeProvider, ThemeContext } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import { usePin } from './hooks/usePin';
import NetWorthDisplay from './components/NetWorthDisplay';
import AccountCard from './components/AccountCard';
import AccountCardTile from './components/AccountCardTile';
import AddAccountModal from './components/AddAccountModal';
import ThemeToggle from './components/ThemeToggle';
import PinSetup from './components/PinSetup';
import PinEntry from './components/PinEntry';

const App: React.FC = () => {
  const { hasPin, isAuthenticated, isLoading, securityQuestion, setPin, verifyPin, verifySecurityAnswer, resetPin } = usePin();
  const [accounts, setAccounts] = useLocalStorage<Account[]>('accounts', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'classic' | 'wallet'>('classic');
  const themeProvider = useThemeProvider();

  // Show loading screen while checking PIN status
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

  // Show PIN setup if no PIN is set
  if (!hasPin) {
    return (
      <ThemeContext.Provider value={themeProvider}>
        <ThemeToggle />
        <PinSetup onPinSet={setPin} />
      </ThemeContext.Provider>
    );
  }

  // Show PIN entry if not authenticated
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

  const totalNetWorth = accounts.reduce((sum, account) => sum + account.balance, 0);

  const handleAddAccount = (accountData: Omit<Account, 'id'>) => {
    if (editingAccount) {
      setAccounts(accounts.map(account =>
        account.id === editingAccount.id
          ? { ...accountData, id: editingAccount.id, iconType: accountData.iconType ?? editingAccount.iconType ?? 'lucide' }
          : account
      ));
      setEditingAccount(undefined);
    } else {
      const newAccount: Account = {
        ...accountData,
        iconType: accountData.iconType ?? 'lucide',
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };
      setAccounts([...accounts, newAccount]);
    }
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAccount(undefined);
  };

  return (
    <ThemeContext.Provider value={themeProvider}>
      <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <ThemeToggle />
        
        <div className="container px-4 py-8 mx-auto max-w-7xl">
          <div className="mb-2">
            <NetWorthDisplay totalNetWorth={totalNetWorth} accountCount={accounts.length} />
          </div>

          <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
            <div>
              {/* <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                Your Accounts
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
              Your Accounts
              </p> */}
            </div>
            <div className="flex items-center self-start gap-3 md:self-center">
              <div className="flex items-center p-1 bg-gray-100 rounded-full dark:bg-gray-800">
                <button
                  onClick={() => setViewMode('classic')}
                  className={`px-3 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                    viewMode === 'classic'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Classic
                </button>
                <button
                  onClick={() => setViewMode('wallet')}
                  className={`px-3 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                    viewMode === 'wallet'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Wallet Grid
                </button>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="items-center hidden gap-2 px-6 py-3 font-medium text-white transition-all duration-200 bg-blue-600 shadow-lg md:inline-flex hover:bg-blue-700 rounded-xl hover:shadow-xl hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Add Account
              </button>
            </div>
          </div>

          {accounts.length > 0 ? (
            <div
              className={
                viewMode === 'wallet'
                  ? 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'
                  : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              }
            >
              {accounts.map((account) =>
                viewMode === 'wallet' ? (
                  <AccountCardTile
                    key={account.id}
                    account={account}
                    onEdit={handleEditAccount}
                    onDelete={handleDeleteAccount}
                  />
                ) : (
                  <AccountCard
                    key={account.id}
                    account={account}
                    onEdit={handleEditAccount}
                    onDelete={handleDeleteAccount}
                  />
                )
              )}
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                  <Plus className="w-12 h-12 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  No accounts yet
                </h3>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  Start tracking your net worth by adding your first account
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="items-center hidden gap-2 px-6 py-3 font-medium text-white transition-all duration-200 bg-blue-600 shadow-lg md:inline-flex hover:bg-blue-700 rounded-xl hover:shadow-xl hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Account
                </button>
              </div>
            </div>
          )}

          <AddAccountModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleAddAccount}
            editingAccount={editingAccount}
          />

          {/* Mobile Floating Action Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed z-40 flex items-center justify-center text-white transition-all duration-200 bg-blue-600 rounded-full shadow-lg md:hidden bottom-6 right-6 w-14 h-14 hover:bg-blue-700 hover:shadow-xl hover:scale-105"
            aria-label="Add Account"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;