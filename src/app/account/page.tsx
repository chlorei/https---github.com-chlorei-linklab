import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/auth";
import { getProfile } from "@/lib/services/user.service";
import AccountClient from "./AccountClient";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const s = await getSession();
  const profile = s ? await getProfile(s.id) : null;
  if (!profile) redirect("/signin?next=/account");

  return <AccountClient profile={profile} />;
}
