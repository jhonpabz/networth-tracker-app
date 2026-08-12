import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface SecurityData {
  pin: string;
  question: string;
  answer: string;
}

export const usePin = () => {
  const [securityData, setSecurityData] = useLocalStorage<SecurityData | null>('userSecurity', null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated in this session
    const sessionAuth = sessionStorage.getItem('pinAuthenticated');
    if (sessionAuth === 'true' && securityData) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [securityData]);

  const setPin = (pin: string, securityQuestion: string, securityAnswer: string) => {
    const newSecurityData: SecurityData = {
      pin,
      question: securityQuestion,
      answer: securityAnswer
    };
    setSecurityData(newSecurityData);
    setIsAuthenticated(true);
    sessionStorage.setItem('pinAuthenticated', 'true');
  };

  const verifyPin = (enteredPin: string) => {
    if (securityData && enteredPin === securityData.pin) {
      setIsAuthenticated(true);
      sessionStorage.setItem('pinAuthenticated', 'true');
      return true;
    } else {
      // Dispatch custom event for incorrect PIN
      window.dispatchEvent(new CustomEvent('incorrectPin'));
      return false;
    }
  };

  const verifySecurityAnswer = (enteredAnswer: string) => {
    if (securityData && enteredAnswer.toLowerCase() === securityData.answer.toLowerCase()) {
      return true;
    }
    return false;
  };

  const resetPin = () => {
    setSecurityData(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('pinAuthenticated');
    // Also clear all app data when PIN is reset
    localStorage.clear();
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('pinAuthenticated');
  };

  const changePin = (currentPin: string, newPin: string) => {
    if (!securityData || currentPin !== securityData.pin) {
      return false;
    }

    setSecurityData({ ...securityData, pin: newPin });
    return true;
  };

  const authenticateSession = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('pinAuthenticated', 'true');
  };

  return {
    hasPin: !!securityData,
    isAuthenticated,
    isLoading,
    securityQuestion: securityData?.question,
    setPin,
    verifyPin,
    verifySecurityAnswer,
    resetPin,
    logout,
    changePin,
    authenticateSession,
  };
};