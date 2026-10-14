"use client";

import Link from "next/link";
import React, { useState } from "react";
import PasswordInput from "@/app/components/PasswordInput/PasswordInput";
import AuthLayout from "@/app/components/AuthLayout/AuthLayout";
import { Button } from "@/app/components/UI/Button/Button";
import { Field, FormMessage, Input } from "@/app/components/UI/Field/Field";

export default function SignUpPage() {
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);

    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "");
    if (get("password") !== get("password2")) return setMsg("The passwords don't match.");

    setPending(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: get("firstName").trim(),
          lastName: get("lastName").trim(),
          email: get("email").trim().toLowerCase(),
          password: get("password"),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setMsg(data?.error || `Couldn't create the account (error ${res.status}).`);
        return;
      }
      // the account is signed in right away; a full navigation refreshes the header session
      window.location.assign("/dashboard");
    } catch {
      setMsg("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      description="Free. Keep your links, group them into projects and see who clicks."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/signin" className="font-medium text-link underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" htmlFor="firstName">
            <Input id="firstName" name="firstName" autoComplete="given-name" required maxLength={100} autoFocus />
          </Field>
          <Field label="Last name" htmlFor="lastName">
            <Input id="lastName" name="lastName" autoComplete="family-name" required maxLength={100} />
          </Field>
        </div>
        <Field label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label="Password" htmlFor="password" hint="At least 8 characters.">
          <PasswordInput id="password" name="password" autoComplete="new-password" required minLength={8} maxLength={128} />
        </Field>
        <Field label="Repeat password" htmlFor="password2">
          <PasswordInput id="password2" name="password2" autoComplete="new-password" required minLength={8} maxLength={128} />
        </Field>
        {msg && <FormMessage tone="error">{msg}</FormMessage>}
        <Button type="submit" variant="primary" size="lg" disabled={pending} className="w-full">
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
