import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Account, ThemeContextType } from './types/Account';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useThemeProvider, ThemeContext } from './hooks/useTheme';
import NetWorthDisplay from './components/NetWorthDisplay';
import AccountCard from './components/AccountCard';
import AddAccountModal from './components/AddAccountModal';
import ThemeToggle from './components/ThemeToggle';

const App: React.FC = () => {
  const [accounts, setAccounts] = useLocalStorage<Account[]>('networth-accounts', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | undefined>(undefined);
  const themeProvider = useThemeProvider();

  const totalNetWorth = accounts.reduce((sum, account) => sum + account.balance, 0);

  const handleAddAccount = (accountData: Omit<Account, 'id'>) => {
    if (editingAccount) {
      setAccounts(accounts.map(acc => 
        acc.id === editingAccount.id 
          ? { ...accountData, id: editingAccount.id }
          : acc
      ));
      setEditingAccount(undefined);
    } else {
      const newAccount: Account = {
        ...accountData,
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
    setAccounts(accounts.filter(acc => acc.id !== id));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAccount(undefined);
  };

  return (
    <ThemeContext.Provider value={themeProvider}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <ThemeToggle />
        
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8">
            <NetWorthDisplay totalNetWorth={totalNetWorth} accountCount={accounts.length} />
          </div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Your Accounts
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your savings accounts and track your financial growth
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Add Account
            </button>
          </div>

          {/* Mobile Floating Action Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40 hover:scale-105"
            aria-label="Add Account"
          >
            <Plus className="w-6 h-6" />
          </button>

          {accounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onEdit={handleEditAccount}
                  onDelete={handleDeleteAccount}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Plus className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No accounts yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start tracking your net worth by adding your first account
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Account
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="md:hidden w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center hover:scale-105"
                  aria-label="Add Your First Account"
                >
                  <Plus className="w-6 h-6" />
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

          {/* Mobile Floating Action Button - Always visible on mobile */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40 hover:scale-105"
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