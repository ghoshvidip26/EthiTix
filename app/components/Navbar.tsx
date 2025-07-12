"use client";
import { useAptosWallet } from "@/app/context/WalletContext";
import Image from "next/image";

export default function Navbar() {
  const { address } = useAptosWallet();
  console.log("Wallet Address:", address);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-indigo-950 backdrop-blur-lg border-b border-amber-300 shadow-md">
      <div className="mx-auto px-6 flex items-center justify-between">
        <a href="/" className="flex items-center">
          <Image src="/Logo.png" alt="Logo" width={100} height={100} />
        </a>

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
