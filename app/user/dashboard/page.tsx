// components/UserDashboard.tsx
"use client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAptosWallet } from "@/app/context/WalletContext";
import { useQRCode } from "@/app/context/QRCodeContext";

export default function UserDashboard() {
  const [events, setEvents] = useState([]);
  const { address, connectWallet } = useAptosWallet();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const { qrCodeURL, hash, generateQRCode } = useQRCode();
  console.log("QR Code URL:", qrCodeURL);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get("/api/event");
      setEvents(res.data);
    };
    fetchEvents();
  }, []);

  const handleRegister = async (eventId: string, eventName: string) => {
    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }

    const eId = eventId.replace(/\D/g, "").trim();
    const trimmedEventName = eventName.trim();

    if (!eId || !trimmedEventName) {
      alert("Invalid event information.");
      return;
    }

    const APP_CREATOR_ADDRESS = process.env.NEXT_PUBLIC_APP_CREATOR_ADDRESS;
    const { generateQRCode } = useQRCode(); // ensure this is included at the top

    setLoadingId(eId);
    setError(null);
    setTxHash(null);

    const transaction = {
      type: "entry_function_payload",
      function: `${APP_CREATOR_ADDRESS}::event_app::register_for_event_v2`,
      type_arguments: [],
      arguments: [address, trimmedEventName],
    };

    try {
      console.log("Submitting transaction:", transaction);
      const response = await window.aptos.signAndSubmitTransaction(transaction);

      console.log("Transaction submitted:", response);
      setTxHash(response.hash);

      // Generate QR code for the transaction hash
      await generateQRCode(response.hash);
    } catch (e: any) {
      console.error("Transaction failed:", e);
      setError(`Transaction failed: ${e.message || "Unknown error occurred"}`);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 to-amber-200 text-white px-6 flex items-center justify-center py-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-indigo-800/90 backdrop-blur-md border border-amber-400/20 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-transform transform hover:scale-105 duration-300"
            >
              <img
                src={
                  event.imageUrl ||
                  "https://www.sirtbhopal.ac.in/assets/images/blogs/basics-of-blockchain-explained-in-easy-terms.webp"
                }
                alt={event.eventName}
                className="w-full h-48 object-cover rounded-t-2xl"
              />
              <div className="p-5 space-y-3">
                <h2 className="text-xl font-bold text-amber-300 truncate">
                  {event.eventName}
                </h2>
                <p className="text-sm text-amber-100 line-clamp-3">
                  {event.descriptionOfEvent}
                </p>
                <div className="flex justify-between items-center text-xs text-amber-200">
                  <span>📍 {event.eventLocation}</span>
                  <span>👥 {event.capacityOfEvent}</span>
                </div>
                <button
                  onClick={() => handleRegister(event._id, event.eventName)}
                  disabled={loadingId === event._id}
                  className="w-full mt-4 flex justify-center items-center gap-2 py-2 bg-amber-400 text-indigo-900 font-semibold rounded-xl hover:bg-amber-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingId === event._id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />{" "}
                      Registering...
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
                {qrCodeURL && (
                  <img
                    src={qrCodeURL}
                    alt="QR Code"
                    className="mt-4 w-32 h-32 mx-auto border border-amber-200 rounded-md shadow"
                  />
                )}
                {hash && (
                  <a
                    href={`https://explorer.aptoslabs.com/txn/${hash}?network=testnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 text-center text-sm text-amber-100 underline"
                  >
                    View Transaction
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
