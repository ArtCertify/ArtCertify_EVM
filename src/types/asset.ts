/** Metadata caricata da IPFS (usata in AssetDetailsPage, ModifyAttachmentsModal, ecc.) */
export interface NFTMetadataLike {
  name?: string;
  description?: string;
  image?: string;
  certification_data?: Record<string, unknown>;
  properties?: { form_data?: Record<string, unknown> };
  [key: string]: unknown;
}

/**
 * EVM/Base: certificate (SBT) info. Used by Dashboard, CertificateCard, AssetDetailsPage.
 * params esteso con campi opzionali per compatibilità con UI legacy (Algorand).
 */
export interface CertificateInfo {
  tokenId: number | string;
  tokenURI: string;
  owner: string;
  creationTimestamp?: number;
  description?: string;
  /** For compatibility with UI that expects params.name, unitName, url, etc. */
  params?: {
    name?: string;
    creator?: string;
    reserve?: string;
    unitName?: string;
    url?: string;
    total?: number;
    metadataHash?: string;
    manager?: string;
    freeze?: string;
    clawback?: string;
    decimals?: number;
    defaultFrozen?: boolean;
    [key: string]: unknown;
  };
  index?: number;
  'created-at-round'?: number;
  creationTransaction?: Record<string, unknown>;
  nftMetadata?: NFTMetadataLike | null;
  versioningInfo?: unknown;
  currentCidInfo?: unknown;
}

/**
 * Alias for components that still use AssetInfo naming; same shape as CertificateInfo.
 */
export type AssetInfo = CertificateInfo;
