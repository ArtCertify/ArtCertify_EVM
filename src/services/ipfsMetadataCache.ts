import { IPFSUrlService } from './ipfsUrlService';

/**
 * Cache in-memory per metadata IPFS (JSON).
 * Ogni CID viene fetcato una sola volta per sessione → meno richieste a Pinata/gateway,
 * niente doppie letture tra useCertificateNames, CertificateCard, OrganizationContext.
 *
 * Pinata: gateway dedicato senza rate limit per le letture; API upload 60/min (free).
 * La cache riduce comunque carico e prepara a eventuali limiti futuri.
 */

const cache = new Map<string, Record<string, unknown>>();
const inFlight = new Map<string, Promise<Record<string, unknown> | null>>();

function normalizeToCid(uriOrCid: string): string | null {
  if (!uriOrCid?.trim()) return null;
  const t = uriOrCid.trim();
  if (t.startsWith('ipfs://')) return t.replace('ipfs://', '').trim();
  const m = t.match(/\/ipfs\/([^/?#]+)/);
  return m ? m[1] : t;
}

/**
 * Restituisce il metadata JSON per un tokenURI/CID.
 * Se in cache ritorna subito, altrimenti fetch e salva in cache.
 */
export async function getCachedMetadata(uriOrCid: string): Promise<Record<string, unknown> | null> {
  const cid = normalizeToCid(uriOrCid);
  if (!cid) return null;

  const cached = cache.get(cid);
  if (cached != null) return cached;

  let promise = inFlight.get(cid);
  if (!promise) {
    promise = (async () => {
      try {
        const res = IPFSUrlService.getReserveAddressUrl(uriOrCid);
        if (!res.success || !res.gatewayUrl) return null;
        const r = await fetch(res.gatewayUrl);
        if (!r.ok) return null;
        const json = (await r.json()) as Record<string, unknown>;
        cache.set(cid!, json);
        return json;
      } catch {
        return null;
      } finally {
        inFlight.delete(cid!);
      }
    })();
    inFlight.set(cid, promise);
  }

  return promise;
}

/**
 * Versione sincrona: restituisce il valore solo se già in cache (per UI che può aspettare).
 */
export function getCachedMetadataSync(uriOrCid: string): Record<string, unknown> | null {
  const cid = normalizeToCid(uriOrCid);
  if (!cid) return null;
  return cache.get(cid) ?? null;
}

/** Svuota la cache (utile per test o logout). */
export function clearMetadataCache(): void {
  cache.clear();
  inFlight.clear();
}
