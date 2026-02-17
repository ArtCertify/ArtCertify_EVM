/**
 * Stub for EVM: no JWT. Auth is handled by Privy.
 */
export const authService = {
  isTokenValid(): boolean {
    return true;
  },
  clearAllAuthData(_address?: string | null): void {},
};
