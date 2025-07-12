"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const InitRegistration = () => {
  const router = useRouter();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const APP_CREATOR_ADDRESS =
    "0xaeb2ddae68dec03cb0549043e698c325f5f6c440c122233cb6f01d77ab0c0a5f";
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 flex justify-center items-center">
      <button
        onClick={handleInit}
        className="mt-3 flex justify-center items-center gap-2 py-2 px-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Initialize
      </button>
    </div>
  );
};

export default InitRegistration;
