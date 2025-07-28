import React, { useState } from 'react';
import {
  WalletIcon,
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentDuplicateIcon,
  ArrowTopRightOnSquareIcon,
  ShieldCheckIcon,
  CogIcon,
  BanknotesIcon,
  DocumentTextIcon,
  EyeIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { config } from '../config/environment';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'contract' | 'certification';
  hash: string;
  userOperationHash?: string;
  from: string;
  to: string;
  value: string;
  gasUsed?: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: string;
  description?: string;
}

export const WalletPage: React.FC = () => {
  const { isConnected, address, smartAccountAddress, balance, chainId, connect, disconnect, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'settings'>('overview');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // Mock transactions data
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'certification',
      hash: '0x742d35Cc6635C0532925a3b8D0f0e8F72E8E8B9A1234567890123456789012345',
      userOperationHash: '0xabcd1234567890abcd1234567890abcd12345678',
      from: address || '0x742d35...8B9A',
      to: '0x1234567890123456789012345678901234567890',
      value: '0',
      gasUsed: '0.0021',
      status: 'success',
      timestamp: '2024-01-15T10:30:00Z',
      description: 'Certificazione Dipinto Rinascimentale'
    },
    {
      id: '2',
      type: 'send',
      hash: '0x892d35Cc6635C0532925a3b8D0f0e8F72E8E8B9B1234567890123456789012346',
      userOperationHash: '0xef123456789012ef123456789012ef12345678',
      from: address || '0x892d35...8B9B',
      to: '0x2345678901234567890123456789012345678901',
      value: '0.1',
      gasUsed: '0.0015',
      status: 'success',
      timestamp: '2024-01-14T15:45:00Z',
      description: 'Pagamento servizi certificazione'
    },
    {
      id: '3',
      type: 'receive',
      hash: '0x123456789012345678901234567890123456789012345678901234567890123',
      from: '0x3456789012345678901234567890123456789012',
      to: address || '0x123456...7890',
      value: '0.5',
      status: 'success',
      timestamp: '2024-01-12T09:15:00Z',
      description: 'Ricevuto da cliente'
    },
    {
      id: '4',
      type: 'contract',
      hash: '0x456789012345678901234567890123456789012345678901234567890123456',
      userOperationHash: '0x9876543210987654321098765432109876543210',
      from: address || '0x456789...9012',
      to: '0x4567890123456789012345678901234567890123',
      value: '0',
      gasUsed: '0.0032',
      status: 'pending',
      timestamp: '2024-01-11T14:20:00Z',
      description: 'Deploy Smart Contract'
    }
  ];

  const getNetworkName = (chainId?: number): string => {
    switch (chainId) {
      case 1: return 'Ethereum Mainnet';
      case 11155111: return 'Sepolia Testnet';
      case 137: return 'Polygon Mainnet';
      case 42161: return 'Arbitrum One';
      default: return 'Unknown Network';
    }
  };

  const getTransactionIcon = (type: string, status: string) => {
    if (status === 'pending') return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    if (status === 'failed') return <XCircleIcon className="h-5 w-5 text-red-500" />;
    
    switch (type) {
      case 'send':
        return <ArrowUpRightIcon className="h-5 w-5 text-red-400" />;
      case 'receive':
        return <ArrowDownLeftIcon className="h-5 w-5 text-green-400" />;
      case 'certification':
        return <ShieldCheckIcon className="h-5 w-5 text-primary-400" />;
      case 'contract':
        return <DocumentTextIcon className="h-5 w-5 text-purple-400" />;
      default:
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(type);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const truncateAddress = (addr?: string) => {
    if (!addr) return 'N/A';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getExplorerUrl = (hash: string) => {
    return `${config.explorerUrl}/tx/${hash}`;
  };

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <WalletIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Wallet Non Connesso
          </h2>
          <p className="text-slate-400 mb-6">
            Connetti il tuo wallet per visualizzare saldo, transazioni e gestire il tuo Smart Account.
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
                Connetti Wallet
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
        <h1 className="text-2xl font-semibold text-white mb-2">Wallet</h1>
        <p className="text-slate-400">
          Gestisci il tuo Smart Account e monitora le transazioni
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8">
        {[
          { id: 'overview', name: 'Panoramica', icon: <WalletIcon className="h-5 w-5" /> },
          { id: 'transactions', name: 'Transazioni', icon: <DocumentTextIcon className="h-5 w-5" /> },
          { id: 'settings', name: 'Impostazioni', icon: <CogIcon className="h-5 w-5" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {tab.icon}
            <span className="ml-2">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Account Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* EOA Account */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Externally Owned Account</h3>
                <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                  <WalletIcon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Indirizzo:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-white">{truncateAddress(address)}</span>
                    <button
                      onClick={() => copyToClipboard(address || '', 'eoa')}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedAddress === 'eoa' ? (
                        <CheckCircleIcon className="h-4 w-4 text-green-400" />
                      ) : (
                        <DocumentDuplicateIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Network:</span>
                  <span className="text-sm text-white">{getNetworkName(chainId)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Saldo:</span>
                  <span className="text-sm font-semibold text-white">
                    {balance ? `${Number(balance).toFixed(4)} ETH` : '0.0000 ETH'}
                  </span>
                </div>
              </div>
            </div>

            {/* Smart Account */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Smart Account</h3>
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <ShieldCheckIcon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Indirizzo:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-white">{truncateAddress(smartAccountAddress)}</span>
                    <button
                      onClick={() => copyToClipboard(smartAccountAddress || '', 'smart')}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedAddress === 'smart' ? (
                        <CheckCircleIcon className="h-4 w-4 text-green-400" />
                      ) : (
                        <DocumentDuplicateIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Tipo:</span>
                  <span className="text-sm text-white capitalize">{config.accountType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Status:</span>
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-900/20 text-green-400 rounded-full">
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                    Attivo
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary-600/10 rounded-lg">
                  <BanknotesIcon className="h-6 w-6 text-primary-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-slate-400">Valore Totale</p>
                  <p className="text-xl font-semibold text-white">
                    {balance ? `${Number(balance).toFixed(4)} ETH` : '0.0000 ETH'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-emerald-600/10 rounded-lg">
                  <DocumentTextIcon className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-slate-400">Transazioni</p>
                  <p className="text-xl font-semibold text-white">{mockTransactions.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-600/10 rounded-lg">
                  <ShieldCheckIcon className="h-6 w-6 text-purple-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-slate-400">Certificazioni</p>
                  <p className="text-xl font-semibold text-white">12</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions Preview */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Transazioni Recenti</h3>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center"
                >
                  Visualizza tutte
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
            <div className="divide-y divide-slate-700">
              {mockTransactions.slice(0, 3).map((tx) => (
                <div key={tx.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getTransactionIcon(tx.type, tx.status)}
                    <div>
                      <p className="text-sm font-medium text-white">
                        {tx.description || `${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}`}
                      </p>
                      <p className="text-xs text-slate-400 font-mono">{truncateAddress(tx.hash)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${getStatusColor(tx.status)}`}>
                      {tx.value !== '0' ? `${tx.value} ETH` : 'Contract'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(tx.timestamp).toLocaleDateString('it-IT')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-lg font-medium text-white">Storico Transazioni</h3>
            </div>
            <div className="divide-y divide-slate-700">
              {mockTransactions.map((tx) => (
                <div key={tx.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {getTransactionIcon(tx.type, tx.status)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <p className="text-sm font-medium text-white">
                            {tx.description || `${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}`}
                          </p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            tx.status === 'success' ? 'bg-green-900/20 text-green-400' :
                            tx.status === 'pending' ? 'bg-yellow-900/20 text-yellow-400' :
                            'bg-red-900/20 text-red-400'
                          }`}>
                            {tx.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
                          <div>
                            <p>Hash: <span className="font-mono">{truncateAddress(tx.hash)}</span></p>
                            {tx.userOperationHash && (
                              <p>User Op: <span className="font-mono">{truncateAddress(tx.userOperationHash)}</span></p>
                            )}
                          </div>
                          <div>
                            <p>Da: <span className="font-mono">{truncateAddress(tx.from)}</span></p>
                            <p>A: <span className="font-mono">{truncateAddress(tx.to)}</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${getStatusColor(tx.status)}`}>
                        {tx.value !== '0' ? `${tx.value} ETH` : 'Contract'}
                      </p>
                      <p className="text-xs text-slate-400 mb-2">
                        {new Date(tx.timestamp).toLocaleString('it-IT')}
                      </p>
                      {tx.gasUsed && (
                        <p className="text-xs text-slate-400">
                          Gas: {tx.gasUsed} ETH
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => window.open(getExplorerUrl(tx.hash), '_blank')}
                          className="text-primary-400 hover:text-primary-300"
                          title="Visualizza su Explorer"
                        >
                          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(tx.hash, tx.id)}
                          className="text-slate-400 hover:text-white"
                          title="Copia Hash"
                        >
                          {copiedAddress === tx.id ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-400" />
                          ) : (
                            <DocumentDuplicateIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-6">Impostazioni Wallet</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-white">Network Attivo</h4>
                  <p className="text-sm text-slate-400">
                    {getNetworkName(chainId)} (Chain ID: {chainId})
                  </p>
                </div>
                <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors">
                  Cambia Network
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-white">Account Abstraction</h4>
                  <p className="text-sm text-slate-400">
                    Tipo: {config.accountType} • Entry Point: {truncateAddress(config.entryPointAddress)}
                  </p>
                </div>
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-900/20 text-green-400 rounded-full">
                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                  Attivo
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-white">IPFS Gateway</h4>
                  <p className="text-sm text-slate-400">{config.ipfsGateway}</p>
                </div>
                <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors">
                  Configura
                </button>
              </div>

              <div className="pt-6 border-t border-slate-700">
                <button
                  onClick={disconnect}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  Disconnetti Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

 