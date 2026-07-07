import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

interface DeleteDepositModalProps {
  isOpen: boolean;
  dateLabel: string;
  amountPhp: number;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteDepositModal: React.FC<DeleteDepositModalProps> = ({
  isOpen,
  dateLabel,
  amountPhp,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-500/10 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Delete deposit?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This will permanently remove the{' '}
            <span className="font-medium text-gray-900 dark:text-white">{dateLabel}</span> deposit
            of{' '}
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              {formatCurrency(amountPhp)}
            </span>
            . This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3 p-5 pt-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDepositModal;
