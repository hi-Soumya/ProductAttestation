import React, { useState, useEffect } from 'react';

function AttestationList({ signSDK }) {
  const [attestations, setAttestations] = useState([]);

  useEffect(() => {
    const fetchAttestations = async () => {
      try {
        const filter = await signSDK.getSchemaAttestations({
          schemaUID: '0xf7', // Replace with your actual schema UID
        });

        const fetchedAttestations = await Promise.all(
          filter.map(async (attestation) => {
            const decodedData = signSDK.decodeData(attestation.data);
            return {
              uid: attestation.uid,
              data: decodedData,
            };
          })
        );

        setAttestations(fetchedAttestations);
      } catch (error) {
        console.error('Error fetching attestations:', error);
      }
    };

    if (signSDK) {
      fetchAttestations();
    }
  }, [signSDK]);

  return (
    <div>
      <h2>Recent Attestations</h2>
      <ul>
        {attestations.map((attestation) => (
          <li key={attestation.uid}>
            {attestation.data[1]} by {attestation.data[0]} (ID: {attestation.data[2]})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AttestationList;