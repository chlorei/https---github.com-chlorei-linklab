"use client";

import React, { useMemo, useState } from "react";
import { LogOut, User, Mail } from "lucide-react";
import TextType from "@/app/components/UI/TextType/TextType";
import { logoutAction, updateProfileAction } from "@/app/actions/account";
import { useFormStatus } from "react-dom";

type SessionLite = { id: string; name: string; email: string };

function SubmitBtn({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving..." : children}
    </button>
  );
}

export default function AccountClient({
  initialSession,
}: {
  initialSession: SessionLite;
}) {
  const [firstInit, lastInit] = useMemo(() => {
    const parts = (initialSession.name || "").trim().split(/\s+/);
    return [parts[0] ?? "", parts.slice(1).join(" ") ?? ""];
  }, [initialSession.name]);

  const [firstName, setFirstName] = useState(firstInit);
  const [lastName, setLastName] = useState(lastInit);
  const [email, setEmail] = useState(initialSession.email);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function onUpdate(formData: FormData) {
    setError(null);
    setOk(null);
    try {
      await updateProfileAction(formData);
      setOk("Profile updated successfully");
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Update failed");
      }
    }
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-20">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <TextType
              textColors={["text-foreground"]}
              text={["Account Settings"]}
              typingSpeed={25}
              pauseDuration={1500}
              showCursor
              cursorCharacter=""
              className="text-3xl font-bold text-foreground sm:text-4xl"
            />
            <p className="mt-2 text-muted-foreground">
              Manage your account information
            </p>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm font-semibold text-destructive transition-all hover:bg-destructive hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-card-foreground">
            Profile Information
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your profile information below
          </p>

          <form action={onUpdate} className="mt-6 flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  placeholder="First name"
                  className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-card-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-foreground/30 focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <input
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                placeholder="Last name"
                className="w-full rounded-xl border border-border bg-card py-3 px-4 text-card-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-foreground/30 focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                required
                className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-card-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-foreground/30 focus:ring-2 focus:ring-ring/20"
              />
            </div>

            {/* Messages */}
            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            {ok && (
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-3 text-sm text-green-600">
                {ok}
              </div>
            )}

            {/* Actions */}
            <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setFirstName(firstInit);
                  setLastName(lastInit);
                  setEmail(initialSession.email);
                  setError(null);
                  setOk(null);
                }}
                className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-card-foreground transition-all hover:bg-secondary"
              >
                Cancel
              </button>
              <SubmitBtn>Save Changes</SubmitBtn>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
