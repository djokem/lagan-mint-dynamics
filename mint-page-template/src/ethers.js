import LaganNFTABI from "./contract/LaganNFTABI.json";
import { ethers } from "ethers";

const contractAddress = "0x8fFABB614ABAddF4B5221ef14F973857383d3fAc";
const collectionAbi = LaganNFTABI;

let provider = null;
let signer = null;
let contract = null;
let accountAddress = null;
let network = {};

export async function init() {
  // create a new provider object
  provider = new ethers.providers.Web3Provider(window.ethereum, "any"); // if we want to allow any network
  // provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`);

  // create a new contract object
  contract = new ethers.Contract(contractAddress, collectionAbi, provider);
  // get network info
  await getNetwork();
}

export async function connectWallet() {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    // request access to the user's accounts
    await window.ethereum.enable();

    // create a new signer object
    signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();

    // fetch signer address
    await getAddress();
  } else {
    alert("Please install Metamask to use this feature!");
  }
}

export function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    window.location.reload();
    // or reset all relevant state

  } else if (accounts[0] !== accountAddress) {
    accountAddress = accounts[0];
  }
}

export async function getNetwork() {
  if (provider) {
    network = await provider.getNetwork();
  }
}

export async function getAddress() {
  if (signer) {
    accountAddress = await getContract().signer.getAddress();
  }
}

export function getContract() {
  return contract.connect(signer);
}

 
export async function fetchBalance() {
  if (accountAddress !== null && network.name === "sepolia") {
    const balance = await provider.getBalance(accountAddress);
    return balance.toString();
  }
}

export async function fetchOwner() {
  if (contractAddress !== null && network.name === "sepolia") {
    const owner = await contract.owner();
    console.log("Owner:", owner);
  }
}

export async function fetchCollectiontProperties(collectionAddress) {
  // create a new contract object
  const collectionContract = new ethers.Contract(collectionAddress, collectionAbi, provider);

  const [name, symbol, totalMinted, price, totalSupply] = await Promise.all([
    collectionContract.name(),
    collectionContract.symbol(),
    collectionContract.getNumberOfMinted(),
    collectionContract._price(),
    collectionContract._totalSupply(),
  ]);
  return { name, symbol, totalMinted, price, totalSupply };

}

export async function mintTokens(amount, price) {
    if (!signer) {
        console.error("Wallet is not connected");
        return;
    }

    if (!contract) {
        console.error("Contract is not initialized");
        return;
    }

    const mintingCost = ethers.BigNumber.from(price).mul(amount);  // Calculate total minting cost
    let overrides = {
        value: mintingCost  // Pay the minting cost
    };

    // TODO: change to minting multiple using one call to ERC721A
    try {
        for (let i = 0; i < amount; i++) {
            const tx = await getContract().mint(accountAddress, overrides);
            await tx.wait();  // Wait for the transaction to be mined
        }

        console.log(`Successfully minted ${amount} tokens!`);
    } catch (error) {
        console.error("Failed to mint tokens:", error);
    }
}
