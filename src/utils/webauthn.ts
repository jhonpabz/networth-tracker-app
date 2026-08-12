const CREDENTIAL_ID_KEY = 'webauthn-credential-id';

export class WebAuthnError extends Error {
  constructor(
    message: string,
    public readonly code: 'unsupported' | 'cancelled' | 'failed' | 'not-enrolled'
  ) {
    super(message);
    this.name = 'WebAuthnError';
  }
}

export function isWebAuthnSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.PublicKeyCredential !== 'undefined' &&
    typeof navigator.credentials !== 'undefined' &&
    typeof navigator.credentials.create === 'function' &&
    typeof navigator.credentials.get === 'function'
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export function getStoredCredentialId(): string | null {
  try {
    return localStorage.getItem(CREDENTIAL_ID_KEY);
  } catch {
    return null;
  }
}

export function clearStoredCredentialId(): void {
  try {
    localStorage.removeItem(CREDENTIAL_ID_KEY);
  } catch {
    // ignore storage errors
  }
}

function getRpId(): string {
  const hostname = window.location.hostname;
  return hostname || 'localhost';
}

export async function registerBiometrics(): Promise<string> {
  if (!isWebAuthnSupported()) {
    throw new WebAuthnError(
      'Biometric authentication is not supported on this device or browser.',
      'unsupported'
    );
  }

  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const userId = crypto.getRandomValues(new Uint8Array(16));

  const options: PublicKeyCredentialCreationOptions = {
    challenge,
    rp: {
      name: 'Net Worth Tracker',
      id: getRpId(),
    },
    user: {
      id: userId,
      name: 'local-user',
      displayName: 'Local User',
    },
    pubKeyCredParams: [
      { alg: -7, type: 'public-key' },
      { alg: -257, type: 'public-key' },
    ],
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      userVerification: 'required',
      residentKey: 'preferred',
    },
    timeout: 60_000,
    attestation: 'none',
  };

  try {
    const credential = (await navigator.credentials.create({
      publicKey: options,
    })) as PublicKeyCredential | null;

    if (!credential) {
      throw new WebAuthnError('Biometric registration was cancelled.', 'cancelled');
    }

    const credentialId = arrayBufferToBase64(credential.rawId);
    localStorage.setItem(CREDENTIAL_ID_KEY, credentialId);
    return credentialId;
  } catch (error) {
    if (error instanceof WebAuthnError) throw error;

    const domError = error as DOMException;
    if (domError.name === 'NotAllowedError') {
      throw new WebAuthnError('Biometric registration was cancelled.', 'cancelled');
    }

    throw new WebAuthnError(
      domError.message || 'Failed to register biometrics.',
      'failed'
    );
  }
}

export async function authenticateBiometrics(): Promise<boolean> {
  if (!isWebAuthnSupported()) {
    throw new WebAuthnError(
      'Biometric authentication is not supported on this device or browser.',
      'unsupported'
    );
  }

  const storedCredentialId = getStoredCredentialId();
  if (!storedCredentialId) {
    throw new WebAuthnError('No biometric credential is enrolled.', 'not-enrolled');
  }

  const challenge = crypto.getRandomValues(new Uint8Array(32));

  const options: PublicKeyCredentialRequestOptions = {
    challenge,
    allowCredentials: [
      {
        id: base64ToArrayBuffer(storedCredentialId),
        type: 'public-key',
        transports: ['internal'],
      },
    ],
    userVerification: 'required',
    timeout: 60_000,
  };

  try {
    const assertion = (await navigator.credentials.get({
      publicKey: options,
    })) as PublicKeyCredential | null;

    if (!assertion) {
      throw new WebAuthnError('Biometric authentication was cancelled.', 'cancelled');
    }

    const returnedId = arrayBufferToBase64(assertion.rawId);
    return returnedId === storedCredentialId;
  } catch (error) {
    if (error instanceof WebAuthnError) throw error;

    const domError = error as DOMException;
    if (domError.name === 'NotAllowedError') {
      throw new WebAuthnError('Biometric authentication was cancelled.', 'cancelled');
    }

    throw new WebAuthnError(
      domError.message || 'Biometric authentication failed.',
      'failed'
    );
  }
}
