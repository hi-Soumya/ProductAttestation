import React, { useState } from 'react';
import axios from 'axios';

const SCHEMA_UID = 'onchain_evm_421614_0xf6'; 
const API_BASE_URL = 'https://testnet-scan.sign.global/schema/onchain_evm_421614_0xf6';

function AttestationForm({ signer, setNotification }) {
  const [formData, setFormData] = useState({
    instagramAccount: '',
    productName: '',
    attestationId: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const signerAddress = await signer.getAddress();
      
      // Prepare the message to be signed
      const message = JSON.stringify({
        schema: SCHEMA_UID,
        data: {
          instagramAccountHandle: formData.instagramAccount,
          productName: formData.productName,
          attestationId: formData.attestationId,
        },
        recipient: signerAddress,
      });

      // Sign the message
      const signature = await signer.signMessage(message);

      // Make the API call
      const response = await axios.post(`${API_BASE_URL}/v1/attestations`, {
        message: message,
        signature: signature,
      });

      console.log('Attestation created:', response.data);
      setNotification({ message: `Product attested successfully! Transaction hash: ${response.data.transactionHash}`, type: 'success' });
      setFormData({ instagramAccount: '', productName: '', attestationId: '' });
    } catch (error) {
      console.error('Error attesting product:', error);
      setNotification({ message: 'Error attesting product: ' + error.message, type: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="instagramAccount"
        value={formData.instagramAccount}
        onChange={handleChange}
        placeholder="Instagram Account"
        required
      />
      <input
        type="text"
        name="productName"
        value={formData.productName}
        onChange={handleChange}
        placeholder="Product Name"
        required
      />
      <input
        type="text"
        name="attestationId"
        value={formData.attestationId}
        onChange={handleChange}
        placeholder="Attestation ID"
        required
      />
      <button type="submit">Attest Product</button>
    </form>
  );
}

export default AttestationForm;
