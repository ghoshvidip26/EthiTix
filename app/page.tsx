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
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 to-amber-200 text-white px-4 py-10 flex flex-col justify-center items-center">
      <section className="text-center space-y-4 max-w-2xl">
        <h1 className="text-5xl font-extrabold text-yellow-300 drop-shadow">
          Organize Smart. Approve Fast.
        </h1>
        <p className="text-yellow-100 text-md">
          The easiest way to manage event participants and approve them on-chain
          with QR identity — powered by Aptos.
        </p>

        <div>
          {!address && (
            <button
              onClick={connectWallet}
              className="mt-6 bg-yellow-400 hover:bg-yellow-300 text-indigo-950 transition px-6 py-3 text-lg font-semibold rounded-xl shadow-lg flex items-center gap-2 mx-auto"
            >
              <LogIn className="w-5 h-5" />
              Connect Wallet
            </button>
          )}

          {address && !role && (
            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={() => handleRoleSelection("admin")}
                className="bg-blue-800 hover:bg-blue-700 px-6 py-3 text-yellow-100 font-medium rounded-xl transition"
              >
                Continue as Admin
              </button>
              <button
                onClick={() => handleRoleSelection("user")}
                className="bg-blue-800 hover:bg-blue-700 px-6 py-3 text-yellow-100 font-medium rounded-xl transition"
              >
                Continue as User
              </button>
            </div>
          )}

          {address && role && (
            <button
              onClick={() => router.push(`/${role}/dashboard`)}
              className="mt-6 bg-yellow-400 hover:bg-yellow-300 text-indigo-950 transition px-6 py-3 text-lg font-semibold rounded-xl shadow-lg flex items-center gap-2 mx-auto"
            >
              Launch {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
            </button>
          )}
        </div>
      </section>

      <section className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl w-full px-4">
        <div className="bg-indigo-950 backdrop-blur-sm border border-yellow-300/20 p-6 rounded-xl text-center space-y-3 shadow-md">
          <CheckCircle className="mx-auto text-yellow-300 w-6 h-6" />
          <h3 className="font-semibold text-amber-200">
            On-Chain Verification
          </h3>
          <p className="text-sm text-amber-300">
            Participant approvals are transparently recorded on Aptos —
            verifiable and immutable.
          </p>
        </div>

        <div className="bg-indigo-950 backdrop-blur-sm border border-yellow-300/20 p-6 rounded-xl text-center space-y-3 shadow-md">
          <ShieldCheck className="mx-auto text-yellow-300 w-6 h-6" />
          <h3 className="font-semibold text-amber-200">Ethical Ticketing</h3>
          <p className="text-sm text-amber-300">
            Fair and rule-based ticketing ensures no scalping or unfair resales
            — all smart contract enforced.
          </p>
        </div>

        <div className="bg-indigo-950 backdrop-blur-sm border border-yellow-300/20 p-6 rounded-xl text-center space-y-3 shadow-md">
          <Rocket className="mx-auto text-yellow-300 w-6 h-6" />
          <h3 className="font-semibold text-amber-200">QR-Powered Access</h3>
          <p className="text-sm text-amber-300">
            Soulbound QR codes tied to identity — easy to scan, impossible to
            fake.
          </p>
        </div>
      </section>
    </main>
  );
}
