import { useState, useEffect } from 'react';
import { getCachedMetadata } from '../services/ipfsMetadataCache';
import type { AssetInfo } from '../types/asset';

/**
 * Carica il nome di ogni certificato dal metadata IPFS (cache condivisa → 1 fetch per NFT).
 * Nome in formato "Progetto / File" per raggruppare i progetti.
 */
export function useCertificateNames(certificates: AssetInfo[]): Map<string | number, string> {
  const [names, setNames] = useState<Map<string | number, string>>(new Map());

  useEffect(() => {
    if (!certificates.length) {
      setNames(new Map());
      return;
    }

    let cancelled = false;
    const newMap = new Map<string | number, string>();

    Promise.allSettled(
      certificates.map(async (cert) => {
        const uri = cert.tokenURI || cert.params?.reserve;
        if (!uri) return;
        const json = await getCachedMetadata(uri);
        if (!json) return;
        const name = (json.name ?? (json.certification_data as { title?: string })?.title) ?? '';
        const key = cert.tokenId ?? cert.index ?? '';
        if (name) newMap.set(key, String(name));
      })
    ).then(() => {
      if (!cancelled) setNames(new Map(newMap));
    });

    return () => {
      cancelled = true;
    };
  }, [certificates.length, certificates.map((c) => String(c.tokenId ?? c.index)).join(',')]);

  return names;
}
