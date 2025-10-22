// src/app/[shortId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/dbConnect";
import Link from "@/lib/db/models/Link";
import * as VisitController from "@/lib/controllers/visit.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isServerSideRender(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  // SSR или crawler-like user agent
  return /node\.js|vercel|next\.js|react-renderer/i.test(ua);
}

function isPrefetch(req: NextRequest) {
  const h = req.headers;
  return (
    h.get("purpose") === "prefetch" ||
    h.get("sec-purpose") === "prefetch" ||
    h.get("next-router-prefetch") === "1"
  );
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ shortId: string }> } 
): Promise<Response> {
  if (isPrefetch(request) || isServerSideRender(request)) {
    return new NextResponse(null, { status: 204 }); 
  }

  const { shortId } = await context.params;
  await dbConnect();
  const link = await Link.findOne({ shortId, isActive: true });
  const ip = request.headers.get("x-forwarded-for") ?? undefined;
  const ua = request.headers.get("user-agent") ?? undefined;

  await Promise.all([
    VisitController.addOne({ linkId: link._id, ip, userAgent: ua, creatorUserId: link.userId}),
    Link.updateOne({ _id: link._id }, { isActive: true, $inc: { clicks: 1 } }),
  ]);

  return NextResponse.redirect(link.originalUrl, { status: 302 });
}