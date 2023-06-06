import './App.css';

import React from 'react';
import { useState, useEffect } from "react";
import { init, connectWallet, handleAccountsChanged } from "./ethers";
import AdditionalDescription from "./components/AdditionalDescription"

const { title, description, bannerImageUrl, passUrl, contractAddress } = window.REACT_APP_PROPERTIES;

function App() {

  useEffect(() => {
    init();
  
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        handleAccountsChanged(accounts);
      });
  
      window.ethereum.on("chainChanged", (_chainId) => window.location.reload());
    }
  }, []);

  return (
    <div className="app">
      <Banner />
      <Description />
      <div className="content-wrapper">
        <ImageCard />
        <AdditionalDescription />
      </div>  
      <Footer />
    </div>
  );
}

const Banner = () => {

  const [walletConnected, setWalletConnected] = useState(false);

  const handleConnectWallet = () => {
    connectWallet();
    setWalletConnected(true);
  };

  return (
    <div className="banner">
      <img src={bannerImageUrl} alt="Missing banner" />
      <h1 className="title">{title}</h1>
      <button onClick={handleConnectWallet} className="styled-button">
        Connect Wallet
      </button>
    </div>
  );
}

const Description = () => {
  return (
    <div className="description">
      <p>{description}</p>
    </div>
  );
}

const ImageCard = () => {
  return (
    <div className="image-card">
      <img src={passUrl} alt="Missing Pass" />
    </div>
  );
}

const Footer = () => {
  return (
    <footer className="footer">
      <img src={bannerImageUrl} alt="Footer Banner" />
      <p>&copy; 2023 Your Company. All rights reserved.</p>
    </footer>
  );
}

export default App;
