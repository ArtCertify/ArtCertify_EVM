/**
 * EVM/Base: certificate (SBT) info. Used by Dashboard, CertificateCard, AssetDetailsPage.
 */
export interface CertificateInfo {
  tokenId: number | string;
  tokenURI: string;
  owner: string;
  creationTimestamp?: number;
  /** For compatibility with UI that expects params.name */
  params?: {
    name?: string;
    creator?: string;
    reserve?: string;
  };
  /** For compatibility: use tokenId as index */
  index?: number;
  'created-at-round'?: number;
}

/**
 * Alias for components that still use AssetInfo naming; same shape as CertificateInfo.
 */
export type AssetInfo = CertificateInfo;
