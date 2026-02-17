import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { nftService } from '../services/nftService';
import { IPFSUrlService } from '../services/ipfsUrlService';
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

      // In Base il nome "ORG: ..." è solo nel JSON su IPFS. Cerchiamo l'NFT il cui metadata.name inizia con il prefisso org.
      const results = await Promise.all(
        ownedNFTs.map(async (cert) => {
          const uri = cert.params?.reserve;
          if (!uri) return { cert, json: null };
          const res = IPFSUrlService.getReserveAddressUrl(uri);
          if (!res.success || !res.gatewayUrl) return { cert, json: null };
          try {
            const r = await fetch(res.gatewayUrl);
            if (!r.ok) return { cert, json: null };
            const json = await r.json();
            return { cert, json };
          } catch {
            return { cert, json: null };
          }
        })
      );

      const orgEntry = results.find((r) => isOrgNftName(r.json?.name));
      if (!orgEntry?.json || !orgEntry.cert.params?.reserve) {
        setOrganizationData(null);
        setLoading(false);
        return;
      }

      const jsonData = orgEntry.json;
      const organizationNFT = orgEntry.cert;
      const cert = jsonData.certification_data || {};
      const org = cert.organization || {};
      const tech = cert.technical_specs || {};
      const form = jsonData.properties?.form_data || {};
      const orgName = orgDisplayName(jsonData.name) || org.name || 'Organizzazione';
      const orgImage = toDisplayImageUrl(jsonData.image);

      setOrganizationData({
        name: orgName,
        image: orgImage,
        description: jsonData.description ?? tech.description ?? form.description,
        type: org.type ?? org.code ?? form.customType,
        city: org.city ?? form.fileOrigin,
        vatNumber: org.vatNumber ?? form.vatNumber,
        phone: org.phone ?? form.phone,
        email: org.email ?? form.email,
        website: org.website ?? form.website,
        address: org.address ?? form.address,
        assetId: organizationNFT.index ?? organizationNFT.tokenId,
        reserveAddress: organizationNFT.params.reserve,
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
