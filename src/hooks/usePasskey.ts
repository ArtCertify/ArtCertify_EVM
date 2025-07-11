import { useState, useEffect, useCallback } from 'react';
import { 
  createPasskey, 
  authenticateWithPasskey, 
  storePasskey, 
  getStoredPasskeys, 
  removeStoredPasskey,
  isWebAuthnSupported,
  isPlatformAuthenticatorAvailable,
  arrayBufferToBase64
} from '../utils/passkey';
import { type StoredPasskey, type PasskeyCredential, type PasskeyAssertion } from '../types/passkey';

interface UsePasskeyReturn {
  passkeys: StoredPasskey[];
  isSupported: boolean;
  isPlatformAvailable: boolean;
  isLoading: boolean;
  error: string | null;
  createNewPasskey: (username: string, displayName: string) => Promise<PasskeyCredential | null>;
  authenticatePasskey: (credentialId?: string) => Promise<PasskeyAssertion | null>;
  removePasskey: (id: string) => void;
  clearError: () => void;
}

export const usePasskey = (): UsePasskeyReturn => {
  const [passkeys, setPasskeys] = useState<StoredPasskey[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const [isPlatformAvailable, setIsPlatformAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check WebAuthn support and platform authenticator availability
  useEffect(() => {
    const checkSupport = async () => {
      setIsSupported(isWebAuthnSupported());
      
      if (isWebAuthnSupported()) {
        try {
          const platformAvailable = await isPlatformAuthenticatorAvailable();
          setIsPlatformAvailable(platformAvailable);
        } catch (err) {
          console.warn('Failed to check platform authenticator:', err);
          setIsPlatformAvailable(false);
        }
      }
    };

    checkSupport();
  }, []);

  // Load stored passkeys
  useEffect(() => {
    const loadStoredPasskeys = () => {
      try {
        const stored = getStoredPasskeys();
        setPasskeys(stored);
      } catch (err) {
        console.error('Failed to load stored passkeys:', err);
        setError('Failed to load stored passkeys');
      }
    };

    loadStoredPasskeys();
  }, []);

  // Create new passkey
  const createNewPasskey = useCallback(async (
    username: string, 
    displayName: string
  ): Promise<PasskeyCredential | null> => {
    if (!isSupported) {
      setError('WebAuthn is not supported in this browser');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const credential = await createPasskey(username, displayName);
      
      // Store the passkey
      const storedPasskey: StoredPasskey = {
        id: credential.id,
        rawId: arrayBufferToBase64(credential.rawId),
        publicKey: arrayBufferToBase64(credential.response.getPublicKey() || new ArrayBuffer(0)),
        algorithm: credential.response.getPublicKeyAlgorithm(),
        createdAt: Date.now(),
        name: displayName,
      };

      storePasskey(storedPasskey);
      setPasskeys(prev => [...prev, storedPasskey]);

      return credential;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create passkey';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  // Authenticate with passkey
  const authenticatePasskey = useCallback(async (
    credentialId?: string
  ): Promise<PasskeyAssertion | null> => {
    if (!isSupported) {
      setError('WebAuthn is not supported in this browser');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const assertion = await authenticateWithPasskey(credentialId);
      return assertion;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to authenticate with passkey';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  // Remove passkey
  const removePasskey = useCallback((id: string) => {
    try {
      removeStoredPasskey(id);
      setPasskeys(prev => prev.filter(passkey => passkey.id !== id));
    } catch (err) {
      console.error('Failed to remove passkey:', err);
      setError('Failed to remove passkey');
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    passkeys,
    isSupported,
    isPlatformAvailable,
    isLoading,
    error,
    createNewPasskey,
    authenticatePasskey,
    removePasskey,
    clearError,
  };
}; 