"use client";
import { useAptosWallet } from "@/app/context/WalletContext";

export default function Navbar() {
  const { address } = useAptosWallet();
  console.log("Wallet Address:", address);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/10 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="/"
          className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text tracking-tight"
        >
          Trezo
        </a>

        {/* Right: Wallet Status */}
        <div className="flex items-center space-x-4">
          {address ? (
            <div className="text-sm font-medium bg-green-500 text-white px-4 py-1.5 rounded-full shadow-sm">
              Connected: {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          ) : (
            <div className="text-sm font-medium bg-red-500 text-white px-4 py-1.5 rounded-full shadow-sm">
              Disconnected
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
