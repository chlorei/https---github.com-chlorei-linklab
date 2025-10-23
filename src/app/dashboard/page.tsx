import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/auth";
import { getLinksByUserId } from "@/lib/queries/links";
import { countByUserId } from "@/lib/queries/visits";
import { getLast7DaysVisitsByUser } from "@/lib/queries/activity";
import { getAllLocationsByUserId } from "@/lib/queries/location";
import DashboardClient from "./DashboardClient";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const s = await getSession();
  if (!s) redirect("/signin");

  const [links, visitsCount, activity, locationsBundle] = await Promise.all([
    getLinksByUserId(s.id),
    countByUserId(s.id),
    getLast7DaysVisitsByUser(s.id, "Europe/Berlin", 7),
    getAllLocationsByUserId(s.id),
  ]);
  console.log("Locations bundle in DashboardPage:", locationsBundle);
  const { all: locations, topCountry } = locationsBundle;

  return (
    <DashboardClient
      greetingsText={`Welcome back, ${s.name}!`}
      links={links}
      amountVisits={visitsCount}
      activity={activity}
      locations={locations}
      topCountry={topCountry}
    />
  );
}