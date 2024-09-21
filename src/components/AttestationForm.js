import React, { useState } from 'react';
import { ethers } from 'ethers';

const SCHEMA_UID = '0xf7'; // Replace with your actual schema UID

function AttestationForm({ signer, signSDK }) {
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
      const encodedData = ethers.utils.defaultAbiCoder.encode(
        ['string', 'string', 'string'],
        [formData.instagramAccount, formData.productName, formData.attestationId]
      );

      const tx = await signSDK.attest({
        schema: SCHEMA_UID,
        data: {
          recipient: await signer.getAddress(),
          expirationTime: 0,
          revocable: true,
          data: encodedData,
        },
      });

      const newAttestationUID = await tx.wait();

      console.log('Attestation created:', newAttestationUID);
      alert(`Product attested successfully! Attestation UID: ${newAttestationUID}`);
      setFormData({ instagramAccount: '', productName: '', attestationId: '' });
    } catch (error) {
      console.error('Error attesting product:', error);
      alert('Error attesting product. Check console for details.');
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