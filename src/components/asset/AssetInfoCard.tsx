import React from 'react';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { Card } from '../ui';
import type { AssetInfo } from '../../types/asset';

interface AssetInfoCardProps {
  asset: AssetInfo;
}

const AssetInfoCard: React.FC<AssetInfoCardProps> = ({ asset }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatAddress = (address: string) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const p = asset.params ?? {};
  const infoItems = [
    {
      label: 'Creator',
      value: p.creator ?? 'N/A',
      copyable: true,
      formatted: formatAddress(p.creator ?? '')
    },
    {
      label: 'Manager',
      value: p.manager || 'N/A',
      copyable: !!p.manager,
      formatted: p.manager ? formatAddress(p.manager) : 'N/A'
    },
    {
      label: 'Reserve',
      value: p.reserve || 'N/A',
      copyable: !!p.reserve,
      formatted: p.reserve ? formatAddress(p.reserve) : 'N/A'
    },
    {
      label: 'Freeze',
      value: p.freeze || 'N/A',
      copyable: !!p.freeze,
      formatted: p.freeze ? formatAddress(p.freeze) : 'N/A'
    },
    {
      label: 'Clawback',
      value: p.clawback || 'N/A',
      copyable: !!p.clawback,
      formatted: p.clawback ? formatAddress(p.clawback) : 'N/A'
    }
  ];

  return (
    <Card>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Information</h3>
      <div className="space-y-4">
        {infoItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
            <span className="text-sm font-medium text-gray-500">{item.label}</span>
            <div className="flex items-center">
              <span className="text-sm text-gray-900 font-mono">{item.formatted}</span>
              {item.copyable && item.value !== 'N/A' && (
                <button
                  onClick={() => copyToClipboard(item.value ?? 'N/A')}
                  className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                  title={`Copy ${item.label}`}
                >
                  <ClipboardDocumentIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AssetInfoCard; 