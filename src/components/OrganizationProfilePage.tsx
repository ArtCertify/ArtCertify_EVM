import React from 'react';
import { Link } from 'react-router-dom';
import ResponsiveLayout from './layout/ResponsiveLayout';
import { BuildingOfficeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useOrganization } from '../contexts/OrganizationContext';

export const OrganizationProfilePage: React.FC = () => {
  const { organizationData, loading, error, refreshOrganizationData } = useOrganization();

  if (loading) {
    return (
      <ResponsiveLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse bg-slate-800 rounded-xl border border-slate-700 p-8 max-w-lg w-full h-64" />
        </div>
      </ResponsiveLayout>
    );
  }

  if (error) {
    return (
      <ResponsiveLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 max-w-md text-center">
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <button
              onClick={() => refreshOrganizationData()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
            >
              Riprova
            </button>
            <Link to="/" className="block mt-4 text-slate-400 hover:text-white text-sm">
              Torna alla Dashboard
            </Link>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  if (!organizationData) {
    return (
      <ResponsiveLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 max-w-md text-center">
            <BuildingOfficeIcon className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-white mb-2">Profilo organizzazione</h1>
            <p className="text-slate-400 text-sm mb-6">
              Non hai ancora un profilo organizzazione. Creane uno dalla Dashboard per iniziare a certificare.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              Vai alla Dashboard
            </Link>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  const org = organizationData;
  return (
    <ResponsiveLayout>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Dashboard
        </Link>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6">
            {org.image ? (
              <img
                src={org.image}
                alt={org.name}
                className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-slate-700 flex items-center justify-center flex-shrink-0">
                <BuildingOfficeIcon className="w-12 h-12 text-slate-500" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-semibold text-white mb-1">{org.name}</h1>
              {org.type && (
                <p className="text-slate-400 text-sm mb-4">{org.type}</p>
              )}
              {org.description && (
                <p className="text-slate-300 text-sm mb-4">{org.description}</p>
              )}
              {org.assetId != null && (
                <Link
                  to={`/asset/${org.assetId}`}
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm"
                >
                  Vedi certificato NFT #{org.assetId} →
                </Link>
              )}
            </div>
          </div>
          {(org.city || org.email || org.website || org.address || org.phone || org.vatNumber) && (
            <div className="mt-6 pt-6 border-t border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {org.city && <div><span className="text-slate-500">Città</span><br /><span className="text-slate-300">{org.city}</span></div>}
                {org.email && <div><span className="text-slate-500">Email</span><br /><a href={`mailto:${org.email}`} className="text-blue-400 hover:underline">{org.email}</a></div>}
                {org.phone && <div><span className="text-slate-500">Telefono</span><br /><span className="text-slate-300">{org.phone}</span></div>}
                {org.vatNumber && <div><span className="text-slate-500">Partita IVA</span><br /><span className="text-slate-300">{org.vatNumber}</span></div>}
                {org.website && <div><span className="text-slate-500">Sito</span><br /><a href={org.website.startsWith('http') ? org.website : `https://${org.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{org.website}</a></div>}
                {org.address && <div className="sm:col-span-2"><span className="text-slate-500">Indirizzo</span><br /><span className="text-slate-300">{org.address}</span></div>}
            </div>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default OrganizationProfilePage; 