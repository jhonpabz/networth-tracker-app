import React from 'react';
import { Edit2, Trash2, Building2 } from 'lucide-react';
import { Account } from '../types/Account';
import { getTilePalette } from '../utils/colors';
import { getIconOption, getLucideIcon } from '../utils/icons';

interface AccountCardTileProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
}

const AccountCardTile: React.FC<AccountCardTileProps> = ({ account, onEdit, onDelete }) => {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);

  const palette = getTilePalette(account.color);
  const iconOption = getIconOption(account.icon);
  const resolvedIconType = account.iconType ?? iconOption?.type ?? 'lucide';
  const IconComponent = resolvedIconType === 'lucide'
    ? getLucideIcon(account.icon) ?? Building2
    : undefined;
  const iconSrc = resolvedIconType === 'image' ? iconOption?.src : undefined;
  const FallbackIcon = IconComponent ?? Building2;
  const subtitle = iconOption?.type === 'image' ? iconOption.name : 'Savings Wallet';

  return (
    <div className={`group relative overflow-hidden rounded-3xl shadow-lg transition-transform duration-300 hover:-translate-y-1`}>
      <div className={`${palette.background} p-5 h-full flex flex-col justify-between min-h-[190px]`}>
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => onEdit(account)}
            className="p-2 rounded-xl bg-white/15 backdrop-blur-md text-white hover:bg-white/25 transition-colors duration-200"
            aria-label="Edit account"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(account.id)}
            className="p-2 rounded-xl bg-white/15 backdrop-blur-md text-white hover:bg-red-500/60 transition-colors duration-200"
            aria-label="Delete account"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            {resolvedIconType === 'image' && iconSrc ? (
              <img src={iconSrc} alt={`${account.name} icon`} className="w-10 h-10 object-contain" />
            ) : (
              <FallbackIcon className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <span className={`text-xs font-semibold uppercase tracking-wide ${palette.subtleText}`}>
              {subtitle}
            </span>
            <h3 className="mt-1 text-xl font-semibold text-white truncate max-w-[140px]">
              {account.name}
            </h3>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-[13px] uppercase tracking-wide text-white/70">
            Current Balance
          </p>
          <p className="text-3xl font-bold text-white mt-1">
            {formatCurrency(account.balance)}
          </p>
        </div>
      </div>
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-white/10" />
    </div>
  );
};

export default AccountCardTile;

