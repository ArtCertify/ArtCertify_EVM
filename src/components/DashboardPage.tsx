import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  WalletIcon, 
  ChartBarIcon,
  PlusIcon,
  ShieldCheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

export const DashboardPage: React.FC = () => {
  const { isConnected, address, smartAccountAddress, balance, connect, isLoading } = useAuth();

  // Mock data for dashboard
  const stats = [
    {
      name: 'Certificazioni Totali',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: <DocumentTextIcon className="h-6 w-6" />,
    },
    {
      name: 'Certificazioni Attive',
      value: '10',
      change: '+1',
      changeType: 'positive',
      icon: <ShieldCheckIcon className="h-6 w-6" />,
    },
    {
      name: 'In Revisione',
      value: '2',
      change: '+1',
      changeType: 'neutral',
      icon: <ClockIcon className="h-6 w-6" />,
    },
    {
      name: 'Scadute',
      value: '0',
      change: '0',
      changeType: 'positive',
      icon: <ExclamationTriangleIcon className="h-6 w-6" />,
    },
  ];

  const recentCertifications = [
    {
      id: '1',
      name: 'Dipinto Rinascimentale - Attr. Botticelli',
      status: 'Certificato' as const,
      date: '2024-01-15',
      txHash: '0x742d35...8B9A'
    },
    {
      id: '2', 
      name: 'Scultura Contemporanea - Anselm Kiefer',
      status: 'In Revisione' as const,
      date: '2024-01-12',
      txHash: '0x892d35...8B9B'
    },
    {
      id: '3',
      name: 'Disegno Preparatorio - Leonardo da Vinci',
      status: 'Certificato' as const,
      date: '2024-01-08',
      txHash: '0x123456...7890'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Certificato':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Revisione':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Scaduto':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <WalletIcon className="h-12 w-12 text-slate-400" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Connetti il tuo Wallet
          </h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Per iniziare a creare e gestire certificazioni digitali, connetti il tuo wallet EVM.
          </p>
          <button
            onClick={() => connect('mock')}
            disabled={isLoading}
            className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? (
              <>
                <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Connessione...
              </>
            ) : (
              <>
                <WalletIcon className="h-5 w-5 mr-2" />
                Connetti Wallet (Mock)
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">
          Panoramica delle tue certificazioni digitali su blockchain EVM
        </p>
      </div>

      {/* Account Info Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Smart Account Attivo</h3>
            <div className="space-y-1">
              <p className="text-sm text-slate-300 font-mono">
                EOA: {address}
              </p>
              {smartAccountAddress && (
                <p className="text-sm text-slate-300 font-mono">
                  Smart Account: {smartAccountAddress}
                </p>
              )}
              <p className="text-sm text-slate-400">
                Saldo: {balance ? `${Number(balance).toFixed(4)} ETH` : '0.0000 ETH'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/wallet"
              className="inline-flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <WalletIcon className="h-4 w-4 mr-2" />
              Visualizza Wallet
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-primary-600/10 rounded-lg">
                  <div className="text-primary-500">{stat.icon}</div>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className={`font-medium ${
                  stat.changeType === 'positive' ? 'text-green-500' : 
                  stat.changeType === 'negative' ? 'text-red-500' : 'text-slate-400'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-semibold text-white">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.name}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          to="/certifications"
          className="bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg p-6 transition-colors"
        >
          <div className="flex items-center">
            <div className="p-3 bg-primary-600 rounded-lg">
              <PlusIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-white">Crea Certificazione</h3>
              <p className="text-slate-400">Certifica un nuovo artefatto digitale</p>
            </div>
          </div>
        </Link>

        <Link
          to="/certifications"
          className="bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg p-6 transition-colors"
        >
          <div className="flex items-center">
            <div className="p-3 bg-emerald-600 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-white">Gestisci Certificazioni</h3>
              <p className="text-slate-400">Visualizza e modifica certificazioni esistenti</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Certifications */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Certificazioni Recenti</h3>
            <Link
              to="/certifications"
              className="text-primary-400 hover:text-primary-300 text-sm font-medium"
            >
              Visualizza tutte
            </Link>
          </div>
        </div>
        <div className="divide-y divide-slate-700">
          {recentCertifications.map((cert) => (
            <div key={cert.id} className="p-6 hover:bg-slate-750/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">
                    {cert.name}
                  </h4>
                  <div className="mt-1 flex items-center space-x-3 text-xs text-slate-400">
                    <span>{cert.date}</span>
                    <span>•</span>
                    <span className="font-mono">{cert.txHash}</span>
                  </div>
                </div>
                <div className="ml-4 flex items-center space-x-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(cert.status)}`}>
                    {cert.status}
                  </span>
                  <ChartBarIcon className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

 