import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/auth";
import { getLinksByUserId } from "@/lib/queries/links";
import LinksClient from "./LinksClient";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function LinksPage() {
  const s = await getSession();
  if (!s) redirect("/signin");

  const links = await getLinksByUserId(s.id);
  return <LinksClient links={links} />;
}