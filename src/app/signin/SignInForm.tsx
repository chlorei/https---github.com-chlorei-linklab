"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import PasswordInput from "@/app/components/PasswordInput/PasswordInput";
import AuthLayout from "@/app/components/AuthLayout/AuthLayout";
import { Button } from "@/app/components/UI/Button/Button";
import { Field, FormMessage, Input } from "@/app/components/UI/Field/Field";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" size="lg" disabled={pending} className="w-full">
      {pending ? "Signing in…" : "Sign in"}
    </Button>
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
    <AuthLayout
      title="Sign in"
      description="Welcome back. Your links and their stats are waiting."
      footer={
        <>
          New to Relinxr?{" "}
          <Link href="/signup" className="font-medium text-link underline-offset-4 hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-5" action={handle}>
        <input type="hidden" name="next" value={next} />
        <Field label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" autoComplete="email" required autoFocus />
        </Field>
        <Field label="Password" htmlFor="password">
          <PasswordInput id="password" name="password" autoComplete="current-password" required />
        </Field>
        {error && <FormMessage tone="error">{error}</FormMessage>}
        <SubmitBtn />
      </form>
    </AuthLayout>
  );
}
