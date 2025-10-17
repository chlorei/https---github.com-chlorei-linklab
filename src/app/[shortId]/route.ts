// src/app/[shortId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/dbConnect";
import Link from "@/lib/db/models/Link";
import Visit from "@/lib/db/models/Visit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ shortId: string }> } 
): Promise<Response> {
  const { shortId } = await context.params; 
  await dbConnect();

  const link = await Link.findOne({ shortId, isActive: true });
 

  const ip = request.headers.get("x-forwarded-for") ?? undefined;
  const ua = request.headers.get("user-agent") ?? undefined;

  void Promise.allSettled([
    Visit.create({ linkId: link._id, ip, userAgent: ua}),
    Link.updateOne({ _id: link._id }, { $inc: { clicksCount: 1 } }),
  ]);

  
  return NextResponse.redirect(link.originalUrl, { status: 302 });
}