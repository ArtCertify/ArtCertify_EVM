import { createPublicClient, http, type Address } from 'viem';
import { sepolia, mainnet } from 'viem/chains';
import { type SafeInfo } from '../types/safe';
import { type StoredPasskey } from '../types/passkey';

// Network configurations
const NETWORKS = {
  sepolia: {
    chain: sepolia,
    rpcUrl: 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    safeService: 'https://safe-transaction-sepolia.safe.global',
  },
  mainnet: {
    chain: mainnet,
    rpcUrl: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    safeService: 'https://safe-transaction-mainnet.safe.global',
  },
};

// Get network configuration
export function getNetworkConfig(network: keyof typeof NETWORKS = 'sepolia') {
  return NETWORKS[network];
}

// Create public client for reading blockchain data
export function createPublicClientForNetwork(network: keyof typeof NETWORKS = 'sepolia') {
  const config = getNetworkConfig(network);
  return createPublicClient({
    chain: config.chain,
    transport: http(config.rpcUrl),
  });
}

// Derive Ethereum address from passkey
export function deriveAddressFromPasskey(passkey: StoredPasskey): Address {
  // This is a simplified version - in a real implementation, 
  // you would properly derive the address from the public key
  
  // For demonstration purposes, we'll create a deterministic address
  // based on the passkey's public key
  const hash = Array.from(new TextEncoder().encode(passkey.publicKey))
    .reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
  
  // Take first 40 characters and prefix with 0x
  const address = `0x${hash.slice(0, 40)}` as Address;
  
  return address;
}

// Deploy Safe using Safe SDK (simplified version)
export async function deploySafeWithPasskeys(
  passkeys: StoredPasskey[],
  threshold: number = 1,
  _network: keyof typeof NETWORKS = 'sepolia'
): Promise<{ safeAddress: Address; txHash: string }> {
  try {
    // Convert passkeys to owner addresses
    const owners = passkeys.map(passkey => deriveAddressFromPasskey(passkey));
    
    // In a real implementation, this would:
    // 1. Create Safe account configuration
    // 2. Deploy Safe using Safe SDK
    // 3. Wait for deployment transaction
    // 4. Return actual Safe address and transaction hash
    
    // For now, create a predictable Safe address based on owners and threshold
    const configHash = owners.join('') + threshold.toString();
    const addressHash = Array.from(new TextEncoder().encode(configHash))
      .reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
    
    const safeAddress = `0x${addressHash.slice(0, 40)}` as Address;
    const txHash = `0x${Math.random().toString(16).slice(2, 66)}`;
    
    // Simulate deployment time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { safeAddress, txHash };
    
  } catch (error) {
    console.error('Failed to deploy Safe:', error);
    throw new Error(`Failed to deploy Safe: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Get Safe info from the blockchain
export async function getSafeInfoFromBlockchain(
  safeAddress: Address,
  network: keyof typeof NETWORKS = 'sepolia'
): Promise<SafeInfo | null> {
  try {
    const config = getNetworkConfig(network);
    const response = await fetch(`${config.safeService}/api/v1/safes/${safeAddress}/`);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data as SafeInfo;
  } catch (error) {
    console.error('Failed to get Safe info:', error);
    return null;
  }
}

// Check if Safe is deployed on the blockchain
export async function isSafeDeployedOnChain(
  safeAddress: Address,
  network: keyof typeof NETWORKS = 'sepolia'
): Promise<boolean> {
  try {
    const publicClient = createPublicClientForNetwork(network);
    const bytecode = await publicClient.getBytecode({ address: safeAddress });
    return bytecode !== undefined && bytecode !== '0x';
  } catch (error) {
    console.error('Failed to check Safe deployment:', error);
    return false;
  }
}

// Sign message with Safe and passkey (simplified version)
export async function signMessageWithSafePasskey(
  _safeAddress: Address,
  message: string,
  _passkey: StoredPasskey,
  _network: keyof typeof NETWORKS = 'sepolia'
): Promise<string> {
  try {
    // In a real implementation, this would:
    // 1. Create Safe instance
    // 2. Create Safe passkey signer
    // 3. Sign the message using Safe + passkey
    
    // For now, create a mock signature
    const messageHash = Array.from(new TextEncoder().encode(message))
      .reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
    
    const signature = `0x${messageHash.slice(0, 130)}`;
    
    return signature;
  } catch (error) {
    console.error('Failed to sign message with Safe:', error);
    throw new Error(`Failed to sign message: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Create Safe transaction (simplified version)
export async function createSafeTransaction(
  safeAddress: Address,
  to: Address,
  value: string,
  data: string,
  _network: keyof typeof NETWORKS = 'sepolia'
): Promise<any> {
  try {
    // In a real implementation, this would:
    // 1. Create Safe instance
    // 2. Create transaction
    // 3. Return transaction object
    
    // For now, create a mock transaction
    const transaction = {
      to,
      value,
      data,
      operation: 0,
      safeTxGas: 0,
      baseGas: 0,
      gasPrice: 0,
      gasToken: '0x0000000000000000000000000000000000000000',
      refundReceiver: '0x0000000000000000000000000000000000000000',
      nonce: 0,
      safeAddress,
    };
    
    return transaction;
  } catch (error) {
    console.error('Failed to create Safe transaction:', error);
    throw new Error(`Failed to create transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}