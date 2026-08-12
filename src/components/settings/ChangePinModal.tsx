import React, { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ChangePinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangePin: (currentPin: string, newPin: string) => boolean;
}

type Step = 'current' | 'new' | 'confirm';

const ChangePinModal: React.FC<ChangePinModalProps> = ({ isOpen, onClose, onChangePin }) => {
  const [step, setStep] = useState<Step>('current');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('current');
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const activePin = step === 'current' ? currentPin : step === 'new' ? newPin : confirmPin;

  const resetAndClose = () => {
    setStep('current');
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    setError('');
    onClose();
  };

  const handleNumberPress = (number: string) => {
    if (activePin.length >= 4) return;

    const next = activePin + number;

    if (step === 'current') {
      setCurrentPin(next);
      setError('');
      if (next.length === 4) {
        setTimeout(() => setStep('new'), 200);
      }
      return;
    }

    if (step === 'new') {
      setNewPin(next);
      setError('');
      if (next.length === 4) {
        setTimeout(() => setStep('confirm'), 200);
      }
      return;
    }

    setConfirmPin(next);
    setError('');
    if (next.length === 4) {
      setTimeout(() => {
        if (next !== newPin) {
          setError('PINs do not match. Try again.');
          setNewPin('');
          setConfirmPin('');
          setStep('new');
          return;
        }

        const success = onChangePin(currentPin, newPin);
        if (success) {
          resetAndClose();
        } else {
          setError('Current PIN is incorrect.');
          setCurrentPin('');
          setNewPin('');
          setConfirmPin('');
          setStep('current');
        }
      }, 200);
    }
  };

  const handleDelete = () => {
    if (step === 'current') setCurrentPin((prev) => prev.slice(0, -1));
    else if (step === 'new') setNewPin((prev) => prev.slice(0, -1));
    else setConfirmPin((prev) => prev.slice(0, -1));
    setError('');
  };

  const stepLabel =
    step === 'current'
      ? 'Enter your current PIN'
      : step === 'new'
        ? 'Enter your new PIN'
        : 'Confirm your new PIN';

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-sm rounded-t-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800 sm:rounded-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Change PIN</h2>
          <button
            type="button"
            onClick={resetAndClose}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-400">{stepLabel}</p>

        {error && (
          <div className="mb-4 flex items-center justify-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <p className="text-sm font-medium text-red-500">{error}</p>
          </div>
        )}

        <div className="mb-8 flex justify-center gap-4">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`h-4 w-4 rounded-full border-2 transition-all duration-200 ${
                index < activePin.length
                  ? 'border-amber-400 bg-amber-400'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => handleNumberPress(number.toString())}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-xl font-medium text-gray-900 transition-all hover:bg-gray-100 active:scale-95 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              {number}
            </button>
          ))}
          <div />
          <button
            type="button"
            onClick={() => handleNumberPress('0')}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-xl font-medium text-gray-900 transition-all hover:bg-gray-100 active:scale-95 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={activePin.length === 0}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-900 transition-all hover:bg-gray-100 active:scale-95 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            aria-label="Delete"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePinModal;
