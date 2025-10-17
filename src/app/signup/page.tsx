"use client";

import Link from "next/link";
import React, { useState } from "react";

const Main = () => {
  const [msg, setMsg] = useState<string | null>(null);

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
  e.preventDefault();
  setMsg(null);

  const form = e.currentTarget;

  const firstName = (form.elements.namedItem("firstName") as HTMLInputElement)?.value.trim() || "";
  const lastName  = (form.elements.namedItem("lastName")  as HTMLInputElement)?.value.trim() || "";
  const email     = (form.elements.namedItem("email")     as HTMLInputElement)?.value.trim().toLowerCase() || "";
  const email2    = (form.elements.namedItem("email2")    as HTMLInputElement)?.value.trim().toLowerCase() || "";
  const pass      = (form.elements.namedItem("password")  as HTMLInputElement)?.value || "";
  const pass2     = (form.elements.namedItem("password2") as HTMLInputElement)?.value || "";

  if (email !== email2) { setMsg("Emails do not match"); return; }
  if (pass  !== pass2)  { setMsg("Passwords do not match"); return; }

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password: pass, 
      }),
    });

    type RegisterResponse = { message?: string };
    const data: RegisterResponse = await res.json().catch(() => ({} as RegisterResponse));
    if (!res.ok) {
      setMsg(data?.message || `Error ${res.status}`);
      return;
    }
    setMsg(data?.message || "Registered");
    form.reset();
  } catch (err) {
    console.error(err);
    setMsg("Network error");
  }
};
  
  return (
    <div className="container mx-auto px-4 text-primary-text">
      <div className="flex min-h-screen w-full flex-col items-center justify-center py-8 sm:py-12">
        <div className="w-full max-w-xl rounded-2xl border p-6 sm:p-8">
          <h2 className="text-center font-bold text-2xl sm:text-3xl">Sign Up</h2>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                name="firstName"
                type="text"
                placeholder="First name"
                autoComplete="given-name"
                className="h-11 w-full rounded-2xl border px-4 outline-none transition
                           focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
              />

              <input
                name="lastName"
                type="text"
                placeholder="Last name"
                autoComplete="family-name"
                className="h-11 w-full rounded-2xl border px-4 outline-none transition
                           focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
              />
            </div>

            <div className="flex flex-col gap-3">
              <input
                name="email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                required
                className="h-11 w-full rounded-2xl border px-4 outline-none transition
                           focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
              />

              <input
                name="email2"
                type="email"
                placeholder="Repeat Email"
                autoComplete="email"
                required
                className="h-11 w-full rounded-2xl border px-4 outline-none transition
                           focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
              />

            </div>

            <div className="flex flex-col gap-3">
              <input
                name="password"
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                required
                minLength={8}
                className="h-11 w-full rounded-2xl border px-4 outline-none transition
                           focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
              />

              <input
                name="password2"
                type="password"
                placeholder="Repeat Password"
                autoComplete="new-password"
                required
                minLength={8}
                className="h-11 w-full rounded-2xl border px-4 outline-none transition
                           focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
              />

            </div>

            <button
              type="submit"
              className="w-full sm:w-2/3 lg:w-1/2 self-center rounded-2xl border px-5 py-3 font-semibold
                         transition hover:bg-hover-button-bg hover:text-hover-button-text hover:shadow-lg hover:-translate-y-0.5
                         active:translate-y-0 active:shadow-md
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2"
            >
              
              Sign up
            </button>

            {msg && (
              <p className="text-center font-bold text-primary-text text-sm mt-2">{msg}</p>
            )}

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="underline underline-offset-4 hover:no-underline"
              >
                Sign in
              </Link>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Main;