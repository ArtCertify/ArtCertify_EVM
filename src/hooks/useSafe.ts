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
import { type SafeConfig, type SafeInfo } from '../types/safe';

interface UseSafeReturn {
  safeConfig: SafeConfig | null;
  safeInfo: SafeInfo | null;
  isDeployed: boolean;
  isLoading: boolean;
  error: string | null;
  setSafeAddress: (address: string) => void;
  deploySafe: (owners: string[], threshold: number) => Promise<boolean>;
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
        const deployed = await isSafeDeployed(safeConfig.safeAddress, network);
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

  // Deploy Safe (placeholder - would need actual Safe SDK integration)
  const deploySafe = useCallback(async (owners: string[], threshold: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // This is a placeholder - in a real implementation, you would:
      // 1. Use Safe SDK to create and deploy the Safe
      // 2. Wait for deployment transaction
      // 3. Get the deployed Safe address
      
      // For now, we'll simulate a deployment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock Safe address (in real implementation, this would come from deployment)
      const mockSafeAddress = `0x${Math.random().toString(16).slice(2, 42).padStart(40, '0')}`;
      
      const newConfig: SafeConfig = {
        safeAddress: mockSafeAddress,
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
      const info = await getSafeInfo(safeConfig.safeAddress, network);
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