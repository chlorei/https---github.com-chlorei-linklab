import { NextResponse } from "next/server";
import Link from "@/lib/db/models/Link";
import { Types } from "mongoose";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { linkIds } = await request.json();
  const { searchParams } = new URL(request.url);
  const projectid = searchParams.get("projectid");

  if (!projectid) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
  }

  try {
    const ids = linkIds.map((id: string) => new Types.ObjectId(id));

    const res = await Link.updateMany(
      { _id: { $in: ids } },
      { $set: { projectId: new Types.ObjectId(projectid) } }
    );

    return NextResponse.json({ ok: true, res }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}