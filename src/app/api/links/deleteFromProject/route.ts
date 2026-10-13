import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/auth";
import { detachLinkFromProject } from "@/lib/services/link.service";
import { handleRouteError, toObjectId } from "@/lib/http";

export const runtime = "nodejs";

export async function DELETE(req: Request) {
  try {
    const session = await requireSession();
    const linkId = toObjectId(new URL(req.url).searchParams.get("id"), "id");
    const link = await detachLinkFromProject(session.id, linkId);
    return NextResponse.json({ ok: true, link });
  } catch (err) {
    return handleRouteError(err, "detach link");
  }
}
