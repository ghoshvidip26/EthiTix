// components/UserDashboard.tsx
"use client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAptosWallet } from "@/app/context/WalletContext";

export default function UserDashboard() {
  const [events, setEvents] = useState([]);
  const { address, connectWallet } = useAptosWallet();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get("/api/event");
      setEvents(res.data);
    };
    fetchEvents();
  }, []);

  const handleRegister = async (eventId: string) => {
    let eId = eventId.replace(/\D/g, "");
    if (!address) {
      alert("Please connect wallet first.");
      return;
    }
    setLoadingId(eId);
    setError(null);
    setTxHash(null);
    const APP_CREATOR_ADDRESS =
      "0x99dc9f9c9f54e6a73bfeff492c4d5c31bfc9476915ce3ba0acae69ce88f95557";

    const transaction = {
      type: "entry_function_payload",
      function: `${APP_CREATOR_ADDRESS}::event_app::register_for_event_v2`,
      type_arguments: [],
      arguments: [APP_CREATOR_ADDRESS, Number(eId)],
    };

    console.log("Transaction to sign and submit:", transaction);
    console.log("Arguments: ", transaction.arguments);
    try {
      const response = await window.aptos.signAndSubmitTransaction(transaction);
      console.log("Wallet response:", response);
      setTxHash(response.hash);
    } catch (e: any) {
      console.error("Sign and Submit failed:", e);
      setError(`Transaction failed: ${e.message}`);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl overflow-hidden transition transform hover:scale-105 duration-200"
          >
            <img
              src={
                event.imageUrl ||
                "https://www.sirtbhopal.ac.in/assets/images/blogs/basics-of-blockchain-explained-in-easy-terms.webp"
              }
              alt={event.eventName}
              className="w-full h-48 object-cover rounded-t-2xl"
            />
            <div className="p-4 space-y-2">
              <h2 className="text-lg font-bold text-white truncate">
                {event.eventName}
              </h2>
              <p className="text-sm text-slate-300 line-clamp-3">
                {event.descriptionOfEvent}
              </p>
              <div className="flex justify-between items-center text-xs text-slate-400 mt-2">
                <span>📍 {event.eventLocation}</span>
                <span>👥 {event.capacityOfEvent}</span>
              </div>

              <button
                onClick={() => handleRegister(event._id)}
                disabled={loadingId === event._id}
                className="w-full mt-3 flex justify-center items-center gap-2 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingId === event._id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {txHash && (
        <div className="text-center mt-6 text-green-400 text-sm">
          ✅ Transaction Submitted:{" "}
          <a
            href={`https://explorer.aptoslabs.com/txn/${txHash}?network=testnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View on Explorer
          </a>
        </div>
      )}

      {error && (
        <div className="text-center mt-6 text-red-400 text-sm">❌ {error}</div>
      )}
    </main>
  );
}
