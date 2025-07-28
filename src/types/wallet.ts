// EVM Wallet and Authentication Types

export interface WalletInfo {
  address: string;
  chainId: number;
  balance: string;
  smartAccountAddress?: string;
  isSmartAccount: boolean;
  accountType?: 'safe' | 'kernel' | 'simple';
}

export interface AuthState {
  isConnected: boolean;
  isLoading: boolean;
  address?: string;
  smartAccountAddress?: string;
  chainId?: number;
  balance?: string;
  error?: string;
}

export interface MockAuthData {
  address: string;
  smartAccountAddress: string;
  chainId: number;
  balance: string;
  accountType: 'safe' | 'kernel' | 'simple';
}

// Connection methods for mock implementation
export type ConnectionMethod = 'metamask' | 'walletconnect' | 'mock' | 'embedded';

export interface WalletConnection {
  method: ConnectionMethod;
  isConnected: boolean;
  address?: string;
  chainId?: number;
}

export interface TransactionRequest {
  to: string;
  value?: string;
  data?: string;
  gasLimit?: string;
}

export interface TransactionResult {
  hash: string;
  userOperationHash?: string;
  blockNumber?: number;
  gasUsed?: string;
  status: 'pending' | 'success' | 'failed';
} 