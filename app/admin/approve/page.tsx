"use client";
import { useState, useEffect } from "react";
import QRCode from "qrcode";
import axios from "axios";
import { useAptosWallet } from "@/app/context/WalletContext";
import { Aptos, AptosConfig, Network, Account } from "@aptos-labs/ts-sdk";

const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));

const Approve = () => {
  const [transactionHash, setTransactionHash] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [approve, setApprove] = useState(false);
  const [users, setUsers] = useState([]);
  const { address, account } = useAptosWallet();

  console.log("Address:", address);
  console.log("Account:", account);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get("/api/user/profile");
      console.log("Fetched users:", res.data);
      setUsers(res.data);
    };
    fetchEvents();
  }, []);

  const generateQRCode = async () => {
    if (!address) {
      return;
    }
    const APP_CREATOR_ADDRESS =
      "0xaeb2ddae68dec03cb0549043e698c325f5f6c440c122233cb6f01d77ab0c0a5f";
    const transaction = {
      type: "entry_function_payload",
      function: `${APP_CREATOR_ADDRESS}::event_app::approve_participant`,
      type_arguments: [],
      arguments: ["IBW", address],
    };

    try {
      const response = await window.aptos.signAndSubmitTransaction(transaction);
      console.log("Wallet response:", response);
      setApprove(true);
      console.log("Approve status:", approve);
      const url = `https://explorer.aptoslabs.com/txn/${transactionHash}?network=testnet`;
      const qr = await QRCode.toDataURL(url);
      setTransactionHash(transactionHash);
      setQrCodeUrl(qr);
    } catch (e: any) {
      console.error("Sign and Submit failed:", e);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      {users.map((user) => (
        <div key={user.walletAddress} className="p-4 border rounded shadow">
          <h2 className="text-lg font-semibold">{user.username}</h2>
          <p>Wallet Address: {user.walletAddress}</p>
        </div>
      ))}
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
