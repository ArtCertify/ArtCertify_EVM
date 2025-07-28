import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ShieldCheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  LinkIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserIcon,
  EyeIcon,
  ShareIcon,
  PrinterIcon,
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  TagIcon,
  ChevronRightIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { config } from '../config/environment';

interface AssetDetails {
  id: string;
  name: string;
  description: string;
  status: 'Certificato' | 'In Revisione' | 'Scaduto';
  createdDate: string;
  lastModified: string;
  transactionHash: string;
  userOperationHash?: string;
  blockNumber: number;
  gasUsed: string;
  ipfsHash?: string;
  creator: string;
  owner: string;
  category: string;
  currentVersion: number;
  versions: AssetVersion[];
  attachments: AttachmentInfo[];
  metadata: AssetMetadata;
}

interface AssetVersion {
  version: number;
  transactionHash: string;
  userOperationHash?: string;
  blockNumber: number;
  timestamp: string;
  gasUsed: string;
  changes?: string[];
}

interface AttachmentInfo {
  id: string;
  name: string;
  type: string;
  size: string;
  ipfsHash: string;
  uploadDate: string;
}

interface AssetMetadata {
  image?: string;
  externalUrl?: string;
  attributes: AssetAttribute[];
}

interface AssetAttribute {
  traitType: string;
  value: string;
  displayType?: string;
}

const AssetDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isConnected, address } = useAuth();
  const [asset, setAsset] = useState<AssetDetails | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'versions' | 'attachments'>('details');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock loading delay
    const timer = setTimeout(() => {
      // Mock asset data - in real app, this would be fetched from blockchain/API
      const mockAsset: AssetDetails = {
        id: id || '1',
        name: 'Dipinto Rinascimentale - Attr. Botticelli',
        description: 'Certificazione di autenticità per dipinto attribuito a Sandro Botticelli, periodo 1480-1490. Opera di eccezionale qualità artistica con documentazione storica completa.',
        status: 'Certificato',
        createdDate: '2024-01-15T10:30:00Z',
        lastModified: '2024-01-15T10:30:00Z',
        transactionHash: '0x742d35Cc6635C0532925a3b8D0f0e8F72E8E8B9A1234567890123456789012345',
        userOperationHash: '0xabcd1234567890abcd1234567890abcd12345678',
        blockNumber: 18950000,
        gasUsed: '0.0021',
        ipfsHash: 'QmYwAPJzv5CZsnAzt8auVTqHKpYLzKFqxZJWnXaKqL1ABC',
        creator: address || '0x742d35Cc6635C0532925a3b8D0f0e8F72E8E8B9A',
        owner: address || '0x742d35Cc6635C0532925a3b8D0f0e8F72E8E8B9A',
        category: 'Arte Pittorica',
        currentVersion: 1,
        versions: [
          {
            version: 1,
            transactionHash: '0x742d35Cc6635C0532925a3b8D0f0e8F72E8E8B9A1234567890123456789012345',
            userOperationHash: '0xabcd1234567890abcd1234567890abcd12345678',
            blockNumber: 18950000,
            timestamp: '2024-01-15T10:30:00Z',
            gasUsed: '0.0021',
            changes: ['Creazione certificazione iniziale']
          }
        ],
        attachments: [
          {
            id: '1',
            name: 'Fotografia_Alta_Risoluzione.jpg',
            type: 'image/jpeg',
            size: '2.4 MB',
            ipfsHash: 'QmXwBPJzv5CZsnAzt8auVTqHKpYLzKFqxZJWnXaKqL2',
            uploadDate: '2024-01-15T10:25:00Z'
          },
          {
            id: '2',
            name: 'Perizia_Tecnica.pdf',
            type: 'application/pdf',
            size: '1.8 MB',
            ipfsHash: 'QmZwCPJzv5CZsnAzt8auVTqHKpYLzKFqxZJWnXaKqL3',
            uploadDate: '2024-01-15T10:26:00Z'
          },
          {
            id: '3',
            name: 'Documentazione_Storica.pdf',
            type: 'application/pdf',
            size: '3.2 MB',
            ipfsHash: 'QmAwDPJzv5CZsnAzt8auVTqHKpYLzKFqxZJWnXaKqL4',
            uploadDate: '2024-01-15T10:27:00Z'
          }
        ],
        metadata: {
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          externalUrl: 'https://artcertify.com/asset/' + id,
          attributes: [
            { traitType: 'Periodo', value: '1480-1490' },
            { traitType: 'Tecnica', value: 'Tempera su tavola' },
            { traitType: 'Dimensioni', value: '65x48 cm' },
            { traitType: 'Attribuzione', value: 'Sandro Botticelli' },
            { traitType: 'Provenienza', value: 'Collezione Privata Italiana' },
            { traitType: 'Stato Conservazione', value: 'Ottimo' }
          ]
        }
      };
      setAsset(mockAsset);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id, address]);

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
        return <ShieldCheckIcon className="h-5 w-5" />;
      case 'In Revisione':
        return <ClockIcon className="h-5 w-5" />;
      case 'Scaduto':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      default:
        return <DocumentTextIcon className="h-5 w-5" />;
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getExplorerUrl = (hash: string) => {
    return `${config.explorerUrl}/tx/${hash}`;
  };

  const getIpfsUrl = (hash: string) => {
    return `${config.ipfsGateway}/ipfs/${hash}`;
  };

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <ShieldCheckIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Accesso Richiesto
          </h2>
          <p className="text-slate-400">
            Connetti il tuo wallet per visualizzare i dettagli della certificazione.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full"></div>
          <span className="ml-3 text-white">Caricamento dettagli certificazione...</span>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Certificazione Non Trovata
          </h2>
          <p className="text-slate-400 mb-6">
            La certificazione richiesta non esiste o non è accessibile.
          </p>
          <Link
            to="/certifications"
            className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Torna alle Certificazioni
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-400 hover:text-white transition-colors mr-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Indietro
        </button>
        <nav className="flex items-center space-x-2 text-sm">
          <Link to="/certifications" className="text-slate-400 hover:text-white">
            Certificazioni
          </Link>
          <ChevronRightIcon className="h-4 w-4 text-slate-500" />
          <span className="text-white font-medium">{asset.name}</span>
        </nav>
      </div>

      {/* Asset Header */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
          {/* Asset Image */}
          <div className="lg:w-1/3 mb-6 lg:mb-0">
            <div className="aspect-square bg-slate-700 rounded-lg overflow-hidden">
              {asset.metadata.image ? (
                <img
                  src={asset.metadata.image}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <DocumentTextIcon className="h-24 w-24 text-slate-500" />
                </div>
              )}
            </div>
          </div>

          {/* Asset Info */}
          <div className="lg:w-2/3">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  {getStatusIcon(asset.status)}
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(asset.status)}`}>
                    {asset.status}
                  </span>
                  <span className="text-sm text-slate-400">{asset.category}</span>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">{asset.name}</h1>
                <p className="text-slate-400 leading-relaxed">{asset.description}</p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => copyToClipboard(window.location.href, 'url')}
                  className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white rounded-lg transition-colors"
                  title="Condividi"
                >
                  {copiedText === 'url' ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-400" />
                  ) : (
                    <ShareIcon className="h-5 w-5" />
                  )}
                </button>
                <button
                  className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white rounded-lg transition-colors"
                  title="Stampa"
                >
                  <PrinterIcon className="h-5 w-5" />
                </button>
                {asset.metadata.externalUrl && (
                  <button
                    onClick={() => window.open(asset.metadata.externalUrl, '_blank')}
                    className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white rounded-lg transition-colors"
                    title="Link Esterno"
                  >
                    <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Creato</p>
                <p className="text-white font-medium">
                  {new Date(asset.createdDate).toLocaleDateString('it-IT')}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Versione</p>
                <p className="text-white font-medium">v{asset.currentVersion}</p>
              </div>
              <div>
                <p className="text-slate-400">Proprietario</p>
                <p className="text-white font-medium font-mono">{truncateAddress(asset.owner)}</p>
              </div>
              <div>
                <p className="text-slate-400">Block</p>
                <p className="text-white font-medium">#{asset.blockNumber.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {[
          { id: 'details', name: 'Dettagli', icon: <InformationCircleIcon className="h-5 w-5" /> },
          { id: 'versions', name: 'Versioni', icon: <ClockIcon className="h-5 w-5" /> },
          { id: 'attachments', name: 'Allegati', icon: <DocumentTextIcon className="h-5 w-5" /> }
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

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Blockchain Info */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Informazioni Blockchain</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Transaction Hash:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-white">{truncateAddress(asset.transactionHash)}</span>
                    <button
                      onClick={() => copyToClipboard(asset.transactionHash, 'tx')}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedText === 'tx' ? (
                        <CheckCircleIcon className="h-4 w-4 text-green-400" />
                      ) : (
                        <DocumentDuplicateIcon className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => window.open(getExplorerUrl(asset.transactionHash), '_blank')}
                      className="text-slate-400 hover:text-white"
                    >
                      <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {asset.userOperationHash && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">User Operation:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-mono text-white">{truncateAddress(asset.userOperationHash)}</span>
                      <button
                        onClick={() => copyToClipboard(asset.userOperationHash!, 'userop')}
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedText === 'userop' ? (
                          <CheckCircleIcon className="h-4 w-4 text-green-400" />
                        ) : (
                          <DocumentDuplicateIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Block Number:</span>
                  <span className="text-sm text-white">#{asset.blockNumber.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Gas Used:</span>
                  <span className="text-sm text-white">{asset.gasUsed} ETH</span>
                </div>

                {asset.ipfsHash && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">IPFS Hash:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-mono text-white">{truncateAddress(asset.ipfsHash)}</span>
                      <button
                        onClick={() => copyToClipboard(asset.ipfsHash!, 'ipfs')}
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedText === 'ipfs' ? (
                          <CheckCircleIcon className="h-4 w-4 text-green-400" />
                        ) : (
                          <DocumentDuplicateIcon className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => window.open(getIpfsUrl(asset.ipfsHash!), '_blank')}
                        className="text-slate-400 hover:text-white"
                      >
                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Asset Attributes */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Attributi</h3>
              <div className="grid grid-cols-1 gap-3">
                {asset.metadata.attributes.map((attr, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-b-0">
                    <div className="flex items-center space-x-2">
                      <TagIcon className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-400">{attr.traitType}:</span>
                    </div>
                    <span className="text-sm text-white font-medium">{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Versions Tab */}
        {activeTab === 'versions' && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-lg font-medium text-white">Storico Versioni</h3>
            </div>
            <div className="divide-y divide-slate-700">
              {asset.versions.map((version) => (
                <div key={version.version} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        v{version.version}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <p className="text-sm font-medium text-white">
                            Versione {version.version}
                            {version.version === asset.currentVersion && (
                              <span className="ml-2 inline-flex px-2 py-1 text-xs font-medium bg-primary-900/20 text-primary-400 rounded-full">
                                Corrente
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="text-xs text-slate-400 space-y-1">
                          <p>Hash: <span className="font-mono">{truncateAddress(version.transactionHash)}</span></p>
                          {version.userOperationHash && (
                            <p>User Op: <span className="font-mono">{truncateAddress(version.userOperationHash)}</span></p>
                          )}
                          <p>Block: #{version.blockNumber.toLocaleString()}</p>
                          <p>Gas: {version.gasUsed} ETH</p>
                        </div>
                        {version.changes && version.changes.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs text-slate-400 mb-1">Modifiche:</p>
                            <ul className="text-xs text-slate-300 space-y-1">
                              {version.changes.map((change, idx) => (
                                <li key={idx} className="flex items-center">
                                  <div className="w-1 h-1 bg-slate-500 rounded-full mr-2"></div>
                                  {change}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">
                        {new Date(version.timestamp).toLocaleString('it-IT')}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => window.open(getExplorerUrl(version.transactionHash), '_blank')}
                          className="text-primary-400 hover:text-primary-300"
                          title="Visualizza su Explorer"
                        >
                          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(version.transactionHash, `v${version.version}`)}
                          className="text-slate-400 hover:text-white"
                          title="Copia Hash"
                        >
                          {copiedText === `v${version.version}` ? (
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
        )}

        {/* Attachments Tab */}
        {activeTab === 'attachments' && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-lg font-medium text-white">Allegati ({asset.attachments.length})</h3>
            </div>
            <div className="divide-y divide-slate-700">
              {asset.attachments.map((attachment) => (
                <div key={attachment.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                      <DocumentTextIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{attachment.name}</p>
                      <p className="text-xs text-slate-400">
                        {attachment.type} • {attachment.size} • 
                        Caricato il {new Date(attachment.uploadDate).toLocaleDateString('it-IT')}
                      </p>
                      <p className="text-xs text-slate-500 font-mono mt-1">
                        IPFS: {truncateAddress(attachment.ipfsHash)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => window.open(getIpfsUrl(attachment.ipfsHash), '_blank')}
                      className="flex items-center px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white text-sm rounded-lg transition-colors"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Visualizza
                    </button>
                    <button
                      onClick={() => copyToClipboard(getIpfsUrl(attachment.ipfsHash), attachment.id)}
                      className="p-2 text-slate-400 hover:text-white transition-colors"
                    >
                      {copiedText === attachment.id ? (
                        <CheckCircleIcon className="h-4 w-4 text-green-400" />
                      ) : (
                        <DocumentDuplicateIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetDetailsPage; 