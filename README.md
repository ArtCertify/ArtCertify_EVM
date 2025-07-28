# 🎨 ArtCertify Safe Wallet

A modern Web3 wallet built with **Safe Protocol Kit** and **Passkeys** for secure, gasless NFT minting and transactions.

## 🚀 Features

- **🔐 Passkey Authentication**: Secure wallet access using biometric authentication
- **🛡️ Safe Smart Wallet**: Built on Safe Protocol Kit for enhanced security
- **💸 Gasless Transactions**: Powered by Gelato for seamless user experience
- **🎯 Batch Operations**: Deploy Safe and add passkey owner in single transaction
- **📱 Cross-Platform**: Support for Web, iOS, and Android passkeys
- **🎨 Modern UI**: Clean, responsive interface with Tailwind CSS

## 🏗️ Architecture

The project follows a domain-driven architecture inspired by Zeal-Wallet:

```
src/
├── domains/
│   ├── Account/          # Account management
│   ├── Passkey/          # Passkey creation & authentication
│   ├── Safe/             # Safe wallet integration
│   ├── Storage/          # Local data persistence
│   └── Main/             # Main application components
├── lib/
│   └── toolkit/          # Utility functions & types
└── components/
    └── ui/               # Reusable UI components
```

## 📋 Prerequisites

- Node.js 18+ 
- Yarn or npm
- Modern browser with Passkey support

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ArtCertify_EVM
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
# Create .env file with:
VITE_GELATO_RELAY_API_KEY=your-gelato-relay-api-key-here
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://rpc.sepolia.org
VITE_DEMO_NFT_CONTRACT=0x1234567890123456789012345678901234567890
VITE_SAFE_VERSION=1.4.1
VITE_APP_NAME=ArtCertify
VITE_APP_DOMAIN=artcertify.com
```

4. Start the development server:
```bash
yarn dev
```

## 🌐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_GELATO_RELAY_API_KEY` | Gelato Relay API key for gasless transactions | `your-api-key` |
| `VITE_CHAIN_ID` | Ethereum chain ID (11155111 for Sepolia) | `11155111` |
| `VITE_RPC_URL` | RPC endpoint URL | `https://rpc.sepolia.org` |
| `VITE_DEMO_NFT_CONTRACT` | NFT contract address for testing | `0x123...` |
| `VITE_SAFE_VERSION` | Safe contracts version | `1.4.1` |
| `VITE_APP_DOMAIN` | App domain for passkey RP ID | `artcertify.com` |

## 🚀 Usage

### 1. Wallet Creation

The app guides users through a seamless onboarding process:

1. **Enter Username**: Choose a display name for your wallet
2. **Create Passkey**: Use biometric authentication to secure your wallet
3. **Deploy Safe**: Automatically deploy a Safe smart wallet
4. **Ready to Use**: Start making gasless transactions

### 2. Gasless Transactions

All transactions are sponsored by Gelato, providing a seamless user experience:

- **NFT Minting**: Mint NFTs without gas fees
- **Token Transfers**: Send tokens gaslessly
- **Smart Contract Interactions**: Execute any transaction without ETH

### 3. Batch Operations

The wallet supports batch operations for efficiency:

- **Safe Deployment + Passkey Setup**: Single transaction for wallet creation
- **Multiple Transactions**: Execute multiple operations in one go
- **Optimal Gas Usage**: Minimize transaction costs

## 📱 Passkey Support

The wallet supports passkeys across multiple platforms:

- **Web**: WebAuthn with hardware security keys
- **iOS**: Face ID, Touch ID
- **Android**: Biometric authentication
- **Desktop**: Windows Hello, macOS Touch ID

## 🛡️ Security Features

- **No Private Keys**: Uses passkeys instead of traditional seed phrases
- **Hardware Security**: Leverages device secure enclaves
- **Safe Protocol**: Built on battle-tested Safe smart contracts
- **Biometric Auth**: Secure authentication without passwords

## 🏗️ Key Components

### PasskeyModule
Handles passkey creation, authentication, and signing across platforms.

### SafeModule
Manages Safe wallet deployment, configuration, and transactions.

### GelatoModule  
Provides gasless transaction execution and batch operations.

### StorageModule
Manages local data persistence for accounts and settings.

## 📚 API Reference

### Creating a Wallet
```typescript
import { SafeModule } from './domains/Safe/safe';

const result = await SafeModule.createSafeWithPasskeyBatch(
  'username',
  'saltNonce'
);
```

### Executing Gasless Transactions
```typescript
import { SafeModule } from './domains/Safe/safe';

const result = await SafeModule.executeGaslessTransaction(
  safeAddress,
  transactions,
  credentialId
);
```

### Minting NFTs
```typescript
import { SafeModule } from './domains/Safe/safe';

const result = await SafeModule.mintNFTGasless(
  safeAddress,
  nftContractAddress,
  tokenId,
  credentialId
);
```

## 🧪 Testing

Run tests with:
```bash
yarn test
```

Run tests with UI:
```bash
yarn test:ui
```

## 🔨 Development

### Adding New Features

1. Create domain-specific modules in `src/domains/`
2. Add reusable components in `src/components/ui/`
3. Update types in respective domain folders
4. Add tests for new functionality

### Building for Production

```bash
yarn build
```

## 📦 Deployment

The app can be deployed to any static hosting service:

- **Netlify**: Connect repository for automatic deploys
- **Vercel**: Deploy with zero configuration
- **IPFS**: Decentralized hosting option
- **GitHub Pages**: Free hosting for public repositories

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Safe Protocol**: For secure smart wallet infrastructure
- **Gelato Network**: For gasless transaction relay
- **Zeal-Wallet**: For architectural inspiration
- **WebAuthn**: For passwordless authentication standards

---

Built with ❤️ for the Web3 community 