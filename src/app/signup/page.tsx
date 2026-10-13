"use client";

import Link from "next/link";
import React, { useState } from "react";
import PasswordInput from "@/app/components/PasswordInput/PasswordInput";

const inputClass =
  "h-11 w-full rounded-2xl border px-4 outline-none transition focus:ring-2 focus:ring-black/60 focus:ring-offset-2";

export default function SignUpPage() {
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);

    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "");
    const email = get("email").trim().toLowerCase();

    if (email !== get("email2").trim().toLowerCase()) return setMsg("Emails do not match");
    if (get("password") !== get("password2")) return setMsg("Passwords do not match");

    setPending(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: get("firstName").trim(),
          lastName: get("lastName").trim(),
          email,
          password: get("password"),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setMsg(data?.error || `Error ${res.status}`);
        return;
      }
      // the account is signed in right away; a full navigation refreshes the header session
      window.location.assign("/dashboard");
    } catch {
      setMsg("Network error");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="container mx-auto px-4 text-primary-text">
      <div className="flex min-h-screen w-full flex-col items-center justify-center py-8 sm:py-12">
        <div className="w-full max-w-xl rounded-2xl border p-6 sm:p-8">
          <h1 className="text-center font-bold text-2xl sm:text-3xl">Sign Up</h1>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input name="firstName" type="text" placeholder="First name" autoComplete="given-name" required maxLength={100} className={inputClass} />
              <input name="lastName" type="text" placeholder="Last name" autoComplete="family-name" required maxLength={100} className={inputClass} />
            </div>

            <div className="flex flex-col gap-3">
              <input name="email" type="email" placeholder="Email" autoComplete="email" required className={inputClass} />
              <input name="email2" type="email" placeholder="Repeat Email" autoComplete="email" required className={inputClass} />
            </div>

            <div className="flex flex-col gap-3">
              <PasswordInput name="password" placeholder="Password" autoComplete="new-password" required minLength={8} maxLength={128} />
              <PasswordInput name="password2" placeholder="Repeat Password" autoComplete="new-password" required minLength={8} maxLength={128} />
            </div>

            {msg && (
              <p role="alert" className="text-center text-sm text-red-500">
                {msg}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full sm:w-2/3 lg:w-1/2 self-center rounded-2xl border px-5 py-3 font-semibold
                         transition hover:bg-hover-button-bg hover:text-hover-button-text hover:shadow-lg hover:-translate-y-0.5
                         active:translate-y-0 active:shadow-md disabled:opacity-60
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2"
            >
              {pending ? "Creating account..." : "Sign up"}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/signin" className="underline underline-offset-4 hover:no-underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
