import { useState, useCallback } from 'react';
import { useWallets, useSendTransaction } from '@privy-io/react-auth';
import { encodeFunctionData, type Address } from 'viem';
import { base } from 'viem/chains';
import { useAuth } from '../contexts/AuthContext';
import { getSbtContractAddress, getTotalSupply, invalidateContractCache, publicClient } from '../services/baseContract';
import { ArtCertifySBTAbi } from '../abis/ArtCertifySBT';

type StepState = 'pending' | 'active' | 'success' | 'error';

export interface CertificationStep {
  id: string;
  title: string;
  description: string;
  state: StepState;
  error?: string;
  result?: unknown;
  details?: string;
}

export interface PeraCertificationFlowParams {
  certificationData?: {
    title?: string;
    author?: string;
    creation_date?: string;
    organization?: { name?: string; code?: string; type?: string; city?: string };
    technical_specs?: Record<string, string | number>;
    asset_type?: string;
    unique_id?: string;
    [key: string]: unknown;
  };
  files: File[];
  assetName: string;
  unitName?: string;
  formData?: unknown;
  projectName?: string;
  description?: string;
  fileOrigin?: string;
  type?: string;
  customType?: string;
  organizationData?: unknown;
}

const INITIAL_STEPS: CertificationStep[] = [
  { id: 'ipfs-upload', title: 'Upload IPFS', description: 'Caricamento metadata su IPFS', state: 'pending' },
  { id: 'mint-sbt', title: 'Mint SBT', description: 'Registrazione certificato on-chain (Base)', state: 'pending' },
];

export interface CertificationFlowResult {
  tokenId: number;
  txHash: string;
  assetId?: number;
  txId?: string;
  metadataCid?: string;
  newMetadataCid?: string;
  metadataUrl?: string;
  confirmedRound?: number;
  [key: string]: unknown;
}

export const useBaseCertificationFlow = () => {
  const { userAddress, isAuthenticated } = useAuth();
  const { wallets } = useWallets();
  const { sendTransaction: privySendTransaction } = useSendTransaction();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<CertificationFlowResult | null>(null);
  const [steps, setSteps] = useState<CertificationStep[]>(INITIAL_STEPS);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSteps(INITIAL_STEPS);
    setResult(null);
  }, []);

  const startCertificationFlow = useCallback(async (params: PeraCertificationFlowParams) => {
    if (!userAddress) {
      throw new Error('Connetti il wallet per certificare.');
    }
    setIsModalOpen(true);
    setIsProcessing(true);
    setResult(null);
    setSteps((prev) =>
      prev.map((s) => (s.id === 'ipfs-upload' ? { ...s, state: 'active' as StepState } : s))
    );

    let tokenURI = '';
    let metadataCid = '';

    try {
      // Step 1: Upload logo/primary image to IPFS if present (es. organizzazione)
      const IPFSService = (await import('../services/ipfsService')).default;
      const ipfs = new IPFSService();
      const cert = params.certificationData || {};
      const description =
        (cert.technical_specs && (cert.technical_specs as Record<string, string>).description) ||
        params.description ||
        '';
      let imageUrl = '';
      const firstFile = params.files?.[0];
      if (firstFile && firstFile.type.startsWith('image/')) {
        const fileRes = await ipfs.uploadFile(firstFile, {
          name: `org_logo_${firstFile.name}`,
          keyvalues: { type: 'organization_logo' },
        });
        imageUrl = `ipfs://${fileRes.IpfsHash}`;
      }
      const metadata = {
        name: params.assetName,
        description,
        image: imageUrl,
        certification_data: cert,
      };
      const uploadRes = await ipfs.uploadJSON(metadata);
      metadataCid = uploadRes.IpfsHash;
      tokenURI = `ipfs://${metadataCid}`;

      setSteps((prev) =>
        prev.map((s) =>
          s.id === 'ipfs-upload' ? { ...s, state: 'success' as StepState } : s
        )
      );
      setSteps((prev) =>
        prev.map((s) => (s.id === 'mint-sbt' ? { ...s, state: 'active' as StepState } : s))
      );

      // Step 2: Mint SBT (usa useSendTransaction di Privy per compatibilità con smart wallet / embedded)
      const wallet = wallets[0];
      if (!wallet) {
        throw new Error('Nessun wallet collegato. Collega un wallet (es. MetaMask) e riprova.');
      }
      await wallet.switchChain(base.id);

      // Leggi totalSupply prima del mint per evitare getTotalSupply dopo (limita 429 e fallimenti)
      const supplyBefore = await getTotalSupply();
      const contractAddress = getSbtContractAddress();
      const data = encodeFunctionData({
        abi: ArtCertifySBTAbi,
        functionName: 'mint',
        args: [userAddress as Address, tokenURI],
      });
      const result = await privySendTransaction(
        {
          to: contractAddress as `0x${string}`,
          data,
          value: 0n,
          chainId: base.id,
        },
        { address: wallet.address }
      );
      const hashRaw = typeof result === 'object' && result?.hash ? result.hash : (result as unknown as string);
      const hash = hashRaw ? (typeof hashRaw === 'string' ? hashRaw : String(hashRaw)) : '';
      if (!hash) throw new Error('Transazione non inviata.');
      await publicClient.waitForTransactionReceipt({ hash: hash as `0x${string}` });
      const tokenId = Number(supplyBefore) + 1;

      setSteps((prev) =>
        prev.map((s) =>
          s.id === 'mint-sbt' ? { ...s, state: 'success' as StepState } : s
        )
      );
      const flowResult: CertificationFlowResult = {
        tokenId,
        txHash: hash,
        assetId: tokenId,
        txId: hash,
        metadataCid,
      };
      setResult(flowResult);
      invalidateContractCache();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const stepId = tokenURI ? 'mint-sbt' : 'ipfs-upload';
      setSteps((prev) =>
        prev.map((s) =>
          s.id === stepId ? { ...s, state: 'error' as StepState, error: message } : s
        )
      );
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [userAddress, wallets, privySendTransaction]);

  const retryStep = useCallback((_stepId: string) => {
    setSteps(INITIAL_STEPS);
  }, []);

  const startVersioningFlow = useCallback(
    async (params: {
      tokenId?: number | string;
      assetId?: number | string;
      customJson?: Record<string, unknown>;
      newCertificationData?: unknown;
      [key: string]: unknown;
    }) => {
      const tokenId = params.tokenId ?? params.assetId ?? params.existingAssetId;
      if (tokenId == null || tokenId === '') throw new Error('tokenId o assetId richiesto per aggiornare metadati.');
      const json = params.customJson ?? params.newCertificationData;
      if (!json || typeof json !== 'object') throw new Error('Dati certificato (customJson) richiesti.');

      const wallet = wallets[0];
      if (!wallet || !userAddress) throw new Error('Connetti il wallet per aggiornare i metadati.');
      await wallet.switchChain(base.id);

      const IPFSService = (await import('../services/ipfsService')).default;
      const ipfs = new IPFSService();
      const uploadRes = await ipfs.uploadJSON(json as Record<string, unknown>);
      const newUri = `ipfs://${uploadRes.IpfsHash}`;

      const contractAddress = getSbtContractAddress();
      const data = encodeFunctionData({
        abi: ArtCertifySBTAbi,
        functionName: 'setTokenURI',
        args: [BigInt(Number(tokenId)), newUri],
      });
      const result = await privySendTransaction(
        {
          to: contractAddress as `0x${string}`,
          data,
          value: 0n,
          chainId: base.id,
        },
        { address: wallet.address }
      );
      const hashRaw = typeof result === 'object' && result?.hash ? result.hash : (result as unknown as string);
      const hash = hashRaw ? (typeof hashRaw === 'string' ? hashRaw : String(hashRaw)) : '';
      if (!hash) throw new Error('Transazione non inviata.');
      await publicClient.waitForTransactionReceipt({ hash: hash as `0x${string}` });
      invalidateContractCache();
      return {
        txHash: hash,
        txId: hash,
        newMetadataCid: uploadRes.IpfsHash,
        metadataUrl: newUri,
      };
    },
    [userAddress, wallets, privySendTransaction]
  );

  return {
    isModalOpen,
    isProcessing,
    result,
    steps,
    startCertificationFlow,
    startVersioningFlow,
    retryStep,
    closeModal,
    isWalletConnected: isAuthenticated && !!userAddress,
    walletAddress: userAddress ?? undefined,
  };
};
