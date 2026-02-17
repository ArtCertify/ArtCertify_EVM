import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { nftService } from '../services/nftService';
import { IPFSUrlService } from '../services/ipfsUrlService';
import { getCachedMetadata } from '../services/ipfsMetadataCache';
import { isOrgNftName, orgDisplayName } from '../utils/orgNftName';

function toDisplayImageUrl(image: string | undefined): string {
  if (!image?.trim()) return '';
  const trimmed = image.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  const cid = trimmed.replace(/^ipfs:\/\//, '').trim();
  return cid ? IPFSUrlService.getGatewayUrl(cid) : '';
}

export interface OrganizationData {
  name: string;
  image: string;
  description?: string;
  type?: string;
  city?: string;
  vatNumber?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  // NFT metadata
  assetId?: number;
  reserveAddress?: string;
  // Raw JSON data for detailed display
  rawData?: any;
}

interface OrganizationContextType {
  organizationData: OrganizationData | null;
  loading: boolean;
  error: string | null;
  refreshOrganizationData: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

interface OrganizationProviderProps {
  children: ReactNode;
}

export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({ children }) => {
  const { userAddress, isAuthenticated } = useAuth();
  const [organizationData, setOrganizationData] = useState<OrganizationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizationData = async () => {
    if (!isAuthenticated || !userAddress) {
      setOrganizationData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ownedNFTs = await nftService.getOwnedNFTs(userAddress);
      if (ownedNFTs.length === 0) {
        setOrganizationData(null);
        setLoading(false);
        return;
      }

      // In Base il nome "ORG: ..." è solo nel JSON su IPFS. Usiamo cache condivisa (1 fetch per NFT).
      const results = await Promise.all(
        ownedNFTs.map(async (cert) => {
          const uri = cert.params?.reserve ?? cert.tokenURI;
          if (!uri) return { cert, json: null };
          try {
            const json = await getCachedMetadata(uri);
            return { cert, json: json ?? null };
          } catch {
            return { cert, json: null };
          }
        })
      );

      const orgEntry = results.find((r) => isOrgNftName(String(r.json?.name ?? '')));
      if (!orgEntry?.json || !orgEntry.cert.params?.reserve) {
        setOrganizationData(null);
        setLoading(false);
        return;
      }

      const jsonData = orgEntry.json as Record<string, unknown>;
      const organizationNFT = orgEntry.cert;
      const cert = (jsonData.certification_data as Record<string, unknown>) || {};
      const org = (cert.organization as Record<string, unknown>) || {};
      const tech = (cert.technical_specs as Record<string, unknown>) || {};
      const form = (jsonData.properties as Record<string, unknown>)?.form_data as Record<string, unknown> | undefined || {};
      const orgName = orgDisplayName(String(jsonData.name ?? '')) || String(org.name ?? '') || 'Organizzazione';
      const orgImage = toDisplayImageUrl(String(jsonData.image ?? ''));

      setOrganizationData({
        name: orgName,
        image: orgImage,
        description: String(jsonData.description ?? tech.description ?? form.description ?? ''),
        type: String(org.type ?? org.code ?? form.customType ?? ''),
        city: String(org.city ?? form.fileOrigin ?? ''),
        vatNumber: String(org.vatNumber ?? form.vatNumber ?? ''),
        phone: String(org.phone ?? form.phone ?? ''),
        email: String(org.email ?? form.email ?? ''),
        website: String(org.website ?? form.website ?? ''),
        address: String(org.address ?? form.address ?? ''),
        assetId: Number(organizationNFT.index ?? organizationNFT.tokenId),
        reserveAddress: organizationNFT.params?.reserve ?? '',
        rawData: jsonData,
      });


    } catch (err) {
      // Error fetching organization data
      setError(err instanceof Error ? err.message : 'Errore nel caricamento dei dati organizzazione');
      setOrganizationData(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrganizationData = async () => {
    await fetchOrganizationData();
  };

  // Fetch organization data when user changes
  useEffect(() => {
    fetchOrganizationData();
  }, [userAddress, isAuthenticated]);

  const value: OrganizationContextType = {
    organizationData,
    loading,
    error,
    refreshOrganizationData
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = (): OrganizationContextType => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};

// Default export for Vite Fast Refresh compatibility
export default OrganizationProvider;
