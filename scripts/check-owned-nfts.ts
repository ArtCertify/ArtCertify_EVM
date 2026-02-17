/**
 * Simula le stesse chiamate che fa l'app per vedere gli NFT di un address.
 * Uso: npx tsx scripts/check-owned-nfts.ts [address]
 * Legge .env (VITE_BASE_RPC_URL, VITE_SBT_CONTRACT_ADDRESS).
 */
import 'dotenv/config';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { ArtCertifySBTAbi } from '../src/abis/ArtCertifySBT';

const ADDRESS = (process.argv[2] || '0x966FEaE9d370f5FFA30883dd3091f698f0090ec8').toLowerCase();
const RPC = process.env.VITE_BASE_RPC_URL || 'https://mainnet.base.org';
const CONTRACT = process.env.VITE_SBT_CONTRACT_ADDRESS as `0x${string}`;

if (!CONTRACT) {
  console.error('Manca VITE_SBT_CONTRACT_ADDRESS nel .env');
  process.exit(1);
}

const publicClient = createPublicClient({
  chain: base,
  transport: http(RPC),
});

const BATCH = 50;

async function main() {
  console.log('RPC:', RPC);
  console.log('Contratto SBT:', CONTRACT);
  console.log('Address da controllare:', ADDRESS);
  console.log('---');

  // 1) totalSupply()
  const supply = await publicClient.readContract({
    address: CONTRACT,
    abi: ArtCertifySBTAbi,
    functionName: 'totalSupply',
  });
  console.log('totalSupply():', supply.toString());

  if (supply === 0n) {
    console.log('Nessun token mintato.');
    return;
  }

  const tokenIds: bigint[] = [];
  for (let id = 1n; id <= supply; id++) tokenIds.push(id);

  // 2) multicall ownerOf(1) ... ownerOf(supply)
  const ownersList: { tokenId: bigint; owner: string }[] = [];
  for (let i = 0; i < tokenIds.length; i += BATCH) {
    const chunk = tokenIds.slice(i, i + BATCH);
    const contracts = chunk.map((id) => ({
      address: CONTRACT,
      abi: ArtCertifySBTAbi,
      functionName: 'ownerOf' as const,
      args: [id] as const,
    }));
    const results = await publicClient.multicall({ contracts, allowFailure: true });
    for (let j = 0; j < chunk.length; j++) {
      const r = results[j];
      if (r?.status === 'success' && r.result)
        ownersList.push({ tokenId: chunk[j], owner: (r.result as string).toLowerCase() });
    }
  }

  // 3) multicall tokenURI(1) ... tokenURI(supply)
  const urisList: { tokenId: bigint; tokenURI: string }[] = [];
  for (let i = 0; i < tokenIds.length; i += BATCH) {
    const chunk = tokenIds.slice(i, i + BATCH);
    const contracts = chunk.map((id) => ({
      address: CONTRACT,
      abi: ArtCertifySBTAbi,
      functionName: 'tokenURI' as const,
      args: [id] as const,
    }));
    const results = await publicClient.multicall({ contracts, allowFailure: true });
    for (let j = 0; j < chunk.length; j++) {
      const r = results[j];
      if (r?.status === 'success' && typeof r.result === 'string')
        urisList.push({ tokenId: chunk[j], tokenURI: r.result });
    }
  }

  const uriByTokenId = new Map<string, string>();
  urisList.forEach(({ tokenId, tokenURI }) => uriByTokenId.set(String(tokenId), tokenURI));

  // 4) filtra per owner
  const owned = ownersList.filter((o) => o.owner === ADDRESS).map((o) => {
    const tokenURI = uriByTokenId.get(String(o.tokenId));
    return { tokenId: o.tokenId.toString(), tokenURI: tokenURI ?? '(no URI)' };
  });

  console.log('NFT posseduti da', ADDRESS, ':', owned.length);
  owned.forEach((n) => console.log('  tokenId', n.tokenId, '→', n.tokenURI));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
