import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/auth";
import { listLinksByUser } from "@/lib/services/link.service";
import LinksClient from "./LinksClient";

export const dynamic = "force-dynamic";

export default async function LinksPage() {
  const s = await getSession();
  if (!s) redirect("/signin?next=/links");

  return <LinksClient links={await listLinksByUser(s.id)} />;
}
