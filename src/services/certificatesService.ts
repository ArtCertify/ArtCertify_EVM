import { config } from '../config/environment';
import * as baseContract from './baseContract';
import type { CertificateInfo } from '../types/asset';

/**
 * Fetches SBT certificates owned by address from Base contract.
 * Uses multicall batches (pochi RPC invece di 2 × totalSupply).
 */
export async function getOwnedCertificates(address: string): Promise<CertificateInfo[]> {
  const addr = config.sbtContractAddress;
  if (!addr) return [];

  try {
    const supply = await baseContract.getTotalSupply();
    if (supply === 0n) return [];

    const owner = address.toLowerCase();
    const tokenIds: bigint[] = [];
    for (let id = 1n; id <= supply; id++) tokenIds.push(id);

    const [ownersList, urisList] = await Promise.all([
      baseContract.getOwnersBatch(tokenIds),
      baseContract.getTokenURIsBatch(tokenIds),
    ]);

    const uriByTokenId = new Map<string, string>();
    urisList.forEach(({ tokenId, tokenURI }) => uriByTokenId.set(String(tokenId), tokenURI));

    const list: CertificateInfo[] = [];
    ownersList.forEach(({ tokenId, owner: tokenOwner }) => {
      if (tokenOwner.toLowerCase() !== owner) return;
      const tokenURI = uriByTokenId.get(String(tokenId));
      if (tokenURI == null) return;
      list.push({
        tokenId: Number(tokenId),
        tokenURI,
        owner: address,
        params: { name: undefined, creator: address, reserve: tokenURI },
        index: list.length,
      });
    });
    return list;
  } catch (e) {
    throw e;
  }
}

/**
 * Fetches a single certificate by tokenId (contract tokenURI + owner).
 */
export async function getCertificateByTokenId(
  tokenId: number | string
): Promise<CertificateInfo | null> {
  const addr = config.sbtContractAddress;
  if (!addr) return null;

  const id = BigInt(tokenId);
  try {
    const [owner, tokenURI] = await Promise.all([
      baseContract.getOwnerOf(id),
      baseContract.getTokenURI(id),
    ]);
    return {
      tokenId: Number(id),
      tokenURI,
      owner,
      params: { name: undefined, creator: owner, reserve: tokenURI },
      index: 0,
    };
  } catch {
    return null;
  }
}
