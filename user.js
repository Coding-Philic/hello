import { contractAddress, contractABI } from "./constant.js";

let provider, signer, contract, currentAddress;

const connectBtn = document.getElementById("connectBtn");
const walletInfo = document.getElementById("walletInfo");
const walletAddressEl = document.getElementById("walletAddress");
const recordSection = document.getElementById("recordSection");
const refreshBtn = document.getElementById("refreshBtn");

connectBtn.addEventListener("click", connectWallet);
refreshBtn.addEventListener("click", loadMyRecord);

async function connectWallet() {
  try {
    if (!window.ethereum) {
      alert("🦊 MetaMask nahi mila — please install MetaMask.");
      return;
    }

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    currentAddress = await signer.getAddress();

    walletAddressEl.textContent = `${currentAddress.slice(0,6)}...${currentAddress.slice(-4)}`;
    walletInfo.classList.remove("hidden");
    connectBtn.textContent = "Connected ✅";

    contract = new ethers.Contract(contractAddress, contractABI, signer);
    await loadMyRecord(); // auto-load user record
  } catch (err) {
    console.error(err);
    alert("❌ Connection failed: " + err.message);
  }
}

async function loadMyRecord() {
  try {
    const [eligible, score, name] = await contract.checkMyEligibility();

    document.getElementById("userName").textContent = name;
    document.getElementById("userScore").textContent = score;
    document.getElementById("userEligible").textContent = eligible ? "✅ Eligible" : "❌ Not Eligible";
    recordSection.classList.remove("hidden");
  } catch (err) {
    console.error(err);
    alert("⚠️ Record load failed: " + err.message);
  }
}
