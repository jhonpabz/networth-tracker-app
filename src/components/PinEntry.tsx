import React, { useState, useEffect } from 'react';
import { Lock, AlertCircle, ArrowLeft } from 'lucide-react';

interface PinEntryProps {
  onPinEntered: (pin: string) => void;
  onForgotPin: () => void;
  securityQuestion?: string;
  onSecurityAnswer?: (answer: string) => boolean;
}

const PinEntry: React.FC<PinEntryProps> = ({ onPinEntered, onForgotPin, securityQuestion, onSecurityAnswer }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);
  const [showSecurityQuestion, setShowSecurityQuestion] = useState(false);
  const [securityAnswer, setSecurityAnswer] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLocked && lockTime > 0) {
      interval = setInterval(() => {
        setLockTime((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockTime]);

  const handleNumberPress = (number: string) => {
    if (isLocked) return;
    
    if (pin.length < 4) {
      const newPin = pin + number;
      setPin(newPin);
      setError('');
      
      if (newPin.length === 4) {
        setTimeout(() => {
          onPinEntered(newPin);
        }, 200);
      }
    }
  };

  const handleDelete = () => {
    if (isLocked) return;
    setPin(pin.slice(0, -1));
    setError('');
  };

  const handleIncorrectPin = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setPin('');
    
    if (newAttempts >= 5) {
      setIsLocked(true);
      setLockTime(30); // 30 seconds lockout
      setError('Too many attempts. Try again in 30 seconds.');
    } else {
      setError(`Incorrect PIN. ${5 - newAttempts} attempts remaining.`);
    }
  };

  const handleForgotPin = () => {
    if (securityQuestion && onSecurityAnswer) {
      setShowSecurityQuestion(true);
      setError('');
    } else {
      onForgotPin();
    }
  };

  const handleSecuritySubmit = () => {
    if (!securityAnswer.trim()) {
      setError('Please enter your answer.');
      return;
    }

    if (onSecurityAnswer && onSecurityAnswer(securityAnswer.trim().toLowerCase())) {
      // Security answer is correct, reset PIN
      onForgotPin();
    } else {
      setError('Incorrect answer. Please try again.');
      setSecurityAnswer('');
    }
  };

  const handleBackToPin = () => {
    setShowSecurityQuestion(false);
    setSecurityAnswer('');
    setError('');
  };

  // This effect should be called from parent when PIN is incorrect
  useEffect(() => {
    const handleMessage = (event: CustomEvent) => {
      if (event.type === 'incorrectPin') {
        handleIncorrectPin();
      }
    };

    window.addEventListener('incorrectPin' as any, handleMessage);
    return () => window.removeEventListener('incorrectPin' as any, handleMessage);
  }, [attempts]);

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  if (showSecurityQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Security Question
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Answer your security question to reset your PIN
            </p>
          </div>

          {error && (
            <div className="flex items-center justify-center space-x-2 mb-6">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-red-500 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Security Question
              </label>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-gray-900 dark:text-white">{securityQuestion}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Answer
              </label>
              <input
                type="text"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSecuritySubmit()}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your answer..."
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBackToPin}
                className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={handleSecuritySubmit}
                disabled={!securityAnswer.trim()}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Enter Your PIN
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isLocked 
              ? `Locked for ${formatTime(lockTime)}`
              : 'Enter your 4-digit PIN to continue'
            }
          </p>
        </div>

        {error && (
          <div className="flex items-center justify-center space-x-2 mb-6">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-red-500 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* PIN Display */}
        <div className="flex justify-center space-x-4 mb-12">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                index < pin.length
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
              disabled={isLocked}
              className="w-20 h-20 mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-2xl font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {number}
            </button>
          ))}
          
          {/* Empty space */}
          <div></div>
          
          {/* Zero */}
          <button
            onClick={() => handleNumberPress('0')}
            disabled={isLocked}
            className="w-20 h-20 mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-2xl font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            0
          </button>
          
          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={pin.length === 0 || isLocked}
            className="w-20 h-20 mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
            </svg>
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={handleForgotPin}
            className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
          >
            Forgot PIN?
          </button>
        </div>
      </div>
    </div>
  );
};

export default PinEntry;