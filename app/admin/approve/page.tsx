"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import axios from "axios";
import { useAptosWallet } from "@/app/context/WalletContext";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { User, Loader, CheckCircle } from "lucide-react";
import { useQRCode } from "@/app/context/QRCodeContext";
import { useEventContext } from "@/app/context/EventContext";
import Link from "next/link";

const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));

type UserData = {
  username: string;
  walletAddress: string;
  eventName: string;
};

type ApprovalState = {
  loading: boolean;
  approved: boolean;
  qrCodeUrl: string;
  transactionHash: string;
};

const Approve = () => {
  const { address } = useAptosWallet();
  const { generateQRCode } = useQRCode();
  const { events } = useEventContext();
  const [users, setUsers] = useState<UserData[]>([]);
  const [approvalStates, setApprovalStates] = useState<
    Record<string, ApprovalState>
  >({});
  // console.log("Current event:", events);
  events.forEach((ev) => {
    console.log("Event name:", ev.name);
  });
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/user/profile");
        setUsers(res.data);

        const initialStates: Record<string, ApprovalState> = {};
        res.data.forEach((user: UserData) => {
          initialStates[user.walletAddress] = {
            loading: false,
            approved: false,
            qrCodeUrl: "",
            transactionHash: "",
          };
        });
        setApprovalStates(initialStates);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleApprove = async (
    participantWallet: string,
    eventName: string
  ) => {
    if (!address) return;

    const APP_CREATOR_ADDRESS = process.env.NEXT_PUBLIC_APP_CREATOR_ADDRESS;

    setApprovalStates((prev) => ({
      ...prev,
      [participantWallet]: { ...prev[participantWallet], loading: true },
    }));

    const fixedAddress = participantWallet.replace(/^0x/, "").padStart(64, "0");
    console.log("Fixed address:", fixedAddress);

    const transaction = {
      type: "entry_function_payload",
      function: `${APP_CREATOR_ADDRESS}::event_app::approve_participant`,
      type_arguments: [],
      arguments: [eventName, `0x${fixedAddress}`],
    };

    try {
      const response = await window.aptos.signAndSubmitTransaction(transaction);
      const hash = response.hash;

      const url = `https://explorer.aptoslabs.com/txn/${hash}?network=testnet`;
      const qr = await QRCode.toDataURL(url);
      generateQRCode(hash);

      setApprovalStates((prev) => ({
        ...prev,
        [participantWallet]: {
          loading: false,
          approved: true,
          transactionHash: hash,
          qrCodeUrl: qr,
        },
      }));
    } catch (e) {
      console.error("Approval failed:", e);
      setApprovalStates((prev) => ({
        ...prev,
        [participantWallet]: { ...prev[participantWallet], loading: false },
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-amber-200 flex items-center justify-center px-4 py-10 text-white">
      <div className="max-w-6xl mx-auto text-center ">
        <Link
          href="/admin/create-event"
          className="text-indigo-950 mb-4 inline-block"
        >
          Create New Event
        </Link>
        <h1 className="text-4xl font-extrabold text-amber-300 mb-4 flex items-center justify-center gap-2">
          <User className="w-8 h-8 text-amber-300" />
          Approve Participants
        </h1>
        <p className="mb-10 text-base text-amber-100">
          Click the approve button to verify each participant and generate a
          unique QR code.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {users.map((user) => {
            const state = approvalStates[user.walletAddress] || {
              loading: false,
              approved: false,
              qrCodeUrl: "",
              transactionHash: "",
            };

            console.log("Rendering user:", user, "State:", state);

            return (
              <div
                key={user.walletAddress}
                className="flex flex-col justify-between h-full rounded-2xl bg-slate-800/50 border border-slate-700 p-6 shadow-lg transition-all hover:shadow-yellow-400/10 hover:border-slate-600 text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-300 text-indigo-900 rounded-full p-3">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-white">
                      {user.username}
                    </h3>
                    <p className="text-xs text-amber-100 break-all">
                      {user.walletAddress.slice(0, 6)}...
                      {user.walletAddress.slice(-4)}
                    </p>
                    <p className="text-sm text-amber-200">{user.eventName}</p>
                  </div>
                </div>

                {/* Button */}
                <button
                  onClick={() => handleApprove(user.walletAddress, events.name)}
                  disabled={state.loading || state.approved}
                  className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-400 text-indigo-900 font-semibold rounded-xl hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" /> Approving...
                    </>
                  ) : state.approved ? (
                    <>
                      <CheckCircle className="w-4 h-4" /> Approved
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" /> Approve
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Approve;
