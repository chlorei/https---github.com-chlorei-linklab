"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { acceptAgreement } from "../actions/acceptAgreement";
import AuthLayout from "@/app/components/AuthLayout/AuthLayout";
import { Button } from "@/app/components/UI/Button/Button";
import { FormMessage } from "@/app/components/UI/Field/Field";

export default function AgreementForm({ next }: { next: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAccept = () => {
    startTransition(async () => {
      setError(null);
      const res = await acceptAgreement();
      if (res.ok) router.replace(next);
      else setError(res.error);
    });
  };

  return (
    <AuthLayout
      title="Before you continue"
      description={
        <>
          To count clicks on your links, Relinxr records each visitor&apos;s IP address, browser and country. Read the{" "}
          <Link href="/privacy" className="text-link underline underline-offset-4">
            privacy policy
          </Link>{" "}
          for what we keep and for how long.
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <Button variant="primary" size="lg" onClick={handleAccept} disabled={pending} className="w-full">
          {pending ? "One moment…" : "I agree"}
        </Button>
        {error && <FormMessage tone="error">{error}</FormMessage>}
      </div>
    </AuthLayout>
  );
}
