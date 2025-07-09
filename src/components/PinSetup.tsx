import React, { useState } from 'react';
import { Shield, Check } from 'lucide-react';

interface PinSetupProps {
  onPinSet: (pin: string) => void;
}

const PinSetup: React.FC<PinSetupProps> = ({ onPinSet }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'set' | 'confirm'>('set');
  const [error, setError] = useState('');

  const handleNumberPress = (number: string) => {
    if (step === 'set') {
      if (pin.length < 4) {
        const newPin = pin + number;
        setPin(newPin);
        if (newPin.length === 4) {
          setTimeout(() => {
            setStep('confirm');
          }, 200);
        }
      }
    } else {
      if (confirmPin.length < 4) {
        const newConfirmPin = confirmPin + number;
        setConfirmPin(newConfirmPin);
        if (newConfirmPin.length === 4) {
          setTimeout(() => {
            if (newConfirmPin === pin) {
              onPinSet(pin);
            } else {
              setError('PINs do not match. Try again.');
              setTimeout(() => {
                setPin('');
                setConfirmPin('');
                setStep('set');
                setError('');
              }, 1500);
            }
          }, 200);
        }
      }
    }
  };

  const handleDelete = () => {
    if (step === 'set') {
      setPin(pin.slice(0, -1));
    } else {
      setConfirmPin(confirmPin.slice(0, -1));
    }
    setError('');
  };

  const currentPin = step === 'set' ? pin : confirmPin;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            {step === 'set' ? 'Set Your PIN' : 'Confirm Your PIN'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {step === 'set' 
              ? 'Create a 4-digit PIN to secure your app'
              : 'Enter your PIN again to confirm'
            }
          </p>
        </div>

        {error && (
          <div className="text-center mb-6">
            <p className="text-red-500 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* PIN Display */}
        <div className="flex justify-center space-x-4 mb-12">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                index < currentPin.length
                  ? 'bg-blue-500 border-blue-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <button
              key={number}
              onClick={() => handleNumberPress(number.toString())}
              className="w-20 h-20 mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-2xl font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all duration-150 shadow-sm"
            >
              {number}
            </button>
          ))}
          
          {/* Empty space */}
          <div></div>
          
          {/* Zero */}
          <button
            onClick={() => handleNumberPress('0')}
            className="w-20 h-20 mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-2xl font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all duration-150 shadow-sm"
          >
            0
          </button>
          
          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={currentPin.length === 0}
            className="w-20 h-20 mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
            </svg>
          </button>
        </div>

        {step === 'confirm' && confirmPin.length === 4 && confirmPin === pin && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full mb-2">
              <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-green-600 dark:text-green-400 text-sm font-medium">PIN confirmed!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PinSetup;