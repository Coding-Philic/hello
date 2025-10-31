import { ethers } from "./ethers-5.6.esm.min.js"; // ✅ good - ethers v5 ESM import
import { contractABI, contractAddress } from "./constants.js"; // ✅ correct if file name is constants.js

const connectButton = document.getElementById("connectButton");
const message = document.getElementById("message");

connectButton.onclick = connect;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      // ✅ Request MetaMask connection
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();

      message.innerText = `✅ Wallet connected successfully!\nAddress: ${userAddress}`;
      console.log("Connected wallet:", userAddress);

    } catch (error) {
      console.error("❌ Connection failed:", error);
      message.innerText = "❌ Connection failed!";
    }
  } else {
    message.innerText = "🦊 Please install MetaMask!";
  }
}
