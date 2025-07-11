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
    <button
      onClick={handleInit}
      className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-700"
    >
      Initialize
    </button>
  );
};

export default InitRegistration;
