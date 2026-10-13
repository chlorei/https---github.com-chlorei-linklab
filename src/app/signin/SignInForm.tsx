"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import PasswordInput from "@/app/components/PasswordInput/PasswordInput";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full sm:w-2/3 lg:w-1/2 self-center rounded-2xl border px-5 py-3 font-semibold
                 transition hover:bg-hover-button-bg hover:text-hover-button-text hover:shadow-lg hover:-translate-y-0.5
                 active:translate-y-0 active:shadow-md disabled:opacity-60
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2"
    >
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}

export default function SignInForm({ next }: { next: string }) {
  const [error, setError] = useState<string | null>(null);

  async function handle(formData: FormData) {
    setError(null);
    // on success the action redirects, so a result means failure
    const res = await loginAction(formData);
    if (!res.ok) setError(res.error);
  }

  return (
    <div className="container mx-auto px-4 text-primary-text">
      <div className="flex min-h-screen items-center justify-center py-8 sm:py-12">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h1 className="text-center font-bold text-2xl sm:text-3xl text-primary-text">Sign in</h1>

          <form className="mt-6 flex flex-col gap-5 text-foreground" action={handle}>
            <input type="hidden" name="next" value={next} />
            <input
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              required
              className="h-11 w-full rounded-2xl border px-4 outline-none transition focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
            />
            <PasswordInput name="password" placeholder="Password" autoComplete="current-password" required />

            {error && (
              <p role="alert" className="text-center text-red-500 text-sm">
                {error}
              </p>
            )}

            <SubmitBtn />

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4 hover:no-underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
