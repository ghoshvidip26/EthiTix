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
      router.push("/admin/dashboard");
      console.log("Response from server:", res.data);
    } catch (error) {
      console.log("Error during sign up:", error);
    }
  };

  const isSignUpDisabled = !username.trim() || !address || isLoading;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Your Account
          </h1>
          <p className="mt-2 text-gray-600">
            Welcome! Connect your wallet and choose a username to get started.
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Step 1: Connect Wallet
            </label>
            {address ? (
              <div className="flex items-center justify-center w-full px-6 py-3 space-x-2 text-lg text-green-700 bg-green-100 border border-green-200 rounded-lg">
                <FaCheckCircle />
                <span>Wallet Connected Successfully</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={connectWallet}
                disabled={isLoading}
                className="flex items-center justify-center w-full px-6 py-3 space-x-3 text-lg font-semibold text-white transition-transform duration-200 bg-cyan-500 rounded-lg hover:bg-cyan-600 active:scale-95 disabled:bg-gray-400"
              >
                <FaWallet />
                <span>
                  {isLoading ? "Connecting..." : "Connect Aptos Wallet"}
                </span>
              </button>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Step 2: Choose Username
            </label>
            <FaUser className="absolute w-5 h-5 text-gray-400 top-12 left-4" />
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full py-3 pl-12 pr-4 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              disabled={isLoading}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSignUpDisabled}
              className="w-full px-6 py-3 text-lg font-bold text-white transition-all duration-300 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSignUp;
