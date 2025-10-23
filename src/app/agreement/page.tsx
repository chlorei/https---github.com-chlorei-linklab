"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { acceptAgreement } from "../actions/acceptAgreement";

export default function AgreementPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleAccept = () => {
    startTransition(async () => {
      await acceptAgreement(); // вызов server action
      console.log("✅ acceptAgreement executed");
      router.replace("/"); // редирект
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">User Agreement</h1>
        <p className="text-gray-600 mb-6 text-sm">
          We use minimal technical data (like IP address) for analytics and security.
        </p>
        <button
          onClick={handleAccept}
          disabled={pending}
          className="bg-black text-white py-2.5 rounded-xl w-full hover:bg-gray-800 transition disabled:opacity-60"
        >
          {pending ? "Please wait…" : "I Agree"}
        </button>
      </div>
    </div>
  );
}