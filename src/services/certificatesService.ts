import { config } from '../config/environment';
import * as baseContract from './baseContract';
import type { CertificateInfo } from '../types/asset';

/**
 * Fetches SBT certificates owned by address from Base contract.
 * Scans token ids 1..totalSupply and filters by owner.
 */
export async function getOwnedCertificates(address: string): Promise<CertificateInfo[]> {
  const addr = config.sbtContractAddress;
  if (!addr || addr === '') return [];

  try {
    const supply = await baseContract.getTotalSupply();
    const list: CertificateInfo[] = [];
    const owner = address as `0x${string}`;
    for (let id = 1n; id <= supply; id++) {
      try {
        const tokenOwner = await baseContract.getOwnerOf(id);
        if (tokenOwner.toLowerCase() !== owner.toLowerCase()) continue;
        const tokenURI = await baseContract.getTokenURI(id);
        list.push({
          tokenId: Number(id),
          tokenURI,
          owner: address,
          params: { name: undefined, creator: address, reserve: tokenURI },
          index: list.length,
        });
      } catch {
        // token might not exist or be burned; skip
      }
    }
    return list;
  } catch {
    return [];
  }
}

/**
 * Fetches a single certificate by tokenId (contract tokenURI + owner).
 */
export async function getCertificateByTokenId(
  tokenId: number | string
): Promise<CertificateInfo | null> {
  const addr = config.sbtContractAddress;
  if (!addr || addr === '') return null;

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
