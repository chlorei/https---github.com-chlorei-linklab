import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/auth";
import { assignLinksToProject } from "@/lib/services/link.service";
import { handleRouteError, readJson, toObjectId } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await requireSession();
    const projectId = toObjectId(new URL(req.url).searchParams.get("projectid"), "projectid");
    const { linkIds } = ((await readJson(req)) ?? {}) as { linkIds?: unknown };
    const modified = await assignLinksToProject(session.id, projectId, linkIds);
    return NextResponse.json({ ok: true, modified });
  } catch (err) {
    return handleRouteError(err, "add links to project");
  }
}
