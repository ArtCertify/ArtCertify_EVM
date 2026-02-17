/**
 * Stub for EVM: no JWT/signature flow. Auth is via Privy.
 */
import React from 'react';

interface WalletSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress?: string;
}

export const WalletSignatureModal: React.FC<WalletSignatureModalProps> = () => null;
