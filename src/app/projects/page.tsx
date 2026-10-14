import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/auth";
import { listProjects } from "@/lib/services/project.service";
import { listLinksByUser } from "@/lib/services/link.service";
import { getProjectsActivity } from "@/lib/services/analytics.service";
import { getRequestTimeZone } from "@/lib/timezone";
import ProjectsClient from "./ProjectsClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const session = await getSession();
  if (!session) redirect("/signin?next=/projects");

  const [projects, links] = await Promise.all([listProjects(session.id), listLinksByUser(session.id)]);
  const activity = await getProjectsActivity(projects.map((p) => p._id), await getRequestTimeZone());

  return <ProjectsClient projects={projects} links={links} activity={activity} />;
}
