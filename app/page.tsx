"use client";
import { useState } from "react";
import { LogIn, ShieldCheck, Rocket, CheckCircle } from "lucide-react";
import { useAptosWallet } from "@/app/context/WalletContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { address, connectWallet } = useAptosWallet();
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const router = useRouter();

  const handleRoleSelection = (selectedRole: "admin" | "user") => {
    localStorage.setItem("role", selectedRole);
    router.push(`/${selectedRole}/signup`);
  };
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-10 flex flex-col justify-center items-center">
      <section className="text-center space-y-4 max-w-2xl">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
          Organize Smart. Approve Fast.
        </h1>
        <p className="text-slate-300 text-md">
          The easiest way to manage event participants and approve them on-chain
          with QR identity — powered by Aptos.
        </p>
        <div>
          {!address && (
            <button
              onClick={connectWallet}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 transition px-6 py-3 text-white text-lg rounded-xl shadow-lg flex items-center gap-2 mx-auto"
            >
              <LogIn className="w-5 h-5" />
              Connect Wallet
            </button>
          )}

          {address && !role && (
            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={() => handleRoleSelection("admin")}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white rounded-xl"
              >
                Continue as Admin
              </button>
              <button
                onClick={() => handleRoleSelection("user")}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 text-white rounded-xl"
              >
                Continue as User
              </button>
            </div>
          )}

          {address && role && (
            <button
              onClick={() => router.push(`/${role}/dashboard`)}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 transition px-6 py-3 text-white text-lg rounded-xl shadow-lg flex items-center gap-2 mx-auto"
            >
              Launch {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
            </button>
          )}
        </div>
      </section>

      <section className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full px-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl text-center space-y-2">
          <CheckCircle className="mx-auto text-cyan-400 w-6 h-6" />
          <h3 className="font-semibold text-white">Instant Approval</h3>
          <p className="text-sm text-slate-400">
            One-click participant approval, recorded on Aptos.
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl text-center space-y-2">
          <ShieldCheck className="mx-auto text-yellow-300 w-6 h-6" />
          <h3 className="font-semibold text-white">Secure Identity</h3>
          <p className="text-sm text-slate-400">
            QR-based identity system with tamper-proof transparency.
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl text-center space-y-2">
          <Rocket className="mx-auto text-pink-400 w-6 h-6" />
          <h3 className="font-semibold text-white">Optimized TXs</h3>
          <p className="text-sm text-slate-400">
            Gas-efficient execution with fast transaction finality.
          </p>
        </div>
      </section>
    </main>
  );
}
