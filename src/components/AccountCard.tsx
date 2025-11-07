import React from 'react';
import { Edit2, Trash2, Building2 } from 'lucide-react';
import { Account } from '../types/Account';
import { getColorClasses } from '../utils/colors';
import { getIconOption, getLucideIcon } from '../utils/icons';

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

  const iconOption = getIconOption(account.icon);
  const resolvedIconType = account.iconType ?? iconOption?.type ?? 'lucide';
  const IconComponent = resolvedIconType === 'lucide'
    ? getLucideIcon(account.icon) ?? Building2
    : undefined;
  const imageSrc = resolvedIconType === 'image' ? iconOption?.src : undefined;
  const FallbackIcon = IconComponent ?? Building2;

  return (
    <div className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/40 transition-all duration-300">
      <div className={`${getColorClasses(account.color)} p-1 rounded-t-xl`}>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                {resolvedIconType === 'image' && imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={`${account.name} icon`}
                    className="w-6 h-6 object-contain"
                  />
                ) : (
                  <FallbackIcon className="w-5 h-5 text-white" />
                )}
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