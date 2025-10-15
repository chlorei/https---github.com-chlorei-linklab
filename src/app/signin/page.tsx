"use client";

import Link from 'next/link'
import React from 'react'

const Main = () => {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const form = e.currentTarget;
  const fd = new FormData(form);
  const email = (fd.get("email") as string)?.trim().toLowerCase();
  const password = (fd.get("password") as string) ?? "";

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    let data: { ok?: boolean; error?: string };
    try { data = await res.json(); }
    catch {
      const txt = await res.text();
      throw new Error(`Bad JSON (${res.status}): ${txt}`);
    }

    if (!res.ok || !data?.ok) {
      throw new Error(data?.error || `Request failed (${res.status})`);
    }

    window.location.href = "/dashboard";
  } catch (err: unknown) {
    if (err instanceof Error) {
      alert(err.message || "Something went wrong.");
      console.error("Login error:", err);
    } else {
      alert("Something went wrong.");
      console.error("Login error:", err);
    }
  }
};

  return (
    <div className="container mx-auto px-4 text-primary-text">
      {/* центрируем по высоте и ширине */}
      <div className="flex min-h-screen items-center justify-center py-8 sm:py-12">
        {/* карточка с токенами темы */}
        <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="text-center font-bold text-2xl sm:text-3xl text-primary-text">
            Sign in
          </h2>

          <form className="mt-6 flex flex-col gap-5 text-foreground" action="" onSubmit={handleSubmit}>
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                className="h-11 w-full rounded-2xl border px-4 outline-none transition
                           focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
              />
            </div>

            <div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                autoComplete="password"
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
              Sign in
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Don’t have an account?{' '}
              <Link href="/signup" className="underline underline-offset-4 hover:no-underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Main