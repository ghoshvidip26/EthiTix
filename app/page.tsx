"use client";
import Approve from "./components/Approve";
declare global {
  interface Window {
    aptos?: any;
  }
}

// Two sides of this application:
// Admin side: admin creating an event, approving users giving them a unique token or nft

// User side: User connecting their wallet, registering for an event, and if approved then they can see & show their nft to the admin.

export default function Home() {
  const getAptosWallet = () => {
    if ("aptos" in window) {
      return window.aptos;
    } else {
      window.open("https://petra.app/", `_blank`);
    }
  };

  const connectWallet = async () => {
    const wallet = getAptosWallet();
    try {
      const response = await wallet.connect();
      console.log("Connected to wallet:", response);

      const account = await wallet.account();
      console.log("Account address:", account.address);
    } catch (error) {
      console.log("Error connecting to wallet:", error);
    }
  };
  return (
    <>
      <button onClick={connectWallet}>Connect Wallet</button>
      <Approve />
    </>
  );
}
