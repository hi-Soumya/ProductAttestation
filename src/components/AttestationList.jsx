import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SCHEMA_UID = 'onchain_evm_421614_0xf6'; // Make sure this matches your schema UID
const API_BASE_URL = 'https://testnets-api.sign.global';

function AttestationList({ setNotification }) {
  const [attestations, setAttestations] = useState([]);

  useEffect(() => {
    const fetchAttestations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/v1/attestations?schema=${SCHEMA_UID}`);
        setAttestations(response.data);
      } catch (error) {
        console.error('Error fetching attestations:', error);
        setNotification({ message: 'Error fetching attestations: ' + error.message, type: 'error' });
      }
    };

    fetchAttestations();
  }, [setNotification]);

  return (
    <div>
      <h2>Recent Attestations</h2>
      <ul>
        {attestations.map((attestation) => (
          <li key={attestation.id}>
            {attestation.data.productName} by {attestation.data.instagramAccountHandle} (ID: {attestation.data.attestationId})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AttestationList;