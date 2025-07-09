import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const usePin = () => {
  const [storedPin, setStoredPin] = useLocalStorage<string | null>('userPin', null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated in this session
    const sessionAuth = sessionStorage.getItem('pinAuthenticated');
    if (sessionAuth === 'true' && storedPin) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [storedPin]);

  const setPin = (pin: string) => {
    setStoredPin(pin);
    setIsAuthenticated(true);
    sessionStorage.setItem('pinAuthenticated', 'true');
  };

  const verifyPin = (enteredPin: string) => {
    if (enteredPin === storedPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem('pinAuthenticated', 'true');
      return true;
    } else {
      // Dispatch custom event for incorrect PIN
      window.dispatchEvent(new CustomEvent('incorrectPin'));
      return false;
    }
  };

  const resetPin = () => {
    setStoredPin(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('pinAuthenticated');
    // Also clear all app data when PIN is reset
    localStorage.clear();
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('pinAuthenticated');
  };

  return {
    hasPin: !!storedPin,
    isAuthenticated,
    isLoading,
    setPin,
    verifyPin,
    resetPin,
    logout
  };
};