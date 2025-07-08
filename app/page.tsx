// app/page.tsx (or app/dashboard/page.tsx if routing)
"use client";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const handleAdminSignup = () => {
    router.push("/admin/signup");
  };

  const handleUserSignup = () => {
    router.push("/user/signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-10 bg-white rounded-xl shadow-xl space-y-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Event Portal</h1>
        <p className="text-gray-600">Choose your role to sign up</p>

        <div className="space-y-4">
          <button
            onClick={handleAdminSignup}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up as Admin
          </button>

          <button
            onClick={handleUserSignup}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Sign Up as User
          </button>
        </div>
      </div>
    </div>
  );
}
