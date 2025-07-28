// Helper function to safely access environment variables
const getEnvVar = (key: string, fallback?: string): string => {
  let value: string | undefined;
  
  // Check if we're in a Vite environment
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    value = import.meta.env[key];
  } else {
    // Fallback for Node.js environment (testing)
    value = process.env[key];
  }
  
  if (value === undefined || value === '') {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`Missing required environment variable: ${key}`);
  }
  
  return value;
};

// Network configuration type
type EVMNetworkType = 'sepolia' | 'mainnet' | 'polygon' | 'arbitrum';

// Network-specific configurations
const getNetworkConfig = (network: EVMNetworkType) => {
  switch (network) {
    case 'mainnet':
      return {
        chainId: 1,
        name: 'Ethereum Mainnet',
        explorerUrl: 'https://etherscan.io',
        rpcUrl: 'https://eth-mainnet.rpc.grove.city/v1/62b3314e123e6f00039fb3cc',
        nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 }
      };
    case 'sepolia':
      return {
        chainId: 11155111,
        name: 'Ethereum Sepolia',
        explorerUrl: 'https://sepolia.etherscan.io',
        rpcUrl: 'https://sepolia.rpc.grove.city/v1/62b3314e123e6f00039fb3cc',
        nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 }
      };
    case 'polygon':
      return {
        chainId: 137,
        name: 'Polygon Mainnet',
        explorerUrl: 'https://polygonscan.com',
        rpcUrl: 'https://polygon-rpc.com',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }
      };
    case 'arbitrum':
      return {
        chainId: 42161,
        name: 'Arbitrum One',
        explorerUrl: 'https://arbiscan.io',
        rpcUrl: 'https://arb1.arbitrum.io/rpc',
        nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 }
      };
    default:
      throw new Error(`Unsupported network: ${network}. Use 'sepolia', 'mainnet', 'polygon', or 'arbitrum'`);
  }
};

// Main environment configuration
const evmNetworkRaw = getEnvVar('VITE_EVM_NETWORK', 'sepolia').toLowerCase() as EVMNetworkType;
const networkConfig = getNetworkConfig(evmNetworkRaw);

export const config = {
  // App Configuration
  appName: getEnvVar('VITE_APP_NAME', 'ArtCertify EVM'),
  appVersion: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  environment: getEnvVar('NODE_ENV', 'development'),
  
  // EVM Network Configuration
  network: evmNetworkRaw,
  ...networkConfig,
  
  // Account Abstraction Configuration (VIEM/Pimlico)
  bundlerUrl: getEnvVar('VITE_BUNDLER_URL', `https://api.pimlico.io/v2/${evmNetworkRaw}/rpc`),
  paymasterUrl: getEnvVar('VITE_PAYMASTER_URL', `https://api.pimlico.io/v2/${evmNetworkRaw}/rpc`),
  pimlicoApiKey: getEnvVar('VITE_PIMLICO_API_KEY', 'mock-api-key'),
  
  // Smart Account Configuration
  accountType: getEnvVar('VITE_ACCOUNT_TYPE', 'safe') as 'safe' | 'kernel' | 'simple',
  entryPointAddress: getEnvVar('VITE_ENTRY_POINT', '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'),
  
  // IPFS Configuration
  ipfsGateway: getEnvVar('VITE_IPFS_GATEWAY', 'https://gateway.pinata.cloud/ipfs'),
  pinataApiKey: getEnvVar('VITE_PINATA_API_KEY', 'mock-pinata-key'),
  pinataSecretKey: getEnvVar('VITE_PINATA_SECRET_KEY', 'mock-pinata-secret'),
  
  // Mock Data Configuration (for development)
  enableMockData: getEnvVar('VITE_ENABLE_MOCK_DATA', 'true') === 'true',
  
  // Development Configuration
  isDevelopment: getEnvVar('NODE_ENV', 'development') === 'development',
  isProduction: getEnvVar('NODE_ENV', 'development') === 'production',
  
  // API Configuration
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3000/api'),
};

// Export individual configurations for convenience
export const {
  appName,
  appVersion,
  network,
  chainId,
  name: networkName,
  explorerUrl,
  rpcUrl,
  bundlerUrl,
  paymasterUrl,
  pimlicoApiKey,
  accountType,
  entryPointAddress,
  ipfsGateway,
  enableMockData,
  isDevelopment,
  isProduction
} = config;

// Validation
if (isDevelopment && !enableMockData) {
  console.warn('⚠️  Running in development mode without mock data. Ensure all API keys are properly configured.');
}

console.log('🔧 Environment Configuration:', {
  network: network,
  chainId: chainId,
  accountType: accountType,
  enableMockData: enableMockData,
  environment: config.environment
});

// Explorer URL helpers
export const getAssetExplorerUrl = (tokenId: string, contractAddress?: string) => 
  contractAddress 
    ? `${explorerUrl}/token/${contractAddress}?a=${tokenId}`
    : `${explorerUrl}/address/${tokenId}`;

export const getTransactionExplorerUrl = (txHash: string) => 
  `${explorerUrl}/tx/${txHash}`;

export const getAddressExplorerUrl = (address: string) => 
  `${explorerUrl}/address/${address}`;

// Validation function to ensure required config is present
export const validateConfig = () => {
  try {
    // Only validate essential configuration
    if (!config.network) {
      throw new Error('VITE_EVM_NETWORK is required');
    }
    
    if (!config.chainId) {
      throw new Error('Network configuration invalid');
    }
    
    // RPC and other services are always set from defaults
    console.log(`✅ Configuration valid for ${config.network}`);
    console.log(`🌐 Network: ${config.chainId === 1 ? 'MainNet' : 'TestNet'}`);
    console.log(`🔗 RPC: ${config.rpcUrl}`);
    console.log(`📊 Explorer: ${config.explorerUrl}`);

    return true;
  } catch (error) {
    console.error('❌ Configuration validation failed:', error);
    return false;
  }
}; 