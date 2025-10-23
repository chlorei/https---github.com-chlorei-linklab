"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CookieNotice() {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("cookieConsent");
    if (!stored) setAccepted(false);
  }, []);

  const accept = () => {
    localStorage.setItem("cookieConsent", "true");
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-700 p-4 text-center text-sm flex flex-col sm:flex-row justify-center items-center gap-2 z-50">
      <span>
        Relinxr uses minimal cookies only for session purposes.{" "}
        <Link href="/privacy" className="underline text-blue-400">
          Learn more
        </Link>
        .
      </span>
      <button
        onClick={accept}
        className="mt-2 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg text-sm transition"
      >
        Accept
      </button>
    </div>
  );
}