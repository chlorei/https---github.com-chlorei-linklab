// src/app/[shortId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Link from "@/db/models/Link";
import Visit from "@/db/models/Visit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ shortId: string }> } // 👈 params — Promise
): Promise<Response> {
  const { shortId } = await context.params; // 👈 обязательно await
  await dbConnect();

  const link = await Link.findOne({ shortId, isActive: true });
  if (!link) {
    return NextResponse.json({ ok: false, error: "Not found", shortId }, { status: 404 });
  }

  const ip = request.headers.get("x-forwarded-for") ?? undefined;
  const ua = request.headers.get("user-agent") ?? undefined;

  // fire-and-forget, чтобы не блокировать редирект
  void Promise.allSettled([
    Visit.create({ linkId: link._id, ip, userAgent: ua }),
    Link.updateOne({ _id: link._id }, { $inc: { clicksCount: 1 } }),
  ]);

  return NextResponse.redirect(link.originalUrl, { status: 302 });
}