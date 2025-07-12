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

    const APP_CREATOR_ADDRESS =
      "0xaeb2ddae68dec03cb0549043e698c325f5f6c440c122233cb6f01d77ab0c0a5f";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-10 text-white">
      <div className="max-w-6xl mx-auto text-center ">
        <h1 className="text-4xl font-extrabold text-white mb-4 flex items-center justify-center gap-2">
          <User className="w-8 h-8 text-green-600" />
          Approve Participants
        </h1>
        <p className="mb-10 text-base text-white">
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
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <User className="text-green-600 w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-md font-semibold text-gray-800">
                      {user.username}
                    </h2>
                    <p className="text-xs text-gray-500 break-all">
                      {user.walletAddress}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleApprove(user.walletAddress)}
                  disabled={state.loading || state.approved}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition disabled:opacity-50"
                >
                  {state.loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Approving...
                    </>
                  ) : state.approved ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Approved
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </>
                  )}
                </button>

                {state.approved && state.qrCodeUrl && (
                  <div className="mt-5 text-center">
                    <p className="text-sm font-medium text-gray-700 flex items-center justify-center gap-1 mb-2">
                      <QrCode className="w-4 h-4" />
                      Scan QR
                    </p>
                    <img
                      src={state.qrCodeUrl}
                      alt="QR Code"
                      className="w-32 h-32 mx-auto border rounded-md shadow-sm"
                    />
                    <a
                      href={`https://explorer.aptoslabs.com/txn/${state.transactionHash}?network=testnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center text-sm text-blue-600 hover:underline"
                    >
                      View on Explorer <ArrowRight className="w-3 h-3 ml-1" />
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
