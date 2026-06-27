import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Account } from '../types/Account';
import NetWorthDisplay from './NetWorthDisplay';
import AccountCard from './AccountCard';
import AccountCardTile from './AccountCardTile';
import AddAccountModal from './AddAccountModal';
import ViewSwitcher from './ViewSwitcher';

const VIEW_KEY = 'app-view-mode';

interface NetWorthPageProps {
  accounts: Account[];
  onAddAccount: (account: Omit<Account, 'id'>) => void;
  onUpdateAccount: (id: string, account: Omit<Account, 'id'>) => void;
  onDeleteAccount: (id: string) => void;
}

const NetWorthPage: React.FC<NetWorthPageProps> = ({
  accounts,
  onAddAccount,
  onUpdateAccount,
  onDeleteAccount,
}) => {
  const [viewMode, setViewMode] = useState<'classic' | 'wallet'>(() => {
    const saved = localStorage.getItem(VIEW_KEY);
    return saved === 'classic' || saved === 'wallet' ? saved : 'wallet';
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | undefined>();

  useEffect(() => {
    localStorage.setItem(VIEW_KEY, viewMode);
  }, [viewMode]);

  const totalNetWorth = accounts.reduce((sum, account) => sum + account.balance, 0);

  const handleSave = (accountData: Omit<Account, 'id'>) => {
    if (editingAccount) {
      onUpdateAccount(editingAccount.id, {
        ...accountData,
        iconType: accountData.iconType ?? editingAccount.iconType ?? 'lucide',
      });
    } else {
      onAddAccount({
        ...accountData,
        iconType: accountData.iconType ?? 'lucide',
      });
    }
    setEditingAccount(undefined);
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAccount(undefined);
  };

  return (
    <>
      <div className="mb-2">
        <NetWorthDisplay totalNetWorth={totalNetWorth} accountCount={accounts.length} />
      </div>

      <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
        <div />
        <div className="flex items-center self-start gap-3 md:self-center">
          <ViewSwitcher
            options={[
              { value: 'classic' as const, label: 'Classic' },
              { value: 'wallet' as const, label: 'Wallet Grid' },
            ]}
            value={viewMode}
            onChange={setViewMode}
          />
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
                onEdit={handleEdit}
                onDelete={onDeleteAccount}
              />
            ) : (
              <AccountCard
                key={account.id}
                account={account}
                onEdit={handleEdit}
                onDelete={onDeleteAccount}
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
              className="inline-flex items-center gap-2 px-6 py-3 font-medium text-white transition-all duration-200 bg-blue-600 shadow-lg hover:bg-blue-700 rounded-xl hover:shadow-xl hover:scale-105"
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
        onSave={handleSave}
        editingAccount={editingAccount}
      />

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed z-40 flex items-center justify-center text-white transition-all duration-200 bg-blue-600 rounded-full shadow-lg md:hidden bottom-6 right-6 w-14 h-14 hover:bg-blue-700 hover:shadow-xl hover:scale-105"
        aria-label="Add Account"
      >
        <Plus className="w-6 h-6" />
      </button>
    </>
  );
};

export default NetWorthPage;
