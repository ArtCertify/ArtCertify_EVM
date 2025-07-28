import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletIcon, DevicePhoneMobileIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

interface LoginPageProps {
  onLogin: (address: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      // Mock wallet connection - simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock connected address
      const mockAddress = '0x742d35Cc6634C0532925a3b8D000B4A8C1329C1111';
      onLogin(mockAddress);
      navigate('/');
    } catch (err) {
      setError('Errore durante la connessione del wallet');
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 flex items-center justify-center">
              <img src="/logo.png" alt="ArtCertify Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-bold text-white">CaputMundi ArtCertify</span>
          </div>
          <p className="text-slate-300 text-sm">
            Certificazione blockchain per documenti e artefatti culturali
          </p>
        </div>

        {/* Wallet Connect Card */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-white mb-2">
              Connetti il tuo Wallet
            </h1>
            <p className="text-slate-400 text-sm">
              Utilizza il tuo wallet Ethereum per accedere alla piattaforma di certificazione
            </p>
          </div>

          {/* Connection Button */}
          <div className="mb-6">
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-800 disabled:to-blue-900 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Connessione in corso...</span>
                </>
              ) : (
                <>
                  <WalletIcon className="w-5 h-5" />
                  <span>Connetti Wallet EVM</span>
                </>
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* How to Connect */}
          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-white font-medium mb-4 text-center">Come connettere:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                <DevicePhoneMobileIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white text-sm font-medium">Mobile</p>
                  <p className="text-slate-400 text-xs">
                    Utilizza MetaMask mobile o altri wallet EVM per la connessione mobile
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                <ComputerDesktopIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white text-sm font-medium">Desktop</p>
                  <p className="text-slate-400 text-xs">
                    Connessione diretta tramite MetaMask o altri wallet browser
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Download Links */}
          <div className="mt-6 pt-4 border-t border-slate-700">
            <p className="text-slate-400 text-xs text-center mb-3">
              Non hai ancora un wallet EVM?
            </p>
            <div className="flex gap-2 justify-center">
              <a
                href="https://metamask.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-xs underline"
              >
                Scarica MetaMask
              </a>
              <span className="text-slate-500 text-xs">•</span>
              <a
                href="https://walletconnect.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-xs underline"
              >
                Altri Wallet
              </a>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-6">
          <p className="text-slate-500 text-xs">
            Utilizza un wallet compatibile con EVM per gestire i tuoi asset
          </p>
        </div>
      </div>
    </div>
  );
}; 