import { useState, useEffect, useCallback } from 'react';
import { 
  getStoredSafeConfig, 
  storeSafeConfig, 
  clearStoredSafeConfig,
  isSafeDeployed,
  getSafeInfo,
  formatSafeAddress,
  getSafeAppUrl,
  SAFE_NETWORKS
} from '../utils/safe';
import { 
  deploySafeWithPasskeys,
  isSafeDeployedOnChain,
  getSafeInfoFromBlockchain,
  deriveAddressFromPasskey
} from '../utils/safeSDK';
import { type SafeConfig, type SafeInfo } from '../types/safe';
import { type StoredPasskey } from '../types/passkey';

interface UseSafeReturn {
  safeConfig: SafeConfig | null;
  safeInfo: SafeInfo | null;
  isDeployed: boolean;
  isLoading: boolean;
  error: string | null;
  setSafeAddress: (address: string) => void;
  deploySafe: (passkeys: StoredPasskey[], threshold: number) => Promise<boolean>;
  refreshSafeInfo: () => Promise<void>;
  clearSafeConfig: () => void;
  clearError: () => void;
  formatAddress: (address: string) => string;
  getSafeUrl: (address: string) => string;
}

export const useSafe = (network: keyof typeof SAFE_NETWORKS = 'sepolia'): UseSafeReturn => {
  const [safeConfig, setSafeConfig] = useState<SafeConfig | null>(null);
  const [safeInfo, setSafeInfo] = useState<SafeInfo | null>(null);
  const [isDeployed, setIsDeployed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load stored Safe configuration
  useEffect(() => {
    const loadStoredConfig = () => {
      try {
        const stored = getStoredSafeConfig();
        if (stored) {
          setSafeConfig(stored);
        }
      } catch (err) {
        console.error('Failed to load stored Safe configuration:', err);
        setError('Failed to load stored Safe configuration');
      }
    };

    loadStoredConfig();
  }, []);

  // Check if Safe is deployed when config changes
  useEffect(() => {
    const checkDeployment = async () => {
      if (!safeConfig?.safeAddress) return;

      setIsLoading(true);
      try {
        const deployed = await isSafeDeployedOnChain(safeConfig.safeAddress, network);
        setIsDeployed(deployed);
        
        if (deployed) {
          await refreshSafeInfo();
        }
      } catch (err) {
        console.error('Failed to check Safe deployment:', err);
        setError('Failed to check Safe deployment status');
      } finally {
        setIsLoading(false);
      }
    };

    checkDeployment();
  }, [safeConfig?.safeAddress, network]);

  // Set Safe address
  const setSafeAddress = useCallback((address: string) => {
    const newConfig: SafeConfig = {
      ...safeConfig,
      safeAddress: address,
      network,
    };
    
    setSafeConfig(newConfig);
    storeSafeConfig(newConfig);
  }, [safeConfig, network]);

  // Deploy Safe using real Safe SDK integration
  const deploySafe = useCallback(async (passkeys: StoredPasskey[], threshold: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert passkeys to owner addresses
      const owners = passkeys.map(passkey => deriveAddressFromPasskey(passkey));
      
      // Deploy Safe using Safe SDK
      const { safeAddress, txHash } = await deploySafeWithPasskeys(passkeys, threshold, network);
      
      const newConfig: SafeConfig = {
        safeAddress,
        owners,
        threshold,
        network,
      };
      
      setSafeConfig(newConfig);
      storeSafeConfig(newConfig);
      setIsDeployed(true);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to deploy Safe';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [network]);

  // Refresh Safe information
  const refreshSafeInfo = useCallback(async () => {
    if (!safeConfig?.safeAddress) return;

    setIsLoading(true);
    try {
      const info = await getSafeInfoFromBlockchain(safeConfig.safeAddress, network);
      setSafeInfo(info);
    } catch (err) {
      console.error('Failed to refresh Safe info:', err);
      setError('Failed to refresh Safe information');
    } finally {
      setIsLoading(false);
    }
  }, [safeConfig?.safeAddress, network]);

  // Clear Safe configuration
  const clearSafeConfig = useCallback(() => {
    setSafeConfig(null);
    setSafeInfo(null);
    setIsDeployed(false);
    clearStoredSafeConfig();
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Format address
  const formatAddress = useCallback((address: string) => {
    return formatSafeAddress(address);
  }, []);

  // Get Safe URL
  const getSafeUrl = useCallback((address: string) => {
    return getSafeAppUrl(address, network);
  }, [network]);

  return {
    safeConfig,
    safeInfo,
    isDeployed,
    isLoading,
    error,
    setSafeAddress,
    deploySafe,
    refreshSafeInfo,
    clearSafeConfig,
    clearError,
    formatAddress,
    getSafeUrl,
  };
}; 