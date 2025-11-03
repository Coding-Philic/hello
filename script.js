import { contractAddress, contractABI } from "./constant.js";

let provider;
let signer;
let contract;
let currentAddress;

const connectBtn = document.getElementById("connectBtn");
const walletInfo = document.getElementById("walletInfo");
const walletAddressEl = document.getElementById("walletAddress");
const roleSection = document.getElementById("roleSection");

connectBtn.addEventListener("click", connectWallet);

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
    roleSection.classList.remove("hidden");

    contract = new ethers.Contract(contractAddress, contractABI, signer);

    console.log("✅ Connected:", currentAddress);
    console.log("🔗 Contract Loaded:", contractAddress);
  } catch (err) {
    console.error(err);
    alert("❌ Connection failed: " + err.message);
  }
}

// ===== Role Selection Logic =====
const roleButtons = document.querySelectorAll(".role-btn");

roleButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const role = btn.dataset.role;
    handleRoleSelection(role);
  });
});

function handleRoleSelection(role) {
  console.log("Role selected:", role);

  if (role === "admin") {
    window.location.href = "admin.html";
  } else if (role === "user") {
    window.location.href = "user.html";
  } else if (role === "visitor") {
    alert("👋 Welcome Visitor! You can explore public information only.");
  } else {
    alert("❌ Unknown role selected!");
  }
}

