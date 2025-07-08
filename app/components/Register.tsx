"use client";
import { useState } from "react";
import {
  Aptos,
  AptosConfig,
  Network,
  AnyRawTransaction,
} from "@aptos-labs/ts-sdk";

// TypeScript helper for window.aptos
declare global {
  interface Window {
    aptos?: any;
  }
}

// Instantiate SDK outside component to avoid re-creation on re-renders
const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));

const MinimalAptosTest = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    setError(null);
    if (!window.aptos) {
      alert("Petra wallet not found. Please install it.");
      return;
    }
    try {
      const result = await window.aptos.connect();
      setAddress(result.address);
    } catch (e: any) {
      setError(`Connect failed: ${e.message}`);
    }
  };

  const onRegister = async () => {
    if (!address) {
      alert("Please connect wallet first.");
      return;
    }
    setError(null);
    setTxHash(null);

    // This is the transaction payload we want the user to sign
    const transaction: AnyRawTransaction = {
      type: "entry_function_payload",
      function:
        "0x99dc9f9c9f54e6a73bfeff492c4d5c31bfc9476915ce3ba0acae69ce88f95557::event::register_for_event",
      type_arguments: [],
      arguments: [],
    };

    console.log("Transaction to sign and submit:", transaction);

    try {
      // Use the standard signAndSubmitTransaction function
      const response = await window.aptos.signAndSubmitTransaction(transaction);
      console.log("Wallet response:", response);
      setTxHash(response.hash);
    } catch (e: any) {
      console.error("Sign and Submit failed:", e);
      setError(`Transaction failed: ${e.message}`);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "sans-serif",
        border: "1px solid #ccc",
        borderRadius: "8px",
        maxWidth: "500px",
        margin: "20px auto",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Minimal Aptos Test</h2>
      {!address ? (
        <button
          onClick={connect}
          style={{
            width: "100%",
            padding: "10px",
            background: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          <p>
            Connected:{" "}
            <code
              style={{
                background: "#eee",
                padding: "2px 4px",
                borderRadius: "3px",
              }}
            >
              {address}
            </code>
          </p>
          <button
            onClick={onRegister}
            style={{
              width: "100%",
              padding: "10px",
              background: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Register (Sign & Submit)
          </button>
        </div>
      )}
      {txHash && (
        <p style={{ color: "green", wordBreak: "break-all" }}>
          Success! Hash: {txHash}
        </p>
      )}
      {error && (
        <p style={{ color: "red", wordBreak: "break-all" }}>Error: {error}</p>
      )}
    </div>
  );
};

export default MinimalAptosTest;
