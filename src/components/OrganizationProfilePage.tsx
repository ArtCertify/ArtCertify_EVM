import React from 'react';
import { Link } from 'react-router-dom';
import ResponsiveLayout from './layout/ResponsiveLayout';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

/**
 * EVM/Base: Organization profile is simplified. No org NFT/backend; certifications use wallet only.
 */
export const OrganizationProfilePage: React.FC = () => {
  return (
    <ResponsiveLayout>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 max-w-md text-center">
          <BuildingOfficeIcon className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-white mb-2">Profilo organizzazione</h1>
          <p className="text-slate-400 text-sm mb-6">
            In questa versione (Base) il profilo organizzazione non è utilizzato. Puoi certificare asset direttamente dalla Dashboard con il tuo wallet.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            Torna alla Dashboard
          </Link>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default OrganizationProfilePage; 