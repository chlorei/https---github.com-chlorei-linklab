"use client";

import React, { useState } from "react";
import { useFormStatus } from "react-dom";
import { LogOut } from "lucide-react";
import PasswordInput from "@/app/components/PasswordInput/PasswordInput";
import PageHeader from "@/app/components/UI/PageHeader/PageHeader";
import { Button } from "@/app/components/UI/Button/Button";
import { Field, FormMessage, Input } from "@/app/components/UI/Field/Field";
import {
  changePasswordAction,
  logoutAction,
  signOutOtherSessionsAction,
  updateProfileAction,
} from "@/app/actions/account";
import type { Profile } from "@/lib/services/user.service";

type Status = { kind: "ok" | "error"; text: string } | null;

function SubmitBtn({ children, pendingText = "Saving…" }: { children: React.ReactNode; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" disabled={pending}>
      {pending ? pendingText : children}
    </Button>
  );
}

function StatusLine({ status }: { status: Status }) {
  if (!status) return null;
  return <FormMessage tone={status.kind === "ok" ? "success" : "error"}>{status.text}</FormMessage>;
}

/** Settings row: what it is on the left, the controls on the right. */
function SettingsSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-b border-line py-10 md:grid-cols-[18rem_minmax(0,1fr)] md:gap-12">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-1.5 text-sm text-ink-soft">{description}</p>
      </div>
      <div className="max-w-xl">{children}</div>
    </section>
  );
}

function ProfileForm({ profile }: { profile: Profile }) {
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [email, setEmail] = useState(profile.email);
  const [status, setStatus] = useState<Status>(null);

  const emailChanged = email.trim().toLowerCase() !== profile.email;
  const dirty = firstName !== profile.firstName || lastName !== profile.lastName || emailChanged;

  async function onUpdate(formData: FormData) {
    setStatus(null);
    const res = await updateProfileAction(formData);
    setStatus(res.ok ? { kind: "ok", text: "Profile saved" } : { kind: "error", text: res.error });
  }

  return (
    <form action={onUpdate} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" htmlFor="firstName">
          <Input id="firstName" name="firstName" required maxLength={100} value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" />
        </Field>
        <Field label="Last name" htmlFor="lastName">
          <Input id="lastName" name="lastName" required maxLength={100} value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" />
        </Field>
      </div>
      <Field label="Email" htmlFor="email">
        <Input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      </Field>

      {emailChanged && (
        <Field label="Current password" htmlFor="profile-current-password" hint="Needed to change your email.">
          <PasswordInput id="profile-current-password" name="currentPassword" autoComplete="current-password" required />
        </Field>
      )}

      <StatusLine status={status} />

      <div className="flex gap-2">
        <SubmitBtn>Save profile</SubmitBtn>
        {dirty && (
          <Button
            variant="ghost"
            onClick={() => {
              setFirstName(profile.firstName);
              setLastName(profile.lastName);
              setEmail(profile.email);
              setStatus(null);
            }}
          >
            Discard changes
          </Button>
        )}
      </div>
    </form>
  );
}

function PasswordForm() {
  const [status, setStatus] = useState<Status>(null);
  const [formKey, setFormKey] = useState(0);

  async function onChange(formData: FormData) {
    setStatus(null);
    if (formData.get("newPassword") !== formData.get("confirmPassword")) {
      setStatus({ kind: "error", text: "The new passwords don't match." });
      return;
    }
    const res = await changePasswordAction(formData);
    if (res.ok) {
      setFormKey((k) => k + 1); // clears the fields
      setStatus({ kind: "ok", text: "Password changed. Your other devices were signed out." });
    } else {
      setStatus({ kind: "error", text: res.error });
    }
  }

  return (
    <form key={formKey} action={onChange} className="flex flex-col gap-5">
      <Field label="Current password" htmlFor="currentPassword">
        <PasswordInput id="currentPassword" name="currentPassword" autoComplete="current-password" required />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="New password" htmlFor="newPassword" hint="At least 8 characters.">
          <PasswordInput id="newPassword" name="newPassword" autoComplete="new-password" required minLength={8} maxLength={128} />
        </Field>
        <Field label="Repeat new password" htmlFor="confirmPassword">
          <PasswordInput id="confirmPassword" name="confirmPassword" autoComplete="new-password" required minLength={8} maxLength={128} />
        </Field>
      </div>
      <StatusLine status={status} />
      <div>
        <SubmitBtn pendingText="Changing…">Change password</SubmitBtn>
      </div>
    </form>
  );
}

function SessionsForm() {
  const [status, setStatus] = useState<Status>(null);
  const [pending, setPending] = useState(false);

  async function signOutOthers() {
    setPending(true);
    setStatus(null);
    const res = await signOutOtherSessionsAction();
    setPending(false);
    setStatus(
      res.ok
        ? { kind: "ok", text: res.data?.count ? `Signed out ${res.data.count} other ${res.data.count === 1 ? "device" : "devices"}.` : "No other devices were signed in." }
        : { kind: "error", text: res.error }
    );
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={signOutOthers} disabled={pending}>
          {pending ? "Signing out…" : "Sign out other devices"}
        </Button>
        <form action={logoutAction}>
          <Button type="submit" variant="ghost">
            <LogOut size={16} />
            Log out
          </Button>
        </form>
      </div>
      <StatusLine status={status} />
    </div>
  );
}

export default function AccountClient({ profile }: { profile: Profile }) {
  return (
    <main className="shell pt-10 sm:pt-14">
      <PageHeader title="Account" description={profile.email} />
      <SettingsSection title="Profile" description="Your name is shown on your overview page.">
        <ProfileForm profile={profile} />
      </SettingsSection>
      <SettingsSection title="Password" description="Changing it signs you out everywhere except this browser.">
        <PasswordForm />
      </SettingsSection>
      <SettingsSection title="Sessions" description="Lost a device or signed in on a shared computer? End those sessions here.">
        <SessionsForm />
      </SettingsSection>
    </main>
  );
}
