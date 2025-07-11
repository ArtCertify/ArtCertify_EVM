import { Safe, SafeAccountConfig, SafeFactory } from '@safe-global/protocol-kit';
import { SafePasskeyBase } from '@safe-global/safe-passkey';
import { createPublicClient, http, createWalletClient, custom, type Address } from 'viem';
import { sepolia, mainnet } from 'viem/chains';
import { type SafeConfig, type SafeInfo } from '../types/safe';
import { type PasskeyAssertion, type StoredPasskey } from '../types/passkey';

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

// Convert passkey to Safe signer
export async function createSafePasskeySigner(
  passkey: StoredPasskey,
  assertion: PasskeyAssertion
): Promise<SafePasskeyBase> {
  // Create a SafePasskeyBase instance from the passkey and assertion
  const safePasskey = new SafePasskeyBase({
    credentialId: passkey.rawId,
    publicKey: passkey.publicKey,
    algorithm: passkey.algorithm,
  });

  // Set the assertion for signing
  safePasskey.setAssertion(assertion);

  return safePasskey;
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

// Create Safe configuration from passkeys
export function createSafeConfigFromPasskeys(
  passkeys: StoredPasskey[],
  threshold: number = 1
): SafeAccountConfig {
  const owners = passkeys.map(passkey => deriveAddressFromPasskey(passkey));
  
  return {
    owners,
    threshold,
    // Use default Safe configuration
    saltNonce: Math.floor(Math.random() * 1000000).toString(),
  };
}

// Deploy Safe using Safe SDK
export async function deploySafeWithPasskeys(
  passkeys: StoredPasskey[],
  threshold: number = 1,
  network: keyof typeof NETWORKS = 'sepolia'
): Promise<{ safeAddress: Address; txHash: string }> {
  try {
    const config = getNetworkConfig(network);
    
    // Create public client
    const publicClient = createPublicClientForNetwork(network);
    
    // Create Safe account configuration
    const safeAccountConfig = createSafeConfigFromPasskeys(passkeys, threshold);
    
    // Create Safe Factory
    const safeFactory = await SafeFactory.create({
      provider: config.rpcUrl,
      signer: config.rpcUrl, // This would need to be a proper signer in production
    });
    
    // Predict Safe address
    const predictedSafeAddress = await safeFactory.predictSafeAddress(safeAccountConfig);
    
    // Deploy Safe
    const safeSdk = await safeFactory.deploySafe(safeAccountConfig);
    
    // Get the deployment transaction hash
    const deploymentTx = safeSdk.getAddress(); // This would return the actual tx hash in production
    
    return {
      safeAddress: predictedSafeAddress as Address,
      txHash: `0x${Math.random().toString(16).slice(2, 66)}`, // Mock tx hash for now
    };
    
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

// Sign message with Safe and passkey
export async function signMessageWithSafePasskey(
  safeAddress: Address,
  message: string,
  passkey: StoredPasskey,
  assertion: PasskeyAssertion,
  network: keyof typeof NETWORKS = 'sepolia'
): Promise<string> {
  try {
    const config = getNetworkConfig(network);
    
    // Create Safe instance
    const safeSdk = await Safe.create({
      provider: config.rpcUrl,
      safeAddress: safeAddress,
    });
    
    // Create Safe passkey signer
    const safePasskey = await createSafePasskeySigner(passkey, assertion);
    
    // Sign the message
    const signature = await safeSdk.signMessage(message);
    
    return signature.data;
  } catch (error) {
    console.error('Failed to sign message with Safe:', error);
    throw new Error(`Failed to sign message: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Create Safe transaction
export async function createSafeTransaction(
  safeAddress: Address,
  to: Address,
  value: string,
  data: string,
  network: keyof typeof NETWORKS = 'sepolia'
): Promise<any> {
  try {
    const config = getNetworkConfig(network);
    
    // Create Safe instance
    const safeSdk = await Safe.create({
      provider: config.rpcUrl,
      safeAddress: safeAddress,
    });
    
    // Create transaction
    const safeTransaction = await safeSdk.createTransaction({
      transactions: [{
        to,
        value,
        data,
      }],
    });
    
    return safeTransaction;
  } catch (error) {
    console.error('Failed to create Safe transaction:', error);
    throw new Error(`Failed to create transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}