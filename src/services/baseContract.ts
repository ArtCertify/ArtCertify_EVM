import { createPublicClient, http, type Address } from 'viem';
import { base } from 'viem/chains';
import { config } from '../config/environment';
import { ArtCertifySBTAbi } from '../abis/ArtCertifySBT';

const RPC_CACHE_TTL_MS = 15_000; // 15 secondi per ridurre 429 con RPC pubblico

const cache = new Map<string, { value: unknown; ts: number }>();
function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && now - hit.ts < RPC_CACHE_TTL_MS) return Promise.resolve(hit.value as T);
  return fn().then((v) => {
    cache.set(key, { value: v, ts: now });
    return v;
  });
}

function getContractAddress(): Address {
  const addr = config.sbtContractAddress;
  if (!addr) throw new Error('VITE_SBT_CONTRACT_ADDRESS is not set');
  return addr as Address;
}

const publicClient = createPublicClient({
  chain: base,
  transport: http(config.base.rpcUrl),
});

export { publicClient };

/**
 * Read balance of SBTs for an address.
 */
export async function getBalanceOf(address: Address): Promise<bigint> {
  return cached(`balanceOf:${address}`, () =>
    publicClient.readContract({
      address: getContractAddress(),
      abi: ArtCertifySBTAbi,
      functionName: 'balanceOf',
      args: [address],
    })
  );
}

/**
 * Read total supply of minted SBTs.
 */
export async function getTotalSupply(): Promise<bigint> {
  return cached('totalSupply', () =>
    publicClient.readContract({
      address: getContractAddress(),
      abi: ArtCertifySBTAbi,
      functionName: 'totalSupply',
    })
  );
}

/**
 * Read owner of a token.
 */
export async function getOwnerOf(tokenId: bigint): Promise<Address> {
  return cached(`ownerOf:${tokenId}`, () =>
    publicClient.readContract({
      address: getContractAddress(),
      abi: ArtCertifySBTAbi,
      functionName: 'ownerOf',
      args: [tokenId],
    })
  );
}

/**
 * Read tokenURI for a token.
 */
export async function getTokenURI(tokenId: bigint): Promise<string> {
  return cached(`tokenURI:${tokenId}`, () =>
    publicClient.readContract({
      address: getContractAddress(),
      abi: ArtCertifySBTAbi,
      functionName: 'tokenURI',
      args: [tokenId],
    })
  );
}

/** Invalida la cache (es. dopo un mint). */
export function invalidateContractCache(): void {
  cache.clear();
}

export function getSbtContractAddress(): Address {
  return getContractAddress();
}

const MULTICALL_BATCH = 50;

/**
 * Lettura in batch degli owner di molti token (1 RPC ogni MULTICALL_BATCH token).
 */
export async function getOwnersBatch(tokenIds: bigint[]): Promise<{ tokenId: bigint; owner: Address }[]> {
  if (tokenIds.length === 0) return [];
  const contract = getContractAddress();
  const out: { tokenId: bigint; owner: Address }[] = [];
  for (let i = 0; i < tokenIds.length; i += MULTICALL_BATCH) {
    const chunk = tokenIds.slice(i, i + MULTICALL_BATCH);
    const contracts = chunk.map((id) => ({
      address: contract,
      abi: ArtCertifySBTAbi,
      functionName: 'ownerOf' as const,
      args: [id] as const,
    }));
    const results = await publicClient.multicall({ contracts, allowFailure: true });
    for (let j = 0; j < chunk.length; j++) {
      const r = results[j];
      if (r?.status === 'success' && r.result) out.push({ tokenId: chunk[j], owner: r.result });
    }
  }
  return out;
}

/**
 * Lettura in batch dei tokenURI di molti token (1 RPC ogni MULTICALL_BATCH token).
 */
export async function getTokenURIsBatch(tokenIds: bigint[]): Promise<{ tokenId: bigint; tokenURI: string }[]> {
  if (tokenIds.length === 0) return [];
  const contract = getContractAddress();
  const out: { tokenId: bigint; tokenURI: string }[] = [];
  for (let i = 0; i < tokenIds.length; i += MULTICALL_BATCH) {
    const chunk = tokenIds.slice(i, i + MULTICALL_BATCH);
    const contracts = chunk.map((id) => ({
      address: contract,
      abi: ArtCertifySBTAbi,
      functionName: 'tokenURI' as const,
      args: [id] as const,
    }));
    const results = await publicClient.multicall({ contracts, allowFailure: true });
    for (let j = 0; j < chunk.length; j++) {
      const r = results[j];
      if (r?.status === 'success' && typeof r.result === 'string')
        out.push({ tokenId: chunk[j], tokenURI: r.result });
    }
  }
  return out;
}
