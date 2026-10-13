import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/auth";
import { listLinksByUser } from "@/lib/services/link.service";
import { listProjects } from "@/lib/services/project.service";
import { countUserVisits, getUserActivity, getUserCountries, pickTopCountry } from "@/lib/services/analytics.service";
import { getRequestTimeZone } from "@/lib/timezone";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const s = await getSession();
  if (!s) redirect("/signin?next=/dashboard");

  const [links, visitsCount, activity, countries, projects] = await Promise.all([
    listLinksByUser(s.id),
    countUserVisits(s.id),
    getUserActivity(s.id, await getRequestTimeZone()),
    getUserCountries(s.id),
    listProjects(s.id),
  ]);

  return (
    <DashboardClient
      greetingsText={`Welcome back, ${s.name || "friend"}!`}
      links={links}
      amountVisits={visitsCount}
      activity={activity}
      topCountry={pickTopCountry(countries)}
      projectsCount={projects.length}
    />
  );
}
