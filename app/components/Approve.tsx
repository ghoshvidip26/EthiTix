"use client";
import { useState, useEffect } from "react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { getAptosWallets } from "@aptos-labs/wallet-standard";

const Approve = () => {
  const [address, setAddress] = useState<string | null>(null);
  const config = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(config);
  const getAptosWallet = () => {
    if (typeof window === "undefined") return null;
    if ("aptos" in window) return window.aptos;
    return null;
  };

  const connectWallet = async () => {
    const wallet = getAptosWallet();
    if (!wallet) {
      console.log("Petra wallet not found. Please install Petra.");
      window.open("https://petra.app", "_blank");
      return;
    }

    try {
      const response = await wallet.connect();
      console.log("Connected to wallet:", response);
      setAddress(response.address);

      const account = await wallet.account();
      console.log("Account address:", account.address);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  const registerForEvent = async () => {
    if (!address) return;

    try {
      // Build the transaction
      const txn = await aptos.transaction.build.simple({
        sender: address,
        data: {
          function:
            "0x99dc9f9c9f54e6a73bfeff492c4d5c31bfc9476915ce3ba0acae69ce88f95557::event::register_for_event",
          typeArguments: [],
          functionArguments: [],
        },
      });

      console.log("Transaction built:", txn);

      const signedTxn = await window.aptos.signTransaction({
        payload: txn.rawTransaction, // Pass the rawTransaction from the built txn
      });

      console.log("Signed transaction:", signedTxn);

      // Submit the signed transaction using SDK
      const res = await aptos.transaction.submit.simple({
        transaction: signedTxn,
      });

      console.log("Transaction submitted:", res.hash);
    } catch (err) {
      console.error("Register error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-white rounded-lg shadow-md">
      <button
        onClick={connectWallet}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Connect Wallet
      </button>
      <p className="text-gray-700">
        Connected Address:{" "}
        <span className="font-mono break-all">
          {address || "Not connected"}
        </span>
      </p>
      <button
        onClick={registerForEvent}
        disabled={!address}
        className={`px-6 py-2 rounded transition ${
          address
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Register for Event
      </button>
    </div>
  );
};

export default Approve;
