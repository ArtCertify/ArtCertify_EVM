import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ShieldCheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  DocumentTextIcon,
  CalendarIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

interface Certification {
  id: string;
  name: string;
  description: string;
  status: 'Certificato' | 'In Revisione' | 'Scaduto';
  createdDate: string;
  lastModified: string;
  transactionHash: string;
  ipfsHash?: string;
  creator: string;
  category: string;
}

export const CertificationsPage: React.FC = () => {
  const { isConnected, address } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock certifications data
  const mockCertifications: Certification[] = [
    {
      id: '1',
      name: 'Dipinto Rinascimentale - Attr. Botticelli',
      description: 'Certificazione di autenticità per dipinto attribuito a Sandro Botticelli, periodo 1480-1490',
      status: 'Certificato',
      createdDate: '2024-01-15',
      lastModified: '2024-01-15',
      transactionHash: '0x742d35Cc6635C0532925a3b8D0f0e8F72E8E8B9A',
      ipfsHash: 'QmYwAPJzv5CZsnAzt8auVTqHKpYLzKFqxZJWnXaKqL1',
      creator: address || '0x742d35...8B9A',
      category: 'Arte Pittorica'
    },
    {
      id: '2',
      name: 'Scultura Contemporanea - Anselm Kiefer',
      description: 'Opera scultorea contemporanea, tecnica mista su supporto metallico',
      status: 'In Revisione',
      createdDate: '2024-01-12',
      lastModified: '2024-01-14',
      transactionHash: '0x892d35Cc6635C0532925a3b8D0f0e8F72E8E8B9B',
      ipfsHash: 'QmXwBPJzv5CZsnAzt8auVTqHKpYLzKFqxZJWnXaKqL2',
      creator: address || '0x892d35...8B9B',
      category: 'Arte Contemporanea'
    },
    {
      id: '3',
      name: 'Disegno Preparatorio - Leonardo da Vinci',
      description: 'Disegno preparatorio autografo, carboncino su carta, studi anatomici',
      status: 'Certificato',
      createdDate: '2024-01-08',
      lastModified: '2024-01-08',
      transactionHash: '0x123456789012345678901234567890123456789',
      ipfsHash: 'QmZwCPJzv5CZsnAzt8auVTqHKpYLzKFqxZJWnXaKqL3',
      creator: address || '0x123456...7890',
      category: 'Disegno'
    },
    {
      id: '4',
      name: 'Manoscritto Medievale - Codice Miniato',
      description: 'Manoscritto medievale del XIII secolo con miniature policrome',
      status: 'Scaduto',
      createdDate: '2023-12-01',
      lastModified: '2023-12-01',
      transactionHash: '0x456789012345678901234567890123456789012',
      creator: address || '0x456789...9012',
      category: 'Documenti Storici'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Certificato':
        return 'bg-green-900/20 text-green-400 border-green-500/30';
      case 'In Revisione':
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30';
      case 'Scaduto':
        return 'bg-red-900/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-900/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Certificato':
        return <ShieldCheckIcon className="h-4 w-4" />;
      case 'In Revisione':
        return <ClockIcon className="h-4 w-4" />;
      case 'Scaduto':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <DocumentTextIcon className="h-4 w-4" />;
    }
  };

  const filteredCertifications = mockCertifications.filter(cert => {
    const matchesSearch = cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cert.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: mockCertifications.length,
    Certificato: mockCertifications.filter(c => c.status === 'Certificato').length,
    'In Revisione': mockCertifications.filter(c => c.status === 'In Revisione').length,
    Scaduto: mockCertifications.filter(c => c.status === 'Scaduto').length,
  };

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <DocumentTextIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Connessione Richiesta
          </h2>
          <p className="text-slate-400">
            Connetti il tuo wallet per visualizzare e gestire le certificazioni.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-2">Certificazioni</h1>
          <p className="text-slate-400">
            Gestisci le tue certificazioni digitali su blockchain EVM
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nuova Certificazione
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cerca certificazioni..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-4">
            <FunnelIcon className="h-5 w-5 text-slate-400" />
            <div className="flex space-x-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 text-sm font-medium rounded-full border transition-colors ${
                    statusFilter === status
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'
                  }`}
                >
                  {status === 'all' ? 'Tutte' : status} ({count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCertifications.map((cert) => (
          <div key={cert.id} className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition-colors">
            {/* Card Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(cert.status)}
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(cert.status)}`}>
                    {cert.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  {cert.category}
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-white mb-2 line-clamp-2">
                {cert.name}
              </h3>
              
              <p className="text-sm text-slate-400 line-clamp-3 mb-4">
                {cert.description}
              </p>
            </div>

            {/* Card Content */}
            <div className="px-6 pb-4">
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Creato: {new Date(cert.createdDate).toLocaleDateString('it-IT')}
                </div>
                
                <div className="flex items-center">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  <span className="font-mono truncate">
                    {cert.transactionHash.slice(0, 10)}...{cert.transactionHash.slice(-8)}
                  </span>
                </div>

                {cert.ipfsHash && (
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    <span className="font-mono truncate">
                      IPFS: {cert.ipfsHash.slice(0, 8)}...
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Card Actions */}
            <div className="px-6 py-4 bg-slate-750/50 border-t border-slate-700">
              <div className="flex items-center justify-between">
                <Link
                  to={`/asset/${cert.id}`}
                  className="inline-flex items-center text-primary-400 hover:text-primary-300 text-sm font-medium"
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Visualizza
                </Link>
                
                <div className="text-xs text-slate-500">
                  Mod: {new Date(cert.lastModified).toLocaleDateString('it-IT')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCertifications.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            Nessuna certificazione trovata
          </h3>
          <p className="text-slate-400 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Prova a modificare i filtri di ricerca.' 
              : 'Inizia creando la tua prima certificazione digitale.'}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Crea Prima Certificazione
            </button>
          )}
        </div>
      )}

      {/* Create Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-white mb-4">
              Nuova Certificazione
            </h3>
            <p className="text-slate-400 mb-6">
              Funzionalità di creazione certificazione in sviluppo. 
              Integrazione con VIEM e Smart Contracts in arrivo.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Chiudi
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

 