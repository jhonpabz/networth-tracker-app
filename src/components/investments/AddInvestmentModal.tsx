import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AssetType, TransactionSide } from '../../types/Investment';
import { getAssetName } from '../../utils/investmentCalculations';

interface AddInvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: {
    assetType: AssetType;
    ticker: string;
    name: string;
    side: TransactionSide;
    quantity: number;
    entryPrice: number;
    date: string;
  }) => void;
}

const AddInvestmentModal: React.FC<AddInvestmentModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    assetType: 'stock' as AssetType,
    ticker: '',
    side: 'buy' as TransactionSide,
    quantity: '',
    entryPrice: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        assetType: 'stock',
        ticker: '',
        side: 'buy',
        quantity: '',
        entryPrice: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ticker.trim() || !formData.quantity || !formData.entryPrice) return;

    const ticker = formData.ticker.toUpperCase().trim();
    onSave({
      assetType: formData.assetType,
      ticker,
      name: getAssetName(ticker),
      side: formData.side,
      quantity: parseFloat(formData.quantity),
      entryPrice: parseFloat(formData.entryPrice),
      date: formData.date,
    });
    onClose();
  };

  if (!isOpen) return null;

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Log Transaction
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Asset Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['stock', 'crypto'] as AssetType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, assetType: type })}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border-2 capitalize transition-all duration-200 ${
                    formData.assetType === type
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="ticker" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ticker
            </label>
            <input
              type="text"
              id="ticker"
              value={formData.ticker}
              onChange={(e) => setFormData({ ...formData, ticker: e.target.value.toUpperCase() })}
              className={inputClass}
              placeholder="e.g., AAPL, BTC"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buy / Sell
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['buy', 'sell'] as TransactionSide[]).map((side) => (
                <button
                  key={side}
                  type="button"
                  onClick={() => setFormData({ ...formData, side })}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border-2 capitalize transition-all duration-200 ${
                    formData.side === side
                      ? side === 'buy'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                        : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                      : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {side}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className={inputClass}
                placeholder="0"
                step="any"
                min="0"
                required
              />
            </div>
            <div>
              <label htmlFor="entryPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Entry Price (₱)
              </label>
              <input
                type="number"
                id="entryPrice"
                value={formData.entryPrice}
                onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
                className={inputClass}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={inputClass}
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
              Log Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInvestmentModal;
