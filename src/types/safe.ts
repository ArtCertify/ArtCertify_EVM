export interface SafeConfig {
  safeAddress?: string;
  owners?: string[];
  threshold?: number;
  network?: string;
}

export interface SafeTransaction {
  to: string;
  value: string;
  data: string;
  operation?: number;
  safeTxGas?: number;
  baseGas?: number;
  gasPrice?: number;
  gasToken?: string;
  refundReceiver?: string;
  nonce?: number;
}

export interface SafeSignature {
  signer: string;
  data: string;
  isContractSignature?: boolean;
  staticPart?: string;
  dynamicPart?: string;
}

export interface SafeTransactionResponse {
  safeTxHash: string;
  transactionHash?: string;
  blockHash?: string;
  blockNumber?: number;
  transactionIndex?: number;
  confirmations?: SafeSignature[];
  isExecuted?: boolean;
  isSuccessful?: boolean;
  executionDate?: string;
  submissionDate?: string;
  gasUsed?: number;
  gasPrice?: string;
  gasToken?: string;
  refundReceiver?: string;
  fee?: string;
  origin?: string;
  dataDecoded?: any;
  confirmationsRequired?: number;
  executor?: string;
  value?: string;
  data?: string;
  operation?: number;
  safeTxGas?: number;
  baseGas?: number;
  nonce?: number;
  to?: string;
}

export interface SafeInfo {
  address: string;
  nonce: number;
  threshold: number;
  owners: string[];
  masterCopy: string;
  modules: string[];
  fallbackHandler: string;
  guard: string;
  version: string;
  collectiblesTag: string;
  txQueuedTag: string;
  txHistoryTag: string;
  messagesTag: string;
} 