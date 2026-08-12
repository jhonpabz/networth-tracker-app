import { useCallback, useState } from 'react';
import {
  authenticateBiometrics,
  clearStoredCredentialId,
  getStoredCredentialId,
  isWebAuthnSupported,
  registerBiometrics,
  WebAuthnError,
} from '../utils/webauthn';

export function useWebAuthn() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSupported = isWebAuthnSupported();
  const hasCredential = !!getStoredCredentialId();

  const register = useCallback(async (): Promise<boolean> => {
    setIsProcessing(true);
    setError(null);

    try {
      await registerBiometrics();
      return true;
    } catch (err) {
      const message =
        err instanceof WebAuthnError
          ? err.message
          : 'Failed to enable biometric authentication.';
      setError(message);
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const authenticate = useCallback(async (): Promise<boolean> => {
    setIsProcessing(true);
    setError(null);

    try {
      return await authenticateBiometrics();
    } catch (err) {
      const message =
        err instanceof WebAuthnError
          ? err.message
          : 'Biometric authentication failed.';
      setError(message);
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const removeCredential = useCallback(() => {
    clearStoredCredentialId();
    setError(null);
  }, []);

  return {
    isSupported,
    hasCredential,
    isProcessing,
    error,
    register,
    authenticate,
    removeCredential,
    clearError: () => setError(null),
  };
}
