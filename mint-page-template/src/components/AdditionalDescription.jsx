import React, { useState, useEffect } from "react";
import { mintTokens } from "../ethers";

const AdditionalDescription = () => {
  const [numTokens, setNumTokens] = useState(1);
  const [mintedTokens, setMintedTokens] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);

  useEffect(() => {
    async function fetchContractData() {
      const totalSupply = await contract._maxSupply(); // Use your contract instance
      const mintedTokens = await contract.getNumberOfMinted();
      
      setTotalSupply(totalSupply);
      setMintedTokens(mintedTokens);
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
      await mintTokens(numTokens);
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
