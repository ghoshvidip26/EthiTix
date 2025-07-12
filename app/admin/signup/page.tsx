"use client";
import React, { useState } from "react";
import { FaWallet, FaUser, FaCheckCircle } from "react-icons/fa";
import { useAptosWallet } from "@/app/context/WalletContext";
import axios from "axios";
import { useRouter } from "next/navigation";

const AdminSignUp = () => {
  const [username, setUsername] = useState("");
  const router = useRouter();
  const { address, connectWallet } = useAptosWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: any) => {
    e.preventDefault();
    if (!username.trim() || !address) return;
    try {
      const res = await axios.post("/api/admin/register", {
        address,
        username,
      });
      router.push("/admin/create-event");
      console.log("Response from server:", res.data);
    } catch (error) {
      console.log("Error during sign up:", error);
    }
  };

  const isSignUpDisabled = !username.trim() || !address || isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-amber-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-8 space-y-8 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
            Admin Sign Up
          </h1>
          <p className="mt-2 text-slate-300 text-sm">
            Connect wallet & pick a username to begin
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="relative">
            <label
              htmlFor="username"
              className="text-sm font-medium text-slate-300"
            >
              Username
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourname"
                className="w-full bg-white/10 text-white placeholder-slate-400 border border-white/20 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-3">
            {!address && (
              <button
                type="button"
                onClick={connectWallet}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 transition text-white text-lg rounded-xl shadow-md"
              >
                <FaWallet />
                Connect Wallet
              </button>
            )}

            <button
              type="submit"
              disabled={isSignUpDisabled}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 text-lg font-semibold rounded-xl transition-all ${
                isSignUpDisabled
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white shadow-md"
              }`}
            >
              Sign Up
            </button>
          </div>
        </form>

        {address && (
          <div className="text-xs text-center text-green-400 mt-2">
            Connected: {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSignUp;
