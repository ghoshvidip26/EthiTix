import { useState } from "react";
import QRCode from "qrcode";
import { useAptosWallet } from "@/app/context/WalletContext";

const Approve = () => {
  const [transactionHash, setTransactionHash] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const { address } = useAptosWallet();
  const onRegister = async () => {
    if (!address) {
      alert("Please connect wallet first.");
      return;
    }
    setTransactionHash("");

    const transaction = {
      type: "entry_function_payload",
      function:
        "0x99dc9f9c9f54e6a73bfeff492c4d5c31bfc9476915ce3ba0acae69ce88f95557::event::approve_participant",
      type_arguments: [],
      arguments: [],
    };

    console.log("Transaction to sign and submit:", transaction);

    try {
      const response = await window.aptos.signAndSubmitTransaction(transaction);
      console.log("Wallet response:", response);
      setTransactionHash(response.hash);
    } catch (e: any) {
      console.error("Sign and Submit failed:", e);
    }
  };
  const generateQRCode = async () => {
    if (!transactionHash) return;
    const url = `https://explorer.aptoslabs.com/txn/${transactionHash}?network=testnet`;
    const qr = await QRCode.toDataURL(url);
    setQrCodeUrl(qr);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <button
        onClick={generateQRCode}
        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Generate QR Code
      </button>

      {qrCodeUrl && (
        <img src={qrCodeUrl} alt="QR Code" className="mt-4 w-40 h-40" />
      )}
    </div>
  );
};

export default Approve;
