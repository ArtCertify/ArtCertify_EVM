import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PrivyProvider } from '@privy-io/react-auth';
import { base } from 'viem/chains';
import AssetDetailsPage from './components/AssetDetailsPage';
import { DashboardPage } from './components/DashboardPage';
import { CertificationsPage } from './components/CertificationsPage';
import { LoginPage } from './components/LoginPage';
import { OrganizationProfilePage } from './components/OrganizationProfilePage';
import { RolesPage } from './components/RolesPage';
import { AdminPage } from './components/AdminPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { OrganizationProvider } from './contexts/OrganizationContext';
import { config, validateConfig } from './config/environment';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, login } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900">
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage onLogin={login} />
            )
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/certificates"
          element={
            <ProtectedRoute>
              <CertificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asset/:assetId"
          element={
            <ProtectedRoute>
              <AssetDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <OrganizationProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <ProtectedRoute>
              <RolesPage />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<AdminPage />} />
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
};

function App() {
  useEffect(() => {
    validateConfig();
  }, []);

  const privyAppId = config.privyAppId || '';

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        defaultChain: base,
        supportedChains: [base],
        // Metodi di login (devono essere abilitati in dashboard.privy.io → Login methods)
        loginMethods: ['passkey', 'email', 'wallet', 'google', 'apple'],
        // Crea un embedded wallet al login se l'utente non ne ha uno (es. ha fatto login solo con passkey)
        // 'all-users' = sempre al login | 'users-without-wallets' = solo se non ha wallet | 'off' = mai
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
        appearance: {
          theme: 'dark',
          accentColor: '#2563eb',
          // logo: '/logo.png',                    // Logo nel modale Privy
          // landingHeader: 'ArtCertify',          // Intestazione sopra il modale
          loginMessage: 'Accedi per certificare su Base', // Testo sotto il logo (max 100 caratteri)
          // walletList: ['metamask', 'coinbase_wallet', 'rainbow', 'detected_wallets'], // Ordine wallet nel modale
        },
      }}
    >
      <AuthProvider>
        <OrganizationProvider>
          <Router>
            <AppRoutes />
          </Router>
        </OrganizationProvider>
      </AuthProvider>
    </PrivyProvider>
  );
}

export default App;
