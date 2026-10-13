import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/auth";
import { updateProject } from "@/lib/services/project.service";
import { handleRouteError, readJson, toObjectId } from "@/lib/http";

export const runtime = "nodejs";

export async function PATCH(req: Request) {
  try {
    const session = await requireSession();
    const { projectId, ...patch } = ((await readJson(req)) ?? {}) as Record<string, unknown>;
    const project = await updateProject(session.id, toObjectId(projectId, "projectId"), patch);
    return NextResponse.json({ ok: true, project });
  } catch (err) {
    return handleRouteError(err, "update project");
  }
}
