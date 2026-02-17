/**
 * Stub: validazione wallet. Su Base non usiamo ALGO; consideriamo sempre il wallet abilitato.
 */
export function useWalletValidation(_requiredBalance?: number): {
  isValid: boolean;
  needsNetworkSwitch: boolean;
  networkName: string;
  canPerformCertification: boolean;
  isEmptyAccount: boolean;
  hasMinimumFunds: boolean;
  balance: number;
  isLoading: boolean;
  refetch: () => Promise<void>;
} {
  return {
    isValid: true,
    needsNetworkSwitch: false,
    networkName: 'Base',
    canPerformCertification: true,
    isEmptyAccount: false,
    hasMinimumFunds: true,
    balance: 0,
    isLoading: false,
    refetch: async () => {},
  };
}
