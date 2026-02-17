import type { AssetInfo } from '../types/asset';
import { getOwnedCertificates } from './certificatesService';

export interface OwnedAsset {
  assetId: string;
  amount: number;
  isFrozen: boolean;
  optedInAtRound: number;
  optedOutAtRound?: number;
}

export interface AccountAssets {
  address: string;
  assets: OwnedAsset[];
  totalAssets: number;
}

function certificateToAssetInfo(c: {
  tokenId: number | string;
  tokenURI: string;
  owner: string;
  creationTimestamp?: number;
  params?: { name?: string; creator?: string; reserve?: string };
}): AssetInfo {
  const tokenId = typeof c.tokenId === 'string' ? parseInt(c.tokenId, 10) : c.tokenId;
  return {
    tokenId: c.tokenId,
    tokenURI: c.tokenURI,
    owner: c.owner,
    creationTimestamp: c.creationTimestamp,
    params: c.params ?? { name: `Certificate ${tokenId}`, creator: c.owner, reserve: c.tokenURI },
    index: typeof tokenId === 'number' ? tokenId : undefined,
    'created-at-round': c.creationTimestamp ? Math.floor(c.creationTimestamp / 4.5) : undefined,
  };
}

class NFTService {
  async getOwnedNFTs(address: string): Promise<AssetInfo[]> {
    const certs = await getOwnedCertificates(address);
    return certs.map(certificateToAssetInfo);
  }

  async getOwnedAssets(address: string): Promise<AccountAssets> {
    const certs = await getOwnedCertificates(address);
    return {
      address,
      assets: certs.map((c) => ({
        assetId: String(c.tokenId),
        amount: 1,
        isFrozen: false,
        optedInAtRound: 0,
      })),
      totalAssets: certs.length,
    };
  }
}

export const nftService = new NFTService();
