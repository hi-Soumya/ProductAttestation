import { ethers } from 'ethers';
const { EAS, SchemaEncoder } = window.eas;

export const connectSignProtocol = async (signer) => {
  // EAS contract address on Arbitrum Sepolia
  const EAS_CONTRACT_ADDRESS = "0xaEF4103A04090071165F78D45D83A0C0782c2B2a";
  
  // Arbitrum Sepolia RPC URL
  const ARBITRUM_SEPOLIA_RPC = "https://sepolia-rollup.arbitrum.io/rpc";

  // Create a new provider for Arbitrum Sepolia
  const provider = new ethers.providers.JsonRpcProvider(ARBITRUM_SEPOLIA_RPC);

  // Create a new EAS instance
  const eas = new EAS(EAS_CONTRACT_ADDRESS);

  // Connect EAS to the Arbitrum Sepolia provider
  eas.connect(provider);

  // If you have a signer, connect it as well
  if (signer) {
    eas.connectSigner(signer);
  }

  return eas;
};

// You might want to export SchemaEncoder for use in other parts of your app
export { SchemaEncoder };