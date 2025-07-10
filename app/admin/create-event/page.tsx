"use client";
import { useState } from "react";
import {
  Aptos,
  AptosConfig,
  Network,
  AnyRawTransaction,
} from "@aptos-labs/ts-sdk";
import { useAptosWallet } from "@/app/context/WalletContext";

declare global {
  interface Window {
    aptos?: any;
  }
}

const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    date: "",
    location: "",
    max_participants: "",
  });
  const { address, connectWallet } = useAptosWallet();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const APP_CREATOR_ADDRESS =
    "0x99dc9f9c9f54e6a73bfeff492c4d5c31bfc9476915ce3ba0acae69ce88f95557";
  const handleChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const transaction = {
      type: "entry_function_payload",
      function: `${APP_CREATOR_ADDRESS}::event_app::register_for_event_v2`,
      type_arguments: [],
      arguments: [APP_CREATOR_ADDRESS],
    };
  };
  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-semibold mb-4">Create Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="id"
          type="number"
          placeholder="Event ID"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="name"
          type="text"
          placeholder="Event Name"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="date"
          type="number"
          placeholder="Event Date (Unix timestamp)"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="location"
          type="text"
          placeholder="Location"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="max_participants"
          type="number"
          placeholder="Max Participants"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
