"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { acceptAgreement } from "../actions/acceptAgreement";

export default function AgreementForm({ next }: { next: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAccept = () => {
    startTransition(async () => {
      setError(null);
      const res = await acceptAgreement();
      if (res.ok) router.replace(next);
      else setError(res.error);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-primary-text">
      <div className="rounded-2xl border bg-card shadow p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">User Agreement</h1>
        <p className="text-gray-500 mb-6 text-sm">
          We use minimal technical data (like IP address) for analytics and security. See our{" "}
          <Link href="/privacy" className="underline underline-offset-4">
            Privacy Policy
          </Link>
          .
        </p>
        <button
          onClick={handleAccept}
          disabled={pending}
          className="bg-black text-white py-2.5 rounded-xl w-full hover:bg-gray-800 transition disabled:opacity-60"
        >
          {pending ? "Please wait…" : "I Agree"}
        </button>
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
