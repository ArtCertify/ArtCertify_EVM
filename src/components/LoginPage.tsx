import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletIcon, FingerPrintIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
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

  const handleLinkWallet = () => {
    privyLinkWallet();
  };

  const handleLoginPasskey = () => {
    privyLogin({ loginMethods: ['passkey'] });
  };

  const handleLoginEmail = () => {
    privyLogin({ loginMethods: ['email'] });
  };

  const handleLoginWallet = () => {
    privyLogin({ loginMethods: ['wallet'] });
  };

  const showWalletStep = authenticated && !walletAddress;
  const showLoginOptions = !authenticated && !walletAddress;

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
            <h1 className="text-xl font-semibold text-white mb-2">Accedi</h1>
            <p className="text-slate-400 text-sm">
              Scegli come accedere. Privy crea un wallet su Base per te.
            </p>
          </div>

          {showWalletStep && (
            <div className="mb-6 space-y-3">
              <p className="text-green-400 text-sm font-medium text-center">
                Accesso effettuato. Per certificare serve un wallet su Base.
              </p>
              <p className="text-slate-500 text-xs text-center">
                Crea un wallet (Privy) o collegane uno esistente.
              </p>
              <button
                onClick={handleLinkWallet}
                disabled={!ready}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg"
              >
                <WalletIcon className="w-5 h-5" />
                <span>Crea o collega un wallet</span>
              </button>
            </div>
          )}

          {showLoginOptions && (
            <div className="mb-6 space-y-3">
              {!ready ? (
                <div className="flex items-center justify-center gap-3 py-4 text-slate-400">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-500 border-t-transparent" />
                  <span>Caricamento...</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleLoginPasskey}
                    disabled={!ready}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl border-2 border-blue-500/50"
                  >
                    <FingerPrintIcon className="w-6 h-6 flex-shrink-0" />
                    <span className="flex flex-col items-center sm:flex-row sm:gap-2">
                      <span>Accedi con passkey</span>
                      <span className="text-xs font-normal opacity-90">(impronta / Face ID)</span>
                    </span>
                  </button>
                  <button
                    onClick={handleLoginEmail}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-3 border border-slate-600"
                  >
                    <EnvelopeIcon className="w-5 h-5" />
                    <span>Accedi con email</span>
                  </button>
                  <div className="pt-1 text-center">
                    <button
                      type="button"
                      onClick={handleLoginWallet}
                      className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
                    >
                      Accedi con wallet
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {walletAddress && (
            <div className="flex items-center justify-center gap-3 py-4 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Wallet pronto — Reindirizzamento...</span>
            </div>
          )}

          <div className="border-t border-slate-700 pt-4 mt-4">
            <p className="text-slate-500 text-xs text-center mb-2">Passkey e email: wallet creato su Base. Wallet: collega il tuo.</p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <FingerPrintIcon className="w-3.5 h-3.5 text-blue-400" />
                Passkey
              </span>
              <span className="flex items-center gap-1.5">
                <EnvelopeIcon className="w-3.5 h-3.5" />
                Email
              </span>
              <span className="flex items-center gap-1.5">
                <WalletIcon className="w-3.5 h-3.5" />
                Wallet
              </span>
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
