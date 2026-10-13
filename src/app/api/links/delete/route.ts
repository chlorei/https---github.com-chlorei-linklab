import { NextResponse } from "next/server";
import { HttpError } from "@/lib/auth/auth";
import { getLinkOwner } from "@/lib/auth/anonymous";
import { deleteLink } from "@/lib/services/link.service";
import { handleRouteError, readJson, toObjectId } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const owner = await getLinkOwner();
    if (!owner) throw new HttpError(404, "Link not found");
    const { linkId } = ((await readJson(req)) ?? {}) as { linkId?: unknown };
    await deleteLink(owner, toObjectId(linkId, "linkId"));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleRouteError(err, "delete link");
  }
}
