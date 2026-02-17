// Helper function to safely access environment variables (NO FALLBACKS)
const getEnvVar = (key: string, allowEmpty: boolean = false): string => {
  let value: string | undefined;

  if (typeof import.meta !== 'undefined' && import.meta.env) {
    value = import.meta.env[key];
  } else {
    value = process.env[key];
  }

  if (!allowEmpty && (value === undefined || value === '')) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value || '';
};

// Base network (chainId 8453)
const BASE_CHAIN_ID = 8453;
const BASE_SEPOLIA_CHAIN_ID = 84532;

export const config = {
  // Privy
  privyAppId: getEnvVar('VITE_PRIVY_APP_ID', true),

  // Base
  base: {
    chainId: BASE_CHAIN_ID,
    rpcUrl: getEnvVar('VITE_BASE_RPC_URL', true) || 'https://mainnet.base.org',
    explorerUrl: getEnvVar('VITE_BASE_EXPLORER_URL', true) || 'https://basescan.org',
  },

  // SBT contract
  sbtContractAddress: getEnvVar('VITE_SBT_CONTRACT_ADDRESS', true) as `0x${string}` | undefined,

  // Pinata IPFS (optional)
  pinataGateway: getEnvVar('VITE_PINATA_GATEWAY', true),
  pinataJwt: getEnvVar('VITE_PINATA_JWT', true),
};

export const getExplorerUrl = () => config.base.explorerUrl;

export const getAssetExplorerUrl = (tokenId: number | string) =>
  `${config.base.explorerUrl}/token/${config.sbtContractAddress || ''}?a=${tokenId}`;

export const getTransactionExplorerUrl = (txHash: string) =>
  `${config.base.explorerUrl}/tx/${txHash}`;

export const getAddressExplorerUrl = (address: string) =>
  `${config.base.explorerUrl}/address/${address}`;

export const validateConfig = () => {
  try {
    if (!config.base.chainId) {
      throw new Error('Base chain configuration invalid');
    }
    return true;
  } catch {
    return false;
  }
};
