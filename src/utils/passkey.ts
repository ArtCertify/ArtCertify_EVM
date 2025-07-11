import { type PasskeyCredential, type PasskeyAssertion, type PasskeyRegistrationOptions, type PasskeyAuthenticationOptions, type StoredPasskey, PasskeyError } from '../types/passkey';

// Storage key for passkeys
const PASSKEY_STORAGE_KEY = 'artcertify_passkeys';

// Helper to convert ArrayBuffer to base64
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper to convert base64 to ArrayBuffer
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Generate a random challenge
export function generateChallenge(): ArrayBuffer {
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);
  return challenge.buffer;
}

// Generate a random user ID
export function generateUserId(): ArrayBuffer {
  const userId = new Uint8Array(32);
  crypto.getRandomValues(userId);
  return userId.buffer;
}

// Check if WebAuthn is supported
export function isWebAuthnSupported(): boolean {
  const hasWindow = typeof window !== 'undefined';
  const hasPublicKeyCredential = hasWindow && !!window.PublicKeyCredential;
  const hasNavigatorCredentials = hasWindow && !!navigator.credentials;
  const hasCreateFunction = hasNavigatorCredentials && typeof navigator.credentials.create === 'function';
  const hasGetFunction = hasNavigatorCredentials && typeof navigator.credentials.get === 'function';
  
  const isSupported = hasWindow && hasPublicKeyCredential && hasNavigatorCredentials && hasCreateFunction && hasGetFunction;
  
  // Check if this is a secure context (HTTPS or localhost)
  const isSecureContext = hasWindow && (window.isSecureContext || 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' ||
    window.location.protocol === 'https:' ||
    // Allow for development on private networks
    window.location.hostname.startsWith('192.168.') ||
    window.location.hostname.startsWith('10.') ||
    window.location.hostname.startsWith('172.'));
  
  console.log('WebAuthn Support Check:', {
    hasWindow,
    hasPublicKeyCredential,
    hasNavigatorCredentials,
    hasCreateFunction,
    hasGetFunction,
    isSecureContext,
    hostname: hasWindow ? window.location.hostname : 'unknown',
    protocol: hasWindow ? window.location.protocol : 'unknown',
    isSupported: isSupported && isSecureContext
  });
  
  return isSupported && isSecureContext;
}

// Check if platform authenticator is available
export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  try {
    // Check if the method exists first
    if (!window.PublicKeyCredential || !PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
      return false;
    }
    
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch (error) {
    console.warn('Failed to check platform authenticator availability:', error);
    // Fallback: assume it's available if WebAuthn is supported
    return isWebAuthnSupported();
  }
}

// Create a new passkey
export async function createPasskey(
  username: string,
  displayName: string,
  rpId: string = window.location.hostname
): Promise<PasskeyCredential> {
  if (!isWebAuthnSupported()) {
    throw new Error('WebAuthn is not supported in this browser');
  }

  const challenge = generateChallenge();
  const userId = generateUserId();

  const options: PasskeyRegistrationOptions = {
    rp: {
      name: 'ArtCertify',
      id: rpId,
    },
    user: {
      id: userId,
      name: username,
      displayName: displayName,
    },
    challenge: challenge,
    pubKeyCredParams: [
      { type: 'public-key', alg: -7 }, // ES256
      { type: 'public-key', alg: -257 }, // RS256
    ],
    timeout: 60000,
    attestation: 'direct',
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      userVerification: 'required',
      residentKey: 'preferred',
    },
  };

  try {
    const credential = await navigator.credentials.create({
      publicKey: options,
    }) as PublicKeyCredential;

    if (!credential) {
      throw new Error('Failed to create passkey');
    }

    const passkeyCredential: PasskeyCredential = {
      id: credential.id,
      rawId: credential.rawId,
      response: credential.response as AuthenticatorAttestationResponse,
      type: credential.type as 'public-key',
      clientExtensionResults: credential.getClientExtensionResults(),
      authenticatorAttachment: credential.authenticatorAttachment as AuthenticatorAttachment || undefined,
    };

    return passkeyCredential;
  } catch (error) {
    console.error('Passkey creation failed:', error);
    
    // More specific error messages based on the error type
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        throw new PasskeyError({
          name: 'NotAllowedError',
          message: 'Passkey creation was canceled or not allowed. Please try again and allow the authentication.',
          code: 2
        });
      }
      if (error.name === 'NotSupportedError') {
        throw new PasskeyError({
          name: 'NotSupportedError',
          message: 'Passkeys are not supported on this device or browser.',
          code: 3
        });
      }
      if (error.name === 'SecurityError') {
        throw new PasskeyError({
          name: 'SecurityError',
          message: 'Security error: This might be due to an insecure context. Please use HTTPS or localhost.',
          code: 4
        });
      }
    }
    
    throw new PasskeyError({
      name: 'PasskeyCreationError',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
}

// Authenticate with passkey
export async function authenticateWithPasskey(
  credentialId?: string,
  rpId: string = window.location.hostname
): Promise<PasskeyAssertion> {
  if (!isWebAuthnSupported()) {
    throw new Error('WebAuthn is not supported in this browser');
  }

  const challenge = generateChallenge();

  const options: PasskeyAuthenticationOptions = {
    challenge: challenge,
    timeout: 60000,
    rpId: rpId,
    userVerification: 'required',
    allowCredentials: credentialId ? [{
      id: base64ToArrayBuffer(credentialId),
      type: 'public-key',
      transports: ['internal'],
    }] : undefined,
  };

  try {
    const assertion = await navigator.credentials.get({
      publicKey: options,
    }) as PublicKeyCredential;

    if (!assertion) {
      throw new Error('Failed to authenticate with passkey');
    }

    const passkeyAssertion: PasskeyAssertion = {
      id: assertion.id,
      rawId: assertion.rawId,
      response: assertion.response as AuthenticatorAssertionResponse,
      type: assertion.type as 'public-key',
      clientExtensionResults: assertion.getClientExtensionResults(),
      authenticatorAttachment: assertion.authenticatorAttachment as AuthenticatorAttachment || undefined,
    };

    return passkeyAssertion;
  } catch (error) {
    console.error('Passkey authentication failed:', error);
    throw new PasskeyError({
      name: 'PasskeyAuthenticationError',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
}

// Store passkey in localStorage
export function storePasskey(passkey: StoredPasskey): void {
  try {
    const stored = getStoredPasskeys();
    stored.push(passkey);
    localStorage.setItem(PASSKEY_STORAGE_KEY, JSON.stringify(stored));
  } catch (error) {
    console.error('Failed to store passkey:', error);
  }
}

// Get stored passkeys from localStorage
export function getStoredPasskeys(): StoredPasskey[] {
  try {
    const stored = localStorage.getItem(PASSKEY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get stored passkeys:', error);
    return [];
  }
}

// Remove stored passkey
export function removeStoredPasskey(id: string): void {
  try {
    const stored = getStoredPasskeys();
    const filtered = stored.filter(passkey => passkey.id !== id);
    localStorage.setItem(PASSKEY_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove stored passkey:', error);
  }
}

// Clear all stored passkeys
export function clearStoredPasskeys(): void {
  try {
    localStorage.removeItem(PASSKEY_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear stored passkeys:', error);
  }
} 