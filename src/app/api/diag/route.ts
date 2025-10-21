// src/app/_diag/route.ts (временно)
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/dbConnect";
import Link from "@/lib/db/models/Link";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  await dbConnect();
  const url = new URL(req.url);
  const shortId = url.searchParams.get("id");
  if (!shortId) return NextResponse.json({ error: "id required" }, { status: 400 });

  const before = await Link.findOne({ shortId }).select("clicks shortId").lean();
  const upd = await Link.updateOne({ shortId }, { $inc: { clicks: 1 } });
  const after = await Link.findOne({ shortId }).select("clicks shortId").lean();

  return NextResponse.json({
    before, after,
    updateResult: {
      acknowledged: upd.acknowledged,
      matchedCount: (upd as any).matchedCount,
      modifiedCount: (upd as any).modifiedCount
    }
  });
}