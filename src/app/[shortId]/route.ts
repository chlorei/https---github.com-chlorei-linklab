// src/app/[shortId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/dbConnect";
import Link from "@/lib/db/models/Link";
import * as VisitController from "@/lib/controllers/visit.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function asSafeHttpUrl(s: string): string | null {
  try {
    const u = new URL(s);
    if (u.protocol === "http:" || u.protocol === "https:") return u.toString();
    return null;
  } catch {
    return null;
  }
}

// ...


export async function GET(
  
  request: NextRequest,
  context: { params: Promise<{ shortId: string }> } 
): Promise<Response> {
  const { shortId } = await context.params; 
  await dbConnect();
  const link = await Link.findOne({ shortId, isActive: true });
  const ip = request.headers.get("x-forwarded-for") ?? undefined;
  const ua = request.headers.get("user-agent") ?? undefined;

  await Promise.all([
    VisitController.addOne({ linkId: link._id, ip, userAgent: ua, creatorUserId: link.userId}),
    Link.updateOne({ _id: link._id }, { isActive: true, $inc: { clicks: 1 } }),
  ]);
  const safe = asSafeHttpUrl(link.originalUrl);
  if (!safe) {
    return NextResponse.json({ ok: false, error: "Invalid target URL" }, { status: 400 });
  }

  return NextResponse.redirect(link.originalUrl, { status: 302 });
}