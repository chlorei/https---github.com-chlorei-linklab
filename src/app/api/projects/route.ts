import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/auth";
import { createProject, listProjects } from "@/lib/services/project.service";
import { handleRouteError, readJson } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await requireSession();
    return NextResponse.json({ ok: true, projects: await listProjects(session.id) });
  } catch (err) {
    return handleRouteError(err, "list projects");
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireSession();
    const project = await createProject(session.id, await readJson(req));
    return NextResponse.json({ ok: true, project }, { status: 201 });
  } catch (err) {
    return handleRouteError(err, "create project");
  }
}
