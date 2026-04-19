"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

export default function SignUp() {
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [show1, setShow1] = useState<boolean>(false);
  const [show2, setShow2] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const form = e.currentTarget;
    const firstName = (form.elements.namedItem("firstName") as HTMLInputElement)?.value.trim() || "";
    const lastName = (form.elements.namedItem("lastName") as HTMLInputElement)?.value.trim() || "";
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value.trim().toLowerCase() || "";
    const email2 = (form.elements.namedItem("email2") as HTMLInputElement)?.value.trim().toLowerCase() || "";
    const pass = (form.elements.namedItem("password") as HTMLInputElement)?.value || "";
    const pass2 = (form.elements.namedItem("password2") as HTMLInputElement)?.value || "";

    if (email !== email2) {
      setMsg("Emails do not match");
      setLoading(false);
      return;
    }
    if (pass !== pass2) {
      setMsg("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password: pass }),
      });

      type RegisterResponse = { message?: string };
      const data: RegisterResponse = await res.json().catch(() => ({} as RegisterResponse));
      if (!res.ok) {
        setMsg(data?.message || `Error ${res.status}`);
        setLoading(false);
        return;
      }
      setMsg(data?.message || "Registered successfully!");
      window.location.href = "/signin";
      form.reset();
    } catch (err) {
      console.error(err);
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex min-h-screen w-full flex-col items-center justify-center py-8 sm:py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-card-foreground sm:text-3xl">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Get started with Relinxr for free
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  autoComplete="given-name"
                  className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-card-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-foreground/30 focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <input
                name="lastName"
                type="text"
                placeholder="Last name"
                autoComplete="family-name"
                className="w-full rounded-xl border border-border bg-card py-3 px-4 text-card-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-foreground/30 focus:ring-2 focus:ring-ring/20"
              />
            </div>

            {/* Email fields */}
            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                name="email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-card-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-foreground/30 focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <input
              name="email2"
              type="email"
              placeholder="Confirm email"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-border bg-card py-3 px-4 text-card-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-foreground/30 focus:ring-2 focus:ring-ring/20"
            />

            {/* Password fields */}
            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                name="password"
                type={show1 ? "text" : "password"}
                placeholder="Password"
                autoComplete="new-password"
                required
                minLength={8}
                className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-11 text-card-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-foreground/30 focus:ring-2 focus:ring-ring/20"
              />
              <button
                type="button"
                onClick={() => setShow1((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {show1 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="relative">
              <input
                name="password2"
                type={show2 ? "text" : "password"}
                placeholder="Confirm password"
                autoComplete="new-password"
                required
                minLength={8}
                className="w-full rounded-xl border border-border bg-card py-3 px-4 pr-11 text-card-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-foreground/30 focus:ring-2 focus:ring-ring/20"
              />
              <button
                type="button"
                onClick={() => setShow2((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {show2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Message */}
            {msg && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                {msg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
