import { contractAddress, contractABI } from "./constant.js";

let provider, signer, contract;

window.addEventListener("DOMContentLoaded", async () => {
  if (!window.ethereum) {
    alert("🦊 MetaMask not found — please install it.");
    return;
  }

  provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
  contract = new ethers.Contract(contractAddress, contractABI, signer);

  try {
    const adminAddr = await contract.admin();
    const current = await signer.getAddress();
    console.log("Connected wallet:", current);
    if (adminAddr.toLowerCase() !== current.toLowerCase()) {
      alert("⚠️ You are not the contract admin! Please switch wallet.");
    }
  } catch (e) {
    console.warn("Admin check failed:", e);
  }
});

// ➕ Add Record
document.getElementById("addRecordBtn").addEventListener("click", async () => {
  const addr = document.getElementById("userAddress").value.trim();
  const name = document.getElementById("userName").value.trim();
  const score = parseInt(document.getElementById("userScore").value.trim());

  if (!addr || !name || isNaN(score)) {
    alert("⚠️ Please fill all fields properly.");
    return;
  }

  try {
    const tx = await contract.addRecord(addr, name, score);
    alert("🕒 Transaction sent! Waiting for confirmation...");
    await tx.wait();
    alert("✅ Record added or updated successfully!");
  } catch (err) {
    console.error("Full Error Object:", err);
    if (err?.data?.message) alert("❌ Reverted: " + err.data.message);
    else if (err?.message) alert("❌ Error: " + err.message);
    else alert("❌ Unknown error — check console.");
  }
});

// 📋 Get Record
document.getElementById("getRecordBtn").addEventListener("click", async () => {
  const addr = document.getElementById("fetchAddress").value.trim();
  if (!addr) {
    alert("⚠️ Please enter a user wallet address.");
    return;
  }

  try {
    const record = await contract.getRecord(addr);
    const output = `
📋 Name: ${record.name}
🏆 Score: ${record.score}
✅ Eligible: ${record.eligible ? "Yes" : "No"}
`;
    document.getElementById("recordOutput").textContent = output;
  } catch (err) {
    console.error(err);
    document.getElementById("recordOutput").textContent =
      "❌ No record found or error occurred.";
  }
});

// 🎁 Reward Student
document.getElementById("rewardBtn").addEventListener("click", async () => {
  const studentAddress = document.getElementById("rewardAddress").value.trim();
  if (!studentAddress) {
    alert("⚠️ Please enter student address.");
    return;
  }

  try {
    const tx = await contract.rewardStudent(studentAddress);
    await tx.wait();
    alert("🎉 Reward sent successfully!");
  } catch (error) {
    console.error("Reward error:", error);
    alert("❌ Reward failed. See console for details.");
  }
});
