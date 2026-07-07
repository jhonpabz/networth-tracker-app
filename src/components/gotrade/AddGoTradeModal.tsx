import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AddGoTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: { date: string; amountPhp: number }) => void;
}

const AddGoTradeModal: React.FC<AddGoTradeModalProps> = ({ isOpen, onClose, onSave }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amountPhp, setAmountPhp] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDate(new Date().toISOString().split('T')[0]);
      setAmountPhp('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amountPhp);
    if (!amountPhp || isNaN(parsed) || parsed <= 0) return;

    onSave({ date, amountPhp: parsed });
    onClose();
  };

  if (!isOpen) return null;

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add Deposit</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label htmlFor="gotrade-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              id="gotrade-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`${inputClass} w-full max-w-[11.5rem] block`}
              required
            />
          </div>

          <div>
            <label htmlFor="gotrade-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount in PHP
            </label>
            <input
              type="number"
              id="gotrade-amount"
              value={amountPhp}
              onChange={(e) => setAmountPhp(e.target.value)}
              className={inputClass}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
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
              Add Deposit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGoTradeModal;
