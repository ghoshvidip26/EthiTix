"use client";

import Link from "next/link";
import { PlusCircle, CheckCircle, UserPlus } from "lucide-react";

export default function AdminPortal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-yellow-200 px-6 py-16 text-white">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-yellow-300 mb-6">
          Admin Portal
        </h1>
        <p className="text-yellow-100 mb-10">Choose what you'd like to do:</p>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Create Event */}
          <Link
            href="/admin/create-event"
            className="bg-blue-800 hover:bg-blue-700 text-yellow-300 font-semibold py-6 px-4 rounded-2xl shadow-md transition flex items-center justify-center gap-3"
          >
            <PlusCircle className="w-6 h-6" />
            Create Event
          </Link>

          {/* Approve Participants */}
          <Link
            href="/admin/approve"
            className="bg-blue-800 hover:bg-blue-700 text-yellow-300 font-semibold py-6 px-4 rounded-2xl shadow-md transition flex items-center justify-center gap-3"
          >
            <CheckCircle className="w-6 h-6" />
            Approve Participants
          </Link>
        </div>
      </div>
    </div>
  );
}
