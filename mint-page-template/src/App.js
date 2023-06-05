import './App.css';

import React from 'react';
import { useState, useEffect } from "react";
import { init, connectWallet, handleAccountsChanged } from "./ethers";
import AdditionalDescription from "./components/AdditionalDescription"

// const { title, description, bannerImageUrl, passUrl } = window.REACT_APP_PROPERTIES;

const { title, description, bannerImageUrl, passUrl } = { 
  title: "client1", 
  description: "Client1 Collection",
  bannerImageUrl: "client1/Client1 Collection/banner_image.jpeg",
  passUrl: "client1/Client1 Collection/pass_image.jpeg"
};

function App() {

  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    init();
  
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        handleAccountsChanged(accounts);
      });
  
      window.ethereum.on("chainChanged", (_chainId) => window.location.reload());
    }
  }, []);


  const handleConnectWallet = () => {
    connectWallet();
    setWalletConnected(true);
  };

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
  return (
    <div className="banner">
      <img src={bannerImageUrl} alt="Missing banner" />
      <h1 className="title">{title}</h1>
      <button onClick={handleConnectWallet} className="styled-button" disabled={!isValidNumTokens}>
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
