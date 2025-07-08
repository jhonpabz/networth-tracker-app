import React, { useState, useEffect } from 'react';
import { X, Building2, Banknote, CreditCard, Wallet, PiggyBank, Landmark, Leaf as Safe, Coins, DollarSign, TrendingUp } from 'lucide-react';
import { Account } from '../types/Account';
import { colorOptions } from '../utils/colors';
import { iconOptions } from '../utils/icons';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: Omit<Account, 'id'>) => void;
  editingAccount?: Account;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose, onSave, editingAccount }) => {
  const [formData, setFormData] = useState({
    name: '',
    balance: '',
    color: 'blue',
    icon: 'building-2',
  });

  useEffect(() => {
    if (editingAccount) {
      setFormData({
        name: editingAccount.name,
        balance: editingAccount.balance.toString(),
        color: editingAccount.color,
        icon: editingAccount.icon,
      });
    } else {
      setFormData({
        name: '',
        balance: '',
        color: 'blue',
        icon: 'building-2',
      });
    }
  }, [editingAccount, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.balance.trim()) {
      onSave({
        name: formData.name.trim(),
        balance: parseFloat(formData.balance),
        color: formData.color,
        icon: formData.icon,
      });
      onClose();
    }
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {editingAccount ? 'Edit Account' : 'Add New Account'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Account Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., BDO Savings Account"
              required
            />
          </div>

          <div>
            <label htmlFor="balance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Balance (₱)
            </label>
            <input
              type="number"
              id="balance"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Choose Color
            </label>
            <div className="grid grid-cols-4 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`p-3 rounded-lg bg-gradient-to-br ${color.gradient} hover:scale-105 transition-all duration-200 ${
                    formData.color === color.value ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800' : ''
                  }`}
                  aria-label={`Select ${color.name} color`}
                >
                  <div className="w-6 h-6 rounded-full bg-white/20"></div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Choose Icon
            </label>
            <div className="grid grid-cols-5 gap-3">
              {iconOptions.map((icon) => {
                const IconComponent = getIcon(icon.value);
                return (
                  <button
                    key={icon.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: icon.value })}
                    className={`p-3 rounded-lg border-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 ${
                      formData.icon === icon.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600'
                    }`}
                    aria-label={`Select ${icon.name} icon`}
                  >
                    <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
            >
              {editingAccount ? 'Update' : 'Add'} Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccountModal;