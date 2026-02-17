/**
 * Naming per NFT Organizzazione.
 * Il prefisso "ORG: " è sempre applicato in automatico dal sistema (l'utente non lo inserisce nel form).
 * Nome collezione on-chain: "ArtCertify Certificate" (symbol ARTCRT) — stesso contratto per tutti i certificati.
 */

export const ORG_NFT_NAME_PREFIX = 'ORG: ';

/** Nome da usare nel metadata dell'NFT organizzazione (sempre con prefisso ORG: ). */
export function toOrgNftName(organizationName: string): string {
  const name = (organizationName || '').trim();
  if (!name) return ORG_NFT_NAME_PREFIX + 'Organizzazione';
  return ORG_NFT_NAME_PREFIX + name;
}

/** Verifica se un nome metadata è di un NFT organizzazione. */
export function isOrgNftName(name: string | undefined): boolean {
  return Boolean(name?.startsWith?.(ORG_NFT_NAME_PREFIX));
}

/** Nome per sola visualizzazione (senza prefisso ORG: ). */
export function orgDisplayName(nftName: string | undefined): string {
  if (!nftName) return 'Organizzazione';
  return nftName.startsWith(ORG_NFT_NAME_PREFIX)
    ? nftName.slice(ORG_NFT_NAME_PREFIX.length).trim() || 'Organizzazione'
    : nftName;
}
