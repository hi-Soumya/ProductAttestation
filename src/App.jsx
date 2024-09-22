import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AttestationForm from './components/AttestationForm.jsx';
import AttestationList from './components/AttestationList.jsx';
import Notification from './components/Notification.jsx';
import './App.css';

function App() {
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    const initializeApp = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.BrowserProvider(window.ethereum);
          
          // Switch to Arbitrum Sepolia (chainId: 421614)
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x66eee' }],
            });
          } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0x66eee',
                    chainName: 'Arbitrum Sepolia',
                    nativeCurrency: {
                      name: 'Ethereum',
                      symbol: 'ETH',
                      decimals: 18
                    },
                    rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
                    blockExplorerUrls: ['https://sepolia-explorer.arbitrum.io/']
                  }
                ],
              });
            } else {
              throw switchError;
            }
          }
          
          const signer = await provider.getSigner();
          setSigner(signer);
          const address = await signer.getAddress();
          setAddress(address);

          console.log("Wallet connected successfully");

        } catch (error) {
          console.error('Failed to connect wallet:', error);
          setNotification({ message: 'Failed to connect: ' + error.message, type: 'error' });
        }
      } else {
        console.error('MetaMask not detected');
        setNotification({ message: 'MetaMask not detected. Please install MetaMask.', type: 'error' });
      }
    };

    initializeApp();
  }, []);

  return (
    <div className="App">
      <h1>Product Attestation with Sign Protocol API</h1>
      <Notification message={notification.message} type={notification.type} />
      {address ? (
        <>
          <p>Connected Address: {address}</p>
          {signer && (
            <>
              <AttestationForm signer={signer} setNotification={setNotification} />
              <AttestationList setNotification={setNotification} />
            </>
          )}
        </>
      ) : (
        <p>Please connect your wallet to use this app.</p>
      )}
    </div>
  );
}

export default App;