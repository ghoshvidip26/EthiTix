"use client";
import { useState } from "react";
import {
  Aptos,
  AptosConfig,
  Network,
  AnyRawTransaction,
} from "@aptos-labs/ts-sdk";

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
  const handleChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("Submitting event data:", formData);
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
