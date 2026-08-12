import React from 'react';
import { ScanFace } from 'lucide-react';

interface PinKeypadProps {
  onNumberPress: (number: string) => void;
  onDelete: () => void;
  disabled?: boolean;
  deleteDisabled?: boolean;
  showBiometric?: boolean;
  onBiometricAuth?: () => void | Promise<void>;
}

const keyButtonClass =
  'w-20 h-20 mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-2xl font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center';

const PinKeypad: React.FC<PinKeypadProps> = ({
  onNumberPress,
  onDelete,
  disabled = false,
  deleteDisabled = false,
  showBiometric = false,
  onBiometricAuth,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
        <button
          key={number}
          type="button"
          onClick={() => onNumberPress(number.toString())}
          disabled={disabled}
          className={keyButtonClass}
        >
          {number}
        </button>
      ))}

      {showBiometric && onBiometricAuth ? (
        <button
          type="button"
          onClick={onBiometricAuth}
          disabled={disabled}
          aria-label="Use Face ID or Touch ID"
          className={keyButtonClass}
        >
          <ScanFace className="w-6 h-6" />
        </button>
      ) : (
        <div className="w-20 h-20 mx-auto" aria-hidden="true" />
      )}

      <button
        type="button"
        onClick={() => onNumberPress('0')}
        disabled={disabled}
        className={keyButtonClass}
      >
        0
      </button>

      <button
        type="button"
        onClick={onDelete}
        disabled={deleteDisabled}
        aria-label="Delete"
        className={keyButtonClass}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
          />
        </svg>
      </button>
    </div>
  );
};

export default PinKeypad;
