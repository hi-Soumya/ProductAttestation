import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AttestationForm from './components/AttestationForm.jsx';
import AttestationList from './components/AttestationList.jsx';
import { connectSignProtocol } from './utils/signProtocol.js';
import './App.css';
import Notification from './components/Notification.jsx';

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
          const provider = new ethers.BrowserProvider(window.ethereum);
          
          // Switch to Arbitrum Sepolia
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x66eee' }],
            });
          } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
              try {
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
              } catch (addError) {
                throw new Error("Failed to add Arbitrum Sepolia network");
              }
            } else {
              throw switchError;
            }
          }
          
          const signer = await provider.getSigner();
          setSigner(signer);
          const address = await signer.getAddress();
          setAddress(address);
          const sdk = await connectSignProtocol(signer);
          setSignSDK(sdk);
        } catch (error) {
          console.error('Failed to connect wallet:', error);
          setNotification({ message: 'Failed to connect wallet: ' + error.message, type: 'error' });
        }
      } else {
        console.error('MetaMask not detected');
        setNotification({ message: 'MetaMask not detected. Please install MetaMask.', type: 'error' });
      }
    };

    connectWallet();
  }, []);

  return (
    <div className="App">
      <h1>Product Attestation with Sign Protocol</h1>
      <Notification message={notification.message} type={notification.type} />
      {address ? (
        <>
          <p>Connected Address: {address}</p>
          {signer && signSDK && (
            <>
              <AttestationForm signer={signer} signSDK={signSDK} setNotification={setNotification} />
              <AttestationList signSDK={signSDK} setNotification={setNotification} />
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