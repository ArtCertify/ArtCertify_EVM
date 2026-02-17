import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  DocumentDuplicateIcon,
  ArrowTopRightOnSquareIcon,
  KeyIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { usePrivy, useWallets, useSendTransaction } from '@privy-io/react-auth';
import { parseEther, formatEther, isAddress } from 'viem';
import { base } from 'viem/chains';
import { useAuth } from '../../contexts/AuthContext';
import { getAddressExplorerUrl, getTransactionExplorerUrl } from '../../config/environment';
import { publicClient } from '../../services/baseContract';

const ETH_LOGO_SVG = (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden>
    <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0zM4.58 11.155L11.943 6.805v11.03L4.58 11.154zm7.365 11.03V6.805l7.365 4.35-7.365 11.03z" />
  </svg>
);

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { userAddress } = useAuth();
  const { user, exportWallet } = usePrivy();
  const { wallets } = useWallets();
  const { sendTransaction: privySendTransaction } = useSendTransaction();

  const [copied, setCopied] = useState(false);
  const [balanceWei, setBalanceWei] = useState<bigint>(0n);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [sendTo, setSendTo] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sendStatus, setSendStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendTxHash, setSendTxHash] = useState<string | null>(null);

  const hasEmbeddedWallet = !!user?.wallet?.address;
  const balanceEth = balanceWei ? formatEther(balanceWei) : '0';

  useEffect(() => {
    if (!userAddress || !isOpen) return;
    setBalanceLoading(true);
    publicClient
      .getBalance({ address: userAddress as `0x${string}` })
      .then(setBalanceWei)
      .catch(() => setBalanceWei(0n))
      .finally(() => setBalanceLoading(false));
  }, [userAddress, isOpen]);

  const handleCopyAddress = async () => {
    if (!userAddress) return;
    try {
      await navigator.clipboard.writeText(userAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleExportWallet = () => {
    onClose();
    exportWallet();
  };

  const handleMaxAmount = () => {
    setSendAmount(balanceEth);
  };

  const handleSendFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    const wallet = wallets[0];
    if (!wallet || !userAddress) return;
    const to = sendTo.trim();
    const amountStr = sendAmount.trim().replace(',', '.');
    if (!to || !amountStr) {
      setSendError('Inserisci indirizzo e importo.');
      setSendStatus('error');
      return;
    }
    if (!isAddress(to)) {
      setSendError('Indirizzo destinatario non valido.');
      setSendStatus('error');
      return;
    }
    let valueWei: bigint;
    try {
      valueWei = parseEther(amountStr);
    } catch {
      setSendError('Importo non valido.');
      setSendStatus('error');
      return;
    }
    if (valueWei <= 0n) {
      setSendError("L'importo deve essere maggiore di zero.");
      setSendStatus('error');
      return;
    }
    if (valueWei > balanceWei) {
      setSendError('Saldo insufficiente.');
      setSendStatus('error');
      return;
    }
    setSendError(null);
    setSendStatus('pending');
    setSendTxHash(null);
    try {
      const result = await privySendTransaction(
        {
          to: to as `0x${string}`,
          value: valueWei,
          chainId: base.id,
        },
        { address: wallet.address as `0x${string}` }
      );
      const hash = typeof result === 'object' && result?.hash ? result.hash : (result as unknown as string);
      setSendTxHash(hash ? String(hash) : null);
      setSendStatus('success');
      setSendTo('');
      setSendAmount('');
      setBalanceWei((prev) => prev - valueWei);
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Invio fallito.');
      setSendStatus('error');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-slate-800 border border-slate-700 shadow-xl transition-all">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
                  <Dialog.Title as="h2" className="text-lg font-semibold text-white">
                    Il mio wallet
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    onClick={onClose}
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="px-6 py-4 space-y-5">
                  {/* Indirizzo (Base) */}
                  <div>
                    <p className="text-xs font-medium text-slate-400 mb-1.5">Indirizzo (Base)</p>
                    <div className="flex items-center gap-2">
                      <code
                        className="flex-1 text-sm text-slate-300 bg-slate-900/80 rounded-lg px-3 py-2 truncate border border-slate-700"
                        title={userAddress ?? ''}
                      >
                        {userAddress ?? '—'}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyAddress}
                        className="shrink-0 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                        title="Copia indirizzo"
                      >
                        <DocumentDuplicateIcon className="w-5 h-5" />
                      </button>
                    </div>
                    {copied && <p className="text-xs text-green-400 mt-1">Copiato!</p>}
                    <div className="flex flex-wrap gap-3 mt-2">
                      <a
                        href={userAddress ? getAddressExplorerUrl(userAddress) : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white"
                      >
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        Apri su BaseScan
                      </a>
                      {hasEmbeddedWallet && (
                        <button
                          type="button"
                          onClick={handleExportWallet}
                          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white"
                        >
                          <KeyIcon className="w-4 h-4" />
                          Esporta wallet
                        </button>
                      )}
                    </div>
                    {hasEmbeddedWallet && (
                      <p className="text-xs text-slate-500 mt-1.5">
                        Esporta la chiave per usare questo wallet in MetaMask o altri client.
                      </p>
                    )}
                  </div>

                  {/* Invia ETH: balance + form */}
                  <div className="pt-4 border-t border-slate-700">
                    <p className="text-xs font-medium text-slate-400 mb-2">Invia ETH (Base)</p>
                    {/* Balance con logo ETH e Max */}
                    <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-900/80 border border-slate-700 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300">{ETH_LOGO_SVG}</span>
                        <div>
                          <p className="text-xs text-slate-500">Disponibile</p>
                          <p className="text-base font-semibold text-white tabular-nums">
                            {balanceLoading ? '…' : `${Number(balanceEth).toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 6 })} ETH`}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleMaxAmount}
                        disabled={balanceLoading || balanceWei === 0n}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Max
                      </button>
                    </div>

                    <form onSubmit={handleSendFunds} className="space-y-3">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Indirizzo destinatario</label>
                        <input
                          type="text"
                          placeholder="0x..."
                          value={sendTo}
                          onChange={(e) => setSendTo(e.target.value)}
                          className="w-full rounded-lg px-3 py-2 text-sm bg-slate-900/80 border border-slate-600 text-white placeholder-slate-500 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Importo (ETH)</label>
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder="0"
                          value={sendAmount}
                          onChange={(e) => setSendAmount(e.target.value)}
                          className="w-full rounded-lg px-3 py-2 text-sm bg-slate-900/80 border border-slate-600 text-white placeholder-slate-500 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={sendStatus === 'pending' || !wallets[0]}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium bg-slate-600 hover:bg-slate-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sendStatus === 'pending' ? (
                          'Invio in corso...'
                        ) : (
                          <>
                            <PaperAirplaneIcon className="w-4 h-4" />
                            Invia ETH
                          </>
                        )}
                      </button>
                      {sendStatus === 'error' && sendError && (
                        <p className="text-sm text-red-400">{sendError}</p>
                      )}
                      {sendStatus === 'success' && sendTxHash && (
                        <a
                          href={getTransactionExplorerUrl(sendTxHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-green-400 hover:text-green-300"
                        >
                          Transazione inviata – Apri su BaseScan
                          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        </a>
                      )}
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
