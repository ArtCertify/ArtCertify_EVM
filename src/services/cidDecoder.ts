import { IPFSUrlService } from './ipfsUrlService';

export interface ReserveCidInfo {
  success: boolean;
  cid: string;
  gatewayUrl: string;
  details?: { version?: number; codec?: string; hashType?: string };
}

/**
 * Stub/helper per decodifica CID IPFS (compatibilità con componenti asset).
 */
export const CidDecoder = {
  decode(_cid: string): { version: number; codec: string } | null {
    return { version: 1, codec: 'raw' };
  },
  decodeReserveAddressToCid(reserve: string): ReserveCidInfo | null {
    const m = reserve.match(/ipfs:\/\/([^/]+)/);
    const cid = m ? m[1] : reserve.startsWith('Q') || reserve.startsWith('b') ? reserve : null;
    if (!cid) return null;
    return {
      success: true,
      cid,
      gatewayUrl: IPFSUrlService.getGatewayUrl(cid),
      details: { version: 1, codec: 'raw' },
    };
  },
};
