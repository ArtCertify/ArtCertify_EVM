export interface PasskeyCredential {
  id: string;
  rawId: ArrayBuffer;
  response: AuthenticatorAttestationResponse;
  type: 'public-key';
  clientExtensionResults: AuthenticationExtensionsClientOutputs;
  authenticatorAttachment?: AuthenticatorAttachment;
}

export interface PasskeyAssertion {
  id: string;
  rawId: ArrayBuffer;
  response: AuthenticatorAssertionResponse;
  type: 'public-key';
  clientExtensionResults: AuthenticationExtensionsClientOutputs;
  authenticatorAttachment?: AuthenticatorAttachment;
}

export interface PasskeyRegistrationOptions {
  rp: {
    name: string;
    id: string;
  };
  user: {
    id: ArrayBuffer;
    name: string;
    displayName: string;
  };
  challenge: ArrayBuffer;
  pubKeyCredParams: PublicKeyCredentialParameters[];
  timeout?: number;
  attestation?: AttestationConveyancePreference;
  authenticatorSelection?: AuthenticatorSelectionCriteria;
  excludeCredentials?: PublicKeyCredentialDescriptor[];
  extensions?: AuthenticationExtensionsClientInputs;
}

export interface PasskeyAuthenticationOptions {
  challenge: ArrayBuffer;
  timeout?: number;
  rpId?: string;
  allowCredentials?: PublicKeyCredentialDescriptor[];
  userVerification?: UserVerificationRequirement;
  extensions?: AuthenticationExtensionsClientInputs;
}

export interface StoredPasskey {
  id: string;
  rawId: string;
  publicKey: string;
  algorithm: number;
  createdAt: number;
  name: string;
}

export class PasskeyError extends Error {
  code?: number;
  
  constructor(options: { name: string; message: string; code?: number }) {
    super(options.message);
    this.name = options.name;
    this.code = options.code;
    Object.setPrototypeOf(this, PasskeyError.prototype);
  }
}

export interface PasskeySignature {
  r: string;
  s: string;
  yParity: number;
  authenticatorData: string;
  clientDataJSON: string;
  signature: string;
}

export interface WebAuthnCredential {
  credentialId: string;
  publicKey: string;
  algorithm: number;
  transports?: AuthenticatorTransport[];
} 