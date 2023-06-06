import React, { useState, useEffect } from "react";
import { mintTokens, fetchCollectiontProperties } from "../ethers";


const { ...contractAddress } = window.REACT_APP_PROPERTIES;

const AdditionalDescription = () => {
  const [numTokens, setNumTokens] = useState(1);
  const [mintedTokens, setMintedTokens] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    async function fetchContractData() {
      const { name, symbol, totalMinted, price, totalSupply } = await fetchCollectiontProperties(contractAddress);
      
      setTotalSupply(totalSupply);
      setMintedTokens(totalMinted);
      setPrice(price);
    }
    
    fetchContractData();
  }, []);

  const handleDecrement = () => {
    setNumTokens((prev) => Math.max(1, prev - 1)); // Prevent going below 1
  };

  const handleIncrement = () => {
    setNumTokens((prev) => prev + 1);
  };

  const handleMint = async () => {
    try {
      await mintTokens(numTokens, price);
      setMintedTokens(mintedTokens + numTokens);
    } catch (error) {
      console.error("Failed to mint tokens:", error);
    }
  };

  const isValidNumTokens = Number.isInteger(numTokens) && numTokens > 0 && numTokens <= (totalSupply - mintedTokens);

  return (
    <div className="additional-description">
      <button onClick={handleDecrement}>-</button>
      <input
        type="text"
        value={numTokens}
        onChange={(e) => setNumTokens(Number(e.target.value))}
      />
      <button onClick={handleIncrement}>+</button>
      <button onClick={handleMint} className="styled-button" disabled={!isValidNumTokens}>
        Mint
      </button>
      <div>
        Minted Tokens: {mintedTokens} / {totalSupply}
      </div>
    </div>
  );
};

export default AdditionalDescription;
