/**
 * Legge l'indirizzo wallet EVM da un oggetto User di Privy.
 * Controlla user.wallet (embedded), user.smartWallet e linkedAccounts (wallet/smart_wallet)
 * così che la UI possa proseguire non appena Privy espone l'indirizzo.
 */
export function getWalletAddressFromPrivyUser(user: {
  wallet?: { address?: string };
  smartWallet?: { address?: string };
  linkedAccounts?: Array<{ type: string; address?: string }>;
} | null | undefined): string | null {
  if (!user) return null;
  if (user.wallet?.address) return user.wallet.address as string;
  if (user.smartWallet?.address) return user.smartWallet.address as string;
  const walletAccount = user.linkedAccounts?.find(
    (a) => (a.type === 'wallet' || a.type === 'smart_wallet') && a.address
  );
  return (walletAccount?.address as string) ?? null;
}
