"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import TextType from "@/app/components/UI/TextType/TextType";
import PasswordInput from "@/app/components/PasswordInput/PasswordInput";
import {
  changePasswordAction,
  logoutAction,
  signOutOtherSessionsAction,
  updateProfileAction,
} from "@/app/actions/account";
import type { Profile } from "@/lib/services/user.service";

const inputClass =
  "h-11 w-full rounded-2xl border px-4 outline-none transition focus:ring-2 focus:ring-black/60 focus:ring-offset-2";
const buttonClass =
  "rounded-2xl border px-5 py-3 font-semibold transition hover:bg-hover-button-bg hover:text-hover-button-text " +
  "disabled:opacity-60 disabled:cursor-not-allowed";

function SubmitBtn({ children, pendingText = "Saving..." }: { children: React.ReactNode; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClass}>
      {pending ? pendingText : children}
    </button>
  );
}

type Status = { kind: "ok" | "error"; text: string } | null;

function StatusLine({ status }: { status: Status }) {
  if (!status) return null;
  return (
    <p role="status" className={`text-sm ${status.kind === "ok" ? "text-green-600" : "text-red-500"}`}>
      {status.text}
    </p>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col border-2 rounded-2xl p-5">
      <h3 className="font-bold w-full">{title}</h3>
      <p className="text-sm w-full text-gray-500 mt-2">{subtitle}</p>
      {children}
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
    setStatus(res.ok ? { kind: "ok", text: "Profile updated" } : { kind: "error", text: res.error });
  }

  return (
    <form action={onUpdate} className="mt-6 flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input name="firstName" required maxLength={100} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" autoComplete="given-name" className={inputClass} />
        <input name="lastName" required maxLength={100} value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" autoComplete="family-name" className={inputClass} />
      </div>
      <input name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" autoComplete="email" className={inputClass} />

      {emailChanged && (
        <div>
          <p className="mb-2 text-sm text-gray-500">Confirm with your current password to change the email.</p>
          <PasswordInput name="currentPassword" placeholder="Current password" autoComplete="current-password" required />
        </div>
      )}

      <StatusLine status={status} />

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          disabled={!dirty}
          onClick={() => {
            setFirstName(profile.firstName);
            setLastName(profile.lastName);
            setEmail(profile.email);
            setStatus(null);
          }}
          className={buttonClass}
        >
          Cancel
        </button>
        <SubmitBtn>Save Changes</SubmitBtn>
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
      setStatus({ kind: "error", text: "New passwords do not match" });
      return;
    }
    const res = await changePasswordAction(formData);
    if (res.ok) {
      setFormKey((k) => k + 1); // clears the fields
      setStatus({ kind: "ok", text: "Password changed. Other devices were signed out." });
    } else {
      setStatus({ kind: "error", text: res.error });
    }
  }

  return (
    <form key={formKey} action={onChange} className="mt-6 flex flex-col gap-4">
      <PasswordInput name="currentPassword" placeholder="Current password" autoComplete="current-password" required />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PasswordInput name="newPassword" placeholder="New password" autoComplete="new-password" required minLength={8} maxLength={128} />
        <PasswordInput name="confirmPassword" placeholder="Repeat new password" autoComplete="new-password" required minLength={8} maxLength={128} />
      </div>
      <StatusLine status={status} />
      <div className="flex justify-end">
        <SubmitBtn pendingText="Changing...">Change password</SubmitBtn>
      </div>
    </form>
  );
}

function SessionsCard() {
  const [status, setStatus] = useState<Status>(null);
  const [pending, setPending] = useState(false);

  async function signOutOthers() {
    setPending(true);
    setStatus(null);
    const res = await signOutOtherSessionsAction();
    setPending(false);
    setStatus(
      res.ok
        ? { kind: "ok", text: res.data?.count ? `Signed out ${res.data.count} other session(s).` : "No other active sessions." }
        : { kind: "error", text: res.error }
    );
  }

  return (
    <Card title="Sessions" subtitle="Lost a device or signed in somewhere public? End every session except this one.">
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <StatusLine status={status} />
        <button type="button" onClick={signOutOthers} disabled={pending} className={`${buttonClass} sm:ml-auto`}>
          {pending ? "Signing out..." : "Sign out other devices"}
        </button>
      </div>
    </Card>
  );
}

export default function AccountClient({ profile }: { profile: Profile }) {
  return (
    <div className="container text-primary-text mx-auto px-4 mt-40 mb-20">
      <div className="flex justify-between flex-col md:flex-row w-full mb-10 gap-5">
        <TextType
          textColors={["text-primary-text"]}
          text={["Account Settings"]}
          typingSpeed={25}
          pauseDuration={1500}
          showCursor
          cursorCharacter=""
          className="text-4xl text-primary-text text-center md:text-left"
        />

        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center justify-center w-full sm:w-40 rounded-2xl border p-2 font-semibold
                       bg-red-400 text-primary-text transition hover:bg-red-600 hover:text-hover-button-text hover:shadow-lg
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          >
            <Image src="/icons/log-out.svg" alt="" width={22} height={22} className="mr-2" />
            Logout
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-6">
        <Card title="Profile Information" subtitle="Update your profile information below">
          <ProfileForm profile={profile} />
        </Card>
        <Card title="Password" subtitle="Changing the password signs out all other devices.">
          <PasswordForm />
        </Card>
        <SessionsCard />
      </div>
    </div>
  );
}
