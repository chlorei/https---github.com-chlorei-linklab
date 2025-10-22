"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
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
      className="rounded-2xl border px-5 py-3 font-semibold transition
                 hover:bg-hover-button-bg hover:text-hover-button-text
                 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? "Saving..." : children}
    </button>
  );
}

export default function AccountClient({ initialSession }: { initialSession: SessionLite }) {
  // разбираем имя аккуратно (без миганий)
  const [firstInit, lastInit] = useMemo(() => {
    const parts = (initialSession.name || "").trim().split(/\s+/);
    return [parts[0] ?? "", parts.slice(1).join(" ") ?? ""];
  }, [initialSession.name]);

  const [firstName, setFirstName] = useState(firstInit);
  const [lastName,  setLastName]  = useState(lastInit);
  const [email,     setEmail]     = useState(initialSession.email);
  const [error,     setError]     = useState<string | null>(null);
  const [ok,        setOk]        = useState<string | null>(null);

  async function onUpdate(formData: FormData) {
    setError(null); setOk(null);
    try {
      await updateProfileAction(formData); // server action сделает валидацию/сохранение
      setOk("Profile updated");
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Update failed");
      }
    }
  }

  return (
    <div className="container text-primary-text mx-auto px-4 mt-40">
      <div className="flex justify-between flex-col md:flex-row w-full mb-10 gap-5">
        <div>
          <TextType
            textColors={["text-primary-text"]}
            text={["Account Settings"]}
            typingSpeed={25}
            pauseDuration={1500}
            showCursor
            cursorCharacter=""
            className="text-4xl text-primary-text text-center md:text-left"
          />
        </div>

        {/* ЛОГАУТ через server action — без fetch и без window.location */}
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center justify-center w-full sm:w-40 rounded-2xl border p-2 font-semibold
                       bg-red-400 text-primary-text transition hover:bg-red-600 hover:text-hover-button-text hover:shadow-lg
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          >
            <Image src="/icons/log-out.svg" alt="Logout Icon" width={22} height={22} className="mr-2" />
            Logout
          </button>
        </form>
      </div>

      <div className="flex flex-col border-2 rounded-2xl p-5">
        <h3 className="font-bold w-full">Profile Information</h3>
        <p className="text-sm w-full text-gray-500 mt-2">Update your profile information below</p>

        <form action={onUpdate} className="mt-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              placeholder="First name"
              className="h-11 w-full rounded-2xl border px-4 outline-none transition
                         focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
            />
            <input
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              placeholder="Last name"
              className="h-11 w-full rounded-2xl border px-4 outline-none transition
                         focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
            />
          </div>

          <input
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            required
            className="h-11 w-full rounded-2xl border px-4 outline-none transition
                       focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
          />

          {/* Сообщения об ошибке/успехе */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {ok && <p className="text-green-600 text-sm">{ok}</p>}

          <div className="flex gap-3 justify-end">
            <button
              type="button" // ← НЕ submit
              onClick={() => {
                setFirstName(firstInit);
                setLastName(lastInit);
                setEmail(initialSession.email);
                setError(null); setOk(null);
              }}
              className="rounded-2xl border px-5 py-3 font-semibold transition hover:bg-hover-button-bg hover:text-hover-button-text"
            >
              Cancel
            </button>

            <SubmitBtn>Save Changes</SubmitBtn>
          </div>
        </form>
      </div>
    </div>
  );
}