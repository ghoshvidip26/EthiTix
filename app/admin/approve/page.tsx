"use client";
import { useState, useEffect } from "react";
import QRCode from "qrcode";
import axios from "axios";
import { useAptosWallet } from "@/app/context/WalletContext";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));

const Approve = () => {
  const [transactionHash, setTransactionHash] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [approve, setApprove] = useState(false);
  const { address } = useAptosWallet();

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get("/api/user/profile");
      console.log("Fetched users:", res.data);
    };
    fetchEvents();
  }, []);

  const generateQRCode = async () => {
    if (!address) {
      return;
    }
    const transaction = {
      type: "entry_function_payload",
      function:
        "0x99dc9f9c9f54e6a73bfeff492c4d5c31bfc9476915ce3ba0acae69ce88f95557::event::approve_participant",
      type_arguments: [],
      arguments: [],
    };
    try {
      const response = await window.aptos.signAndSubmitTransaction(transaction);
      console.log("Wallet response:", response);
      setApprove(true);
    } catch (e: any) {
      console.error("Sign and Submit failed:", e);
    }
    if (approve) {
      const mintTokenTransaction = await aptos.mintDigitalAssetTransaction({
        creator: address,
        collection: "Example Collection",
        description: "This is an example digital asset.",
        name: "Example Asset",
        uri: "https://github.com/bunlong/next-qrcode",
      });
      const mintTxn = await aptos.signAndSubmitTransaction({
        signer: address,
        transaction: mintTokenTransaction,
      });
      setTransactionHash(mintTxn.hash);
      const url = `https://explorer.aptoslabs.com/txn/${transactionHash}?network=testnet`;
      const qr = await QRCode.toDataURL(url);
      setQrCodeUrl(qr);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <button
        onClick={generateQRCode}
        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Approve Participant
      </button>

      {qrCodeUrl && (
        <img
          src={qrCodeUrl}
          alt="QR Code"
          width={200}
          height={200}
          style={{ margin: 3 }}
        />
      )}
    </div>
  );
};

export default Approve;
