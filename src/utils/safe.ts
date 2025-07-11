import { type SafeConfig, type SafeTransaction, type SafeInfo } from '../types/safe';

// Safe configuration for different networks
export const SAFE_NETWORKS = {
  sepolia: {
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    safeService: 'https://safe-transaction-sepolia.safe.global',
    safeWebApp: 'https://app.safe.global',
    safeFactory: '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
    safeMaster: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
    multiSend: '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
    multiSendCallOnly: '0x40A2aCCbd92BCA938b02010E17A5b8929b49130D',
    fallbackHandler: '0x1AC114C2099aFAf5261731655Dc6c306bFcd4Dbd',
    createCall: '0x7cbB62EaA69F79e6873cD1ecB2392971036cFdA4',
    signMessageLib: '0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2',
    simulateTxAccessor: '0x59AD6735bCd8152B84860Cb256dD9e96b85F69Da',
  },
  mainnet: {
    chainId: 1,
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    safeService: 'https://safe-transaction-mainnet.safe.global',
    safeWebApp: 'https://app.safe.global',
    safeFactory: '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
    safeMaster: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
    multiSend: '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
    multiSendCallOnly: '0x40A2aCCbd92BCA938b02010E17A5b8929b49130D',
    fallbackHandler: '0x1AC114C2099aFAf5261731655Dc6c306bFcd4Dbd',
    createCall: '0x7cbB62EaA69F79e6873cD1ecB2392971036cFdA4',
    signMessageLib: '0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2',
    simulateTxAccessor: '0x59AD6735bCd8152B84860Cb256dD9e96b85F69Da',
  },
} as const;

// Get network configuration
export function getNetworkConfig(network: keyof typeof SAFE_NETWORKS = 'sepolia') {
  return SAFE_NETWORKS[network];
}

// Format Safe address
export function formatSafeAddress(address: string): string {
  if (!address || address.length < 42) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Validate Ethereum address
export function isValidEthereumAddress(address: string): boolean {
  const regex = /^0x[a-fA-F0-9]{40}$/;
  return regex.test(address);
}

// Convert Wei to Ether
export function weiToEther(wei: string | number): string {
  const weiValue = typeof wei === 'string' ? BigInt(wei) : BigInt(wei);
  const etherValue = weiValue / BigInt(10 ** 18);
  return etherValue.toString();
}

// Convert Ether to Wei
export function etherToWei(ether: string | number): string {
  const etherValue = typeof ether === 'string' ? parseFloat(ether) : ether;
  const weiValue = BigInt(Math.floor(etherValue * 10 ** 18));
  return weiValue.toString();
}

// Generate Safe transaction hash
export function generateSafeTxHash(
  safeAddress: string,
  transaction: SafeTransaction,
  nonce: number,
  chainId: number
): string {
  // This is a simplified version - in a real implementation,
  // you'd need to properly encode the transaction data
  const txData = `${safeAddress}${transaction.to}${transaction.value}${transaction.data}${nonce}${chainId}`;
  return `0x${txData.slice(0, 64)}`;
}

// Get Safe transaction URL
export function getSafeTransactionUrl(
  safeAddress: string,
  safeTxHash: string,
  network: keyof typeof SAFE_NETWORKS = 'sepolia'
): string {
  const networkConfig = getNetworkConfig(network);
  const networkParam = network === 'mainnet' ? 'eth' : network;
  return `${networkConfig.safeWebApp}/${networkParam}:${safeAddress}/transactions/tx?id=multisig_${safeAddress}_${safeTxHash}`;
}

// Get Safe app URL
export function getSafeAppUrl(
  safeAddress: string,
  network: keyof typeof SAFE_NETWORKS = 'sepolia'
): string {
  const networkConfig = getNetworkConfig(network);
  const networkParam = network === 'mainnet' ? 'eth' : network;
  return `${networkConfig.safeWebApp}/${networkParam}:${safeAddress}`;
}

// Create dummy transaction for testing
export function createDummyTransaction(toAddress: string): SafeTransaction {
  return {
    to: toAddress,
    value: '0',
    data: '0x',
    operation: 0,
    safeTxGas: 0,
    baseGas: 0,
    gasPrice: 0,
    gasToken: '0x0000000000000000000000000000000000000000',
    refundReceiver: '0x0000000000000000000000000000000000000000',
    nonce: 0,
  };
}

// Storage key for Safe configuration
const SAFE_CONFIG_KEY = 'artcertify_safe_config';

// Store Safe configuration
export function storeSafeConfig(config: SafeConfig): void {
  try {
    localStorage.setItem(SAFE_CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to store Safe configuration:', error);
  }
}

// Get stored Safe configuration
export function getStoredSafeConfig(): SafeConfig | null {
  try {
    const stored = localStorage.getItem(SAFE_CONFIG_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to get stored Safe configuration:', error);
    return null;
  }
}

// Clear stored Safe configuration
export function clearStoredSafeConfig(): void {
  try {
    localStorage.removeItem(SAFE_CONFIG_KEY);
  } catch (error) {
    console.error('Failed to clear stored Safe configuration:', error);
  }
}

// Check if Safe is deployed
export async function isSafeDeployed(
  safeAddress: string,
  network: keyof typeof SAFE_NETWORKS = 'sepolia'
): Promise<boolean> {
  try {
    const networkConfig = getNetworkConfig(network);
    const response = await fetch(`${networkConfig.safeService}/api/v1/safes/${safeAddress}/`);
    return response.ok;
  } catch (error) {
    console.error('Failed to check Safe deployment status:', error);
    return false;
  }
}

// Get Safe information
export async function getSafeInfo(
  safeAddress: string,
  network: keyof typeof SAFE_NETWORKS = 'sepolia'
): Promise<SafeInfo | null> {
  try {
    const networkConfig = getNetworkConfig(network);
    const response = await fetch(`${networkConfig.safeService}/api/v1/safes/${safeAddress}/`);
    
    if (!response.ok) {
      throw new Error(`Failed to get Safe info: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as SafeInfo;
  } catch (error) {
    console.error('Failed to get Safe info:', error);
    return null;
  }
} 