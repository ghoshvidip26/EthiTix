"use client";
import { useState } from "react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useAptosWallet } from "@/app/context/WalletContext";
import axios from "axios";

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
  const { address, connectWallet } = useAptosWallet();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const APP_CREATOR_ADDRESS =
    "0xaeb2ddae68dec03cb0549043e698c325f5f6c440c122233cb6f01d77ab0c0a5f";
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
      const response = await window.aptos.signAndSubmitTransaction(transaction);
      await axios.post("/api/event", {
        eventName: formData.name,
        descriptionOfEvent: formData.description,
        eventDate: Math.floor(
          new Date(formData.date).getTime() / 1000
        ).toString(),
        eventLocation: formData.location,
        capacityOfEvent: formData.max_participants.toString(),
      });
      console.log("Wallet response:", response);
    } catch (error) {
      console.log("Error creating transaction:", error);
    }
  };
  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg text-black">
      <h1 className="text-xl font-semibold mb-4">Create Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          type="date"
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
