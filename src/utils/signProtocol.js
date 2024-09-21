import { ethers } from 'ethers';
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

export const connectSignProtocol = async (signer) => {
  // EAS contract address on Arbitrum Sepolia
  const EAS_CONTRACT_ADDRESS = "0xaEF4103A04090071165F78D45D83A0C0782c2B2a";
  
  // Create a new EAS instance
  const eas = new EAS(EAS_CONTRACT_ADDRESS);

  // Connect EAS to the signer
  eas.connect(signer);

  return eas;
};

// You might want to export SchemaEncoder for use in other parts of your app
export { SchemaEncoder };