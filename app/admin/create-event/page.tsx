"use client";
import { useState } from "react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useAptosWallet } from "@/app/context/WalletContext";
import axios from "axios";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    aptos?: any;
  }
}

const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    max_participants: "",
  });
  const router = useRouter();
  const { address, connectWallet } = useAptosWallet();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitDone, setIsInitDone] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const APP_CREATOR_ADDRESS =
    "0xaeb2ddae68dec03cb0549043e698c325f5f6c440c122233cb6f01d77ab0c0a5f";
  const handleChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleInit = async () => {
    const transaction = {
      type: "entry_function_payload",
      function: `${APP_CREATOR_ADDRESS}::event_app::init_registry`,
      type_arguments: [],
      arguments: [],
    };
    console.log("Transaction to be sent:", transaction);
    try {
      const response = await window.aptos.signAndSubmitTransaction(transaction);
      router.push("/admin/create-event");
      console.log("Wallet response:", response);
      setTxHash(response.hash);
    } catch (e: any) {
      console.error("Sign and Submit failed:", e);
      setError(`Transaction failed: ${e.message}`);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const transaction = {
      type: "entry_function_payload",
      function: `${APP_CREATOR_ADDRESS}::event_app::create_event`,
      arguments: [
        formData.name,
        formData.description,
        Math.floor(new Date(formData.date).getTime() / 1000).toString(),
        formData.location,
        formData.max_participants.toString(),
      ],
      type_arguments: [],
    };
    try {
      await axios.post("/api/event", {
        eventName: formData.name,
        descriptionOfEvent: formData.description,
        eventDate: Math.floor(
          new Date(formData.date).getTime() / 1000
        ).toString(),
        eventLocation: formData.location,
        capacityOfEvent: formData.max_participants.toString(),
      });
      const response = await window.aptos.signAndSubmitTransaction(transaction);
      console.log("Wallet response:", response);
    } catch (error) {
      console.log("Error creating transaction:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-amber-200 flex items-center justify-center px-4 py-10 text-white">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r text-indigo-950  bg-clip-text">
            Create New Event
          </h1>
          <p className="text-sm text-amber-300 mt-2">
            Fill in the details to publish your event on Aptos
          </p>
        </div>
        <div className="mb-6 text-center">
          {!isInitDone ? (
            <>
              <button
                onClick={handleInit}
                className="px-5 py-3 bg-yellow-400 text-indigo-900 font-seamber rounded-xl shadow hover:bg-yellow-300 transition"
              >
                Initialize Registry
              </button>
              {initError && (
                <p className="text-red-400 mt-2 text-sm">Failed: {initError}</p>
              )}
            </>
          ) : (
            <p className="text-green-400 font-medium">
              ✅ Registry initialized. You can now create an event.
            </p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="name"
            type="text"
            placeholder="Event Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-indigo-900 text-amber-100 placeholder-yellow-300 border border-yellow-300/30 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
          />

          <textarea
            name="description"
            placeholder="Event Description"
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-indigo-900 text-amber-100 placeholder-yellow-300 border border-yellow-300/30 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
          />

          <input
            name="date"
            type="date"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-indigo-900 text-amber-100 placeholder-yellow-300 border border-yellow-300/30 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
          />

          <input
            name="location"
            type="text"
            placeholder="Location"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-indigo-900 text-amber-100 placeholder-yellow-300 border border-yellow-300/30 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
          />

          <input
            name="max_participants"
            type="number"
            placeholder="Max Participants"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-indigo-900 text-amber-100 placeholder-yellow-300 border border-yellow-300/30 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
          />

          <button
            type="submit"
            className="w-full bg-yellow-400 text-indigo-900 font-seamber py-3 px-4 rounded-xl hover:bg-yellow-300 transition"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}
