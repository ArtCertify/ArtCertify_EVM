import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { getWalletAddressFromPrivyUser } from '../utils/privy';

interface AuthContextType {
  userAddress: string | null;
  isAuthenticated: boolean;
  hasValidToken: boolean;
  login: (address: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { ready, authenticated, user, logout: privyLogout } = usePrivy();

  const userAddress = useMemo(() => getWalletAddressFromPrivyUser(user ?? undefined), [user]);

  const isAuthenticated = ready && authenticated && !!userAddress;

  const logout = async () => {
    await privyLogout();
    window.location.href = '/login';
  };

  const login = (_address: string) => {
    // No-op: Privy handles login via usePrivy().login()
  };

  const value = useMemo(
    () => ({
      userAddress,
      isAuthenticated,
      hasValidToken: isAuthenticated,
      login,
      logout,
    }),
    [userAddress, isAuthenticated, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
