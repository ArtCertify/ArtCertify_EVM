import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, MockAuthData, ConnectionMethod } from '../types/wallet';
import { config } from '../config/environment';

interface AuthContextType extends AuthState {
  connect: (method?: ConnectionMethod) => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock wallet data for development
const MOCK_ACCOUNTS: MockAuthData[] = [
  {
    address: '0x742d35Cc6635C0532925a3b8D0f0e8F72E8E8B9A',
    smartAccountAddress: '0x1234567890123456789012345678901234567890',
    chainId: 11155111, // Sepolia
    balance: '1.2345',
    accountType: 'safe'
  },
  {
    address: '0x892d35Cc6635C0532925a3b8D0f0e8F72E8E8B9B',
    smartAccountAddress: '0x2345678901234567890123456789012345678901',
    chainId: 11155111, // Sepolia
    balance: '0.8765',
    accountType: 'kernel'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isConnected: false,
    isLoading: false,
  });

  // Check for persisted session on mount
  useEffect(() => {
    const persistedAuth = localStorage.getItem('artcertify-evm-auth');
    if (persistedAuth && config.enableMockData) {
      try {
        const parsedAuth = JSON.parse(persistedAuth);
        setAuthState({
          ...parsedAuth,
          isLoading: false,
        });
      } catch (error) {
        console.warn('Failed to parse persisted auth:', error);
        localStorage.removeItem('artcertify-evm-auth');
      }
    }
  }, []);

  const connect = async (method: ConnectionMethod = 'mock') => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      if (config.enableMockData || method === 'mock') {
        // Mock connection
        const randomAccount = MOCK_ACCOUNTS[Math.floor(Math.random() * MOCK_ACCOUNTS.length)];
        
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newAuthState = {
          isConnected: true,
          isLoading: false,
          address: randomAccount.address,
          smartAccountAddress: randomAccount.smartAccountAddress,
          chainId: randomAccount.chainId,
          balance: randomAccount.balance,
        };

        setAuthState(newAuthState);
        
        // Persist session
        localStorage.setItem('artcertify-evm-auth', JSON.stringify(newAuthState));
        
        console.log('🔗 Mock wallet connected:', {
          address: randomAccount.address,
          smartAccount: randomAccount.smartAccountAddress,
          accountType: randomAccount.accountType,
          balance: randomAccount.balance
        });
      } else {
        // Real wallet connection would go here
        // For now, fallback to mock
        throw new Error('Real wallet connection not implemented yet');
      }
    } catch (error) {
      console.error('Connection failed:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Connection failed'
      }));
    }
  };

  const disconnect = () => {
    setAuthState({
      isConnected: false,
      isLoading: false,
    });
    
    localStorage.removeItem('artcertify-evm-auth');
    console.log('🔌 Wallet disconnected');
  };

  const switchNetwork = async (chainId: number) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // Mock network switch
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAuthState(prev => ({
        ...prev,
        chainId,
        isLoading: false,
      }));

      console.log(`🌐 Switched to network: ${chainId}`);
    } catch (error) {
      console.error('Network switch failed:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Network switch failed'
      }));
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      connect,
      disconnect,
      switchNetwork,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 