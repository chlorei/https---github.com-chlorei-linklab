import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/auth";
import { deleteProject } from "@/lib/services/project.service";
import { handleRouteError, readJson, toObjectId } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await requireSession();
    const { projectId } = ((await readJson(req)) ?? {}) as { projectId?: unknown };
    await deleteProject(session.id, toObjectId(projectId, "projectId"));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleRouteError(err, "delete project");
  }
}
