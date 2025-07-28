// EVM/Ethereum Asset Types

export interface EVMAsset {
  id: string;
  name: string;
  description: string;
  tokenId?: string;
  contractAddress?: string;
  chainId: number;
  creator: string;
  owner: string;
  creationDate: number;
  lastModified: number;
  status: 'Certificato' | 'In Revisione' | 'Scaduto';
  currentVersion: number;
  versions: AssetVersion[];
  attachments: AttachmentInfo[];
  metadata: AssetMetadata;
}

export interface AssetVersion {
  version: number;
  transactionHash: string;
  blockNumber: number;
  timestamp: number;
  gasUsed?: number;
  changes?: string[];
  userOperationHash?: string; // For Account Abstraction
}

export interface AssetMetadata {
  ipfsHash?: string;
  arweaveHash?: string;
  image?: string;
  externalUrl?: string;
  attributes?: AssetAttribute[];
}

export interface AssetAttribute {
  trait_type: string;
  value: string | number;
  display_type?: string;
}

export interface AttachmentInfo {
  name: string;
  type: string;
  size?: string;
  url?: string;
  ipfsHash?: string;
  description?: string;
}

export interface SmartContractInfo {
  address: string;
  chainId: number;
  abi?: any[];
  bytecode?: string;
  deploymentTx?: string;
}

// Account Abstraction specific types
export interface UserOperation {
  sender: string;
  nonce: string;
  initCode: string;
  callData: string;
  callGasLimit: string;
  verificationGasLimit: string;
  preVerificationGas: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  paymasterAndData: string;
  signature: string;
}

export interface SmartAccountInfo {
  address: string;
  chainId: number;
  accountType: 'safe' | 'kernel' | 'simple';
  owners: string[];
  threshold?: number;
  modules?: string[];
  isDeployed: boolean;
} 