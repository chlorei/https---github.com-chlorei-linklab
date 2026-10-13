import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/auth";
import { getLinkOwner } from "@/lib/auth/anonymous";
import { createLink, listLinksByUser } from "@/lib/services/link.service";
import { handleRouteError, readJson } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // the owner comes from the session (or the anonymous browser cookie), never from the body
    const owner = (await getLinkOwner({ create: true }))!;
    const link = await createLink(owner, await readJson(req));
    const shortUrl = new URL(`/${link.shortId}`, req.url).toString();
    return NextResponse.json({ ok: true, link, shortUrl }, { status: 201 });
  } catch (err) {
    return handleRouteError(err, "create link");
  }
}

export async function GET() {
  try {
    const session = await requireSession();
    return NextResponse.json({ ok: true, links: await listLinksByUser(session.id) });
  } catch (err) {
    return handleRouteError(err, "list links");
  }
}
