// components/UserDashboard.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Aptos,
  AptosConfig,
  Network,
  AnyRawTransaction,
} from "@aptos-labs/ts-sdk";
import axios from "axios";
import { useAptosWallet } from "@/app/context/WalletContext";

export default function UserDashboard() {
  const [events, setEvents] = useState([]);
  const { address, connectWallet } = useAptosWallet();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  console.log("events", events);
  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get("/api/event");
      setEvents(res.data);
    };
    fetchEvents();
  }, []);

  const handleRegister = async (eventId: string) => {
    if (!address) {
      alert("Please connect wallet first.");
      return;
    }
    setError(null);
    setTxHash(null);
    const APP_CREATOR_ADDRESS =
      "0x99dc9f9c9f54e6a73bfeff492c4d5c31bfc9476915ce3ba0acae69ce88f95557";

    const transaction = {
      type: "entry_function_payload",
      function: `${APP_CREATOR_ADDRESS}::event_app::register_for_event_v2`,
      type_arguments: [],
      arguments: [APP_CREATOR_ADDRESS, Number(eventId)],
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
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {events.map((event) => (
        <div
          key={event.eventId}
          className="bg-white shadow-xl rounded-2xl overflow-hidden transition transform hover:scale-105 duration-200"
        >
          <img
            src={event.imageUrl || "/placeholder.jpg"}
            alt={event.eventName}
            className="w-full h-48 object-cover"
          />
          <div className="p-4 space-y-2">
            <h2 className="text-lg font-bold">{event.eventName}</h2>
            <p className="text-sm text-gray-500 line-clamp-3">
              {event.descriptionOfEvent}
            </p>
            <div className="flex justify-between text-xs text-gray-600">
              <span>📍 {event.eventLocation}</span>
              <span>👥 {event.capacityOfEvent}</span>
            </div>
            <button
              onClick={() => handleRegister(event.eventId)}
              className="w-full mt-2 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition"
            >
              Register
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
