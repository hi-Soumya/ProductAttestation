import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AttestationForm from './components/AttestationForm';
import AttestationList from './components/AttestationList';
import { connectSignProtocol } from './utils/signProtocol';
import './App.css';
import Notification from './components/Notification';


function App() {
  const [signer, setSigner] = useState(null);
  const [signSDK, setSignSDK] = useState(null);
  const [address, setAddress] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    const connectWallet = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          
          // Switch to Arbitrum Sepolia
          await provider.send("wallet_switchEthereumChain", [{ chainId: "0x66eee" }]);
          
          const signer = provider.getSigner();
          setSigner(signer);
          const address = await signer.getAddress();
          setAddress(address);
          const sdk = await connectSignProtocol(signer);
          setSignSDK(sdk);
        } catch (error) {
          console.error('Failed to connect wallet:', error);
        }
      } else {
        console.error('MetaMask not detected');
      }
    };

    connectWallet();
  }, []);

  return (
    <div className="App">
      <h1>Product Attestation with Sign Protocol</h1>
      <Notification message={notification.message} type={notification.type} />
      {address && <p>Connected Address: {address}</p>}
      {signer && signSDK ? (
        <>
          <AttestationForm signer={signer} signSDK={signSDK} />
          <AttestationList signSDK={signSDK} />
        </>
      ) : (
        <p>Please connect your wallet to use this app.</p>
      )}
    </div>
  );
}

export default App;