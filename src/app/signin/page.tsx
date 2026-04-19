"use client";

import { useState } from "react";
import { loginAction } from "@/app/actions/auth";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function SignIn() {
  const [error, setError] = useState<string | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  async function handle(formData: FormData) {
    setError(null);
    setLoading(true);
    try {
      await loginAction(formData);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message || "Login failed");
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex min-h-screen items-center justify-center py-8 sm:py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-card-foreground sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <form className="flex flex-col gap-4" action={handle}>
            {/* Email */}
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

            {/* Password */}
            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                name="password"
                type={show ? "text" : "password"}
                placeholder="Password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-11 text-card-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-foreground/30 focus:ring-2 focus:ring-ring/20"
              />
              <button
                type="button"
                onClick={() => setShow((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              {"Don't have an account? "}
              <Link
                href="/signup"
                className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
