import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/auth";
import { safeNextPath } from "@/app/utils/safeNextPath";
import SignInForm from "./SignInForm";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const next = safeNextPath((await searchParams).next);
  if (await getSession()) redirect(next);
  return <SignInForm next={next} />;
}
