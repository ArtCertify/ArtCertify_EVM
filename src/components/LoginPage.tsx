import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletIcon, DevicePhoneMobileIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { usePrivy } from '@privy-io/react-auth';
import BackgroundLayout from './layout/BackgroundLayout';
import { getWalletAddressFromPrivyUser } from '../utils/privy';

interface LoginPageProps {
  onLogin: (address: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const { ready, authenticated, user, login: privyLogin, linkWallet: privyLinkWallet } = usePrivy();

  const walletAddress = getWalletAddressFromPrivyUser(user ?? undefined);

  useEffect(() => {
    if (ready && authenticated && walletAddress) {
      onLogin(walletAddress);
      navigate('/');
    }
  }, [ready, authenticated, walletAddress, onLogin, navigate]);

  const handleConnect = () => {
    if (authenticated && walletAddress) return; // già connesso, l'useEffect reindirizza
    // Se già loggato (es. email/social) ma senza wallet, usa "link" invece di "login"
    if (authenticated && !walletAddress) {
      privyLinkWallet();
      return;
    }
    privyLogin();
  };

  // Non usato: tenuto per compatibilità con HMR/cache (prima era usato in disabled)
  const isConnecting = false;

  return (
    <BackgroundLayout
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center px-4"
      backgroundDensity="low"
      backgroundOpacity="subtle"
      fullScreen={true}
    >
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 flex items-center justify-center">
              <img src="/logo.png" alt="ArtCertify Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-bold text-white">ArtCertify</span>
          </div>
          <p className="text-slate-300 text-sm">
            Certificazione blockchain per documenti e artefatti culturali (Base)
          </p>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-white mb-2">Accedi con Privy</h1>
            <p className="text-slate-400 text-sm">
              Con email o passkey Privy crea automaticamente un wallet su Base per te. Poi puoi certificare.
            </p>
          </div>

          <div className="mb-6">
            {authenticated && !walletAddress && (
              <div className="text-center mb-3 space-y-1">
                <p className="text-green-400 text-sm font-medium">
                  Accesso effettuato. Per certificare serve un wallet su Base.
                </p>
                <p className="text-slate-500 text-xs">
                  Clicca il pulsante qui sotto per creare un wallet (Privy) o collegare uno esistente.
                </p>
              </div>
            )}
            <button
              onClick={handleConnect}
              disabled={!ready || !!walletAddress}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-800 disabled:to-blue-900 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              {!ready ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Caricamento...</span>
                </>
              ) : walletAddress ? (
                <>
                  <WalletIcon className="w-5 h-5" />
                  <span>Wallet pronto — Reindirizzamento...</span>
                </>
              ) : authenticated && !walletAddress ? (
                <>
                  <WalletIcon className="w-5 h-5" />
                  <span>Crea o collega un wallet</span>
                </>
              ) : (
                <>
                  <WalletIcon className="w-5 h-5" />
                  <span>Accedi con email o passkey</span>
                </>
              )}
            </button>
          </div>

          {walletAddress && (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium text-sm">Wallet Connesso</span>
              </div>
              <p className="text-slate-300 text-xs font-mono break-all">{walletAddress}</p>
            </div>
          )}

          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-white font-medium mb-4 text-center">Come funziona:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                <DevicePhoneMobileIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white text-sm font-medium">Email o passkey</p>
                  <p className="text-slate-400 text-xs">
                    Privy crea automaticamente un wallet su Base. Niente seed phrase da gestire.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                <ComputerDesktopIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white text-sm font-medium">Wallet esterno (opzionale)</p>
                  <p className="text-slate-400 text-xs">
                    Puoi collegare MetaMask, Coinbase Wallet o altro wallet EVM su Base.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-slate-500 text-xs">
            Certificazioni registrate on-chain su Base come Soulbound Token (SBT)
          </p>
        </div>
      </div>
    </BackgroundLayout>
  );
};
