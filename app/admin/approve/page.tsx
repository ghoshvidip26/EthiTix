"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import axios from "axios";
import { useAptosWallet } from "@/app/context/WalletContext";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { User, Loader, CheckCircle, QrCode, ArrowRight } from "lucide-react";

const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));

type UserData = {
  username: string;
  walletAddress: string;
};

type ApprovalState = {
  loading: boolean;
  approved: boolean;
  qrCodeUrl: string;
  transactionHash: string;
};

const Approve = () => {
  const { address } = useAptosWallet();
  const [users, setUsers] = useState<UserData[]>([]);
  const [approvalStates, setApprovalStates] = useState<
    Record<string, ApprovalState>
  >({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/user/profile");
        setUsers(res.data);

        // Initialize approval state per user
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

  const handleApprove = async (participantWallet: string) => {
    if (!address) return;

    const APP_CREATOR_ADDRESS = process.env.NEXT_APP_CREATOR_ADDRESS;

    setApprovalStates((prev) => ({
      ...prev,
      [participantWallet]: { ...prev[participantWallet], loading: true },
    }));

    const fixedAddress = participantWallet.replace(/^0x/, "").padStart(64, "0");

    const transaction = {
      type: "entry_function_payload",
      function: `${APP_CREATOR_ADDRESS}::event_app::approve_participant`,
      type_arguments: [],
      arguments: ["IBW", `0x${fixedAddress}`],
    };

    try {
      const response = await window.aptos.signAndSubmitTransaction(transaction);
      const hash = response.hash;

      const url = `https://explorer.aptoslabs.com/txn/${hash}?network=testnet`;
      const qr = await QRCode.toDataURL(url);

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

            return (
              <div
                key={user.walletAddress}
                className="bg-indigo-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-start gap-4"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <User className="text-blue-800 w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-semibold text-amber-200">
                      {user.username}
                    </p>
                    <p className="text-sm text-amber-100 break-all">
                      {user.walletAddress}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleApprove(user.walletAddress)}
                  disabled={state.loading || state.approved}
                  className="inline-flex items-center gap-2 px-5 py-2 mt-2 bg-amber-400 text-blue-900 rounded-lg font-medium hover:bg-amber-300 disabled:opacity-50"
                >
                  {state.loading ? (
                    <>
                      <Loader className="animate-spin w-4 h-4" /> Approving...
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

                {state.approved && state.qrCodeUrl && (
                  <div className="mt-4 w-full text-center">
                    <h4 className="text-sm font-medium text-amber-300 flex items-center justify-center gap-1 mb-1">
                      <QrCode className="w-4 h-4" /> QR Code
                    </h4>
                    <img
                      src={state.qrCodeUrl}
                      alt="QR Code"
                      className="w-36 h-36 mx-auto border border-amber-200 rounded-md shadow"
                    />
                    <a
                      href={`https://explorer.aptoslabs.com/txn/${state.transactionHash}?network=testnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-sm text-amber-100 hover:underline"
                    >
                      View on Explorer <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Approve;
