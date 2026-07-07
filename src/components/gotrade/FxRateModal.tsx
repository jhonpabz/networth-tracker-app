import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface FxRateModalProps {
  isOpen: boolean;
  fxRate: number;
  onClose: () => void;
  onSave: (rate: number) => void;
}

const FxRateModal: React.FC<FxRateModalProps> = ({ isOpen, fxRate, onClose, onSave }) => {
  const [fxInput, setFxInput] = useState(fxRate.toString());

  useEffect(() => {
    if (isOpen) {
      setFxInput(fxRate.toString());
    }
  }, [isOpen, fxRate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(fxInput);
    if (!isNaN(parsed) && parsed > 0) {
      onSave(parsed);
      onClose();
    }
  };

  const handleFxChange = (value: string) => {
    const sanitized = value.replace(/[^\d.]/g, '');
    const parts = sanitized.split('.');
    const normalized =
      parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : sanitized;
    setFxInput(normalized);
  };

  if (!isOpen) return null;

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xs">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">USD/PHP Rate</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label htmlFor="fx-rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Exchange Rate
            </label>
            <input
              type="text"
              inputMode="decimal"
              id="fx-rate"
              value={fxInput}
              onChange={(e) => handleFxChange(e.target.value)}
              className={inputClass}
              placeholder="58.00"
              autoFocus
              required
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              1 USD = this many PHP
            </p>
          </div>

          <div className="flex gap-3 pt-1">
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FxRateModal;
