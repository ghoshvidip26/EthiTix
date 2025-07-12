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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-12">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
          <User className="w-8 h-8 text-green-600" /> Approve Participants
        </h1>
        <p className="text-gray-500 mb-12">
          Click approve to verify each participant individually.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
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
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300 flex flex-col items-start gap-4"
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="bg-green-100 p-3 rounded-full">
                    <User className="text-green-600 w-5 h-5" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-lg font-semibold text-gray-800">
                      {user.username}
                    </p>
                    <p className="text-sm text-gray-500 break-all">
                      {user.walletAddress}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleApprove(user.walletAddress)}
                  disabled={state.loading || state.approved}
                  className="inline-flex items-center gap-2 px-5 py-2 mt-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  {state.loading ? (
                    <>
                      <Loader className="animate-spin w-4 h-4" /> Approving...
                    </>
                  ) : state.approved ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-white" /> Approved
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-white" /> Approve
                    </>
                  )}
                </button>

                {state.approved && state.qrCodeUrl && (
                  <div className="mt-4 w-full text-center">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center justify-center gap-1 mb-1">
                      <QrCode className="w-4 h-4" /> QR Code
                    </h4>
                    <img
                      src={state.qrCodeUrl}
                      alt="QR Code"
                      className="w-36 h-36 mx-auto border border-gray-300 rounded-md shadow"
                    />
                    <a
                      href={`https://explorer.aptoslabs.com/txn/${state.transactionHash}?network=testnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
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
