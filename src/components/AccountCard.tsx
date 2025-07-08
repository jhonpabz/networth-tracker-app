import React from 'react';
import { Edit2, Trash2, Building2, Banknote, CreditCard, Wallet, PiggyBank, Landmark, Leaf as Safe, Coins, DollarSign, TrendingUp } from 'lucide-react';
import { Account } from '../types/Account';
import { getColorClasses } from '../utils/colors';

interface AccountCardProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, onEdit, onDelete }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      'building-2': Building2,
      'banknote': Banknote,
      'credit-card': CreditCard,
      'wallet': Wallet,
      'piggy-bank': PiggyBank,
      'landmark': Landmark,
      'safe': Safe,
      'coins': Coins,
      'dollar-sign': DollarSign,
      'trending-up': TrendingUp,
    };
    return iconMap[iconName] || Building2;
  };

  const IconComponent = getIcon(account.icon);

  return (
    <div className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/40 transition-all duration-300">
      <div className={`${getColorClasses(account.color)} p-1 rounded-t-xl`}>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-white truncate">{account.name}</h3>
            </div>
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => onEdit(account)}
                className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
                aria-label="Edit account"
              >
                <Edit2 className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => onDelete(account.id)}
                className="p-1.5 bg-white/20 hover:bg-red-500/50 rounded-lg transition-colors duration-200"
                aria-label="Delete account"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {formatCurrency(account.balance)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Current Balance
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;