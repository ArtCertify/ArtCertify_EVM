import { network } from "hardhat";

async function main() {
  const { ethers, networkName } = await network.connect();
  let deployer = (await ethers.getSigners())[0];
  const privateKey =
    process.env.DEPLOYER_PRIVATE_KEY ||
    process.env.PRIVATE_KEY;
  if (!deployer && privateKey) {
    const { Wallet, JsonRpcProvider } = await import("ethers");
    const rpcUrl = process.env.VITE_BASE_RPC_URL || "https://mainnet.base.org";
    const provider = new JsonRpcProvider(rpcUrl);
    const key = privateKey.startsWith("0x") ? privateKey : "0x" + privateKey;
    deployer = new Wallet(key, provider);
  }
  if (!deployer?.address) {
    throw new Error(
      "Nessun account per il deploy. In .env.local imposta DEPLOYER_PRIVATE_KEY (o PRIVATE_KEY) con la chiave privata del wallet (con o senza 0x)."
    );
  }
  const owner = deployer.address;
  console.log(`Deploying ArtCertifySBT to ${networkName} with owner ${owner}...`);
  const sbt = await ethers.deployContract("ArtCertifySBT", [owner], deployer);
  await sbt.waitForDeployment();
  const address = await sbt.getAddress();
  console.log("ArtCertifySBT deployed to:", address);
  console.log("Set VITE_SBT_CONTRACT_ADDRESS=" + address);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
